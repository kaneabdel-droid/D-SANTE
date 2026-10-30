'use server'

import { createClient } from '@/utils/supabase/server'
import { getTenantContext } from '@/utils/supabase/tenant'
import { revalidatePath } from 'next/cache'

export async function getPatients(recherche?: string) {
  const supabase = await createClient()
  const tenant = await getTenantContext()

  try {
    let query = supabase
      .from('patients')
      .select('*, organismes_assurances(nom, type_organisme, taux_couverture_defaut)')
      .order('created_at', { ascending: false })

    if (tenant?.structureId) {
      query = query.eq('structure_id', tenant.structureId)
    }

    if (recherche && recherche.trim()) {
      const term = `%${recherche.trim()}%`
      query = query.or(`nom.ilike.${term},prenom.ilike.${term},ipp.ilike.${term},telephone.ilike.${term}`)
    }

    const { data, error } = await query

    if (error) {
      console.warn('Note lecture patients:', error.message)
      return { patients: [] }
    }

    return { patients: data || [] }
  } catch (err: any) {
    return { patients: [], error: err.message }
  }
}

export async function getOrganismesAssurances() {
  const supabase = await createClient()
  const tenant = await getTenantContext()

  try {
    let query = supabase
      .from('organismes_assurances')
      .select('id, nom, type_organisme, taux_couverture_defaut')
      .eq('actif', true)
      .order('nom')

    if (tenant?.structureId) {
      query = query.eq('structure_id', tenant.structureId)
    }

    const { data } = await query
    return { organismes: data || [] }
  } catch {
    return { organismes: [] }
  }
}

export async function ajouterPatient(formData: FormData) {
  const supabase = await createClient()
  const tenant = await getTenantContext()

  const nom = (formData.get('nom') as string)?.trim()
  const prenom = (formData.get('prenom') as string)?.trim()
  const date_naissance = (formData.get('date_naissance') as string) || null
  const sexe = (formData.get('sexe') as string) || 'M'
  const groupe_sanguin = (formData.get('groupe_sanguin') as string) || null
  const telephone = (formData.get('telephone') as string)?.trim() || null
  const adresse = (formData.get('adresse') as string)?.trim() || null
  const contact_nom = (formData.get('personne_contact_nom') as string)?.trim() || null
  const contact_tel = (formData.get('personne_contact_telephone') as string)?.trim() || null
  const assurance_id = (formData.get('organisme_assurance_id') as string) || null
  const numero_assure = (formData.get('numero_assure') as string)?.trim() || null
  const taux_couverture = parseFloat((formData.get('taux_couverture') as string) || '0')

  if (!nom || !prenom) {
    return { error: 'Le nom et le prénom du patient sont obligatoires' }
  }

  // Génération automatique IPP (Identifiant Permanent du Patient) : PAT-YYMM-XXXX
  const dateCode = new Date().toISOString().slice(2, 7).replace('-', '')
  const randNum = Math.floor(1000 + Math.random() * 9000)
  const ipp = `PAT-${dateCode}-${randNum}`

  const structureId = tenant?.structureId || '00000000-0000-0000-0000-000000000001'

  try {
    const { data: newPatient, error: errPatient } = await supabase
      .from('patients')
      .insert({
        structure_id: structureId,
        ipp,
        nom,
        prenom,
        date_naissance,
        sexe,
        groupe_sanguin,
        telephone,
        adresse,
        personne_contact_nom: contact_nom,
        personne_contact_telephone: contact_tel,
        organisme_assurance_id: assurance_id || null,
        numero_assure: numero_assure || null,
        taux_couverture: isNaN(taux_couverture) ? 0 : taux_couverture,
      })
      .select('id, ipp')
      .single()

    if (errPatient) {
      return { error: errPatient.message }
    }

    // Création automatique du dossier médical vierge rattaché
    if (newPatient) {
      await supabase.from('dossiers_medicaux').insert({
        patient_id: newPatient.id,
        structure_id: structureId,
      })
    }

    revalidatePath('/patients')
    revalidatePath('/dashboard')
    revalidatePath('/triage')
    return { success: true, patient: newPatient }
  } catch (err: any) {
    return { error: err.message || 'Erreur lors de l’enregistrement du patient' }
  }
}
