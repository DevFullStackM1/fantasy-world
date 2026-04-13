import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import StatusMessage from '../components/StatusMessage'
import { getAventurierById } from '../services/aventuriersApi'
import type { components } from '../api/generated/aventurier'

type Aventurier = components['schemas']['Aventurier']

type ApiState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

export default function AventurierDetailPage() {
  const { id } = useParams()

  const [state, setState] = useState<ApiState<Aventurier>>({ status: 'loading' })

  const parsedId = useMemo(() => {
    if (!id) return null
    const num = Number(id)
    if (!Number.isFinite(num)) return null
    return num
  }, [id])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setState({ status: 'loading' })
      try {
        if (parsedId === null) return
        const data = await getAventurierById(parsedId)
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
  }, [parsedId])

  if (parsedId === null) {
    return (
      <section className="page">
        <header className="pageHeader">
          <h2 className="pageTitle">Détail</h2>
          <div className="pageHeader__actions">
            <Link to="/aventuriers" className="btn">
              Retour à la liste
            </Link>
          </div>
        </header>

        <StatusMessage kind="error" message="Identifiant invalide." />
      </section>
    )
  }

  return (
    <section className="page" aria-busy={state.status === 'loading'}>
      <header className="pageHeader">
        <h2 className="pageTitle">Détail</h2>
        <div className="pageHeader__actions">
          <Link to="/aventuriers" className="btn">
            Retour à la liste
          </Link>
        </div>
      </header>

      {state.status === 'loading' ? (
        <StatusMessage kind="loading" message="Chargement du détail..." />
      ) : null}

      {state.status === 'error' ? (
        <>
          <StatusMessage kind="error" message={state.error} />
          <p className="muted">Vérifiez l’identifiant puis réessayez.</p>
        </>
      ) : null}

      {state.status === 'success' ? (
        <article className="detailCard" aria-label="Détails d'un aventurier">
          <h3 className="detailCard__title">{state.data.nom}</h3>
          <dl className="kvGrid">
            <div className="kvRow">
              <dt className="kvRow__k">ID</dt>
              <dd className="kvRow__v">{state.data.id}</dd>
            </div>
            <div className="kvRow">
              <dt className="kvRow__k">Classe</dt>
              <dd className="kvRow__v">{state.data.classe}</dd>
            </div>
            <div className="kvRow">
              <dt className="kvRow__k">Niveau</dt>
              <dd className="kvRow__v">{state.data.niveau}</dd>
            </div>
            <div className="kvRow">
              <dt className="kvRow__k">Physique</dt>
              <dd className="kvRow__v">{state.data.physique}</dd>
            </div>
            <div className="kvRow">
              <dt className="kvRow__k">Mental</dt>
              <dd className="kvRow__v">{state.data.mental}</dd>
            </div>
            <div className="kvRow">
              <dt className="kvRow__k">Perception</dt>
              <dd className="kvRow__v">{state.data.perception}</dd>
            </div>
          </dl>

          <div className="detailCard__description">
            <h4 className="srOnly">Description</h4>
            {state.data.description ? (
              <p>{state.data.description}</p>
            ) : (
              <p className="muted">Pas de description.</p>
            )}
          </div>
        </article>
      ) : null}
    </section>
  )
}

