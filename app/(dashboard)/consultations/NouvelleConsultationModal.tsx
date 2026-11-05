'use client'

import { useState } from 'react'
import { Stethoscope, Plus, X, AlertCircle, Pill, Trash2, ShieldCheck, FileText } from 'lucide-react'
import { creerConsultation } from './actions'

type PrescriptionLigne = {
  id: string
  type: 'medicament' | 'examen_biologique' | 'imagerie' | 'soin_infirmier'
  designation: string
  dosage: string
  posologie: string
  duree_jours: string
}

export default function NouvelleConsultationModal({
  patients,
  services,
  preselectedPatientId,
}: {
  patients: any[]
  services: any[]
  preselectedPatientId?: string
}) {
  const [isOpen, setIsOpen] = useState(Boolean(preselectedPatientId))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Gestion des lignes de prescription (ordonnance)
  const [lignesOrdonnance, setLignesOrdonnance] = useState<PrescriptionLigne[]>([])

  const ajouterLigneMedicament = () => {
    setLignesOrdonnance((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        type: 'medicament',
        designation: '',
        dosage: '',
        posologie: '1 comp matin et soir',
        duree_jours: '5',
      },
    ])
  }

  const supprimerLigne = (id: string) => {
    setLignesOrdonnance((prev) => prev.filter((l) => l.id !== id))
  }

  const updateLigne = (id: string, field: keyof PrescriptionLigne, val: string) => {
    setLignesOrdonnance((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: val } : l))
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const res = await creerConsultation(formData, JSON.stringify(lignesOrdonnance))

    setIsSubmitting(false)
    if (res?.error) {
      setError(res.error)
    } else {
      setIsOpen(false)
      setLignesOrdonnance([])
    }
  }

  const inputStyle =
    'block w-full rounded-xl border border-surface-border bg-background py-2.5 px-3 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true)
          setError(null)
        }}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-primary-hover transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Nouvelle Consultation</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs overflow-hidden">
          <div className="bg-surface border border-surface-border w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] rounded-2xl sm:rounded-3xl shadow-2xl relative flex flex-col my-auto overflow-hidden">
            {/* En-tête fixe */}
            <div className="p-4 sm:p-6 pb-3 border-b border-surface-border/60 shrink-0 flex items-center justify-between bg-surface">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-bold font-heading text-foreground">
                    Saisie d&apos;Observation & Consultation Médicale
                  </h3>
                  <p className="text-xs text-foreground-muted">
                    Examen clinique, diagnostic CIM-10 et génération de l&apos;ordonnance médicale.
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

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              {/* Corps de formulaire déroulant */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
                {/* Patient & Service */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Patient (IPP) *
                    </label>
                    <select
                      name="patient_id"
                      defaultValue={preselectedPatientId || ''}
                      required
                      className={inputStyle}
                    >
                      <option value="">Sélectionner le patient...</option>
                      {patients.map((pat) => (
                        <option key={pat.id} value={pat.id}>
                          {pat.nom} {pat.prenom} ({pat.ipp})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Type de Consultation
                    </label>
                    <select name="type_consultation" defaultValue="generale" className={inputStyle}>
                      <option value="generale">Médecine Générale</option>
                      <option value="urgence">Urgence Médicale</option>
                      <option value="prenatale">Prénatale (CPN)</option>
                      <option value="pediatrique">Pédiatrie</option>
                      <option value="specialiste">Consultation Spécialiste</option>
                    </select>
                  </div>
                </div>

                {/* Motif & Anamnèse */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Motif de consultation *
                    </label>
                    <input
                      type="text"
                      name="motif"
                      required
                      placeholder="ex: Syndrome fébrile avec frissons et céphalées"
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Anamnèse & Histoire de la maladie
                    </label>
                    <input
                      type="text"
                      name="anamnese"
                      placeholder="ex: Début brutal il y a 3 jours, automédication par paracétamol..."
                      className={inputStyle}
                    />
                  </div>
                </div>

                {/* Examen clinique */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Examen Physique & Constats Cliniques
                  </label>
                  <textarea
                    name="examen_clinique"
                    rows={2}
                    placeholder="Auscultation cardiopulmonaire, palpation abdominale, état général, signes méningés..."
                    className={inputStyle}
                  />
                </div>

                {/* Diagnostics */}
                <div className="p-4 bg-surface-border/20 rounded-2xl border border-surface-border/50 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Diagnostic Principal Retenu *
                    </label>
                    <input
                      type="text"
                      name="diagnostic_principal"
                      required
                      placeholder="ex: Accès palustre simple à Plasmodium falciparum"
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Code CIM-10 / CISP-2
                    </label>
                    <input
                      type="text"
                      name="code_cim10"
                      placeholder="ex: B54 / A73"
                      className={inputStyle}
                    />
                  </div>
                </div>

                {/* Conduite à tenir */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Conduite à tenir & Conseils hygiéno-diététiques
                  </label>
                  <input
                    type="text"
                    name="conduite_a_tenir"
                    placeholder="ex: Repos strict, bonne hydratation, contrôle dans 72h si persistance de la fièvre"
                    className={inputStyle}
                  />
                </div>

                {/* Volet Prescription Médicale / Ordonnance */}
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Pill className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold text-foreground">
                        Prescription Médicale / Ordonnance Rattachée
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={ajouterLigneMedicament}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-primary text-white text-[11px] font-bold hover:bg-primary-hover transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter Médicament</span>
                    </button>
                  </div>

                  {lignesOrdonnance.length === 0 ? (
                    <p className="text-[11px] text-foreground-muted italic py-1">
                      Aucun médicament ajouté à l&apos;ordonnance pour cette consultation.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {lignesOrdonnance.map((ligne, idx) => (
                        <div
                          key={ligne.id}
                          className="grid grid-cols-12 gap-2 bg-surface p-2.5 rounded-xl border border-surface-border items-center"
                        >
                          <div className="col-span-5 sm:col-span-4">
                            <input
                              type="text"
                              placeholder="DCI / Spécialité (ex: Artéméther/Luméfantrine)"
                              value={ligne.designation}
                              onChange={(e) => updateLigne(ligne.id, 'designation', e.target.value)}
                              className="w-full text-xs p-2 rounded-lg border border-surface-border bg-background"
                            />
                          </div>
                          <div className="col-span-3 sm:col-span-2">
                            <input
                              type="text"
                              placeholder="Dosage (ex: 20/120mg)"
                              value={ligne.dosage}
                              onChange={(e) => updateLigne(ligne.id, 'dosage', e.target.value)}
                              className="w-full text-xs p-2 rounded-lg border border-surface-border bg-background"
                            />
                          </div>
                          <div className="col-span-4 sm:col-span-4">
                            <input
                              type="text"
                              placeholder="Posologie (ex: 1 cp matin et soir aux repas)"
                              value={ligne.posologie}
                              onChange={(e) => updateLigne(ligne.id, 'posologie', e.target.value)}
                              className="w-full text-xs p-2 rounded-lg border border-surface-border bg-background"
                            />
                          </div>
                          <div className="col-span-12 sm:col-span-2 flex items-center justify-between sm:justify-end gap-2">
                            <input
                              type="number"
                              placeholder="Jours"
                              title="Durée en jours"
                              value={ligne.duree_jours}
                              onChange={(e) => updateLigne(ligne.id, 'duree_jours', e.target.value)}
                              className="w-16 text-xs p-2 rounded-lg border border-surface-border bg-background font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => supprimerLigne(ligne.id)}
                              className="p-1.5 rounded-lg text-danger hover:bg-danger/10 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Boutons validation fixes en bas */}
              <div className="p-4 sm:p-6 pt-3 border-t border-surface-border/60 shrink-0 flex items-center justify-end gap-3 bg-surface">
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
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Validation...' : 'Clôturer la Consultation & Ordonnance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
