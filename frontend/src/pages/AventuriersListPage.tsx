import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../components/Pagination'
import StatusMessage from '../components/StatusMessage'
import { listAventuriers } from '../services/aventuriersApi'
import type { components } from '../api/generated/aventurier'

type Aventurier = components['schemas']['Aventurier']

type ApiState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

const PAGE_SIZE = 6
const PAGE_SIZE_OPTIONS = [3, 6, 10, 20] as const

export default function AventuriersListPage() {
  const navigate = useNavigate()
  const [state, setState] = useState<ApiState<Aventurier[]>>({ status: 'loading' })
  const [page, setPage] = useState(1)
  const [reloadKey, setReloadKey] = useState(0)
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(PAGE_SIZE)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setState({ status: 'loading' })
      try {
        const data = await listAventuriers()
        if (cancelled) return
        setState({ status: 'success', data })
      } catch (e) {
        if (cancelled) return
        setState({
          status: 'error',
          error: e instanceof Error ? e.message : 'Erreur inconnue',
        })
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const totalPages = useMemo(() => {
    if (state.status !== 'success') return 1
    return Math.max(1, Math.ceil(state.data.length / pageSize))
  }, [state, pageSize])

  const safePage = Math.min(Math.max(1, page), totalPages)

  const visibleAventuriers = useMemo(() => {
    if (state.status !== 'success') return []
    const start = (safePage - 1) * pageSize
    return state.data.slice(start, start + pageSize)
  }, [state, safePage, pageSize])

  return (
    <section className="page" aria-busy={state.status === 'loading'}>
      <header className="pageHeader">
        <h2 className="pageTitle">Aventuriers</h2>
      </header>

      {state.status === 'loading' ? (
        <StatusMessage kind="loading" message="Chargement de la liste..." />
      ) : null}

      {state.status === 'error' ? (
        <>
          <StatusMessage kind="error" message={state.error} />
          <button
            type="button"
            className="btn"
            onClick={() => {
              setPage(1)
              setReloadKey((k) => k + 1)
            }}
          >
            Recharger
          </button>
        </>
      ) : null}

      {state.status === 'success' ? (
        <>
          {state.data.length === 0 ? (
            <p className="muted">Aucun aventurier pour le moment.</p>
          ) : (
            <>
              <table className="aventuriersTable" aria-label="Liste des aventuriers">
                <thead>
                  <tr>
                    <th scope="col">Nom</th>
                    <th scope="col">Classe</th>
                    <th scope="col">Niveau</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleAventuriers.map((a) => (
                    <tr
                      key={a.id}
                      className="aventuriersTable__row"
                      tabIndex={0}
                      role="link"
                      aria-label={`Voir le détail de ${a.nom}`}
                      onClick={() => navigate(`/aventuriers/${a.id}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          navigate(`/aventuriers/${a.id}`)
                        }
                      }}
                    >
                      <td data-label="Nom">
                        {a.nom}
                      </td>
                      <td data-label="Classe">{a.classe}</td>
                      <td data-label="Niveau">{a.niveau}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="listControls" aria-label="Contrôles de pagination">
                <div className="field listControls__field">
                  <label htmlFor="pageSize" className="label">
                    Éléments par page
                  </label>
                  <select
                    id="pageSize"
                    className="select"
                    value={pageSize}
                    onChange={(e) => {
                      const next = Number(e.target.value)
                      if (!Number.isFinite(next)) return
                      setPageSize(next as (typeof PAGE_SIZE_OPTIONS)[number])
                      setPage(1)
                    }}
                  >
                    {PAGE_SIZE_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
              />
            </>
          )}
        </>
      ) : null}
    </section>
  )
}

