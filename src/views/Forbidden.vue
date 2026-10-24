<template>
  <el-result icon="warning" title="403" sub-title="你没有访问此页面的权限">
    <template #extra>
      <el-button type="primary" @click="goHome">返回工作台</el-button>
    </template>
  </el-result>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
const goHome = () => router.push('/');
</script>
