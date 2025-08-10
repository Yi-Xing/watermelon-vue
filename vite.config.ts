import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Vue 3 框架支持
    vue(),
    // Vue 3 开发工具支持
    vueDevTools(),
  ],
  resolve: {
    alias: {
      // 路径别名，@/components/HelloWorld.vue → src/components/HelloWorld.vue
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
