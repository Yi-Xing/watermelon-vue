import { envConfig } from '@/config/env'

export async function httpGet<T>(pathOrUrl: string, token?: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }

  // 如果有 token，使用动态 token；否则使用静态 token
  if (token) {
    headers.Authorization = `Bearer ${token}`
  } else {
    headers.Authorization = 'Bearer xxx'
  }

  const response = await fetch(normalizeUrl(pathOrUrl), {
    method: 'GET',
    headers,
  })

  if (!response.ok) {
    const text = await safeReadText(response)
    throw new Error(`请求失败: ${response.status} ${text}`)
  }

  return (await response.json()) as T
}

export async function httpPost<T>(pathOrUrl: string, body: unknown, token?: string): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // 如果有 token，使用动态 token；否则使用静态 token
  if (token) {
    headers.Authorization = `Bearer ${token}`
  } else {
    headers.Authorization = 'Bearer xxx'
  }

  const response = await fetch(normalizeUrl(pathOrUrl), {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const text = await safeReadText(response)
    throw new Error(`请求失败: ${response.status} ${text}`)
  }

  return (await response.json()) as T
}

function normalizeUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl
  }

  // 开发环境：直接返回路径，通过 Vite 代理转发
  if (envConfig.IS_DEV) {
    return pathOrUrl
  }

  // 生产环境：拼接完整URL
  return `${envConfig.API_BASE_URL}${pathOrUrl}`
}

async function safeReadText(res: Response): Promise<string> {
  try {
    return await res.text()
  } catch {
    return ''
  }
}
