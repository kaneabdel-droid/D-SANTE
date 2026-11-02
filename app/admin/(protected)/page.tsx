import { SuperAdminDashboardClient } from '@/components/admin/SuperAdminDashboardClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'SuperAdmin Dashboard Médical • D-SANTÉ',
  description: 'Gestion centrale des structures médicales et passerelles Maketou et Chariow.',
}

export default function AdminDashboardPage() {
  return <SuperAdminDashboardClient />
}
