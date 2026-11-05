'use server'

import { createClient } from '@/utils/supabase/server'
import { getTenantContext } from '@/utils/supabase/tenant'
import { revalidatePath } from 'next/cache'

export async function getPersonnel() {
  const supabase = await createClient()
  const tenant = await getTenantContext()

  try {
    let query = supabase
      .from('personnel_soignant')
      .select('*')
      .eq('actif', true)
      .order('created_at', { ascending: false })

    if (tenant?.structureId) {
      query = query.eq('structure_id', tenant.structureId)
    }

    const { data, error } = await query

    if (error) {
      console.warn('Note lecture personnel_soignant:', error.message)
      return { personnel: [] }
    }

    return { personnel: data || [] }
  } catch (err: any) {
    return { personnel: [], error: err.message }
  }
}

export async function ajouterCollaborateur(formData: FormData) {
  const supabase = await createClient()
  const tenant = await getTenantContext()

  const nom = (formData.get('nom') as string)?.trim()
  const role = (formData.get('role') as string)?.trim() || 'medecin'
  const specialite = (formData.get('specialite') as string)?.trim() || 'Médecine Générale'
  const telephone = (formData.get('telephone') as string)?.trim() || ''
  const email = (formData.get('email') as string)?.trim() || ''
  const statut_garde = (formData.get('statut_garde') as string)?.trim() || 'En Service'
  const en_garde_aujourdhui = formData.get('en_garde_aujourdhui') === 'true'

  if (!nom) {
    return { error: 'Veuillez saisir le nom complet du collaborateur.' }
  }

  const structureId = tenant?.structureId || '00000000-0000-0000-0000-000000000001'

  try {
    const { error: insertError } = await supabase.from('personnel_soignant').insert({
      structure_id: structureId,
      nom,
      role,
      specialite,
      telephone,
      email,
      statut_garde,
      en_garde_aujourdhui,
      actif: true,
    })

    if (insertError) {
      return { error: insertError.message }
    }

    revalidatePath('/personnel')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Erreur lors de l’ajout du collaborateur' }
  }
}

export async function toggleGarde(id: string, statutActuel: boolean) {
  const supabase = await createClient()

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  if (!isUuid) {
    return { error: 'Collaborateur de démonstration non modifiable en base.' }
  }

  try {
    const { error } = await supabase
      .from('personnel_soignant')
      .update({ en_garde_aujourdhui: !statutActuel })
      .eq('id', id)

    if (error) return { error: error.message }

    revalidatePath('/personnel')
    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}
