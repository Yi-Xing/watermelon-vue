<template>
  <el-header class="header">
    <div class="container header-inner">
      <div class="logo-section">
        <RouterLink to="/" class="logo-link">
          <img src="@/assets/logo.webp" alt="Watermelon Logo" class="logo-icon" />
          <h1 class="logo">Watermelon</h1>
        </RouterLink>
      </div>
      <el-space> </el-space>
    </div>
  </el-header>
</template>

<script setup lang="ts">
// 组件逻辑可以在这里添加
</script>

<style scoped>
/* 头部样式 */
.header {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0;
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.logo-section {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.logo-section:hover {
  background-color: #e6f3ff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.logo-section:hover .logo {
  color: #409eff;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
}

.logo-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #409eff;
  margin: 0;
}

/* 响应式容器 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
</style>
