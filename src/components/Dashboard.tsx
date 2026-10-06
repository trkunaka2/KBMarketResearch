import { useMemo, useRef, useState } from 'react'
import { CHOICE_QUESTIONS, QUESTIONS } from '../data/questions'
import type { Entry, Settings } from '../types'
import { booleanCounts, countsForChoice, textResponses, topLabel } from '../lib/stats'
import { csvToEntries, exportCsv, exportJson, jsonToEntries } from '../lib/csv'
import { StatTile } from './dashboard/StatTile'
import { Meter } from './dashboard/Meter'
import { BarDistribution } from './dashboard/BarDistribution'
import { TextResponses } from './dashboard/TextResponses'
import { EntriesTable } from './dashboard/EntriesTable'

interface Props {
  entries: Entry[]
  settings: Settings
  onUpdateGoal: (goal: number) => void
  onDelete: (id: string) => void
  onImport: (entries: Entry[]) => number
}

const TEXT_QUESTIONS = QUESTIONS.filter((q) => q.type === 'text')

function thisWeekCount(entries: Entry[]): number {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  return entries.filter((e) => new Date(e.createdAt).getTime() >= weekAgo).length
}

export function Dashboard({ entries, settings, onUpdateGoal, onDelete, onImport }: Props) {
  const [goalDraft, setGoalDraft] = useState(String(settings.goal))
  const [toast, setToast] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  const ownership = useMemo(() => booleanCounts('ownsToteBag', entries), [entries])
  const topPrice = useMemo(() => topLabel(countsForChoice(
    CHOICE_QUESTIONS.find((q) => q.id === 'priceRange')!,
    entries,
  ).rows), [entries])

  const flash = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleImportFile = async (file: File) => {
    try {
      const text = await file.text()
      const incoming = file.name.endsWith('.json') ? jsonToEntries(text) : csvToEntries(text)
      const added = onImport(incoming)
      flash(`Imported ${added} new response${added === 1 ? '' : 's'}${incoming.length - added > 0 ? ` (${incoming.length - added} already had it)` : ''}.`)
    } catch {
      flash('Could not read that file — export a CSV/JSON from this app first.')
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-4 sm:px-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">Dashboard</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Kestrel Bags tote bag market research</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => exportCsv(entries)}
            disabled={entries.length === 0}
            className="rounded-xl bg-blueberry-500 px-3 py-2 text-sm font-medium text-white disabled:opacity-40 dark:bg-blueberry-450"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => exportJson(entries)}
            disabled={entries.length === 0}
            className="rounded-xl border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-600 disabled:opacity-40 dark:border-neutral-700 dark:text-neutral-300"
          >
            Backup JSON
          </button>
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="rounded-xl border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-600 dark:border-neutral-700 dark:text-neutral-300"
          >
            Import
          </button>
          <input
            ref={fileInput}
            type="file"
            accept=".csv,.json"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleImportFile(file)
              e.target.value = ''
            }}
          />
        </div>
      </div>

      {toast && (
        <div className="mb-4 rounded-xl border border-blueberry-200 bg-blueberry-50 px-4 py-3 text-sm font-medium text-blueberry-800 dark:border-blueberry-800 dark:bg-blueberry-500/10 dark:text-blueberry-200">
          {toast}
        </div>
      )}

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Total responses" value={String(entries.length)} sub={`+${thisWeekCount(entries)} this week`} />
        <StatTile
          label="Own a tote bag"
          value={ownership.respondents ? `${Math.round((ownership.rows[0].count / ownership.respondents) * 100)}%` : '—'}
          sub={`${ownership.rows[0]?.count ?? 0} of ${ownership.respondents} answered`}
        />
        <StatTile label="Top price point" value={topPrice ?? '—'} />
        <div className="col-span-2 sm:col-span-1">
          <Meter label="Goal progress" value={entries.length} max={Math.max(1, settings.goal)} />
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-dashed border-neutral-300 bg-white/60 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-900/40">
        <label className="text-neutral-500 dark:text-neutral-400" htmlFor="goal-input">
          Response goal:
        </label>
        <input
          id="goal-input"
          type="number"
          min={1}
          value={goalDraft}
          onChange={(e) => setGoalDraft(e.target.value)}
          onBlur={() => {
            const n = Math.max(1, Number(goalDraft) || settings.goal)
            setGoalDraft(String(n))
            onUpdateGoal(n)
          }}
          className="w-20 rounded-lg border border-neutral-200 bg-white px-2 py-1 text-center dark:border-neutral-700 dark:bg-neutral-900"
        />
        <span className="text-neutral-400">responses</span>
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        Response breakdown
      </h2>
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <BarDistribution title="Q8. Owns a tote bag?" rows={ownership.rows} respondents={ownership.respondents} />
        {CHOICE_QUESTIONS.map((q) => {
          const { rows, respondents } = countsForChoice(q, entries)
          return (
            <BarDistribution
              key={q.id}
              title={`Q${q.number}. ${q.prompt}`}
              rows={rows}
              respondents={respondents}
              multi={q.type === 'multi'}
            />
          )
        })}
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        Open-ended responses
      </h2>
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {TEXT_QUESTIONS.map((q) => (
          <TextResponses key={q.id} title={`Q${q.number}. ${q.prompt}`} responses={textResponses(q.id, entries)} />
        ))}
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        All responses
      </h2>
      <EntriesTable entries={entries} onDelete={onDelete} />
    </div>
  )
}
