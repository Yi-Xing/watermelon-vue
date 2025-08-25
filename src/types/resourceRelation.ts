// 资源关联类型定义

// 资源关联搜索表单
export interface ResourceRelationSearchForm {
  name: string
  code: string
  state: number // 0: 全部, 1: 启用, 2: 禁用
}

// 资源关联树节点
export interface ResourceRelationTreeNode {
  id: number
  resourceId: number
  resourcePath: string
  name: string
  type: number
  typeDesc: string
  code: string
  orderNum: number
  state: number
  stateDesc: string
  remark: string
  createdTime: string
  updatedTime: string
  children?: ResourceRelationTreeNode[]
  hasChildren?: boolean
  uniqueId?: string
}

// 资源关联详情
export interface ResourceRelationDetail {
  id: number
  parentId: number
  parentName: string
  parentCode: string
  childId: number
  childName: string
  childCode: string
  orderNum: number
}

// 资源关联表单
export interface ResourceRelationForm {
  id?: number
  parentId: number
  parentName: string
  childId: number
  childName: string
  orderNum: number
}

// 创建资源关联请求
export interface CreateResourceRelationRequest {
  parentId: number
  childId: number
  orderNum: number
}

// 更新资源关联请求
export interface UpdateResourceRelationRequest {
  id: number
  parentId: number
  childId: number
  orderNum: number
}

// 资源关联选择器节点
export interface ResourceSelectorNode {
  id: number
  name: string
  code: string
  type: number
  children?: ResourceSelectorNode[]
}

// 导入结果类型从通用类型导入
export type { ImportResult } from './common'
