'use client'

import { useState } from 'react'
import { Plus, X, Users, AlertCircle, ShieldCheck } from 'lucide-react'
import { ajouterPatient } from './actions'

export default function NouveauPatientModal({
  organismes,
}: {
  organismes: any[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrganisme, setSelectedOrganisme] = useState<string>('')
  const [tauxCouverture, setTauxCouverture] = useState<number>(0)

  const handleOrganismeChange = (orgId: string) => {
    setSelectedOrganisme(orgId)
    const org = organismes.find((o) => o.id === orgId)
    if (org && org.taux_couverture_defaut) {
      setTauxCouverture(Number(org.taux_couverture_defaut))
    } else {
      setTauxCouverture(0)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const res = await ajouterPatient(formData)

    setIsSubmitting(false)
    if (res?.error) {
      setError(res.error)
    } else {
      setIsOpen(false)
    }
  }

  const inputStyle =
    'block w-full rounded-xl border border-surface-border bg-background py-2.5 px-3 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true)
          setError(null)
        }}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-primary-hover transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Nouveau Patient</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs overflow-hidden">
          <div className="bg-surface border border-surface-border w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] rounded-2xl sm:rounded-3xl shadow-2xl relative flex flex-col my-auto overflow-hidden">
            {/* En-tête fixe */}
            <div className="p-4 sm:p-6 pb-3 border-b border-surface-border/60 shrink-0 flex items-center justify-between bg-surface">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-bold font-heading text-foreground">
                    Enregistrement Fiche Patient
                  </h3>
                  <p className="text-xs text-foreground-muted">
                    Attribution automatique d&apos;un Identifiant Permanent du Patient (IPP).
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
              {/* État civil */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Prénom(s) *
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    required
                    placeholder="ex: Aminata"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Nom de famille *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    required
                    placeholder="ex: Diallo"
                    className={inputStyle}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    name="date_naissance"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Sexe *
                  </label>
                  <select name="sexe" defaultValue="F" className={inputStyle}>
                    <option value="F">Féminin (F)</option>
                    <option value="M">Masculin (M)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Groupe Sanguin
                  </label>
                  <select name="groupe_sanguin" defaultValue="" className={inputStyle}>
                    <option value="">Inconnu</option>
                    <option value="O+">O Rhésus +</option>
                    <option value="O-">O Rhésus -</option>
                    <option value="A+">A Rhésus +</option>
                    <option value="A-">A Rhésus -</option>
                    <option value="B+">B Rhésus +</option>
                    <option value="B-">B Rhésus -</option>
                    <option value="AB+">AB Rhésus +</option>
                    <option value="AB-">AB Rhésus -</option>
                  </select>
                </div>
              </div>

              {/* Coordonnées */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Téléphone (Patient)
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    placeholder="ex: +221 77 123 45 67"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Adresse / Quartier
                  </label>
                  <input
                    type="text"
                    name="adresse"
                    placeholder="ex: Médina, Rue 22"
                    className={inputStyle}
                  />
                </div>
              </div>

              {/* Personne de contact en cas d'urgence */}
              <div className="p-3 bg-surface-border/20 rounded-2xl border border-surface-border/50 space-y-2">
                <span className="text-[11px] font-bold text-foreground block">
                  Personne de contact en cas d&apos;urgence
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="personne_contact_nom"
                    placeholder="Nom du proche / accompagnant"
                    className={inputStyle}
                  />
                  <input
                    type="tel"
                    name="personne_contact_telephone"
                    placeholder="Téléphone du proche"
                    className={inputStyle}
                  />
                </div>
              </div>

              {/* Volet Tiers-Payant / Mutuelle / IPM */}
              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-foreground">
                    Prise en Charge & Assurance (Tiers-Payant)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-[11px] font-semibold text-foreground mb-1">
                      Organisme Payeur
                    </label>
                    <select
                      name="organisme_assurance_id"
                      value={selectedOrganisme}
                      onChange={(e) => handleOrganismeChange(e.target.value)}
                      className={inputStyle}
                    >
                      <option value="">Aucun (Plein Tarif)</option>
                      {organismes.map((org) => (
                        <option key={org.id} value={org.id}>
                          {org.nom} ({org.type_organisme?.toUpperCase()})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-foreground mb-1">
                      N° Assuré / Police
                    </label>
                    <input
                      type="text"
                      name="numero_assure"
                      placeholder="ex: IPM-98210"
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-foreground mb-1">
                      Couverture Tiers-Payant (%)
                    </label>
                    <input
                      type="number"
                      name="taux_couverture"
                      value={tauxCouverture}
                      onChange={(e) => setTauxCouverture(Number(e.target.value))}
                      min="0"
                      max="100"
                      className={inputStyle}
                    />
                  </div>
                </div>
              </div>

              </div>

              {/* Boutons d'action fixes en bas */}
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
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Enregistrement...' : 'Enregistrer le Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
