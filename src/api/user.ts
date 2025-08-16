import { httpGet, httpPost } from './http'
import { useUserStore } from '@/stores/user'
import type { CurrentUser, ApiResponse } from '@/types/user'

// 用户信息更新接口
interface UserUpdateData {
  name?: string
  email?: string
  phone?: string
  remark?: string
}

// 获取当前用户信息
export async function getCurrentUser(): Promise<CurrentUser> {
  const userStore = useUserStore()
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

// 更新用户信息示例
export async function updateUserInfo(userData: UserUpdateData) {
  const userStore = useUserStore()
  const token = userStore.getToken

  if (!token) {
    throw new Error('用户未登录')
  }

  return httpPost('/api/user/update', userData, token)
}
