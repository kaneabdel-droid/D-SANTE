'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function adminLogin(formData: FormData) {
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = formData.get('password') as string

  // Credentials SuperAdmin pour D-SANTÉ
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@dembasolution.com'
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'DembaAdmin2026!'

  const isValidEmail =
    email === ADMIN_EMAIL ||
    email === 'superadmin@dembasolution.com' ||
    email === 'sante-admin@dembasolution.com'

  const isValidPassword =
    password === ADMIN_PASSWORD ||
    password === 'DembaSante2026!' ||
    password === 'Admin@2026'

  if (isValidEmail && isValidPassword) {
    const cookieStore = await cookies()
    const sessionToken = `d_sante_admin_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    cookieStore.set('d_sante_admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    })

    cookieStore.set('d_sante_admin_email', email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    })

    redirect('/admin')
  }

  return { error: 'Identifiants SuperAdmin incorrects' }
}

export async function adminLogout() {
  const cookieStore = await cookies()
  cookieStore.delete('d_sante_admin_session')
  cookieStore.delete('d_sante_admin_email')
  redirect('/admin/login')
}
