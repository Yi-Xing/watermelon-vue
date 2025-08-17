import { useHttp } from '@/composables/useHttp'
import { useApi } from '@/composables/useApi'
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
} from '@/types/role'

// 创建角色
export async function createRole(roleData: CreateRoleRequest): Promise<CreateRoleResponse> {
  const { getAuthToken } = useApi()
  const { httpPost } = useHttp()

  const token = getAuthToken()
  const response = await httpPost<CreateRoleResponse>('/api/role', roleData, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '创建角色失败')
  }
}

// 查询角色列表
export async function getRoleList(params: RolePageParams): Promise<RoleListResponse> {
  const { getAuthToken, buildQueryParams } = useApi()
  const { httpGet } = useHttp()

  const token = getAuthToken()
  const queryString = buildQueryParams({
    name: params.name,
    state: params.state,
    pageNum: params.pageNum,
    pageSize: params.pageSize,
  })

  const url = `/api/role/list${queryString}`
  const response = await httpGet<RoleListResponse>(url, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '获取角色列表失败')
  }
}

// 获取角色详情
export async function getRoleDetail(roleId: number): Promise<RoleDetailResponse> {
  const { getAuthToken } = useApi()
  const { httpGet } = useHttp()

  const token = getAuthToken()
  const response = await httpGet<RoleDetailResponse>(`/api/role/${roleId}`, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '获取角色详情失败')
  }
}

// 更新角色
export async function updateRole(roleData: UpdateRoleRequest): Promise<UpdateRoleResponse> {
  const { getAuthToken } = useApi()
  const { httpPut } = useHttp()

  const token = getAuthToken()
  const response = await httpPut<UpdateRoleResponse>('/api/role', roleData, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '更新角色失败')
  }
}

// 删除角色
export async function deleteRole(roleId: number): Promise<DeleteRoleResponse> {
  const { getAuthToken } = useApi()
  const { httpDelete } = useHttp()

  const token = getAuthToken()
  const response = await httpDelete<DeleteRoleResponse>(`/api/role/${roleId}`, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '删除角色失败')
  }
}

// 更新角色资源
export async function updateRoleResources(
  id: number,
  resourceIds: number[],
): Promise<UpdateRoleResourcesResponse> {
  const { getAuthToken } = useApi()
  const { httpPut } = useHttp()

  const token = getAuthToken()
  const requestData: UpdateRoleResourcesRequest = {
    id,
    resourceIds,
  }

  const response = await httpPut<UpdateRoleResourcesResponse>(
    '/api/role/resource',
    requestData,
    token,
  )

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '更新角色资源失败')
  }
}
