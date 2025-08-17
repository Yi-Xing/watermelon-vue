// 当前用户信息接口
export interface CurrentUser {
  id: number
  name: string
  email: string
  phone: string
  remark: string
  createdTime: string
  updatedTime: string
}

// 创建用户请求参数
export interface CreateUserRequest {
  name: string
  email: string
  phone: string
  password: string
  state: number
  remark: string
  roleIds: number[]
}

// 更新用户请求参数
export interface UpdateUserRequest {
  id: number
  name: string
  email: string
  phone: string
  state: number
  remark: string
  roleIds: number[]
}

// 创建用户响应
export interface CreateUserResponse {
  code: number
  success: boolean
  message: string
}

// 更新用户响应
export interface UpdateUserResponse {
  code: number
  success: boolean
  message: string
  data: boolean
}

// 重设密码请求参数
export interface ResetPasswordRequest {
  id: number
  password: string
}

// 重设密码响应
export interface ResetPasswordResponse {
  code: number
  success: boolean
  message: string
  data: boolean
}

// 删除用户响应
export interface DeleteUserResponse {
  code: number
  success: boolean
  message: string
  data: null
}

// 用户列表项
export interface UserListItem {
  id: number
  name: string
  email: string
  phone: string
  state: number
  stateDesc: string
  remark: string
  createdBy: string | null
  createdTime: string
  updatedBy: string | null
  updatedTime: string
  roles: Array<{ id: number; name: string }> | null
}

// 用户详情（包含更多信息）
export interface UserDetail {
  id: number
  name: string
  email: string
  phone: string
  state: number
  stateDesc: string
  remark: string
  createdBy: {
    id: number
    name: string
  } | null
  createdTime: string
  updatedBy: {
    id: number
    name: string
  } | null
  updatedTime: string
  roles: Array<{ id: number; name: string }>
}

// 获取用户详情响应
export interface UserDetailResponse {
  code: number
  success: boolean
  message: string
  data: UserDetail
}

// 分页参数
export interface PageParams {
  keyword?: string
  state?: number
  pageNum: number
  pageSize: number
}

// 分页响应
export interface PageResponse<T> {
  dataList: T[]
  total: number
  current: number
  size: number
  pages: number
  hasPrevious: boolean
  hasNext: boolean
}

// 查询用户列表响应
export interface UserListResponse {
  code: number
  success: boolean
  message: string
  data: PageResponse<UserListItem>
}

// API 响应接口
export interface ApiResponse<T> {
  code: number
  success: boolean
  message: string
  data: T
}
