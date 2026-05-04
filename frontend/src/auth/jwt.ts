export type AuthUser = {
  username: string
  role: 'VIEWER' | 'ADMIN' | null
}

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
  const decoded = atob(padded)
  // handle unicode
  return decodeURIComponent(
    decoded
      .split('')
      .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
      .join(''),
  )
}

export function parseJwtUser(token: string): AuthUser | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    const payloadJson = base64UrlDecode(parts[1]!)
    const payload = JSON.parse(payloadJson) as { sub?: unknown; scope?: unknown }
    const username = typeof payload.sub === 'string' ? payload.sub : null
    const scope = typeof payload.scope === 'string' ? payload.scope : ''
    const role: AuthUser['role'] =
      scope.split(/\s+/).includes('ROLE_ADMIN') ? 'ADMIN'
      : scope.split(/\s+/).includes('ROLE_VIEWER') ? 'VIEWER'
      : null
    if (!username) return null
    return { username, role }
  } catch {
    return null
  }
}

