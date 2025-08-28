import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useHttp } from '@/composables/useHttp'
import { login as loginRequest } from '@/services/auth'
import type { LoginRequestPayload, LoginResponseData } from '@/types/auth'
import { USER_TOKEN } from '@/constants/localStorageKey'
import { useUserAuthStore } from './userInfo'

export const useUserStore = defineStore('user', () => {
  // 从 localStorage 初始化 token，如果没有则设为 null
  const token = ref<string | null>(localStorage.getItem(USER_TOKEN))

  const isLoggedIn = computed(() => Boolean(token.value))

  async function login(payload: LoginRequestPayload) {
    try {
      const response: LoginResponseData = await loginRequest(payload)

      // 检查业务状态码
      if (response.code === 200) {
        // 业务成功，存储 token 到内存和 localStorage
        token.value = response.data.token
        localStorage.setItem(USER_TOKEN, response.data.token)
      } else {
        // 业务失败，显示服务器返回的错误信息
        throw new Error(response.message || '登录失败')
      }
    } catch (err) {
      throw err
    }
  }

  function logout() {
    token.value = null
    // 清空用户权限和用户信息
    const userAuthStore = useUserAuthStore()
    userAuthStore.clearUserInfo()
    // 清除 localStorage 中的 token
    localStorage.removeItem(USER_TOKEN)
  }

  // 刷新 token
  async function refreshToken(): Promise<boolean> {
    if (!token.value) {
      return false
    }

    try {
      const { httpPost } = useHttp()

      const response = await httpPost<{
        code: number
        success: boolean
        message: string
        data: string
      }>('/api/user/token/refresh', {}, token.value)

      if (response.code === 200) {
        // 更新 token
        const newToken = response.data
        token.value = newToken
        localStorage.setItem(USER_TOKEN, newToken)
        return true
      } else {
        // 刷新失败，清除 token
        logout()
        return false
      }
    } catch {
      // 刷新失败，清除 token
      logout()
      return false
    }
  }

  // 获取当前 token 的 getter
  const getToken = computed(() => token.value)

  return {
    token,
    isLoggedIn,
    getToken,
    login,
    logout,
    refreshToken,
  }
})
