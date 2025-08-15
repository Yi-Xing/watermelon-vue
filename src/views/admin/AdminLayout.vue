<template>
  <div class="admin-dashboard">
    <AdminHeader />
    <div class="main-container">
      <AdminSidebar />
      <el-main class="main-content">
        <RouterView />
      </el-main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminHeader from './components/AdminHeader.vue'
import AdminSidebar from './components/AdminSidebar.vue'
</script>

<style scoped>
.admin-dashboard {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-container {
  flex: 1;
  display: flex;
}

.main-content {
  background: #f5f7fa;
  padding: 20px;
}
</style>
