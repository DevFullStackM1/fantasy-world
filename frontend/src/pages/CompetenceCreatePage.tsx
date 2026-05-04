import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import StatusMessage from '../components/StatusMessage'
import { createCompetence, listCompetences } from '../services/competencesApi'
import type { Competence } from '../services/competencesApi'

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

const INITIAL: FormState = {
  nom: '',
  description: '',
  niveauMinimum: '',
  classeRequise: '',
  caracteristique: '',
  caracteristiqueValeur: '',
  competencesRequises: [],
}

type ApiState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'success' }

export default function CompetenceCreatePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(INITIAL)
  const [apiState, setApiState] = useState<ApiState>({ status: 'idle' })
  const [allCompetences, setAllCompetences] = useState<Competence[]>([])

  useEffect(() => {
    listCompetences().then(setAllCompetences).catch(() => {})
  }, [])

  const canSubmit = apiState.status !== 'loading' && apiState.status !== 'success'

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
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

      await createCompetence({
        nom,
        description: form.description.trim() || undefined,
        prerequis: prereq,
      })
      setApiState({ status: 'success' })
      setTimeout(() => navigate('/competences'), 600)
    } catch (e) {
      setApiState({
        status: 'error',
        error: e instanceof Error ? e.message : 'Erreur inconnue',
      })
    }
  }

  function toggleCompetenceRequise(id: string) {
    setForm((f) => ({
      ...f,
      competencesRequises: f.competencesRequises.includes(id)
        ? f.competencesRequises.filter((x) => x !== id)
        : [...f.competencesRequises, id],
    }))
  }

  return (
    <section className="page" aria-busy={apiState.status === 'loading'}>
      <header className="pageHeader">
        <h2 className="pageTitle">Créer une compétence</h2>
        <div className="pageHeader__actions">
          <Link to="/competences" className="btn">
            Retour
          </Link>
        </div>
      </header>

      {apiState.status === 'error' && (
        <StatusMessage kind="error" message={apiState.error} />
      )}
      {apiState.status === 'success' && (
        <StatusMessage kind="success" message="Compétence créée avec succès." />
      )}

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
          <legend style={{ padding: '0 6px', fontWeight: 650 }}>Prérequis (tous optionnels)</legend>

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
            {apiState.status === 'loading' ? 'Création...' : 'Créer'}
          </button>
        </div>
      </form>
    </section>
  )
}
