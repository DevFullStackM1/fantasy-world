import { clearToken, getToken } from '../auth/tokenStore'

function redirectTo(path: string) {
  if (window.location.pathname === path) return
  window.location.assign(path)
}

export async function apiFetch(input: RequestInfo | URL, init?: RequestInit) {
  const token = getToken()

  const headers = new Headers(init?.headers ?? undefined)
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(input, { ...init, headers })

  if (res.status === 401) {
    clearToken()
    redirectTo('/login')
  } else if (res.status === 403) {
    redirectTo('/forbidden')
  }

  return res
}

