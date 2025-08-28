import type { Directive, DirectiveBinding } from 'vue'
import { useUserAuthStore } from '@/stores/userInfo'

// 权限检查指令
export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding

    if (!value) {
      return
    }

    const userAuthStore = useUserAuthStore()

    // 检查按钮权限
    const hasPermission = userAuthStore.hasButtonPermission(value)

    if (!hasPermission) {
      // 如果没有权限，隐藏元素
      el.style.display = 'none'
    }
  },

  updated(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding

    if (!value) {
      return
    }

    const userAuthStore = useUserAuthStore()

    // 检查按钮权限
    const hasPermission = userAuthStore.hasButtonPermission(value)

    if (!hasPermission) {
      // 如果没有权限，隐藏元素
      el.style.display = 'none'
    } else {
      // 如果有权限，显示元素
      el.style.display = ''
    }
  },
}
