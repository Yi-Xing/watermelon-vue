import { useHttp } from '@/composables/useHttp'
import { useApi } from '@/composables/useApi'
import type {
  ResourceRelationTreeNode,
  ResourceRelationDetail,
  CreateResourceRelationRequest,
  UpdateResourceRelationRequest,
  ImportResult,
} from '@/types/resourceRelation'
import type { ApiResponse, Resource, PageData } from '@/types/resource'

// 新增资源关联
export async function createResourceRelation(
  data: CreateResourceRelationRequest,
): Promise<ApiResponse<boolean>> {
  const { getAuthToken } = useApi()
  const { httpPost } = useHttp()

  const token = getAuthToken()
  const response = await httpPost<ApiResponse<boolean>>('/api/admin/resource/relation', data, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '创建资源关联失败')
  }
}

// 获取资源关联树
export async function getResourceRelationTree(params?: {
  name?: string
  code?: string
  state?: number
}): Promise<ApiResponse<ResourceRelationTreeNode[]>> {
  const { getAuthToken, buildQueryParams } = useApi()
  const { httpGet } = useHttp()

  const token = getAuthToken()
  const queryString = buildQueryParams({
    name: params?.name,
    code: params?.code,
    state: params?.state !== 0 ? params?.state : undefined,
  })

  const url = `/api/admin/resource/relation/tree${queryString}`
  const response = await httpGet<ApiResponse<ResourceRelationTreeNode[]>>(url, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '获取资源关联树失败')
  }
}

// 获取资源关联详情
export async function getResourceRelationDetail(
  id: number,
): Promise<ApiResponse<ResourceRelationDetail>> {
  const { getAuthToken, buildQueryParams } = useApi()
  const { httpGet } = useHttp()

  const token = getAuthToken()
  const queryString = buildQueryParams({ id })
  const url = `/api/admin/resource/relation${queryString}`
  const response = await httpGet<ApiResponse<ResourceRelationDetail>>(url, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '获取资源关联详情失败')
  }
}

// 更新资源关联
export async function updateResourceRelation(
  data: UpdateResourceRelationRequest,
): Promise<ApiResponse<boolean>> {
  const { getAuthToken } = useApi()
  const { httpPut } = useHttp()

  const token = getAuthToken()
  const response = await httpPut<ApiResponse<boolean>>('/api/admin/resource/relation', data, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '更新资源关联失败')
  }
}

// 删除资源关联
export async function deleteResourceRelation(id: number): Promise<ApiResponse<boolean>> {
  const { getAuthToken, buildQueryParams } = useApi()
  const { httpDelete } = useHttp()

  const token = getAuthToken()
  const queryString = buildQueryParams({ id })
  const url = `/api/admin/resource/relation${queryString}`
  const response = await httpDelete<ApiResponse<boolean>>(url, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '删除资源关联失败')
  }
}

// 导出资源关联Excel
export async function exportResourceRelations(params?: {
  name?: string
  code?: string
  state?: number
}): Promise<Blob> {
  const { getAuthToken, buildQueryParams } = useApi()
  const token = getAuthToken()

  const queryString = buildQueryParams({
    name: params?.name,
    code: params?.code,
    state: params?.state !== 0 ? params?.state : undefined,
  })

  const url = `/api/admin/resource/relation/export${queryString}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: '*/*',
    },
  })

  if (!response.ok) {
    throw new Error('导出失败')
  }

  return response.blob()
}

// 导入资源关联Excel
export async function importResourceRelations(file: File): Promise<{
  code: number
  success: boolean
  message: string
  data: ImportResult
}> {
  const { getAuthToken } = useApi()
  const token = getAuthToken()

  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/admin/resource/relation/import', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error('导入失败')
  }

  const result = await response.json()

  if (result.code === 200) {
    return result
  } else {
    throw new Error(result.message || '导入失败')
  }
}

// 获取所有资源列表（用于选择器）
export async function getAllResources(): Promise<ApiResponse<Resource[]>> {
  const { getAuthToken } = useApi()
  const { httpGet } = useHttp()

  const token = getAuthToken()
  const response = await httpGet<ApiResponse<Resource[]>>('/api/admin/resource/tree', token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '获取资源列表失败')
  }
}

// 获取分页资源列表（用于子级资源选择器）
export async function getResourceList(params: {
  name?: string
  code?: string
  pageNum?: number
  pageSize?: number
}): Promise<ApiResponse<PageData<Resource>>> {
  const { getAuthToken, buildQueryParams } = useApi()
  const { httpGet } = useHttp()

  const token = getAuthToken()
  const queryString = buildQueryParams({
    name: params?.name,
    code: params?.code,
    pageNum: params?.pageNum || 1,
    pageSize: params?.pageSize || 20,
  })

  const url = `/api/admin/resource/list${queryString}`
  const response = await httpGet<ApiResponse<PageData<Resource>>>(url, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '获取资源列表失败')
  }
}
