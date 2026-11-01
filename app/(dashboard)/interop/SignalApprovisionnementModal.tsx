'use client'

import { useState } from 'react'
import { emettreSignalApprovisionnement } from './actions'
import {
  TrendingUp, AlertCircle, Send, CheckCircle2,
  Building2, Loader2, X, ShieldAlert
} from 'lucide-react'

export function SignalApprovisionnementModal({
  onClose,
}: {
  onClose: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [medicaments, setMedicaments] = useState('')
  const [motif, setMotif] = useState('')
  const [urgence, setUrgence] = useState<'normal' | 'urgent' | 'critique'>('urgent')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append('medicaments', medicaments)
    formData.append('motif', motif)
    formData.append('niveau_urgence', urgence)

    await emettreSignalApprovisionnement(formData)
    setLoading(false)
    setSuccess(true)
    setTimeout(() => {
      onClose()
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-surface border border-surface-border rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-surface-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base">
                Signal Prédictif d’Approvisionnement
              </h3>
              <p className="text-xs text-foreground-muted">
                Alerter les pharmacies partenaires d’une poussée de demande clinique
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-foreground-muted hover:text-foreground hover:bg-surface-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-foreground text-sm">
              Signal d’Alerte Transmis aux Officines
            </h4>
            <p className="text-xs text-foreground-muted max-w-xs mx-auto">
              Les pharmacies du réseau ont été notifiées pour passer commande préventive auprès des grossistes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-foreground block">
                Médicaments / Molécules sous tension prévisible :
              </label>
              <textarea
                required
                rows={2}
                value={medicaments}
                onChange={(e) => setMedicaments(e.target.value)}
                placeholder="ex: Coartem 20/120mg, Artésunate injectable, Paracétamol Sirop 120mg"
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-background text-foreground text-xs focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-foreground block">
                Motif clinique / Contexte épidémiologique :
              </label>
              <textarea
                required
                rows={2}
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                placeholder="ex: Flambée de paludisme saisonnier constatée aux urgences et en pédiatrie (+50% de cas sur 72h)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-background text-foreground text-xs focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-foreground block">
                Niveau d’urgence du réapprovisionnement :
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'normal', label: 'Modéré (7-10 j)', color: 'border-slate-300 text-foreground-muted' },
                  { id: 'urgent', label: 'Urgent (48-72 h)', color: 'border-amber-400 text-amber-600' },
                  { id: 'critique', label: 'Critique (24 h)', color: 'border-danger text-danger' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setUrgence(item.id as any)}
                    className={`py-2 px-2.5 rounded-xl border font-bold text-center transition-all cursor-pointer ${urgence === item.id
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : `bg-background ${item.color} hover:bg-surface-hover`
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-primary/5 border border-primary/20 rounded-2xl flex items-start gap-2 text-[11px] text-foreground-muted">
              <ShieldAlert className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>
                Ce signal sera diffusé instantanément sur les tableaux de bord D-Pharma pour anticiper les approvisionnements grossistes (Laborex, Ubipharm, Copharbiotec).
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-surface-border">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl border border-surface-border text-foreground-muted hover:text-foreground font-semibold text-xs"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="py-2.5 px-5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Diffuser le Signal</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

