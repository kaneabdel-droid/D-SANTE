import { ParametragePasserelles } from '@/components/admin/ParametragePasserelles'
import { Zap } from 'lucide-react'

export const metadata = {
  title: 'Passerelles Maketou & Chariow • SuperAdmin D-SANTÉ',
}

export default function AdminPasserellesPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-surface-border pb-5">
        <h1 className="text-2xl font-bold font-heading text-foreground flex items-center gap-2.5">
          <Zap className="w-7 h-7 text-emerald-600" />
          Passerelles de Paiement • Maketou & Chariow Santé
        </h1>
        <p className="mt-1 text-sm text-foreground-muted">
          Configuration des clés API marchandes, secrets de webhooks et liaisons de produits d&apos;abonnements.
        </p>
      </div>

      <ParametragePasserelles />
    </div>
  )
}
