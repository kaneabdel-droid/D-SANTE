'use client'

import { useState } from 'react'
import { repondreSubstitution, EchangeCliniquePharma } from './actions'
import {
  Pill, AlertTriangle, CheckCircle2, XCircle,
  Building2, User, Clock, ArrowRight, Loader2, X
} from 'lucide-react'

export function ValidationSubstitutionModal({
  echange,
  onClose,
}: {
  echange: EchangeCliniquePharma
  onClose: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [posologie, setPosologie] = useState(echange.posologie_ajustee || '')
  const [note, setNote] = useState('')

  const handleDecision = async (decision: 'approuve' | 'rejete') => {
    setLoading(true)
    const formData = new FormData()
    formData.append('echange_id', echange.id)
    formData.append('decision', decision)
    formData.append('reponse_medecin', note)
    formData.append('posologie_ajustee', posologie)

    await repondreSubstitution(formData)
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden">
      <div className="bg-surface border border-surface-border rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] sm:max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-6 pb-3 flex items-start justify-between border-b border-surface-border shrink-0 bg-surface">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base">
                Demande de Substitution Médicale
              </h3>
              <p className="text-xs text-foreground-muted flex items-center gap-1 mt-0.5">
                <Building2 className="w-3.5 h-3.5" />
                {echange.pharmacie_nom}
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

        {/* Corps défilable */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">

        {/* Détails du Patient */}
        <div className="bg-background rounded-2xl p-3.5 border border-surface-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            <div>
              <span className="font-bold text-foreground block">
                {echange.patient_nom || 'Patient non renseigné'}
              </span>
              <span className="font-mono text-primary text-[11px]">
                IPP : {echange.patient_ipp || 'N/A'} • Ordonnance : {echange.numero_ordonnance || 'N/A'}
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-bold uppercase">
            Rupture en Officine
          </span>
        </div>

        {/* Comparatif Médicament Prescrit vs Substitut Proposé */}
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-danger/5 border border-danger/20 text-xs">
            <span className="text-[10px] font-bold text-danger uppercase tracking-wider block mb-1">
              Médicament Prescrit Initialement (Épuisé) :
            </span>
            <span className="text-foreground font-bold text-sm block">
              {echange.medicament_prescrit}
            </span>
          </div>

          <div className="flex justify-center -my-1">
            <div className="w-7 h-7 rounded-full bg-surface border border-surface-border flex items-center justify-center text-primary shadow-xs">
              <ArrowRight className="w-4 h-4 rotate-90" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">
              Substitut / Générique Proposé par l’Officine :
            </span>
            <span className="text-foreground font-bold text-sm block text-emerald-600">
              {echange.medicament_propose}
            </span>
            {echange.motif && (
              <p className="text-foreground-muted text-[11px] pt-1">
                <span className="font-semibold text-foreground">Justification :</span> {echange.motif}
              </p>
            )}
          </div>
        </div>

        {/* Ajustement de la posologie */}
        <div className="space-y-1.5 text-xs">
          <label className="font-bold text-foreground block">
            Posologie Ajustée & Consignes de prise :
          </label>
          <input
            type="text"
            value={posologie}
            onChange={(e) => setPosologie(e.target.value)}
            placeholder="ex: 1 comprimé matin et soir pendant 7 jours au milieu des repas"
            className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-background text-foreground text-xs focus:outline-none focus:border-primary"
          />
        </div>

        {/* Note ou motif du médecin */}
        <div className="space-y-1.5 text-xs">
          <label className="font-semibold text-foreground-muted block">
            Remarque du Médecin (optionnel) :
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="ex: Substitution acceptée sous réserve de tolérance gastrique"
            className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-background text-foreground text-xs focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Actions : Approuver ou Refuser fixes en bas */}
      <div className="p-4 sm:p-6 pt-3 border-t border-surface-border shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-surface">
        <button
          onClick={() => handleDecision('rejete')}
          disabled={loading}
          className="py-2.5 px-4 rounded-xl border border-danger/30 text-danger hover:bg-danger/10 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <XCircle className="w-4 h-4" />
          <span>Refuser la Substitution</span>
        </button>

        <button
          onClick={() => handleDecision('approuve')}
          disabled={loading}
          className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          <span>Valider la Substitution</span>
        </button>
      </div>
      </div>
    </div>
  )
}

