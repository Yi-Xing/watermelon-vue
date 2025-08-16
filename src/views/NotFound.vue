<template>
  <div class="not-found-page">
    <!-- 顶部系统导航 -->
    <AppHeader />

    <!-- 中间 404 内容 -->
    <main class="main-content">
      <div class="not-found-container">
        <div class="error-content">
          <div class="error-icon">
            <el-icon size="120" color="#f56c6c">
              <Warning />
            </el-icon>
          </div>
          <h1 class="error-title">404</h1>
          <h2 class="error-subtitle">页面未找到</h2>
          <p class="error-description">抱歉，您访问的页面不存在或已被删除。</p>
          <div class="error-actions">
            <el-button type="primary" size="large" @click="goHome">
              <el-icon><House /></el-icon>
              返回首页
            </el-button>
            <el-button size="large" @click="goBack">
              <el-icon><Back /></el-icon>
              返回上页
            </el-button>
          </div>
        </div>
      </div>
    </main>

    <!-- 底部关于信息 -->
    <footer class="footer">
      <div class="container">
        <AppAbout />
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { House, Back, Warning } from '@element-plus/icons-vue'
import AppHeader from '@/components/AppHeader.vue'
import AppAbout from '@/components/AppAbout.vue'

const router = useRouter()

// 返回首页
const goHome = () => {
  router.push('/login')
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 中间 404 内容样式 */
.main-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  padding: 20px;
}

.not-found-container {
  width: 100%;
  max-width: 600px;
  text-align: center;
}

.error-content {
  padding: 40px 20px;
}

.error-icon {
  margin-bottom: 20px;
}

.error-title {
  font-size: 120px;
  font-weight: bold;
  color: #f56c6c;
  margin: 0 0 20px 0;
  line-height: 1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.error-subtitle {
  font-size: 32px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px 0;
}

.error-description {
  font-size: 16px;
  color: #606266;
  margin: 0 0 40px 0;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.error-actions .el-button {
  min-width: 120px;
}

/* 底部样式 */
.footer {
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .error-title {
    font-size: 80px;
  }

  .error-subtitle {
    font-size: 24px;
  }

  .error-description {
    font-size: 14px;
  }

  .error-actions {
    flex-direction: column;
    align-items: center;
  }

  .error-actions .el-button {
    width: 200px;
  }

  .main-content {
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .error-title {
    font-size: 60px;
  }

  .error-subtitle {
    font-size: 20px;
  }

  .error-content {
    padding: 20px 10px;
  }
}
</style>
