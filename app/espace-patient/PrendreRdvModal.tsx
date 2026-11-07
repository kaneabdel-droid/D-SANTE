'use client'

import { useState } from 'react'
import {
  Calendar,
  Clock,
  CheckCircle2,
  X,
  Stethoscope,
  Phone,
  User,
  ShieldCheck,
  FileText,
  Printer,
  Sparkles,
} from 'lucide-react'

export function PrendreRdvModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  // Form state
  const [nom, setNom] = useState('')
  const [telephone, setTelephone] = useState('')
  const [specialite, setSpecialite] = useState('Médecine Générale')
  const [couverture, setCouverture] = useState<'direct' | 'ipm'>('direct')
  const [nomIpm, setNomIpm] = useState('')
  const [dateSouhaitee, setDateSouhaitee] = useState('')
  const [creneau, setCreneau] = useState('09:00 - 12:00 (Matinée)')
  const [motif, setMotif] = useState('')
  const [ticketRef, setTicketRef] = useState('')

  const handleOpen = () => {
    setIsSuccess(false)
    setTicketRef('')
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsSuccess(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      const randomRef = 'RDV-' + new Date().getFullYear().toString().slice(-2) + Math.floor(1000 + Math.random() * 9000)
      setTicketRef(randomRef)
      setLoading(false)
      setIsSuccess(true)
    }, 600)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all shrink-0 flex items-center gap-2 cursor-pointer"
      >
        <Calendar className="w-4 h-4" />
        <span>Prendre Rendez-vous</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg bg-surface rounded-3xl border border-surface-border shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 p-2 rounded-xl text-foreground-muted hover:text-foreground hover:bg-black/5"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase">
                    <Sparkles className="w-3 h-3" />
                    <span>Prise de Rendez-vous en Ligne</span>
                  </div>
                  <h3 className="text-xl font-black font-heading text-foreground">
                    Planifier votre consultation
                  </h3>
                  <p className="text-xs text-foreground-muted">
                    Remplissez ce formulaire pour réserver votre créneau avec un médecin spécialiste.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Nom et Prénom du Patient <span className="text-danger">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
                      <input
                        type="text"
                        required
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        placeholder="ex: Aminata Diallo"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-surface-border bg-background text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Numéro Téléphone / WhatsApp <span className="text-danger">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
                      <input
                        type="tel"
                        required
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        placeholder="ex: +221 77 123 45 67"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-surface-border bg-background text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        Spécialité / Service <span className="text-danger">*</span>
                      </label>
                      <select
                        value={specialite}
                        onChange={(e) => setSpecialite(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-surface-border bg-background text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
                      >
                        <option value="Médecine Générale">Médecine Générale</option>
                        <option value="Pédiatrie">Pédiatrie</option>
                        <option value="Gynécologie & Maternité">Gynécologie & Maternité</option>
                        <option value="Cardiologie">Cardiologie</option>
                        <option value="Ophtalmologie">Ophtalmologie</option>
                        <option value="Soins Infirmiers & Pansements">Soins Infirmiers & Pansements</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        Prise en charge
                      </label>
                      <select
                        value={couverture}
                        onChange={(e) => setCouverture(e.target.value as any)}
                        className="w-full px-3 py-2.5 rounded-xl border border-surface-border bg-background text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
                      >
                        <option value="direct">Règlement Direct (Espèces / Wave)</option>
                        <option value="ipm">Assurance / IPM (Tiers-Payant)</option>
                      </select>
                    </div>
                  </div>

                  {couverture === 'ipm' && (
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        Nom de votre IPM ou Compagnie d&apos;Assurance
                      </label>
                      <input
                        type="text"
                        value={nomIpm}
                        onChange={(e) => setNomIpm(e.target.value)}
                        placeholder="ex: IPM Sonatel, ASKIA, AXA, Saham..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-background text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        Date souhaitée <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={dateSouhaitee}
                        onChange={(e) => setDateSouhaitee(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2.5 rounded-xl border border-surface-border bg-background text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        Créneau horaire
                      </label>
                      <select
                        value={creneau}
                        onChange={(e) => setCreneau(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-surface-border bg-background text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
                      >
                        <option value="08:30 - 12:00 (Matinée)">08:30 - 12:00 (Matinée)</option>
                        <option value="14:30 - 17:30 (Après-midi)">14:30 - 17:30 (Après-midi)</option>
                        <option value="18:00 - 20:30 (Soirée)">18:00 - 20:30 (Soirée)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Motif de consultation (optionnel)
                    </label>
                    <textarea
                      rows={2}
                      value={motif}
                      onChange={(e) => setMotif(e.target.value)}
                      placeholder="ex: Fièvre persistante depuis 48h, bilan de santé..."
                      className="w-full px-3.5 py-2 rounded-xl border border-surface-border bg-background text-xs text-foreground focus:border-primary focus:outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-2 border-t border-surface-border">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2.5 rounded-xl border border-surface-border text-xs font-bold text-foreground-muted hover:text-foreground"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Confirmation en cours...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirmer mon Rendez-vous</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-5 text-center py-2">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-black font-heading text-foreground">
                    Rendez-vous Confirmé avec Succès !
                  </h3>
                  <p className="text-xs text-foreground-muted max-w-sm mx-auto">
                    Votre créneau a été enregistré dans le planning de la clinique. Une notification de rappel vous sera transmise par SMS/WhatsApp.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface border border-surface-border text-left space-y-2 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-surface-border">
                    <span className="text-foreground-muted">Numéro Ticket RDV :</span>
                    <span className="font-mono font-bold text-emerald-600 text-sm">{ticketRef}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Patient :</span>
                    <span className="font-bold text-foreground">{nom}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Spécialité :</span>
                    <span className="font-bold text-foreground">{specialite}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Date & Heure :</span>
                    <span className="font-bold text-foreground">
                      {dateSouhaitee || 'Aujourd’hui'} • {creneau}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Prise en charge :</span>
                    <span className="font-bold text-foreground">
                      {couverture === 'ipm' ? `Tiers-payant (${nomIpm || 'IPM'})` : 'Paiement direct Caisse'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-4 py-2.5 rounded-xl border border-surface-border text-xs font-bold text-foreground hover:bg-black/5 flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4 text-primary" />
                    <span>Imprimer le Billet</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-sm"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
