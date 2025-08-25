// 通用类型定义

// 导入结果
export interface ImportResult {
  totalCount: number
  insertCount: number
  updateCount: number
  deleteCount: number
  errors: string[] | null
  success: boolean
}

// 分页数据
export interface PageData<T> {
  dataList: T[]
  total: number
  current: number
  pageSize: number
}

// API响应
export interface ApiResponse<T> {
  code: number
  success: boolean
  message: string
  data: T
}
