import { getStructuresSuperAdmin } from '@/app/admin/(protected)/actions'
import { ClientStructuresPage } from './ClientStructuresPage'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Structures Médicales • SuperAdmin D-SANTÉ',
  description: 'Gestion, modifications et suppressions des structures de santé clientes.',
}

export default async function AdminStructuresPage() {
  const structures = await getStructuresSuperAdmin()
  return <ClientStructuresPage initialStructures={structures} />
}
