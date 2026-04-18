<template>
  <div class="member-package-page">
    <div class="toolbar">
      <el-form :model="filter" inline>
        <el-form-item label="状态">
          <el-select v-model="filter.status" placeholder="全部" style="width: 120px">
            <el-option label="全部" value="" />
            <el-option label="上架" value="1" />
            <el-option label="下架" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="filter.keyword" placeholder="按套餐描述搜索" clearable />
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
      <el-table-column prop="combo_text" label="套餐描述" />
      <el-table-column prop="original_price" label="原价" width="100">
        <template #default="{ row }">
          <span>¥{{ row.original_price }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="now_price" label="现价" width="100">
        <template #default="{ row }">
          <span>¥{{ row.now_price }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="discount" label="折扣" width="100">
        <template #default="{ row }">
          <span>{{ row.discount }}折</span>
        </template>
      </el-table-column>
      <el-table-column prop="combo" label="天数" width="100">
        <template #default="{ row }">
          <span>{{ row.combo === 99999 ? '终身' : row.combo + '天' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag type="success" v-if="row.status === 1">{{ row.status_text }}</el-tag>
          <el-tag type="danger" v-else>下架</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" width="100" />
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
import { listMemberPackages, MemberPackageItem } from '../api/memberPackage';

const list = ref<MemberPackageItem[]>([]);
const loading = ref(false);
const total = ref(0);

const filter = reactive({
  status: '',
  keyword: '',
  page: 1,
  page_size: 10
});

const fetchList = async () => {
  loading.value = true;
  try {
    const res = await listMemberPackages(filter);
    list.value = res.list;
    total.value = res.total;
  } catch (error) {
    console.error(error);
    ElMessage.error('套餐列表加载失败');
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
    status: '',
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

onMounted(fetchList);
</script>

<style scoped>
.member-package-page {
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