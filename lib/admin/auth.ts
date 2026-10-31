import { cookies } from 'next/headers'

export async function isSuperAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get('d_sante_admin_session')?.value
  return Boolean(token)
}

export async function getSuperAdminUser() {
  const cookieStore = await cookies()
  const email = cookieStore.get('d_sante_admin_email')?.value || 'superadmin@dembasolution.com'
  const isAuth = await isSuperAdminAuthenticated()
  if (!isAuth) return null
  return {
    email,
    nom: 'SuperAdmin DEMBA Santé',
    role: 'superadmin',
  }
}
