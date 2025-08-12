import type { LoginRequestPayload, LoginResponseData } from '@/types/auth'
import { loginApi } from '@/api/auth'

export async function login(request: LoginRequestPayload): Promise<LoginResponseData> {
  return await loginApi(request)
}
