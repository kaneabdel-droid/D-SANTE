'use client'

import { useState } from 'react'
import { Plus, X, BedDouble, AlertCircle } from 'lucide-react'
import { ajouterLit } from './actions'

export default function NouveauLitModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const res = await ajouterLit(formData)

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
        className="inline-flex items-center gap-1.5 rounded-xl border border-surface-border bg-surface px-3 py-2 text-xs font-bold text-foreground shadow-xs hover:bg-black/5 transition-colors cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>Ajouter un Lit</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-hidden text-left">
          <div className="bg-surface border border-surface-border w-full max-w-md max-h-[92vh] sm:max-h-[88vh] rounded-2xl shadow-2xl relative flex flex-col my-auto overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-surface-border/60 shrink-0 flex items-center justify-between bg-surface">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <BedDouble className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-heading text-foreground">
                    Ajouter un Lit / Chambre
                  </h3>
                  <p className="text-xs text-foreground-muted">Capacité d&apos;accueil hospitalière</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
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

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Numéro / Identifiant du Lit *
                  </label>
                  <input
                    name="numero_lit"
                    type="text"
                    required
                    placeholder="ex: L101, VIP-01"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Chambre / Salle
                  </label>
                  <input
                    name="chambre"
                    type="text"
                    defaultValue="Chambre 1"
                    placeholder="ex: Chambre 1, Salle Médecine"
                    className={inputStyle}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Catégorie
                  </label>
                  <select name="categorie" defaultValue="standard" className={inputStyle}>
                    <option value="standard">Standard</option>
                    <option value="vip">Suite / Chambre VIP</option>
                    <option value="soins_intensifs">Soins Intensifs / USI</option>
                    <option value="maternite">Maternité</option>
                    <option value="pediatrie">Pédiatrie</option>
                  </select>
                </div>
              </div>

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
                  {isSubmitting ? 'Enregistrement...' : 'Ajouter le lit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

