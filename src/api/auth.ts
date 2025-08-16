import { useHttp } from '@/composables/useHttp'
import { useUserStore } from '@/stores/user'
import type { LoginRequestPayload, LoginResponseData } from '@/types/auth'
import type { CurrentUser, ApiResponse } from '@/types/user'

// 登录接口
export function loginApi(payload: LoginRequestPayload): Promise<LoginResponseData> {
  const { httpPost } = useHttp()
  // 登录接口不需要传递 token，使用静态 token
  return httpPost<LoginResponseData>('/api/user/login', payload)
}

// 获取当前用户信息
export async function getCurrentUser(): Promise<CurrentUser> {
  const userStore = useUserStore()
  const { httpGet } = useHttp()
  const token = userStore.getToken

  if (!token) {
    throw new Error('用户未登录')
  }

  const response = await httpGet<ApiResponse<CurrentUser>>('/api/user/current', token)

  if (response.code === 200) {
    return response.data
  } else {
    throw new Error(response.message || '获取用户信息失败')
  }
}

// 退出登录
export async function logout(): Promise<void> {
  const userStore = useUserStore()
  const { httpPost } = useHttp()
  const token = userStore.getToken

  if (!token) {
    throw new Error('用户未登录')
  }

  const response = await httpPost<{ code: number; success: boolean; message: string; data: null }>(
    '/api/user/logout',
    {},
    token,
  )

  if (response.code === 200) {
    // 退出成功后清理前端状态
    userStore.logout()
  } else {
    throw new Error(response.message || '退出登录失败')
  }
}
