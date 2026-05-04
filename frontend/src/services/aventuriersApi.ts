import { fetcher } from './openapiClient'
import type { components } from '../api/generated/aventurier'

type Aventurier = components['schemas']['Aventurier']
type ProblemDetail = components['schemas']['ProblemDetail']
type Classe = components['schemas']['Classe']

export type AventurierCreateInput = {
  nom: string
  description?: string
  physique: number
  mental: number
  perception: number
  classe: Classe
}

const listOperation = fetcher.path('/api/v1/aventuriers').method('get').create()
const getByIdOperation = fetcher
  .path('/api/v1/aventuriers/{id}')
  .method('get')
  .create()
const createOperation = fetcher.path('/api/v1/aventuriers').method('post').create()

function asProblemDetail(data: unknown): ProblemDetail | null {
  if (!data || typeof data !== 'object') return null
  const maybe = data as Partial<ProblemDetail>
  if (
    (maybe.detail && typeof maybe.detail === 'string') ||
    (maybe.title && typeof maybe.title === 'string')
  ) {
    return maybe as ProblemDetail
  }
  return null
}

function errorToMessage(e: unknown): string {
  if (e instanceof Error) return e.message
  if (!e || typeof e !== 'object') return 'Erreur inconnue'
  return JSON.stringify(e)
}

function extractProblemDetailFromOperationError(opError: unknown): ProblemDetail | null {
  // openapi-typescript-fetch lève une erreur typée dont `getActualType()` renvoie { status, data }
  const getter = (opError as { getActualType?: unknown }).getActualType
  if (typeof getter !== 'function') return null
  const actual = getter.call(opError) as { data?: unknown }
  return asProblemDetail(actual.data)
}

export async function listAventuriers(): Promise<Aventurier[]> {
  try {
    // openapi-typescript-fetch exige un 1er argument (même quand il n'y a pas de params).
    const { data } = await listOperation({})
    return data
  } catch (e) {
    const problem = extractProblemDetailFromOperationError(e)
    throw new Error(problem?.detail ?? problem?.title ?? errorToMessage(e))
  }
}

export async function getAventurierById(id: number): Promise<Aventurier> {
  try {
    const { data } = await getByIdOperation({ id })
    return data
  } catch (e) {
    const problem = extractProblemDetailFromOperationError(e)
    throw new Error(problem?.detail ?? problem?.title ?? errorToMessage(e))
  }
}

export async function createAventurier(
  payload: AventurierCreateInput,
): Promise<Aventurier> {
  try {
    // Le type généré pour AventurierCreate est trop strict à cause d'une intersection
    // (Record<string, never>). L'objet runtime est correct, on caste donc au moment de l'appel.
    const { data } = await createOperation(payload as unknown as never)
    return data
  } catch (e) {
    const problem = extractProblemDetailFromOperationError(e)
    throw new Error(problem?.detail ?? problem?.title ?? errorToMessage(e))
  }
}

