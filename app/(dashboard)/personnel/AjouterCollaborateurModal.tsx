'use client'

import { useState } from 'react'
import { UserPlus, Plus, X, AlertCircle, Loader2 } from 'lucide-react'
import { ajouterCollaborateur } from './actions'

export default function AjouterCollaborateurModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [role, setRole] = useState('medecin')
  const [enGarde, setEnGarde] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.set('role', role)
    formData.set('en_garde_aujourdhui', enGarde ? 'true' : 'false')

    const res = await ajouterCollaborateur(formData)
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
        <span>+ Ajouter un Collaborateur</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto text-left">
          <div className="bg-surface border border-surface-border w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-5 top-5 p-1 rounded-lg text-foreground-muted hover:text-foreground hover:bg-black/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-foreground">
                  Nouveau Membre de l'Équipe
                </h3>
                <p className="text-xs text-foreground-muted">
                  Enregistrement d'un praticien, soignant ou agent administratif.
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-danger/10 border border-danger/20 text-danger rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nom & Titre */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Nom complet avec Titre <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="nom"
                  required
                  placeholder="Ex: Dr. Fatou Diagne, Inf. Amadou Ba"
                  className={champ}
                />
              </div>

              {/* Rôle & Spécialité */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Fonction / Rôle <span className="text-danger">*</span>
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={champ}
                  >
                    <option value="medecin">Médecin Praticien</option>
                    <option value="infirmier">Infirmier Diplômé</option>
                    <option value="sage_femme">Sage-Femme d'État</option>
                    <option value="pharmacien">Pharmacien / Dépôt</option>
                    <option value="caissier">Agent de Caisse</option>
                    <option value="laborantin">Biologiste / Labo</option>
                    <option value="aide_soignant">Aide-Soignant(e)</option>
                    <option value="administrateur">Cadre Administratif</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Spécialité / Service
                  </label>
                  <input
                    type="text"
                    name="specialite"
                    placeholder="Ex: Pédiatrie, Urgences, Caisse"
                    className={champ}
                  />
                </div>
              </div>

              {/* Téléphone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    name="telephone"
                    placeholder="Ex: +221 77 123 45 67"
                    className={champ}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Ex: f.diagne@hopital.com"
                    className={champ}
                  />
                </div>
              </div>

              {/* Créneau de service & En garde */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Créneau de service habituel
                  </label>
                  <input
                    type="text"
                    name="statut_garde"
                    placeholder="Ex: En Service, Astreinte Nuit, Garde 24h"
                    defaultValue="En Service"
                    className={champ}
                  />
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={enGarde}
                      onChange={(e) => setEnGarde(e.target.checked)}
                      className="rounded border-surface-border text-primary focus:ring-primary w-4 h-4"
                    />
                    <span className="text-xs font-semibold text-foreground">
                      Actuellement en garde aujourd'hui
                    </span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-border">
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold bg-primary text-white rounded-xl hover:bg-primary-hover disabled:opacity-50 transition-colors shadow-md cursor-pointer"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Enregistrer le collaborateur</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
