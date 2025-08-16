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
  server: {
    // 开发服务器配置
    port: 3000,
    host: '0.0.0.0',
    // 反向代理配置
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        secure: false,
        // 可选：配置请求头
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            // 可以在这里添加自定义请求头
            console.log(`代理请求: ${req.method} ${req.url} -> ${options.target}${req.url}`)
          })
        },
      },
    },
  },
})
