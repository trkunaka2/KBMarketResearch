import { RECORDERS, type Recorder } from '../types'

interface Props {
  onSelect: (user: Recorder) => void
}

export function UserGate({ onSelect }: Props) {
  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center bg-blueberry-950 px-6"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="kestrel-wordmark-drop text-center">
        <h1 className="kestrel-wordmark kestrel-wordmark-write text-6xl leading-none text-white sm:text-7xl">
          Kestrel bags
        </h1>
        <p className="mt-2 text-xs font-medium uppercase tracking-[0.25em] text-caramel-450">Market research tool</p>
      </div>

      <p className="mt-10 mb-5 text-sm font-medium tracking-wide text-caramel-450">Welcome — choose user</p>

      <div className="w-full max-w-xs space-y-3">
        {RECORDERS.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => onSelect(name)}
            className={
              name === 'Other'
                ? 'w-full rounded-2xl border border-caramel-450/60 bg-caramel-500/15 px-4 py-3.5 text-center text-[15px] font-medium text-caramel-200 active:bg-caramel-500/25'
                : 'w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-center text-[15px] font-medium text-white active:bg-white/10'
            }
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  )
}
