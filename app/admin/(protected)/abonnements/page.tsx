import { CreditCard } from 'lucide-react'
import { getPaiementsAbonnementsSanteSuperAdmin } from '@/app/admin/(protected)/actions'
import { AbonnementsSanteClient } from './AbonnementsSanteClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Gestion des Abonnements • SuperAdmin D-SANTÉ',
}

export default async function AdminSanteAbonnementsPage() {
  const initialPaiements = await getPaiementsAbonnementsSanteSuperAdmin()

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <CreditCard className="w-8 h-8 text-emerald-400" />
          Abonnements & Licences D-SANTÉ
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Supervision des règlements Maketou, Chariow, virements bancaires et règlements en caisse avec validation en 1 clic.
        </p>
      </div>

      <AbonnementsSanteClient initialPaiements={initialPaiements} />
    </div>
  )
}
