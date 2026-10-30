'use client'

import { useState } from 'react'
import { Pill, Plus, X, AlertCircle } from 'lucide-react'
import { ajouterMedicament } from './actions'

export default function NouveauMedicamentModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const res = await ajouterMedicament(formData)

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
        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>+ Entrée Stock Médicament</span>
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
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-heading text-foreground">
                  Entrée de Médicaments en Pharmacie
                </h3>
                <p className="text-xs text-foreground-muted">
                  Enregistrement du lot, DCI, forme galénique et contrôle de péremption.
                </p>
              </div>
            </div>

            {error && (
              <div className="my-4 p-3 bg-danger/10 border border-danger/20 text-danger rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              {/* DCI & Nom commercial */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    DCI (Molécule) *
                  </label>
                  <input
                    type="text"
                    name="dci"
                    required
                    placeholder="ex: Paracétamol"
                    className={champ}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Nom Commercial / Marque
                  </label>
                  <input
                    type="text"
                    name="nom_commercial"
                    placeholder="ex: Doliprane"
                    className={champ}
                  />
                </div>
              </div>

              {/* Forme & Dosage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Forme Galénique
                  </label>
                  <select name="forme" defaultValue="comprime" className={champ}>
                    <option value="comprime">Comprimé</option>
                    <option value="sirop">Sirop / Flacon</option>
                    <option value="injectable">Ampoule Injectable / IV</option>
                    <option value="gellule">Gélule</option>
                    <option value="creme">Crème / Pommade</option>
                    <option value="collyre">Collyre</option>
                    <option value="solute">Soluté Perfusion</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Dosage
                  </label>
                  <input
                    type="text"
                    name="dosage"
                    placeholder="ex: 1000 mg ou 250mg/5ml"
                    className={champ}
                  />
                </div>
              </div>

              {/* Quantité & Seuil */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Quantité en Stock (Unités) *
                  </label>
                  <input
                    type="number"
                    name="quantite_en_stock"
                    defaultValue="50"
                    required
                    min="0"
                    className={champ}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Seuil d&apos;Alerte Rupture
                  </label>
                  <input
                    type="number"
                    name="seuil_alerte"
                    defaultValue="10"
                    min="1"
                    className={champ}
                  />
                </div>
              </div>

              {/* Prix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Prix Unitaire de Vente (FCFA) *
                  </label>
                  <input
                    type="number"
                    name="prix_vente"
                    required
                    placeholder="ex: 1500"
                    className={champ}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Prix d&apos;Achat (FCFA)
                  </label>
                  <input
                    type="number"
                    name="prix_achat"
                    placeholder="ex: 1000"
                    className={champ}
                  />
                </div>
              </div>

              {/* Lot & Péremption */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Numéro de Lot
                  </label>
                  <input
                    type="text"
                    name="numero_lot"
                    placeholder="ex: LT-9812A"
                    className={champ}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Date Limite de Péremption (DLUO)
                  </label>
                  <input
                    type="date"
                    name="date_peremption"
                    className={champ}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
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
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Ajout...' : 'Enregistrer en Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
