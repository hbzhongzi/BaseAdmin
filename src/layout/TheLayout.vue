<template>
  <!-- 布局预设 class（layout-*）由 useTheme 驱动，皮肤变量见 src/theme/tokens.css -->
  <el-container class="app-shell" :class="`layout-${layout}`">
    <!-- 侧栏布局：经典深色 / 经典浅色 / 现代极简卡片 -->
    <el-aside v-if="showSide" :width="asideWidth" class="app-aside">
      <div class="brand">
        <el-icon><HomeFilled /></el-icon>
        <span v-show="!sidebarCollapsed" class="brand-name">MemoryAdmin</span>
      </div>
      <SidebarMenu :collapsed="sidebarCollapsed" />
    </el-aside>

    <!-- 双栏混合：图标轨 + 二级菜单列 -->
    <template v-if="layout === 'hybrid-dual'">
      <el-aside width="64px" class="app-rail">
        <div class="brand brand-rail">
          <el-icon><HomeFilled /></el-icon>
        </div>
        <SidebarMenu mode="icon" />
      </el-aside>
      <el-aside width="200px" class="app-submenu">
        <div class="submenu-title">导航菜单</div>
        <SidebarMenu />
      </el-aside>
    </template>

    <el-container>
      <el-header class="app-header">
        <div class="header-left">
          <el-tooltip
            v-if="collapsible"
            :content="sidebarCollapsed ? '展开侧栏' : '收起侧栏'"
            placement="bottom"
          >
            <el-icon class="collapse-trigger" @click="toggleSidebar">
              <Expand v-if="sidebarCollapsed" />
              <Fold v-else />
            </el-icon>
          </el-tooltip>
          <span v-if="layout === 'top-nav'" class="header-brand">MemoryAdmin</span>
          <h3 v-else class="header-title">后台管理系统</h3>
          <SidebarMenu v-if="layout === 'top-nav'" mode="horizontal" />
        </div>

        <div class="header-actions">
          <!-- 布局切换 -->
          <el-dropdown trigger="click" @command="setLayout">
            <el-button type="text" class="theme-action">
              <el-icon><Grid /></el-icon>
              <span class="action-label">布局</span>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="preset in layoutPresets"
                  :key="preset.id"
                  :command="preset.id"
                  :disabled="preset.id === layout"
                >
                  <el-icon><component :is="preset.icon" /></el-icon>
                  <span class="dropdown-label">{{ preset.label }}</span>
                  <span class="dropdown-desc">{{ preset.description }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <!-- 主色切换 -->
          <el-dropdown trigger="click" @command="setPrimary">
            <el-button type="text" class="theme-action">
              <el-icon><Brush /></el-icon>
              <span class="action-label">配色</span>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="preset in primaryPresets"
                  :key="preset.id"
                  :command="preset.id"
                  :disabled="preset.id === primary"
                >
                  <span class="color-dot" :style="{ background: preset.color }" />
                  <span class="dropdown-label">{{ preset.label }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <!-- 深色模式 -->
          <el-tooltip :content="dark ? '切换到浅色模式' : '切换到深色模式'" placement="bottom">
            <el-button type="text" class="theme-action" @click="toggleDark">
              <el-icon><Sunny v-if="dark" /><Moon v-else /></el-icon>
            </el-button>
          </el-tooltip>

          <el-button type="text" @click="handleLogout" v-if="isLoggedIn">
            <el-icon><SwitchButton /></el-icon>
            退出登录
          </el-button>
        </div>
      </el-header>

      <el-main class="app-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import SidebarMenu from '../components/SidebarMenu.vue';
import { logout } from '../api/auth';
import { isAuthenticated } from '../auth/session';
import { useTheme, LAYOUT_PRESETS, PRIMARY_PRESETS } from '../theme';

const router = useRouter();

const {
  layout,
  primary,
  dark,
  sidebarCollapsed,
  setLayout,
  setPrimary,
  toggleDark,
  toggleSidebar,
} = useTheme();

/** 是否渲染完整侧栏（顶栏菜单与双栏混合布局不用此结构） */
const showSide = computed(
  () => layout.value !== 'top-nav' && layout.value !== 'hybrid-dual',
);

/** 当前布局是否提供侧栏折叠（来自预设清单，不在此散落判断） */
const collapsible = computed(
  () => LAYOUT_PRESETS.find((preset) => preset.id === layout.value)?.collapsible ?? false,
);

const asideWidth = computed(() => (sidebarCollapsed.value ? '64px' : '240px'));

const isLoggedIn = computed(() => {
  return isAuthenticated.value;
});

const handleLogout = async () => {
  await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  });

  try {
    await logout();
  } finally {
    await router.push('/login');
  }
};
</script>

<style scoped>
/* 只放结构样式；颜色 / 圆角 / 阴影等皮肤一律走 src/theme/tokens.css 变量 */
.app-shell {
  height: 100vh;
}

.header-left {
  display: flex;
  align-items: center;
  min-width: 0;
}

.header-title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.header-brand {
  font-size: 18px;
  font-weight: bold;
  white-space: nowrap;
}

.collapse-trigger {
  margin-right: 12px;
  font-size: 20px;
  cursor: pointer;
  color: var(--text-secondary);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.theme-action {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.color-dot {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin-right: 8px;
}

.dropdown-label {
  margin-left: 8px;
}

.dropdown-desc {
  margin-left: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}
</style>
