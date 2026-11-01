'use client'

import { useOfflineSync } from '@/lib/offline/sync-engine'
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react'

export function OfflineStatusIndicator() {
  const { isOnline, pendingCount, isSyncing, syncNow } = useOfflineSync()

  // Si tout est en ligne et aucune file d'attente, garder discret ou masquer
  if (isOnline && pendingCount === 0) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div
        className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl shadow-xl border backdrop-blur-md text-xs font-semibold ${
          !isOnline
            ? 'bg-amber-500/90 text-slate-950 border-amber-400'
            : 'bg-emerald-600/90 text-white border-emerald-500'
        }`}
      >
        <div className="flex items-center gap-2">
          {!isOnline ? (
            <WifiOff className="w-4 h-4 shrink-0 animate-pulse" />
          ) : (
            <Wifi className="w-4 h-4 shrink-0" />
          )}

          <span>
            {!isOnline
              ? `Mode Hors-Ligne (Poste rural)`
              : `Connexion rétablie`}
          </span>
        </div>

        {pendingCount > 0 && (
          <div className="flex items-center gap-2 pl-2 border-l border-black/10">
            <span className="px-2 py-0.5 rounded-full bg-black/15 text-[11px] font-mono font-bold">
              {pendingCount} en attente
            </span>

            {isOnline && (
              <button
                onClick={syncNow}
                disabled={isSyncing}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer text-[11px] font-bold"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Synchronisation...' : 'Synchroniser'}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

