export interface LoginRequestPayload {
  account: string
  password: string
}

export interface LoginResponseData {
  code: number
  success: boolean
  message: string
  data: {
    token: string
  }
}
