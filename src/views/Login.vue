<template>
  <div class="login-page">
    <el-card class="login-card">
      <h2>登录后台</h2>
      <el-form :model="form" status-icon>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { login } from '../api/auth';
import { AUTH_TOKEN_KEY } from '../api/request';

const router = useRouter();
const form = reactive({
  username: 'admin',
  password: '123456'
});

const handleLogin = async () => {
  if (!form.username || !form.password) {
    ElMessage.warning('请填写用户名和密码');
    return;
  }

  try {
    const result = await login({
      username: form.username,
      password: form.password
    });

    const token =
      result.data?.authadmintoken ||
      result.data?.accessToken ||
      result.data?.token ||
      result.token ||
      (result.data as any)?.access_token;
    if (!token) {
      throw new Error(result.message || '登录失败，未返回 token');
    }

    localStorage.setItem(AUTH_TOKEN_KEY, token);
    ElMessage.success('登录成功');
    await router.push('/');
  } catch (error) {
    const message = error instanceof Error ? error.message : '登录失败';
    ElMessage.error(message);
  }
};
</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f2f6fc;
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
