'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { redirect } from 'next/navigation'

export async function signupAction(formData: FormData) {
  const structureNom = (formData.get('structure_nom') as string)?.trim()
  const structureType = (formData.get('structure_type') as string)?.trim() || 'centre'
  const plan = (formData.get('plan') as string)?.trim() || 'clinique'
  const prenom = (formData.get('prenom') as string)?.trim()
  const nom = (formData.get('nom') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const telephone = (formData.get('telephone') as string)?.trim()
  const password = formData.get('password') as string

  if (!structureNom || !email || !password) {
    redirect('/signup?error=Veuillez renseigner le nom de la structure, votre email et mot de passe.')
  }

  const supabase = await createClient()

  // Inscription Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nom,
        prenom,
        telephone,
        structure_nom: structureNom,
        structure_type: structureType,
        plan,
      },
    },
  })

  if (authError) {
    redirect(`/signup?error=${encodeURIComponent(authError.message)}`)
  }

  const userId = authData.user?.id

  // Auto-confirmation immédiate de l'email via le client admin
  if (userId) {
    try {
      const admin = createAdminClient()
      await admin.auth.admin.updateUserById(userId, { email_confirm: true })
    } catch (err) {
      console.warn('Auto-confirmation email santé non-bloquante:', err)
    }
  }

  // Enregistrement admin dans les tables multi-tenant si disponible
  try {
    const admin = createAdminClient()
    const structureCode = `SANTE-${Date.now().toString(36).toUpperCase()}`

    // Création de la structure sanitaire
    const { data: structData } = await admin
      .from('structures_sante')
      .insert({
        nom: structureNom,
        code: structureCode,
        type_structure: structureType,
        telephone,
        email_contact: email,
        subscription_tier: plan,
        statut_abonnement: 'essai',
        essai_expire_le: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      })
      .select('id')
      .maybeSingle()

    const structId = structData?.id

    if (userId && structId) {
      await admin.from('utilisateurs').upsert({
        id: userId,
        structure_id: structId,
        gie_id: structId,
        role: 'directeur',
        nom: nom || structureNom,
        prenom: prenom || 'Responsable',
        telephone,
      })
    }
  } catch (err) {
    console.warn('Erreur non-bloquante création tables structure:', err)
  }

  // Connexion automatique immédiate pour ouvrir la session sans étape manuelle
  try {
    await supabase.auth.signInWithPassword({
      email,
      password,
    })
  } catch (err) {
    console.warn('Connexion automatique post-inscription:', err)
  }

  // Redirection directe vers le tableau de bord
  redirect('/dashboard')
}

