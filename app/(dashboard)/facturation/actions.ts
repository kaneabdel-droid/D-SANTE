'use server'

import { createClient } from '@/utils/supabase/server'
import { getTenantContext } from '@/utils/supabase/tenant'
import { revalidatePath } from 'next/cache'

export async function getFactures(filtreStatut?: string) {
  const supabase = await createClient()
  const tenant = await getTenantContext()

  try {
    let query = supabase
      .from('factures_sante')
      .select('*, patients(nom, prenom, ipp, telephone), organismes_assurances(nom, type_organisme)')
      .order('date_facture', { ascending: false })
      .order('created_at', { ascending: false })

    if (tenant?.structureId) {
      query = query.eq('structure_id', tenant.structureId)
    }

    if (filtreStatut && filtreStatut !== 'tous') {
      query = query.eq('statut_paiement_patient', filtreStatut)
    }

    const { data, error } = await query

    if (error) {
      console.warn('Note lecture factures:', error.message)
      return { factures: [] }
    }

    return { factures: data || [] }
  } catch (err: any) {
    return { factures: [], error: err.message }
  }
}

export async function creerFacture(formData: FormData) {
  const supabase = await createClient()
  const tenant = await getTenantContext()

  const patient_id = formData.get('patient_id') as string
  const montant_total = parseFloat(formData.get('montant_total') as string || '0')
  const taux_couverture = parseFloat(formData.get('taux_couverture') as string || '0')
  const organisme_id = (formData.get('organisme_assurance_id') as string) || null
  const moyen_paiement = (formData.get('moyen_paiement') as string) || 'especes'
  const est_paye_immediat = formData.get('est_paye_immediat') === 'on'

  if (!patient_id || montant_total <= 0) {
    return { error: 'Veuillez sélectionner un patient et spécifier un montant valide.' }
  }

  // Calcul automatique ventilation Ticket Modérateur Patient vs Tiers-Payant
  const part_assurance = Math.round((montant_total * taux_couverture) / 100)
  const part_patient = montant_total - part_assurance

  const structureId = tenant?.structureId || '00000000-0000-0000-0000-000000000001'
  const dateCode = new Date().toISOString().slice(2, 7).replace('-', '')
  const randNum = Math.floor(1000 + Math.random() * 9000)
  const numero_facture = `FAC-${dateCode}-${randNum}`

  try {
    const { data: fac, error } = await supabase
      .from('factures_sante')
      .insert({
        structure_id: structureId,
        patient_id,
        organisme_assurance_id: organisme_id,
        numero_facture,
        montant_total_brut: montant_total,
        part_patient,
        part_assurance,
        montant_regle_patient: est_paye_immediat ? part_patient : 0,
        statut_paiement_patient: est_paye_immediat ? 'paye' : 'en_attente',
        statut_paiement_assurance: part_assurance > 0 ? 'en_attente' : 'exonere',
        moyen_paiement,
      })
      .select('id')
      .single()

    if (error) return { error: error.message }

    revalidatePath('/facturation')
    revalidatePath('/dashboard')
    revalidatePath('/comptabilite')
    return { success: true, factureId: fac.id }
  } catch (err: any) {
    return { error: err.message || 'Erreur lors de la création de la facture' }
  }
}

export async function encaisserFacture(
  factureId: string,
  moyenPaiement: string = 'especes',
  montantEncaisse?: number
) {
  const supabase = await createClient()

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(factureId)
  if (!isUuid) {
    return {
      error: "Cette facture est un exemple de démonstration. Pour tester un encaissement réel, émettez d'abord une facture via '+ Nouvelle Facture'.",
    }
  }

  try {
    const { data: fac, error: fetchErr } = await supabase
      .from('factures_sante')
      .select('part_patient, montant_regle_patient')
      .eq('id', factureId)
      .single()

    if (fetchErr || !fac) {
      return { error: 'Facture introuvable.' }
    }

    const partPatient = Number(fac.part_patient || 0)
    const dejaRegle = Number(fac.montant_regle_patient || 0)
    const aRegler = montantEncaisse !== undefined ? montantEncaisse : (partPatient - dejaRegle)
    const nouveauTotalRegle = dejaRegle + aRegler
    const statutPaiement = nouveauTotalRegle >= partPatient ? 'paye' : 'partiel'

    const { error: updateErr } = await supabase
      .from('factures_sante')
      .update({
        montant_regle_patient: nouveauTotalRegle,
        statut_paiement_patient: statutPaiement,
        moyen_paiement: moyenPaiement,
      })
      .eq('id', factureId)

    if (updateErr) {
      return { error: updateErr.message }
    }

    revalidatePath('/facturation')
    revalidatePath('/dashboard')
    revalidatePath('/caisse')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Erreur lors de l’encaissement' }
  }
}
