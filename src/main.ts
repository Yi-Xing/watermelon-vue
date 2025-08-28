import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import { setupDirectives } from './directives'

// 创建Vue应用实例
// 传入根组件 App 作为应用的起点，所有其他组件都是它的子组件
const app = createApp(App)

// 使用Pinia状态管理
// 这会让整个应用都能访问Pinia store，替代了Vuex
app.use(createPinia())

// 使用 Vue Router 路由，让应用支持页面路由功能
app.use(router)

// 使用 Element Plus
app.use(ElementPlus, {
  locale: zhCn,
})

// 注册自定义指令
setupDirectives(app)

// 将Vue应用挂载到DOM元素上
// '#app'对应index.html中的<div id="app"></div>
// 应用启动后，Vue会接管这个DOM元素
app.mount('#app')
