interface Props {
  label: string
  value: number
  max: number
}

export function Meter({ label, value, max }: Props) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900/60">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200">{label}</p>
        <p className="text-sm font-semibold text-caramel-600 dark:text-caramel-450">
          {value} / {max} <span className="text-neutral-400 dark:text-neutral-500">({pct}%)</span>
        </p>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-caramel-100 dark:bg-caramel-900/60">
        <div
          className="h-full rounded-full bg-caramel-500 transition-[width] duration-500 dark:bg-caramel-450"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
