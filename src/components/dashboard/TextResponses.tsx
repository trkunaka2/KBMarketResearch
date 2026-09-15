import { useState } from 'react'

interface Props {
  title: string
  responses: { text: string; createdAt: string }[]
}

const PREVIEW_COUNT = 4

export function TextResponses({ title, responses }: Props) {
  const [expanded, setExpanded] = useState(false)
  const shown = expanded ? responses : responses.slice(0, PREVIEW_COUNT)

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 dark:border-neutral-800 dark:bg-neutral-900/60">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-[15px] font-medium text-neutral-800 dark:text-neutral-100">{title}</h3>
        <span className="shrink-0 text-xs text-neutral-400 dark:text-neutral-500">
          {responses.length} {responses.length === 1 ? 'response' : 'responses'}
        </span>
      </div>

      {responses.length === 0 ? (
        <p className="py-2 text-sm text-neutral-400 dark:text-neutral-500">No responses yet.</p>
      ) : (
        <ul className="space-y-2">
          {shown.map((r, i) => (
            <li
              key={i}
              className="rounded-xl bg-blueberry-50 px-3 py-2 text-[13px] leading-snug text-neutral-700 dark:bg-blueberry-500/10 dark:text-neutral-200"
            >
              "{r.text}"
            </li>
          ))}
        </ul>
      )}

      {responses.length > PREVIEW_COUNT && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-[13px] font-medium text-blueberry-600 dark:text-blueberry-300"
        >
          {expanded ? 'Show less' : `Show all ${responses.length}`}
        </button>
      )}
    </div>
  )
}
