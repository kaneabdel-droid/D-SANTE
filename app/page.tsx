import Link from 'next/link'
import {
  HeartPulse, Activity, UserPlus, Stethoscope, BedDouble,
  Pill, Receipt, ShieldCheck, ArrowRight, CheckCircle2,
  Clock, Sparkles, Building2, Phone, Mail, Award, BookOpen,
  Network, Users, Smartphone, WifiOff, FileText, QrCode
} from 'lucide-react'

export default function HomePage() {
  const modules = [
    {
      icon: Activity,
      title: 'Triage & Constantes Vitales',
      desc: 'Saisie ultra-rapide des constantes (TA, T°, Pouls, SpO2, Glycémie, Poids, IMC auto) avec classification de gravité internationale (Rouge / Jaune / Vert).',
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-500/10',
    },
    {
      icon: Stethoscope,
      title: 'Consultations & Dossier Patient 360°',
      desc: 'Dossier Médical Partagé à vie (IPP), anamnèse clinique, diagnostics codifiés CIM-10, bandeau d’alertes allergies et antécédents chroniques.',
      color: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-500/10',
    },
    {
      icon: FileText,
      title: 'Ordonnances Médicales PDF Sécurisées',
      desc: 'Moteur de prescription multi-lignes, génération instantanée d’ordonnances médicales officielles A5 prêtes pour impression ou expédition WhatsApp.',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      icon: BedDouble,
      title: 'Hospitalisation & Gestion des Lits',
      desc: 'Grille d’occupation visuelle des lits par pavillon (Médecine, Chirurgie, Maternité, Soins Intensifs), suivi des séjours et relève soignante.',
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-500/10',
    },
    {
      icon: Pill,
      title: 'Pharmacie Hospitalière & DCI',
      desc: 'Traçabilité stricte des lots, dates de péremption, alertes de rupture et liaison directe avec les officines D-Pharma pour accords de substitution.',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      icon: Receipt,
      title: 'Facturation Tiers-Payant (IPM & CMU)',
      desc: 'Ventilation automatique Ticket modérateur patient (encaissé en espèces/Wave/OM) vs Créance Organisme avec télétransmission de bordereaux.',
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-500/10',
    },
    {
      icon: ShieldCheck,
      title: 'Comptabilité Hospitalière SYSCOHADA',
      desc: 'Livre-Journal à partie double sans superposition d’écritures, Grand Livre, Balance des comptes et pilotage budgétaire conforme OHADA.',
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      icon: WifiOff,
      title: 'Résilience PWA 100% Hors-Ligne',
      desc: 'Conçu pour les postes de santé ruraux et dispensaires isolés : continuez de trier et de consulter sans internet. Synchronisation automatique dès retour du réseau.',
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-500/10',
    },
  ]

  const plansPreview = [
    {
      id: 'poste',
      name: 'Poste de Santé & Dispensaire',
      mensuel: '10 000',
      annuel: '108 000',
      remise: '-10%',
      desc: 'Postes de santé ruraux, dispensaires confessionnels et infirmeries.',
      features: ['Dossier Patient & IPP', 'Triage & Constantes', 'Petite pharmacie', 'Mode PWA Hors-Ligne'],
      badge: 'Poste rural',
    },
    {
      id: 'clinique',
      name: 'Centre de Santé & Clinique',
      mensuel: '12 500',
      annuel: '135 000',
      remise: '-10%',
      desc: 'Cliniques de jour, centres médico-sociaux et maternités urbaines.',
      features: ['Dossier 360° complet', 'Ordonnances PDF A5', 'Lits jusqu’à 30 lits', 'Facturation IPM / CMU', 'Liaison D-Pharma'],
      badge: 'Le plus populaire',
      popular: true,
    },
    {
      id: 'hopital',
      name: 'Hôpital & Polyclinique',
      mensuel: '15 000',
      annuel: '153 000',
      remise: '-15%',
      desc: 'Centres hospitaliers régionaux, polycliniques et cliniques chirurgicales.',
      features: ['Capacité lits illimitée', 'Blocs opératoires', 'Comptabilité SYSCOHADA', 'Télétransmission IPM', 'Portail Espace Patient'],
      badge: 'Multi-services',
    },
  ]

  return (
    <div className="bg-background min-h-screen font-sans text-foreground">
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
                Modules Cliniques
              </a>
              <Link href="/decouvrir-dsante" className="hover:text-primary transition-colors flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Démo Interactive</span>
              </Link>
              <Link href="/guide" className="hover:text-primary transition-colors flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Guide d&apos;utilisation</span>
              </Link>
              <Link href="/tarifs" className="hover:text-primary transition-colors">
                Tarifs & Abonnements
              </Link>
              <Link href="/espace-patient" className="hover:text-primary transition-colors">
                Portail Patient
              </Link>
            </nav>

            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="text-xs font-semibold px-3 py-2 rounded-xl text-foreground hover:bg-surface-hover transition-colors"
              >
                Connexion
              </Link>
              <Link
                href="/signup"
                className="text-xs font-bold px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-hover shadow-sm transition-all flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Créer un compte</span>
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
            Système d&apos;Information Hospitalier & Clinique Nouvelle Génération
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
            Digitalisez le parcours de soins et sécurisez vos recettes de santé
          </h1>

          <p className="text-base sm:text-lg text-foreground-muted max-w-2xl mx-auto leading-relaxed">
            Du grand centre hospitalier au poste de santé rural : suivi médical 360°, triage des urgences, ordonnances PDF sécurisées, gestion des lits, pharmacie et facturation Tiers-Payant (IPM / CMU).
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Démarrer l&apos;essai gratuit (7 jours)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/decouvrir-dsante"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-surface-border bg-surface hover:bg-surface-hover text-foreground font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Tester la Démo en Direct</span>
            </Link>

            <Link
              href="/guide"
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl text-foreground-muted hover:text-foreground text-xs font-bold transition-colors"
            >
              Consulter le Guide Pas-à-Pas
            </Link>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-foreground-muted font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              100% Conforme Secret Médical & Données Santé
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Fonctionne en ligne & hors-ligne (PWA)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Paiement Wave, Orange Money, Cartes & Virement
            </span>
          </div>
        </div>
      </section>

      {/* Modules Cliniques */}
      <section id="modules" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Architecture Complète
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground font-heading">
            Toutes les dimensions de votre structure de santé réunies
          </h2>
          <p className="text-sm text-foreground-muted">
            Un écosystème interconnecté conçu avec les soignants, pharmaciens et administrateurs d&apos;hôpitaux d&apos;Afrique de l&apos;Ouest.
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

      {/* Tarifs & Abonnements */}
      <section className="py-16 lg:py-20 bg-surface/50 border-y border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Tarification Transparente
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground font-heading">
              Des forfaits adaptés à chaque échelle sanitaire
            </h2>
            <p className="text-sm text-foreground-muted">
              Paiement mensuel sans engagement ou remise annuelle immédiate (-10% à -15%).
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
                        FCFA / mois
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold">
                      Ou {p.annuel} FCFA / an ({p.remise} si annuel)
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
                    <span>Choisir {p.name.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
              <span>Voir le comparatif détaillé des fonctionnalités</span>
              <ArrowRight className="w-3.5 h-3.5" />
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
            <span>• Suite DEMBA Solution</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/guide" className="hover:text-foreground">Guide d&apos;utilisation</Link>
            <Link href="/tarifs" className="hover:text-foreground">Tarifs</Link>
            <Link href="/decouvrir-dsante" className="hover:text-foreground">Démo</Link>
            <Link href="/espace-patient" className="hover:text-foreground">Portail Patient</Link>
            <Link href="/login" className="hover:text-foreground">Connexion</Link>
          </div>

          <p>© {new Date().getFullYear()} Demba Solution. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
