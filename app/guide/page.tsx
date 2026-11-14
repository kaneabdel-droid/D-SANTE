'use client'

import { GuideAntiScreenshotShield } from "@/components/GuideAntiScreenshotShield";
import { useState } from 'react'
import Link from 'next/link'
import {
  Activity,
  UserCheck,
  Stethoscope,
  HeartPulse,
  QrCode,
  Bed,
  Pill,
  Receipt,
  Search,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react'

export default function GuideDSantePage() {
  const [activeChapter, setActiveChapter] = useState('reception')
  const [searchQuery, setSearchQuery] = useState('')

  const chapters = [
    {
      id: 'reception',
      title: '1. Réception & Dossier Unique',
      icon: UserCheck,
      desc: 'Création du dossier médical, carte patient et affiliation IPM/Assurance',
    },
    {
      id: 'triage',
      title: '2. Triage & Constantes',
      icon: HeartPulse,
      desc: 'Prise des constantes vitales (TA, Pouls, Temp, SpO2) et alertes',
    },
    {
      id: 'consultation',
      title: '3. Consultation Médicale',
      icon: Stethoscope,
      desc: 'Dossier Médical Partagé (DMP), antécédents, allergies et diagnostic CIM-10',
    },
    {
      id: 'ordonnance',
      title: '4. Ordonnance QR & Examens',
      icon: QrCode,
      desc: 'Prescription sécurisée anti-falsification et bons de biologie/radiologie',
    },
    {
      id: 'hospitalisation',
      title: '5. Hospitalisation & Soins',
      icon: Bed,
      desc: 'Gestion des lits, admissions, fiches de suivi et relève infirmière',
    },
    {
      id: 'pharmacie',
      title: '6. Pharmacie & Médicaments',
      icon: Pill,
      desc: 'Délivrance ordonnance, gestion des stocks, alertes péremption et DCI',
    },
    {
      id: 'caisse',
      title: '7. Caisse & Tiers-Payant IPM',
      icon: Receipt,
      desc: 'Facturation, ticket modérateur, bordereaux de prise en charge et clôture',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      <GuideAntiScreenshotShield />
      {/* Top Header */}
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
                Manuel Opérationnel & Clinique
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/decouvrir-dsante"
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Démo interactive
            </Link>
            <Link
              href="/tarifs"
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Tarifs
            </Link>
            <Link
              href="/login"
              className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-600/20"
            >
              Accéder à D-SANTÉ
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Title Bar */}
        <div className="mb-10 text-center max-w-3xl mx-auto space-y-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5" />
            Guide d&apos;utilisation officiel du personnel soignant & administratif
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Maîtrisez D-SANTÉ pas à pas
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Consultez les procédures types pour la gestion des patients, le suivi des constantes, les prescriptions médicales, l&apos;hospitalisation et la télétransmission IPM.
          </p>
        </div>

        {/* Layout with Sidebar & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Chapter Selector */}
          <div className="lg:col-span-4 space-y-2 sticky top-24">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Sommaire des modules
            </div>
            {chapters.map((ch) => {
              const Icon = ch.icon
              const isSelected = activeChapter === ch.id
              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveChapter(ch.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/5'
                      : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                >
                  <div
                    className={`p-2 rounded-xl shrink-0 mt-0.5 ${isSelected
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm leading-snug">{ch.title}</div>
                    <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      {ch.desc}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Detailed Chapter Content */}
          <div className="lg:col-span-8 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8 backdrop-blur-sm">
            {activeChapter === 'reception' && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Module 1 — Accueil & Admission
                  </span>
                  <h2 className="text-2xl font-extrabold text-white mt-1">
                    Réception des patients & Création du Dossier Médical Unique
                  </h2>
                  <p className="text-slate-400 text-sm mt-2">
                    L&apos;accueil est la porte d&apos;entrée de l&apos;établissement. D-SANTÉ attribue à chaque patient un Identifiant National de Santé Unique pour éliminer les doublons de dossiers.
                  </p>
                </div>

                <div className="space-y-4 text-sm text-slate-300">
                  <h3 className="font-bold text-white text-base">
                    Procédure pas-à-pas pour l&apos;agent d&apos;accueil :
                  </h3>
                  <ol className="list-decimal pl-5 space-y-3">
                    <li>
                      <strong className="text-white">Recherche rapide :</strong> Saisissez le numéro de téléphone, le nom ou scannez la carte patient avec code QR. Si le patient existe déjà, son historique s&apos;ouvre instantanément.
                    </li>
                    <li>
                      <strong className="text-white">Création d&apos;un nouveau dossier :</strong> Cliquez sur &quot;Nouveau Patient&quot;, renseignez Nom, Prénoms, Date de naissance, Sexe, Groupe sanguin (si connu), Téléphone et personne à contacter en cas d&apos;urgence.
                    </li>
                    <li>
                      <strong className="text-white">Couverture médicale :</strong> Sélectionnez si le patient est pris en charge (IPM, Mutuelle, Assurances, CMU ou paiement direct). Renseignez le matricule assuré et le taux de couverture (ex: 80%).
                    </li>
                    <li>
                      <strong className="text-white">Orientation :</strong> Envoyez le patient en salle de Triage infirmier ou directement en salle d&apos;attente du médecin référent.
                    </li>
                  </ol>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
                  <div>
                    <span className="font-bold block">Sécurité des données & Secret Médical</span>
                    Les données administratives sont scindées des données médicales. Les agents d&apos;accueil ne peuvent pas consulter les notes cliniques ou diagnostics confidentiels.
                  </div>
                </div>
              </div>
            )}

            {activeChapter === 'triage' && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Module 2 — Soins Infirmiers & Triage
                  </span>
                  <h2 className="text-2xl font-extrabold text-white mt-1">
                    Prise des Constantes Vitales & Évaluation de l&apos;Urgence
                  </h2>
                  <p className="text-slate-400 text-sm mt-2">
                    Le poste de triage infirmier permet de relever les constantes physiologiques et de prioriser les patients selon le score de gravité.
                  </p>
                </div>

                <div className="space-y-4 text-sm text-slate-300">
                  <h3 className="font-bold text-white text-base">
                    Constantes saisies dans D-SANTÉ :
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="font-bold text-white block">Tension Artérielle</span>
                      <span className="text-slate-400">Systole / Diastole (mmHg)</span>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="font-bold text-white block">Température</span>
                      <span className="text-slate-400">Degrés Celsius (°C)</span>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="font-bold text-white block">Fréquence Cardiaque</span>
                      <span className="text-slate-400">Battements par minute (bpm)</span>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="font-bold text-white block">Saturation SpO2</span>
                      <span className="text-slate-400">Pourcentage en oxygène (%)</span>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="font-bold text-white block">Poids & Taille</span>
                      <span className="text-slate-400">Calcul automatique de l&apos;IMC</span>
                    </div>
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                      <span className="font-bold text-white block">Glycémie capillaire</span>
                      <span className="text-slate-400">Grammes par litre (g/L)</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-3 mt-4">
                    <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                    <div>
                      <span className="font-bold block">Alertes automatiques</span>
                      Si une constante dépasse les seuils critiques (ex: TA &gt; 180/110, Fièvre &gt; 39.5°C ou SpO2 &lt; 92%), le dossier passe automatiquement en alerte rouge pour prise en charge médicale prioritaire.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeChapter === 'consultation' && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Module 3 — Espace Praticien
                  </span>
                  <h2 className="text-2xl font-extrabold text-white mt-1">
                    Consultation Médicale & Dossier Médical Partagé (DMP)
                  </h2>
                  <p className="text-slate-400 text-sm mt-2">
                    Le médecin accède à l&apos;historique complet du patient : antécédents médicaux, familiaux, chirurgicaux, statut vaccinal et allergies déclarées.
                  </p>
                </div>

                <div className="space-y-4 text-sm text-slate-300">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                      <div>
                        <strong className="text-white">Motif de consultation & Anamnèse :</strong> Saisie rapide avec modèles pré-remplis par spécialité (Médecine générale, Pédiatrie, Gynécologie, Cardiologie).
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                      <div>
                        <strong className="text-white">Examen clinique :</strong> Synthèse des appareils (cardio-vasculaire, respiratoire, digestif, neurologique, locomoteur).
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                      <div>
                        <strong className="text-white">Codification CIM-10 :</strong> Classification internationale des maladies pour les statistiques épidémiologiques et les rapports au Ministère de la Santé.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeChapter === 'ordonnance' && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Module 4 — Prescriptions & Biologie
                  </span>
                  <h2 className="text-2xl font-extrabold text-white mt-1">
                    Ordonnance Électronique Sécurisée avec Code QR
                  </h2>
                  <p className="text-slate-400 text-sm mt-2">
                    Générez des ordonnances inviolables, conformes aux recommandations pharmaceutiques en Dénomination Commune Internationale (DCI).
                  </p>
                </div>

                <div className="space-y-4 text-sm text-slate-300">
                  <p>
                    Chaque ordonnance émise par D-SANTÉ intègre un QR Code infalsifiable comportant la signature cryptographique du médecin, la date exacte, les posologies prescrites et la durée du traitement.
                  </p>
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <span className="font-bold text-white text-xs uppercase block">
                      Fonctionnalités clés de l&apos;ordonnanceur :
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-400">
                      <li>• Détection automatique des interactions médicamenteuses et contre-indications allergiques.</li>
                      <li>• Calcul automatique des posologies pédiatriques au milligramme par kilo (mg/kg).</li>
                      <li>• Impression instantanée ou envoi par WhatsApp / SMS sécurisé au patient.</li>
                      <li>• Bons de laboratoire (NFS, Paludisme TDR, Créatinine) avec transmission interne directe.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeChapter === 'hospitalisation' && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Module 5 — Service d&apos;Hospitalisation
                  </span>
                  <h2 className="text-2xl font-extrabold text-white mt-1">
                    Gestion des Lits, Admissions & Soins Infirmiers
                  </h2>
                  <p className="text-slate-400 text-sm mt-2">
                    Suivez le taux d&apos;occupation des lits en temps réel, organisez les admissions, les transferts et la relève de garde infirmière.
                  </p>
                </div>

                <div className="space-y-4 text-sm text-slate-300">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                      <div>
                        <strong className="text-white">Plan de lits interactif :</strong> Visualisez d&apos;un coup d&apos;œil les lits occupés, libres, réservés ou en cours de désinfection.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                      <div>
                        <strong className="text-white">Feuille d&apos;administration des médicaments :</strong> Horodatage des injections, perfusions et traitements administrés par les équipes de jour et de nuit.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                      <div>
                        <strong className="text-white">Bulletin de sortie & Lettre de liaison :</strong> Génération automatique du compte-rendu d&apos;hospitalisation au format officiel pour le médecin traitant.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeChapter === 'pharmacie' && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Module 6 — Pharmacie & Dispensiation
                  </span>
                  <h2 className="text-2xl font-extrabold text-white mt-1">
                    Gestion de l&apos;Officine & Délivrance des Médicaments
                  </h2>
                  <p className="text-slate-400 text-sm mt-2">
                    Contrôlez les stocks de la pharmacie centrale, les dotations de services et servez les ordonnances médicales en temps réel.
                  </p>
                </div>

                <div className="space-y-4 text-sm text-slate-300">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                      <div>
                        <strong className="text-white">Scan de l&apos;ordonnance :</strong> Le pharmacien scanne le QR code de l&apos;ordonnance et D-SANTÉ affiche les produits prescrits et décrémente le stock en direct.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                      <div>
                        <strong className="text-white">Suivi des numéros de lot & péremptions :</strong> Alertes automatiques à 90, 60 et 30 jours avant péremption d&apos;un lot de médicaments.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeChapter === 'caisse' && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Module 7 — Caisse & Prise en Charge IPM
                  </span>
                  <h2 className="text-2xl font-extrabold text-white mt-1">
                    Facturation Médicale, Ticket Modérateur & Bordereaux Tiers-Payant
                  </h2>
                  <p className="text-slate-400 text-sm mt-2">
                    Encaissez les consultations, actes chirurgicaux, examens de laboratoire et générez les bordereaux de réclamation pour les assurances et IPM.
                  </p>
                </div>

                <div className="space-y-4 text-sm text-slate-300">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                      <div>
                        <strong className="text-white">Calcul automatique de la part patient / part assureur :</strong> Ex. Sur une consultation à 15 000 FCFA prise en charge à 80%, le patient paie 3 000 FCFA et le reste (12 000 FCFA) est imputé à l&apos;IPM.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                      <div>
                        <strong className="text-white">Multi-moyens de paiement & Reçus officiels :</strong> Espèces, Wave, Orange Money, Carte Bancaire avec reçu imprimé ou SMS.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                      <div>
                        <strong className="text-white">Paiements directs 0% commission (Sans intermédiaire) :</strong> Encaissement direct sur les appareils et comptes marchands de l&apos;établissement (QR Wave direct, Orange Money direct, TPE Carte Bancaire de la clinique). Aucun intermédiaire n&apos;ampute les revenus des consultations et actes médicaux avec des frais de 2% à 3.5%.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                      <div>
                        <strong className="text-white">Bordereaux de facturation groupée :</strong> Export mensuel au format PDF/Excel par IPM (IPM Sonatel, IPM Port, Assurances AXA, Askia, etc.) prêt pour le recouvrement.
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10 px-4 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} DEMBA Solution — D-SANTÉ. Conçu pour les établissements de santé et cliniques modernes.</p>
      </footer>
    </div>
  )
}

