// 角色基本信息
export interface Role {
  id: number
  name: string
  orderNum: number
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
  resourceIds?: number[]
}

// 创建角色请求参数
export interface CreateRoleRequest {
  name: string
  orderNum: number
  state: number
  remark: string
}

// 更新角色请求参数
export interface UpdateRoleRequest {
  id: number
  name: string
  orderNum: number
  state: number
  remark: string
}

// 创建角色响应
export interface CreateRoleResponse {
  code: number
  success: boolean
  message: string
}

// 更新角色响应
export interface UpdateRoleResponse {
  code: number
  success: boolean
  message: string
  data: boolean
}

// 删除角色响应
export interface DeleteRoleResponse {
  code: number
  success: boolean
  message: string
  data: null
}

// 分页参数
export interface RolePageParams {
  name?: string
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

// 查询角色列表响应
export interface RoleListResponse {
  code: number
  success: boolean
  message: string
  data: PageResponse<Role>
}

// 获取角色详情响应
export interface RoleDetailResponse {
  code: number
  success: boolean
  message: string
  data: Role
}

// 资源信息
export interface Resource {
  id: number
  name: string
  children?: Resource[]
}

// 更新角色资源请求
export interface UpdateRoleResourcesRequest {
  id: number
  resourceIds: number[]
}

// 更新角色资源响应
export interface UpdateRoleResourcesResponse {
  code: number
  success: boolean
  message: string
  data: boolean
}
