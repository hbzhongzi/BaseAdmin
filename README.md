# MemoryAdmin

一个基于 Vue 3 + Vite + Element Plus 的简易后台模板。

## 目录结构

```
MemoryAdmin/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── README.md
└── src/
    ├── assets/
    ├── components/
    │   └── SidebarMenu.vue
    ├── layout/
    │   └── TheLayout.vue
    ├── router/
    │   └── index.ts
    ├── views/
    │   ├── EventList.vue
    │   ├── UserList.vue
    │   ├── CheckTypeList.vue
    │   ├── CheckRuleList.vue
    │   ├── ImageResourceList.vue
    │   ├── MemberPackageList.vue
    │   └── Login.vue
    ├── App.vue
    ├── env.d.ts
    └── main.ts
```

## 命令行快速开始

```bash
cd MemoryAdmin
pnpm install
pnpm dev
```

## 组件引用说明

- `main.ts` 中引入 `element-plus` 样式并注册插件
- `router/index.ts` 中配置路由
- `TheLayout.vue` 中实现后台常见布局：侧边栏 + 头部 + 内容区域
- 各管理页面为具体业务模块：事件管理、用户管理、打卡类型、打卡规则、图片资源、会员套餐
- `Login.vue` 为登录页面

## 说明

该模板适合作为中小型后台管理系统的起点，使用 Element Plus 快速构建页面组件。
