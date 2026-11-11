'use client'

import { useState } from 'react'
import { Trash2, LogOut } from 'lucide-react'
import { supprimerHospitalisation } from './actions'
import CloturerSortieModal from './CloturerSortieModal'

export default function HospitalisationRowActions({
  hospitalisation,
  isExempleFiligrane = false,
}: {
  hospitalisation: any
  isExempleFiligrane?: boolean
}) {
  const [isDeleting, setIsDeleting] = useState(false)

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
        `Voulez-vous vraiment supprimer le dossier de séjour ${hospitalisation.numero_sejour} ?`
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
      <CloturerSortieModal hospitalisation={hospitalisation} />

      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-1.5 rounded-lg text-danger/70 hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer disabled:opacity-50"
        title="Supprimer ce séjour"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
