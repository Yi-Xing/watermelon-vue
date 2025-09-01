import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { CurrentUser } from '@/types/user'
import type { PagePermission, ButtonPermission } from '@/constants/permissionCode'
// 本地调试开启全部权限
import { ALL_PAGE_PERMISSIONS, ALL_BUTTON_PERMISSIONS } from '@/constants/permissionCode'

export const useUserAuthStore = defineStore('userAuth', () => {
  // 用户权限数据 - 使用Set提高查找效率
  const pageCodeSet = ref<Set<PagePermission>>(new Set())
  const buttonCodeSet = ref<Set<ButtonPermission>>(new Set())

  // 是否已经加载过权限
  const hasLoadedAuth = ref<boolean>(false)

  // 当前用户信息
  const currentUser = ref<CurrentUser>({
    id: 0,
    name: '加载中...',
    email: '',
    phone: '',
    remark: '',
    createdTime: '',
    updatedTime: '',
    expireTime: '',
    pageCodeList: [],
    buttonCodeList: [],
  })

  // 设置用户信息和权限
  const setUserInfo = (userData: CurrentUser) => {
    // 设置用户权限
    pageCodeSet.value = new Set(userData.pageCodeList as PagePermission[])
    buttonCodeSet.value = new Set(userData.buttonCodeList as ButtonPermission[])

    // 本地调试开启全部权限
    pageCodeSet.value = ALL_PAGE_PERMISSIONS
    buttonCodeSet.value = ALL_BUTTON_PERMISSIONS

    // 设置用户基本信息
    Object.assign(currentUser.value, userData)

    // 标记权限已加载
    hasLoadedAuth.value = true
  }

  // 清空用户信息
  const clearUserInfo = () => {
    pageCodeSet.value.clear()
    buttonCodeSet.value.clear()
    Object.assign(currentUser.value, {
      id: 0,
      name: '加载中...',
      email: '',
      phone: '',
      remark: '',
      createdTime: '',
      updatedTime: '',
      expireTime: '',
      pageCodeList: [],
      buttonCodeList: [],
    })
    // 重置权限加载状态
    hasLoadedAuth.value = false
  }

  // 检查页面权限
  const hasPagePermission = (pageCode: PagePermission): boolean => {
    return pageCodeSet.value.has(pageCode)
  }

  // 检查按钮权限
  const hasButtonPermission = (buttonCode: ButtonPermission): boolean => {
    return buttonCodeSet.value.has(buttonCode)
  }

  return {
    // 状态
    pageCodeSet,
    buttonCodeSet,
    hasLoadedAuth,
    currentUser,

    // 方法
    setUserInfo,
    clearUserInfo,
    hasPagePermission,
    hasButtonPermission,
  }
})
