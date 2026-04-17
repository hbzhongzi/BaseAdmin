<template>
  <div class="dashboard-page">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <div class="card-header">欢迎使用 MemoryAdmin</div>
          <p>这是一个基于 Element Plus 的简易后台首页。</p>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div class="card-header">统计信息</div>
          <el-statistic title="今日访问" value="1280" />
          <el-statistic title="活跃用户" value="328" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.dashboard-page {
  width: 100%;
}
.card-header {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}
</style>
