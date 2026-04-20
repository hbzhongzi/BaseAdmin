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
      <el-button type="primary" @click="openDialog()">新增打卡规则</el-button>
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
      <el-table-column label="操作" width="220">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
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

    <!-- 🧩 弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="规则名称" prop="check_rule_name">
          <el-input v-model="form.check_rule_name" />
        </el-form-item>

        <el-form-item label="执行类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option label="每天" :value="1" />
            <el-option label="每周" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="form.type === 2" label="执行日期" prop="week_days_arr">
          <el-checkbox-group v-model="form.week_days_arr">
            <el-checkbox label="1">周一</el-checkbox>
            <el-checkbox label="2">周二</el-checkbox>
            <el-checkbox label="3">周三</el-checkbox>
            <el-checkbox label="4">周四</el-checkbox>
            <el-checkbox label="5">周五</el-checkbox>
            <el-checkbox label="6">周六</el-checkbox>
            <el-checkbox label="7">周日</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="每日频率" prop="frequency">
          <el-input-number v-model="form.frequency" :min="1" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  listCheckRules,
  addCheckRule,
  editCheckRule,
  deleteCheckRule,
} from '../api/checkRule';

const list = ref<any[]>([]);
const loading = ref(false);
const total = ref(0);

const dialogVisible = ref(false);
const detailVisible = ref(false);
const isEdit = ref(false);
const dialogTitle = ref("新增打卡规则");
const currentId = ref<number | null>(null);
const detailData = ref<any>(null);
const formRef = ref();

// 🔍 查询
const filter = reactive({
  keyword: '',
  user_id: '',
  page: 1,
  page_size: 10
});

// 🧾 表单
const form = reactive({
  check_rule_name: '',
  type: 1,
  week_days_arr: [] as number[],
  frequency: 1,
});

// ✅ 表单校验
const rules = {
  name: [{ required: true, message: "请输入规则名称", trigger: "blur" }],
  type: [{ required: true, message: "请选择执行类型", trigger: "change" }],
  frequency: [{ required: true, message: "请输入每日频率", trigger: "blur" }],

};

const weekDayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

const formatWeekDays = (weekDaysArr: number[]) => {
  if (!weekDaysArr || weekDaysArr.length === 0) return '';
  return weekDaysArr.map(day => weekDayNames[day - 1]).join('、');
};



// 📡 获取列表
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

// 🔍 搜索
const searchList = () => {
  filter.page = 1;
  fetchList();
};

// 🔄 重置
const resetFilter = () => {
  Object.assign(filter, {
    keyword: '',
    user_id: '',
    page: 1,
    page_size: 10
  });
  fetchList();
};

// 📄 分页
const handlePageChange = (page: number) => {
  filter.page = page;
  fetchList();
};

// 🧩 打开弹窗
const openDialog = (row?: any) => {
  formRef.value?.resetFields();

  if (row) {
    isEdit.value = true;
    dialogTitle.value = "编辑打卡规则";
    currentId.value = row.id;

    Object.assign(form, {
      name: row.name,
      type: row.type,
      week_days_arr: row.week_days_arr || [],
      frequency: row.frequency,
      start_time: row.start_time,
      end_time: row.end_time
    });
  } else {
    isEdit.value = false;
    dialogTitle.value = "新增打卡规则";
    currentId.value = null;

    Object.assign(form, {
      check_rule_name: '',
      type: 1,
      week_days_arr: [],
      frequency: 1,
      start_time: '',
      end_time: ''
    });
  }

  dialogVisible.value = true;
};

// 💾 提交
const submitForm = async () => {
  await formRef.value.validate();

  try {
    const payload = {
      ...form,
      week_days: form.week_days_arr.join(',')
    };

    if (isEdit.value) {
      await editCheckRule(currentId.value!, payload);
      ElMessage.success("修改成功");
    } else {
      await addCheckRule(payload);
      ElMessage.success("新增成功");
    }

    dialogVisible.value = false;
    fetchList();
  } catch {
    ElMessage.error("操作失败");
  }
};

// 🗑 删除
const handleDelete = async (row: any) => {
  await ElMessageBox.confirm("确认删除？");
  await deleteCheckRule(row.id);
  ElMessage.success("删除成功");
  fetchList();
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