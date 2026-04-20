<template>
  <el-container style="height: 100vh;">
    <el-aside width="240px" class="app-aside">
      <div class="brand">
        <i class="el-icon-s-home"></i>
        MemoryAdmin
      </div>
      <SidebarMenu />
    </el-aside>

    <el-container>
      <el-header class="app-header">
        <div class="header-content">
          <h3>后台管理系统</h3>
          <div class="header-actions">
            <el-button type="text" @click="handleLogout" v-if="isLoggedIn">
              <i class="el-icon-switch-button"></i>
              退出登录
            </el-button>
          </div>
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
import { AUTH_TOKEN_KEY } from '../api/request';

const router = useRouter();

const isLoggedIn = computed(() => {
  return !!localStorage.getItem(AUTH_TOKEN_KEY);
});

const handleLogout = async () => {
  await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  });

  localStorage.removeItem(AUTH_TOKEN_KEY);
  router.push('/login');
};
</script>

<style scoped>
.app-aside {
  background: linear-gradient(180deg, #304156 0%, #2b3742 100%);
  color: #fff;
  padding: 20px 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
}

.brand {
  text-align: center;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.brand i {
  font-size: 24px;
  color: #409eff;
}

.app-header {
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  padding: 0 24px;
  border-bottom: 1px solid #e6e6e6;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header-content h3 {
  margin: 0;
  color: #303133;
  font-size: 18px;
  font-weight: 500;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.app-main {
  padding: 24px;
  background: #f5f7fa;
  overflow-y: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-aside {
    width: 200px !important;
  }

  .app-header {
    padding: 0 16px;
  }

  .header-content h3 {
    font-size: 16px;
  }

  .app-main {
    padding: 16px;
  }
}
</style>
