import { fetcher } from './openapiClient'
import type { components } from '../api/generated/aventurier'

export type Competence = components['schemas']['Competence']
export type CompetenceCreate = components['schemas']['CompetenceCreate']
export type CompetenceUpdate = components['schemas']['CompetenceUpdate']
export type CompetencesDisponibles = components['schemas']['CompetencesDisponibles']
export type AventuriersByCompetence = components['schemas']['AventuriersByCompetence']
export type PrerequisCompetence = components['schemas']['PrerequisCompetence']
export type Classe = components['schemas']['Classe']
export type Caracteristique = components['schemas']['Caracteristique']

const listOp = fetcher.path('/api/v1/competences').method('get').create()
const createOp = fetcher.path('/api/v1/competences').method('post').create()
const getByIdOp = fetcher.path('/api/v1/competences/{id}').method('get').create()
const updateOp = fetcher.path('/api/v1/competences/{id}').method('put').create()
const deleteOp = fetcher.path('/api/v1/competences/{id}').method('delete').create()
const getByAventurierOp = fetcher
  .path('/api/v1/aventuriers/{id}/competences')
  .method('get')
  .create()
const getDisponiblesOp = fetcher
  .path('/api/v1/aventuriers/{id}/competences/disponibles')
  .method('get')
  .create()
const addToAventurierOp = fetcher
  .path('/api/v1/aventuriers/{id}/competences/{cId}')
  .method('post')
  .create()
const removeFromAventurierOp = fetcher
  .path('/api/v1/aventuriers/{id}/competences/{cId}')
  .method('delete')
  .create()
const getAventuriersByCompetenceOp = fetcher
  .path('/api/v1/competences/{id}/aventuriers')
  .method('get')
  .create()

export type ApiConflictError = {
  kind: 'conflict'
  message: string
  aventuriersImpactes: { id: number; nom: string; prerequisManquants: string[] }[]
}

function errorMessage(e: unknown): string {
  if (e instanceof Error) return e.message
  if (!e || typeof e !== 'object') return 'Erreur inconnue'
  return JSON.stringify(e)
}

function extractActualData(e: unknown): Record<string, unknown> | null {
  const getter = (e as { getActualType?: unknown }).getActualType
  if (typeof getter !== 'function') return null
  const actual = getter.call(e) as { data?: unknown }
  if (!actual?.data || typeof actual.data !== 'object') return null
  return actual.data as Record<string, unknown>
}

function extractProblem(e: unknown): string {
  const data = extractActualData(e)
  if (!data) return errorMessage(e)
  const msg =
    (typeof data['detail'] === 'string' ? data['detail'] : null) ??
    (typeof data['title'] === 'string' ? data['title'] : null)
  return msg ?? errorMessage(e)
}

// ── F1 – Lister toutes les compétences ──────────────────────────────────────

export async function listCompetences(): Promise<Competence[]> {
  try {
    const { data } = await listOp({})
    return data
  } catch (e) {
    throw new Error(extractProblem(e))
  }
}

// ── F2 / Detail ──────────────────────────────────────────────────────────────

export async function getCompetenceById(id: string): Promise<Competence> {
  try {
    const { data } = await getByIdOp({ id })
    return data
  } catch (e) {
    throw new Error(extractProblem(e))
  }
}

// ── F3 – Créer une compétence ────────────────────────────────────────────────

export async function createCompetence(payload: CompetenceCreate): Promise<Competence> {
  try {
    const { data } = await createOp(payload as unknown as never)
    return data
  } catch (e) {
    throw new Error(extractProblem(e))
  }
}

// ── F4 – Modifier une compétence ─────────────────────────────────────────────

export async function updateCompetence(
  id: string,
  payload: CompetenceUpdate,
): Promise<Competence> {
  try {
    const { data } = await updateOp({ id, ...payload } as unknown as never)
    return data
  } catch (e) {
    const data = extractActualData(e)
    if (data && Array.isArray(data['aventuriersImpactes'])) {
      const conflict: ApiConflictError = {
        kind: 'conflict',
        message: typeof data['detail'] === 'string' ? data['detail'] : 'Conflit détecté.',
        aventuriersImpactes: data['aventuriersImpactes'] as ApiConflictError['aventuriersImpactes'],
      }
      throw conflict
    }
    throw new Error(extractProblem(e))
  }
}

// ── F5 – Supprimer une compétence ────────────────────────────────────────────

export async function deleteCompetence(id: string): Promise<void> {
  try {
    await deleteOp({ id })
  } catch (e) {
    throw new Error(extractProblem(e))
  }
}

// ── F6 – Compétences d'un aventurier ────────────────────────────────────────

export async function getCompetencesByAventurierId(aventurierId: number): Promise<Competence[]> {
  try {
    const { data } = await getByAventurierOp({ id: aventurierId })
    return data
  } catch (e) {
    throw new Error(extractProblem(e))
  }
}

// ── F9 – Compétences disponibles et bloquées ────────────────────────────────

export async function getCompetencesDisponibles(
  aventurierId: number,
): Promise<CompetencesDisponibles> {
  try {
    const { data } = await getDisponiblesOp({ id: aventurierId })
    return data
  } catch (e) {
    throw new Error(extractProblem(e))
  }
}

// ── F7 – Ajouter une compétence à un aventurier ──────────────────────────────

export async function addCompetenceToAventurier(
  aventurierId: number,
  competenceId: string,
): Promise<void> {
  try {
    await addToAventurierOp({ id: aventurierId, cId: competenceId })
  } catch (e) {
    throw new Error(extractProblem(e))
  }
}

// ── F8 – Retirer une compétence d'un aventurier ──────────────────────────────

export async function removeCompetenceFromAventurier(
  aventurierId: number,
  competenceId: string,
): Promise<void> {
  try {
    await removeFromAventurierOp({ id: aventurierId, cId: competenceId })
  } catch (e) {
    throw new Error(extractProblem(e))
  }
}

// ── F10 – Aventuriers par compétence ────────────────────────────────────────

export async function getAventuriersByCompetenceId(
  competenceId: string,
): Promise<AventuriersByCompetence> {
  try {
    const { data } = await getAventuriersByCompetenceOp({ id: competenceId })
    return data
  } catch (e) {
    throw new Error(extractProblem(e))
  }
}
