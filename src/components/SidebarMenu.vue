<template>
  <!-- 菜单皮肤（颜色/圆角/交互）见 src/theme/tokens.css「侧栏菜单皮肤」节；
       本组件只负责按 mode 渲染竖排 / 横排 / 图标轨三种形态。 -->
  <el-menu
    :default-active="'/'"
    :mode="menuMode"
    :collapse="isCollapsed"
    :class="['sidebar-menu', { 'top-nav-menu': mode === 'horizontal' }]"
    background-color="transparent"
    text-color="var(--side-text)"
    active-text-color="var(--side-text-active)"
    router
  >
    <el-menu-item v-for="item in visibleMenuItems" :key="item.index" :index="item.index">
      <el-icon><component :is="item.icon" /></el-icon>
      <template #title>{{ item.title }}</template>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { hasPermission } from '../auth/session';

export interface AppMenuItem {
  /** 路由路径，同时作为菜单项 index */
  index: string;
  title: string;
  /** 图标组件名（main.ts 已全局注册） */
  icon: string;
  /** 可选的前端展示权限；服务端仍必须校验 */
  permission?: string;
}

const props = withDefaults(
  defineProps<{
    /** vertical=侧栏竖排；horizontal=顶栏横排；icon=仅图标轨 */
    mode?: 'vertical' | 'horizontal' | 'icon';
    /** 侧栏折叠态（仅 vertical 生效） */
    collapsed?: boolean;
  }>(),
  { mode: 'vertical', collapsed: false },
);

/** 菜单项集中维护：新增页面时在此登记（图标名见 @element-plus/icons-vue） */
const menuItems: AppMenuItem[] = [
  { index: '/', title: '工作台', icon: 'HomeFilled' },
  { index: '/permissions', title: '权限字典', icon: 'Lock', permission: 'permission:list' },
];

const visibleMenuItems = computed(() =>
  menuItems.filter((item) => !item.permission || hasPermission(item.permission)),
);

const menuMode = computed(() => (props.mode === 'horizontal' ? 'horizontal' : 'vertical'));
const isCollapsed = computed(() => props.collapsed || props.mode === 'icon');
</script>
