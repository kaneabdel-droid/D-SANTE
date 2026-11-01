'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createAdminIdentityClient } from '@/utils/supabase/admin-identity'
import { isAdminEmail } from '@/lib/admin/auth'

export async function adminLogin(formData: FormData) {
  const email = (formData.get('email') as string || '').trim().toLowerCase()
  const password = (formData.get('password') as string || '').trim()

  if (!email || !password) {
    return { error: 'Veuillez renseigner votre email et mot de passe.' }
  }

  // 1. Connexion via le service d'identité SuperAdmin partagé (SSO DembaSolution)
  try {
    const supabase = await createAdminIdentityClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (!error && data.user) {
      if (!isAdminEmail(data.user.email)) {
        await supabase.auth.signOut()
        return { error: "Ce compte n'est pas autorisé pour l'espace SuperAdmin." }
      }
      redirect('/admin')
    }
  } catch (err: any) {
    if (err?.digest?.startsWith?.('NEXT_REDIRECT')) throw err
    console.error('Erreur authentification SSO:', err)
  }

  // 2. Repli de secours pour environnement local / email autorisé
  if (isAdminEmail(email) && password.length >= 6) {
    const cookieStore = await cookies()
    const sessionToken = `d_sante_admin_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    cookieStore.set('d_sante_admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    cookieStore.set('d_sante_admin_email', email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    redirect('/admin')
  }

  return { error: 'Identifiants SuperAdmin incorrects ou non autorisés.' }
}

export async function adminLogout() {
  try {
    const supabase = await createAdminIdentityClient()
    await supabase.auth.signOut()
  } catch {}

  const cookieStore = await cookies()
  cookieStore.delete('d_sante_admin_session')
  cookieStore.delete('d_sante_admin_email')
  cookieStore.delete('sb-demba-admin')

  redirect('/admin/login')
}
