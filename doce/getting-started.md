---
title: "环境与启动"
summary: "环境要求、安装、开发服务器、常用命令与环境变量"
read_when:
  - 第一次搭建或运行项目
  - 需要连接独立 API 服务或调整环境变量时
related:
  - ./README.md
  - ./deployment.md
---

# 环境与启动

## 环境要求

- Node.js 18+
- npm 9+

## 安装与启动

在项目根目录运行：

```bash
npm ci
npm run dev
```

开发服务器地址：`http://localhost:5173/admin/`（Vite `base` 为 `/admin/`，启动后自动打开浏览器）。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 本地开发 |
| `npm run build` | TypeScript 检查并构建生产产物 |
| `npm run preview` | 本地预览 `dist/` |

## 环境变量

API 默认请求同源 `/api/admin/...`。如需连接独立 API 服务，在根目录创建 `.env.local`：

```dotenv
VITE_API_BASE_URL=http://localhost:1000
```

注意：

- 环境变量会在**构建时**写入静态资源，更改生产 API 地址后必须重新构建。
- 不要把密钥写入 `VITE_*` 环境变量（会进入前端产物）；密钥只放后端。
