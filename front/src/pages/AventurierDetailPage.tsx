import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import StatusMessage from '../components/StatusMessage'
import { getAventurierById } from '../services/aventuriersApi'
import {
  getCompetencesByAventurierId,
  getCompetencesDisponibles,
  addCompetenceToAventurier,
  removeCompetenceFromAventurier,
} from '../services/competencesApi'
import type { components } from '../api/generated/aventurier'
import type { CompetencesDisponibles, Competence } from '../services/competencesApi'
import { useAuth } from '../auth/useAuth'

type Aventurier = components['schemas']['Aventurier']

type ApiState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

type CompetencesSection = {
  acquises: Competence[]
  disponibles: CompetencesDisponibles
}

type Tab = 'acquises' | 'acquerables' | 'bloquees'

export default function AventurierDetailPage() {
  const { id } = useParams()
  const { role } = useAuth()
  const isAdmin = role === 'ADMIN'

  const [state, setState] = useState<ApiState<Aventurier>>({ status: 'loading' })
  const [compState, setCompState] = useState<ApiState<CompetencesSection>>({ status: 'loading' })
  const [activeTab, setActiveTab] = useState<Tab>('acquises')
  const [actionPending, setActionPending] = useState<string | null>(null)

  const parsedId = useMemo(() => {
    if (!id) return null
    const num = Number(id)
    if (!Number.isFinite(num)) return null
    return num
  }, [id])

  function loadCompetences() {
    if (parsedId === null) return
    setCompState({ status: 'loading' })

    Promise.all([
      getCompetencesByAventurierId(parsedId),
      getCompetencesDisponibles(parsedId),
    ])
      .then(([acquises, disponibles]) =>
        setCompState({ status: 'success', data: { acquises, disponibles } }),
      )
      .catch((e: unknown) =>
        setCompState({
          status: 'error',
          error: e instanceof Error ? e.message : 'Erreur',
        }),
      )
  }

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

  useEffect(() => {
    loadCompetences()
  }, [parsedId])

  async function handleAdd(competenceId: string) {
    if (parsedId === null) return
    setActionPending(competenceId)
    try {
      await addCompetenceToAventurier(parsedId, competenceId)
      loadCompetences()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erreur lors de l\'ajout.')
    } finally {
      setActionPending(null)
    }
  }

  async function handleRemove(competenceId: string) {
    if (parsedId === null) return
    setActionPending(competenceId)
    try {
      await removeCompetenceFromAventurier(parsedId, competenceId)
      loadCompetences()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erreur lors du retrait.')
    } finally {
      setActionPending(null)
    }
  }

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
          <p className="muted">Vérifiez l'identifiant puis réessayez.</p>
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

      {/* Section compétences */}
      <section style={{ marginTop: 16 }}>
        <h3 style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 650 }}>Compétences</h3>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
          {(['acquises', 'acquerables', 'bloquees'] as Tab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              className="btn"
              style={
                activeTab === tab
                  ? { background: 'var(--accent-bg)', borderColor: 'var(--accent-border)' }
                  : {}
              }
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'acquises' && 'Acquises'}
              {tab === 'acquerables' && 'Acquérables'}
              {tab === 'bloquees' && 'Bloquées'}
            </button>
          ))}
        </div>

        {compState.status === 'loading' && (
          <StatusMessage kind="loading" message="Chargement des compétences..." />
        )}
        {compState.status === 'error' && (
          <StatusMessage kind="error" message={compState.error} />
        )}

        {compState.status === 'success' && (
          <>
            {activeTab === 'acquises' && (
              <div>
                {compState.data.acquises.length === 0 ? (
                  <p className="muted">Cet aventurier n'a pas encore de compétences.</p>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'grid', gap: 6 }}>
                    {compState.data.acquises.map((c) => (
                      <li
                        key={c.id}
                        style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                      >
                        <Link to={`/competences/${c.id}`} className="tableLink">
                          {c.nom}
                        </Link>
                        {c.description && (
                          <span className="muted" style={{ fontSize: '0.875em' }}>
                            — {c.description.length > 60 ? c.description.slice(0, 60) + '…' : c.description}
                          </span>
                        )}
                        {isAdmin && (
                          <button
                            type="button"
                            className="btn"
                            style={{ marginLeft: 'auto', padding: '4px 10px', color: 'var(--danger)' }}
                            disabled={actionPending === c.id}
                            onClick={() => handleRemove(c.id!)}
                          >
                            {actionPending === c.id ? '…' : 'Retirer'}
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {activeTab === 'acquerables' && (
              <div>
                {!compState.data.disponibles.acquerables ||
                compState.data.disponibles.acquerables.length === 0 ? (
                  <p className="muted">Aucune compétence acquérable pour l'instant.</p>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'grid', gap: 6 }}>
                    {compState.data.disponibles.acquerables.map((c) => (
                      <li
                        key={c.id}
                        style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                      >
                        <Link to={`/competences/${c.id}`} className="tableLink">
                          {c.nom}
                        </Link>
                        {c.description && (
                          <span className="muted" style={{ fontSize: '0.875em' }}>
                            — {c.description.length > 60 ? c.description.slice(0, 60) + '…' : c.description}
                          </span>
                        )}
                        {isAdmin && (
                          <button
                            type="button"
                            className="btn btn--primary"
                            style={{ marginLeft: 'auto', padding: '4px 10px' }}
                            disabled={actionPending === c.id}
                            onClick={() => handleAdd(c.id!)}
                          >
                            {actionPending === c.id ? '…' : 'Ajouter'}
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {activeTab === 'bloquees' && (
              <div>
                {!compState.data.disponibles.bloquees ||
                compState.data.disponibles.bloquees.length === 0 ? (
                  <p className="muted">Aucune compétence bloquée.</p>
                ) : (
                  <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'grid', gap: 10 }}>
                    {compState.data.disponibles.bloquees.map((item) => (
                      <li key={item.competence?.id}>
                        <Link to={`/competences/${item.competence?.id}`} className="tableLink">
                          {item.competence?.nom}
                        </Link>
                        {item.prerequisManquants && item.prerequisManquants.length > 0 && (
                          <ul style={{ margin: '4px 0 0', paddingLeft: 18, fontSize: '0.875em' }}>
                            {item.prerequisManquants.map((m, i) => (
                              <li key={i} className="muted">
                                {m}
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </section>
  )
}
