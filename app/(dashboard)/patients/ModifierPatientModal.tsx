'use client'

import { useState } from 'react'
import { Edit2, X, Users, AlertCircle } from 'lucide-react'
import { modifierPatient } from './actions'

export default function ModifierPatientModal({
  patient,
  organismes = [],
}: {
  patient: any
  organismes: any[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrganisme, setSelectedOrganisme] = useState<string>(
    patient.organisme_assurance_id || ''
  )
  const [tauxCouverture, setTauxCouverture] = useState<number>(
    patient.taux_couverture || 0
  )

  const handleOrganismeChange = (orgId: string) => {
    setSelectedOrganisme(orgId)
    const org = organismes.find((o) => o.id === orgId)
    if (org && org.taux_couverture_defaut) {
      setTauxCouverture(Number(org.taux_couverture_defaut))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const res = await modifierPatient(patient.id, formData)

    setIsSubmitting(false)
    if (res?.error) {
      setError(res.error)
    } else {
      setIsOpen(false)
    }
  }

  const inputStyle =
    'block w-full rounded-xl border border-surface-border bg-background py-2 px-3 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true)
          setError(null)
        }}
        className="px-2.5 py-1.5 rounded-lg bg-surface-border/50 hover:bg-surface-border text-foreground text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
        title="Modifier ce patient"
      >
        <Edit2 className="w-3.5 h-3.5" />
        <span>Modifier</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-hidden">
          <div className="bg-surface border border-surface-border w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] rounded-2xl shadow-2xl relative flex flex-col my-auto overflow-hidden">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-surface-border/60 shrink-0 flex items-center justify-between bg-surface">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-heading text-foreground">
                    Modifier le Patient : {patient.nom} {patient.prenom}
                  </h3>
                  <p className="text-xs text-foreground-muted">IPP : {patient.ipp}</p>
                </div>
              </div>
              <button
                type="button"
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
              <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Nom *
                    </label>
                    <input
                      name="nom"
                      type="text"
                      defaultValue={patient.nom}
                      required
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Prénom(s) *
                    </label>
                    <input
                      name="prenom"
                      type="text"
                      defaultValue={patient.prenom}
                      required
                      className={inputStyle}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Date de Naissance
                    </label>
                    <input
                      name="date_naissance"
                      type="date"
                      defaultValue={patient.date_naissance || ''}
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Sexe
                    </label>
                    <select
                      name="sexe"
                      defaultValue={patient.sexe || 'M'}
                      className={inputStyle}
                    >
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Groupe Sanguin
                    </label>
                    <select
                      name="groupe_sanguin"
                      defaultValue={patient.groupe_sanguin || ''}
                      className={inputStyle}
                    >
                      <option value="">Non déterminé</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Téléphone
                    </label>
                    <input
                      name="telephone"
                      type="tel"
                      defaultValue={patient.telephone || ''}
                      placeholder="+221 ..."
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Adresse / Quartier
                    </label>
                    <input
                      name="adresse"
                      type="text"
                      defaultValue={patient.adresse || ''}
                      className={inputStyle}
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-surface-border bg-background/50 space-y-2.5">
                  <h4 className="text-xs font-bold text-foreground">
                    Assurance / Mutuelle / IPM
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-foreground-muted mb-1">
                        Organisme
                      </label>
                      <select
                        name="organisme_assurance_id"
                        value={selectedOrganisme}
                        onChange={(e) => handleOrganismeChange(e.target.value)}
                        className={inputStyle}
                      >
                        <option value="">Aucun (Plein tarif)</option>
                        {organismes.map((o) => (
                          <option key={o.id} value={o.id}>
                            {o.nom}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-foreground-muted mb-1">
                        N° Assuré
                      </label>
                      <input
                        name="numero_assure"
                        type="text"
                        defaultValue={patient.numero_assure || ''}
                        className={inputStyle}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-foreground-muted mb-1">
                        Taux Prise en Charge (%)
                      </label>
                      <input
                        name="taux_couverture"
                        type="number"
                        min="0"
                        max="100"
                        value={tauxCouverture}
                        onChange={(e) => setTauxCouverture(Number(e.target.value))}
                        className={inputStyle}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-surface-border/60 shrink-0 flex items-center justify-end gap-2 bg-surface">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl border border-surface-border text-foreground hover:bg-black/5 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Enregistrement...' : 'Sauvegarder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

