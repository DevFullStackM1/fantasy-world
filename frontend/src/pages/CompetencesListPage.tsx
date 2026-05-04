import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import StatusMessage from '../components/StatusMessage'
import { listCompetences, deleteCompetence } from '../services/competencesApi'
import type { Competence } from '../services/competencesApi'
import { useAuth } from '../auth/useAuth'

type ApiState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

function prerequisComplexity(c: Competence): string {
  const p = c.prerequis
  if (!p) return '—'
  const parts: string[] = []
  if (p.niveauMinimum != null) parts.push(`niv. ≥ ${p.niveauMinimum}`)
  if (p.caracteristiquesMin) parts.push(`${p.caracteristiquesMin.caracteristique} ≥ ${p.caracteristiquesMin.valeur}`)
  if (p.classeRequise) parts.push(p.classeRequise)
  if (p.competencesRequises && p.competencesRequises.length > 0)
    parts.push(`${p.competencesRequises.length} compétence(s)`)
  return parts.length > 0 ? parts.join(', ') : '—'
}

export default function CompetencesListPage() {
  const navigate = useNavigate()
  const { role } = useAuth()
  const isAdmin = role === 'ADMIN'

  const [state, setState] = useState<ApiState<Competence[]>>({ status: 'loading' })
  const [deleting, setDeleting] = useState<string | null>(null)

  function load() {
    setState({ status: 'loading' })
    listCompetences()
      .then((data) => setState({ status: 'success', data }))
      .catch((e: unknown) =>
        setState({ status: 'error', error: e instanceof Error ? e.message : 'Erreur' }),
      )
  }

  useEffect(() => {
    load()
  }, [])

  async function handleDelete(id: string, nom: string) {
    if (!confirm(`Supprimer la compétence « ${nom} » ?`)) return
    setDeleting(id)
    try {
      await deleteCompetence(id)
      load()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erreur lors de la suppression.')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <section className="page">
      <header className="pageHeader">
        <h2 className="pageTitle">Compétences</h2>
        <div className="pageHeader__actions">
          {isAdmin && (
            <Link to="/competences/nouvelle" className="btn btn--primary">
              Créer une compétence
            </Link>
          )}
        </div>
      </header>

      {state.status === 'loading' && (
        <StatusMessage kind="loading" message="Chargement des compétences..." />
      )}
      {state.status === 'error' && (
        <StatusMessage kind="error" message={state.error} />
      )}

      {state.status === 'success' && state.data.length === 0 && (
        <p className="muted">Aucune compétence enregistrée.</p>
      )}

      {state.status === 'success' && state.data.length > 0 && (
        <table className="aventuriersTable" aria-label="Liste des compétences">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Description</th>
              <th>Prérequis</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {state.data.map((c) => (
              <tr
                key={c.id}
                className="aventuriersTable__row"
                onClick={() => navigate(`/competences/${c.id}`)}
              >
                <td data-label="Nom">
                  <Link
                    to={`/competences/${c.id}`}
                    className="tableLink"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {c.nom}
                  </Link>
                </td>
                <td data-label="Description" className="muted">
                  {c.description
                    ? c.description.length > 80
                      ? c.description.slice(0, 80) + '…'
                      : c.description
                    : '—'}
                </td>
                <td data-label="Prérequis">{prerequisComplexity(c)}</td>
                {isAdmin && (
                  <td data-label="Actions" onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link
                        to={`/competences/${c.id}/modifier`}
                        className="btn"
                        style={{ padding: '6px 10px' }}
                      >
                        Modifier
                      </Link>
                      <button
                        type="button"
                        className="btn"
                        style={{ padding: '6px 10px', color: 'var(--danger)' }}
                        disabled={deleting === c.id}
                        onClick={() => handleDelete(c.id!, c.nom ?? 'cette compétence')}
                      >
                        {deleting === c.id ? '…' : 'Supprimer'}
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
