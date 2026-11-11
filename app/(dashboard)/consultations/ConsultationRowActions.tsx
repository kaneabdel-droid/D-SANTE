'use client'

import { useState } from 'react'
import { Trash2, Edit2, X, Stethoscope, AlertCircle } from 'lucide-react'
import { modifierConsultation, supprimerConsultation } from './actions'
import { DownloadOrdonnanceButton } from '@/components/DownloadOrdonnanceButton'

export default function ConsultationRowActions({
  consultation,
  isExempleFiligrane = false,
}: {
  consultation: any
  isExempleFiligrane?: boolean
}) {
  const [isOpenEdit, setIsOpenEdit] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
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
        `Voulez-vous vraiment supprimer la consultation ${consultation.numero_consultation} ?`
      )
    ) {
      return
    }

    setIsDeleting(true)
    const res = await supprimerConsultation(consultation.id)
    setIsDeleting(false)

    if (res?.error) {
      alert(`Erreur : ${res.error}`)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const res = await modifierConsultation(consultation.id, formData)

    setIsSubmitting(false)
    if (res?.error) {
      setError(res.error)
    } else {
      setIsOpenEdit(false)
    }
  }

  const premiereOrdonnance = consultation.prescriptions?.[0]
  const pat = consultation.patients
  const ordonnanceData = premiereOrdonnance
    ? {
        structureNom: 'D-Santé Médical',
        medecinNom: 'Médecin Traitant',
        patientNom: pat?.nom || 'Patient',
        patientPrenom: pat?.prenom || '',
        patientIpp: pat?.ipp || 'N/A',
        datePrescription:
          premiereOrdonnance.date_prescription ||
          consultation.date_consultation ||
          new Date().toISOString().split('T')[0],
        lignes: (premiereOrdonnance.lignes_prescriptions || []).map((lig: any) => ({
          medicamentNom: lig.designation || 'Médicament',
          posologie: lig.posologie || '',
          dureeJours: lig.duree_jours || 7,
          instructions: lig.instructions,
        })),
        notes: consultation.conduite_a_tenir,
      }
    : null

  const inputStyle =
    'block w-full rounded-xl border border-surface-border bg-background py-2 px-3 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

  return (
    <div className="flex items-center justify-end gap-1.5">
      {ordonnanceData && (
        <DownloadOrdonnanceButton data={ordonnanceData} />
      )}

      <button
        type="button"
        onClick={() => {
          setIsOpenEdit(true)
          setError(null)
        }}
        className="px-2.5 py-1.5 rounded-lg bg-surface-border/50 hover:bg-surface-border text-foreground text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
        title="Modifier cette consultation"
      >
        <Edit2 className="w-3.5 h-3.5" />
        <span>Modifier</span>
      </button>

      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-1.5 rounded-lg text-danger/70 hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer disabled:opacity-50"
        title="Supprimer cette consultation"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {isOpenEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-hidden text-left">
          <div className="bg-surface border border-surface-border w-full max-w-lg max-h-[92vh] sm:max-h-[88vh] rounded-2xl shadow-2xl relative flex flex-col my-auto overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-surface-border/60 shrink-0 flex items-center justify-between bg-surface">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-heading text-foreground">
                    Modifier Consultation
                  </h3>
                  <p className="text-xs text-foreground-muted">
                    {consultation.numero_consultation} • {consultation.patients?.nom}{' '}
                    {consultation.patients?.prenom}
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
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Type de consultation
                  </label>
                  <select
                    name="type_consultation"
                    defaultValue={consultation.type_consultation || 'generale'}
                    className={inputStyle}
                  >
                    <option value="generale">Médecine Générale</option>
                    <option value="urgence">Urgence</option>
                    <option value="prenatale">CPN / Prénatale</option>
                    <option value="pediatrique">Pédiatrie</option>
                    <option value="specialiste">Spécialiste</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Motif de consultation *
                  </label>
                  <textarea
                    name="motif"
                    defaultValue={consultation.motif}
                    rows={2}
                    required
                    className={inputStyle}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Diagnostic Principal
                    </label>
                    <input
                      name="diagnostic_principal"
                      type="text"
                      defaultValue={consultation.diagnostic_principal || ''}
                      className={inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Code CIM-10
                    </label>
                    <input
                      name="code_cim10"
                      type="text"
                      defaultValue={consultation.code_cim10 || ''}
                      className={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Conduite à Tenir / Conseils
                  </label>
                  <textarea
                    name="conduite_a_tenir"
                    defaultValue={consultation.conduite_a_tenir || ''}
                    rows={2}
                    className={inputStyle}
                  />
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
