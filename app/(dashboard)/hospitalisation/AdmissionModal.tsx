'use client'

import { useState } from 'react'
import { BedDouble, Plus, X, AlertCircle } from 'lucide-react'
import { admettrePatient } from './actions'

export default function AdmissionModal({
  patients,
  litsDisponibles,
}: {
  patients: any[]
  litsDisponibles: any[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const res = await admettrePatient(formData)

    setIsSubmitting(false)
    if (res?.error) {
      setError(res.error)
    } else {
      setIsOpen(false)
    }
  }

  const champ =
    'block w-full rounded-xl border border-surface-border bg-background py-2.5 px-3 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true)
          setError(null)
        }}
        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-indigo-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Nouvelle Admission</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs overflow-hidden">
          <div className="bg-surface border border-surface-border w-full max-w-xl max-h-[92vh] sm:max-h-[88vh] rounded-2xl sm:rounded-3xl shadow-2xl relative flex flex-col my-auto overflow-hidden">
            {/* En-tête fixe */}
            <div className="p-4 sm:p-6 pb-3 border-b border-surface-border/60 shrink-0 flex items-center justify-between bg-surface">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                  <BedDouble className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-bold font-heading text-foreground">
                    Admission en Hospitalisation
                  </h3>
                  <p className="text-xs text-foreground-muted">
                    Attribution de lit, pavillon et ouverture du séjour hospitalier.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mx-4 sm:mx-6 mt-3 p-3 bg-danger/10 border border-danger/20 text-danger rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
                {/* Choix patient */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Patient à admettre *
                  </label>
                  <select name="patient_id" required className={champ}>
                    <option value="">Sélectionner le patient...</option>
                    {patients.map((pat) => (
                      <option key={pat.id} value={pat.id}>
                        {pat.nom} {pat.prenom} ({pat.ipp})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Choix lit */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Lit & Chambre disponible *
                  </label>
                  <select name="lit_id" required className={champ}>
                    <option value="">Sélectionner un lit libre...</option>
                    {litsDisponibles.map((lit) => (
                      <option key={lit.id} value={lit.id}>
                        Lit {lit.numero_lit} - {lit.chambre} ({lit.categorie?.toUpperCase()})
                      </option>
                    ))}
                  </select>
                  {litsDisponibles.length === 0 && (
                    <p className="text-[11px] text-danger mt-1">
                      ⚠ Aucun lit disponible actuellement en statut &quot;libre&quot;.
                    </p>
                  )}
                </div>

                {/* Motif */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Motif d&apos;hospitalisation *
                  </label>
                  <textarea
                    name="motif_admission"
                    rows={2}
                    required
                    placeholder="ex: Surveillance post-opératoire, réhydratation IV, antibiothérapie..."
                    className={champ}
                  />
                </div>

                {/* Date sortie estimée */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Date de sortie prévisionnelle
                  </label>
                  <input
                    type="date"
                    name="date_sortie_prevue"
                    className={champ}
                  />
                </div>

              </div>

              {/* Boutons validation fixes en bas */}
              <div className="p-4 sm:p-6 pt-3 border-t border-surface-border/60 shrink-0 flex items-center justify-end gap-3 bg-surface">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-surface-border text-foreground-muted hover:text-foreground text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || litsDisponibles.length === 0}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Admission...' : 'Valider l’Admission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
