'use client'

import { useState } from 'react'
import { Trash2, Ban } from 'lucide-react'
import { supprimerHospitalisation, annulerHospitalisation } from './actions'
import CloturerSortieModal from './CloturerSortieModal'

export default function HospitalisationRowActions({
  hospitalisation,
  isExempleFiligrane = false,
  role = 'medecin',
}: {
  hospitalisation: any
  isExempleFiligrane?: boolean
  role?: string
}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  const normalizedRole = (role || 'medecin').toLowerCase()
  const peutAnnuler = ['administrateur', 'direction', 'medecin', 'infirmier_major'].includes(normalizedRole)
  const peutSupprimer = ['administrateur', 'direction', 'medecin_chef'].includes(normalizedRole)

  if (isExempleFiligrane) {
    return (
      <div className="flex items-center justify-end gap-1.5 text-[11px] text-foreground-muted italic">
        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium border border-amber-500/20">
          Exemple indicatif
        </span>
      </div>
    )
  }

  const estTermine = hospitalisation.statut === 'cloturee' || hospitalisation.statut === 'annulee'

  const handleAnnuler = async () => {
    const motif = window.prompt(
      `Confirmer l'annulation du séjour ${hospitalisation.numero_sejour} ? Précisez le motif :`,
      'Annulation admission / Erreur administrative'
    )
    if (motif === null) return

    setIsCancelling(true)
    const res = await annulerHospitalisation(hospitalisation.id, motif)
    setIsCancelling(false)

    if (res?.error) {
      alert(`Erreur : ${res.error}`)
    }
  }

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Voulez-vous vraiment supprimer définitivement le dossier de séjour ${hospitalisation.numero_sejour} ?`
      )
    ) {
      return
    }

    setIsDeleting(true)
    const res = await supprimerHospitalisation(hospitalisation.id, hospitalisation.lit_id)
    setIsDeleting(false)

    if (res?.error) {
      alert(`Erreur : ${res.error}`)
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {hospitalisation.statut === 'annulee' && (
        <span className="px-2 py-0.5 rounded-full bg-danger/10 text-danger border border-danger/20 text-[10px] font-bold">
          Annulé
        </span>
      )}

      {!estTermine && (
        <CloturerSortieModal hospitalisation={hospitalisation} />
      )}

      {!estTermine && peutAnnuler && (
        <button
          type="button"
          onClick={handleAnnuler}
          disabled={isCancelling}
          className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
          title="Annuler ce séjour"
        >
          <Ban className="w-3.5 h-3.5" />
          <span>Annuler</span>
        </button>
      )}

      {peutSupprimer && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-1.5 rounded-lg text-danger/70 hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer disabled:opacity-50"
          title="Supprimer ce séjour"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
