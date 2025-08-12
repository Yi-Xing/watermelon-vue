export interface LoginRequestPayload {
  account: string
  password: string
}

export interface LoginResponseData {
  token?: string
  [key: string]: unknown
}
