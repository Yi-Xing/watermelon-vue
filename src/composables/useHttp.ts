import { envConfig } from '@/config/env'
import { useUserStore } from '@/stores/user'
import { LOGIN_EXPIRED_MESSAGE } from '@/constants/localStorageKey'

// 处理401未授权错误
function handleUnauthorized() {
  const userStore = useUserStore()

  // 清理用户状态
  userStore.logout()

  // 将提示信息存储到localStorage，让登录页面显示
  localStorage.setItem(LOGIN_EXPIRED_MESSAGE, '登录已失效，请重新登录')

  // 重定向到登录页面
  if (window.location.pathname !== '/login') {
    window.location.href = '/login'
  }
}

export function useHttp() {
  const httpGet = async <T>(pathOrUrl: string, token?: string): Promise<T> => {
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
      // 处理401未授权错误
      if (response.status === 401) {
        handleUnauthorized()
        throw new Error('登录已失效')
      }

      const text = await safeReadText(response)
      throw new Error(`请求失败: ${response.status} ${text}`)
    }

    return (await response.json()) as T
  }

  const httpPost = async <T>(pathOrUrl: string, body: unknown, token?: string): Promise<T> => {
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
      // 处理401未授权错误
      if (response.status === 401) {
        handleUnauthorized()
        throw new Error('登录已失效')
      }

      const text = await safeReadText(response)
      throw new Error(`请求失败: ${response.status} ${text}`)
    }

    return (await response.json()) as T
  }

  const httpPut = async <T>(pathOrUrl: string, body: unknown, token?: string): Promise<T> => {
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
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      // 处理401未授权错误
      if (response.status === 401) {
        handleUnauthorized()
        throw new Error('登录已失效')
      }

      const text = await safeReadText(response)
      throw new Error(`请求失败: ${response.status} ${text}`)
    }

    return (await response.json()) as T
  }

  const httpDelete = async <T>(pathOrUrl: string, token?: string): Promise<T> => {
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
      method: 'DELETE',
      headers,
    })

    if (!response.ok) {
      // 处理401未授权错误
      if (response.status === 401) {
        handleUnauthorized()
        throw new Error('登录已失效')
      }

      const text = await safeReadText(response)
      throw new Error(`请求失败: ${response.status} ${text}`)
    }

    return (await response.json()) as T
  }

  return {
    httpGet,
    httpPost,
    httpPut,
    httpDelete,
  }
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
