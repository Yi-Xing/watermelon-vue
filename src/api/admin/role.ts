import { useHttp } from '@/composables/useHttp'
import { useUserStore } from '@/stores/user'
import type {
  CreateRoleRequest,
  CreateRoleResponse,
  UpdateRoleRequest,
  UpdateRoleResponse,
  DeleteRoleResponse,
  RolePageParams,
  RoleListResponse,
  RoleDetailResponse,
  UpdateRoleResourcesRequest,
  UpdateRoleResourcesResponse,
  GetRoleResourcesResponse,
} from '@/types/role'

// 创建角色
export async function createRole(roleData: CreateRoleRequest): Promise<CreateRoleResponse> {
  const userStore = useUserStore()
  const { httpPost } = useHttp()
  const token = userStore.getToken

  if (!token) {
    throw new Error('用户未登录')
  }

  const response = await httpPost<CreateRoleResponse>('/api/role', roleData, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '创建角色失败')
  }
}

// 查询角色列表
export async function getRoleList(params: RolePageParams): Promise<RoleListResponse> {
  const userStore = useUserStore()
  const { httpGet } = useHttp()
  const token = userStore.getToken

  if (!token) {
    throw new Error('用户未登录')
  }

  // 构建查询参数
  const queryParams = new URLSearchParams()
  if (params.name) queryParams.append('name', params.name)
  if (params.state !== undefined) queryParams.append('state', params.state.toString())
  queryParams.append('pageNum', params.pageNum.toString())
  queryParams.append('pageSize', params.pageSize.toString())

  const url = `/api/role/list?${queryParams.toString()}`
  const response = await httpGet<RoleListResponse>(url, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '获取角色列表失败')
  }
}

// 获取角色详情
export async function getRoleDetail(roleId: number): Promise<RoleDetailResponse> {
  const userStore = useUserStore()
  const { httpGet } = useHttp()
  const token = userStore.getToken

  if (!token) {
    throw new Error('用户未登录')
  }

  const response = await httpGet<RoleDetailResponse>(`/api/role/${roleId}`, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '获取角色详情失败')
  }
}

// 更新角色
export async function updateRole(roleData: UpdateRoleRequest): Promise<UpdateRoleResponse> {
  const userStore = useUserStore()
  const { httpPut } = useHttp()
  const token = userStore.getToken

  if (!token) {
    throw new Error('用户未登录')
  }

  const response = await httpPut<UpdateRoleResponse>('/api/role', roleData, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '更新角色失败')
  }
}

// 删除角色
export async function deleteRole(roleId: number): Promise<DeleteRoleResponse> {
  const userStore = useUserStore()
  const { httpDelete } = useHttp()
  const token = userStore.getToken

  if (!token) {
    throw new Error('用户未登录')
  }

  const response = await httpDelete<DeleteRoleResponse>(`/api/role/${roleId}`, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '删除角色失败')
  }
}

// 获取角色资源
export async function getRoleResources(roleId: number): Promise<GetRoleResourcesResponse> {
  const userStore = useUserStore()
  const { httpGet } = useHttp()
  const token = userStore.getToken

  if (!token) {
    throw new Error('用户未登录')
  }

  const response = await httpGet<GetRoleResourcesResponse>(`/api/role/${roleId}/resources`, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '获取角色资源失败')
  }
}

// 更新角色资源
export async function updateRoleResources(
  roleId: number,
  resourceIds: number[],
): Promise<UpdateRoleResourcesResponse> {
  const userStore = useUserStore()
  const { httpPut } = useHttp()
  const token = userStore.getToken

  if (!token) {
    throw new Error('用户未登录')
  }

  const requestData: UpdateRoleResourcesRequest = {
    roleId,
    resourceIds,
  }

  const response = await httpPut<UpdateRoleResourcesResponse>(
    '/api/role/resources',
    requestData,
    token,
  )

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '更新角色资源失败')
  }
}
