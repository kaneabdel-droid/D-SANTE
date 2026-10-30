'use client'

import { useState } from 'react'
import { Receipt, Plus, X, AlertCircle, ShieldCheck } from 'lucide-react'
import { creerFacture } from './actions'

export default function NouvelleFactureModal({
  patients,
  organismes,
}: {
  patients: any[]
  organismes: any[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [montantTotal, setMontantTotal] = useState<string>('5000')
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [selectedOrganismeId, setSelectedOrganismeId] = useState<string>('')
  const [tauxCouverture, setTauxCouverture] = useState<number>(0)

  const handlePatientSelect = (patId: string) => {
    const p = patients.find((pat) => pat.id === patId)
    setSelectedPatient(p || null)
    if (p?.organisme_assurance_id) {
      setSelectedOrganismeId(p.organisme_assurance_id)
      setTauxCouverture(Number(p.taux_couverture || 80))
    } else {
      setSelectedOrganismeId('')
      setTauxCouverture(0)
    }
  }

  const handleOrganismeSelect = (orgId: string) => {
    setSelectedOrganismeId(orgId)
    const org = organismes.find((o) => o.id === orgId)
    setTauxCouverture(org?.taux_couverture_defaut ? Number(org.taux_couverture_defaut) : 0)
  }

  const total = parseFloat(montantTotal) || 0
  const partAssurance = Math.round((total * tauxCouverture) / 100)
  const partPatient = total - partAssurance

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const res = await creerFacture(formData)

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
        className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-amber-600 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>+ Nouvelle Facture / Acte</span>
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
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-heading text-foreground">
                  Émission de Facture & Encaissement
                </h3>
                <p className="text-xs text-foreground-muted">
                  Ventilation automatique : Ticket modérateur patient + Tiers-payant.
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
              {/* Choix du patient */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Patient concerné *
                </label>
                <select
                  name="patient_id"
                  required
                  onChange={(e) => handlePatientSelect(e.target.value)}
                  className={champ}
                >
                  <option value="">Sélectionner le patient...</option>
                  {patients.map((pat) => (
                    <option key={pat.id} value={pat.id}>
                      {pat.nom} {pat.prenom} ({pat.ipp})
                    </option>
                  ))}
                </select>
              </div>

              {/* Montant total */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Montant Brut Total de l&apos;Acte / Séjour (FCFA) *
                </label>
                <input
                  type="number"
                  name="montant_total"
                  required
                  value={montantTotal}
                  onChange={(e) => setMontantTotal(e.target.value)}
                  min="1"
                  className={champ}
                />
              </div>

              {/* Volet Tiers-Payant / Mutuelle */}
              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-foreground">
                    Prise en Charge Organisme (IPM / CMU)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-foreground mb-1">
                      Organisme Payeur
                    </label>
                    <select
                      name="organisme_assurance_id"
                      value={selectedOrganismeId}
                      onChange={(e) => handleOrganismeSelect(e.target.value)}
                      className={champ}
                    >
                      <option value="">Aucun (100% Patient)</option>
                      {organismes.map((org) => (
                        <option key={org.id} value={org.id}>
                          {org.nom} ({org.type_organisme?.toUpperCase()})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-foreground mb-1">
                      Taux de Couverture (%)
                    </label>
                    <input
                      type="number"
                      name="taux_couverture"
                      value={tauxCouverture}
                      onChange={(e) => setTauxCouverture(Number(e.target.value))}
                      min="0"
                      max="100"
                      className={champ}
                    />
                  </div>
                </div>

                {/* Calcul visuel de la ventilation */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-primary/20 text-xs font-mono">
                  <div className="p-2 rounded-xl bg-surface border border-surface-border">
                    <span className="text-[10px] text-foreground-muted block font-sans">
                      Part Patient (Ticket Modérateur) :
                    </span>
                    <span className="font-bold text-base text-primary">
                      {partPatient.toLocaleString()} FCFA
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-surface border border-surface-border">
                    <span className="text-[10px] text-foreground-muted block font-sans">
                      Part Tiers-Payant (À Recouvrer) :
                    </span>
                    <span className="font-bold text-base text-amber-600">
                      {partAssurance.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              </div>

              {/* Mode de règlement de la part patient */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Moyen de Paiement Patient
                  </label>
                  <select name="moyen_paiement" defaultValue="especes" className={champ}>
                    <option value="especes">Espèces / Guichet</option>
                    <option value="wave">Wave Mobile Money</option>
                    <option value="orange_money">Orange Money</option>
                    <option value="cheque">Chèque</option>
                    <option value="carte">Carte Bancaire</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="est_paye_immediat"
                    name="est_paye_immediat"
                    defaultChecked
                    className="w-4 h-4 rounded text-primary accent-primary"
                  />
                  <label htmlFor="est_paye_immediat" className="text-xs font-bold text-foreground cursor-pointer">
                    Encaisser la part patient immédiatement
                  </label>
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
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Émission...' : 'Émettre & Valider Facture'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
