'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { initiateMaketouPayment } from '@/lib/payments/maketou'
import { initiateChariowPayment } from '@/lib/payments/chariow'
import { siteUrl } from '@/lib/payments/config'

export type MoyenPaiement = 'mobile_money' | 'carte' | 'virement' | 'caisse'

export interface InitiateSubscriptionResult {
  ok: boolean
  checkoutUrl?: string
  virement?: boolean
  caisse?: boolean
  paymentId?: string
  message?: string
  error?: string
}

const TARIFS_SANTE: Record<string, { mensuel: number; annuel: number; nom: string }> = {
  poste_sante: {
    nom: 'Poste & Dispensaire',
    mensuel: 10000,
    annuel: 108000,
  },
  clinique: {
    nom: 'Clinique & Centre Médical',
    mensuel: 15000,
    annuel: 162000,
  },
  hopital: {
    nom: 'Hôpital & Polyclinique',
    mensuel: 20000,
    annuel: 216000,
  },
}

export async function initierPaiementAbonnementSante(
  planId: string,
  frequence: 'mensuel' | 'annuel',
  moyenPaiement: MoyenPaiement,
  phoneLocal?: string
): Promise<InitiateSubscriptionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: 'Session expirée. Veuillez vous reconnecter.' }
  }

  const admin = createAdminClient()

  // 1. Récupération de la structure de santé
  const { data: profile } = await admin
    .from('utilisateurs')
    .select('structure_id, gie_id')
    .eq('id', user.id)
    .maybeSingle()

  const structureId = profile?.structure_id || profile?.gie_id

  let structureNom = 'Structure Médicale'
  let structureTel = phoneLocal || user.phone || '+221 77 000 00 00'

  if (structureId) {
    const { data: stData } = await admin
      .from('structures_sante')
      .select('nom, telephone')
      .eq('id', structureId)
      .maybeSingle()

    if (stData) {
      structureNom = stData.nom || structureNom
      structureTel = stData.telephone || structureTel
    }
  }

  const tarif = TARIFS_SANTE[planId] || TARIFS_SANTE.clinique
  const montant = frequence === 'annuel' ? tarif.annuel : tarif.mensuel

  // 2. Détermination du provider initial
  const provider =
    moyenPaiement === 'caisse'
      ? 'caisse'
      : moyenPaiement === 'virement'
      ? 'virement'
      : 'maketou'

  // 3. Enregistrement dans abonnement_paiements
  const { data: payment, error: insertErr } = await admin
    .from('abonnement_paiements')
    .insert({
      structure_id: structureId || null,
      structure_nom: structureNom,
      structure_telephone: structureTel,
      niveau: planId,
      montant,
      devise: 'XOF',
      provider,
      moyen_paiement: moyenPaiement,
      statut: 'pending',
      notes: `${frequence.toUpperCase()} • ${tarif.nom}`,
    })
    .select('id')
    .single()

  if (insertErr || !payment) {
    console.error('[d-sante:abonnement] Erreur insertion paiement:', insertErr)
    return { ok: false, error: 'Impossible d’initialiser la transaction.' }
  }

  const paymentId = payment.id

  // CAS 1 : Règlement en Caisse (validé directement par le SuperAdmin)
  if (moyenPaiement === 'caisse') {
    return {
      ok: true,
      caisse: true,
      paymentId,
      message: `Votre demande de règlement en caisse (${montant.toLocaleString('fr-FR')} FCFA) a été enregistrée avec la référence #${paymentId.slice(0, 8)}. Elle sera validée directement par le SuperAdmin dès réception.`,
    }
  }

  // CAS 2 : Virement bancaire
  if (moyenPaiement === 'virement') {
    return {
      ok: true,
      virement: true,
      paymentId,
      message: `Virement bancaire de ${montant.toLocaleString('fr-FR')} FCFA en attente. Utilisez la référence #${paymentId.slice(0, 8)} lors de votre virement bancaire BOA / UBA.`,
    }
  }

  // CAS 3 : Mobile Money & Carte -> Maketou en direct sans webhook, Chariow en secours
  const returnUrl = `${siteUrl}/abonnement/retour?ref=${paymentId}`

  // A. Tentative avec Maketou
  try {
    const maketouProductId =
      process.env.MAKETOU_PRODUCT_ID ||
      (planId === 'hopital'
        ? 'PRD-MKT-SANTE-HOPITAL'
        : planId === 'poste_sante'
        ? 'PRD-MKT-SANTE-POSTE'
        : 'PRD-MKT-SANTE-CLINIQUE')

    const maketouRes = await initiateMaketouPayment({
      productId: maketouProductId,
      reference: paymentId,
      phoneLocal: phoneLocal || structureTel || '770000000',
      countryCode: 'SN',
      customerEmail: user.email || 'direction@structure.sn',
      customerName: structureNom,
      returnUrl,
      montantAttendu: montant,
    })

    if (maketouRes.ok) {
      await admin
        .from('abonnement_paiements')
        .update({
          provider: 'maketou',
          provider_reference: maketouRes.providerTransactionId,
          checkout_url: maketouRes.checkoutUrl,
        })
        .eq('id', paymentId)

      return { ok: true, checkoutUrl: maketouRes.checkoutUrl, paymentId }
    } else {
      console.warn('[d-sante:payment] Maketou indisponible:', maketouRes.error, '-> Bascule sur Chariow...')
    }
  } catch (err: any) {
    console.warn('[d-sante:payment] Exception Maketou:', err?.message, '-> Bascule sur Chariow...')
  }

  // B. Relais de secours : Chariow
  try {
    const chariowProductId =
      process.env.CHARIOW_PRODUCT_ID ||
      (montant >= 200000 ? 'prd_bb7is4in' : 'prd_43icfwzb')

    const chariowRes = await initiateChariowPayment({
      productId: chariowProductId,
      montantAttendu: montant,
      reference: paymentId,
      phoneLocal: phoneLocal || structureTel || '770000000',
      countryCode: 'SN',
      customerEmail: user.email || 'direction@structure.sn',
      customerName: structureNom,
      returnUrl,
    })

    if (chariowRes.ok) {
      await admin
        .from('abonnement_paiements')
        .update({
          provider: 'chariow',
          provider_reference: chariowRes.providerTransactionId,
          checkout_url: chariowRes.checkoutUrl,
        })
        .eq('id', paymentId)

      return { ok: true, checkoutUrl: chariowRes.checkoutUrl, paymentId }
    } else {
      console.warn('[d-sante:payment] Chariow a aussi échoué:', chariowRes.error)
    }
  } catch (err: any) {
    console.warn('[d-sante:payment] Exception Chariow:', err?.message)
  }

  return {
    ok: false,
    error: 'La passerelle de paiement en ligne est momentanément indisponible. Vous pouvez choisir "Paiement en Caisse" ou "Virement Bancaire" pour activer votre formule sans délai.',
  }
}
