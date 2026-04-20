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
      <el-table-column prop="is_deuplicate" label="重复类型" />

      <el-table-column label="图片" width="120">
        <template #default="{ row }">
          <el-image :src="row.event_image" style="width:60px;height:60px" />
        </template>
      </el-table-column>

      <el-table-column prop="event_time" label="事件时间" width="180" />

      <el-table-column label="操作" width="260">
        <template #default="{ row }">
          <el-button size="small" @click="openDetail(row)">详情</el-button>
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

        <el-form-item label="重复类型" prop="is_deuplicate">
          <el-select v-model="form.is_deuplicate" placeholder="请选择">
            <el-option label="不重复" value="0" />
            <el-option label="每周" value="1" />
            <el-option label="每月" value="3" />
            <el-option label="每年" value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="图片">
          <el-upload
            ref="uploadRef"
            :action="''"
            :http-request="handleUpload"
            :show-file-list="false"
            :before-upload="beforeUpload"
            accept="image/*"
          >
            <div v-if="form.event_image" class="upload-preview">
              <el-image :src="form.event_image" style="width: 100px; height: 100px" />
              <div class="upload-actions">
                <el-button size="small" type="primary">更换图片</el-button>
              </div>
            </div>
            <div v-else class="upload-placeholder">
              <i class="el-icon-plus"></i>
              <div>点击上传图片</div>
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item label="事件时间" prop="event_time">
          <el-date-picker
            v-model="form.event_time"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width:100%"
          />
        </el-form-item>

        <el-form-item label="提醒配置">
          <el-checkbox-group v-model="form.reminder_config">
            <el-checkbox label="0">不提醒</el-checkbox>
            <el-checkbox label="1">当天提醒</el-checkbox>
            <el-checkbox label="2">提前一天</el-checkbox>
            <el-checkbox label="3">提前三天</el-checkbox>
            <el-checkbox label="4">提前七天</el-checkbox>
            <el-checkbox label="5">每月提醒</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog title="事件详情" v-model="detailVisible" width="520px">
      <el-descriptions title="基本信息" column="1" border>
        <el-descriptions-item label="名称">{{ detailData?.event_name }}</el-descriptions-item>
        <el-descriptions-item label="图片">
          <el-image :src="detailData?.event_image" style="width: 80px; height: 80px" />
        </el-descriptions-item>
        <el-descriptions-item label="事件时间">{{ detailData?.event_time_text || detailData?.event_time }}</el-descriptions-item>
        <el-descriptions-item label="重复类型">{{ detailData?.is_deuplicate }}</el-descriptions-item>
        <el-descriptions-item label="下次提醒">{{ detailData?.next_time_text }}</el-descriptions-item>
        <el-descriptions-item label="提醒配置">{{ detailData?.reminder_config?.join(', ') || '无' }}</el-descriptions-item>
        <el-descriptions-item label="提醒列表">
          <div v-if="detailData?.reminder_list?.length">
            <div v-for="item in detailData.reminder_list" :key="item.type_code">
              {{ item.name }} - {{ item.description }}
            </div>
          </div>
          <span v-else>无</span>
        </el-descriptions-item>
        <el-descriptions-item label="创建者">
          {{ detailData?.creat_user_id === 0 ? '管理员' : `用户${detailData?.creat_user_id}` }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detailData?.create_time }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ detailData?.update_time || '无' }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button type="primary" @click="detailVisible = false">关闭</el-button>
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
  deleteEvent,
  detailEvent,
  uploadImage
} from "../api/event";

const list = ref<any[]>([]);
const loading = ref(false);
const total = ref(0);

const dialogVisible = ref(false);
const detailVisible = ref(false);
const isEdit = ref(false);
const dialogTitle = ref("新增事件");
const currentId = ref<number | null>(null);
const detailData = ref<any>(null);
const formRef = ref();

// 🔍 查询
const filter = reactive({
  keyword: "",
  user_id: "",
  page: 1,
  page_size: 10,
  order_type: 'asc'
});

// 🧾 表单
const form = reactive({
  event_name: "",
  event_image: "",
  event_time: "",
  is_deuplicate: "" as string,
  reminder_config: [] as number[]
});

// ✅ 表单校验
const rules = {
  event_name: [{ required: true, message: "请输入名称", trigger: "blur" }],
  event_time: [{ required: true, message: "请选择时间", trigger: "change" }]
};

const normalizeReminderConfig = (value: Array<string | number>) => {
  const config = Array.isArray(value) ? value.map(Number) : [];
  return config.includes(0) ? [0] : config.filter((v) => v !== 0);
};

const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/');
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    ElMessage.error('只能上传图片文件!');
    return false;
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!');
    return false;
  }
  return true;
};

const handleUpload = async (options: any) => {
  const { file, onSuccess, onError } = options;
  try {
    // 根据后端接口传递额外参数
    const res = await uploadImage(file, {
      type: 3, // 事件图片类型
      name: file.name, // 使用文件名作为图片名称
      sort: 0
    });
    form.event_image = res.url;
    ElMessage.success('图片上传成功');
    onSuccess(res);
  } catch (error) {
    ElMessage.error('图片上传失败');
    onError(error);
  }
};

const openDetail = async (row: any) => {
  try {
    const data = await detailEvent(row.id);
    detailData.value = data;
    detailVisible.value = true;
  } catch {
    ElMessage.error('获取详情失败');
  }
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
      reminder_config: normalizeReminderConfig(row.reminder_config ?? [])
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
    const payload = {
      ...form,
      reminder_config: normalizeReminderConfig(form.reminder_config)
    };

    if (isEdit.value) {
      await editEvent(currentId.value!, payload);
      ElMessage.success("修改成功");
    } else {
      await addEvent(payload);
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

<style scoped>
.event-page {
  padding: 20px;
}
.toolbar {
  margin-bottom: 16px;
}
.pagination {
  margin-top: 16px;
  text-align: right;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  transition: border-color 0.3s;
}

.upload-placeholder:hover {
  border-color: #409eff;
}

.upload-placeholder i {
  font-size: 28px;
  color: #c0c4cc;
  margin-bottom: 8px;
}

.upload-placeholder div {
  color: #606266;
  font-size: 14px;
}

.upload-preview {
  position: relative;
  display: inline-block;
}

.upload-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  padding: 4px;
  opacity: 0;
  transition: opacity 0.3s;
}

.upload-preview:hover .upload-actions {
  opacity: 1;
}
</style>