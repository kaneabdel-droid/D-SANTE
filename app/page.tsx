import Link from 'next/link'
import {
  HeartPulse, Activity, UserPlus, Stethoscope, BedDouble,
  Pill, Receipt, ShieldCheck, ArrowRight, CheckCircle2,
  Clock, Sparkles, Building2, Phone, Mail, Award
} from 'lucide-react'

export default function HomePage() {
  const modules = [
    {
      icon: Activity,
      title: 'Triage & Constantes Vitales',
      desc: 'Saisie ultra-rapide des constantes (TA, T°, Pouls, SpO2, Glycémie) avec classification de gravité automatique (Code couleur vert/jaune/orange/rouge).',
      color: 'text-teal-600',
      bg: 'bg-teal-50',
    },
    {
      icon: Stethoscope,
      title: 'Consultations & Dossier Patient',
      desc: 'Dossier médical partagé 360°, anamnèse, diagnostics codifiés CIM-10, prescriptions d\'examens et ordonnances sécurisées.',
      color: 'text-sky-600',
      bg: 'bg-sky-50',
    },
    {
      icon: BedDouble,
      title: 'Hospitalisation & Gestion des Lits',
      desc: 'Plan cartographique des lits par pavillon, admissions, transferts, cahier de surveillance infirmière et résumés de sortie.',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      icon: Pill,
      title: 'Pharmacie Interne & Stocks',
      desc: 'Dépôt de médicaments d\'urgence, traçabilité des lots et dates de péremption, délivrance directe au chevet ou au comptoir.',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      icon: Receipt,
      title: 'Caisse & Tiers-Payant (IPM / CMU)',
      desc: 'Facturation intégrée avec gestion automatique de la part patient (ticket modérateur) et de la part mutuelle/assurance.',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      icon: ShieldCheck,
      title: 'Comptabilité SYSCOHADA',
      desc: 'Livre-Journal conforme, balance, trésorerie et comptes de résultat pour un pilotage financier rigoureux de l\'établissement.',
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
  ]

  const typesStructures = [
    {
      titre: 'Hôpitaux & Centres Hospitaliers',
      desc: 'Multi-pavillons, urgences 24/7, blocs opératoires, admissions massives et régulation médicale.',
      badge: 'CHR / EPS',
    },
    {
      titre: 'Cliniques Privées & Polycliniques',
      desc: 'Chambres VIP/standards, conventions mutuelles/IPM, honoraires praticiens et accueil personnalisé.',
      badge: 'Cliniques',
    },
    {
      titre: 'Centres & Postes de Santé',
      desc: 'Soins primaires, CPN, maternité/accouchements, vaccination PEV, caisse simple et mode hors-ligne.',
      badge: 'Postes de Santé',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header Navigation */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-black font-heading tracking-tight text-foreground flex items-center gap-1.5">
                D-SANTÉ
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  SIH SaaS
                </span>
              </span>
              <p className="text-[10px] text-foreground-muted font-medium">Demba Solution Médicale</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold text-foreground-muted hover:text-foreground px-3 py-2 rounded-xl transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold bg-primary text-white hover:bg-primary-hover px-4 py-2 rounded-xl shadow-md shadow-primary/25 transition-all"
            >
              <span>Accéder à l&apos;Espace Médical</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-surface-border bg-gradient-to-b from-surface via-background to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Système Intégré de Santé pour Hôpitaux, Cliniques & Postes de Santé</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight text-foreground leading-[1.15]">
              Pilotez l&apos;intégralité de vos <span className="text-primary">soins, lits & finances</span> en toute sérénité.
            </h1>

            <p className="text-sm sm:text-lg text-foreground-muted leading-relaxed">
              Du triage d&apos;urgence à l&apos;hospitalisation, de la prescription à la délivrance en pharmacie, 
              avec facturation tiers-payant (IPM, CMU, mutuelles) et comptabilité SYSCOHADA en partie double.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30 hover:bg-primary-hover transition-all"
              >
                <Stethoscope className="w-5 h-5" />
                <span>Ouvrir le Tableau de Bord Soignant</span>
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-surface border border-surface-border text-foreground font-bold text-sm hover:bg-black/5 transition-all"
              >
                <span>Connexion Personnel</span>
              </Link>
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-foreground-muted font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Multi-praticiens & Rôles stricts
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Tiers-Payant & Prises en charge
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Responsive Tablette & Mobile
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Clés */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h2 className="text-2xl sm:text-4xl font-black font-heading text-foreground">
            Une suite hospitalière complète et décloisonnée
          </h2>
          <p className="text-xs sm:text-sm text-foreground-muted">
            Chaque métier de santé dispose d&apos;outils taillés pour sa pratique quotidienne.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m, idx) => {
            const Icon = m.icon
            return (
              <div
                key={idx}
                className="bg-surface rounded-3xl p-6 border border-surface-border shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl ${m.bg} flex items-center justify-center ${m.color} mb-5`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2">{m.title}</h3>
                  <p className="text-xs text-foreground-muted leading-relaxed">{m.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Typologies d'établissements */}
      <section className="py-16 bg-surface/50 border-y border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold font-heading text-foreground">
              Conçu pour toutes les échelles du système de santé
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {typesStructures.map((s, idx) => (
              <div key={idx} className="bg-surface rounded-3xl p-6 border border-surface-border">
                <span className="inline-block px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold text-[11px] mb-3">
                  {s.badge}
                </span>
                <h3 className="text-base font-bold text-foreground mb-2">{s.titre}</h3>
                <p className="text-xs text-foreground-muted leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-surface border-t border-surface-border text-center text-xs text-foreground-muted">
        <p>© {new Date().getFullYear()} Demba Solution - D-SANTÉ. Tous droits réservés.</p>
      </footer>
    </div>
  )
}
