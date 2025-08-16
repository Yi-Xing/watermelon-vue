import { useHttp } from '@/composables/useHttp'
import { useUserStore } from '@/stores/user'
import type {
  CurrentUser,
  ApiResponse,
  CreateUserRequest,
  CreateUserResponse,
  PageParams,
  UserListResponse,
  UserDetailResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  DeleteUserResponse,
} from '@/types/user'

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

// 创建用户
export async function createUser(userData: CreateUserRequest): Promise<CreateUserResponse> {
  const userStore = useUserStore()
  const { httpPost } = useHttp()
  const token = userStore.getToken

  if (!token) {
    throw new Error('用户未登录')
  }

  const response = await httpPost<CreateUserResponse>('/api/user', userData, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '创建用户失败')
  }
}

// 查询用户列表
export async function getUserList(params: PageParams): Promise<UserListResponse> {
  const userStore = useUserStore()
  const { httpGet } = useHttp()
  const token = userStore.getToken

  if (!token) {
    throw new Error('用户未登录')
  }

  // 构建查询参数
  const queryParams = new URLSearchParams()
  if (params.keyword) queryParams.append('keyword', params.keyword)
  if (params.state !== undefined) queryParams.append('state', params.state.toString())
  queryParams.append('pageNum', params.pageNum.toString())
  queryParams.append('pageSize', params.pageSize.toString())

  const url = `/api/user/list?${queryParams.toString()}`
  const response = await httpGet<UserListResponse>(url, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '获取用户列表失败')
  }
}

// 获取用户详情
export async function getUserDetail(userId: number): Promise<UserDetailResponse> {
  const userStore = useUserStore()
  const { httpGet } = useHttp()
  const token = userStore.getToken

  if (!token) {
    throw new Error('用户未登录')
  }

  const response = await httpGet<UserDetailResponse>(`/api/user/${userId}`, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '获取用户详情失败')
  }
}

// 更新用户
export async function updateUser(userData: UpdateUserRequest): Promise<UpdateUserResponse> {
  const userStore = useUserStore()
  const { httpPut } = useHttp()
  const token = userStore.getToken

  if (!token) {
    throw new Error('用户未登录')
  }

  const response = await httpPut<UpdateUserResponse>('/api/user', userData, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '更新用户失败')
  }
}

// 重设密码
export async function resetPassword(
  passwordData: ResetPasswordRequest,
): Promise<ResetPasswordResponse> {
  const userStore = useUserStore()
  const { httpPut } = useHttp()
  const token = userStore.getToken

  if (!token) {
    throw new Error('用户未登录')
  }

  const response = await httpPut<ResetPasswordResponse>('/api/user/password', passwordData, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '重设密码失败')
  }
}

// 删除用户
export async function deleteUser(userId: number): Promise<DeleteUserResponse> {
  const userStore = useUserStore()
  const { httpDelete } = useHttp()
  const token = userStore.getToken

  if (!token) {
    throw new Error('用户未登录')
  }

  const response = await httpDelete<DeleteUserResponse>(`/api/user/${userId}`, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '删除用户失败')
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
