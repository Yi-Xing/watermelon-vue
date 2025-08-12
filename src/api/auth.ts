import { httpPost } from '@/api/http'
import type { LoginRequestPayload, LoginResponseData } from '@/types/auth'

const LOGIN_PATH = '/api/user/login'

export function loginApi(payload: LoginRequestPayload): Promise<LoginResponseData> {
  return httpPost<LoginResponseData>(LOGIN_PATH, payload)
}
