<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <!-- RouterLink: 用于创建导航链接，支持路由跳转 -->
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
      </nav>
    </div>
  </header>

  <!-- RouterView 是Vue Router工作的关键组件，没有它，路由配置就无法生效。 -->
  <!-- 例如：访问 / 显示HomeView，访问 /about 显示AboutView -->
  <RouterView />
</template>

<style scoped>
.wrapper {
  padding: 12px 16px;
}
nav {
  display: flex;
  gap: 12px;
}
</style>
