'use client'

import { useEffect, useState } from 'react'

export interface OfflineAction {
  id: string
  actionType: 'TRIAGE' | 'CONSULTATION' | 'SOIN' | 'DISPENSATION'
  endpoint: string
  payload: any
  timestamp: number
  retryCount: number
}

const STORAGE_KEY = 'd_sante_offline_queue'

export class OfflineSyncEngine {
  private static instance: OfflineSyncEngine
  private queue: OfflineAction[] = []
  private listeners: Array<() => void> = []

  private constructor() {
    if (typeof window !== 'undefined') {
      this.loadQueue()
      window.addEventListener('online', () => this.syncAll())
    }
  }

  public static getInstance(): OfflineSyncEngine {
    if (!OfflineSyncEngine.instance) {
      OfflineSyncEngine.instance = new OfflineSyncEngine()
    }
    return OfflineSyncEngine.instance
  }

  private loadQueue() {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        this.queue = JSON.parse(data)
      }
    } catch (e) {
      console.error('Failed to load offline queue:', e)
    }
  }

  private saveQueue() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.queue))
      this.notifyListeners()
    } catch (e) {
      console.error('Failed to save offline queue:', e)
    }
  }

  public enqueue(action: Omit<OfflineAction, 'id' | 'timestamp' | 'retryCount'>): string {
    const id = `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    const newAction: OfflineAction = {
      ...action,
      id,
      timestamp: Date.now(),
      retryCount: 0,
    }
    this.queue.push(newAction)
    this.saveQueue()

    // Si on est en ligne, tenter immédiatement la synchronisation
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      this.syncAll()
    }

    return id
  }

  public getPendingCount(): number {
    return this.queue.length
  }

  public getQueue(): OfflineAction[] {
    return [...this.queue]
  }

  public async syncAll(): Promise<{ succeeded: number; failed: number }> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return { succeeded: 0, failed: this.queue.length }
    }

    let succeeded = 0
    let failed = 0
    const remaining: OfflineAction[] = []

    for (const item of this.queue) {
      try {
        const response = await fetch(item.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.payload),
        })

        if (response.ok) {
          succeeded++
        } else {
          item.retryCount++
          remaining.push(item)
          failed++
        }
      } catch (err) {
        item.retryCount++
        remaining.push(item)
        failed++
      }
    }

    this.queue = remaining
    this.saveQueue()
    return { succeeded, failed }
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback)
    }
  }

  private notifyListeners() {
    this.listeners.forEach((l) => l())
  }
}

/**
 * Hook React pour afficher l'état de la connexion et de la synchronisation hors-ligne
 */
export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState<boolean>(true)
  const [pendingCount, setPendingCount] = useState<number>(0)
  const [isSyncing, setIsSyncing] = useState<boolean>(false)

  useEffect(() => {
    const engine = OfflineSyncEngine.getInstance()
    setIsOnline(navigator.onLine)
    setPendingCount(engine.getPendingCount())

    const handleOnline = () => {
      setIsOnline(true)
      handleSync()
    }
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    const unsubscribe = engine.subscribe(() => {
      setPendingCount(engine.getPendingCount())
    })

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      unsubscribe()
    }
  }, [])

  const handleSync = async () => {
    const engine = OfflineSyncEngine.getInstance()
    if (engine.getPendingCount() === 0) return

    setIsSyncing(true)
    try {
      await engine.syncAll()
    } finally {
      setIsSyncing(false)
      setPendingCount(engine.getPendingCount())
    }
  }

  return {
    isOnline,
    pendingCount,
    isSyncing,
    syncNow: handleSync,
  }
}
