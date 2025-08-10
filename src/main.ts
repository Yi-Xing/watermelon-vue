import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 创建Vue应用实例
// 传入根组件 App 作为应用的起点，所有其他组件都是它的子组件
const app = createApp(App)

// 使用Pinia状态管理
// 这会让整个应用都能访问Pinia store，替代了Vuex
app.use(createPinia())

// 使用 Vue Router 路由，让应用支持页面路由功能
app.use(router)

// 将Vue应用挂载到DOM元素上
// '#app'对应index.html中的<div id="app"></div>
// 应用启动后，Vue会接管这个DOM元素
app.mount('#app')
