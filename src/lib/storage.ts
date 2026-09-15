import { useCallback, useEffect, useState } from 'react'
import type { Entry, Recorder, Settings } from '../types'

const ENTRIES_KEY = 'kb-market-research:entries'
const SETTINGS_KEY = 'kb-market-research:settings'
const CURRENT_USER_KEY = 'kb-market-research:currentUser'

const DEFAULT_SETTINGS: Settings = { goal: 50 }

function readEntries(): Entry[] {
  try {
    const raw = localStorage.getItem(ENTRIES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeEntries(entries: Entry[]) {
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries))
  window.dispatchEvent(new CustomEvent('kb-entries-changed'))
}

function readSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return DEFAULT_SETTINGS
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function useEntries() {
  const [entries, setEntries] = useState<Entry[]>(() => readEntries())

  useEffect(() => {
    const refresh = () => setEntries(readEntries())
    window.addEventListener('kb-entries-changed', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('kb-entries-changed', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  const addEntry = useCallback((entry: Entry) => {
    const next = [entry, ...readEntries()]
    writeEntries(next)
    setEntries(next)
  }, [])

  const deleteEntry = useCallback((id: string) => {
    const next = readEntries().filter((e) => e.id !== id)
    writeEntries(next)
    setEntries(next)
  }, [])

  /** Merge in entries from an import, skipping ids we already have. */
  const importEntries = useCallback((incoming: Entry[]) => {
    const existing = readEntries()
    const existingIds = new Set(existing.map((e) => e.id))
    const merged = [...existing, ...incoming.filter((e) => !existingIds.has(e.id))]
    merged.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    writeEntries(merged)
    setEntries(merged)
    return merged.length - existing.length
  }, [])

  const clearAll = useCallback(() => {
    writeEntries([])
    setEntries([])
  }, [])

  return { entries, addEntry, deleteEntry, importEntries, clearAll }
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => readSettings())

  const updateGoal = useCallback((goal: number) => {
    const next = { ...readSettings(), goal }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next))
    setSettings(next)
  }, [])

  return { settings, updateGoal }
}

function readCurrentUser(): Recorder | null {
  const raw = localStorage.getItem(CURRENT_USER_KEY)
  return raw === 'Stephanie' || raw === 'Tendayi' || raw === 'Other' ? raw : null
}

export function useCurrentUser() {
  const [currentUser, setCurrentUserState] = useState<Recorder | null>(() => readCurrentUser())

  const setCurrentUser = useCallback((user: Recorder | null) => {
    if (user) localStorage.setItem(CURRENT_USER_KEY, user)
    else localStorage.removeItem(CURRENT_USER_KEY)
    setCurrentUserState(user)
  }, [])

  return { currentUser, setCurrentUser }
}
