<template>
  <el-container style="height: 100vh;">
    <el-aside width="220px" class="app-aside">
      <div class="brand">MemoryAdmin</div>
      <SidebarMenu />
    </el-aside>

    <el-container>
      <el-header class="app-header">
        <div>后台管理系统</div>
      </el-header>
      <el-main class="app-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import SidebarMenu from '../components/SidebarMenu.vue';
</script>

<style scoped>
.app-aside {
  background: #304156;
  color: #fff;
  padding: 20px 0;
}
.brand {
  text-align: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}
.app-header {
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  padding: 0 24px;
}
.app-main {
  padding: 24px;
  background: #f5f7fa;
}
</style>
