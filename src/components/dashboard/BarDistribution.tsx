import type { CountRow } from '../../lib/stats'

interface Props {
  title: string
  rows: CountRow[]
  respondents: number
  /** For multi-select questions, bars can add to more than `respondents`. */
  multi?: boolean
}

export function BarDistribution({ title, rows, respondents, multi }: Props) {
  const max = Math.max(1, ...rows.map((r) => r.count))
  const hasData = respondents > 0

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 dark:border-neutral-800 dark:bg-neutral-900/60">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-[15px] font-medium text-neutral-800 dark:text-neutral-100">{title}</h3>
        <span className="shrink-0 text-xs text-neutral-400 dark:text-neutral-500">
          {respondents} {respondents === 1 ? 'response' : 'responses'}
          {multi ? ' · pick multiple' : ''}
        </span>
      </div>

      {!hasData ? (
        <p className="py-4 text-sm text-neutral-400 dark:text-neutral-500">No responses yet.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => {
            const pct = respondents > 0 ? Math.round((row.count / respondents) * 100) : 0
            const widthPct = (row.count / max) * 100
            return (
              <div key={row.label} title={`${row.count} of ${respondents} (${pct}%)`}>
                <div className="mb-1 flex items-baseline justify-between gap-2">
                  <span className="text-[13px] text-neutral-600 dark:text-neutral-300">{row.label}</span>
                  <span className="shrink-0 text-[13px] tabular-nums text-neutral-400 dark:text-neutral-500">
                    {row.count} · {pct}%
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-blueberry-100 dark:bg-blueberry-900/70">
                  <div
                    className="h-full rounded-full bg-blueberry-500 transition-[width] duration-500 dark:bg-blueberry-450"
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
