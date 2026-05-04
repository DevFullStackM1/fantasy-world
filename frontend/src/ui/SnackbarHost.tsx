import { useEffect, useState } from 'react'
import { subscribeSnackbar } from './snackbarBus'
import type { SnackbarEvent } from './snackbarBus'

type SnackbarItem = SnackbarEvent & { id: string }

export default function SnackbarHost() {
  const [items, setItems] = useState<SnackbarItem[]>([])

  useEffect(() => {
    return subscribeSnackbar((e) => {
      const item: SnackbarItem = { ...e, id: crypto.randomUUID() }
      setItems((prev) => [...prev, item].slice(-3))
      window.setTimeout(() => {
        setItems((prev) => prev.filter((x) => x.id !== item.id))
      }, 3500)
    })
  }, [])

  if (items.length === 0) return null

  return (
    <div className="snackbarStack" aria-live="polite" aria-relevant="additions removals">
      {items.map((s) => (
        <div key={s.id} className={`snackbar snackbar--${s.kind}`} role="status">
          <div className="snackbar__message">{s.message}</div>
          <button
            type="button"
            className="snackbar__close"
            aria-label="Fermer"
            onClick={() => setItems((prev) => prev.filter((x) => x.id !== s.id))}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}

