import Link from 'next/link'
import {
  HeartPulse,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Activity,
  Pill,
  Receipt,
  UserCheck,
  Sparkles,
} from 'lucide-react'
import { loginAction, enterDemoRoleAction } from './actions'

export default async function LoginPage(props: {
  searchParams: Promise<{ message?: string; error?: string }>
}) {
  const searchParams = await props.searchParams
  const message = searchParams.message
  const error = searchParams.error

  const demoRoles = [
    { role: 'medecin', label: 'Médecin Praticien', desc: 'Consultations & Ordonnances', icon: Stethoscope, color: 'text-teal-600 bg-teal-500/10' },
    { role: 'infirmier', label: 'Infirmier / Triage', desc: 'Constantes & Soins', icon: Activity, color: 'text-rose-600 bg-rose-500/10' },
    { role: 'pharmacien', label: 'Pharmacie Hospitalière', desc: 'Stocks & Dispensation', icon: Pill, color: 'text-amber-600 bg-amber-500/10' },
    { role: 'caissier', label: 'Caisse & Tiers-Payant', desc: 'Facturation & IPM', icon: Receipt, color: 'text-emerald-600 bg-emerald-500/10' },
    { role: 'directeur', label: 'Direction Médicale', desc: 'Pilotage & Comptabilité', icon: UserCheck, color: 'text-sky-600 bg-sky-500/10' },
  ]

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-background text-foreground">
      <div className="w-full max-w-lg bg-surface p-8 rounded-3xl border border-surface-border shadow-xl space-y-6">
        {/* Brand */}
        <div className="text-center">
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
          <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-semibold">
            {error}
          </div>
        )}

        {message && (
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            {message}
          </div>
        )}

        <form action={loginAction} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Email Professionnel, Téléphone ou Identifiant
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
              <input
                type="text"
                name="email"
                required
                placeholder="medecin@hopital.com ou 77 123 45 67"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border-2 border-surface-border bg-white text-xs sm:text-sm text-foreground font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
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
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border-2 border-surface-border bg-white text-xs sm:text-sm text-foreground font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-primary text-white text-xs sm:text-sm font-bold hover:bg-primary-hover shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Se Connecter</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 flex items-center justify-between text-[11px] text-foreground-muted border-t border-surface-border/60">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Accès Praticien Sécurisé</span>
            </span>
            <Link
              href="/signup"
              className="text-primary hover:underline font-bold"
            >
              Créer un compte établissement
            </Link>
          </div>
        </form>

        {/* Accès Démonstration Rapide par Rôles Métier */}
        <div className="pt-6 border-t border-surface-border/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Tester directement selon votre rôle
            </span>
            <span className="text-[10px] text-foreground-muted uppercase tracking-wider font-semibold">
              Sans inscription
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {demoRoles.map((item) => {
              const Icon = item.icon
              return (
                <form key={item.role} action={enterDemoRoleAction}>
                  <input type="hidden" name="role" value={item.role} />
                  <button
                    type="submit"
                    className="w-full p-2.5 rounded-xl border border-surface-border bg-surface-muted/30 hover:bg-surface-muted hover:border-primary/40 text-left transition-all flex items-center gap-2.5 cursor-pointer group"
                  >
                    <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors block truncate">
                        {item.label}
                      </span>
                      <span className="text-[10px] text-foreground-muted block truncate">
                        {item.desc}
                      </span>
                    </div>
                  </button>
                </form>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
