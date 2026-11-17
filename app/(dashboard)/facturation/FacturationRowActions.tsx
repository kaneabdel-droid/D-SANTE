'use client'

import { useState } from 'react'
import { Trash2, Ban } from 'lucide-react'
import { supprimerFacture, annulerFacture } from './actions'
import EncaisserModal from './EncaisserModal'
import ModifierFactureModal from './ModifierFactureModal'
import { DownloadFactureButton } from '@/components/DownloadFactureButton'

export default function FacturationRowActions({
  facture,
  organismes = [],
  isExempleFiligrane = false,
  role = 'caissier',
}: {
  facture: any
  organismes?: any[]
  isExempleFiligrane?: boolean
  role?: string
}) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)

  const normalizedRole = (role || 'caissier').toLowerCase()
  const peutModifier = ['administrateur', 'direction', 'caissier', 'caissier_principal', 'medecin'].includes(normalizedRole)
  const peutAnnuler = ['administrateur', 'direction', 'caissier_principal', 'caissier'].includes(normalizedRole)
  const peutSupprimer = ['administrateur', 'direction'].includes(normalizedRole)

  if (isExempleFiligrane) {
    return (
      <div className="flex items-center justify-end gap-1.5 text-[11px] text-foreground-muted italic">
        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium border border-amber-500/20">
          Exemple indicatif
        </span>
      </div>
    )
  }

  const estAnnulee = facture.statut_paiement_patient === 'annulee'

  const handleAnnuler = async () => {
    const motif = window.prompt(
      `Confirmer l'annulation de la facture N° ${facture.numero_facture} ? Précisez le motif :`,
      'Erreur de facturation ou avoir client'
    )
    if (motif === null) return

    setIsCancelling(true)
    const res = await annulerFacture(facture.id, motif)
    setIsCancelling(false)

    if (res?.error) {
      alert(`Erreur : ${res.error}`)
    }
  }

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Voulez-vous vraiment supprimer définitivement la facture N° ${facture.numero_facture} ? Cette action est irréversible.`
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
      {estAnnulee && (
        <span className="px-2 py-0.5 rounded-full bg-danger/10 text-danger border border-danger/20 text-[10px] font-bold">
          Annulée
        </span>
      )}

      <DownloadFactureButton data={factureData} />

      {!estAnnulee && facture.statut_paiement_patient !== 'paye' && (
        <EncaisserModal facture={facture} />
      )}

      {!estAnnulee && peutModifier && (
        <ModifierFactureModal facture={facture} organismes={organismes} />
      )}

      {!estAnnulee && peutAnnuler && (
        <button
          type="button"
          onClick={handleAnnuler}
          disabled={isCancelling}
          className="px-2 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
          title="Annuler cette facture"
        >
          <Ban className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Annuler</span>
        </button>
      )}

      {peutSupprimer && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-1.5 rounded-lg text-danger/70 hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer disabled:opacity-50"
          title="Supprimer cette facture"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
