'use server'

import { createClient } from '@/utils/supabase/server'
import { getTenantContext } from '@/utils/supabase/tenant'
import { revalidatePath } from 'next/cache'

export async function getDernieresConstantes() {
  const supabase = await createClient()
  const tenant = await getTenantContext()

  try {
    let query = supabase
      .from('constantes_vitales')
      .select('*, patients(nom, prenom, ipp, date_naissance, sexe)')
      .order('created_at', { ascending: false })
      .limit(50)

    if (tenant?.structureId) {
      query = query.eq('structure_id', tenant.structureId)
    }

    const { data, error } = await query

    if (error) {
      console.warn('Note lecture constantes:', error.message)
      return { constantes: [] }
    }

    return { constantes: data || [] }
  } catch (err: any) {
    return { constantes: [], error: err.message }
  }
}

export async function enregistrerConstantes(formData: FormData) {
  const supabase = await createClient()
  const tenant = await getTenantContext()

  const patient_id = formData.get('patient_id') as string
  const tension_sys = parseInt(formData.get('tension_systolique') as string || '0', 10)
  const tension_dia = parseInt(formData.get('tension_diastolique') as string || '0', 10)
  const temperature = parseFloat(formData.get('temperature') as string || '0')
  const pouls = parseInt(formData.get('pouls') as string || '0', 10)
  const saturation_o2 = parseInt(formData.get('saturation_o2') as string || '0', 10)
  const frequence_resp = parseInt(formData.get('frequence_respiratoire') as string || '0', 10)
  const glycemie = parseFloat(formData.get('glycemie') as string || '0')
  const poids = parseFloat(formData.get('poids_kg') as string || '0')
  const taille = parseFloat(formData.get('taille_cm') as string || '0')
  const douleur_eva = parseInt(formData.get('douleur_eva') as string || '0', 10)
  const observations = (formData.get('observations') as string)?.trim() || null

  if (!patient_id) {
    return { error: 'Veuillez sélectionner un patient' }
  }

  // Calcul IMC
  let imc: number | null = null
  if (poids > 0 && taille > 0) {
    const tailleM = taille / 100
    imc = parseFloat((poids / (tailleM * tailleM)).toFixed(1))
  }

  // Algorithme de classification de triage médical
  let niveau_triage: 'vert' | 'jaune' | 'orange' | 'rouge' = 'vert'

  if (
    (saturation_o2 > 0 && saturation_o2 < 90) ||
    (tension_sys > 200 || (tension_sys > 0 && tension_sys < 80)) ||
    (pouls > 140 || (pouls > 0 && pouls < 45)) ||
    temperature >= 40.0
  ) {
    niveau_triage = 'rouge' // Urgence vitale
  } else if (
    (saturation_o2 >= 90 && saturation_o2 <= 94) ||
    tension_sys >= 170 ||
    temperature >= 39.0 ||
    douleur_eva >= 7
  ) {
    niveau_triage = 'orange' // Très urgent
  } else if (
    tension_sys >= 145 ||
    temperature >= 38.3 ||
    douleur_eva >= 4 ||
    glycemie > 2.5
  ) {
    niveau_triage = 'jaune' // Urgent modéré
  }

  const structureId = tenant?.structureId || '00000000-0000-0000-0000-000000000001'

  try {
    const { error } = await supabase.from('constantes_vitales').insert({
      structure_id: structureId,
      patient_id,
      tension_systolique: tension_sys || null,
      tension_diastolique: tension_dia || null,
      temperature: temperature || null,
      pouls: pouls || null,
      saturation_o2: saturation_o2 || null,
      frequence_respiratoire: frequence_resp || null,
      glycemie: glycemie || null,
      poids_kg: poids || null,
      taille_cm: taille || null,
      imc,
      douleur_eva,
      niveau_triage,
      observations,
    })

    if (error) {
      return { error: error.message }
    }

    revalidatePath('/triage')
    revalidatePath('/dashboard')
    revalidatePath('/patients')
    return { success: true, niveau_triage }
  } catch (err: any) {
    return { error: err.message || 'Erreur lors de l’enregistrement des constantes' }
  }
}
