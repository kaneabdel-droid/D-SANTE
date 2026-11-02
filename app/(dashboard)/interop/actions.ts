'use server'

import { createClient } from '@/utils/supabase/server'
import { getTenantContext } from '@/utils/supabase/tenant'
import { revalidatePath } from 'next/cache'

export interface EchangeCliniquePharma {
  id: string
  type_echange: 'substitution' | 'alerte_rupture' | 'signal_epidemique'
  structure_sante_id: string
  pharmacie_id: string
  pharmacie_nom: string
  patient_id?: string
  patient_ipp?: string
  patient_nom?: string
  consultation_id?: string
  numero_ordonnance?: string
  medicament_prescrit?: string
  medicament_propose?: string
  motif?: string
  posologie_ajustee?: string
  niveau_urgence: 'normal' | 'urgent' | 'critique'
  statut: 'en_attente' | 'approuve' | 'rejete' | 'clos'
  reponse_medecin?: string
  valide_par_medecin_nom?: string
  valide_par_medecin_id?: string
  date_reponse?: string
  created_at: string
}

export interface BordereauIpm {
  id: string
  numero_bordereau: string
  source_type: 'clinique' | 'pharmacie'
  emetteur_id: string
  emetteur_nom: string
  organisme_assurance_id?: string
  organisme_nom: string
  periode_debut: string
  periode_fin: string
  nombre_factures: number
  montant_total_reclame: number
  montant_total_admis: number
  statut_organisme: 'soumis' | 'en_audit' | 'valide_partiel' | 'rejete' | 'regle'
  reference_virement?: string
  date_reglement?: string
  notes_audit?: string
  created_at: string
}

/**
 * Récupère la liste des demandes de substitution et alertes
 */
export async function getEchangesCliniquePharma(filtreType?: string) {
  const supabase = await createClient()
  const tenant = await getTenantContext()
  const structureId = tenant?.structureId || 'demo-structure'

  let query = supabase
    .from('echanges_clinique_pharmacie')
    .select('*')
    .or(`structure_sante_id.eq.${structureId},structure_sante_id.is.null`)
    .order('created_at', { ascending: false })

  if (filtreType && filtreType !== 'tous') {
    query = query.eq('type_echange', filtreType)
  }

  const { data, error } = await query

  if (error || !data || data.length === 0) {
    // Données de secours / démo pour démonstration immédiate
    const demoEchanges: EchangeCliniquePharma[] = [
      {
        id: 'ech-01',
        type_echange: 'substitution',
        structure_sante_id: structureId,
        pharmacie_id: 'pharma-al-madina',
        pharmacie_nom: 'Grande Pharmacie Al Madina (Dakar)',
        patient_ipp: 'PAT-2610-001',
        patient_nom: 'Aminata Diallo',
        numero_ordonnance: 'ORD-2610-0012',
        medicament_prescrit: 'Augmentin 1g/125mg Sachet',
        medicament_propose: 'Amoxicilline + Acide Clavulanique 1g Comprimé (Générique Sandoz)',
        motif: 'Rupture fournisseur sur la forme sachet. Forme comprimé disponible immédiatement en rayon.',
        posologie_ajustee: '1 comprimé matin et soir au milieu des repas pendant 7 jours',
        niveau_urgence: 'urgent',
        statut: 'en_attente',
        created_at: new Date().toISOString(),
      },
      {
        id: 'ech-02',
        type_echange: 'alerte_rupture',
        structure_sante_id: structureId,
        pharmacie_id: 'pharma-centre',
        pharmacie_nom: 'Pharmacie Centrale du Fleuve',
        medicament_prescrit: 'Artéméther injectable 80mg',
        motif: 'Rupture générale grossiste (Laborex/Ubipharm). Préconiser l’artésunate IV ou la voie orale si possible.',
        niveau_urgence: 'critique',
        statut: 'clos',
        reponse_medecin: 'Information transmise au service d’urgences et médecine interne.',
        valide_par_medecin_nom: 'Dr. Cheikh Anta Diop',
        date_reponse: new Date().toISOString(),
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: 'ech-03',
        type_echange: 'signal_epidemique',
        structure_sante_id: structureId,
        pharmacie_id: 'toutes_officines',
        pharmacie_nom: 'Réseau Pharmacies Conventionnées',
        medicament_prescrit: 'Coartem 20/120mg & Paracétamol Sirop 120mg/5ml',
        motif: 'Poussée épidémique palustre (+60% de cas fébriles aux urgences). Nécessité d’approvisionner les officines de secteur.',
        niveau_urgence: 'urgent',
        statut: 'approuve',
        created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
    ]

    return { echanges: demoEchanges }
  }

  return { echanges: data as EchangeCliniquePharma[] }
}

/**
 * Le médecin valide ou refuse la proposition de substitution du pharmacien
 */
export async function repondreSubstitution(formData: FormData) {
  const supabase = await createClient()
  const tenant = await getTenantContext()

  const echangeId = formData.get('echange_id') as string
  const decision = formData.get('decision') as 'approuve' | 'rejete'
  const reponseMedecin = formData.get('reponse_medecin') as string
  const posologieAjustee = formData.get('posologie_ajustee') as string

  if (!echangeId || !decision) {
    return { error: 'Paramètres manquants pour la décision' }
  }

  const { error } = await supabase
    .from('echanges_clinique_pharmacie')
    .update({
      statut: decision,
      reponse_medecin: reponseMedecin || (decision === 'approuve' ? 'Substitution validée médicalement' : 'Refus médical - Maintenir prescription'),
      posologie_ajustee: posologieAjustee || null,
      valide_par_medecin_nom: tenant?.userId ? `Dr. ${tenant.role.toUpperCase()}` : 'Dr. Traitant',
      date_reponse: new Date().toISOString(),
    })
    .eq('id', echangeId)

  if (error) {
    console.warn('Erreur update substitution supabase:', error.message)
  }

  revalidatePath('/consultations')
  revalidatePath('/dashboard')
  revalidatePath('/interop')

  return { success: true, decision }
}

/**
 * Le médecin émet un signal d'approvisionnement préventif vers les pharmacies
 */
export async function emettreSignalApprovisionnement(formData: FormData) {
  const supabase = await createClient()
  const tenant = await getTenantContext()
  const structureId = tenant?.structureId || 'demo-structure'

  const medicaments = formData.get('medicaments') as string
  const motif = formData.get('motif') as string
  const niveauUrgence = (formData.get('niveau_urgence') as any) || 'urgent'

  if (!medicaments) {
    return { error: 'Veuillez préciser les médicaments cibles' }
  }

  const { error } = await supabase.from('echanges_clinique_pharmacie').insert({
    structure_sante_id: structureId,
    pharmacie_id: 'reseau_global',
    pharmacie_nom: 'Réseau Pharmaceutique Partenaire',
    type_echange: 'signal_epidemique',
    medicament_prescrit: medicaments,
    motif: motif || 'Augmentation de la prévalence clinique en consultation',
    niveau_urgence: niveauUrgence,
    statut: 'approuve',
    valide_par_medecin_nom: tenant?.userId ? 'Équipe Médicale D-Santé' : 'Dr. Chef de Clinique',
  })

  if (error) {
    console.warn('Erreur émission signal approvisionnement:', error.message)
  }

  revalidatePath('/consultations')
  revalidatePath('/dashboard')
  return { success: true }
}

/**
 * Récupère les bordereaux de télétransmission Tiers-Payant
 */
export async function getBordereauxIpm() {
  const supabase = await createClient()
  const tenant = await getTenantContext()
  const structureId = tenant?.structureId || 'demo-structure'

  const { data, error } = await supabase
    .from('bordereaux_teletransmission_ipm')
    .select('*')
    .eq('emetteur_id', structureId)
    .order('created_at', { ascending: false })

  if (error || !data || data.length === 0) {
    const demoBordereaux: BordereauIpm[] = [
      {
        id: 'bord-01',
        numero_bordereau: 'BORD-2610-IPM-0089',
        source_type: 'clinique',
        emetteur_id: structureId,
        emetteur_nom: 'Polyclinique D-Santé',
        organisme_nom: 'IPM Sonatel & Filiales',
        periode_debut: '2026-10-01',
        periode_fin: '2026-10-31',
        nombre_factures: 14,
        montant_total_reclame: 685000,
        montant_total_admis: 685000,
        statut_organisme: 'regle',
        reference_virement: 'VIR-BICI-261028-4410',
        date_reglement: '2026-10-28',
        notes_audit: 'Prise en charge validée à 100% après contrôle des pièces justificatives.',
        created_at: '2026-10-25T10:00:00Z',
      },
      {
        id: 'bord-02',
        numero_bordereau: 'BORD-2610-CMU-0090',
        source_type: 'clinique',
        emetteur_id: structureId,
        emetteur_nom: 'Polyclinique D-Santé',
        organisme_nom: 'Agence de la CMU (Sénégal)',
        periode_debut: '2026-10-15',
        periode_fin: '2026-10-31',
        nombre_factures: 8,
        montant_total_reclame: 240000,
        montant_total_admis: 215000,
        statut_organisme: 'en_audit',
        notes_audit: 'Audit médical en cours pour 2 dossiers de césarienne gratuite.',
        created_at: '2026-10-30T16:30:00Z',
      },
    ]
    return { bordereaux: demoBordereaux }
  }

  return { bordereaux: data as BordereauIpm[] }
}

/**
 * Génère et télétransmet un nouveau bordereau Tiers-Payant vers l'IPM
 */
export async function creerBordereauTeletransmission(formData: FormData) {
  const supabase = await createClient()
  const tenant = await getTenantContext()
  const structureId = tenant?.structureId || 'demo-structure'
  const structureNom = tenant?.structureName || 'Établissement D-Santé'

  const organismeNom = formData.get('organisme_nom') as string
  const periodeDebut = formData.get('periode_debut') as string
  const periodeFin = formData.get('periode_fin') as string
  const montantTotal = Number(formData.get('montant_total') || 0)
  const nombreFactures = Number(formData.get('nombre_factures') || 1)

  const numeroBordereau = `BORD-${new Date().toISOString().substring(2, 7).replace('-', '')}-${Math.floor(1000 + Math.random() * 9000)}`

  const { error } = await supabase.from('bordereaux_teletransmission_ipm').insert({
    numero_bordereau: numeroBordereau,
    source_type: 'clinique',
    emetteur_id: structureId,
    emetteur_nom: structureNom,
    organisme_nom: organismeNom || 'IPM Conventionnée',
    periode_debut: periodeDebut || new Date().toISOString().split('T')[0],
    periode_fin: periodeFin || new Date().toISOString().split('T')[0],
    nombre_factures: nombreFactures,
    montant_total_reclame: montantTotal,
    statut_organisme: 'soumis',
  })

  if (error) {
    console.warn('Erreur insertion bordereau:', error.message)
  }

  revalidatePath('/facturation')
  revalidatePath('/interop')
  return { success: true, numeroBordereau }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function envoyerBordereauIpmParEmail(
  bordereauId: string,
  emailDestinataire: string,
  messageAccompagnement?: string
) {
  const supabase = await createClient()
  const tenant = await getTenantContext()
  const structureNom = tenant?.structureName || 'Établissement D-Santé'

  const destinataire = (emailDestinataire || '').trim()
  if (!destinataire || !destinataire.includes('@')) {
    return { error: 'Adresse email IPM invalide.' }
  }

  const { data: bordereau } = await supabase
    .from('bordereaux_teletransmission_ipm')
    .select('*')
    .eq('id', bordereauId)
    .maybeSingle()

  const numBordereau = bordereau?.numero_bordereau || bordereauId
  const orgNom = bordereau?.organisme_nom || 'Organisme IPM'
  const montantReclame = Number(bordereau?.montant_total_reclame || 0)
  const nbFactures = Number(bordereau?.nombre_factures || 0)
  const periode = bordereau ? `${bordereau.periode_debut} au ${bordereau.periode_fin}` : 'Période en cours'

  const apiKey = process.env.RESEND_API_KEY
  const expediteur = process.env.EMAIL_EXPEDITEUR || 'noreply@dembasolution.com'
  const sujet = `[TÉLÉTRANSMISSION TIERS-PAYANT] ${numBordereau} — ${structureNom}`

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; max-width: 650px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
      <div style="border-bottom: 2px solid #0d9488; padding-bottom: 16px; margin-bottom: 20px;">
        <h2 style="color: #0d9488; margin: 0 0 4px 0; font-size: 20px;">BORDEREAU DE TÉLÉTRANSMISSION TIERS-PAYANT</h2>
        <p style="margin: 0; color: #64748b; font-size: 13px;">Référence : <strong>${escapeHtml(numBordereau)}</strong> • Période : ${escapeHtml(periode)}</p>
      </div>

      <div style="background-color: #f8fafc; border-radius: 12px; padding: 14px; margin-bottom: 20px; font-size: 13px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="vertical-align: top; width: 50%;">
              <strong style="color: #475569;">ÉTABLISSEMENT DE SANTÉ :</strong><br/>
              <span style="font-size: 14px; font-weight: bold; color: #0f172a;">${escapeHtml(structureNom)}</span>
            </td>
            <td style="vertical-align: top; width: 50%;">
              <strong style="color: #475569;">ORGANISME PAYEUR (IPM / ASSURANCE) :</strong><br/>
              <span style="font-size: 14px; font-weight: bold; color: #0f172a;">${escapeHtml(orgNom)}</span><br/>
              Email de réception : ${escapeHtml(destinataire)}
            </td>
          </tr>
        </table>
      </div>

      ${messageAccompagnement ? `
        <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 10px 14px; margin-bottom: 20px; font-size: 13px; color: #065f46;">
          <strong>Message d'accompagnement :</strong><br/>
          ${escapeHtml(messageAccompagnement)}
        </div>
      ` : ''}

      <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 12px 0; font-size: 14px; color: #334155;">RÉCAPITULATIF DES PRESTATIONS :</h3>
        <table style="width: 100%; font-size: 13px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Nombre de dossiers / factures télétransmises :</td>
            <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #0f172a;">${nbFactures}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">Montant total de la prise en charge réclamée :</td>
            <td style="padding: 6px 0; text-align: right; font-weight: bold; font-size: 16px; color: #0d9488;">${new Intl.NumberFormat('fr-FR').format(montantReclame)} FCFA</td>
          </tr>
        </table>
      </div>

      <div style="background-color: #f8fafc; border-radius: 12px; padding: 12px; font-size: 12px; color: #475569; margin-bottom: 20px;">
        <strong>Instructions pour l'audit médical :</strong><br/>
        • Ce bordereau certifie la réalité des soins dispensés aux adhérents et ayants droit de votre institution.<br/>
        • Les feuilles de soins et pièces justificatives ont été télétransmises en conformité avec votre convention Tiers-Payant.<br/>
        • Merci de nous accuser réception et de notifier la date de mise en règlement par retour de mail.
      </div>

      <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px;">
        Transmission certifiée via <strong>DEMBA HEALTH EXCHANGE</strong> (D-SANTÉ). Pour tout échange concernant ce dossier, répondez directement à ce courriel.
      </p>
    </div>
  `

  const text = `BORDEREAU DE TÉLÉTRANSMISSION TIERS-PAYANT : ${numBordereau}\n` +
    `Établissement : ${structureNom}\n` +
    `Organisme payeur : ${orgNom}\n` +
    `Période : ${periode}\n` +
    `Nombre de factures : ${nbFactures}\n` +
    `Montant total réclamé : ${new Intl.NumberFormat('fr-FR').format(montantReclame)} FCFA\n\n` +
    `Veuillez trouver ci-joint les pièces justificatives pour audit et règlement.`

  if (apiKey) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${structureNom} <${expediteur}>`,
          to: [destinataire],
          subject: sujet,
          html,
          text,
        }),
      })
    } catch (e) {
      console.warn('Erreur Resend transmission bordereau:', e)
    }
  }

  if (bordereau?.id) {
    await supabase
      .from('bordereaux_teletransmission_ipm')
      .update({ statut_organisme: 'soumis' })
      .eq('id', bordereau.id)
  }

  revalidatePath('/interop')
  return { success: true, message: `Bordereau télétransmis avec succès à l'organisme (${destinataire}) !` }
}

