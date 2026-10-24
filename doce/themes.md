---
title: "主题与布局风格"
summary: "布局多样化三层模型、src/theme/ 落地结构与使用规范"
read_when:
  - 新增主题、布局预设或切换逻辑时
related:
  - ./README.md
  - ./conventions.md
---

# 主题与布局风格

后台布局风格支持多样化，最终用户可自行选择并持久化偏好。主题能力分三层实现：设计令牌（CSS 变量）→ 布局预设（预设名 + class）→ 切换与持久化（localStorage）。主题设计和实现应遵循令牌、预设、原型、验收四个步骤：

| 步骤 | 产出 | 约束 |
| --- | --- | --- |
| 设计令牌 | 主色、语义色、间距、圆角、阴影和响应式变量 | 组件不得直接散落主题色值 |
| 交互原型 | `doce/examples/` 下可打开的静态示例 | 原型只用于选型，不进入生产构建 |
| 前端实现 | `presets.ts`、`tokens.css`、`useTheme.ts` 的同步变更 | 预设必须有唯一 id 和回退值 |
| 验收记录 | 构建结果、浏览器检查和文档更新 | 深色、窄屏、刷新持久化必须验证 |

## 风格示例

静态原型位于 [`examples/`](./examples/)，无构建依赖，浏览器直接打开即可比选：

| 文件 | 风格 | 特点 |
| --- | --- | --- |
| [`examples/index.html`](./examples/index.html) | 风格画廊（入口） | 6 种风格线框图总览 + 跳转 |
| [`examples/classic-dark.html`](./examples/classic-dark.html) | 经典深色侧栏 | 默认风格，深色渐变侧栏 + 白色顶栏 |
| [`examples/classic-light.html`](./examples/classic-light.html) | 经典浅色侧栏 | 白色侧栏 + 主色指示条，明亮轻快 |
| [`examples/top-nav.html`](./examples/top-nav.html) | 顶部横向菜单 | 无侧栏，菜单收纳顶栏，内容全宽 |
| [`examples/hybrid-dual.html`](./examples/hybrid-dual.html) | 双栏混合 | 图标轨 + 二级展开菜单，层级多时省空间 |
| [`examples/compact-card.html`](./examples/compact-card.html) | 现代极简卡片风 | 大圆角、柔和阴影、彩色图标切片 |
| [`examples/dark-mode.html`](./examples/dark-mode.html) | 深色模式 | 深色表面 + 高对比文字，可与任一布局叠加 |

每个示例页展示同一套工作台内容（统计卡 / 图表 / 列表），右下角浮窗可切换主色（写入 `localStorage`，键名 `memory-admin:preview-primary`），便于比选布局与配色组合。示例页仅用于选型，**不进入生产构建**；选定后按下方「使用规范」把对应令牌与预设实装到 `src/theme/`。部署期的默认模板配置与用户切换操作见 [`deployment.md`](./deployment.md)。

## 落地结构（`src/theme/`）

三层模型已实装，目录与职责如下：

| 层 | 文件 | 职责 |
| --- | --- | --- |
| 令牌 | `src/theme/tokens.css` | 主色板 5 套、语义令牌（含 `html.dark` 覆盖）、布局预设令牌（`.layout-*`）、布局与菜单皮肤、响应式 |
| 预设 | `src/theme/presets.ts` | 布局预设 5 种（含图标、是否可折叠）与主色预设 5 种，唯一事实来源 |
| 切换 | `src/theme/useTheme.ts` | 模块级单例状态：localStorage 读写、env 默认兜底、在 `html` 上挂 `data-primary` 与 `dark` class |
| 出口 | `src/theme/index.ts` | 统一导出，组件只从 `../theme` 引入 |

关键约定：

- **布局 class**：`TheLayout.vue` 根节点挂 `layout-<id>`（`classic-dark` / `classic-light` / `top-nav` / `hybrid-dual` / `compact-card`）；**深色模式为可叠加开关**，挂 `html.dark`（Element Plus 暗色变量已在 `main.ts` 引入）。
- **存储键**（统一 `memory-admin:` 前缀）：`memory-admin:layout`、`memory-admin:primary`、`memory-admin:dark`、`memory-admin:sidebar-collapsed`。
- **构建期默认值**：`.env.*` 的 `VITE_DEFAULT_LAYOUT` / `VITE_DEFAULT_PRIMARY`，合法值同预设 id，未设置回落 `classic-dark` / `blue`；修改后须重新 `npm run build`（见 [`deployment.md`](./deployment.md)「模板选择与配置」）。
- **切换入口**：后台顶栏的「布局」「配色」下拉、深色模式按钮，以及侧栏折叠按钮（仅可折叠布局显示）。
- **新增预设三步**：`presets.ts` 登记 → `tokens.css` 补 `.layout-<id>` 令牌与皮肤 → 同步本文件与 [`deployment.md`](./deployment.md)。

## 使用规范

1. 新增主题或布局风格前，先用「皮肤主题设计SOP」产出令牌与原型，再用「主题色深浅全色系生成器」确定主色与中性灰，最后按「主题换肤方案」落地实现。
2. 颜色、圆角、间距、字号必须走设计令牌（CSS 变量），组件内禁止硬编码色值；Element Plus 主题通过覆盖 `--el-*` 系列变量实现。
3. 布局风格以「预设名 + class」挂到布局根节点（`src/layout/TheLayout.vue`），预设清单集中在 `src/theme/` 维护，不在组件内散落条件判断。
4. 用户选择的主题/布局存入 `localStorage`，键名统一加 `memory-admin:` 前缀，与应用其他本地存储区分；刷新、重登后恢复，未选择时使用默认预设。
5. 修改主题令牌、新增预设或调整切换逻辑后，同步更新本文件及对应代码注释，并执行 `npm run build` 验证。
