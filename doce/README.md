---
title: "MemoryAdmin 文档索引"
summary: "项目文档主入口：概览、目录结构、文档地图与全局约定"
read_when:
  - 首次了解项目
  - 不确定该读哪份文档时
---

# MemoryAdmin 文档索引

MemoryAdmin 是基于 Vue 3、TypeScript、Vite、Vue Router 和 Element Plus 的后台管理模板，配套 ThinkPHP 风格的 PHP 管理员认证接口示例及基础管理员数据表。

本文件是框架使用文档的**主入口（索引）**，不承载细节；具体内容按模块拆分到同目录各文件，见下方文档地图。优化路线和开发规划单独维护在 [`../middoce/README.md`](../middoce/README.md)。

## 目录结构

```text
BaseAdmin/
├── src/                         前端应用
│   ├── api/                     请求封装与 API 模块
│   ├── auth/                    token 与当前管理员状态
│   ├── components/              通用组件与侧边导航
│   ├── directives/              权限等全局指令
│   ├── layout/                  后台布局
│   ├── router/                  路由与前端登录态守卫
│   ├── theme/                   主题令牌、预设清单与切换逻辑
│   ├── views/                   登录与业务页面
│   └── styles/                  全局样式
├── Tdatabase/admin_user.sql     管理员基础表结构
├── Tdatabase/admin_access.sql   单管理员权限及关联表
├── textcode/php/admin/          PHP 控制器、逻辑、模型、中间件与路由示例
└── doce/                        项目文档（本目录）
    ├── README.md               文档索引（主入口）
    ├── getting-started.md      环境与启动
    ├── conventions.md          开发与使用规范
    ├── auth-api.md             PHP 认证接口约定
    ├── database.md             数据库与管理员初始化
    ├── themes.md               主题与布局风格
    ├── examples/               布局风格静态示例（选型用，非生产）
    └── deployment.md           部署
├── middoce/                    优化与开发规划（非使用手册）
    ├── README.md               优化文档索引
    └── optimization-roadmap.md 分阶段优化路线与验收标准
```

## 文档地图

| 文件 | 主题 | 何时读 |
| --- | --- | --- |
| [`getting-started.md`](./getting-started.md) | 环境要求、安装启动、常用命令、环境变量 | 第一次跑起项目、配置 API 地址时 |
| [`conventions.md`](./conventions.md) | 安全基线、前端/PHP 扩展规范、文档维护规则 | 新增页面、API 模块、控制器或改开发流程时 |
| [`auth-api.md`](./auth-api.md) | 认证接口路径、字段、信封与鉴权头 | 对接登录/退出/刷新/me 接口时 |
| [`database.md`](./database.md) | `admin_user` 表结构与管理员初始化 | 建库、导表、初始化账号时 |
| [`themes.md`](./themes.md) | 主题三层模型、`src/theme/` 落地结构、存储键与使用规范 | 新增主题、布局预设或切换逻辑时 |
| [`deployment.md`](./deployment.md) | 模板选择与配置、构建、API 配置、`/admin/` 与根路径部署、发布检查 | 上线发布前、为用户配置默认模板时 |

> 需要比选布局风格时，直接打开 [`examples/index.html`](./examples/index.html) 风格画廊（静态原型，无需构建）。

## 快速命令

```bash
npm ci           # 安装依赖
npm run dev      # 本地开发（http://localhost:5173/admin/）
npm run build    # TypeScript 检查并构建生产产物
npm run preview  # 本地预览 dist
```

## 全局约定

1. **文档按模块拆分**：每个主题一个文件，单文件聚焦单一主题，避免无限膨胀；新增文档须登记到上方「文档地图」。
2. **入口唯一**：根目录 `README.md` 仅指向本文件；对外说明以 `doce/README.md` 为索引，不新建平行入口。
3. **安全基线**：前端路由守卫只负责页面访问体验，不提供后端安全保障；所有受保护 API 必须在服务器校验 token 和权限。详见 [`conventions.md`](./conventions.md)。
4. **改后必验证**：前端修改至少执行 `npm run build`；PHP 文件使用 `php -l` 检查语法。
5. **禁入密钥**：生产代码不提交真实密码、token、私钥或环境专属配置；环境地址用 `.env.local` / `.env.production` 管理，密钥只放后端。
6. **当前实施进度**：阶段性优化任务见 [`../middoce/optimization-roadmap.md`](../middoce/optimization-roadmap.md)；本目录只维护框架使用和接入说明。
