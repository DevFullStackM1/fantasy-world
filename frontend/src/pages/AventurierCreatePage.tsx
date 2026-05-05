import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import StatusMessage from '../components/StatusMessage'
import { createAventurier } from '../services/aventuriersApi'
import type { AventurierCreateInput } from '../services/aventuriersApi'
import type { components } from '../api/generated/aventurier'
import { classIcon } from '../ui/classFantasy'

type Aventurier = components['schemas']['Aventurier']
type Classe = components['schemas']['Classe']

const CLASSES: Classe[] = [
  'MAGE',
  'GUERRIER',
  'ARCHER',
  'RÔDEUR',
  'PRÊTRE',
  'CHANTEUR',
  'NÉGATEUR',
  'SORCIER',
  'PALADIN',
  'BARD',
]

type ApiState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'success'; createdId: number }

type FormState = {
  nom: string
  description: string
  physique: number
  mental: number
  perception: number
  classe: Classe
}

function isValidScore(n: number): boolean {
  return Number.isFinite(n) && Number.isInteger(n) && n >= 0 && n <= 100
}

export default function AventurierCreatePage() {
  const navigate = useNavigate()
  const [apiState, setApiState] = useState<ApiState>({ status: 'idle' })

  const [form, setForm] = useState<FormState>({
    nom: '',
    description: '',
    physique: 50,
    mental: 50,
    perception: 50,
    classe: 'MAGE',
  })

  const [validationError, setValidationError] = useState<string | null>(null)

  const canSubmit = useMemo(
    () => apiState.status !== 'loading' && apiState.status !== 'success',
    [apiState.status],
  )

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setValidationError(null)
    setApiState({ status: 'idle' })

    const nom = form.nom.trim()
    if (!nom) {
      setValidationError('Le nom est obligatoire.')
      return
    }
    if (!isValidScore(form.physique)) {
      setValidationError('La valeur de physique doit être un entier entre 0 et 100.')
      return
    }
    if (!isValidScore(form.mental)) {
      setValidationError('La valeur de mental doit être un entier entre 0 et 100.')
      return
    }
    if (!isValidScore(form.perception)) {
      setValidationError(
        'La valeur de perception doit être un entier entre 0 et 100.',
      )
      return
    }

    const payload: AventurierCreateInput = {
      nom,
      description: form.description.trim() || undefined,
      physique: form.physique,
      mental: form.mental,
      perception: form.perception,
      classe: form.classe,
    }

    setApiState({ status: 'loading' })
    try {
      const created: Aventurier = await createAventurier(payload)
      setApiState({ status: 'success', createdId: created.id })
    } catch (e2) {
      setApiState({
        status: 'error',
        error: e2 instanceof Error ? e2.message : 'Erreur inconnue',
      })
    }
  }

  useEffect(() => {
    if (apiState.status !== 'success') return

    const timer = window.setTimeout(() => {
      navigate('/aventuriers')
    }, 600)

    return () => {
      window.clearTimeout(timer)
    }
  }, [apiState, navigate])

  return (
    <section className="page" aria-busy={apiState.status === 'loading'}>
      <header className="pageHeader">
        <h2 className="pageTitle">Créer un aventurier</h2>
        <div className="pageHeader__actions">
          <Link to="/aventuriers" className="btn">
            Retour
          </Link>
        </div>
      </header>

      {apiState.status === 'error' ? (
        <StatusMessage kind="error" message={apiState.error} />
      ) : null}

      {validationError ? (
        <StatusMessage kind="error" message={validationError} />
      ) : null}

      {apiState.status === 'success' ? (
        <StatusMessage kind="success" message="Aventurier créé avec succès.">
          <p className="muted" style={{ marginTop: 10 }}>
            Retour à la liste...
          </p>
        </StatusMessage>
      ) : null}

      <form className="form" onSubmit={onSubmit} aria-label="Formulaire de création d'aventurier">
        <div className="field">
          <label htmlFor="nom" className="label">
            Nom
          </label>
          <input
            id="nom"
            name="nom"
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
            name="description"
            className="textarea"
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            disabled={!canSubmit}
            rows={4}
          />
        </div>

        <div className="formGrid">
          <div className="field">
            <label htmlFor="physique" className="label">
              Physique (0-100)
            </label>
            <input
              id="physique"
              name="physique"
              className="input"
              type="number"
              value={form.physique}
              onChange={(e) =>
                setForm((f) => ({ ...f, physique: Number(e.target.value) }))
              }
              min={0}
              max={100}
              step={1}
              required
              disabled={!canSubmit}
            />
          </div>

          <div className="field">
            <label htmlFor="mental" className="label">
              Mental (0-100)
            </label>
            <input
              id="mental"
              name="mental"
              className="input"
              type="number"
              value={form.mental}
              onChange={(e) =>
                setForm((f) => ({ ...f, mental: Number(e.target.value) }))
              }
              min={0}
              max={100}
              step={1}
              required
              disabled={!canSubmit}
            />
          </div>

          <div className="field">
            <label htmlFor="perception" className="label">
              Perception (0-100)
            </label>
            <input
              id="perception"
              name="perception"
              className="input"
              type="number"
              value={form.perception}
              onChange={(e) =>
                setForm((f) => ({ ...f, perception: Number(e.target.value) }))
              }
              min={0}
              max={100}
              step={1}
              required
              disabled={!canSubmit}
            />
          </div>

          <div className="field">
            <label htmlFor="classe" className="label">
              Classe
            </label>
            <select
              id="classe"
              name="classe"
              className="select"
              value={form.classe}
              onChange={(e) =>
                setForm((f) => ({ ...f, classe: e.target.value as Classe }))
              }
              disabled={!canSubmit}
            >
              {CLASSES.map((c) => (
                <option key={c} value={c}>
                  {classIcon(c)} {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="formActions">
          <button type="submit" className="btn btn--primary" disabled={!canSubmit}>
            {apiState.status === 'loading' ? 'Création...' : 'Créer'}
          </button>
        </div>
      </form>
    </section>
  )
}

