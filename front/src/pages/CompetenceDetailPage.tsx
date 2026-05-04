import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import StatusMessage from '../components/StatusMessage'
import {
  getCompetenceById,
  getAventuriersByCompetenceId,
  deleteCompetence,
} from '../services/competencesApi'
import type { Competence, AventuriersByCompetence } from '../services/competencesApi'
import { useAuth } from '../auth/useAuth'

type ApiState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

export default function CompetenceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { role } = useAuth()
  const isAdmin = role === 'ADMIN'

  const [compState, setCompState] = useState<ApiState<Competence>>({ status: 'loading' })
  const [avState, setAvState] = useState<ApiState<AventuriersByCompetence>>({ status: 'loading' })
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!id) return
    setCompState({ status: 'loading' })
    setAvState({ status: 'loading' })

    getCompetenceById(id)
      .then((data) => setCompState({ status: 'success', data }))
      .catch((e: unknown) =>
        setCompState({ status: 'error', error: e instanceof Error ? e.message : 'Erreur' }),
      )

    getAventuriersByCompetenceId(id)
      .then((data) => setAvState({ status: 'success', data }))
      .catch((e: unknown) =>
        setAvState({ status: 'error', error: e instanceof Error ? e.message : 'Erreur' }),
      )
  }, [id])

  async function handleDelete() {
    if (!id) return
    const nom =
      compState.status === 'success' ? compState.data.nom ?? 'cette compétence' : 'cette compétence'
    if (!confirm(`Supprimer la compétence « ${nom} » ?`)) return
    setDeleting(true)
    try {
      await deleteCompetence(id)
      navigate('/competences')
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erreur lors de la suppression.')
      setDeleting(false)
    }
  }

  if (!id) return <StatusMessage kind="error" message="Identifiant manquant." />

  return (
    <section className="page">
      <header className="pageHeader">
        <h2 className="pageTitle">
          {compState.status === 'success' ? compState.data.nom : 'Compétence'}
        </h2>
        <div className="pageHeader__actions">
          <Link to="/competences" className="btn">
            Retour
          </Link>
          {isAdmin && compState.status === 'success' && (
            <>
              <Link to={`/competences/${id}/modifier`} className="btn btn--primary">
                Modifier
              </Link>
              <button
                type="button"
                className="btn"
                style={{ color: 'var(--danger)' }}
                disabled={deleting}
                onClick={handleDelete}
              >
                {deleting ? '…' : 'Supprimer'}
              </button>
            </>
          )}
        </div>
      </header>

      {compState.status === 'loading' && (
        <StatusMessage kind="loading" message="Chargement..." />
      )}
      {compState.status === 'error' && (
        <StatusMessage kind="error" message={compState.error} />
      )}

      {compState.status === 'success' && (
        <article className="detailCard">
          <h3 className="detailCard__title">{compState.data.nom}</h3>
          <div className="detailCard__description">
            {compState.data.description ? (
              <p>{compState.data.description}</p>
            ) : (
              <p className="muted">Pas de description.</p>
            )}
          </div>

          {compState.data.prerequis && (
            <section style={{ marginTop: 14 }}>
              <h4 style={{ margin: '0 0 8px', fontWeight: 650 }}>Prérequis</h4>
              <dl className="kvGrid">
                {compState.data.prerequis.niveauMinimum != null && (
                  <div className="kvRow">
                    <dt className="kvRow__k">Niveau minimum</dt>
                    <dd className="kvRow__v">{compState.data.prerequis.niveauMinimum}</dd>
                  </div>
                )}
                {compState.data.prerequis.classeRequise && (
                  <div className="kvRow">
                    <dt className="kvRow__k">Classe requise</dt>
                    <dd className="kvRow__v">{compState.data.prerequis.classeRequise}</dd>
                  </div>
                )}
                {compState.data.prerequis.caracteristiquesMin && (
                  <div className="kvRow">
                    <dt className="kvRow__k">Caractéristique min.</dt>
                    <dd className="kvRow__v">
                      {compState.data.prerequis.caracteristiquesMin.caracteristique} ≥{' '}
                      {compState.data.prerequis.caracteristiquesMin.valeur}
                    </dd>
                  </div>
                )}
                {compState.data.prerequis.competencesRequises &&
                  compState.data.prerequis.competencesRequises.length > 0 && (
                    <div className="kvRow">
                      <dt className="kvRow__k">Compétences requises</dt>
                      <dd className="kvRow__v">
                        {compState.data.prerequis.competencesRequises.join(', ')}
                      </dd>
                    </div>
                  )}
              </dl>
            </section>
          )}
        </article>
      )}

      <section style={{ marginTop: 20 }}>
        <h3 style={{ margin: '0 0 10px', fontSize: 18, fontWeight: 650 }}>
          Aventuriers liés
        </h3>

        {avState.status === 'loading' && (
          <StatusMessage kind="loading" message="Chargement des aventuriers..." />
        )}
        {avState.status === 'error' && (
          <StatusMessage kind="error" message={avState.error} />
        )}

        {avState.status === 'success' && (
          <div style={{ display: 'grid', gap: 16 }}>
            <div>
              <h4 style={{ margin: '0 0 8px', fontWeight: 650 }}>
                Possesseurs ({avState.data.possesseurs?.length ?? 0})
              </h4>
              {!avState.data.possesseurs || avState.data.possesseurs.length === 0 ? (
                <p className="muted">Aucun aventurier ne possède cette compétence.</p>
              ) : (
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {avState.data.possesseurs.map((av) => (
                    <li key={av.id}>
                      <Link to={`/aventuriers/${av.id}`} className="tableLink">
                        {av.nom}
                      </Link>{' '}
                      <span className="muted">(niv. {av.niveau}, {av.classe})</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h4 style={{ margin: '0 0 8px', fontWeight: 650 }}>
                Éligibles ({avState.data.eligibles?.length ?? 0})
              </h4>
              {!avState.data.eligibles || avState.data.eligibles.length === 0 ? (
                <p className="muted">Aucun aventurier n'est éligible pour l'instant.</p>
              ) : (
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {avState.data.eligibles.map((av) => (
                    <li key={av.id}>
                      <Link to={`/aventuriers/${av.id}`} className="tableLink">
                        {av.nom}
                      </Link>{' '}
                      <span className="muted">(niv. {av.niveau}, {av.classe})</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </section>
    </section>
  )
}
