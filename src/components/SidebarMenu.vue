<template>
  <el-menu
    default-active="Dashboard"
    class="sidebar-menu"
    background-color="transparent"
    text-color="#ccc"
    active-text-color="#fff"
    router
  >
    <el-menu-item index="/">
      <template #title>
        <i class="el-icon-menu"></i>
        <span>仪表盘</span>
      </template>
    </el-menu-item>
    <el-menu-item index="/events">
      <template #title>
        <i class="el-icon-date"></i>
        <span>事件管理</span>
      </template>
    </el-menu-item>
    <el-menu-item index="/users">
      <template #title>
        <i class="el-icon-user"></i>
        <span>用户管理</span>
      </template>
    </el-menu-item>
    <el-menu-item index="/check-types">
      <template #title>
        <i class="el-icon-document"></i>
        <span>打卡类型</span>
      </template>
    </el-menu-item>
    <el-menu-item index="/image-resources">
      <template #title>
        <i class="el-icon-picture"></i>
        <span>图片资源</span>
      </template>
    </el-menu-item>
    <el-menu-item index="/member-packages">
      <template #title>
        <i class="el-icon-price-tag"></i>
        <span>会员套餐</span>
      </template>
    </el-menu-item>
    <el-menu-item index="/login">
      <template #title>
        <i class="el-icon-user"></i>
        <span>登录页</span>
      </template>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts"></script>

<style scoped>
.sidebar-menu {
  border: none;
}
.el-menu-item {
  margin: 5px 12px;
}
</style>
