'use client'

import { useState } from 'react'
import { creerBordereauTeletransmission } from './actions'
import {
  FileCheck2, ShieldCheck, Send, CheckCircle2,
  Calendar, DollarSign, Loader2, X
} from 'lucide-react'

export function GenererBordereauIpmModal({
  onClose,
}: {
  onClose: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [organisme, setOrganisme] = useState('IPM Sonatel & Filiales')
  const [periodeDebut, setPeriodeDebut] = useState('2026-10-01')
  const [periodeFin, setPeriodeFin] = useState('2026-10-31')
  const [montant, setMontant] = useState('450000')
  const [nombre, setNombre] = useState('9')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append('organisme_nom', organisme)
    formData.append('periode_debut', periodeDebut)
    formData.append('periode_fin', periodeFin)
    formData.append('montant_total', montant)
    formData.append('nombre_factures', nombre)

    await creerBordereauTeletransmission(formData)
    setLoading(false)
    setSuccess(true)
    setTimeout(() => {
      onClose()
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden">
      <div className="bg-surface border border-surface-border rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] sm:max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-6 pb-3 flex items-start justify-between border-b border-surface-border shrink-0 bg-surface">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm sm:text-base">
                Télétransmission Bordereau IPM / CMU
              </h3>
              <p className="text-xs text-foreground-muted">
                Bordereau récapitulatif dématérialisé pour remboursement Tiers-Payant
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
          <div className="p-6 py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-foreground text-sm">
              Bordereau Télétransmis avec Succès !
            </h4>
            <p className="text-xs text-foreground-muted max-w-xs mx-auto">
              Le dossier numérique a été envoyé à l’organisme assureur pour audit médical et mise en paiement.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-foreground block">
                  Organisme Tiers-Payant (IPM / Assurance) :
                </label>
                <select
                  value={organisme}
                  onChange={(e) => setOrganisme(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-background text-foreground text-xs focus:outline-none focus:border-primary"
                >
                  <option value="IPM Sonatel & Filiales">IPM Sonatel & Filiales</option>
                  <option value="Agence de la CMU (Sénégal)">Agence de la CMU (Sénégal)</option>
                  <option value="IPM Port Autonome de Dakar">IPM Port Autonome de Dakar (PAD)</option>
                  <option value="AXA Assurances Santé">AXA Assurances Santé</option>
                  <option value="Allianz Sénégal Santé">Allianz Sénégal Santé</option>
                  <option value="Sanlam Assurance">Sanlam Assurance</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground-muted block">
                    Période du :
                  </label>
                  <input
                    type="date"
                    value={periodeDebut}
                    onChange={(e) => setPeriodeDebut(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-surface-border bg-background text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground-muted block">
                    Au :
                  </label>
                  <input
                    type="date"
                    value={periodeFin}
                    onChange={(e) => setPeriodeFin(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-surface-border bg-background text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground-muted block">
                    Nombre de Factures :
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-surface-border bg-background text-foreground text-xs focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground-muted block">
                    Montant Total Réclamé (FCFA) :
                  </label>
                  <input
                    type="number"
                    step="500"
                    value={montant}
                    onChange={(e) => setMontant(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-surface-border bg-background text-foreground text-xs font-mono font-bold focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-start gap-2 text-[11px] text-teal-800 dark:text-teal-300">
                <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  Le bordereau généré regroupe les pièces justificatives numérisées (bons de prise en charge, ordonnances signées, feuilles de soins) prêtes pour l’ordonnancement comptable.
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-6 pt-3 border-t border-surface-border shrink-0 flex justify-end gap-2 bg-surface">
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
                className="py-2.5 px-5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Télétransmettre le Bordereau</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

