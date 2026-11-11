'use client'

import { useState } from 'react'
import { Trash2, Edit2, X, Pill, AlertCircle, ArrowDownRight } from 'lucide-react'
import { modifierMedicament, supprimerMedicament, delivrerMedicament } from './actions'

export default function PharmacieRowActions({
  medicament,
  isExempleFiligrane = false,
}: {
  medicament: any
  isExempleFiligrane?: boolean
}) {
  const [isOpenEdit, setIsOpenEdit] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDelivering, setIsDelivering] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isExempleFiligrane) {
    return (
      <div className="flex items-center justify-end gap-1.5 text-[11px] text-foreground-muted italic">
        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium border border-amber-500/20">
          Exemple indicatif
        </span>
      </div>
    )
  }

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Voulez-vous vraiment supprimer le produit « ${medicament.nom_commercial || medicament.dci} » ?`
      )
    ) {
      return
    }

    setIsDeleting(true)
    const res = await supprimerMedicament(medicament.id)
    setIsDeleting(false)

    if (res?.error) {
      alert(`Erreur : ${res.error}`)
    }
  }

  const handleDelivrerRapide = async () => {
    if (medicament.quantite_en_stock <= 0) {
      alert('Stock épuisé pour ce médicament.')
      return
    }
    setIsDelivering(true)
    const res = await delivrerMedicament(medicament.id, 1)
    setIsDelivering(false)
    if (res?.error) {
      alert(res.error)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const res = await modifierMedicament(medicament.id, formData)

    setIsSubmitting(false)
    if (res?.error) {
      setError(res.error)
    } else {
      setIsOpenEdit(false)
    }
  }

  const inputStyle =
    'block w-full rounded-xl border border-surface-border bg-background py-2 px-3 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

  return (
    <div className="flex items-center justify-end gap-1.5">
      <button
        type="button"
        onClick={handleDelivrerRapide}
        disabled={isDelivering || medicament.quantite_en_stock <= 0}
        className="px-2.5 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
        title="Délivrer 1 unité rapidement"
      >
        <ArrowDownRight className="w-3.5 h-3.5" />
        <span>Délivrer (-1)</span>
      </button>

      <button
        type="button"
        onClick={() => {
          setIsOpenEdit(true)
          setError(null)
        }}
        className="px-2.5 py-1.5 rounded-lg bg-surface-border/50 hover:bg-surface-border text-foreground text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
        title="Modifier ce médicament"
      >
        <Edit2 className="w-3.5 h-3.5" />
        <span>Modifier</span>
      </button>

      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-1.5 rounded-lg text-danger/70 hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer disabled:opacity-50"
        title="Supprimer ce médicament"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {isOpenEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-hidden text-left">
          <div className="bg-surface border border-surface-border w-full max-w-lg max-h-[92vh] sm:max-h-[88vh] rounded-2xl shadow-2xl relative flex flex-col my-auto overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-surface-border/60 shrink-0 flex items-center justify-between bg-surface">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-heading text-foreground">
                    Modifier Médicament
                  </h3>
                  <p className="text-xs text-foreground-muted">
                    {medicament.dci} {medicament.dosage ? `(${medicament.dosage})` : ''}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpenEdit(false)}
                className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground"
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

            <form onSubmit={handleEditSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      DCI (Molécule) *
                    </label>
                    <input
                      name="dci"
                      type="text"
                      defaultValue={medicament.dci}
                      required
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Nom Commercial
                    </label>
                    <input
                      name="nom_commercial"
                      type="text"
                      defaultValue={medicament.nom_commercial || ''}
                      className={inputStyle}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Forme
                    </label>
                    <select
                      name="forme"
                      defaultValue={medicament.forme || 'comprime'}
                      className={inputStyle}
                    >
                      <option value="comprime">Comprimé</option>
                      <option value="gellule">Gélule</option>
                      <option value="sirop">Sirop / Flacon</option>
                      <option value="injectable">Injectable / Ampoule</option>
                      <option value="pommade">Pommade / Crème</option>
                      <option value="collyre">Collyre</option>
                      <option value="sachet">Sachet / Poudre</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Dosage
                    </label>
                    <input
                      name="dosage"
                      type="text"
                      defaultValue={medicament.dosage || ''}
                      placeholder="ex: 500 mg, 1g"
                      className={inputStyle}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Quantité en Stock *
                    </label>
                    <input
                      name="quantite_en_stock"
                      type="number"
                      min="0"
                      defaultValue={medicament.quantite_en_stock}
                      required
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Seuil d&apos;Alerte
                    </label>
                    <input
                      name="seuil_alerte"
                      type="number"
                      min="1"
                      defaultValue={medicament.seuil_alerte || 10}
                      className={inputStyle}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Prix Vente Unitaire (FCFA) *
                    </label>
                    <input
                      name="prix_vente"
                      type="number"
                      min="1"
                      defaultValue={medicament.prix_vente}
                      required
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Prix Achat Unitaire
                    </label>
                    <input
                      name="prix_achat"
                      type="number"
                      min="0"
                      defaultValue={medicament.prix_achat || 0}
                      className={inputStyle}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      N° de Lot
                    </label>
                    <input
                      name="numero_lot"
                      type="text"
                      defaultValue={medicament.numero_lot || ''}
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Date de Péremption
                    </label>
                    <input
                      name="date_peremption"
                      type="date"
                      defaultValue={medicament.date_peremption || ''}
                      className={inputStyle}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-surface-border/60 shrink-0 flex items-center justify-end gap-2 bg-surface">
                <button
                  type="button"
                  onClick={() => setIsOpenEdit(false)}
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
    </div>
  )
}

