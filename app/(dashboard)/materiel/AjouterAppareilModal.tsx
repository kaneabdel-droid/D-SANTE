'use client'

import { useState } from 'react'
import { Plus, X, Wrench, CheckCircle2 } from 'lucide-react'

export function AjouterAppareilModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [nom, setNom] = useState('')
  const [service, setService] = useState('Bloc Opératoire')
  const [marque, setMarque] = useState('')
  const [valeur, setValeur] = useState('')
  const [revision, setRevision] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSuccess(true)
    setTimeout(() => {
      setIsSuccess(false)
      setIsOpen(false)
      setNom('')
      setMarque('')
      setValeur('')
      setRevision('')
    }, 1200)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-primary-hover transition-colors cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>+ Ajouter un Appareil</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg bg-surface rounded-3xl border border-surface-border shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-foreground-muted hover:text-foreground hover:bg-black/5"
            >
              <X className="w-5 h-5" />
            </button>

            {isSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black font-heading text-foreground">
                  Appareil biomédical référencé !
                </h3>
                <p className="text-xs text-foreground-muted">
                  Le matériel a été ajouté à l&apos;inventaire avec fiche de maintenance active.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-surface-border">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black font-heading text-foreground">
                      Nouvel Équipement Biomédical
                    </h3>
                    <p className="text-xs text-foreground-muted">
                      Enregistrez un dispositif pour le suivi technique et préventif
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-foreground mb-1">
                      Nom / Désignation de l&apos;appareil <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Moniteur multiparamétrique"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-foreground mb-1">
                        Service affecté <span className="text-danger">*</span>
                      </label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background text-foreground focus:border-primary focus:outline-none"
                      >
                        <option value="Bloc Opératoire">Bloc Opératoire</option>
                        <option value="Urgences & Triage">Urgences & Triage</option>
                        <option value="Maternité">Maternité</option>
                        <option value="Hospitalisation">Hospitalisation</option>
                        <option value="Imagerie / Radio">Imagerie / Radio</option>
                        <option value="Laboratoire">Laboratoire</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-foreground mb-1">
                        Marque / Modèle
                      </label>
                      <input
                        type="text"
                        placeholder="ex: Mindray uMEC12"
                        value={marque}
                        onChange={(e) => setMarque(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-foreground mb-1">
                        Valeur d&apos;acquisition (FCFA)
                      </label>
                      <input
                        type="number"
                        placeholder="ex: 1800000"
                        value={valeur}
                        onChange={(e) => setValeur(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-foreground mb-1">
                        Prochaine maintenance
                      </label>
                      <input
                        type="date"
                        value={revision}
                        onChange={(e) => setRevision(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-surface-border bg-background text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-surface-border flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 rounded-xl border border-surface-border text-xs font-bold text-foreground-muted hover:text-foreground"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-sm"
                  >
                    Enregistrer l&apos;appareil
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}

