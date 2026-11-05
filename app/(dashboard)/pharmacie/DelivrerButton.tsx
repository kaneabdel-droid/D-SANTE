'use client'

import { useState } from 'react'
import { Loader2, MinusCircle, AlertCircle, CheckCircle2 } from 'lucide-react'
import { delivrerMedicament } from './actions'

export default function DelivrerButton({
  medicamentId,
  stockActuel,
  nomCommercial,
}: {
  medicamentId: string
  stockActuel: number
  nomCommercial: string
}) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const handleDelivrer = async () => {
    setMessage(null)
    setLoading(true)

    const res = await delivrerMedicament(medicamentId, 1)
    setLoading(false)

    if (res?.error) {
      setMessage({ text: res.error, type: 'error' })
      setTimeout(() => setMessage(null), 4000)
    } else {
      setMessage({ text: 'Délivré (-1)', type: 'success' })
      setTimeout(() => setMessage(null), 2500)
    }
  }

  return (
    <div className="relative inline-flex items-center justify-end">
      {message && (
        <div
          className={`absolute right-0 -top-8 z-20 px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-lg whitespace-nowrap flex items-center gap-1 ${
            message.type === 'error'
              ? 'bg-danger text-white'
              : 'bg-emerald-600 text-white'
          }`}
        >
          {message.type === 'error' ? (
            <AlertCircle className="w-3 h-3" />
          ) : (
            <CheckCircle2 className="w-3 h-3" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <button
        type="button"
        onClick={handleDelivrer}
        disabled={loading || stockActuel <= 0}
        title={stockActuel <= 0 ? 'Stock épuisé' : `Délivrer 1 unité de ${nomCommercial}`}
        className="px-3 py-1.5 rounded-xl bg-primary text-white hover:bg-primary-hover text-xs font-bold transition-colors disabled:opacity-30 inline-flex items-center gap-1.5 cursor-pointer"
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <MinusCircle className="w-3.5 h-3.5" />
        )}
        <span>Délivrer -1</span>
      </button>
    </div>
  )
}
