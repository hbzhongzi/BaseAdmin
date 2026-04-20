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
      <el-button type="primary" @click="openDialog()">新增打卡类型</el-button>
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
      <el-table-column label="操作" width="280">
        <template #default="{ row }">
          <el-button size="small" @click="openDetail(row)">详情</el-button>
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
          <el-button
            size="small"
            :type="row.status === 1 ? 'warning' : 'success'"
            @click="changeStatus(row)"
          >
            {{ row.status === 1 ? '禁用' : '启用' }}
          </el-button>
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
        <el-form-item label="类型名称" prop="check_type_name">
          <el-input v-model="form.check_type_name" />
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
            <div v-if="form.check_image" class="upload-preview">
              <el-image :src="form.check_image" style="width: 100px; height: 100px" />
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

        <el-form-item label="默认规则ID" prop="default_rule_id">
          <el-input-number v-model="form.default_rule_id" :min="0" />
        </el-form-item>

        <el-form-item label="来源" prop="type_source">
          <el-select v-model="form.type_source" placeholder="请选择">
            <el-option label="系统" :value="1" />
            <el-option label="用户" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option label="禁用" :value="0" />
            <el-option label="启用" :value="1" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog title="打卡类型详情" v-model="detailVisible" width="520px">
      <el-descriptions title="基本信息" column="1" border>
        <el-descriptions-item label="ID">{{ detailData?.id }}</el-descriptions-item>
        <el-descriptions-item label="类型名称">{{ detailData?.check_type_name }}</el-descriptions-item>
        <el-descriptions-item label="图片">
          <el-image :src="detailData?.check_image" style="width: 80px; height: 80px" />
        </el-descriptions-item>
        <el-descriptions-item label="默认规则ID">{{ detailData?.default_rule_id }}</el-descriptions-item>
        <el-descriptions-item label="来源">{{ detailData?.type_source === 1 ? '系统' : '用户' }}</el-descriptions-item>
        <el-descriptions-item label="创建者">
          {{ detailData?.user_id === 0 ? '管理员' : `用户${detailData?.user_id}` }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">{{ detailData?.status === 1 ? '启用' : '禁用' }}</el-descriptions-item>
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
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  listCheckTypes,
  addCheckType,
  editCheckType,
  deleteCheckType,
  detailCheckType,
  changeCheckTypeStatus
} from '../api/checkType';
import { uploadImage } from '../api/event';

const list = ref<any[]>([]);
const loading = ref(false);
const total = ref(0);

const dialogVisible = ref(false);
const detailVisible = ref(false);
const isEdit = ref(false);
const dialogTitle = ref("新增打卡类型");
const currentId = ref<number | null>(null);
const detailData = ref<any>(null);
const formRef = ref();
const uploadRef = ref();

// 🔍 查询
const filter = reactive({
  keyword: '',
  type_source: '',
  user_id: '',
  status: '',
  page: 1,
  page_size: 10
});

// 🧾 表单
const form = reactive({
  check_type_name: '',
  check_image: '',
  default_rule_id: 0,
  type_source: 1,
  status: 1
});

// ✅ 表单校验
const rules = {
  check_type_name: [{ required: true, message: "请输入类型名称", trigger: "blur" }],
  default_rule_id: [{ required: true, message: "请输入默认规则ID", trigger: "blur" }]
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
      type: 2, // 打卡类型图片类型
      name: file.name, // 使用文件名作为图片名称
      sort: 0
    });
    form.check_image = res.url;
    ElMessage.success('图片上传成功');
    onSuccess(res);
  } catch (error) {
    ElMessage.error('图片上传失败');
    onError(error);
  }
};

const openDetail = async (row: any) => {
  try {
    const data = await detailCheckType(row.id);
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

// 🔍 搜索
const searchList = () => {
  filter.page = 1;
  fetchList();
};

// 🔄 重置
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
    dialogTitle.value = "编辑打卡类型";
    currentId.value = row.id;

    Object.assign(form, {
      check_type_name: row.check_type_name,
      check_image: row.check_image,
      default_rule_id: row.default_rule_id,
      type_source: row.type_source,
      status: row.status
    });
  } else {
    isEdit.value = false;
    dialogTitle.value = "新增打卡类型";
    currentId.value = null;

    Object.assign(form, {
      check_type_name: '',
      check_image: '',
      default_rule_id: 0,
      type_source: 1,
      status: 1
    });
  }

  dialogVisible.value = true;
};

// 💾 提交
const submitForm = async () => {
  await formRef.value.validate();

  try {
    if (isEdit.value) {
      await editCheckType(currentId.value!, form);
      ElMessage.success("修改成功");
    } else {
      await addCheckType(form);
      ElMessage.success("新增成功");
    }

    dialogVisible.value = false;
    fetchList();
  } catch {
    ElMessage.error("操作失败");
  }
};

// 🔄 状态切换
const changeStatus = async (row: any) => {
  const newStatus = row.status === 1 ? 0 : 1;
  try {
    await changeCheckTypeStatus(row.id, newStatus);
    ElMessage.success("状态修改成功");
    fetchList();
  } catch {
    ElMessage.error("状态修改失败");
  }
};

// 🗑 删除
const handleDelete = async (row: any) => {
  await ElMessageBox.confirm("确认删除？");
  await deleteCheckType(row.id);
  ElMessage.success("删除成功");
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
