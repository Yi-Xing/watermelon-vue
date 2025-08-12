import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { login as loginRequest } from '@/services/auth'
import type { LoginRequestPayload, LoginResponseData } from '@/types/auth'

export interface UserProfile {
  account: string
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(null)
  const profile = ref<UserProfile | null>(null)
  const loading = ref(false)
  const errorMessage = ref<string | null>(null)

  const isLoggedIn = computed(() => Boolean(token.value))

  async function login(payload: LoginRequestPayload) {
    loading.value = true
    errorMessage.value = null
    try {
      const data: LoginResponseData = await loginRequest(payload)
      // 尝试解析 token；如果后端返回字段名不同，可在此适配
      token.value = (data.token as string) ?? null
      profile.value = { account: payload.account }
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
  }

  return {
    token,
    profile,
    loading,
    errorMessage,
    isLoggedIn,
    login,
    logout,
  }
})
