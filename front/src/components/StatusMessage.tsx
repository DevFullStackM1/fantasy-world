import type { ReactNode } from 'react'

export type StatusKind = 'loading' | 'success' | 'error'

export default function StatusMessage({
  kind,
  message,
  children,
}: {
  kind: StatusKind
  message?: string
  children?: ReactNode
}) {
  const live = kind === 'error' ? 'assertive' : 'polite'
  return (
    <div className={`status status--${kind}`} role="status" aria-live={live}>
      {message ? <p className="status__message">{message}</p> : null}
      {children}
    </div>
  )
}

