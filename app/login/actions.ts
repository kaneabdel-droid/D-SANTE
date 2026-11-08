'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function loginAction(formData: FormData) {
  const rawIdentifier = ((formData.get('email') as string) || (formData.get('identifier') as string) || '')?.trim()
  const password = (formData.get('password') as string) || ''

  if (!rawIdentifier || !password) {
    redirect('/login?error=Veuillez renseigner votre email ou identifiant et mot de passe.')
  }

  let resolvedEmail = rawIdentifier

  // Si c'est un numéro de téléphone ou un identifiant sans @
  if (!rawIdentifier.includes('@')) {
    try {
      const admin = createAdminClient()
      const { data: userRow } = await admin
        .from('utilisateurs')
        .select('id, telephone')
        .eq('telephone', rawIdentifier)
        .maybeSingle()

      if (userRow?.id) {
        const { data: authUser } = await admin.auth.admin.getUserById(userRow.id)
        if (authUser?.user?.email) {
          resolvedEmail = authUser.user.email
        }
      }
    } catch (e) {
      console.warn('Résolution identifiant santé:', e)
    }
  }

  const supabase = await createClient()
  let { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: resolvedEmail,
    password,
  })

  // Auto-confirmation de l'email si l'utilisateur vient de s'inscrire
  if (authError && authError.message.toLowerCase().includes('email not confirmed')) {
    try {
      const admin = createAdminClient()
      const { data: usersData } = await admin.auth.admin.listUsers()
      const foundUser = usersData?.users.find((u) => u.email?.toLowerCase() === resolvedEmail.toLowerCase())
      if (foundUser) {
        await admin.auth.admin.updateUserById(foundUser.id, { email_confirm: true })
        const retry = await supabase.auth.signInWithPassword({
          email: resolvedEmail,
          password,
        })
        authData = retry.data
        authError = retry.error
      }
    } catch (e) {
      console.warn('Auto-confirmation email lors du login santé:', e)
    }
  }

  if (authError) {
    if (authError.message.includes('Invalid login credentials')) {
      redirect('/login?error=Identifiant ou mot de passe incorrect.')
    }
    redirect(`/login?error=${encodeURIComponent(authError.message)}`)
  }

  redirect('/dashboard')
}

export async function enterDemoRoleAction(formData: FormData) {
  const role = (formData.get('role') as string) || 'medecin'
  const cookieStore = await cookies()
  cookieStore.set('dsante_demo_session', '1', { path: '/', maxAge: 86400, sameSite: 'lax' })
  cookieStore.set('dsante_demo_role', role, { path: '/', maxAge: 86400, sameSite: 'lax' })

  if (role === 'infirmier') redirect('/triage')
  if (role === 'pharmacien') redirect('/pharmacie')
  if (role === 'caissier') redirect('/facturation')
  redirect('/dashboard')
}
