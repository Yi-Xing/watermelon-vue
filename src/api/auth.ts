// import { httpPost } from '@/api/http'
import type { LoginRequestPayload, LoginResponseData } from '@/types/auth'

// Mock 数据
const mockLoginData: LoginResponseData = {
  token: 'mock-jwt-token-12345',
  user: {
    id: 1,
    username: 'admin',
    email: 'admin@watermelon.com',
    role: 'admin'
  }
}

export function loginApi(payload: LoginRequestPayload): Promise<LoginResponseData> {
  // 使用 mock 数据，模拟网络延迟
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 简单的用户名密码验证
      if (payload.account === 'admin' && payload.password === '123456') {
        resolve(mockLoginData)
      } else {
        // 模拟登录失败
        reject(new Error('用户名或密码错误'))
      }
    }, 500) // 500ms 延迟模拟网络请求
  })

  // 原来的真实接口调用（暂时注释）
  // return httpPost<LoginResponseData>('/api/user/login', payload)
}
