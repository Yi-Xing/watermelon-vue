export const API_BASE_URL = 'http://127.0.0.1:8080'
export const STATIC_AUTH_HEADER = 'Bearer ff3a1472-c7b9-4cd1-b0ba-6b1a5e7e4fb0'

export async function httpPost<T>(pathOrUrl: string, body: unknown): Promise<T> {
  const response = await fetch(normalizeUrl(pathOrUrl), {
    method: 'POST',
    headers: {
      Authorization: STATIC_AUTH_HEADER,
      'Content-Type': 'application/json',
    },
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
  return `${API_BASE_URL}${pathOrUrl}`
}

async function safeReadText(res: Response): Promise<string> {
  try {
    return await res.text()
  } catch {
    return ''
  }
}
