// 资源类型枚举
export enum ResourceType {
  PAGE = 1, // 页面
  BUTTON = 2, // 按钮
  API = 3, // 接口
  DIRECTORY = 4, // 目录
}

// 资源状态枚举
export enum ResourceStatus {
  ENABLED = 1, // 启用
  DISABLED = 2, // 禁用
}

// 资源接口
export interface Resource {
  id: number
  parentId?: number
  parentName?: string
  name: string
  type: ResourceType
  typeDesc: string // 资源类型描述
  code: string
  orderNum: number // 改为orderNum与后端一致
  state: number // 改为state与后端一致
  stateDesc: string // 状态描述
  remark?: string
  children?: Resource[]
  createdBy?: {
    id: number
    name: string
  }
  createdTime?: string
  updatedBy?: {
    id: number
    name: string
  }
  updatedTime?: string
}

// 资源表单接口
export interface ResourceForm {
  id?: string | number
  parentId: string | number
  parentName?: string
  name: string
  type: ResourceType
  code: string
  orderNum: number // 改为orderNum与后端一致
  state: number // 改为state与后端一致
  remark: string
}

// 资源搜索表单接口
export interface ResourceSearchForm {
  name: string
  code: string
  state: number // 改为state与后端一致，0: 全部, 1: 启用, 2: 禁用
  pageNum: number
  pageSize: number
}

// 从通用类型导入
export type { ApiResponse, PageData } from './common'

// 创建资源请求
export interface CreateResourceRequest {
  name: string
  type: number
  code: string
  state: number
  remark: string
}

// 创建资源响应
export interface CreateResourceResponse {
  code: number
  success: boolean
  message: string
}

// 更新资源请求
export interface UpdateResourceRequest {
  id: number
  name: string
  type: number
  code: string
  state: number
  remark: string
}

// 更新资源响应
export interface UpdateResourceResponse {
  code: number
  success: boolean
  message: string
}

// 删除资源响应
export interface DeleteResourceResponse {
  code: number
  success: boolean
  message: string
}
export type { ImportResult } from './common'
