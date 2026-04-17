<template>
  <div class="user-page">
    <div class="toolbar">
      <el-form :model="filter" inline>
        <el-form-item label="用户ID">
          <el-input v-model="filter.user_id" placeholder="输入用户ID" style="width: 150px" clearable />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="filter.user_name" placeholder="输入用户名" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filter.status" style="width: 120px">
            <el-option label="全部" value="" />
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="VIP">
          <el-select v-model="filter.is_vip" style="width: 120px">
            <el-option label="全部" value="" />
            <el-option label="VIP" value="1" />
            <el-option label="普通" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="已关注">
          <el-select v-model="filter.is_follow" style="width: 120px">
            <el-option label="全部" value="" />
            <el-option label="是" value="1" />
            <el-option label="否" value="0" />
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="searchList">搜索</el-button>
        <el-button @click="resetFilter">重置</el-button>
      </el-form>
    </div>

    <div class="toolbar">
      <el-button type="primary" @click="fetchList">刷新列表</el-button>
    </div>

    <el-table :data="list" v-loading="loading" stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="user_name" label="用户名" />
      <el-table-column label="头像" width="120">
        <template #default="{ row }">
          <el-image
            :src="row.user_image || ''"
            fit="cover"
            style="width: 60px; height: 60px"
            :preview-src-list="[row.user_image]"
          />
        </template>
      </el-table-column>
      <el-table-column label="已关注" width="120">
        <template #default="{ row }">
          <el-tag type="success" v-if="row.is_follow">是</el-tag>
          <el-tag v-else>否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="VIP" width="100">
        <template #default="{ row }">
          <el-tag type="warning" v-if="row.is_vip">VIP</el-tag>
          <el-tag v-else>普通</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag type="success" v-if="row.status === 1">启用</el-tag>
          <el-tag type="danger" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="180" />
    </el-table>

    <el-pagination
      background
      :current-page="filter.page"
      :page-size="filter.page_size"
      :total="total"
      layout="prev, pager, next"
      @current-change="handlePageChange"
      class="pagination"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { listUsers, UserItem } from '../api/user';

const list = ref<UserItem[]>([]);
const loading = ref(false);
const total = ref(0);

const filter = reactive({
  user_id: '',
  user_name: '',
  status: '',
  is_vip: '',
  is_follow: '',
  page: 1,
  page_size: 10
});

const fetchList = async () => {
  loading.value = true;
  try {
    const res = await listUsers(filter);
    list.value = res.list;
    total.value = res.total;
  } catch (error) {
    console.error(error);
    ElMessage.error('用户列表加载失败');
  } finally {
    loading.value = false;
  }
};

const searchList = () => {
  filter.page = 1;
  fetchList();
};

const resetFilter = () => {
  Object.assign(filter, {
    user_id: '',
    user_name: '',
    status: '',
    is_vip: '',
    is_follow: '',
    page: 1,
    page_size: 10
  });
  fetchList();
};

const handlePageChange = (page: number) => {
  filter.page = page;
  fetchList();
};

onMounted(fetchList);
</script>

<style scoped>
.user-page {
  padding: 20px;
}
.toolbar {
  margin-bottom: 16px;
}
.pagination {
  margin-top: 16px;
  text-align: right;
}
</style>
