import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getTenantContext } from '@/utils/supabase/tenant'
import { getDictionary, getLocale } from '@/dictionaries'
import { I18nProvider, type Locale } from '@/lib/i18n'
import ClientLayout from './ClientLayout'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const tenant = await getTenantContext()
  const dict = await getDictionary()
  const locale = (await getLocale()) as Locale

  const cookieStore = await cookies()
  const demoRoleCookie = cookieStore.get('dsante_demo_role')?.value || 'medecin'

  // Structure par défaut si utilisateur en cours d'initialisation
  const currentStructure = tenant || {
    userId: 'demo-user',
    structureId: 'demo-structure',
    gieId: 'demo-structure',
    role: demoRoleCookie,
    permissions: null,
    structureName: 'Polyclinique Demba Santé',
    gieName: 'Polyclinique Demba Santé',
    structureType: 'clinique' as const,
    subscriptionTier: 'hopital',
    devise: 'FCFA',
    compteVerrouille: false,
    essaiExpire: false,
  }

  const isDemo = Boolean(currentStructure.isDemo || !tenant)
  const effectiveRole = isDemo && demoRoleCookie ? demoRoleCookie : currentStructure.role

  return (
    <I18nProvider dict={dict} locale={locale}>
      <ClientLayout
        structureName={currentStructure.structureName}
        structureType={currentStructure.structureType}
        role={effectiveRole}
        subscriptionTier={currentStructure.subscriptionTier}
        devise={currentStructure.devise}
        isDemo={isDemo}
      >
        {children}
      </ClientLayout>
    </I18nProvider>
  )
}
