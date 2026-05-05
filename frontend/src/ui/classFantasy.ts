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

export function classIcon(classe: Classe | undefined): string {
  if (!classe) return '◇'
  return ICONS[classe] ?? '◇'
}

export function classLabel(classe: Classe | undefined): string {
  if (!classe) return 'Classe inconnue'
  return `${classIcon(classe)} ${classe}`
}
