import { useHttp } from '@/composables/useHttp'
import { useApi } from '@/composables/useApi'
import type {
  Resource,
  CreateResourceRequest,
  CreateResourceResponse,
  UpdateResourceRequest,
  UpdateResourceResponse,
  DeleteResourceResponse,
  ApiResponse,
} from '@/types/resource'

// 获取资源树
export async function getResourceTree(params?: {
  name?: string
  state?: number
  code?: string
}): Promise<ApiResponse<Resource[]>> {
  const { getAuthToken, buildQueryParams } = useApi()
  const { httpGet } = useHttp()

  const token = getAuthToken()
  const queryString = buildQueryParams({
    name: params?.name,
    state: params?.state !== 0 ? params?.state : undefined,
    code: params?.code,
  })

  const url = `/api/admin/resource/tree${queryString}`
  const response = await httpGet<ApiResponse<Resource[]>>(url, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '获取资源树失败')
  }
}

// 新增资源
export async function createResource(
  resource: CreateResourceRequest,
): Promise<CreateResourceResponse> {
  const { getAuthToken } = useApi()
  const { httpPost } = useHttp()

  const token = getAuthToken()
  const response = await httpPost<CreateResourceResponse>('/api/admin/resource', resource, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '创建资源失败')
  }
}

// 更新资源
export async function updateResource(
  resource: UpdateResourceRequest,
): Promise<UpdateResourceResponse> {
  const { getAuthToken } = useApi()
  const { httpPut } = useHttp()

  const token = getAuthToken()
  const response = await httpPut<UpdateResourceResponse>('/api/admin/resource', resource, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '更新资源失败')
  }
}

// 删除资源
export async function deleteResource(id: string | number): Promise<DeleteResourceResponse> {
  const { getAuthToken, buildQueryParams } = useApi()
  const { httpDelete } = useHttp()

  const token = getAuthToken()
  const queryString = buildQueryParams({ id })
  const url = `/api/admin/resource${queryString}`
  const response = await httpDelete<DeleteResourceResponse>(url, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '删除资源失败')
  }
}

// 获取资源详情
export async function getResourceDetail(id: string | number): Promise<ApiResponse<Resource>> {
  const { getAuthToken, buildQueryParams } = useApi()
  const { httpGet } = useHttp()

  const token = getAuthToken()
  const queryString = buildQueryParams({ id })
  const url = `/api/admin/resource${queryString}`
  const response = await httpGet<ApiResponse<Resource>>(url, token)

  if (response.code === 200) {
    return response
  } else {
    throw new Error(response.message || '获取资源详情失败')
  }
}

// 导入资源
export async function importResources(file: File): Promise<{
  code: number
  success: boolean
  message: string
  data: {
    totalRows: number
    insertedRows: number
    updatedRows: number
    deletedRows: number
    errors: string[] | null
    success: boolean
  }
}> {
  const { getAuthToken } = useApi()
  const token = getAuthToken()

  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/api/admin/resource/import', {
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

// 导出资源
export async function exportResources(params?: {
  name?: string
  state?: number
  code?: string
}): Promise<Blob> {
  const { getAuthToken, buildQueryParams } = useApi()
  const token = getAuthToken()

  const queryString = buildQueryParams({
    name: params?.name,
    state: params?.state !== 0 ? params?.state : undefined,
    code: params?.code,
  })

  const url = `/api/admin/resource/export${queryString}`

  // 使用fetch直接处理文件流
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
