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
  UserPlus
} from 'lucide-react'

export default function TarifsDSantePage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly')
  const [contactSubmitted, setContactSubmitted] = useState(false)

  const plans = [
    {
      id: 'poste',
      name: 'Poste de Santé & Dispensaire',
      tagline: 'Pour postes de santé ruraux, dispensaires confessionnels et infirmeries',
      monthlyPrice: 10000,
      annualDiscountPercent: 10,
      capacity: 'Praticiens & 5 lits d’observation',
      popular: false,
      features: [
        'Dossier Médical Informatisé & IPP permanent',
        'Fiche patient complète & carnet de vaccination',
        'Triage & Relevé des constantes vitales (TA, T°, SpO2, Poids)',
        'Gestion de la petite pharmacie & dépôts d’urgence',
        'Caisse recettes journalières espèces & Mobile Money (Wave, OM)',
        'Mode PWA 100% Hors-Ligne (Sync automatique au retour du réseau)',
        'Support technique par WhatsApp & Email (6j/7)',
      ],
      notIncluded: [
        'Ordonnances électroniques certifiées avec QR Code',
        'Module Hospitalisation & plan de lits complet',
        'Télétransmission dématérialisée des IPM et Assurances',
        'Comptabilité SYSCOHADA complète',
      ],
    },
    {
      id: 'clinique',
      name: 'Centre de Santé & Clinique',
      tagline: 'La formule de référence pour cliniques privées, maternités et centres médico-sociaux',
      monthlyPrice: 15000,
      annualDiscountPercent: 10,
      capacity: 'Jusqu’à 15 praticiens & 30 lits d’hospitalisation',
      popular: true,
      features: [
        'Tout ce qui est inclus dans Poste de Santé',
        'Triage infirmier & alertes constantes critiques en temps réel',
        'Consultations spécialisées (Pédiatrie, Gynéco, Médecine générale)',
        'Ordonnances sécurisées infalsifiables avec QR Code & PDF A5',
        'Hospitalisation : suivi des lits, relève de garde & soins infirmiers',
        'Caisse clinique & prise en charge IPM / Assurances privées',
        'Liaison directe D-Pharma (accords de substitution en officine)',
        'Bordereaux de télétransmission mensuels par assureur',
        'Support prioritaire WhatsApp & Téléphone',
      ],
      notIncluded: [
        'Multi-pavillons & blocs opératoires lourds',
        'Comptabilité analytique avancée & Grand Livre SYSCOHADA',
      ],
    },
    {
      id: 'hopital',
      name: 'Hôpital & Polyclinique',
      tagline: 'Pour centres hospitaliers régionaux, polycliniques et réseaux médicaux',
      monthlyPrice: 20000,
      annualDiscountPercent: 15,
      capacity: 'Praticiens, services & lits illimités',
      popular: false,
      features: [
        'Tout ce qui est inclus dans Clinique',
        'Capacité médicale, blocs et lits illimitée',
        'Multi-services (Urgences, Réanimation, Maternité, Bloc, Chirurgie)',
        'Pharmacie hospitalière complète avec traçabilité des lots et DCI',
        'Comptabilité SYSCOHADA intégrée (Journal, Grand Livre, Balance)',
        'Télétransmission dématérialisée IPM / CMU avec suivi d’audit',
        'Portail Espace Patient dédié avec téléchargement d’ordonnances',
        'Gestion biomédicale & maintenance des équipements',
        'Serveur HDS dédié & sauvegardes chiffrées en continu',
        'Account Manager dédié & Assistance clinique 24/7',
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
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors hidden sm:block"
            >
              Découverte & Démo
            </Link>
            <Link
              href="/guide"
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors hidden sm:block"
            >
              Guide d&apos;utilisation
            </Link>
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/signup"
              className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Créer un compte</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Tarifs SaaS Santé équitables, en Francs CFA et adaptés aux réalités locales
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Un abonnement clair pour chaque structure sanitaire
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-base">
          Sans investissement lourd en serveurs locaux. Vos dossiers patients sont protégés, sauvegardés et accessibles en ligne comme hors-ligne.
        </p>

        {/* Toggle billing cycle */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <span
            className={`text-xs font-semibold cursor-pointer ${
              billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'
            }`}
            onClick={() => setBillingCycle('monthly')}
          >
            Facturation Mensuelle
          </span>
          <button
            onClick={() =>
              setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')
            }
            className="w-14 h-7 bg-slate-800 border border-slate-700 rounded-full relative p-1 transition-colors cursor-pointer"
            aria-label="Basculer mensuel / annuel"
          >
            <div
              className={`w-5 h-5 rounded-full bg-emerald-500 transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
          <span
            className={`text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
              billingCycle === 'yearly' ? 'text-white' : 'text-slate-400'
            }`}
            onClick={() => setBillingCycle('yearly')}
          >
            Paiement Annuel
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              Jusqu&apos;à -15% de remise
            </span>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const isYearly = billingCycle === 'yearly'
            const discountMultiplier = isYearly ? (1 - plan.annualDiscountPercent / 100) : 1
            const effectiveMonthlyPrice = Math.round(plan.monthlyPrice * discountMultiplier)
            const totalAnnualPrice = Math.round(plan.monthlyPrice * 12 * (1 - plan.annualDiscountPercent / 100))

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-3xl p-8 border transition-all ${
                  plan.popular
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
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xl font-bold text-white">
                        {plan.name}
                      </h3>
                      {isYearly && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                          -{plan.annualDiscountPercent}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed min-h-[36px] mt-1">
                      {plan.tagline}
                    </p>
                  </div>

                  <div className="mb-6 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-emerald-400">
                        {effectiveMonthlyPrice.toLocaleString('fr-FR')}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">
                        FCFA / mois
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1 font-medium">
                      {isYearly ? (
                        <>
                          <span className="text-emerald-300 font-bold">
                            {totalAnnualPrice.toLocaleString('fr-FR')} FCFA / an
                          </span>{' '}
                          (remise de {plan.annualDiscountPercent}% incluse)
                        </>
                      ) : (
                        'Facturation mensuelle sans engagement'
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      {plan.capacity}
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
                      {plan.notIncluded.map((nf, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-slate-500/70 line-through"
                        >
                          <span className="w-4 h-4 text-center shrink-0 mt-0.5">✕</span>
                          <span>{nf}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 space-y-2">
                  <Link
                    href={`/signup?plan=${plan.id}&cycle=${billingCycle}`}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      plan.popular
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25'
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    <span>Démarrer l&apos;essai gratuit (7 jours)</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  {plan.id === 'hopital' && (
                    <Link
                      href="/decouvrir-dsante"
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-emerald-400 hover:underline"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Tester la démo complète en direct →</span>
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Reassurance */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">
                Essai Gratuit de 7 Jours Sans Engagement
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Aucune carte bancaire requise. Vos données sont préservées lors du passage à l&apos;abonnement.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/signup"
              className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-sm"
            >
              Créer mon établissement
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-10 bg-slate-950 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} D-SANTÉ • Suite DEMBA Solution. Tous droits réservés.</p>
      </footer>
    </div>
  )
}
