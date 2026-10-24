---
title: "部署"
summary: "模板选择与配置、构建配置、API 地址、/admin/ 与根路径部署及发布检查清单"
read_when:
  - 上线发布或调整部署路径时
  - 需要为用户配置默认模板或切换模板时
related:
  - ./getting-started.md
  - ./auth-api.md
  - ./themes.md
---

# 部署

## 构建与 API 配置

```bash
npm ci
npm run build
```

生产环境构建前可在根目录 `.env.production` 设置：

```dotenv
VITE_API_BASE_URL=https://api.example.com
```

未设置时请求同源 `/api/admin/...`。使用 HTTPS，并通过 CORS 或反向代理允许管理端访问 PHP API。

## 模板选择与配置

布局风格由三层决定：**画廊选型（部署前）→ 构建期默认值（环境变量）→ 运行期用户偏好（localStorage）**。按以下顺序操作。

### 1. 选型（部署前）

1. 用浏览器打开 `doce/examples/index.html` 风格画廊，比选 6 种布局：经典深色侧栏、经典浅色侧栏、顶部横向菜单、双栏混合、现代极简卡片风、深色模式。
2. 进入候选风格页，用右下角浮窗切换主色，确认布局与配色的组合效果。
3. 记下选定的**布局预设名**与**主色名**，用于下一步配置：

| 布局预设名（`VITE_DEFAULT_LAYOUT`） | 主色名（`VITE_DEFAULT_PRIMARY`） |
| --- | --- |
| `classic-dark` / `classic-light` / `top-nav` / `hybrid-dual` / `compact-card` / `dark-mode` | `blue` / `green` / `orange` / `purple` / `red` |

### 2. 配置默认模板（构建期）

在根目录 `.env.production` 中追加（与 `VITE_API_BASE_URL` 同文件）：

```dotenv
VITE_DEFAULT_LAYOUT=classic-dark
VITE_DEFAULT_PRIMARY=blue
```

| 变量 | 说明 |
| --- | --- |
| `VITE_DEFAULT_LAYOUT` | 用户未设置偏好时的默认布局预设 |
| `VITE_DEFAULT_PRIMARY` | 用户未设置偏好时的默认主色 |

环境变量在**构建时**写入静态资源，修改后必须重新执行 `npm run build` 才生效。

### 3. 用户切换（运行期）

- 最终用户可在后台内自行切换布局与主色，偏好写入 `localStorage`，键名为 `memory-admin:layout` 与 `memory-admin:primary`，与应用其他本地存储区分。
- 刷新页面、重新登录后偏好保持不变；未设置过偏好的用户回落到第 2 步的构建期默认值。
- 恢复默认：清除上述两个键（或在设置页使用「恢复默认」）即可。

### 4. 重置画廊选型记录（可选）

示例画廊页的主色记忆键为 `memory-admin:preview-primary`，只影响选型预览，与生产环境的 `memory-admin:*` 偏好键互不干扰；清理该键即可重置选型记录。

## 部署到 `/admin/`

Vite `base` 当前配置为 `/admin/`。将 `dist/` 内容发布到站点 `/admin/` 目录，并配置前端 history 回退：

```nginx
location /admin/ {
    alias /var/www/html/admin/;
    index index.html;
    try_files $uri $uri/ /admin/index.html;
}
```

`/api/admin/` 必须单独转发到 PHP，不能回退到前端 `index.html`。PHP `Index` 控制器仅适用于 ThinkPHP 同时托管 `public/admin/index.html` 的方式；静态文件若由 Nginx 托管，可不启用 PHP 的 SPA 回退路由。

## 部署到域名根路径

将 `vite.config.ts` 的 `base` 改为 `/` 后重新构建，Web 服务器配置 `try_files $uri $uri/ /index.html;`，并确保 API 路径优先转发至 PHP，不被 SPA 回退规则截获。

## 发布检查

- 数据库已备份并导入结构，已通过安全方式初始化管理员账号。
- 已在 `doce/examples/` 画廊完成模板选型；`.env.production` 的 `VITE_DEFAULT_LAYOUT` / `VITE_DEFAULT_PRIMARY` 与选型结果一致，且改后已重新构建。
- 生产 API 地址和跨域/代理规则正确；认证 API 返回 JSON，而不是前端 HTML。
- 登录、退出、刷新深层前端路由正常，站点启用 HTTPS。
- 布局切换、主色切换、偏好持久化（刷新/重登后恢复）正常。
- 只发布 `dist/` 静态产物，无需上传 `node_modules/`。
