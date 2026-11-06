import { getTenantContext } from '@/utils/supabase/tenant'
import {
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Stethoscope,
  Phone,
} from 'lucide-react'
import PlanSelectorSante from './PlanSelectorSante'

export const dynamic = 'force-dynamic'

export default async function AbonnementPage() {
  const tenant = await getTenantContext()
  const currentTier = tenant?.subscriptionTier || 'clinique'

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--surface-border)] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Stethoscope className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
              Gestion de l&apos;Abonnement D-SANTÉ
            </h1>
          </div>
          <p className="text-sm text-[var(--foreground-muted)]">
            Activez votre licence médicale en ligne via Mobile Money (Wave, Orange Money) ou Carte Bancaire, ou réglez directement par virement ou en caisse.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/221770000000?text=Bonjour,%20je%20souhaite%20renouveler%20mon%20abonnement%20D-SANTE."
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Assistance Facturation Clinique</span>
          </a>
        </div>
      </div>

      {/* Sélecteur et Passerelle de Paiement */}
      <PlanSelectorSante planActuel={currentTier} />

      {/* Rassurance & Passerelles de Paiement */}
      <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--surface-border)] space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Passerelle Sécurisée Maketou avec secours Chariow</span>
        </div>
        <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
          Les paiements en ligne par Mobile Money (Wave Sénégal, Orange Money) et Carte Bancaire (Visa, Mastercard) sont instantanément validés sans webhook externe requis. En cas de règlement en caisse ou par virement bancaire, l&apos;activation est effectuée directement par l&apos;administrateur depuis le SuperAdmin dès réception des fonds.
        </p>
      </div>
    </div>
  )
}
