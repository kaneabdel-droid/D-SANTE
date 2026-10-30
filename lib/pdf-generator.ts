const formatMontant = (amount: number | undefined | null) => {
  if (!amount) return '0 FCFA'
  return `${Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} FCFA`
}

export interface OrdonnanceData {
  structureNom: string
  structureType?: string
  structureAdresse?: string
  structureTelephone?: string
  medecinNom: string
  medecinSpecialite?: string
  patientNom: string
  patientPrenom: string
  patientIpp: string
  patientAge?: number
  patientPoids?: number
  allergies?: string[]
  datePrescription: string
  lignes: Array<{
    medicamentNom: string
    dosage?: string
    forme?: string
    posologie: string
    dureeJours: number
    instructions?: string
  }>
  notes?: string
}

export interface FactureSanteData {
  structureNom: string
  structureAdresse?: string
  structureTelephone?: string
  factureNumero: string
  dateEmission: string
  patientNom: string
  patientPrenom: string
  patientIpp: string
  patientTelephone?: string
  organismeAssurance?: string
  tauxCouverture?: number
  lignes: Array<{
    designation: string
    type: string
    quantite: number
    prixUnitaire: number
    total: number
  }>
  montantTotal: number
  partAssurance: number
  partPatient: number
  montantPaye: number
  resteAPayer: number
  statutPaiement: string
  modePaiement?: string
  caissierNom?: string
}

/**
 * Génère et télécharge une ordonnance médicale officielle au format PDF
 */
export async function downloadOrdonnancePdf(data: OrdonnanceData) {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ])

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5', // Format standard d'ordonnance médicale A5 (148 x 210 mm)
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // Fond d'en-tête médical discret
  doc.setFillColor(243, 248, 246)
  doc.rect(0, 0, pageWidth, 34, 'F')

  // Ligne de bordure médicale verte émeraude
  doc.setDrawColor(13, 148, 136) // emerald-600
  doc.setLineWidth(1)
  doc.line(0, 34, pageWidth, 34)

  // En-tête de la structure
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(15, 23, 42) // slate-900
  doc.text(data.structureNom.toUpperCase(), 12, 12)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(71, 85, 105) // slate-600
  const adresseStr = [data.structureAdresse, data.structureTelephone].filter(Boolean).join(' • ')
  doc.text(adresseStr || 'Centre Hospitalier & Médical', 12, 17)

  // Praticien prescripteur (à droite)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(13, 148, 136)
  doc.text(`Dr. ${data.medecinNom}`, pageWidth - 12, 12, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(100, 116, 139)
  doc.text(data.medecinSpecialite || 'Médecine Générale', pageWidth - 12, 17, { align: 'right' })

  // Titre du document
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(15, 23, 42)
  doc.text('ORDONNANCE MÉDICALE', pageWidth / 2, 45, { align: 'center' })

  // Encadré Patient & Constantes
  doc.setFillColor(248, 250, 252) // slate-50
  doc.setDrawColor(226, 232, 240) // slate-200
  doc.setLineWidth(0.5)
  doc.roundedRect(12, 50, pageWidth - 24, 22, 2, 2, 'FD')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(30, 41, 59)
  doc.text(`Patient : ${data.patientPrenom} ${data.patientNom.toUpperCase()}`, 16, 56)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(100, 116, 139)
  const detailPatient = [
    `IPP : ${data.patientIpp}`,
    data.patientAge !== undefined ? `Âge : ${data.patientAge} ans` : null,
    data.patientPoids !== undefined ? `Poids : ${data.patientPoids} kg` : null,
  ].filter(Boolean).join('  |  ')
  doc.text(detailPatient, 16, 62)

  // Date
  doc.setFont('helvetica', 'italic')
  doc.text(`Date : ${data.datePrescription}`, pageWidth - 16, 56, { align: 'right' })

  // Alerte Allergies (si existantes)
  let tableStartY = 76
  if (data.allergies && data.allergies.length > 0) {
    doc.setFillColor(254, 242, 242) // red-50
    doc.setDrawColor(252, 165, 165) // red-300
    doc.roundedRect(12, 74, pageWidth - 24, 7, 1.5, 1.5, 'FD')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(220, 38, 38) // red-600
    doc.text(`ATTENTION ALLERGIES : ${data.allergies.join(', ')}`, 16, 78.5)
    tableStartY = 85
  }

  // Tableau des prescriptions
  const tableRows = data.lignes.map((l, index) => [
    `${index + 1}.`,
    `${l.medicamentNom}${l.dosage ? ' ' + l.dosage : ''}${l.forme ? ' (' + l.forme + ')' : ''}\n${l.instructions ? '→ ' + l.instructions : ''}`,
    l.posologie,
    `${l.dureeJours} jours`,
  ])

  autoTable(doc, {
    startY: tableStartY,
    margin: { left: 12, right: 12 },
    head: [['#', 'Médicament & Forme', 'Posologie', 'Durée']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [13, 148, 136],
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: 'bold',
      halign: 'left',
      cellPadding: 2,
    },
    bodyStyles: {
      fontSize: 7.5,
      cellPadding: 2.5,
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 'auto', fontStyle: 'bold' },
      2: { cellWidth: 42 },
      3: { cellWidth: 18, halign: 'center' },
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
  })

  // Notes additionnelles du praticien
  const finalY = (doc as any).lastAutoTable?.finalY || 130
  if (data.notes) {
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(7)
    doc.setTextColor(100, 116, 139)
    doc.text(`Note du médecin : ${data.notes}`, 12, finalY + 7)
  }

  // Bloc de signature & cachet (en bas à droite)
  const signY = Math.max(finalY + 18, pageHeight - 38)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(15, 23, 42)
  doc.text('Cachet et Signature du Praticien :', pageWidth - 16, signY, { align: 'right' })

  doc.setDrawColor(203, 213, 225)
  doc.setLineDashPattern([1.5, 1.5], 0)
  doc.line(pageWidth - 65, signY + 18, pageWidth - 16, signY + 18)
  doc.setLineDashPattern([], 0)

  // Pied de page légal et numéro d'authenticité
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.5)
  doc.setTextColor(148, 163, 184)
  doc.text(
    `Document médical authentifié - D-Santé - Ne pas délivrer au-delà de la durée légale`,
    pageWidth / 2,
    pageHeight - 6,
    { align: 'center' }
  )

  // Sauvegarde / Téléchargement
  const filename = `Ordonnance_${data.patientNom}_${data.datePrescription.replace(/[/:\\]/g, '-')}.pdf`
  doc.save(filename)
}

/**
 * Génère et télécharge une facture médicale / feuille de soins avec Tiers-Payant
 */
export async function downloadFactureSantePdf(data: FactureSanteData) {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ])

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4', // Format standard A4 (210 x 297 mm)
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // En-tête établissement
  doc.setFillColor(15, 23, 42) // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(255, 255, 255)
  doc.text(data.structureNom.toUpperCase(), 14, 14)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(203, 213, 225)
  const contact = [data.structureAdresse, data.structureTelephone].filter(Boolean).join(' • ')
  doc.text(contact || 'Établissement Hospitalier et Médical', 14, 20)

  // Numéro Facture et Date (droite en-tête)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(13, 148, 136) // emerald
  doc.text(`FACTURE N° ${data.factureNumero}`, pageWidth - 14, 14, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(255, 255, 255)
  doc.text(`Date : ${data.dateEmission}`, pageWidth - 14, 20, { align: 'right' })

  // Encadré Destinataire / Patient & Tiers-Payant
  let curY = 36
  doc.setFillColor(248, 250, 252)
  doc.setDrawColor(226, 232, 240)
  doc.roundedRect(14, curY, (pageWidth - 32) / 2, 28, 2, 2, 'FD')
  doc.roundedRect(14 + (pageWidth - 32) / 2 + 4, curY, (pageWidth - 32) / 2, 28, 2, 2, 'FD')

  // Patient
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(100, 116, 139)
  doc.text('PATIENT / BÉNÉFICIAIRE', 18, curY + 6)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(15, 23, 42)
  doc.text(`${data.patientPrenom} ${data.patientNom.toUpperCase()}`, 18, curY + 13)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(71, 85, 105)
  doc.text(`IPP : ${data.patientIpp}`, 18, curY + 19)
  if (data.patientTelephone) doc.text(`Tél : ${data.patientTelephone}`, 18, curY + 24)

  // Tiers-Payant / Assurance
  const col2X = 18 + (pageWidth - 32) / 2 + 4
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(100, 116, 139)
  doc.text('COUVERTURE SANTÉ / TIERS-PAYANT', col2X, curY + 6)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.setTextColor(13, 148, 136)
  doc.text(data.organismeAssurance || 'Aucune (Paiement Direct 100%)', col2X, curY + 13)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(71, 85, 105)
  if (data.tauxCouverture) {
    doc.text(`Taux de prise en charge : ${data.tauxCouverture}%`, col2X, curY + 19)
    doc.text(`Ticket modérateur patient : ${100 - data.tauxCouverture}%`, col2X, curY + 24)
  } else {
    doc.text('Régime ordinaire sans convention IPM/CMU', col2X, curY + 19)
  }

  // Tableau des Prestations / Actes / Médicaments
  const tableRows = data.lignes.map((l) => [
    l.designation,
    l.type.toUpperCase(),
    l.quantite.toString(),
    formatMontant(l.prixUnitaire),
    formatMontant(l.total),
  ])

  autoTable(doc, {
    startY: curY + 34,
    margin: { left: 14, right: 14 },
    head: [['Désignation de la prestation / Acte', 'Catégorie', 'Qté', 'Prix Unit. (FCFA)', 'Total (FCFA)']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: 'bold',
      cellPadding: 3,
    },
    bodyStyles: {
      fontSize: 8.5,
      cellPadding: 3,
      textColor: [30, 41, 59],
    },
    columnStyles: {
      0: { cellWidth: 'auto', fontStyle: 'bold' },
      1: { cellWidth: 28, halign: 'center' },
      2: { cellWidth: 16, halign: 'center' },
      3: { cellWidth: 32, halign: 'right' },
      4: { cellWidth: 34, halign: 'right', fontStyle: 'bold' },
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
  })

  // Récapitulatif financier
  const endY = (doc as any).lastAutoTable?.finalY || 140
  const boxWidth = 90
  const boxX = pageWidth - 14 - boxWidth

  doc.setFillColor(248, 250, 252)
  doc.setDrawColor(203, 213, 225)
  doc.roundedRect(boxX, endY + 8, boxWidth, 48, 2, 2, 'FD')

  let rowY = endY + 15
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(71, 85, 105)

  doc.text('Total Brut Prestations :', boxX + 6, rowY)
  doc.text(formatMontant(data.montantTotal), pageWidth - 20, rowY, { align: 'right' })

  rowY += 7
  doc.text(`Prise en charge Assurance (${data.tauxCouverture || 0}%) :`, boxX + 6, rowY)
  doc.setTextColor(13, 148, 136)
  doc.text(`-${formatMontant(data.partAssurance)}`, pageWidth - 20, rowY, { align: 'right' })

  rowY += 7
  doc.setTextColor(71, 85, 105)
  doc.text('Part Patient (Ticket modérateur) :', boxX + 6, rowY)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text(formatMontant(data.partPatient), pageWidth - 20, rowY, { align: 'right' })

  rowY += 7
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(71, 85, 105)
  doc.text('Montant Encaissé au guichet :', boxX + 6, rowY)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(16, 185, 129) // emerald-500
  doc.text(formatMontant(data.montantPaye), pageWidth - 20, rowY, { align: 'right' })

  // Solde dû
  rowY += 8
  doc.setDrawColor(13, 148, 136)
  doc.line(boxX + 6, rowY - 2, pageWidth - 20, rowY - 2)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.setTextColor(data.resteAPayer > 0 ? 220 : 13, data.resteAPayer > 0 ? 38 : 148, data.resteAPayer > 0 ? 38 : 136)
  doc.text('Reste à payer :', boxX + 6, rowY + 3)
  doc.text(formatMontant(data.resteAPayer), pageWidth - 20, rowY + 3, { align: 'right' })

  // Tampon de Caisse
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.setTextColor(100, 116, 139)
  doc.text('VISA & CACHET DE LA CAISSE :', 14, endY + 16)

  doc.setDrawColor(203, 213, 225)
  doc.roundedRect(14, endY + 20, 60, 24, 2, 2)
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(7.5)
  doc.text(`Encaissé par : ${data.caissierNom || 'Caisse Centrale'}`, 18, endY + 26)
  doc.text(`Mode : ${data.modePaiement || 'Espèces'}`, 18, endY + 32)
  doc.text(`Statut : ${data.statutPaiement.toUpperCase()}`, 18, endY + 38)

  // Bas de page
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(148, 163, 184)
  doc.text(
    `Facture émise sous le système de gestion intégrée D-Santé (DEMBA Stack). Valeur de pièce justificative SYSCOHADA.`,
    pageWidth / 2,
    pageHeight - 8,
    { align: 'center' }
  )

  const filename = `Facture_${data.factureNumero}_${data.patientNom}.pdf`
  doc.save(filename)
}
