import { useUserStore } from '@/stores/userToken'

// 通用的API工具函数
export function useApi() {
  const userStore = useUserStore()

  // 获取认证token
  const getAuthToken = () => {
    const token = userStore.getToken
    if (!token) {
      throw new Error('用户未登录')
    }
    return token
  }

  // 验证API响应
  const validateResponse = <T>(response: T, errorMessage: string): T => {
    if (response && typeof response === 'object' && 'code' in response) {
      const apiResponse = response as { code: number; message?: string }
      if (apiResponse.code === 200) {
        return response
      } else {
        throw new Error(apiResponse.message || errorMessage)
      }
    }
    return response
  }

  // 构建查询参数
  const buildQueryParams = (params?: Record<string, string | number | undefined>): string => {
    if (!params) return ''

    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString())
      }
    })

    const queryString = queryParams.toString()
    return queryString ? `?${queryString}` : ''
  }

  return {
    getAuthToken,
    validateResponse,
    buildQueryParams,
  }
}
