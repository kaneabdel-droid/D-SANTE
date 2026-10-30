import Link from 'next/link'
import { HeartPulse, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react'
import { loginAction } from './actions'

export default async function LoginPage(props: {
  searchParams: Promise<{ message?: string; error?: string }>
}) {
  const searchParams = await props.searchParams
  const message = searchParams.message
  const error = searchParams.error

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-background text-foreground">
      <div className="w-full max-w-md bg-surface p-8 rounded-3xl border border-surface-border shadow-xl">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto mb-3 shadow-md shadow-primary/25">
            <HeartPulse className="w-7 h-7 animate-pulse" />
          </div>
          <h2 className="text-2xl font-black font-heading tracking-tight text-foreground">
            D-SANTÉ
          </h2>
          <p className="text-xs text-foreground-muted mt-1">
            Système Intégré de Soins & Gestion Hospitalière
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-semibold">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            {message}
          </div>
        )}

        <form action={loginAction} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Adresse Email Professionnelle
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
              <input
                type="email"
                name="email"
                required
                placeholder="medecin@hopital.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-surface-border bg-background text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-surface-border bg-background text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-primary text-white text-xs sm:text-sm font-bold hover:bg-primary-hover shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Se Connecter</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-surface-border/60 text-center">
          <Link
            href="/dashboard"
            className="text-xs font-bold text-primary hover:underline"
          >
            → Entrer directement en mode Démonstration Soignant
          </Link>
        </div>
      </div>
    </div>
  )
}
