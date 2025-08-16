import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { login as loginRequest } from '@/services/auth'
import type { LoginRequestPayload, LoginResponseData } from '@/types/auth'

export interface UserProfile {
  account: string
}

export const useUserStore = defineStore('user', () => {
  // 从 localStorage 初始化 token，如果没有则设为 null
  const token = ref<string | null>(localStorage.getItem('user_token'))
  const profile = ref<UserProfile | null>(null)
  const loading = ref(false)
  const errorMessage = ref<string | null>(null)

  const isLoggedIn = computed(() => Boolean(token.value))

  async function login(payload: LoginRequestPayload) {
    loading.value = true
    errorMessage.value = null
    try {
      const response: LoginResponseData = await loginRequest(payload)

      // 检查业务状态码
      if (response.code === 200) {
        // 业务成功，存储 token 到内存和 localStorage
        token.value = response.data.token
        localStorage.setItem('user_token', response.data.token)
        profile.value = { account: payload.account }
      } else {
        // 业务失败，显示服务器返回的错误信息
        throw new Error(response.message || '登录失败')
      }
    } catch (err) {
      errorMessage.value = err instanceof Error ? err.message : String(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function logout() {
    token.value = null
    profile.value = null
    // 清除 localStorage 中的 token
    localStorage.removeItem('user_token')
  }

  // 检查 token 是否有效
  function checkTokenValidity() {
    const storedToken = localStorage.getItem('user_token')
    if (storedToken && storedToken !== token.value) {
      // 如果 localStorage 中有 token 但内存中没有，同步到内存
      token.value = storedToken
    }
    return Boolean(token.value)
  }

  // 获取当前 token 的 getter
  const getToken = computed(() => token.value)

  return {
    token,
    profile,
    loading,
    errorMessage,
    isLoggedIn,
    getToken,
    checkTokenValidity,
    login,
    logout,
  }
})
