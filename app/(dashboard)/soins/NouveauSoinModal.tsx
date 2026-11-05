'use client'

import { useState } from 'react'
import { Syringe, Plus, X, AlertCircle, Loader2, CheckCircle2, Clock } from 'lucide-react'
import { enregistrerSoin } from './actions'

interface PatientOption {
  id: string
  nom: string
  prenom: string
  ipp: string
  telephone?: string
}

export default function NouveauSoinModal({
  patients,
}: {
  patients: PatientOption[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [typeSoin, setTypeSoin] = useState('injection')
  const [statut, setStatut] = useState<'effectue' | 'planifie'>('effectue')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.set('statut', statut)

    const res = await enregistrerSoin(formData)
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
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-primary-hover transition-colors cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>+ Enregistrer un Soin</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-surface border border-surface-border w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-5 top-5 p-1 rounded-lg text-foreground-muted hover:text-foreground hover:bg-black/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Syringe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-heading text-foreground">
                  Enregistrer un Acte de Soin
                </h3>
                <p className="text-xs text-foreground-muted">
                  Administration de traitement, injection, perfusion ou pansement au chevet.
                </p>
              </div>
            </div>

            {error && (
              <div className="my-4 p-3 bg-danger/10 border border-danger/20 text-danger rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {/* Patient */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Patient <span className="text-danger">*</span>
                </label>
                {patients && patients.length > 0 ? (
                  <select name="patient_id" required className={champ} defaultValue="">
                    <option value="" disabled>
                      -- Sélectionner un patient --
                    </option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nom} {p.prenom} ({p.ipp})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-700 rounded-xl text-xs">
                    Aucun patient enregistré. Créez d'abord un patient dans le menu Patients.
                  </div>
                )}
              </div>

              {/* Type de soin & Statut */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Type d'acte <span className="text-danger">*</span>
                  </label>
                  <select
                    name="type_soin"
                    value={typeSoin}
                    onChange={(e) => setTypeSoin(e.target.value)}
                    required
                    className={champ}
                  >
                    <option value="injection">Injection (IM, IV, SC)</option>
                    <option value="perfusion">Perfusion / Sérum</option>
                    <option value="pansement">Pansement / Plaie</option>
                    <option value="nebulisation">Nébulisation / Aérosol</option>
                    <option value="sondage">Sondage (Urinaire/Gastr.)</option>
                    <option value="prelevement">Prélèvement sanguin</option>
                    <option value="autre">Autre acte de soin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Statut de réalisation
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setStatut('effectue')}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                        statut === 'effectue'
                          ? 'bg-emerald-500/15 border-emerald-500 text-emerald-600'
                          : 'border-surface-border text-foreground-muted hover:bg-background'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Effectué</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatut('planifie')}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                        statut === 'planifie'
                          ? 'bg-amber-500/15 border-amber-500 text-amber-600'
                          : 'border-surface-border text-foreground-muted hover:bg-background'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>À faire</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Emplacement / Lit & Soignant */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Emplacement / Lit / Box
                  </label>
                  <input
                    type="text"
                    name="emplacement"
                    placeholder="Ex: Lit L101, Box 2, Salle soins"
                    className={champ}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Soignant responsable
                  </label>
                  <input
                    type="text"
                    name="soignant_nom"
                    placeholder="Ex: Inf. Diallo, SF Diop"
                    className={champ}
                  />
                </div>
              </div>

              {/* Description & Médicaments */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Détail du Soin / Médicament & Posologie <span className="text-danger">*</span>
                </label>
                <textarea
                  name="description"
                  required
                  rows={2}
                  placeholder="Ex: Céftriaxone 1g IVD lente après dilution. Rinçage sérum phy."
                  className={champ}
                />
              </div>

              {/* Observations & Constantes */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Observations / Tolérance du patient
                </label>
                <input
                  type="text"
                  name="observations"
                  placeholder="Ex: Bonne tolérance, TA 120/80, pas de réaction"
                  className={champ}
                />
              </div>

              {/* Boutons d'action */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-foreground-muted hover:text-foreground rounded-xl"
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !patients || patients.length === 0}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold bg-primary text-white rounded-xl hover:bg-primary-hover disabled:opacity-50 transition-colors shadow-md cursor-pointer"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Enregistrer le soin</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
