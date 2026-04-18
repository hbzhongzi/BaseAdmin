<template>
  <div class="image-resource-page">
    <div class="toolbar">
      <el-form :model="filter" inline>
        <el-form-item label="类型">
          <el-select v-model="filter.type" placeholder="全部" style="width: 160px">
            <el-option label="全部" value="" />
            <el-option label="背景图" value="1" />
            <el-option label="打卡图标" value="2" />
            <el-option label="纪念图" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input v-model="filter.user_id" placeholder="0=系统资源" style="width: 160px" clearable />
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="filter.keyword" placeholder="按名称搜索" clearable />
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
      <el-table-column prop="name" label="名称" />
      <el-table-column label="图片" width="120">
        <template #default="{ row }">
          <el-image
            :src="row.url"
            fit="cover"
            style="width: 72px; height: 72px"
            :preview-src-list="[row.url]"
          />
        </template>
      </el-table-column>
      <el-table-column label="类型" width="120">
        <template #default="{ row }">
          <el-tag type="success" v-if="row.type === 1">背景图</el-tag>
          <el-tag type="warning" v-else-if="row.type === 2">打卡图标</el-tag>
          <el-tag type="info" v-else>纪念图</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="size" label="大小" width="100">
        <template #default="{ row }">
          <span>{{ formatSize(row.size) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建者" width="100">
        <template #default="{ row }">
          <span>{{ row.user_id === 0 ? '管理员' : `用户${row.user_id}` }}</span>
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
import { listImageResources, ImageResourceItem } from '../api/imageResource';

const list = ref<ImageResourceItem[]>([]);
const loading = ref(false);
const total = ref(0);

const filter = reactive({
  type: '',
  user_id: '',
  keyword: '',
  page: 1,
  page_size: 10
});

const fetchList = async () => {
  loading.value = true;
  try {
    const res = await listImageResources(filter);
    list.value = res.list;
    total.value = res.total;
  } catch (error) {
    console.error(error);
    ElMessage.error('图片资源加载失败');
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
    type: '',
    user_id: '',
    keyword: '',
    page: 1,
    page_size: 10
  });
  fetchList();
};

const handlePageChange = (page: number) => {
  filter.page = page;
  fetchList();
};

const formatSize = (size: number) => {
  if (!size) return '0 KB';
  return size < 1024 ? `${size} B` : `${(size / 1024).toFixed(1)} KB`;
};

onMounted(fetchList);
</script>

<style scoped>
.image-resource-page {
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
