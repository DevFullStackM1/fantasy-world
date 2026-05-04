import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import StatusMessage from '../components/StatusMessage'
import { getCompetenceById, updateCompetence, listCompetences } from '../services/competencesApi'
import type { Competence, ApiConflictError } from '../services/competencesApi'

type FormState = {
  nom: string
  description: string
  niveauMinimum: string
  classeRequise: string
  caracteristique: string
  caracteristiqueValeur: string
  competencesRequises: string[]
}

const CLASSES = [
  'MAGE', 'GUERRIER', 'ARCHER', 'RÔDEUR', 'PRÊTRE',
  'CHANTEUR', 'NÉGATEUR', 'SORCIER', 'PALADIN', 'BARD',
]
const CARACTERISTIQUES = ['PHYSIQUE', 'MENTAL', 'PERCEPTION']

type ApiState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'loadingForm' }
  | { status: 'error'; error: string }
  | { status: 'conflict'; conflict: ApiConflictError }
  | { status: 'success' }

export default function CompetenceEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>({
    nom: '',
    description: '',
    niveauMinimum: '',
    classeRequise: '',
    caracteristique: '',
    caracteristiqueValeur: '',
    competencesRequises: [],
  })
  const [apiState, setApiState] = useState<ApiState>({ status: 'loadingForm' })
  const [allCompetences, setAllCompetences] = useState<Competence[]>([])

  useEffect(() => {
    if (!id) return
    setApiState({ status: 'loadingForm' })

    Promise.all([getCompetenceById(id), listCompetences()])
      .then(([comp, all]) => {
        setAllCompetences(all.filter((c) => c.id !== id))
        const p = comp.prerequis
        setForm({
          nom: comp.nom ?? '',
          description: comp.description ?? '',
          niveauMinimum: p?.niveauMinimum != null ? String(p.niveauMinimum) : '',
          classeRequise: p?.classeRequise ?? '',
          caracteristique: p?.caracteristiquesMin?.caracteristique ?? '',
          caracteristiqueValeur:
            p?.caracteristiquesMin?.valeur != null
              ? String(p.caracteristiquesMin.valeur)
              : '',
          competencesRequises: p?.competencesRequises ?? [],
        })
        setApiState({ status: 'idle' })
      })
      .catch((e: unknown) =>
        setApiState({
          status: 'error',
          error: e instanceof Error ? e.message : 'Erreur de chargement',
        }),
      )
  }, [id])

  const canSubmit =
    apiState.status !== 'loading' &&
    apiState.status !== 'success' &&
    apiState.status !== 'loadingForm'

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!id) return
    const nom = form.nom.trim()
    if (!nom) return

    setApiState({ status: 'loading' })
    try {
      const prereq =
        form.niveauMinimum ||
        form.classeRequise ||
        form.caracteristique ||
        form.competencesRequises.length > 0
          ? {
              niveauMinimum: form.niveauMinimum ? Number(form.niveauMinimum) : undefined,
              classeRequise: form.classeRequise || undefined,
              caracteristiquesMin:
                form.caracteristique && form.caracteristiqueValeur
                  ? {
                      caracteristique: form.caracteristique as 'PHYSIQUE' | 'MENTAL' | 'PERCEPTION',
                      valeur: Number(form.caracteristiqueValeur),
                    }
                  : undefined,
              competencesRequises:
                form.competencesRequises.length > 0 ? form.competencesRequises : undefined,
            }
          : undefined

      await updateCompetence(id, {
        nom,
        description: form.description.trim() || undefined,
        prerequis: prereq,
      })
      setApiState({ status: 'success' })
      setTimeout(() => navigate(`/competences/${id}`), 600)
    } catch (e) {
      if (e && typeof e === 'object' && (e as ApiConflictError).kind === 'conflict') {
        setApiState({ status: 'conflict', conflict: e as ApiConflictError })
        return
      }
      setApiState({
        status: 'error',
        error: e instanceof Error ? e.message : 'Erreur inconnue',
      })
    }
  }

  function toggleCompetenceRequise(compId: string) {
    setForm((f) => ({
      ...f,
      competencesRequises: f.competencesRequises.includes(compId)
        ? f.competencesRequises.filter((x) => x !== compId)
        : [...f.competencesRequises, compId],
    }))
  }

  return (
    <section className="page" aria-busy={apiState.status === 'loading'}>
      <header className="pageHeader">
        <h2 className="pageTitle">Modifier une compétence</h2>
        <div className="pageHeader__actions">
          <Link to={id ? `/competences/${id}` : '/competences'} className="btn">
            Annuler
          </Link>
        </div>
      </header>

      {apiState.status === 'loadingForm' && (
        <StatusMessage kind="loading" message="Chargement..." />
      )}
      {apiState.status === 'error' && (
        <StatusMessage kind="error" message={apiState.error} />
      )}
      {apiState.status === 'success' && (
        <StatusMessage kind="success" message="Compétence mise à jour." />
      )}

      {apiState.status === 'conflict' && (
        <div
          className="status status--error"
          role="alert"
          style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
        >
          <p className="status__message" style={{ margin: 0 }}>
            <strong>Modification impossible :</strong> {apiState.conflict.message}
          </p>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {apiState.conflict.aventuriersImpactes.map((av) => (
              <li key={av.id}>
                <strong>{av.nom}</strong>
                {av.prerequisManquants.length > 0 && (
                  <ul style={{ margin: '2px 0', paddingLeft: 18 }}>
                    {av.prerequisManquants.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {apiState.status !== 'loadingForm' && (
        <form className="form" onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="nom" className="label">
              Nom *
            </label>
            <input
              id="nom"
              className="input"
              type="text"
              value={form.nom}
              onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
              required
              disabled={!canSubmit}
            />
          </div>

          <div className="field">
            <label htmlFor="description" className="label">
              Description (optionnel)
            </label>
            <textarea
              id="description"
              className="textarea"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              disabled={!canSubmit}
            />
          </div>

          <fieldset style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 14 }}>
            <legend style={{ padding: '0 6px', fontWeight: 650 }}>
              Prérequis (tous optionnels)
            </legend>

            <div className="formGrid">
              <div className="field">
                <label htmlFor="niveauMin" className="label">
                  Niveau minimum
                </label>
                <input
                  id="niveauMin"
                  className="input"
                  type="number"
                  min={1}
                  value={form.niveauMinimum}
                  onChange={(e) => setForm((f) => ({ ...f, niveauMinimum: e.target.value }))}
                  disabled={!canSubmit}
                />
              </div>

              <div className="field">
                <label htmlFor="classeRequise" className="label">
                  Classe requise
                </label>
                <select
                  id="classeRequise"
                  className="select"
                  value={form.classeRequise}
                  onChange={(e) => setForm((f) => ({ ...f, classeRequise: e.target.value }))}
                  disabled={!canSubmit}
                >
                  <option value="">— Aucune —</option>
                  {CLASSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="caracteristique" className="label">
                  Caractéristique min.
                </label>
                <select
                  id="caracteristique"
                  className="select"
                  value={form.caracteristique}
                  onChange={(e) => setForm((f) => ({ ...f, caracteristique: e.target.value }))}
                  disabled={!canSubmit}
                >
                  <option value="">— Aucune —</option>
                  {CARACTERISTIQUES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {form.caracteristique && (
                <div className="field">
                  <label htmlFor="carValeur" className="label">
                    Valeur min. de {form.caracteristique}
                  </label>
                  <input
                    id="carValeur"
                    className="input"
                    type="number"
                    min={0}
                    max={100}
                    value={form.caracteristiqueValeur}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, caracteristiqueValeur: e.target.value }))
                    }
                    disabled={!canSubmit}
                  />
                </div>
              )}
            </div>

            {allCompetences.length > 0 && (
              <div className="field" style={{ marginTop: 12 }}>
                <span className="label">Compétences requises</span>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: 6,
                    marginTop: 6,
                  }}
                >
                  {allCompetences.map((c) => (
                    <label
                      key={c.id}
                      style={{ display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer' }}
                    >
                      <input
                        type="checkbox"
                        checked={form.competencesRequises.includes(c.id!)}
                        onChange={() => toggleCompetenceRequise(c.id!)}
                        disabled={!canSubmit}
                      />
                      {c.nom}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </fieldset>

          <div className="formActions">
            <button type="submit" className="btn btn--primary" disabled={!canSubmit}>
              {apiState.status === 'loading' ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      )}
    </section>
  )
}
