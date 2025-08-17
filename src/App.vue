<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <!-- RouterLink: 用于创建导航链接，支持路由跳转 -->
      </nav>
    </div>
  </header>

  <!-- RouterView 是Vue Router工作的关键组件，没有它，路由配置就无法生效。 -->
  <RouterView />
</template>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
    'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  margin: 0;
}
</style>
