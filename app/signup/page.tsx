import Link from 'next/link'
import { ClientSignupForm } from './ClientSignupForm'
import { HeartPulse, ArrowLeft, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react'

export const metadata = {
  title: 'Créer un Compte Établissement de Santé — D-SANTÉ',
  description: 'Inscrivez votre hôpital, clinique, centre ou poste de santé sur D-Santé. Essai gratuit de 7 jours sans engagement.',
}

export default async function SignupPage(props: {
  searchParams: Promise<{ plan?: string; error?: string; cycle?: string }>
}) {
  const searchParams = await props.searchParams
  const plan = searchParams.plan || 'clinique'
  const error = searchParams.error

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l&apos;accueil</span>
        </Link>

        {/* En-tête */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-xs">
            <HeartPulse className="w-7 h-7 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold font-heading text-foreground">
            Créer votre Structure D-Santé
          </h1>
          <p className="text-xs text-foreground-muted">
            Digitalisez le parcours patient, sécurisez vos caisses et vos ordonnances.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Formulaire */}
        <div className="bg-surface rounded-3xl p-6 sm:p-7 border border-surface-border shadow-xl">
          <ClientSignupForm initialPlan={plan} />
        </div>

        {/* Déjà un compte ? */}
        <div className="text-center text-xs text-foreground-muted space-y-2">
          <p>
            Vous avez déjà un compte ?{' '}
            <Link href="/login" className="font-bold text-primary hover:underline">
              Se connecter
            </Link>
          </p>
          <p className="text-[11px] text-foreground-muted/70">
            D-SANTÉ • Système Hospitalier Intégré de la suite DEMBA Solution
          </p>
        </div>
      </div>
    </div>
  )
}

