'use server'

import { createClient } from '@/utils/supabase/server'
import { getTenantContext } from '@/utils/supabase/tenant'
import { revalidatePath } from 'next/cache'

const DEFAULT_PATIENTS = [
  {
    id: '11111111-1111-1111-1111-111111110001',
    ipp: 'PAT-2610-001',
    nom: 'Diallo',
    prenom: 'Aminata',
    date_naissance: '1992-04-15',
    sexe: 'F',
    groupe_sanguin: 'O+',
    telephone: '+221 77 452 10 99',
    taux_couverture: 80,
  },
  {
    id: '11111111-1111-1111-1111-111111110002',
    ipp: 'PAT-2610-002',
    nom: 'Sow',
    prenom: 'Moussa',
    date_naissance: '1985-11-20',
    sexe: 'M',
    groupe_sanguin: 'B+',
    telephone: '+221 70 882 14 30',
    taux_couverture: 0,
  },
  {
    id: '11111111-1111-1111-1111-111111110003',
    ipp: 'PAT-2610-003',
    nom: 'Ba',
    prenom: 'Aïssatou',
    date_naissance: '2001-08-05',
    sexe: 'F',
    groupe_sanguin: 'A-',
    telephone: '+221 78 312 90 44',
    taux_couverture: 50,
  },
]

export async function ensurePatientExists(patientId: string, structureId?: string | null) {
  // Ne plus insérer de faux patients de démo dans la base de données réelle
  return
}

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

export async function modifierPatient(patientId: string, formData: FormData) {
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

  try {
    let query = supabase
      .from('patients')
      .update({
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
        updated_at: new Date().toISOString(),
      })
      .eq('id', patientId)

    if (tenant?.structureId) {
      query = query.eq('structure_id', tenant.structureId)
    }

    const { error } = await query
    if (error) return { error: error.message }

    revalidatePath('/patients')
    revalidatePath(`/patients/${patientId}`)
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Erreur lors de la modification du patient' }
  }
}

export async function supprimerPatient(patientId: string) {
  const supabase = await createClient()
  const tenant = await getTenantContext()

  try {
    let query = supabase.from('patients').delete().eq('id', patientId)
    if (tenant?.structureId) {
      query = query.eq('structure_id', tenant.structureId)
    }
    const { error } = await query
    if (error) return { error: error.message }

    revalidatePath('/patients')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Erreur lors de la suppression du patient' }
  }
}

export async function getPatientComplet(patientId: string) {
  const supabase = await createClient()

  try {
    const [
      { data: patient },
      { data: dossier },
      { data: constantes },
      { data: consultations },
      { data: hospitalisations },
      { data: factures },
    ] = await Promise.all([
      supabase
        .from('patients')
        .select('*, organismes_assurances(nom, type_organisme, taux_couverture_defaut)')
        .eq('id', patientId)
        .maybeSingle(),
      supabase
        .from('dossiers_medicaux')
        .select('*')
        .eq('patient_id', patientId)
        .maybeSingle(),
      supabase
        .from('constantes_vitales')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('consultations')
        .select('*, prescriptions(*, lignes_prescriptions(*))')
        .eq('patient_id', patientId)
        .order('date_consultation', { ascending: false })
        .limit(10),
      supabase
        .from('hospitalisations')
        .select('*, lits(numero_lit, chambre, categorie)')
        .eq('patient_id', patientId)
        .order('date_entree', { ascending: false })
        .limit(5),
      supabase
        .from('factures_sante')
        .select('*')
        .eq('patient_id', patientId)
        .order('date_facture', { ascending: false })
        .limit(10),
    ])

    return {
      patient,
      dossier,
      constantes: constantes || [],
      consultations: consultations || [],
      hospitalisations: hospitalisations || [],
      factures: factures || [],
    }
  } catch (err: any) {
    return { error: err.message }
  }
}

export async function mettreAJourDossierMedical(patientId: string, formData: FormData) {
  const supabase = await createClient()
  const tenant = await getTenantContext()

  const allergiesStr = (formData.get('allergies') as string)?.trim() || ''
  const antecedents_medicaux = (formData.get('antecedents_medicaux') as string)?.trim() || null
  const antecedents_chirurgicaux = (formData.get('antecedents_chirurgicaux') as string)?.trim() || null
  const antecedents_familiaux = (formData.get('antecedents_familiaux') as string)?.trim() || null
  const traitements_chroniques = (formData.get('traitements_chroniques') as string)?.trim() || null
  const remarques_praticien = (formData.get('remarques_praticien') as string)?.trim() || null

  const allergiesArray = allergiesStr
    .split(',')
    .map((a) => a.trim())
    .filter(Boolean)

  const structureId = tenant?.structureId || '00000000-0000-0000-0000-000000000001'

  try {
    const { error } = await supabase
      .from('dossiers_medicaux')
      .upsert({
        patient_id: patientId,
        structure_id: structureId,
        allergies: allergiesArray,
        antecedents_medicaux,
        antecedents_chirurgicaux,
        antecedents_familiaux,
        traitements_chroniques,
        remarques_praticien,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'patient_id' })

    if (error) return { error: error.message }

    revalidatePath(`/patients/${patientId}`)
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Erreur lors de la mise à jour du dossier' }
  }
}
