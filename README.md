# BaseAdmin

Vue 3 + TypeScript 管理后台模板，配套 ThinkPHP 风格的 PHP 管理员认证与权限接口示例。项目提供可复用的登录、布局、主题、请求封装和单管理员权限基础，适合作为新后台项目的起点。

> 项目概览和快速启动见本文；完整的安装、配置、接口、数据库、开发规范与部署说明统一从 [`doce/README.md`](./doce/README.md) 进入。框架优化路线和阶段规划见 [`middoce/README.md`](./middoce/README.md)。

## 功能概览

- Vue 3、TypeScript、Vite、Vue Router 和 Element Plus 前端基础。
- 登录、退出、当前管理员信息查询，以及请求头 token 注入和刷新重试。
- 请求超时与取消处理，并区分未登录（401）和权限不足（403）。
- 五种后台布局、五种主色和深色模式，用户偏好保存在浏览器本地。
- 前端路由权限元信息、`v-permission` 指令和权限字典示例页。
- PHP 示例包括管理员认证、鉴权与权限中间件、权限字典接口和 ThinkPHP 风格路由。
- 管理员基础表及直接绑定管理员的权限扩展 SQL；当前不实现多角色 RBAC。

## 技术栈

| 部分 | 技术 |
| --- | --- |
| 前端 | Vue 3、TypeScript、Vite、Vue Router、Element Plus |
| 后端示例 | PHP，ThinkPHP 风格控制器、逻辑层、中间件和路由 |
| 数据库示例 | MySQL 管理员表及管理员权限关联表 |

## 快速开始

要求 Node.js 18+、npm 9+。

```bash
npm ci
npm run dev
```

开发地址为 `http://localhost:5173/admin/`。API 默认请求同源 `/api/admin/...`；若后端 API 使用独立地址，可在本地环境配置中设置：

```dotenv
VITE_API_BASE_URL=http://localhost:1000
```

常用命令：

```bash
npm run build    # TypeScript 检查并构建生产文件到 dist/
npm run preview  # 本地预览生产构建
```

## 目录概览

```text
src/                  Vue 前端：API、认证状态、路由、布局、主题和页面
Tdatabase/            管理员基础表与权限扩展 SQL
textcode/php/admin/   PHP 后端接口与 ThinkPHP 风格接入示例
doce/                 框架安装、使用、开发规范和部署文档
middoce/              优化路线和开发规划
```

## 接入提示

- `textcode/php/admin/` 是接入示例，不是独立可运行的 PHP 应用；合并到目标 ThinkPHP 项目时需按其版本和模块结构调整。
- PHP 用户控制器仅作扩展示例，依赖模板未提供的用户业务逻辑和用户表。
- [`Tdatabase/admin_user.sql`](./Tdatabase/admin_user.sql) 含 `DROP TABLE`，仅用于空库首次安装或明确重建；生产执行前必须备份并确认目标库。
- [`Tdatabase/admin_access.sql`](./Tdatabase/admin_access.sql) 为增量权限表脚本，不删除管理员基础表。
- 前端菜单和按钮权限只影响展示；所有业务 API 必须在服务端鉴权并校验权限。
- 不要将真实凭据或密钥放入前端 `VITE_*` 环境变量。

## 文档入口

- 框架使用手册：[`doce/README.md`](./doce/README.md)
- 优化与开发规划：[`middoce/README.md`](./middoce/README.md)
