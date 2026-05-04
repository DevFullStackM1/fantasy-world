const STORAGE_KEY = 'fw_access_token'

let inMemoryToken: string | null = null
const listeners = new Set<(token: string | null) => void>()

export function getToken(): string | null {
  if (inMemoryToken) return inMemoryToken
  const fromSession = sessionStorage.getItem(STORAGE_KEY)
  inMemoryToken = fromSession
  return inMemoryToken
}

export function setToken(token: string): void {
  inMemoryToken = token
  sessionStorage.setItem(STORAGE_KEY, token)
  listeners.forEach((l) => l(inMemoryToken))
}

export function clearToken(): void {
  inMemoryToken = null
  sessionStorage.removeItem(STORAGE_KEY)
  listeners.forEach((l) => l(inMemoryToken))
}

export function subscribeToken(listener: (token: string | null) => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

