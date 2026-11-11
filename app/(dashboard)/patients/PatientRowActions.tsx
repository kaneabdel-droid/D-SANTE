'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import ModifierPatientModal from './ModifierPatientModal'
import { supprimerPatient } from './actions'

export default function PatientRowActions({
  patient,
  organismes = [],
  isExempleFiligrane = false,
}: {
  patient: any
  organismes: any[]
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
        `Voulez-vous vraiment supprimer définitivement le patient ${patient.nom} ${patient.prenom} (IPP: ${patient.ipp}) ?`
      )
    ) {
      return
    }

    setIsDeleting(true)
    const res = await supprimerPatient(patient.id)
    setIsDeleting(false)

    if (res?.error) {
      alert(`Erreur : ${res.error}`)
    }
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Link
        href={`/triage?patient_id=${patient.id}&ipp=${patient.ipp}`}
        className="px-2 py-1.5 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 text-xs font-bold transition-colors"
        title="Prendre les constantes"
      >
        Constantes
      </Link>
      <Link
        href={`/consultations?patient_id=${patient.id}`}
        className="px-2 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition-colors"
        title="Ouvrir consultation"
      >
        Consulter
      </Link>
      <ModifierPatientModal patient={patient} organismes={organismes} />
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-1.5 rounded-lg text-danger/70 hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer disabled:opacity-50"
        title="Supprimer ce patient"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

