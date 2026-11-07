import Link from 'next/link'
import {
  HeartPulse, Activity, UserPlus, Stethoscope, BedDouble,
  Pill, Receipt, ShieldCheck, ArrowRight, CheckCircle2,
  Clock, Sparkles, Building2, Phone, Mail, Award, BookOpen,
  Network, Users, Smartphone, WifiOff, FileText, QrCode
} from 'lucide-react'
import { getDictionary, getLocale } from '@/dictionaries'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

export default async function HomePage() {
  const locale = await getLocale()
  const dict = await getDictionary(locale)
  const isRtl = locale === 'ar'
  const t = dict.landing
  const ab = dict.abonnement

  const modules = [
    {
      icon: Activity,
      title: t.modules_items.triage.title,
      desc: t.modules_items.triage.desc,
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-500/10',
    },
    {
      icon: Stethoscope,
      title: t.modules_items.consultations.title,
      desc: t.modules_items.consultations.desc,
      color: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-500/10',
    },
    {
      icon: FileText,
      title: t.modules_items.ordonnances.title,
      desc: t.modules_items.ordonnances.desc,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      icon: BedDouble,
      title: t.modules_items.hospitalisation.title,
      desc: t.modules_items.hospitalisation.desc,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-500/10',
    },
    {
      icon: Pill,
      title: t.modules_items.pharmacie.title,
      desc: t.modules_items.pharmacie.desc,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      icon: Receipt,
      title: t.modules_items.facturation.title,
      desc: t.modules_items.facturation.desc,
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-500/10',
    },
    {
      icon: ShieldCheck,
      title: t.modules_items.comptabilite.title,
      desc: t.modules_items.comptabilite.desc,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      icon: WifiOff,
      title: t.modules_items.resilience.title,
      desc: t.modules_items.resilience.desc,
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-500/10',
    },
  ]

  const plansPreview = [
    {
      id: 'poste',
      name: ab.plans.poste_sante.nom,
      mensuel: '10 000',
      annuel: '108 000',
      remise: '-10%',
      desc: ab.plans.poste_sante.desc,
      features: ab.plans.poste_sante.features,
      badge: 'Poste rural',
    },
    {
      id: 'clinique',
      name: ab.plans.clinique.nom,
      mensuel: '15 000',
      annuel: '162 000',
      remise: '-10%',
      desc: ab.plans.clinique.desc,
      features: ab.plans.clinique.features,
      badge: ab.recommended,
      popular: true,
    },
    {
      id: 'hopital',
      name: ab.plans.hopital.nom,
      mensuel: '20 000',
      annuel: '204 000',
      remise: '-15%',
      desc: ab.plans.hopital.desc,
      features: ab.plans.hopital.features,
      badge: 'Multi-services',
    },
  ]

  return (
    <div className={`bg-background min-h-screen font-sans text-foreground ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Navbar Supérieure */}
      <header className="sticky top-0 z-50 w-full border-b border-surface-border bg-surface/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-xs">
                <HeartPulse className="w-6 h-6 animate-pulse" />
              </span>
              <span className="text-xl sm:text-2xl font-bold font-heading text-primary tracking-wide">
                D-SANTÉ
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-foreground-muted">
              <a href="#modules" className="hover:text-primary transition-colors">
                {t.nav_modules}
              </a>
              <Link href="/decouvrir-dsante" className="hover:text-primary transition-colors flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>{t.nav_demo}</span>
              </Link>
              <Link href="/guide" className="hover:text-primary transition-colors flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t.nav_guide}</span>
              </Link>
              <Link href="/tarifs" className="hover:text-primary transition-colors">
                {t.nav_pricing}
              </Link>
              <Link href="/espace-patient" className="hover:text-primary transition-colors">
                {t.nav_patient_portal}
              </Link>
            </nav>

            <div className="flex items-center gap-2.5">
              <LanguageSwitcher />
              <Link
                href="/login"
                className="text-xs font-semibold px-3 py-2 rounded-xl text-foreground hover:bg-surface-hover transition-colors"
              >
                {t.nav_login}
              </Link>
              <Link
                href="/signup"
                className="text-xs font-bold px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-hover shadow-sm transition-all flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{t.nav_signup}</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-surface-border bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            {t.hero_badge}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
            {t.hero_title}
          </h1>

          <p className="text-base sm:text-lg text-foreground-muted max-w-2xl mx-auto leading-relaxed">
            {t.hero_subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
            >
              <span>{t.hero_btn_trial}</span>
              <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>

            <Link
              href="/decouvrir-dsante"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-surface-border bg-surface hover:bg-surface-hover text-foreground font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span>{t.hero_btn_demo}</span>
            </Link>

            <Link
              href="/guide"
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl text-foreground-muted hover:text-foreground text-xs font-bold transition-colors"
            >
              {t.hero_btn_guide}
            </Link>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-foreground-muted font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {t.reassurance_1}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {t.reassurance_2}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {t.reassurance_3}
            </span>
          </div>
        </div>
      </section>

      {/* Modules Cliniques */}
      <section id="modules" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            D-SANTÉ
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground font-heading">
            {t.modules_title}
          </h2>
          <p className="text-sm text-foreground-muted">
            {t.modules_subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((m, idx) => (
            <div
              key={idx}
              className="bg-surface rounded-3xl p-6 border border-surface-border shadow-xs hover:border-primary/40 hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className={`w-12 h-12 rounded-2xl ${m.bg} flex items-center justify-center`}>
                  <m.icon className={`w-6 h-6 ${m.color}`} />
                </div>
                <h3 className="text-base font-bold text-foreground font-heading">
                  {m.title}
                </h3>
                <p className="text-xs text-foreground-muted leading-relaxed">
                  {m.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Démo Interactive Médicale Callout */}
      <section className="py-16 bg-gradient-to-b from-primary/5 via-surface to-background border-t border-surface-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-teal-500/10 via-surface to-emerald-500/10 border-2 border-primary/20 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
            <div className="space-y-3 max-w-xl">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10">
                Simulateur Clinique en Ligne
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground font-heading">
                Testez D-SANTÉ directement sans inscription
              </h3>
              <p className="text-xs sm:text-sm text-foreground-muted leading-relaxed">
                Expérimentez en direct le triage des constantes, la consultation avec anamnèse CIM-10, la génération instantanée d&apos;ordonnances PDF A5 et l&apos;accord de substitution interopérable avec D-Pharma.
              </p>
            </div>
            <Link
              href="/decouvrir-dsante"
              className="px-6 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider shrink-0 flex items-center gap-2 shadow-md shadow-primary/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.nav_demo}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Tarifs & Abonnements */}
      <section className="py-16 lg:py-20 bg-surface/50 border-y border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              {t.nav_pricing}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground font-heading">
              {t.plans_title}
            </h2>
            <p className="text-sm text-foreground-muted">
              {t.plans_subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plansPreview.map((p) => (
              <div
                key={p.id}
                className={`bg-surface rounded-3xl p-7 border-2 transition-all flex flex-col justify-between relative ${
                  p.popular
                    ? 'border-primary shadow-xl ring-1 ring-primary/20'
                    : 'border-surface-border shadow-sm'
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    {p.badge}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground font-heading">
                      {p.name}
                    </h3>
                    <p className="text-xs text-foreground-muted mt-1 min-h-[32px]">
                      {p.desc}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-background border border-surface-border/70 space-y-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-primary">
                        {p.mensuel}
                      </span>
                      <span className="text-xs font-bold text-foreground-muted">
                        FCFA / {ab.month}
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold">
                      Ou {p.annuel} FCFA / {ab.year} ({p.remise})
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs text-foreground">
                    {p.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-surface-border mt-6">
                  <Link
                    href={`/signup?plan=${p.id}`}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      p.popular
                        ? 'bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/20'
                        : 'bg-surface-hover hover:bg-surface-border text-foreground border border-surface-border'
                    }`}
                  >
                    <span>{t.btn_choose_plan}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/tarifs"
              className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
            >
              <span>{t.nav_pricing}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-surface border-t border-surface-border text-xs text-foreground-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
              <HeartPulse className="w-4 h-4" />
            </span>
            <span className="font-bold text-foreground">D-SANTÉ</span>
            <span>• DEMBA Healthcare Suite</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/guide" className="hover:text-foreground">{t.nav_guide}</Link>
            <Link href="/tarifs" className="hover:text-foreground">{t.nav_pricing}</Link>
            <Link href="/decouvrir-dsante" className="hover:text-foreground">{t.nav_demo}</Link>
            <Link href="/espace-patient" className="hover:text-foreground">{t.nav_patient_portal}</Link>
            <Link href="/login" className="hover:text-foreground">{t.nav_login}</Link>
          </div>

          <p>© {new Date().getFullYear()} Demba Solution.</p>
        </div>
      </footer>
    </div>
  )
}
