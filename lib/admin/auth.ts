import { cookies } from 'next/headers'
import { getSharedAdminUser } from '@/utils/supabase/admin-identity'

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const allowed = (process.env.ADMIN_EMAILS || 'kaneabdel@gmail.com,admin@dembasolution.com,superadmin@dembasolution.com')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  return allowed.includes(email.toLowerCase()) || email.toLowerCase().endsWith('@dembasolution.com')
}

export async function isSuperAdminAuthenticated(): Promise<boolean> {
  // SSO unique partagé entre tous les dashboards superadmin
  const user = await getSharedAdminUser()
  if (user && isAdminEmail(user.email)) {
    return true
  }

  // Repli session locale
  const cookieStore = await cookies()
  const legacyToken = cookieStore.get('d_sante_admin_session')?.value
  return Boolean(legacyToken)
}

export async function getSuperAdminUser() {
  const user = await getSharedAdminUser()
  if (user && isAdminEmail(user.email)) {
    return {
      email: user.email!,
      nom: (user.user_metadata?.full_name as string) || 'SuperAdmin DEMBA Santé',
      role: 'superadmin',
    }
  }

  const isAuth = await isSuperAdminAuthenticated()
  if (!isAuth) return null

  const cookieStore = await cookies()
  const email = cookieStore.get('d_sante_admin_email')?.value || 'superadmin@dembasolution.com'
  return {
    email,
    nom: 'SuperAdmin DEMBA Santé',
    role: 'superadmin',
  }
}
