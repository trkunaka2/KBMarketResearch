import { useState } from 'react'
import type { Entry } from '../../types'
import { entryAnswerList, formatDate } from '../../lib/format'

interface Props {
  entries: Entry[]
  onDelete: (id: string) => void
}

export function EntriesTable({ entries, onDelete }: Props) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)

  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-400">
        No responses captured yet — head to "New response" to log the first one.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900/60">
      <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {entries.map((entry) => {
          const answers = entryAnswerList(entry)
          const open = openId === entry.id
          return (
            <li key={entry.id}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : entry.id)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-neutral-800 dark:text-neutral-100">
                    {answers[0]?.value ?? 'Response'}
                  </p>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500">{formatDate(entry.createdAt)}</p>
                </div>
                <span className="shrink-0 text-xs text-blueberry-600 dark:text-blueberry-300">
                  {open ? 'Hide' : 'View'}
                </span>
              </button>

              {open && (
                <div className="border-t border-neutral-100 bg-blueberry-50/50 px-4 py-3 dark:border-neutral-800 dark:bg-blueberry-500/5">
                  <dl className="space-y-2">
                    {answers.map((a) => (
                      <div key={a.number + a.prompt}>
                        <dt className="text-[11px] font-medium uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                          Q{a.number}. {a.prompt}
                        </dt>
                        <dd className="text-[13px] text-neutral-700 dark:text-neutral-200">{a.value}</dd>
                      </div>
                    ))}
                    {entry.notes && (
                      <div>
                        <dt className="text-[11px] font-medium uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                          Notes
                        </dt>
                        <dd className="text-[13px] text-neutral-700 dark:text-neutral-200">{entry.notes}</dd>
                      </div>
                    )}
                  </dl>

                  <div className="mt-3 flex items-center gap-2">
                    {confirmId === entry.id ? (
                      <>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">Delete this response?</span>
                        <button
                          type="button"
                          onClick={() => {
                            onDelete(entry.id)
                            setConfirmId(null)
                          }}
                          className="rounded-lg bg-red-600 px-2.5 py-1 text-xs font-medium text-white"
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmId(null)}
                          className="rounded-lg border border-neutral-200 px-2.5 py-1 text-xs text-neutral-500 dark:border-neutral-700"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmId(entry.id)}
                        className="text-xs font-medium text-red-600 dark:text-red-400"
                      >
                        Delete response
                      </button>
                    )}
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
