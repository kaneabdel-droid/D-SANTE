'use client'

import { useState } from 'react'
import { CheckCircle2, Clock, Loader2 } from 'lucide-react'
import { changerStatutSoin } from './actions'

export default function SoinStatutToggle({
  soinId,
  initialStatut,
}: {
  soinId: string
  initialStatut: string
}) {
  const [statut, setStatut] = useState(initialStatut)
  const [loading, setLoading] = useState(false)

  const toggleStatut = async () => {
    const nextStatut = statut === 'effectue' ? 'planifie' : 'effectue'
    setLoading(true)
    const res = await changerStatutSoin(soinId, nextStatut)
    setLoading(false)
    if (!res?.error) {
      setStatut(nextStatut)
    }
  }

  return (
    <button
      onClick={toggleStatut}
      disabled={loading}
      title="Cliquer pour changer le statut"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
        statut === 'effectue'
          ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
          : 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20'
      }`}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : statut === 'effectue' ? (
        <>
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Fait</span>
        </>
      ) : (
        <>
          <Clock className="w-3.5 h-3.5" />
          <span>À Faire</span>
        </>
      )}
    </button>
  )
}
