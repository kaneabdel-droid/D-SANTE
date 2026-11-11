'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { supprimerFacture } from './actions'
import EncaisserModal from './EncaisserModal'
import { DownloadFactureButton } from '@/components/DownloadFactureButton'

export default function FacturationRowActions({
  facture,
  isExempleFiligrane = false,
}: {
  facture: any
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
        `Voulez-vous vraiment supprimer la facture N° ${facture.numero_facture} ?`
      )
    ) {
      return
    }

    setIsDeleting(true)
    const res = await supprimerFacture(facture.id)
    setIsDeleting(false)

    if (res?.error) {
      alert(`Erreur : ${res.error}`)
    }
  }

  const patient = facture.patients
  const factureData = {
    structureNom: 'D-Santé Médical',
    factureNumero: facture.numero_facture || 'FAC-0001',
    dateEmission: facture.date_facture || new Date().toISOString().split('T')[0],
    patientNom: patient?.nom || 'Patient',
    patientPrenom: patient?.prenom || '',
    patientIpp: patient?.ipp || 'N/A',
    lignes: (facture.lignes_factures || []).map((l: any) => ({
      designation: l.designation || 'Prestation de soins',
      type: l.type_acte || 'soins',
      quantite: Number(l.quantite || 1),
      prixUnitaire: Number(l.prix_unitaire || 0),
      total: Number(l.total_ligne || 0),
    })),
    montantTotal: Number(facture.montant_total || 0),
    partAssurance: Number(facture.part_assurance || 0),
    partPatient: Number(facture.part_patient || 0),
    montantPaye: Number(facture.montant_regle_patient || 0),
    resteAPayer: Math.max(0, Number(facture.part_patient || 0) - Number(facture.montant_regle_patient || 0)),
    statutPaiement: facture.statut_paiement_patient || 'impaye',
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      <DownloadFactureButton data={factureData} />

      {facture.statut_paiement_patient !== 'paye' && (
        <EncaisserModal facture={facture} />
      )}

      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-1.5 rounded-lg text-danger/70 hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer disabled:opacity-50"
        title="Supprimer cette facture"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}
