import Link from 'next/link'
import { CheckCircle2, ArrowRight, HeartPulse } from 'lucide-react'

export default function CheckoutRetourPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
      <div className="bg-surface max-w-md w-full p-8 rounded-3xl border border-surface-border shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 animate-bounce" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black font-heading text-foreground">
            Abonnement Confirmé !
          </h2>
          <p className="text-xs text-foreground-muted leading-relaxed">
            Votre paiement Mobile Money / Carte a été validé avec succès. Votre établissement de santé bénéficie désormais de l&apos;ensemble des fonctionnalités de son forfait.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="w-full py-3.5 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-primary-hover shadow-md shadow-primary/25 transition-all inline-flex items-center justify-center gap-2"
        >
          <span>Accéder au Tableau de Bord</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}

