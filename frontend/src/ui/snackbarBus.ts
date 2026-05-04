export type SnackbarKind = 'info' | 'success' | 'error'

export type SnackbarEvent = {
  kind: SnackbarKind
  message: string
}

const listeners = new Set<(e: SnackbarEvent) => void>()

export function publishSnackbar(e: SnackbarEvent) {
  listeners.forEach((l) => l(e))
}

export function subscribeSnackbar(listener: (e: SnackbarEvent) => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

