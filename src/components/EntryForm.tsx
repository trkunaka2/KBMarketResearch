import { useMemo, useState, type FormEvent } from 'react'
import { QUESTIONS } from '../data/questions'
import type { AnswerValue, Recorder } from '../types'
import type { Entry } from '../types'
import { isVisible } from '../lib/answers'
import { QuestionField } from './QuestionField'

interface Props {
  onSave: (entry: Entry) => void
  entryCount: number
  recordedBy: Recorder
}

function newId() {
  if ('randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function EntryForm({ onSave, entryCount, recordedBy }: Props) {
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({})
  const [notes, setNotes] = useState('')
  const [savedFlash, setSavedFlash] = useState(false)

  const groups = useMemo(() => {
    const byNumber = new Map<number, typeof QUESTIONS>()
    for (const q of QUESTIONS) {
      const arr = byNumber.get(q.number) ?? []
      arr.push(q)
      byNumber.set(q.number, arr)
    }
    return Array.from(byNumber.entries()).sort((a, b) => a[0] - b[0])
  }, [])

  const setAnswer = (id: string, value: AnswerValue) => setAnswers((prev) => ({ ...prev, [id]: value }))

  const reset = () => {
    setAnswers({})
    setNotes('')
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const visibleIds = new Set(QUESTIONS.filter((q) => isVisible(q, answers)).map((q) => q.id))
    const cleanedAnswers: Record<string, AnswerValue> = {}
    for (const [id, value] of Object.entries(answers)) {
      if (visibleIds.has(id) || id.endsWith('Other')) cleanedAnswers[id] = value
    }
    const entry: Entry = {
      id: newId(),
      createdAt: new Date().toISOString(),
      recordedBy,
      notes: notes.trim() || undefined,
      answers: cleanedAnswers,
    }
    onSave(entry)
    reset()
    setSavedFlash(true)
    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => setSavedFlash(false), 2500)
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl px-4 pb-6 pt-4 sm:px-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">New response</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Kestrel Bags tote bag market research &middot; {entryCount} collected so far
          </p>
        </div>
      </div>

      {savedFlash && (
        <div className="mb-5 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 dark:border-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
          Saved! Ready for the next person.
        </div>
      )}

      <div className="space-y-5">
        {groups.map(([number, qs]) => {
          const visibleQs = qs.filter((q) => isVisible(q, answers))
          if (visibleQs.length === 0) return null
          return (
            <div
              key={number}
              className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5 dark:border-neutral-800 dark:bg-neutral-900/60"
            >
              {visibleQs.map((q, i) => (
                <div key={q.id} className={i > 0 ? 'mt-4 border-t border-dashed border-neutral-200 pt-4 dark:border-neutral-800' : ''}>
                  <div className="mb-2 flex gap-2">
                    {i === 0 && (
                      <span className="mt-0.5 inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-blueberry-100 px-1 text-[11px] font-semibold text-blueberry-700 dark:bg-blueberry-500/20 dark:text-blueberry-200">
                        {number}
                      </span>
                    )}
                    <p className={`text-[15px] font-medium text-neutral-800 dark:text-neutral-100 ${i === 0 ? '' : 'ml-7'}`}>
                      {q.prompt}
                    </p>
                  </div>
                  <div className={i === 0 ? '' : 'ml-7'}>
                    <QuestionField
                      question={q}
                      value={answers[q.id]}
                      otherValue={'otherId' in q && q.otherId ? (answers[q.otherId] as string) : undefined}
                      onChange={(v) => setAnswer(q.id, v)}
                      onOtherChange={'otherId' in q && q.otherId ? (v) => setAnswer(q.otherId!, v) : undefined}
                    />
                  </div>
                </div>
              ))}
            </div>
          )
        })}

        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5 dark:border-neutral-800 dark:bg-neutral-900/60">
          <p className="mb-2 text-[15px] font-medium text-neutral-800 dark:text-neutral-100">
            Notes <span className="font-normal text-neutral-400">(optional, for the team)</span>
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. where/how this was collected, anything worth flagging…"
            rows={2}
            className="w-full resize-y rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[15px] outline-none focus:border-blueberry-400 focus:ring-2 focus:ring-blueberry-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:ring-blueberry-500/20"
          />
        </div>
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 mt-5 border-t border-neutral-200 bg-white/95 p-3 backdrop-blur sm:-mx-6 dark:border-neutral-800 dark:bg-neutral-950/95">
        <div className="mx-auto flex max-w-2xl gap-2 px-1">
          <button
            type="button"
            onClick={reset}
            className="rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-500 dark:border-neutral-700 dark:text-neutral-400"
          >
            Clear
          </button>
          <button
            type="submit"
            className="flex-1 rounded-xl bg-blueberry-500 py-3 text-sm font-semibold text-white shadow-sm active:bg-blueberry-600 dark:bg-blueberry-450 dark:active:bg-blueberry-500"
          >
            Save entry
          </button>
        </div>
      </div>
    </form>
  )
}
