import type { App } from 'vue'
import { permission } from './permission'

// 注册所有自定义指令
export function setupDirectives(app: App) {
  app.directive('permission', permission)
}

// 导出指令供单独使用
export { permission }
