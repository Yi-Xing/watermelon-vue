<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { LOGIN_EXPIRED_MESSAGE } from '@/constants/localStorageKey'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import AppAbout from '@/components/AppAbout.vue'
import { User, Lock } from '@element-plus/icons-vue'
import GitHubIcon from '@/components/icons/GitHubIcon.vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'

const userStore = useUserStore()
const loginFormRef = ref()
const router = useRouter()

const loginForm = reactive({
  username: '',
  password: '',
})

const rules = {
  username: [{ required: true, message: '请输入手机号/邮箱', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
}

const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    await loginFormRef.value.validate()
    await userStore.login({ account: loginForm.username, password: loginForm.password })

    if (userStore.isLoggedIn) {
      ElMessage.success('登录成功！')
      // 登录成功后跳转到管理后台
      router.push('/admin/dashboard')
    }
  } catch (error) {
    // 如果有具体的错误信息，显示服务器返回的错误；否则显示默认错误
    const errorMessage = error instanceof Error ? error.message : '登录失败，请检查用户名和密码'
    ElMessage.error(errorMessage)
  }
}

// 检查是否有401错误提示信息
onMounted(() => {
  const expiredMessage = localStorage.getItem(LOGIN_EXPIRED_MESSAGE)
  if (expiredMessage) {
    ElMessage.error(expiredMessage)
    // 显示后清除提示信息
    localStorage.removeItem(LOGIN_EXPIRED_MESSAGE)
  }
})
</script>

<template>
  <div class="login-page">
    <!-- 顶部系统导航 -->
    <AppHeader />

    <!-- 中间登录内容 - 左右两栏布局 -->
    <main class="main-content">
      <div class="login-container">
        <!-- 左侧登录表单 -->
        <div class="login-form-section">
          <div class="login-box">
            <h2 class="login-title">
              <img src="@/assets/logo.webp" alt="Watermelon Logo" class="title-logo" />
              登录
            </h2>

            <el-form
              :model="loginForm"
              :rules="rules"
              ref="loginFormRef"
              class="login-form"
              @submit.prevent="handleLogin"
            >
              <el-form-item prop="username">
                <el-input v-model="loginForm.username" placeholder="请输入手机号/邮箱" size="large">
                  <template #prefix>
                    <el-icon><User /></el-icon>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item prop="password">
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  placeholder="请输入密码"
                  size="large"
                  show-password
                  @keyup.enter="handleLogin"
                >
                  <template #prefix>
                    <el-icon><Lock /></el-icon>
                  </template>
                </el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" size="large" class="login-btn" @click="handleLogin">
                  登录
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <!-- 右侧系统介绍 -->
        <div class="welcome-section">
          <div class="welcome-box">
            <h2 class="welcome-title">欢迎来到 Watermelon</h2>
            <p class="welcome-subtitle">用户权限管理系统</p>

            <div class="feature-list">
              <div class="feature-item">
                <div class="feature-content">
                  <p>用户登录、注册和权限管理系统</p>
                  <p>用户登录、注册和权限管理系统</p>
                  <p>用户登录、注册和权限管理系统</p>
                  <p>用户登录、注册和权限管理系统</p>
                </div>
              </div>
            </div>

            <div class="welcome-footer">
              <p>
                <a href="https://github.com/Yi-Xing/watermelon" target="_blank" class="github-link">
                  <GitHubIcon :size="18" />
                  GitHub 仓库
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 底部关于信息 - 嵌入 AboutView 组件 -->
    <footer class="footer">
      <div class="container">
        <AppAbout />
      </div>
    </footer>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 中间登录内容样式 - 左右两栏布局 */
.main-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 1000px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}

/* 左侧登录表单样式 */
.login-form-section {
  display: flex;
  justify-content: center;
}

.login-box {
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  min-width: 0;
  height: 360px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-title {
  text-align: center;
  margin-bottom: 25px;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.title-logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.login-form {
  margin-bottom: 15px;
}

.login-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 500;
  margin-top: 10px;
}

/* 右侧欢迎介绍样式 */
.welcome-section {
  display: flex;
  justify-content: center;
}

.welcome-box {
  background-color: rgba(98, 162, 240, 0.1);
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(98, 162, 240, 0.15);
  width: 100%;
  max-width: 400px;
  min-width: 0;
  height: 360px;
  border: 1px solid rgba(98, 162, 240, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.welcome-title {
  text-align: center;
  margin-bottom: 8px;
  color: #303133;
  font-size: 28px;
  font-weight: 700;
}

.welcome-subtitle {
  text-align: center;
  margin-bottom: 25px;
  color: #606266;
  font-size: 16px;
  font-weight: 500;
}

.feature-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 15px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  padding: 15px;
  background: rgba(64, 158, 255, 0.05);
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.feature-icon {
  font-size: 24px;
  color: #409eff;
  margin-right: 15px;
  margin-top: 2px;
}

.feature-content h4 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.feature-content p {
  margin: 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
}

.welcome-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
  margin-top: auto;
}

.welcome-footer p {
  margin: 0;
  color: #409eff;
  font-size: 16px;
  font-weight: 500;
}

.github-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #409eff;
  text-decoration: none;
  transition: all 0.3s;
  padding: 8px 16px;
  border-radius: 6px;
  background: rgba(64, 158, 255, 0.1);
}

.github-link:hover {
  background: rgba(64, 158, 255, 0.2);
  transform: translateY(-1px);
}

/* 底部样式 */
.footer {
  background: #2c3e50;
  color: #ecf0f1;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding: 15px;
  }

  .login-container {
    grid-template-columns: 1fr;
    gap: 20px;
    max-width: 100%;
  }

  .login-box,
  .welcome-box {
    padding: 25px 20px;
    height: auto;
    min-height: 320px;
    max-width: 100%;
  }

  .login-title {
    font-size: 22px;
    margin-bottom: 20px;
    gap: 8px;
  }

  .title-logo {
    width: 28px;
    height: 28px;
  }

  .welcome-title {
    font-size: 24px;
    margin-bottom: 6px;
  }

  .welcome-subtitle {
    font-size: 15px;
    margin-bottom: 20px;
  }

  .feature-item {
    padding: 12px;
    margin-bottom: 15px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 10px;
  }

  .login-container {
    gap: 15px;
  }

  .login-box,
  .welcome-box {
    padding: 20px 15px;
    min-height: 300px;
  }

  .login-title {
    font-size: 20px;
    margin-bottom: 18px;
    gap: 6px;
  }

  .title-logo {
    width: 24px;
    height: 24px;
  }

  .welcome-title {
    font-size: 22px;
  }

  .welcome-subtitle {
    font-size: 14px;
  }
}
</style>
