'use client'

import { useState } from 'react'
import { Plus, X, AlertCircle, Loader2, BookOpen } from 'lucide-react'
import { creerEcritureComptable } from './actions'

const JOURNAUX = [
  { id: 'ventes', label: 'Ventes & Recettes' },
  { id: 'achats', label: 'Achats & Fournisseurs' },
  { id: 'caisse', label: 'Caisse' },
  { id: 'banque', label: 'Banque' },
  { id: 'od', label: 'Opérations Diverses (OD)' },
]

export default function NouvelleEcritureModal({
  defaultJournal = 'ventes',
}: {
  defaultJournal?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [journal, setJournal] = useState(defaultJournal === 'tous' ? 'ventes' : defaultJournal)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    formData.set('journal', journal)

    const res = await creerEcritureComptable(formData)
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
          setJournal(defaultJournal === 'tous' ? 'ventes' : defaultJournal)
          setIsOpen(true)
          setError(null)
        }}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-primary-hover transition-colors cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>+ Nouvelle Écriture</span>
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
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-foreground">
                  Saisie d'une Écriture Comptable
                </h3>
                <p className="text-xs text-foreground-muted">
                  Enregistrement en partie double conforme au plan SYSCOHADA Santé.
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
              {/* Choix du journal & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Journal comptable <span className="text-danger">*</span>
                  </label>
                  <select
                    value={journal}
                    onChange={(e) => setJournal(e.target.value)}
                    className={champ}
                  >
                    {JOURNAUX.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Date de la pièce <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    name="date_ecriture"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    required
                    className={champ}
                  />
                </div>
              </div>

              {/* Réf pièce & Libellé */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    N° Pièce / Réf
                  </label>
                  <input
                    type="text"
                    name="numero_piece"
                    placeholder="Ex: FAC-001, VR-892"
                    className={champ}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Libellé de l'opération <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="libelle"
                    required
                    placeholder="Ex: Encaissement consultation / Achat réactifs"
                    className={champ}
                  />
                </div>
              </div>

              {/* Comptes Débit & Crédit */}
              <div className="p-3.5 bg-background rounded-2xl border border-surface-border space-y-3">
                <span className="text-[11px] font-bold text-foreground-muted uppercase tracking-wider block">
                  Affectation Partie Double
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1">
                      Compte Débité <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="compte_debit"
                      required
                      placeholder="Ex: 571 (Caisse) ou 601 (Achats)"
                      className={champ}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-secondary mb-1">
                      Compte Crédité <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="compte_credit"
                      required
                      placeholder="Ex: 706 (Prestations) ou 401 (Fournisseur)"
                      className={champ}
                    />
                  </div>
                </div>

                {/* Montant */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Montant de la transaction (FCFA) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    name="montant"
                    required
                    min={1}
                    placeholder="Ex: 25000"
                    className={champ}
                  />
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
                  <span>Valider l'écriture</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
