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
      <el-button type="primary" @click="openDialog()">新增会员套餐</el-button>
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
      <el-table-column label="操作" width="280">
        <template #default="{ row }">
          <el-button size="small" @click="openDialog(row)">编辑</el-button>
          <el-button
            size="small"
            :type="row.status === 1 ? 'warning' : 'success'"
            @click="changeStatus(row)"
          >
            {{ row.status === 1 ? '下架' : '上架' }}
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
        <el-form-item label="套餐描述" prop="combo_text">
          <el-input v-model="form.combo_text" />
        </el-form-item>

        <el-form-item label="原价" prop="original_price">
          <el-input-number v-model="form.original_price" :min="0" :precision="2" />
        </el-form-item>

        <el-form-item label="现价" prop="now_price">
          <el-input-number v-model="form.now_price" :min="0" :precision="2" />
        </el-form-item>


        <el-form-item label="天数" prop="combo">
          <el-input-number v-model="form.combo" :min="1" />
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option label="下架" :value="0" />
            <el-option label="上架" :value="1" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog title="会员套餐详情" v-model="detailVisible" width="520px">
      <el-descriptions title="基本信息" column="1" border>
        <el-descriptions-item label="ID">{{ detailData?.id }}</el-descriptions-item>
        <el-descriptions-item label="套餐描述">{{ detailData?.combo_text }}</el-descriptions-item>
        <el-descriptions-item label="原价">¥{{ detailData?.original_price }}</el-descriptions-item>
        <el-descriptions-item label="现价">¥{{ detailData?.now_price }}</el-descriptions-item>
        <el-descriptions-item label="天数">{{ detailData?.combo === 99999 ? '终身' : detailData?.combo + '天' }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ detailData?.status === 1 ? '上架' : '下架' }}</el-descriptions-item>
        <el-descriptions-item label="排序">{{ detailData?.sort }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detailData?.create_time }}</el-descriptions-item>
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
  listMemberPackages,
  addMemberPackage,
  editMemberPackage,
  deleteMemberPackage,
  changeMemberPackageStatus
} from '../api/memberPackage';

const list = ref<any[]>([]);
const loading = ref(false);
const total = ref(0);

const dialogVisible = ref(false);
const detailVisible = ref(false);
const isEdit = ref(false);
const dialogTitle = ref("新增会员套餐");
const currentId = ref<number | null>(null);
const detailData = ref<any>(null);
const formRef = ref();

// 🔍 查询
const filter = reactive({
  status: '',
  keyword: '',
  page: 1,
  page_size: 10
});

// 🧾 表单
const form = reactive({
  combo_text: '',
  original_price: 0,
  now_price: 0,
  discount: 0,
  combo: 1,
  sort: 0,
  status: 1
});

// ✅ 表单校验
const rules = {
  combo_text: [{ required: true, message: "请输入套餐描述", trigger: "blur" }],
  original_price: [{ required: true, message: "请输入原价", trigger: "blur" }],
  now_price: [{ required: true, message: "请输入现价", trigger: "blur" }],
  combo: [{ required: true, message: "请输入天数", trigger: "blur" }]
};


// 📡 获取列表
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

// 🔍 搜索
const searchList = () => {
  filter.page = 1;
  fetchList();
};

// 🔄 重置
const resetFilter = () => {
  Object.assign(filter, {
    status: '',
    keyword: '',
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
    dialogTitle.value = "编辑会员套餐";
    currentId.value = row.id;

    Object.assign(form, {
      combo_text: row.combo_text,
      original_price: row.original_price,
      now_price: row.now_price,
      discount: row.discount,
      combo: row.combo,
      sort: row.sort,
      status: row.status
    });
  } else {
    isEdit.value = false;
    dialogTitle.value = "新增会员套餐";
    currentId.value = null;

    Object.assign(form, {
      combo_text: '',
      original_price: 0,
      now_price: 0,
      discount: 0,
      combo: 1,
      sort: 0,
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
      await editMemberPackage(currentId.value!, form);
      ElMessage.success("修改成功");
    } else {
      await addMemberPackage(form);
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
    await changeMemberPackageStatus(row.id, newStatus);
    ElMessage.success("状态修改成功");
    fetchList();
  } catch {
    ElMessage.error("状态修改失败");
  }
};

// 🗑 删除
const handleDelete = async (row: any) => {
  await ElMessageBox.confirm("确认删除？");
  await deleteMemberPackage(row.id);
  ElMessage.success("删除成功");
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