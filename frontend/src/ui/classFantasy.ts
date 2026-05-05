import type { components } from '../api/generated/aventurier'

type Classe = components['schemas']['Classe']

const ICONS: Record<Classe, string> = {
  MAGE: '✦',
  GUERRIER: '⚔',
  ARCHER: '➶',
  'RÔDEUR': '✧',
  'PRÊTRE': '☼',
  CHANTEUR: '♫',
  'NÉGATEUR': '☽',
  SORCIER: '✷',
  PALADIN: '🛡',
  BARD: '♬',
}

const PORTRAIT_GRADIENTS: Record<Classe, string> = {
  MAGE: 'linear-gradient(135deg, #6d5dfc, #8b5cf6)',
  GUERRIER: 'linear-gradient(135deg, #b45309, #7c2d12)',
  ARCHER: 'linear-gradient(135deg, #166534, #15803d)',
  'RÔDEUR': 'linear-gradient(135deg, #0f766e, #0ea5a4)',
  'PRÊTRE': 'linear-gradient(135deg, #f59e0b, #fbbf24)',
  CHANTEUR: 'linear-gradient(135deg, #db2777, #a21caf)',
  'NÉGATEUR': 'linear-gradient(135deg, #334155, #1e1b4b)',
  SORCIER: 'linear-gradient(135deg, #7e22ce, #4c1d95)',
  PALADIN: 'linear-gradient(135deg, #0369a1, #0ea5e9)',
  BARD: 'linear-gradient(135deg, #9a3412, #fb923c)',
}

export function classIcon(classe: Classe | undefined): string {
  if (!classe) return '◇'
  return ICONS[classe] ?? '◇'
}

export function classLabel(classe: Classe | undefined): string {
  if (!classe) return 'Classe inconnue'
  return `${classIcon(classe)} ${classe}`
}

export function classPortraitStyle(classe: Classe | undefined): string {
  if (!classe) return 'linear-gradient(135deg, #4b5563, #111827)'
  return PORTRAIT_GRADIENTS[classe]
}
