<template>
  <div class="login-page">
    <el-card class="login-card">
      <h2>登录后台</h2>
      <el-form :model="form" status-icon @submit.prevent="handleLogin">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" :loading="loading">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getCurrentAdmin, login } from '../api/auth';
import { setAuthToken } from '../auth/session';

const router = useRouter();
const loading = ref(false);
const form = reactive({
  username: '',
  password: ''
});

const handleLogin = async () => {
  if (loading.value) return;
  if (!form.username || !form.password) {
    ElMessage.warning('请填写用户名和密码');
    return;
  }

  loading.value = true;
  try {
    const result = await login({
      username: form.username,
      password: form.password
    });

    const token = result.data?.token;
    if (!token) {
      throw new Error(result.msg || '登录失败，未返回 token');
    }

    setAuthToken(token);
    await getCurrentAdmin();
    ElMessage.success('登录成功');
    await router.push('/');
  } catch (error) {
    const message = error instanceof Error ? error.message : '登录失败';
    ElMessage.error(message);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--app-bg);
}
.login-card {
  width: 380px;
  padding: 32px;
}
.login-card h2 {
  margin-bottom: 24px;
  text-align: center;
}
</style>
