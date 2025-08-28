import { useHttp } from '@/composables/useHttp'
import { useApi } from '@/composables/useApi'
import { useUserStore } from '@/stores/userToken'
import type { LoginRequestPayload, LoginResponseData } from '@/types/auth'
import type { CurrentUser, ApiResponse } from '@/types/user'

// 登录接口
export async function loginApi(payload: LoginRequestPayload): Promise<LoginResponseData> {
  const { httpPost } = useHttp()
  const { usePassword } = await import('@/composables/usePassword')

  // 对密码进行加密
  const { hashPassword } = usePassword()
  const encryptedPayload = {
    ...payload,
    password: hashPassword(payload.password),
  }

  // 登录接口不需要传递 token，使用静态 token
  return httpPost<LoginResponseData>('/api/user/login', encryptedPayload)
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const { getAuthToken } = useApi()
  const { httpGet } = useHttp()

  const token = getAuthToken()
  const response = await httpGet<ApiResponse<CurrentUser>>('/api/user/current', token)

  if (response.code === 200) {
    // 检查 token 是否在3天内过期，如果是则自动刷新
    const expireTime = new Date(response.data.expireTime)
    const now = new Date()
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

    if (expireTime <= threeDaysFromNow) {
      // 导入 user store 并刷新 token
      const userStore = useUserStore()
      const refreshSuccess = await userStore.refreshToken()

      if (!refreshSuccess) {
        throw new Error('Token 刷新失败，请重新登录')
      }
    }

    return response.data
  } else {
    throw new Error(response.message || '获取用户信息失败')
  }
}

// 退出登录
export async function logout(): Promise<void> {
  const { getAuthToken } = useApi()
  const { httpPost } = useHttp()

  const token = getAuthToken()
  const response = await httpPost<{ code: number; success: boolean; message: string; data: null }>(
    '/api/user/logout',
    {},
    token,
  )

  if (response.code === 200) {
    // 退出成功后清理前端状态
    const userStore = useUserStore()
    userStore.logout()
  } else {
    throw new Error(response.message || '退出登录失败')
  }
}
