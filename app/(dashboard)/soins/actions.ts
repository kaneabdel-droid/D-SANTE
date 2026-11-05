'use server'

import { createClient } from '@/utils/supabase/server'
import { getTenantContext } from '@/utils/supabase/tenant'
import { ensurePatientExists } from '../patients/actions'
import { revalidatePath } from 'next/cache'

export async function getSoins() {
  const supabase = await createClient()
  const tenant = await getTenantContext()

  try {
    let query = supabase
      .from('soins_infirmiers')
      .select('*, patients(nom, prenom, ipp, telephone)')
      .order('date_soin', { ascending: false })

    if (tenant?.structureId) {
      query = query.eq('structure_id', tenant.structureId)
    }

    const { data, error } = await query

    if (error) {
      console.warn('Note lecture soins_infirmiers:', error.message)
      return { soins: [] }
    }

    return { soins: data || [] }
  } catch (err: any) {
    return { soins: [], error: err.message }
  }
}

export async function enregistrerSoin(formData: FormData) {
  const supabase = await createClient()
  const tenant = await getTenantContext()

  const patient_id = formData.get('patient_id') as string
  const type_soin = formData.get('type_soin') as string
  const description = (formData.get('description') as string)?.trim()
  const soignant_nom = (formData.get('soignant_nom') as string)?.trim()
  const emplacement = (formData.get('emplacement') as string)?.trim()
  const statut = (formData.get('statut') as string) || 'effectue'
  const observations = (formData.get('observations') as string)?.trim()
  const date_soin_input = formData.get('date_soin') as string

  if (!patient_id) {
    return { error: 'Veuillez sélectionner un patient.' }
  }
  if (!type_soin) {
    return { error: 'Veuillez sélectionner un type de soin.' }
  }
  if (!description) {
    return { error: 'Veuillez saisir la description du soin ou des produits administrés.' }
  }

  const structureId = tenant?.structureId || '00000000-0000-0000-0000-000000000001'

  // Composition des notes/observations avec métadonnées lit & soignant si présents
  const detailsArray: string[] = []
  if (emplacement) detailsArray.push(`Emplacement: ${emplacement}`)
  if (soignant_nom) detailsArray.push(`Soignant: ${soignant_nom}`)
  if (observations) detailsArray.push(observations)
  const finalObservations = detailsArray.length > 0 ? detailsArray.join(' | ') : null

  const dateSoin = date_soin_input ? new Date(date_soin_input).toISOString() : new Date().toISOString()

  try {
    await ensurePatientExists(patient_id, structureId)
    const { error: insertError } = await supabase.from('soins_infirmiers').insert({
      structure_id: structureId,
      patient_id,
      soignant_id: tenant?.userId || null,
      type_soin,
      description,
      statut,
      observations: finalObservations,
      date_soin: dateSoin,
    })

    if (insertError) {
      return { error: insertError.message }
    }

    revalidatePath('/soins')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Erreur lors de l’enregistrement du soin' }
  }
}

export async function changerStatutSoin(id: string, statut: 'planifie' | 'effectue' | 'annule') {
  const supabase = await createClient()

  // Vérifier si c'est un UUID valide pour la base
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  if (!isUuid) {
    return { error: 'Soin de démonstration non modifiable en base.' }
  }

  try {
    const { error } = await supabase
      .from('soins_infirmiers')
      .update({ statut })
      .eq('id', id)

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/soins')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Erreur lors de la mise à jour du statut' }
  }
}
