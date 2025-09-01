import { envConfig } from '@/config/env'
import { useUserStore } from '@/stores/userToken'
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
    window.location.replace('/login')
  }
}

// 处理HTTP错误响应
async function handleHttpError(response: Response): Promise<never> {
  // 处理401未授权错误
  if (response.status === 401) {
    handleUnauthorized()
    throw new Error('登录已失效')
  }
  if (response.status === 403) {
    console.log('无权限操作')
    throw new Error('无权限操作')
  }
  if (response.status === 500) {
    throw new Error('服务器异常，请稍后重试')
  }
  const text = await safeReadText(response)
  // 其他错误状态码
  throw new Error(`请求失败: ${response.status} ${text}`)
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

    // 添加 traceparent 头部用于分布式追踪
    const traceparent = generateTraceparent()
    if (traceparent) {
      headers.traceparent = traceparent
    }

    const response = await fetch(normalizeUrl(pathOrUrl), {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      // 使用统一的错误处理函数
      await handleHttpError(response)
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

    // 添加 traceparent 头部用于分布式追踪
    const traceparent = generateTraceparent()
    if (traceparent) {
      headers.traceparent = traceparent
    }

    const response = await fetch(normalizeUrl(pathOrUrl), {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      // 使用统一的错误处理函数
      await handleHttpError(response)
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

    // 添加 traceparent 头部用于分布式追踪
    const traceparent = generateTraceparent()
    if (traceparent) {
      headers.traceparent = traceparent
    }

    const response = await fetch(normalizeUrl(pathOrUrl), {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      // 使用统一的错误处理函数
      await handleHttpError(response)
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

    // 添加 traceparent 头部用于分布式追踪
    const traceparent = generateTraceparent()
    if (traceparent) {
      headers.traceparent = traceparent
    }

    const response = await fetch(normalizeUrl(pathOrUrl), {
      method: 'DELETE',
      headers,
    })

    if (!response.ok) {
      // 使用统一的错误处理函数
      await handleHttpError(response)
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

// 生成 traceparent 头部值
function generateTraceparent(): string | null {
  try {
    // 生成随机的 trace ID 和 span ID
    const traceId = generateRandomHex(32)
    const spanId = generateRandomHex(16)
    const traceFlags = '00' // 采样标志

    return `00-${traceId}-${spanId}-${traceFlags}`
  } catch {
    return null
  }
}

// 生成指定长度的随机十六进制字符串
function generateRandomHex(length: number): string {
    const arr = new Uint8Array(length / 2)
    crypto.getRandomValues(arr)
    return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('')
}
