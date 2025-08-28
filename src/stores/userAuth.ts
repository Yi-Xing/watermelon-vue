import { ref} from 'vue'
import { defineStore } from 'pinia'

export const useUserAuthStore = defineStore('userAuth', () => {
  // 用户权限数据 - 使用Set提高查找效率
  const pageCodeSet = ref<Set<string>>(new Set())
  const buttonCodeSet = ref<Set<string>>(new Set())

  // 设置用户权限
  const setUserAuth = (pageCodes: string[], buttonCodes: string[]) => {
    pageCodeSet.value = new Set(pageCodes)
    buttonCodeSet.value = new Set(buttonCodes)
  }

  // 清空用户权限
  const clearUserAuth = () => {
    pageCodeSet.value.clear()
    buttonCodeSet.value.clear()
  }

  // 检查页面权限
  const hasPagePermission = (pageCode: string): boolean => {
    return pageCodeSet.value.has(pageCode)
  }

  // 检查按钮权限
  const hasButtonPermission = (buttonCode: string): boolean => {
    return buttonCodeSet.value.has(buttonCode)
  }




  return {
    // 状态
    pageCodeSet,
    buttonCodeSet,

    // 方法
    setUserAuth,
    clearUserAuth,
    hasPagePermission,
    hasButtonPermission,
  }
})
