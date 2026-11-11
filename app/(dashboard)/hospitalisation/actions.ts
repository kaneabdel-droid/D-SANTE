'use server'

import { createClient } from '@/utils/supabase/server'
import { getTenantContext } from '@/utils/supabase/tenant'
import { ensurePatientExists } from '../patients/actions'
import { revalidatePath } from 'next/cache'

export async function getLitsEtHospitalisations() {
  const supabase = await createClient()
  const tenant = await getTenantContext()

  try {
    let qLits = supabase
      .from('lits')
      .select('*, services_medicaux(nom)')
      .order('chambre')
      .order('numero_lit')

    let qHosp = supabase
      .from('hospitalisations')
      .select('*, patients(nom, prenom, ipp, telephone, groupe_sanguin), lits(numero_lit, chambre, categorie), services_medicaux(nom)')
      .eq('statut', 'en_cours')
      .order('date_entree', { ascending: false })

    if (tenant?.structureId) {
      qLits = qLits.eq('structure_id', tenant.structureId)
      qHosp = qHosp.eq('structure_id', tenant.structureId)
    }

    const [{ data: lits }, { data: hospitalisations }] = await Promise.all([
      qLits,
      qHosp,
    ])

    return {
      lits: lits || [],
      hospitalisations: hospitalisations || [],
    }
  } catch (err: any) {
    return { lits: [], hospitalisations: [], error: err.message }
  }
}

export async function admettrePatient(formData: FormData) {
  const supabase = await createClient()
  const tenant = await getTenantContext()

  const patient_id = formData.get('patient_id') as string
  const lit_id = formData.get('lit_id') as string
  const service_id = (formData.get('service_id') as string) || null
  const motif = (formData.get('motif_admission') as string)?.trim()
  const date_prevue = (formData.get('date_sortie_prevue') as string) || null

  if (!patient_id || !lit_id || !motif) {
    return { error: 'Veuillez sélectionner le patient, le lit et le motif d’hospitalisation.' }
  }

  const structureId = tenant?.structureId || '00000000-0000-0000-0000-000000000001'
  const dateCode = new Date().toISOString().slice(2, 7).replace('-', '')
  const randNum = Math.floor(1000 + Math.random() * 9000)
  const numero_sejour = `SEJ-${dateCode}-${randNum}`

  try {
    // 0. Garantir la présence du patient en base
    await ensurePatientExists(patient_id, structureId)

    // 1. Créer le séjour d'hospitalisation
    const { error: errHosp } = await supabase.from('hospitalisations').insert({
      structure_id: structureId,
      patient_id,
      lit_id,
      service_id,
      medecin_traitant_id: tenant?.userId || null,
      numero_sejour,
      motif_admission: motif,
      date_sortie_prevue: date_prevue,
      statut: 'en_cours',
    })

    if (errHosp) return { error: errHosp.message }

    // 2. Mettre à jour le statut du lit à 'occupe'
    await supabase.from('lits').update({ statut: 'occupe' }).eq('id', lit_id)

    revalidatePath('/hospitalisation')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Erreur lors de l’admission' }
  }
}

export async function libererLit(
  hospitalisationId: string,
  litId?: string | null,
  modeSortie: string = 'guerison',
  resumeSortie?: string,
  statutLit: string = 'nettoyage'
) {
  const supabase = await createClient()

  // Si c'est un identifiant de démo (non-UUID)
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(hospitalisationId)
  if (!isUuid) {
    return {
      error: "Ce dossier est un exemple de démonstration. Pour tester une clôture réelle, admettez d'abord un patient via 'Nouvelle Admission'.",
    }
  }

  try {
    // Clôture du séjour
    const { error: errHosp } = await supabase
      .from('hospitalisations')
      .update({
        statut: 'cloturee',
        date_sortie_reelle: new Date().toISOString(),
        mode_sortie: modeSortie,
        resume_sortie: resumeSortie || 'Sortie autorisée par l’équipe médicale.',
      })
      .eq('id', hospitalisationId)

    if (errHosp) return { error: errHosp.message }

    // Remettre le lit en statut nettoyage ou libre
    if (litId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(litId)) {
      await supabase.from('lits').update({ statut: statutLit }).eq('id', litId)
    }

    revalidatePath('/hospitalisation')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Erreur lors de la sortie' }
  }
}

export async function supprimerHospitalisation(hospitalisationId: string, litId?: string | null) {
  const supabase = await createClient()
  const tenant = await getTenantContext()

  try {
    let query = supabase.from('hospitalisations').delete().eq('id', hospitalisationId)
    if (tenant?.structureId) {
      query = query.eq('structure_id', tenant.structureId)
    }
    const { error } = await query
    if (error) return { error: error.message }

    if (litId) {
      await supabase.from('lits').update({ statut: 'libre' }).eq('id', litId)
    }

    revalidatePath('/hospitalisation')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Erreur lors de la suppression' }
  }
}

export async function ajouterLit(formData: FormData) {
  const supabase = await createClient()
  const tenant = await getTenantContext()

  const numero_lit = (formData.get('numero_lit') as string)?.trim()
  const chambre = (formData.get('chambre') as string)?.trim() || 'Chambre 1'
  const categorie = (formData.get('categorie') as string) || 'standard'
  const service_id = (formData.get('service_id') as string) || null

  if (!numero_lit) {
    return { error: 'Le numéro de lit est obligatoire.' }
  }

  const structureId = tenant?.structureId || '00000000-0000-0000-0000-000000000001'

  try {
    const { error } = await supabase.from('lits').insert({
      structure_id: structureId,
      numero_lit,
      chambre,
      categorie,
      service_id,
      statut: 'libre',
      actif: true,
    })

    if (error) return { error: error.message }

    revalidatePath('/hospitalisation')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Erreur lors de l’ajout du lit' }
  }
}

export async function modifierLit(litId: string, formData: FormData) {
  const supabase = await createClient()
  const tenant = await getTenantContext()

  const numero_lit = (formData.get('numero_lit') as string)?.trim()
  const chambre = (formData.get('chambre') as string)?.trim() || 'Chambre 1'
  const categorie = (formData.get('categorie') as string) || 'standard'
  const statut = (formData.get('statut') as string) || 'libre'

  if (!numero_lit) {
    return { error: 'Le numéro de lit est obligatoire.' }
  }

  try {
    let query = supabase
      .from('lits')
      .update({
        numero_lit,
        chambre,
        categorie,
        statut,
        updated_at: new Date().toISOString(),
      })
      .eq('id', litId)

    if (tenant?.structureId) {
      query = query.eq('structure_id', tenant.structureId)
    }

    const { error } = await query
    if (error) return { error: error.message }

    revalidatePath('/hospitalisation')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Erreur lors de la modification du lit' }
  }
}

export async function supprimerLit(litId: string) {
  const supabase = await createClient()
  const tenant = await getTenantContext()

  try {
    let query = supabase.from('lits').delete().eq('id', litId)
    if (tenant?.structureId) {
      query = query.eq('structure_id', tenant.structureId)
    }
    const { error } = await query
    if (error) return { error: error.message }

    revalidatePath('/hospitalisation')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Erreur lors de la suppression du lit' }
  }
}
