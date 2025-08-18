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

  const token = getAuthToken()
  const response = await httpPost<CreateUserResponse>('/api/user', userData, token)

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

  const url = `/api/user/list${queryString}`
  const response = await httpGet<UserListResponse>(url, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '获取用户列表失败')
  }
}

// 获取用户详情
export async function getUserDetail(userId: number): Promise<UserDetailResponse> {
  const { getAuthToken } = useApi()
  const { httpGet } = useHttp()

  const token = getAuthToken()
  const response = await httpGet<UserDetailResponse>(`/api/user/${userId}`, token)

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
  const { getAuthToken } = useApi()
  const { httpPut } = useHttp()

  const token = getAuthToken()
  const response = await httpPut<ResetPasswordResponse>('/api/user/password', passwordData, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '重设密码失败')
  }
}

// 删除用户
export async function deleteUser(userId: number): Promise<DeleteUserResponse> {
  const { getAuthToken } = useApi()
  const { httpDelete } = useHttp()

  const token = getAuthToken()
  const response = await httpDelete<DeleteUserResponse>(`/api/user/${userId}`, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '删除用户失败')
  }
}
