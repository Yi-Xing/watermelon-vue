// 资源类型枚举
export enum ResourceType {
  PAGE = 1, // 页面
  BUTTON = 2, // 按钮
  API = 3, // 接口
}

// 资源状态枚举
export enum ResourceStatus {
  ENABLED = 1, // 启用
  DISABLED = 2, // 禁用
}

// 资源接口
export interface Resource {
  id: string | number
  parentId?: string | number
  parentName?: string
  name: string
  type: ResourceType
  code: string
  sort: number
  status: ResourceStatus
  remark?: string
  children?: Resource[]
  createdAt?: string
  updatedAt?: string
}

// 资源表单接口
export interface ResourceForm {
  id: string | number
  parentId: string | number
  parentName: string
  name: string
  type: ResourceType
  code: string
  sort: number
  status: ResourceStatus
  remark: string
}

// 资源搜索表单接口
export interface ResourceSearchForm {
  name: string
  code: string
  status: number // 0: 全部, 1: 启用, 2: 禁用
}

// 资源树节点接口
export interface ResourceTreeNode {
  id: string | number
  name: string
  children?: ResourceTreeNode[]
}
