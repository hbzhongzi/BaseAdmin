<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>权限字典</span>
        <el-button :loading="loading" @click="loadPermissions">刷新</el-button>
      </div>
    </template>

    <el-table v-loading="loading" :data="items" stripe>
      <el-table-column prop="code" label="权限编码" min-width="180" />
      <el-table-column prop="name" label="名称" min-width="140" />
      <el-table-column prop="type" label="类型" width="110" />
      <el-table-column prop="path" label="路径" min-width="220" />
      <el-table-column prop="status" label="状态" width="90">
        <template #default="{ row }">
          <el-tag type="success">{{ row.status === 1 ? '启用' : '停用' }}</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-if="!loading && items.length === 0" description="暂无权限数据" />
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { listPermissions, type AdminPermission } from '../api/permissions';

const items = ref<AdminPermission[]>([]);
const loading = ref(false);

async function loadPermissions() {
  loading.value = true;
  try {
    items.value = await listPermissions();
  } finally {
    loading.value = false;
  }
}

onMounted(loadPermissions);
</script>

<style scoped>
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
