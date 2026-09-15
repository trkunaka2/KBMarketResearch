interface Props {
  label: string
  value: string
  sub?: string
}

export function StatTile({ label, value, sub }: Props) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900/60">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-neutral-900 dark:text-neutral-50">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">{sub}</p>}
    </div>
  )
}
