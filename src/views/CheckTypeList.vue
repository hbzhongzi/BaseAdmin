<template>
  <div class="check-type-page">
    <div class="toolbar">
      <el-form :model="filter" inline>
        <el-form-item label="关键词">
          <el-input v-model="filter.keyword" placeholder="输入类型名称" clearable />
        </el-form-item>
        <el-form-item label="来源">
          <el-select v-model="filter.type_source" placeholder="全部" style="width: 140px">
            <el-option label="全部" value="" />
            <el-option label="系统" value="1" />
            <el-option label="用户" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input v-model="filter.user_id" placeholder="0=系统" style="width: 140px" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filter.status" placeholder="全部" style="width: 120px">
            <el-option label="全部" value="" />
            <el-option label="启用" value="1" />
            <el-option label="禁用" value="0" />
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
      <el-table-column prop="check_type_name" label="打卡类型" />
      <el-table-column label="图标" width="100">
        <template #default="{ row }">
          <el-image
            :src="row.check_image"
            fit="cover"
            style="width: 72px; height: 72px"
            :preview-src-list="[row.check_image]"
          />
        </template>
      </el-table-column>
      <el-table-column prop="default_rule_id" label="默认规则ID" width="120" />
      <el-table-column label="来源" width="120">
        <template #default="{ row }">
          <el-tag type="info" v-if="row.type_source === 1">系统</el-tag>
          <el-tag type="warning" v-else>用户</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建者" width="100">
        <template #default="{ row }">
          <span>{{ row.user_id === 0 ? '管理员' : `用户${row.user_id}` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag type="success" v-if="row.status === 1">启用</el-tag>
          <el-tag type="danger" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="180" />
      <el-table-column prop="update_time" label="更新时间" width="180" />
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
import { listCheckTypes, CheckTypeItem } from '../api/checkType';

const list = ref<CheckTypeItem[]>([]);
const loading = ref(false);
const total = ref(0);

const filter = reactive({
  keyword: '',
  type_source: '',
  user_id: '',
  status: '',
  page: 1,
  page_size: 10
});

const fetchList = async () => {
  loading.value = true;
  try {
    const res = await listCheckTypes(filter);
    list.value = res.list;
    total.value = res.total;
  } catch (error) {
    console.error(error);
    ElMessage.error('打卡类型列表加载失败');
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
    keyword: '',
    type_source: '',
    user_id: '',
    status: '',
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
.check-type-page {
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
