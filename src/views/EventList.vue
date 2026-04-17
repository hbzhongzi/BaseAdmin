<template>
  <div class="event-page">
    <!-- 🔍 搜索 -->
    <div class="toolbar">
      <el-form :model="filter" inline>
        <el-form-item label="关键词">
          <el-input v-model="filter.keyword" placeholder="按名称搜索" clearable />
        </el-form-item>

        <el-form-item label="用户ID">
          <el-input v-model="filter.user_id" style="width: 150px" clearable />
        </el-form-item>

        <el-form-item label="置顶">
          <el-select v-model="filter.is_top" style="width: 120px">
            <el-option label="全部" value="" />
            <el-option label="否" value="0" />
            <el-option label="是" value="1" />
          </el-select>
        </el-form-item>

        <el-button type="primary" @click="searchList">搜索</el-button>
        <el-button @click="resetFilter">重置</el-button>
      </el-form>
    </div>

    <!-- ➕ 新增 -->
    <div class="toolbar">
      <el-button type="primary" @click="openDialog()">新增事件</el-button>
    </div>

    <!-- 📊 表格 -->
    <el-table :data="list" v-loading="loading" stripe>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="event_name" label="名称" />

      <el-table-column label="创建人" width="140">
        <template #default="{ row }">
          <span>{{ row.is_admin ? '管理员' : row.user_id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="图片" width="120">
        <template #default="{ row }">
          <el-image :src="row.event_image" style="width:60px;height:60px" />
        </template>
      </el-table-column>

      <el-table-column prop="event_time" label="事件时间" width="180" />

      <el-table-column label="置顶" width="100">
        <template #default="{ row }">
          <el-tag type="success" v-if="row.is_top">是</el-tag>
          <el-tag v-else>否</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 📄 分页 -->
    <el-pagination
      background
      :current-page="filter.page"
      :page-size="filter.page_size"
      :total="total"
      layout="prev, pager, next"
      @current-change="handlePageChange"
    />

    <!-- 🧩 弹窗 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="名称" prop="event_name">
          <el-input v-model="form.event_name" />
        </el-form-item>

        <el-form-item label="图片">
          <el-input v-model="form.event_image" />
        </el-form-item>

        <el-form-item label="事件时间" prop="event_time">
          <el-date-picker
            v-model="form.event_time"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width:100%"
          />
        </el-form-item>


        <el-form-item label="置顶">
          <el-switch v-model="form.is_top" />
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
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  listEvents,
  addEvent,
  editEvent,
  deleteEvent
} from "../api/event";

const list = ref<any[]>([]);
const loading = ref(false);
const total = ref(0);

const dialogVisible = ref(false);
const isEdit = ref(false);
const dialogTitle = ref("新增事件");
const currentId = ref<number | null>(null);
const formRef = ref();

// 🔍 查询
const filter = reactive({
  keyword: "",
  user_id: "",
  is_top: "",
  page: 1,
  page_size: 10,
  order_type: 'asc'
});

// 🧾 表单
const form = reactive({
  event_name: "",
  event_image: "",
  event_time: "",
  is_top: 0
});

// ✅ 表单校验
const rules = {
  event_name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  event_time: [{ required: true, message: "请选择时间", trigger: "change" }]
};


// 📡 获取列表
const fetchList = async () => {
  loading.value = true;
  try {
    const res = await listEvents(filter);
    list.value = res.list;
    total.value = res.total;
  } catch {
    ElMessage.error("加载失败");
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
    keyword: "",
    user_id: "",
    is_top: "",
    page: 1,
    page_size: 10,
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
    dialogTitle.value = "编辑事件";
    currentId.value = row.id;

    Object.assign(form, {
      event_name: row.event_name,
      event_image: row.event_image,
      event_time: row.event_time,
      is_top: row.is_top
    });
  } else {
    isEdit.value = false;
    dialogTitle.value = "新增事件";
    currentId.value = null;
  }

  dialogVisible.value = true;
};

// 💾 提交
const submitForm = async () => {
  await formRef.value.validate();

  try {
    if (isEdit.value) {
      await editEvent(currentId.value!, form);
      ElMessage.success("修改成功");
    } else {
      await addEvent(form);
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
  await deleteEvent(row.id);
  ElMessage.success("删除成功");
  fetchList();
};

onMounted(fetchList);
</script>