---
title: "数据库与管理员初始化"
summary: "admin_user 表结构、导入警告与管理员账号初始化规则"
read_when:
  - 建库、导入表结构或初始化管理员账号时
related:
  - ./auth-api.md
  - ./README.md
---

# 数据库与管理员初始化

基础表脚本：[`Tdatabase/admin_user.sql`](../Tdatabase/admin_user.sql)。**脚本含有 `DROP TABLE IF EXISTS admin_user`，会删除同名表及其数据；只可用于空库/首次安装或明确重建，严禁直接在有数据的生产库执行。** 导入前先备份并确认数据库。

## 表结构 `admin_user`

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | int UNSIGNED 自增 | 主键 |
| `username` | varchar(50) 唯一索引 | 用户名 |
| `password` | varchar(255) | 密码（bcrypt 哈希） |
| `api_token` | varchar(64) 默认空串 | 后台登录 token |
| `token_expire_time` | int 默认 0 | token 过期时间（Unix 秒） |
| `status` | int 默认 1 | 状态：1 正常 / 0 禁用 |
| `last_login_ip` | varchar(50) | 最后登录 IP |
| `last_login_time` | int 默认 0 | 最后登录时间（Unix 秒） |
| `create_time` | int | 创建时间（Unix 秒） |

存储引擎 InnoDB，字符集 utf8mb4 / `utf8mb4_unicode_ci`。

## 初始化管理员账号

脚本只创建结构，不创建默认管理员。初始化账号时：

- `password` 必须写入 `password_hash($plainPassword, PASSWORD_BCRYPT)` 生成的哈希，禁止明文保存。
- `create_time`、`last_login_time`、`token_expire_time` 使用 Unix 秒级时间戳。
- ThinkPHP 数据库连接应指向导入该表的库，并确认表前缀配置与 `admin_user` 相符。

## Token 机制

示例使用 `api_token` 和 `token_expire_time` 作为数据库认证状态来源，每个管理员账号仅保留一个有效 token。登录签发 24 小时 token 并替换该账号旧 token；退出清空 token。若项目改用 Redis/缓存，须同时改造签发、校验、刷新和退出逻辑，不可混用存储方案。

## 单管理员权限扩展

当前版本暂不引入多角色，权限直接绑定管理员账号。增量脚本：[`Tdatabase/admin_access.sql`](../Tdatabase/admin_access.sql)。该脚本不会删除 `admin_user`，用于新增权限及管理员权限关联表：

- `admin_permission`：页面、接口或操作权限编码。
- `admin_user_permission`：管理员与权限关联。

推荐权限编码格式为 `资源:动作`，例如 `user:list`、`user:create`、`user:delete`。权限表尚未安装或关联数据不存在时，管理员仍可通过认证接口，但业务权限默认拒绝；初始化时直接向管理员绑定权限编码对应的权限记录。

示例（将 `1` 替换为实际管理员 ID；时间戳按部署时生成）：

```sql
INSERT INTO admin_permission (code, name, type, path, status, create_time)
VALUES ('user:list', '用户列表', 'api', '/api/admin/users', 1, UNIX_TIMESTAMP())
ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status);

INSERT IGNORE INTO admin_user_permission (user_id, permission_id)
SELECT 1, id FROM admin_permission WHERE code = 'user:list' AND status = 1;
```

业务路由使用 `AdminPermission` 中间件时传入同名编码；前端菜单和 `v-permission` 只负责展示，服务端校验才是最终权限边界。
