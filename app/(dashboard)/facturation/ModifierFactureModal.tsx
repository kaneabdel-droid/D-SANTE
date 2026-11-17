'use client'

import { useState } from 'react'
import { Edit2, X, AlertCircle } from 'lucide-react'
import { modifierFacture } from './actions'

export default function ModifierFactureModal({
  facture,
  organismes = [],
}: {
  facture: any
  organismes: any[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [montantTotal, setMontantTotal] = useState<number>(Number(facture.montant_total_brut || facture.montant_total || 0))
  const [tauxCouverture, setTauxCouverture] = useState<number>(() => {
    const brut = Number(facture.montant_total_brut || facture.montant_total || 0)
    const ass = Number(facture.part_assurance || 0)
    return brut > 0 ? Math.round((ass / brut) * 100) : 0
  })

  const partAssurance = Math.round((montantTotal * tauxCouverture) / 100)
  const partPatient = Math.max(0, montantTotal - partAssurance)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.set('montant_total', String(montantTotal))
    formData.set('taux_couverture', String(tauxCouverture))

    const res = await modifierFacture(facture.id, formData)
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
        className="px-2 py-1.5 rounded-lg bg-surface-border/50 hover:bg-surface-border text-foreground text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
        title="Modifier cette facture"
      >
        <Edit2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Modifier</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-hidden text-left">
          <div className="bg-surface border border-surface-border rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-5 border-b border-surface-border/60 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base font-bold font-heading text-foreground">
                  Modifier Facture {facture.numero_facture}
                </h3>
                <p className="text-xs text-foreground-muted">
                  Patient : {facture.patients?.nom} {facture.patients?.prenom}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-foreground-muted hover:text-foreground hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Montant Brut Total (FCFA) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  required
                  value={montantTotal}
                  onChange={(e) => setMontantTotal(parseFloat(e.target.value) || 0)}
                  className={inputStyle}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Tiers-Payant / Organisme Mutuelle
                </label>
                <select
                  name="organisme_assurance_id"
                  defaultValue={facture.organisme_assurance_id || ''}
                  className={inputStyle}
                >
                  <option value="">Aucun (100% à la charge du patient)</option>
                  {organismes.map((org: any) => (
                    <option key={org.id} value={org.id}>
                      {org.nom} ({org.type_organisme?.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Taux de Prise en Charge Assurance (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={tauxCouverture}
                  onChange={(e) => setTauxCouverture(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                  className={inputStyle}
                />
              </div>

              <div className="p-3 bg-background/50 rounded-xl border border-surface-border text-xs space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Part Patient :</span>
                  <span className="font-bold text-foreground">{partPatient.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Part Tiers-Payant :</span>
                  <span className="font-bold text-primary">{partAssurance.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Moyen de Paiement Préféré
                </label>
                <select
                  name="moyen_paiement"
                  defaultValue={facture.moyen_paiement || 'especes'}
                  className={inputStyle}
                >
                  <option value="especes">Espèces</option>
                  <option value="wave">Wave</option>
                  <option value="orange_money">Orange Money</option>
                  <option value="carte">Carte Bancaire</option>
                  <option value="cheque">Chèque</option>
                  <option value="prise_en_charge">Prise en Charge (100%)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-surface-border/60 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl border border-surface-border text-foreground hover:bg-black/5 text-xs font-semibold"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Enregistrement...' : 'Enregistrer Modifications'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
