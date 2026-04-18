<template>
  <div class="check-rule-page">
    <div class="toolbar">
      <el-form :model="filter" inline>
        <el-form-item label="关键词">
          <el-input v-model="filter.keyword" placeholder="按规则名称搜索" clearable />
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input v-model="filter.user_id" placeholder="0=系统规则" style="width: 160px" clearable />
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
      <el-table-column prop="name" label="规则名称" min-width="150" />
      <el-table-column label="创建者" width="100">
        <template #default="{ row }">
          <span>{{ row.creat_user_id === 0 ? '管理员' : `用户${row.creat_user_id}` }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="frequency" label="每日频率" width="100">
        <template #default="{ row }">
          <span>{{ row.frequency }}次/天</span>
        </template>
      </el-table-column>
      <el-table-column label="执行日期" min-width="120">
        <template #default="{ row }">
          <span v-if="row.type === 1">每天</span>
          <span v-else>{{ formatWeekDays(row.week_days_arr) }}</span>
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
import { listCheckRules, CheckRuleItem } from '../api/checkRule';

const list = ref<CheckRuleItem[]>([]);
const loading = ref(false);
const total = ref(0);

const filter = reactive({
  keyword: '',
  user_id: '',
  page: 1,
  page_size: 10
});

const weekDayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

const fetchList = async () => {
  loading.value = true;
  try {
    const res = await listCheckRules(filter);
    list.value = res.list;
    total.value = res.total;
  } catch (error) {
    console.error(error);
    ElMessage.error('规则列表加载失败');
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
    user_id: '',
    page: 1,
    page_size: 10
  });
  fetchList();
};

const handlePageChange = (page: number) => {
  filter.page = page;
  fetchList();
};

const formatWeekDays = (weekDaysArr: number[]) => {
  if (!weekDaysArr || weekDaysArr.length === 0) return '';
  return weekDaysArr.map(day => weekDayNames[day - 1]).join('、');
};

onMounted(fetchList);
</script>

<style scoped>
.check-rule-page {
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