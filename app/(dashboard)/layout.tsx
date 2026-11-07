import { redirect } from 'next/navigation'
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

  // Structure par défaut si utilisateur en cours d'initialisation
  const currentStructure = tenant || {
    userId: 'demo-user',
    structureId: 'demo-structure',
    gieId: 'demo-structure',
    role: 'medecin',
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

  return (
    <I18nProvider dict={dict} locale={locale}>
      <ClientLayout
        structureName={currentStructure.structureName}
        structureType={currentStructure.structureType}
        role={currentStructure.role}
        subscriptionTier={currentStructure.subscriptionTier}
        devise={currentStructure.devise}
        isDemo={isDemo}
      >
        {children}
      </ClientLayout>
    </I18nProvider>
  )
}
