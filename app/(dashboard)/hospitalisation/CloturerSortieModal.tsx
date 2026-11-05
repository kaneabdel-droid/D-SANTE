'use client'

import { useState } from 'react'
import { LogOut, X, AlertCircle, Loader2, BedDouble, User, Calendar } from 'lucide-react'
import { libererLit } from './actions'

interface HospitalisationItem {
  id: string
  numero_sejour: string
  lit_id?: string
  date_entree: string
  motif_admission?: string
  patients?: {
    nom: string
    prenom: string
    ipp?: string
  }
  lits?: {
    numero_lit: string
    chambre: string
  }
}

export default function CloturerSortieModal({
  hospitalisation,
}: {
  hospitalisation: HospitalisationItem
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [modeSortie, setModeSortie] = useState('guerison')
  const [statutLit, setStatutLit] = useState('nettoyage')
  const [resumeSortie, setResumeSortie] = useState('')

  const handleCloturer = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const res = await libererLit(
      hospitalisation.id,
      hospitalisation.lit_id,
      modeSortie,
      resumeSortie,
      statutLit
    )

    setIsSubmitting(false)
    if (res?.error) {
      setError(res.error)
    } else {
      setIsOpen(false)
    }
  }

  const patientNom = hospitalisation.patients
    ? `${hospitalisation.patients.prenom || ''} ${hospitalisation.patients.nom || ''}`.trim()
    : 'Patient'

  const ipp = hospitalisation.patients?.ipp || ''
  const litDesc = hospitalisation.lits
    ? `Lit ${hospitalisation.lits.numero_lit} (${hospitalisation.lits.chambre})`
    : 'Lit d’hospitalisation'

  const dateEntreeObj = new Date(hospitalisation.date_entree)
  const dureeJours = Math.max(
    1,
    Math.round((new Date().getTime() - dateEntreeObj.getTime()) / (1000 * 60 * 60 * 24))
  )

  const champ =
    'block w-full rounded-xl border border-surface-border bg-background py-2.5 px-3 text-xs sm:text-sm text-foreground focus:border-danger focus:outline-none focus:ring-1 focus:ring-danger'

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true)
          setError(null)
        }}
        className="px-3 py-1.5 rounded-xl bg-danger/10 text-danger hover:bg-danger/20 text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
        title="Clôturer le séjour et libérer le lit"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Clôturer Sortie</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs overflow-hidden text-left">
          <div className="bg-surface border border-surface-border w-full max-w-lg max-h-[92vh] sm:max-h-[88vh] rounded-2xl sm:rounded-3xl shadow-2xl relative flex flex-col my-auto overflow-hidden">
            {/* En-tête fixe */}
            <div className="p-4 sm:p-6 pb-3 border-b border-surface-border/60 shrink-0 flex items-center justify-between bg-surface">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-danger/10 text-danger flex items-center justify-center shrink-0">
                  <LogOut className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-bold font-heading text-foreground">
                    Clôture du Séjour & Sortie
                  </h3>
                  <p className="text-xs text-foreground-muted">
                    Libération de la place d'hospitalisation et enregistrement du bilan de sortie.
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

            <form onSubmit={handleCloturer} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
                {/* Récapitulatif patient et séjour */}
                <div className="p-3.5 bg-background rounded-2xl border border-surface-border space-y-1.5 mb-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  <User className="w-4 h-4 text-primary" />
                  {patientNom}
                </span>
                {ipp && (
                  <span className="font-mono text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-md text-[11px]">
                    {ipp}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-foreground-muted text-[11px] pt-1">
                <span className="flex items-center gap-1">
                  <BedDouble className="w-3.5 h-3.5 text-indigo-500" />
                  {litDesc}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Entré le {dateEntreeObj.toLocaleDateString('fr-FR')} ({dureeJours} j.)
                </span>
              </div>
            </div>

              {/* Mode de sortie */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Mode de sortie <span className="text-danger">*</span>
                </label>
                <select
                  value={modeSortie}
                  onChange={(e) => setModeSortie(e.target.value)}
                  required
                  className={champ}
                >
                  <option value="guerison">Guérison complète / Retour à domicile</option>
                  <option value="amelioration">Amélioration clinique (état stabilisé)</option>
                  <option value="transfert">Transfert vers autre établissement spécialisé</option>
                  <option value="contre_avis">Sortie contre avis médical</option>
                  <option value="deces">Décès</option>
                </select>
              </div>

              {/* État du lit après libération */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Statut du lit après sortie
                </label>
                <select
                  value={statutLit}
                  onChange={(e) => setStatutLit(e.target.value)}
                  className={champ}
                >
                  <option value="nettoyage">Décontamination / Nettoyage requis (Recommandé)</option>
                  <option value="libre">Immédiatement disponible / Libre</option>
                </select>
              </div>

              {/* Résumé clinique de sortie */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Résumé clinique & Consignes de sortie
                </label>
                <textarea
                  value={resumeSortie}
                  onChange={(e) => setResumeSortie(e.target.value)}
                  rows={3}
                  placeholder="Ex: Évolution clinique favorable sous antibiothérapie. Traitement relais prescrit. Rendez-vous de suivi dans 7 jours."
                  className={champ}
                />
              </div>

              </div>

              {/* Boutons d'action fixes en bas */}
              <div className="p-4 sm:p-6 pt-3 border-t border-surface-border/60 shrink-0 flex items-center justify-end gap-3 bg-surface">
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
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold bg-danger text-white rounded-xl hover:bg-danger/90 disabled:opacity-50 transition-colors shadow-md cursor-pointer"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Confirmer la sortie</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
