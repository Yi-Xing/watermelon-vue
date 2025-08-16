// 当前用户信息接口
export interface CurrentUser {
  id: number
  name: string
  email: string
  phone: string
  remark: string
  createdTime: string
}

// API 响应接口
export interface ApiResponse<T> {
  code: number
  success: boolean
  message: string
  data: T
}
