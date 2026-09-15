import { useState } from 'react'
import { EntryForm } from './components/EntryForm'
import { Dashboard } from './components/Dashboard'
import { UserGate } from './components/UserGate'
import { useCurrentUser, useEntries, useSettings } from './lib/storage'

type Tab = 'entry' | 'dashboard'

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 19V10M12 19V5M20 19v-7" />
    </svg>
  )
}

export default function App() {
  const [tab, setTab] = useState<Tab>('entry')
  const { entries, addEntry, deleteEntry, importEntries } = useEntries()
  const { settings, updateGoal } = useSettings()
  const { currentUser, setCurrentUser } = useCurrentUser()

  if (!currentUser) {
    return <UserGate onSelect={setCurrentUser} />
  }

  return (
    <div
      className="flex flex-col bg-blueberry-50 dark:bg-blueberry-950"
      style={{ height: '100svh', paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 bg-white/80 px-4 py-1.5 text-xs backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
        <span className="text-neutral-500 dark:text-neutral-400">
          Recording as <span className="font-medium text-neutral-800 dark:text-neutral-100">{currentUser}</span>
        </span>
        <button
          type="button"
          onClick={() => setCurrentUser(null)}
          className="font-medium text-caramel-600 dark:text-caramel-450"
        >
          Switch user
        </button>
      </div>

      <main className="flex-1 overflow-y-auto">
        {tab === 'entry' ? (
          <EntryForm onSave={addEntry} entryCount={entries.length} recordedBy={currentUser} />
        ) : (
          <Dashboard
            entries={entries}
            settings={settings}
            onUpdateGoal={updateGoal}
            onDelete={deleteEntry}
            onImport={importEntries}
          />
        )}
      </main>

      <nav
        className="shrink-0 border-t border-neutral-200 bg-white/95 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/95"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="mx-auto flex max-w-5xl">
          <button
            type="button"
            onClick={() => setTab('entry')}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium ${
              tab === 'entry'
                ? 'text-blueberry-600 dark:text-blueberry-300'
                : 'text-neutral-400 dark:text-neutral-500'
            }`}
          >
            <PlusIcon />
            New response
          </button>
          <button
            type="button"
            onClick={() => setTab('dashboard')}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium ${
              tab === 'dashboard'
                ? 'text-blueberry-600 dark:text-blueberry-300'
                : 'text-neutral-400 dark:text-neutral-500'
            }`}
          >
            <ChartIcon />
            Dashboard
          </button>
        </div>
      </nav>
    </div>
  )
}
