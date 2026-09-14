import type { ChoiceQuestion } from '../data/questions'
import type { Entry } from '../types'

export interface CountRow {
  label: string
  count: number
}

/** Counts option occurrences for a single/multi choice question across entries that answered it. */
export function countsForChoice(question: ChoiceQuestion, entries: Entry[]): { rows: CountRow[]; respondents: number } {
  const counts = new Map<string, number>(question.options.map((o) => [o, 0]))
  let respondents = 0
  for (const entry of entries) {
    const value = entry.answers[question.id]
    if (value === undefined || typeof value === 'boolean') continue
    respondents++
    const picked = Array.isArray(value) ? value : [value]
    for (const opt of picked) {
      if (counts.has(opt)) counts.set(opt, (counts.get(opt) ?? 0) + 1)
    }
  }
  const rows = Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
  return { rows, respondents }
}

export function booleanCounts(questionId: string, entries: Entry[]): { rows: CountRow[]; respondents: number } {
  let yes = 0
  let no = 0
  let respondents = 0
  for (const entry of entries) {
    const value = entry.answers[questionId]
    if (typeof value !== 'boolean') continue
    respondents++
    if (value) yes++
    else no++
  }
  return { rows: [{ label: 'Yes', count: yes }, { label: 'No', count: no }], respondents }
}

export function topLabel(rows: CountRow[]): string | undefined {
  const top = rows.filter((r) => r.count > 0).sort((a, b) => b.count - a.count)[0]
  return top?.label
}

export function textResponses(questionId: string, entries: Entry[]): { text: string; createdAt: string }[] {
  return entries
    .filter((e) => typeof e.answers[questionId] === 'string' && (e.answers[questionId] as string).trim() !== '')
    .map((e) => ({ text: e.answers[questionId] as string, createdAt: e.createdAt }))
}
