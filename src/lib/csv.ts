import { QUESTIONS } from '../data/questions'
import { RECORDERS, type Entry, type Recorder } from '../types'

function toRecorder(value: string): Recorder {
  return (RECORDERS as readonly string[]).includes(value) ? (value as Recorder) : 'Other'
}

const OTHER_IDS = QUESTIONS.filter((q) => 'otherId' in q && q.otherId).map((q) => (q as { otherId: string }).otherId)

const COLUMNS: { key: string; header: string }[] = [
  { key: 'id', header: 'ID' },
  { key: 'createdAt', header: 'Collected at' },
  { key: 'recordedBy', header: 'Recorded by' },
  ...QUESTIONS.map((q) => ({ key: q.id, header: `Q${q.number}. ${q.prompt}` })),
  ...OTHER_IDS.map((id) => ({ key: id, header: `${id} (other, detail)` })),
  { key: 'notes', header: 'Notes' },
]

function cell(entry: Entry, key: string): string {
  if (key === 'id') return entry.id
  if (key === 'createdAt') return entry.createdAt
  if (key === 'recordedBy') return entry.recordedBy
  if (key === 'notes') return entry.notes ?? ''
  const v = entry.answers[key]
  if (v === undefined) return ''
  if (typeof v === 'boolean') return v ? 'Yes' : 'No'
  if (Array.isArray(v)) return v.join('; ')
  return v
}

function escapeCsv(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`
  return value
}

export function entriesToCsv(entries: Entry[]): string {
  const header = COLUMNS.map((c) => escapeCsv(c.header)).join(',')
  const rows = entries.map((e) => COLUMNS.map((c) => escapeCsv(cell(e, c.key))).join(','))
  return [header, ...rows].join('\r\n')
}

export function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function exportCsv(entries: Entry[]) {
  const stamp = new Date().toISOString().slice(0, 10)
  download(`kestrel-bags-market-research-${stamp}.csv`, entriesToCsv(entries), 'text/csv;charset=utf-8')
}

export function exportJson(entries: Entry[]) {
  const stamp = new Date().toISOString().slice(0, 10)
  download(
    `kestrel-bags-market-research-backup-${stamp}.json`,
    JSON.stringify(entries, null, 2),
    'application/json',
  )
}

/** Minimal RFC4180 CSV parser: handles quoted fields, escaped quotes, commas & newlines inside quotes. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += c
      }
    } else if (c === '"') {
      inQuotes = true
    } else if (c === ',') {
      row.push(field)
      field = ''
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else {
      field += c
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }
  return rows.filter((r) => r.length > 1 || r[0] !== '')
}

const BOOL_QUESTION_IDS = new Set(QUESTIONS.filter((q) => q.type === 'boolean').map((q) => q.id))
const MULTI_QUESTION_IDS = new Set(QUESTIONS.filter((q) => q.type === 'multi').map((q) => q.id))

/** Parses a CSV previously produced by exportCsv back into entries. */
export function csvToEntries(text: string): Entry[] {
  const rows = parseCsv(text)
  if (rows.length < 2) return []
  const header = rows[0]
  const keyByIndex = header.map((h) => COLUMNS.find((c) => c.header === h)?.key)

  return rows.slice(1).map((row) => {
    const answers: Entry['answers'] = {}
    let id = ''
    let createdAt = ''
    let recordedBy = ''
    let notes: string | undefined
    row.forEach((raw, idx) => {
      const key = keyByIndex[idx]
      if (!key) return
      if (key === 'id') id = raw
      else if (key === 'createdAt') createdAt = raw
      else if (key === 'recordedBy') recordedBy = raw
      else if (key === 'notes') notes = raw || undefined
      else if (raw !== '') {
        if (BOOL_QUESTION_IDS.has(key)) answers[key] = raw.toLowerCase() === 'yes'
        else if (MULTI_QUESTION_IDS.has(key)) answers[key] = raw.split(';').map((s) => s.trim()).filter(Boolean)
        else answers[key] = raw
      }
    })
    return {
      id: id || crypto.randomUUID(),
      createdAt: createdAt || new Date().toISOString(),
      recordedBy: toRecorder(recordedBy),
      notes,
      answers,
    }
  })
}

export function jsonToEntries(text: string): Entry[] {
  const parsed = JSON.parse(text)
  if (!Array.isArray(parsed)) throw new Error('Expected a JSON array of entries')
  return parsed.map((e) => ({ ...e, recordedBy: toRecorder(e.recordedBy ?? '') }))
}
