import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import StatusMessage from '../components/StatusMessage'
import { getAventurierById, updateAventurier } from '../services/aventuriersApi'
import {
  getCompetencesByAventurierId,
  getCompetencesDisponibles,
  addCompetenceToAventurier,
  removeCompetenceFromAventurier,
} from '../services/competencesApi'
import type { components } from '../api/generated/aventurier'
import type { CompetencesDisponibles, Competence } from '../services/competencesApi'
import { useAuth } from '../auth/useAuth'
import { publishSnackbar } from '../ui/snackbarBus'
import { classLabel } from '../ui/classFantasy'

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

function rarityByLevel(level: number): { label: string; tone: 'common' | 'rare' | 'epic' | 'legendary' } {
  if (level >= 80) return { label: 'Légendaire', tone: 'legendary' }
  if (level >= 50) return { label: 'Épique', tone: 'epic' }
  if (level >= 25) return { label: 'Rare', tone: 'rare' }
  return { label: 'Commun', tone: 'common' }
}

export default function AventurierDetailPage() {
  const { id } = useParams()
  const { role } = useAuth()
  const isAdmin = role === 'ADMIN'

  const [state, setState] = useState<ApiState<Aventurier>>({ status: 'loading' })
  const [compState, setCompState] = useState<ApiState<CompetencesSection>>({ status: 'loading' })
  const [activeTab, setActiveTab] = useState<Tab>('acquises')
  const [actionPending, setActionPending] = useState<string | null>(null)
  const [levelPending, setLevelPending] = useState(false)

  const parsedId = useMemo(() => {
    if (!id) return null
    const num = Number(id)
    if (!Number.isFinite(num)) return null
    return num
  }, [id])

  async function loadAventurier() {
    setState({ status: 'loading' })
    try {
      if (parsedId === null) return
      const data = await getAventurierById(parsedId)
      setState({ status: 'success', data })
    } catch (e) {
      setState({
        status: 'error',
        error: e instanceof Error ? e.message : 'Erreur inconnue',
      })
    }
  }

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
    if (parsedId === null) return
    loadAventurier()
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
      publishSnackbar({ kind: 'success', message: 'Compétence ajoutée.' })
    } catch (e) {
      publishSnackbar({
        kind: 'error',
        message: e instanceof Error ? e.message : 'Erreur lors de l\'ajout.',
      })
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
      publishSnackbar({ kind: 'success', message: 'Compétence retirée.' })
    } catch (e) {
      publishSnackbar({
        kind: 'error',
        message: e instanceof Error ? e.message : 'Erreur lors du retrait.',
      })
    } finally {
      setActionPending(null)
    }
  }

  async function handleLevelUp() {
    if (parsedId === null || state.status !== 'success' || levelPending) return
    const current = state.data.niveau ?? 0
    const nextLevel = current + 1
    setLevelPending(true)
    try {
      await updateAventurier(parsedId, { niveau: nextLevel })
      await Promise.all([loadAventurier(), loadCompetences()])
      publishSnackbar({
        kind: 'success',
        message: `Niveau monté à ${nextLevel}.`,
      })
    } catch (e) {
      publishSnackbar({
        kind: 'error',
        message: e instanceof Error ? e.message : 'Impossible de monter de niveau.',
      })
    } finally {
      setLevelPending(false)
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
          <div className="rarityRow">
            {(() => {
              const rarity = rarityByLevel(state.data.niveau ?? 0)
              return (
                <span className={`rarityBadge rarityBadge--${rarity.tone}`}>
                  {rarity.label}
                </span>
              )
            })()}
          </div>
          <div className="heroStats">
            <div className="heroStats__chip">
              <span>Niveau</span>
              <strong>{state.data.niveau}</strong>
            </div>
            <div className="heroStats__chip">
              <span>Classe</span>
              <strong>{classLabel(state.data.classe)}</strong>
            </div>
            {isAdmin && (
              <button
                type="button"
                className="btn btn--primary"
                disabled={levelPending}
                onClick={handleLevelUp}
              >
                {levelPending ? 'Mise à jour…' : '+1 niveau'}
              </button>
            )}
          </div>
          <dl className="kvGrid">
            <div className="kvRow">
              <dt className="kvRow__k">ID</dt>
              <dd className="kvRow__v">{state.data.id}</dd>
            </div>
            <div className="kvRow">
              <dt className="kvRow__k">Classe</dt>
              <dd className="kvRow__v">{classLabel(state.data.classe)}</dd>
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
          <section className="statBars" aria-label="Caractéristiques principales">
            <div className="statBar">
              <div className="statBar__head">
                <span>Physique</span>
                <strong>{state.data.physique}</strong>
              </div>
              <div className="statBar__track">
                <span className="statBar__fill" style={{ width: `${state.data.physique ?? 0}%` }} />
              </div>
            </div>
            <div className="statBar">
              <div className="statBar__head">
                <span>Mental</span>
                <strong>{state.data.mental}</strong>
              </div>
              <div className="statBar__track">
                <span className="statBar__fill" style={{ width: `${state.data.mental ?? 0}%` }} />
              </div>
            </div>
            <div className="statBar">
              <div className="statBar__head">
                <span>Perception</span>
                <strong>{state.data.perception}</strong>
              </div>
              <div className="statBar__track">
                <span className="statBar__fill" style={{ width: `${state.data.perception ?? 0}%` }} />
              </div>
            </div>
          </section>

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
      <section className="competencesSection">
        <h3 className="sectionTitle">Compétences</h3>

        {/* Tabs */}
        <div className="tabs">
          {(['acquises', 'acquerables', 'bloquees'] as Tab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              className={`btn ${activeTab === tab ? 'btn--primary' : ''}`}
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
                  <ul className="competenceList">
                    {compState.data.acquises.map((c) => (
                      <li key={c.id} className="competenceList__item">
                        <Link to={`/competences/${c.id}`} className="tableLink">
                          {c.nom}
                        </Link>
                        {c.description && (
                          <span className="muted competenceList__meta">
                            — {c.description.length > 60 ? c.description.slice(0, 60) + '…' : c.description}
                          </span>
                        )}
                        {isAdmin && (
                          <button
                            type="button"
                            className="btn"
                            style={{ marginLeft: 'auto', color: 'var(--danger)' }}
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
                  <ul className="competenceList">
                    {compState.data.disponibles.acquerables.map((c) => (
                      <li key={c.id} className="competenceList__item">
                        <Link to={`/competences/${c.id}`} className="tableLink">
                          {c.nom}
                        </Link>
                        {c.description && (
                          <span className="muted competenceList__meta">
                            — {c.description.length > 60 ? c.description.slice(0, 60) + '…' : c.description}
                          </span>
                        )}
                        {isAdmin && (
                          <button
                            type="button"
                            className="btn btn--primary"
                            style={{ marginLeft: 'auto' }}
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
                  <ul className="blockedList">
                    {compState.data.disponibles.bloquees.map((item) => (
                      <li key={item.competence?.id}>
                        <Link to={`/competences/${item.competence?.id}`} className="tableLink">
                          {item.competence?.nom}
                        </Link>
                        {item.prerequisManquants && item.prerequisManquants.length > 0 && (
                          <ul className="blockedList__missing">
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
