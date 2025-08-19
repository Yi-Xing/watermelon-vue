import { useHttp } from '@/composables/useHttp'
import { useApi } from '@/composables/useApi'
import type {
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

// 创建用户
export async function createUser(userData: CreateUserRequest): Promise<CreateUserResponse> {
  const { getAuthToken } = useApi()
  const { httpPost } = useHttp()

  // 只有在提供密码时才进行加密
  const processedUserData = { ...userData }
  if (userData.password) {
    const { usePassword } = await import('@/composables/usePassword')
    const { hashPassword } = usePassword()
    processedUserData.password = hashPassword(userData.password)
  }

  const token = getAuthToken()
  const response = await httpPost<CreateUserResponse>('/api/admin/user', processedUserData, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '创建用户失败')
  }
}

// 查询用户列表
export async function getUserList(params: PageParams): Promise<UserListResponse> {
  const { getAuthToken, buildQueryParams } = useApi()
  const { httpGet } = useHttp()

  const token = getAuthToken()
  const queryString = buildQueryParams({
    keyword: params.keyword,
    state: params.state,
    pageNum: params.pageNum,
    pageSize: params.pageSize,
  })

  const url = `/api/admin/user/list${queryString}`
  const response = await httpGet<UserListResponse>(url, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '获取用户列表失败')
  }
}

// 获取用户详情
export async function getUserDetail(userId: number): Promise<UserDetailResponse> {
  const { getAuthToken, buildQueryParams } = useApi()
  const { httpGet } = useHttp()

  const token = getAuthToken()
  const queryString = buildQueryParams({ id: userId })
  const url = `/api/admin/user${queryString}`
  const response = await httpGet<UserDetailResponse>(url, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '获取用户详情失败')
  }
}

// 更新用户
export async function updateUser(userData: UpdateUserRequest): Promise<UpdateUserResponse> {
  const { getAuthToken } = useApi()
  const { httpPut } = useHttp()

  const token = getAuthToken()
  const response = await httpPut<UpdateUserResponse>('/api/admin/user', userData, token)

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
  const { getAuthToken } = useApi()
  const { httpPut } = useHttp()
  const { usePassword } = await import('@/composables/usePassword')

  // 对密码进行加密
  const { hashPassword } = usePassword()
  const encryptedPasswordData = {
    ...passwordData,
    password: hashPassword(passwordData.password),
  }

  const token = getAuthToken()
  const response = await httpPut<ResetPasswordResponse>(
    '/api/admin/user/password',
    encryptedPasswordData,
    token,
  )

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '重设密码失败')
  }
}

// 删除用户
export async function deleteUser(userId: number): Promise<DeleteUserResponse> {
  const { getAuthToken, buildQueryParams } = useApi()
  const { httpDelete } = useHttp()

  const token = getAuthToken()
  const queryString = buildQueryParams({ id: userId })
  const url = `/api/admin/user${queryString}`
  const response = await httpDelete<DeleteUserResponse>(url, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '删除用户失败')
  }
}
