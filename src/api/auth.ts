import { httpPost } from '@/api/http'
import type { LoginRequestPayload, LoginResponseData } from '@/types/auth'

export function loginApi(payload: LoginRequestPayload): Promise<LoginResponseData> {
  // 登录接口不需要传递 token，使用静态 token
  return httpPost<LoginResponseData>('/api/user/login', payload)
}
