'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function loginAction(formData: FormData) {
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string

  if (!email || !password) {
    redirect('/login?error=Veuillez renseigner votre email et mot de passe.')
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
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
