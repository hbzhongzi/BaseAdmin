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
      <el-button type="primary" @click="openUploadDialog">上传图片</el-button>
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
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
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

    <!-- 上传弹窗 -->
    <el-dialog title="上传图片" v-model="uploadDialogVisible" width="500px">
      <el-form :model="uploadForm" :rules="uploadRules" ref="uploadFormRef" label-width="100px">
        <el-form-item label="图片文件" prop="file">
          <el-upload
            ref="uploadRef"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            :auto-upload="false"
            :show-file-list="true"
            accept="image/*"
            :limit="1"
          >
            <el-button type="primary">选择文件</el-button>
            <template #tip>
              <div class="el-upload__tip">只能上传图片文件，且不超过 2MB</div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item label="图片类型" prop="type">
          <el-select v-model="uploadForm.type" placeholder="请选择类型">
            <el-option label="背景图" :value="1" />
            <el-option label="打卡图标" :value="2" />
            <el-option label="纪念图" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item label="图片名称" prop="name">
          <el-input v-model="uploadForm.name" placeholder="请输入图片名称" />
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="uploadForm.sort" :min="0" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="uploadDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUpload" :loading="uploading">
          上传
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { listImageResources, uploadImage, deleteImageResource, ImageResourceItem } from '../api/imageResource';

const list = ref<ImageResourceItem[]>([]);
const loading = ref(false);
const total = ref(0);

// 上传相关状态
const uploadDialogVisible = ref(false);
const uploading = ref(false);
const uploadFormRef = ref();
const uploadRef = ref();

const filter = reactive({
  type: '',
  user_id: '',
  keyword: '',
  page: 1,
  page_size: 10
});

// 上传表单
const uploadForm = reactive({
  file: null as File | null,
  type: 1,
  name: '',
  sort: 0,
});

// 上传表单验证规则
const uploadRules = {
  file: [{ required: true, message: '请选择要上传的图片文件', trigger: 'change' }],
  type: [{ required: true, message: '请选择图片类型', trigger: 'change' }],
  name: [{ required: true, message: '请输入图片名称', trigger: 'blur' }],
  sort: [{ required: true, message: '请输入排序值', trigger: 'blur' }],
};

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

// 打开上传弹窗
const openUploadDialog = () => {
  uploadForm.file = null;
  uploadForm.type = 1;
  uploadForm.name = '';
  uploadForm.sort = 0;
  uploadDialogVisible.value = true;
  uploadFormRef.value?.resetFields();
  uploadRef.value?.clearFiles();
};

// 文件选择处理
const handleFileChange = (file: any, fileList: any[]) => {
  if (fileList.length > 0) {
    uploadForm.file = file.raw;
  } else {
    uploadForm.file = null;
  }
};

// 文件移除处理
const handleFileRemove = () => {
  uploadForm.file = null;
};

// 上传处理
const handleUpload = async () => {
  await uploadFormRef.value.validate();

  if (!uploadForm.file) {
    ElMessage.error('请选择要上传的文件');
    return;
  }

  // 检查文件大小 (2MB)
  if (uploadForm.file.size > 2 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过 2MB!');
    return;
  }

  uploading.value = true;
  try {
    await uploadImage({
      file: uploadForm.file,
      type: uploadForm.type,
      name: uploadForm.name,
      sort: uploadForm.sort,
    });

    ElMessage.success('上传成功');
    uploadDialogVisible.value = false;
    fetchList();
  } catch (error) {
    ElMessage.error('上传失败');
  } finally {
    uploading.value = false;
  }
};

// 删除处理
const handleDelete = async (row: ImageResourceItem) => {
  await ElMessageBox.confirm('确认删除这张图片吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  });

  try {
    await deleteImageResource(row.id);
    ElMessage.success('删除成功');
    fetchList();
  } catch (error) {
    ElMessage.error('删除失败');
  }
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
