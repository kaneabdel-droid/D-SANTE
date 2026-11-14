'use client'

import { useState } from 'react'
import { Wallet, X, AlertCircle, Loader2, CheckCircle2, User, Receipt, Smartphone } from 'lucide-react'
import { encaisserFacture } from './actions'
import { ModalEncaissementDirect } from '@/components/ModalEncaissementDirect'

interface FactureItem {
  id: string
  numero_facture: string
  part_patient: number
  montant_regle_patient?: number
  patients?: {
    nom: string
    prenom: string
    ipp?: string
  }
}

export default function EncaisserModal({
  facture,
}: {
  facture: FactureItem
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resteAPayer = Math.max(0, Number(facture.part_patient || 0) - Number(facture.montant_regle_patient || 0))
  const [montant, setMontant] = useState(resteAPayer)
  const [moyenPaiement, setMoyenPaiement] = useState('especes')
  const [modalDirectOuvert, setModalDirectOuvert] = useState(false)

  const handleEncaisser = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const res = await encaisserFacture(facture.id, moyenPaiement, Number(montant))
    setIsSubmitting(false)

    if (res?.error) {
      setError(res.error)
    } else {
      setIsOpen(false)
    }
  }

  const patientNom = facture.patients
    ? `${facture.patients.prenom || ''} ${facture.patients.nom || ''}`.trim()
    : 'Patient'

  const formatCFA = (val: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'decimal', maximumFractionDigits: 0 }).format(val) + ' FCFA'

  const champ =
    'block w-full rounded-xl border border-surface-border bg-background py-2.5 px-3 text-xs sm:text-sm text-foreground focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600'

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setMontant(resteAPayer)
          setIsOpen(true)
          setError(null)
        }}
        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
        title="Encaisser le règlement patient"
      >
        <Wallet className="w-3.5 h-3.5" />
        <span>Encaisser</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs overflow-hidden text-left">
          <div className="bg-surface border border-surface-border w-full max-w-md max-h-[92vh] sm:max-h-[88vh] rounded-2xl sm:rounded-3xl shadow-2xl relative flex flex-col my-auto overflow-hidden">
            {/* En-tête fixe */}
            <div className="p-4 sm:p-6 pb-3 border-b border-surface-border/60 shrink-0 flex items-center justify-between bg-surface">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold font-heading text-foreground">
                    Encaissement Facture
                  </h3>
                  <p className="text-xs text-foreground-muted">
                    Enregistrement du règlement de la part patient.
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

            <form onSubmit={handleEncaisser} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
                {/* Récapitulatif facture */}
                <div className="p-3.5 bg-background rounded-2xl border border-surface-border space-y-2 mb-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-primary" />
                      {patientNom}
                    </span>
                    <span className="font-mono text-foreground-muted text-[11px] flex items-center gap-1">
                      <Receipt className="w-3 h-3" />
                      {facture.numero_facture}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-surface-border/60">
                    <span className="text-foreground-muted">Reste dû par le patient :</span>
                    <span className="font-bold font-mono text-emerald-600 text-sm">
                      {formatCFA(resteAPayer)}
                    </span>
                  </div>
                </div>

                {/* Montant encaissé */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Montant encaissé (FCFA) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={resteAPayer > 0 ? resteAPayer : undefined}
                    value={montant}
                    onChange={(e) => setMontant(Number(e.target.value))}
                    className={champ}
                  />
                </div>

                {/* Moyen de paiement */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Mode de règlement <span className="text-danger">*</span>
                  </label>
                  <select
                    value={moyenPaiement}
                    onChange={(e) => setMoyenPaiement(e.target.value)}
                    className={champ}
                  >
                    <option value="especes">Espèces (Caisse)</option>
                    <option value="wave">Wave Mobile Money</option>
                    <option value="orange_money">Orange Money</option>
                    <option value="carte">Carte Bancaire</option>
                    <option value="cheque">Chèque bancaire</option>
                    <option value="prise_en_charge">Prise en charge directe</option>
                  </select>
                </div>

                {montant > 0 && (
                  <button
                    type="button"
                    onClick={() => setModalDirectOuvert(true)}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Encaissement Direct Patient (QR Wave / OM / TPE 0% Frais)</span>
                  </button>
                )}

              </div>

              {/* Actions fixes en bas */}
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
                  disabled={isSubmitting || montant <= 0}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-md cursor-pointer"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Valider l'encaissement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {modalDirectOuvert && (
        <ModalEncaissementDirect
          montant={Number(montant)}
          clientNom={patientNom}
          commandeRef={`Facture ${facture.numero_facture}`}
          pointDeVente="Accueil & Facturation Centrale"
          onClose={() => setModalDirectOuvert(false)}
          onSuccess={async (tx) => {
            setModalDirectOuvert(false)
            setIsSubmitting(true)
            const methodeDb = tx.methode === 'tpe_carte' ? 'carte' : tx.methode
            await encaisserFacture(facture.id, methodeDb, Number(montant))
            setIsSubmitting(false)
            setIsOpen(false)
          }}
        />
      )}
    </>
  )
}
