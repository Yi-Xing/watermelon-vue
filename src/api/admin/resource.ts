import { useHttp } from '@/composables/useHttp'
import type { Resource, ResourceForm, ResourceSearchForm } from '@/types/resource'

// 获取资源列表
export async function getResourceList(params?: ResourceSearchForm): Promise<Resource[]> {
  const { httpPost } = useHttp()
  return httpPost<Resource[]>('/api/resources/list', params || {})
}

// 获取资源树
export async function getResourceTree(): Promise<Resource[]> {
  const { httpPost } = useHttp()
  return httpPost<Resource[]>('/api/resources/tree', {})
}

// 新增资源
export async function createResource(resource: ResourceForm): Promise<Resource> {
  const { httpPost } = useHttp()
  return httpPost<Resource>('/api/resources/create', resource)
}

// 更新资源
export async function updateResource(resource: ResourceForm): Promise<Resource> {
  const { httpPost } = useHttp()
  return httpPost<Resource>('/api/resources/update', resource)
}

// 删除资源
export async function deleteResource(id: string | number): Promise<void> {
  const { httpPost } = useHttp()
  return httpPost<void>('/api/resources/delete', { id })
}

// 获取资源详情
export async function getResourceDetail(id: string | number): Promise<Resource> {
  const { httpPost } = useHttp()
  return httpPost<Resource>('/api/resources/detail', { id })
}

// 导入资源
export async function importResources(file: File): Promise<void> {
  const formData = new FormData()
  formData.append('file', file)

  // 这里需要特殊处理文件上传，暂时返回空
  return Promise.resolve()
}

// 导出资源
export async function exportResources(params?: ResourceSearchForm): Promise<Blob> {
  const response = await fetch('/api/resources/export', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params || {}),
  })

  if (!response.ok) {
    throw new Error('导出失败')
  }

  return response.blob()
}
