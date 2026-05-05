export type AuthResponse = { accessToken: string }
import { apiFetch } from './apiFetch'

async function tryShowProblem(res: Response) {
  if (res.status === 401 || res.status === 403) return
  if (res.status < 400) return
  try {
    const data = (await res.clone().json()) as { title?: unknown; detail?: unknown }
    const title = typeof data.title === 'string' ? data.title : null
    const detail = typeof data.detail === 'string' ? data.detail : null
    const msg = detail ?? title
    if (msg) {
      const { publishSnackbar } = await import('../ui/snackbarBus')
      publishSnackbar({ kind: 'error', message: msg })
    }
  } catch {
    // ignore
  }
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  const res = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) {
    await tryShowProblem(res)
    const text = await res.text().catch(() => '')
    throw new Error(text || `Erreur login (${res.status})`)
  }
  return (await res.json()) as AuthResponse
}

export async function register(username: string, password: string): Promise<AuthResponse> {
  const res = await fetch('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) {
    await tryShowProblem(res)
    const text = await res.text().catch(() => '')
    throw new Error(text || `Erreur register (${res.status})`)
  }
  return (await res.json()) as AuthResponse
}

export async function logout(): Promise<void> {
  // Utilise apiFetch pour inclure le Bearer token (endpoint protégé).
  const res = await apiFetch('/auth/logout', { method: 'POST' })
  if (!res.ok && res.status !== 401) {
    await tryShowProblem(res)
    const text = await res.text().catch(() => '')
    throw new Error(text || `Erreur logout (${res.status})`)
  }
}

