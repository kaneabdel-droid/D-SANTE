import { redirect } from 'next/navigation'
import { getTenantContext } from '@/utils/supabase/tenant'
import ClientLayout from './ClientLayout'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const tenant = await getTenantContext()

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

  return (
    <ClientLayout
      structureName={currentStructure.structureName}
      structureType={currentStructure.structureType}
      role={currentStructure.role}
      subscriptionTier={currentStructure.subscriptionTier}
      devise={currentStructure.devise}
    >
      {children}
    </ClientLayout>
  )
}
