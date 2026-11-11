'use server'

import { createClient } from '@/utils/supabase/server'
import { getTenantContext } from '@/utils/supabase/tenant'
import { ensurePatientExists } from '../patients/actions'
import { revalidatePath } from 'next/cache'

export async function getConsultations(filtre?: string, patientId?: string) {
  const supabase = await createClient()
  const tenant = await getTenantContext()

  try {
    let query = supabase
      .from('consultations')
      .select('*, patients(nom, prenom, ipp, date_naissance, sexe, groupe_sanguin), services_medicaux(nom), prescriptions(*, lignes_prescriptions(*))')
      .order('date_consultation', { ascending: false })
      .order('created_at', { ascending: false })

    if (tenant?.structureId) {
      query = query.eq('structure_id', tenant.structureId)
    }

    if (patientId) {
      query = query.eq('patient_id', patientId)
    }

    if (filtre && filtre !== 'tous') {
      query = query.eq('type_consultation', filtre)
    }

    const { data, error } = await query

    if (error) {
      console.warn('Note lecture consultations:', error.message)
      return { consultations: [] }
    }

    return { consultations: data || [] }
  } catch (err: any) {
    return { consultations: [], error: err.message }
  }
}

export async function getServicesMedicaux() {
  const supabase = await createClient()
  const tenant = await getTenantContext()

  try {
    let query = supabase
      .from('services_medicaux')
      .select('id, nom, code')
      .eq('actif', true)
      .order('nom')

    if (tenant?.structureId) {
      query = query.eq('structure_id', tenant.structureId)
    }

    const { data } = await query
    return { services: data || [] }
  } catch {
    return { services: [] }
  }
}

export async function creerConsultation(formData: FormData, prescriptionsLignesJSON?: string) {
  const supabase = await createClient()
  const tenant = await getTenantContext()

  const patient_id = formData.get('patient_id') as string
  const service_id = (formData.get('service_id') as string) || null
  const type_consultation = (formData.get('type_consultation') as string) || 'generale'
  const motif = (formData.get('motif') as string)?.trim()
  const anamnese = (formData.get('anamnese') as string)?.trim() || null
  const examen_clinique = (formData.get('examen_clinique') as string)?.trim() || null
  const diagnostic_principal = (formData.get('diagnostic_principal') as string)?.trim() || null
  const code_cim10 = (formData.get('code_cim10') as string)?.trim() || null
  const diagnostics_associes = (formData.get('diagnostics_associes') as string)?.trim() || null
  const conduite_a_tenir = (formData.get('conduite_a_tenir') as string)?.trim() || null

  if (!patient_id || !motif) {
    return { error: 'Veuillez sélectionner un patient et renseigner le motif de consultation.' }
  }

  const structureId = tenant?.structureId || '00000000-0000-0000-0000-000000000001'
  const dateCode = new Date().toISOString().slice(2, 7).replace('-', '')
  const randNum = Math.floor(1000 + Math.random() * 9000)
  const numero_consultation = `CS-${dateCode}-${randNum}`

  try {
    // 0. Garantir la présence du patient en base
    await ensurePatientExists(patient_id, structureId)

    // 1. Insertion de la consultation
    const { data: consultation, error: errCons } = await supabase
      .from('consultations')
      .insert({
        structure_id: structureId,
        patient_id,
        service_id,
        praticien_id: tenant?.userId || null,
        numero_consultation,
        type_consultation,
        motif,
        anamnese,
        examen_clinique,
        diagnostic_principal,
        code_cim10,
        diagnostics_associes,
        conduite_a_tenir,
        statut: 'terminee',
      })
      .select('id')
      .single()

    if (errCons || !consultation) {
      return { error: errCons?.message || 'Erreur lors de la création de la consultation' }
    }

    // 2. Traitement éventuel de l'ordonnance médicale
    if (prescriptionsLignesJSON) {
      const lignes: any[] = JSON.parse(prescriptionsLignesJSON)
      if (Array.isArray(lignes) && lignes.length > 0) {
        const numero_ordonnance = `ORD-${dateCode}-${randNum}`

        const { data: presc, error: errPresc } = await supabase
          .from('prescriptions')
          .insert({
            structure_id: structureId,
            consultation_id: consultation.id,
            patient_id,
            praticien_id: tenant?.userId || null,
            numero_ordonnance,
            statut: 'active',
          })
          .select('id')
          .single()

        if (!errPresc && presc) {
          const insertLignes = lignes.map((l) => ({
            prescription_id: presc.id,
            type_prescription: l.type || 'medicament',
            designation: l.designation,
            dosage: l.dosage || null,
            forme: l.forme || null,
            posologie: l.posologie || null,
            duree_jours: l.duree_jours ? parseInt(l.duree_jours, 10) : null,
            instructions: l.instructions || null,
          }))

          await supabase.from('lignes_prescriptions').insert(insertLignes)
        }
      }
    }

    revalidatePath('/consultations')
    revalidatePath('/dashboard')
    revalidatePath('/patients')
    return { success: true, consultationId: consultation.id }
  } catch (err: any) {
    return { error: err.message || 'Erreur inattendue lors de la consultation' }
  }
}

export async function modifierConsultation(consultationId: string, formData: FormData) {
  const supabase = await createClient()
  const tenant = await getTenantContext()

  const motif = (formData.get('motif') as string)?.trim()
  const type_consultation = (formData.get('type_consultation') as string) || 'generale'
  const diagnostic_principal = (formData.get('diagnostic_principal') as string)?.trim() || null
  const code_cim10 = (formData.get('code_cim10') as string)?.trim() || null
  const conduite_a_tenir = (formData.get('conduite_a_tenir') as string)?.trim() || null

  if (!motif) {
    return { error: 'Le motif de consultation est obligatoire.' }
  }

  try {
    let query = supabase
      .from('consultations')
      .update({
        motif,
        type_consultation,
        diagnostic_principal,
        code_cim10,
        conduite_a_tenir,
        updated_at: new Date().toISOString(),
      })
      .eq('id', consultationId)

    if (tenant?.structureId) {
      query = query.eq('structure_id', tenant.structureId)
    }

    const { error } = await query
    if (error) return { error: error.message }

    revalidatePath('/consultations')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Erreur lors de la mise à jour de la consultation' }
  }
}

export async function supprimerConsultation(consultationId: string) {
  const supabase = await createClient()
  const tenant = await getTenantContext()

  try {
    let query = supabase.from('consultations').delete().eq('id', consultationId)
    if (tenant?.structureId) {
      query = query.eq('structure_id', tenant.structureId)
    }

    const { error } = await query
    if (error) return { error: error.message }

    revalidatePath('/consultations')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Erreur lors de la suppression de la consultation' }
  }
}
