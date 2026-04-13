import { Fetcher } from 'openapi-typescript-fetch'
import type { paths } from '../api/generated/aventurier'
import { clearToken, getToken } from '../auth/tokenStore'
import { publishSnackbar } from '../ui/snackbarBus'

const apiBaseUrl =
  // Par défaut, on appelle la même origine via Vite (proxy /api en dev),
  // ce qui évite les problèmes CORS.
  import.meta.env.VITE_API_BASE_URL?.toString() ?? ''

const fetcher = Fetcher.for<paths>()

function redirectTo(path: string) {
  if (window.location.pathname === path) return
  window.location.assign(path)
}

fetcher.configure({
  baseUrl: apiBaseUrl,
  init: {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  },
  use: [
    async (url, init, next) => {
      const token = getToken()
      const headers = new Headers(init?.headers ?? undefined)
      if (token) headers.set('Authorization', `Bearer ${token}`)

      const res = await next(url, { ...init, headers })

      if (res.status === 401) {
        clearToken()
        redirectTo('/login')
      } else if (res.status === 403) {
        redirectTo('/forbidden')
      } else if (res.status >= 400) {
        // Essaie d'extraire un RFC 9457 ProblemDetail et de l'afficher en snackbar.
        try {
          const data = (await res.clone().json()) as { title?: unknown; detail?: unknown }
          const title = typeof data.title === 'string' ? data.title : null
          const detail = typeof data.detail === 'string' ? data.detail : null
          const msg = detail ?? title
          if (msg) publishSnackbar({ kind: 'error', message: msg })
        } catch {
          // ignore (pas du JSON / pas un ProblemDetail)
        }
      }

      return res
    },
  ],
})

export { fetcher }

