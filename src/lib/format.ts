import { QUESTIONS } from '../data/questions'
import type { Entry } from '../types'
import { isVisible } from './answers'

export function formatValue(questionId: string, entry: Entry): string | undefined {
  const q = QUESTIONS.find((x) => x.id === questionId)
  if (!q) return undefined
  const value = entry.answers[questionId]
  if (value === undefined || value === '') return undefined
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (Array.isArray(value)) {
    if (q.type === 'multi' && q.otherId && value.includes('Other') && entry.answers[q.otherId]) {
      const rest = value.filter((v) => v !== 'Other')
      return [...rest, `Other (${entry.answers[q.otherId]})`].join(', ')
    }
    return value.join(', ')
  }
  return value
}

export function entryAnswerList(entry: Entry): { number: number; prompt: string; value: string }[] {
  return QUESTIONS.filter((q) => !q.id.endsWith('Other') && isVisible(q, entry.answers))
    .map((q) => ({ number: q.number, prompt: q.prompt, value: formatValue(q.id, entry) }))
    .filter((x): x is { number: number; prompt: string; value: string } => Boolean(x.value))
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}
