<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const form = reactive({
  account: '',
  password: '',
})

const formRef = ref()
const rules = {
  account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码不少于 6 位', trigger: 'blur' },
  ],
}

const canSubmit = computed(() => form.account.trim() !== '' && form.password.trim() !== '')

async function onSubmit() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    if (!canSubmit.value || userStore.loading) return
    await userStore.login({ account: form.account, password: form.password })
  })
}
</script>

<template>
  <el-container class="page">
    <el-header class="header">
      <div class="container header-inner">
        <h1 class="logo">Watermelon</h1>
        <el-space>
          <RouterLink to="/">首页</RouterLink>
          <RouterLink to="/about">关于</RouterLink>
          <RouterLink to="/login">登录</RouterLink>
        </el-space>
      </div>
    </el-header>

    <el-main class="main">
      <div class="container two-col">
        <el-card class="left">
          <template #header>
            <span>登录 / 注册</span>
          </template>
          <el-form ref="formRef" :model="form" :rules="rules" label-width="72px" @submit.prevent>
            <el-form-item label="账号" prop="account">
              <el-input v-model="form.account" placeholder="请输入账号" clearable />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="请输入密码"
                show-password
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :loading="userStore.loading"
                :disabled="!canSubmit"
                @click="onSubmit"
              >
                登录
              </el-button>
              <el-button>注册</el-button>
            </el-form-item>
            <el-alert
              v-if="userStore.errorMessage"
              :title="userStore.errorMessage"
              type="error"
              show-icon
            />
          </el-form>
        </el-card>

        <el-card class="right">
          <template #header>
            <span>系统介绍</span>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="功能一">xxxxx</el-descriptions-item>
            <el-descriptions-item label="功能二">xxxxx</el-descriptions-item>
            <el-descriptions-item label="功能三">xxxxx</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </div>
    </el-main>

    <el-footer class="footer">
      <div class="container">© {{ new Date().getFullYear() }} Watermelon</div>
    </el-footer>
  </el-container>
</template>

<style scoped>
.page {
  min-height: 100vh;
}
.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 16px;
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo {
  margin: 0;
  font-size: 20px;
}
.main {
  padding: 24px 0;
}
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
@media (max-width: 768px) {
  .two-col {
    grid-template-columns: 1fr;
  }
}
</style>
