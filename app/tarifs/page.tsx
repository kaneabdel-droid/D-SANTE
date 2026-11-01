'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Check,
  Sparkles,
  ShieldCheck,
  Building2,
  PhoneCall,
  Mail,
  ArrowRight,
  Activity,
  HeartPulse,
} from 'lucide-react'

export default function TarifsDSantePage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly')
  const [contactSubmitted, setContactSubmitted] = useState(false)

  const discount = billingCycle === 'yearly' ? 0.85 : 1 // 15% discount on annual

  const plans = [
    {
      id: 'poste',
      name: 'Poste & Dispensaire',
      tagline: 'Pour postes de santé ruraux, dispensaires confessionnels et petits cabinets',
      basePrice: 25000,
      capacity: 'Jusqu’à 2 soignants & 5 lits d’observation',
      popular: false,
      features: [
        'Dossier Médical Informatisé (DPI de base)',
        'Fiche d’état civil & carnet de vaccination',
        'Registre des consultations infirmières',
        'Relevé des constantes vitales (TA, T°, Poids)',
        'Gestion de la petite pharmacie de dispensaire',
        'Caisse recettes journalières espèces & Mobile Money',
        'Support technique par email (6j/7)',
      ],
      notIncluded: [
        'Triage automatique avec alertes de gravité',
        'Ordonnances électroniques certifiées avec QR Code',
        'Module Hospitalisation & plan de lits complet',
        'Prise en charge automatisée des IPM et Assurances',
      ],
    },
    {
      id: 'clinique',
      name: 'Clinique & Centre Médical',
      tagline: 'La formule de référence pour cliniques privées, maternités et centres médico-sociaux',
      basePrice: 65000,
      capacity: 'Jusqu’à 15 praticiens & 30 lits d’hospitalisation',
      popular: true,
      features: [
        'Tout ce qui est inclus dans Poste & Dispensaire',
        'Triage infirmier & alertes constantes critiques en temps réel',
        'Consultations spécialisées (Pédiatrie, Gynéco, Cardio...)',
        'Ordonnances sécurisées infalsifiables avec QR Code',
        'Hospitalisation : suivi des lits, relève de garde & soins',
        'Caisse clinique & prise en charge IPM / Assurances privées',
        'Bordereaux de télétransmission mensuels par assureur',
        'Support prioritaire WhatsApp & Téléphone',
      ],
      notIncluded: [
        'Réseau multi-sites consolidé',
        'Exports comptables SYSCOHADA certifiés automatisés',
      ],
    },
    {
      id: 'hopital',
      name: 'Hôpital & Polyclinique',
      tagline: 'Pour hôpitaux régionaux, polycliniques et réseaux de centres de santé',
      basePrice: 150000,
      capacity: 'Praticiens, services & lits illimités',
      popular: false,
      features: [
        'Tout ce qui est inclus dans Clinique',
        'Capacité médicale, blocs et lits illimitée',
        'Multi-services (Urgences, Réanimation, Maternité, Bloc)',
        'Pharmacie hospitalière complète avec traçabilité des lots et DCI',
        'Intégration directe comptabilité SYSCOHADA & analytique',
        'Gestion avancée des conventions IPM, CMU et tiers-payant',
        'Serveur HDS dédié & sauvegardes chiffrées en continu',
        'Account Manager dédié & Assistance clinique sur site 24/7',
      ],
      notIncluded: [],
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-emerald-500/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white block">
                D-SANTÉ
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold tracking-widest uppercase">
                Plateforme Clinique & Hospitalière
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/decouvrir-dsante"
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Découverte & Démo
            </Link>
            <Link
              href="/guide"
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Guide d&apos;utilisation
            </Link>
            <Link
              href="/login"
              className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-600/20"
            >
              Connexion
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Tarifs SaaS Santé transparents et adaptés aux réalités locales
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Un abonnement clair pour chaque structure sanitaire
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-base">
          Sans investissement lourd en serveurs locaux. Vos données médicales sont hébergées en conformité Secret Médical et accessibles en continu.
        </p>

        {/* Toggle billing cycle */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <span
            className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'
              }`}
          >
            Mensuel
          </span>
          <button
            onClick={() =>
              setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')
            }
            className="w-14 h-7 bg-slate-800 border border-slate-700 rounded-full relative p-1 transition-colors"
          >
            <div
              className={`w-5 h-5 rounded-full bg-emerald-500 transition-transform ${billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'
                }`}
            />
          </button>
          <span
            className={`text-xs font-semibold flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-400'
              }`}
          >
            Annuel
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              -15%
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const finalPrice = Math.round(plan.basePrice * discount)
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-3xl p-8 border transition-all ${plan.popular
                    ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-emerald-500 shadow-2xl shadow-emerald-500/10 ring-1 ring-emerald-500/50'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-extrabold uppercase tracking-wider shadow-lg">
                    Recommandé
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
                      {plan.tagline}
                    </p>
                  </div>

                  <div className="mb-6 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-emerald-400">
                        {finalPrice.toLocaleString('fr-FR')}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">
                        FCFA / mois
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {billingCycle === 'yearly'
                        ? 'Facturé annuellement'
                        : 'Sans engagement'}{' '}
                      • {plan.capacity}
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Inclus dans cette formule :
                    </span>
                    <ul className="space-y-2.5 text-xs text-slate-300">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.notIncluded.length > 0 && (
                      <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-500">
                        {plan.notIncluded.map((nf, i) => (
                          <li key={i} className="flex items-center gap-2 list-none">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                            <span>{nf}</span>
                          </li>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <a
                  href="#commander"
                  className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${plan.popular
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                >
                  Choisir cette formule
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )
          })}
        </div>
      </div>

      {/* Order & Contact Form */}
      <section id="commander" className="max-w-4xl mx-auto px-4 sm:px-6 pb-20 scroll-mt-24">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Demande de souscription ou pilote clinique
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-xl mx-auto">
              Nos consultants santé déploient D-SANTÉ, paramètrent vos conventions IPM et forment vos équipes médicales et soignantes.
            </p>
          </div>

          {contactSubmitted ? (
            <div className="p-8 text-center bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-3">
              <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">
                Demande transmise à notre pôle Médical !
              </h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto">
                Un référent santé DEMBA prendra contact avec votre direction médicale sous 2 heures pour organiser le déploiement.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setContactSubmitted(true)
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nom de l&apos;établissement médical
                  </label>
                  <input
                    required
                    placeholder="Ex: Clinique Médicale Sainte-Marie"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Ville & Région
                  </label>
                  <input
                    required
                    placeholder="Ex: Dakar, Thiès, Ziguinchor..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Responsable / Médecin-Chef
                  </label>
                  <input
                    required
                    placeholder="Dr. Prénom Nom"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Téléphone / WhatsApp
                  </label>
                  <input
                    required
                    placeholder="+221 77 000 00 00"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nombre de lits
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Ex: 20"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Besoins spécifiques ou IPM conventionnées
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Prise en charge IPM Sonatel, AXA, tiers-payant, ordonnances sécurisées..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2"
              >
                Valider ma demande de déploiement
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              +221 77 626 50 51
            </span>
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400" />
              sante@dembasolution.com
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10 px-4 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} DEMBA Solution — D-SANTÉ. Tous droits réservés.</p>
      </footer>
    </div>
  )
}

