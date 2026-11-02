import { ParametragePasserelles } from '@/components/admin/ParametragePasserelles'
import { Zap } from 'lucide-react'

export const metadata = {
  title: 'Passerelles Maketou & Chariow • SuperAdmin D-SANTÉ',
}

export default function AdminPasserellesPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-2.5">
          <Zap className="w-7 h-7 text-emerald-400" />
          Passerelles de Paiement • Maketou & Chariow Santé
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Configuration des clés API marchandes, secrets de webhooks et liaisons de produits d&apos;abonnements.
        </p>
      </div>

      <ParametragePasserelles />
    </div>
  )
}
