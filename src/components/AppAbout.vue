<template>
  <div class="about-content">
    <div class="copyright">
      <p>&copy; 2024 Watermelon. All rights reserved.</p>
      <p>备案号：京ICP备12345678号 | 京公网安备123456789号</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// 组件名：AppAbout
// 组件逻辑可以在这里添加
</script>

<style scoped>
.about-content {
  text-align: center;
  padding: 20px 0;
}

.copyright {
  color: #95a5a6;
  font-size: 12px;
}

.copyright p {
  margin: 5px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer-links {
    flex-direction: column;
    gap: 15px;
    align-items: center;
  }

  .about-content {
    padding: 15px 0;
  }
}
</style>
