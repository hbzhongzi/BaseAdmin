---
title: "PHP 认证接口约定"
summary: "管理员认证接口的路径、鉴权方式、请求字段与响应信封"
read_when:
  - 对接登录、刷新、退出或获取当前管理员接口时
related:
  - ./database.md
  - ./conventions.md
---

# PHP 认证接口约定

PHP 示例位于 [`textcode/php/admin/`](../textcode/php/admin/)。把代码合并进目标项目，不要覆盖项目已有路由配置。

接口返回 JSON 信封 `{ code, msg, data }`：`code=1` 成功、`code=0` 一般业务失败。未认证或 token 失效时同时返回业务码 `401` 和 HTTP `401`；权限不足使用业务码/HTTP `403`。

| 方法 | 路径 | 鉴权 | 用途 |
| --- | --- | --- | --- |
| POST | `/api/admin/auth/login` | 否 | JSON `{ "username": "...", "password": "..." }`；成功返回 `data.token`、`data.expire_time` |
| POST | `/api/admin/auth/refresh` | 是 | 轮换当前有效 token |
| POST | `/api/admin/auth/logout` | 是 | 撤销当前 token |
| GET | `/api/admin/auth/me` | 是 | 返回当前管理员 `id`、`username`、`permissions` |
| GET | `/api/admin/permissions` | `permission:list` | 返回已启用权限字典，作为权限管理页面示例 |

鉴权支持两种请求头：

- `Authorization: Bearer <token>`
- `authadmintoken: <token>`（前端模板默认使用）

认证接口路径、字段及响应结构已与 `src/api/auth.ts` 对齐；改动任一侧必须同步另一侧。

`me` 接口返回的权限编码用于前端菜单和 `v-permission` 指令展示控制，但不能替代服务端权限中间件。服务端业务接口必须再次校验同名权限。

路由示例见 [`textcode/php/admin/route/route/app.php`](../textcode/php/admin/route/route/app.php)：`AdminPermission` 接收权限编码参数，例如 `permission:list`。新增业务接口时，应在路由层或控制器层接入该中间件，并在 `admin_user_permission` 中为管理员绑定对应权限。

前端将认证失败（401）跳转到登录页，将权限不足（403）保留当前会话并显示 403 页面；两者不能混为一谈。

登录接口按 IP 与用户名组合进行失败次数限制：连续失败达到 5 次后，窗口期内拒绝继续登录。生产环境还应在网关或应用层增加更严格的限流、审计和异常告警。
