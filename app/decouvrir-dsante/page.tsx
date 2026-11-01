'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Activity,
  HeartPulse,
  Stethoscope,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Receipt,
  Bed,
  Sparkles,
  ArrowRight,
  Play,
  RotateCcw,
  User,
  AlertTriangle,
  Building2,
  FileText,
  Pill,
} from 'lucide-react'

export default function DecouvrirDSantePage() {
  const [activeTab, setActiveTab] = useState<'dpi' | 'triage' | 'ordo' | 'hospit' | 'ipm'>('dpi')

  // Interactive Patient Simulator State
  const [patientName, setPatientName] = useState('Mamadou Diop')
  const [patientAge, setPatientAge] = useState(42)
  const [patientGender, setPatientGender] = useState('M')
  const [taSystole, setTaSystole] = useState(135)
  const [taDiastole, setTaDiastole] = useState(85)
  const [temperature, setTemperature] = useState(37.2)
  const [spo2, setSpo2] = useState(98)
  const [hasAssurance, setHasAssurance] = useState(true)
  const [assuranceRate, setAssuranceRate] = useState(80)
  const [diagnostic, setDiagnostic] = useState('Paludisme simple & HTA modérée')

  const consultationCost = 15000
  const laboCost = 12000
  const totalActes = consultationCost + laboCost
  const partAssurance = hasAssurance ? (totalActes * assuranceRate) / 100 : 0
  const partPatient = totalActes - partAssurance

  const isTaAlert = taSystole >= 140 || taDiastole >= 90
  const isTempAlert = temperature >= 38.5

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
              href="/guide"
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Guide d&apos;utilisation
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
              Connexion Praticien
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <div className="w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl opacity-50" />
          <div className="w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-3xl opacity-30" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Système d&apos;Information Médicale et Hospitalière Intégré
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Digitalisez vos soins avec le logiciel médical{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              le plus intuitif d&apos;Afrique
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Dossier Patient Informatisé (DPI), constantes vitales en temps réel, ordonnances sécurisées par QR Code, gestion des lits et tiers-payant IPM automatisé.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#demo-interactive"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/25 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              Lancer la consultation virtuelle (Démo)
            </a>
            <Link
              href="/tarifs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 font-semibold text-sm transition-all"
            >
              Voir les forfaits cliniques
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Tabs of modules */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('dpi')}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'dpi'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            Dossier Patient & DMP
          </button>
          <button
            onClick={() => setActiveTab('triage')}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'triage'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            Triage & Constantes
          </button>
          <button
            onClick={() => setActiveTab('ordo')}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'ordo'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <QrCode className="w-4 h-4" />
            Ordonnance QR Code
          </button>
          <button
            onClick={() => setActiveTab('hospit')}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'hospit'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Bed className="w-4 h-4" />
            Lits & Hospitalisation
          </button>
          <button
            onClick={() => setActiveTab('ipm')}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'ipm'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Receipt className="w-4 h-4" />
            Tiers-Payant IPM & Caisse
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="mt-8 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-sm">
          {activeTab === 'dpi' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Dossier Médical Informatisé
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  Historique médical complet et sécurisé en un clic
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Fini la perte des carnets de santé en papier. Retrouvez instantanément tous les antécédents, allergies médicamenteuses, bilans biologiques et consultations passées avec recherche par numéro de téléphone ou scan QR.
                </p>
                <ul className="space-y-2.5 text-sm text-slate-300 pt-2">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Identifiant National de Santé Unique pour chaque patient
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Alertes allergies et intolérances médicamenteuses
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Historique chronologique des examens et ordonnances
                  </li>
                </ul>
              </div>
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                  <span className="font-bold text-white">Dossier #SN-2026-08412</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                    Actif
                  </span>
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Patient :</span>
                    <span className="font-bold text-white">M. Ousmane Ndiaye (34 ans)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Groupe Sanguin :</span>
                    <span className="font-bold text-rose-400">O Positif (O+)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Allergies déclarées :</span>
                    <span className="font-bold text-amber-400">Pénicilline, AINS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assurance :</span>
                    <span className="font-bold text-emerald-400">IPM Sonatel (Prise en charge 80%)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'triage' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Poste Infirmier
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  Triage automatique & Détection précoce des urgences
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  L&apos;infirmier(e) d&apos;accueil saisit la tension artérielle, le pouls, la température, la glycémie et la SpO2. D-SANTÉ calcule le score de gravité et signale immédiatement au médecin les cas d&apos;urgence vitale.
                </p>
                <ul className="space-y-2.5 text-sm text-slate-300 pt-2">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Classification colorimétrique des urgences (Vert, Jaune, Rouge)
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Courbes d&apos;évolution graphique des constantes dans le temps
                  </li>
                </ul>
              </div>
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase">Salle de Triage (En attente)</div>
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-rose-300 text-xs">Alerte Rouge : TA 185/110 mmHg</span>
                    <p className="text-[11px] text-slate-400">Patiente Mme Fatou Sow (58 ans) — Salle 1</p>
                  </div>
                  <span className="px-2 py-1 rounded bg-rose-500 text-slate-950 text-[10px] font-extrabold uppercase">
                    Urgent
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ordo' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Sécurité Thérapeutique
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  Ordonnance électronique inviolable avec QR Code
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Éliminez les falsifications de prescriptions et les erreurs de posologie. Chaque ordonnance est signée numériquement et peut être scannée par n&apos;importe quelle pharmacie pour vérifier son authenticité.
                </p>
                <ul className="space-y-2.5 text-sm text-slate-300 pt-2">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Base médicamenteuse DCI avec posologies recommandées
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Alerte contre les interactions et doublons médicamenteux
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Envoi instantané par WhatsApp au patient
                  </li>
                </ul>
              </div>
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
                <div className="w-24 h-24 bg-white rounded-xl p-2 flex items-center justify-center shrink-0">
                  <QrCode className="w-full h-full text-slate-950" />
                </div>
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-white block">Ordonnance Certifiée #ORD-2026-991</span>
                  <p className="text-slate-400">Dr. Abdoulaye Ba — Médecine Générale</p>
                  <p className="text-emerald-400 font-semibold">Signature Cryptographique Valide</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hospit' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Plateau Technique
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  Gestion des Lits & Fiches de Transmission Infirmière
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Supervisez en un coup d&apos;œil l&apos;occupation des chambres (libres, occupées, désinfection). Les infirmiers de garde tracent les perfusions, injections et constantes heure par heure.
                </p>
                <ul className="space-y-2.5 text-sm text-slate-300 pt-2">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Plan de lits interactif avec durée de séjour prévisionnelle
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Fiches de relève infirmière dématérialisées
                  </li>
                </ul>
              </div>
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Occupation Service Médecine</span>
                  <span className="text-emerald-400 font-bold">14 / 16 lits occupés (88%)</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {['Lit 101', 'Lit 102', 'Lit 103', 'Lit 104'].map((l, i) => (
                    <div
                      key={l}
                      className={`p-2.5 rounded-xl border text-center font-bold ${
                        i === 3
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-slate-900 border-slate-800 text-slate-200'
                      }`}
                    >
                      {l}
                      <span className="block text-[10px] font-normal text-slate-400">
                        {i === 3 ? 'Libre' : 'Occupé'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ipm' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Facturation & Assurance
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  Tiers-Payant IPM automatisé & Zéro Rejet de Facture
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Finis les calculs manuels et les litiges de recouvrement avec les IPM et compagnies d&apos;assurance. D-SANTÉ ventile instantanément la part assurée et le ticket modérateur et édite les bordereaux mensuels certifiés.
                </p>
                <ul className="space-y-2.5 text-sm text-slate-300 pt-2">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Prise en charge IPM, Assurances privées et CMU
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Bordereaux récapitulatifs mensuels prêts pour le recouvrement
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Encaissement Wave, Orange Money et Espèces
                  </li>
                </ul>
              </div>
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
                  <span className="font-bold text-white">Décompte Tiers-Payant #FC-8921</span>
                  <span className="text-emerald-400 font-bold">IPM SONATEL</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Total Soins & Consultation :</span>
                    <span>27 000 FCFA</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Part IPM (80%) :</span>
                    <span>21 600 FCFA</span>
                  </div>
                  <div className="flex justify-between text-white font-bold pt-2 border-t border-slate-800">
                    <span>Ticket Modérateur Patient (20%) :</span>
                    <span className="text-amber-400">5 400 FCFA</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Interactive Simulator Section */}
      <section id="demo-interactive" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-emerald-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Simulateur de Consultation Clinique
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Simulez une consultation patient en direct
              </h2>
              <p className="text-slate-400 text-sm">
                Ajustez les constantes, observez les alertes en direct et générez l&apos;ordonnance certifiée.
              </p>
            </div>
            <button
              onClick={() => {
                setPatientName('Mamadou Diop')
                setPatientAge(42)
                setTaSystole(135)
                setTaDiastole(85)
                setTemperature(37.2)
                setHasAssurance(true)
                setAssuranceRate(80)
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium self-start md:self-auto transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Réinitialiser
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
            {/* Left Parameters */}
            <div className="lg:col-span-7 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Nom du Patient
                  </label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Âge & Sexe
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={patientAge}
                      onChange={(e) => setPatientAge(parseInt(e.target.value) || 0)}
                      className="w-20 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Constantes Slider */}
              <div className="space-y-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Constantes Vitales Prises au Triage
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Tension Artérielle</span>
                      <span className={`font-bold ${isTaAlert ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {taSystole}/{taDiastole} mmHg
                      </span>
                    </div>
                    <input
                      type="range"
                      min="90"
                      max="200"
                      value={taSystole}
                      onChange={(e) => setTaSystole(parseInt(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Température</span>
                      <span className={`font-bold ${isTempAlert ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {temperature}°C
                      </span>
                    </div>
                    <input
                      type="range"
                      min="36.0"
                      max="40.5"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                </div>

                {(isTaAlert || isTempAlert) && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>
                      Attention : {isTaAlert && 'Pic hypertensif détecté. '}
                      {isTempAlert && 'Syndrome fébrile aigu détecté.'}
                    </span>
                  </div>
                )}
              </div>

              {/* Assurance Setting */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Prise en charge Tiers-Payant
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasAssurance}
                      onChange={(e) => setHasAssurance(e.target.checked)}
                      className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-950"
                    />
                    Patient affilié IPM / Mutuelle
                  </label>
                  {hasAssurance && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Taux :</span>
                      {[70, 80, 100].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => setAssuranceRate(rate)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                            assuranceRate === rate
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-slate-950 border border-slate-800 text-slate-300'
                          }`}
                        >
                          {rate}%
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Summary Card (Prescription & Invoice) */}
            <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                      Synthèse Médicale Immédiate
                    </span>
                    <h4 className="font-bold text-white text-base">Fiche Patient & Ordonnance</h4>
                  </div>
                  <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold">
                    D-SANTÉ
                  </span>
                </div>

                <div className="py-4 space-y-3 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Patient :</span>
                    <span className="text-white font-medium">{patientName} ({patientAge} ans)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Constantes :</span>
                    <span className="text-white font-medium">
                      TA {taSystole}/{taDiastole} • {temperature}°C • SpO2 {spo2}%
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Diagnostic :</span>
                    <span className="text-emerald-300 font-semibold">{diagnostic}</span>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-bold block">Traitement Prescrit (DCI) :</span>
                    <p className="text-slate-300">1. Artéméther + Luméfantrine 20/120mg (3j)</p>
                    <p className="text-slate-300">2. Paracétamol 1g comprimé (3x/j si T° &gt; 38°C)</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Total Prestations (Consultation + TDR) :</span>
                  <span className="text-slate-300 font-bold">{totalActes.toLocaleString('fr-FR')} FCFA</span>
                </div>
                {hasAssurance && (
                  <div className="flex justify-between items-center text-xs text-emerald-400 font-semibold">
                    <span>Prise en charge IPM ({assuranceRate}%) :</span>
                    <span>- {partAssurance.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                  <span className="text-sm font-semibold text-white">Reste à charge patient :</span>
                  <span className="text-xl font-extrabold text-emerald-400">
                    {partPatient.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>

                <Link
                  href="/tarifs"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/20"
                >
                  Déployer D-SANTÉ dans ma clinique
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-4 sm:px-6 text-center text-xs text-slate-500">
        <p className="max-w-xl mx-auto mb-4">
          D-SANTÉ est une solution médicale certifiée conforme à la réglementation sanitaire de l&apos;espace UEMOA/CEDEAO.
        </p>
        <div className="flex items-center justify-center gap-4 text-slate-400">
          <Link href="/guide" className="hover:text-emerald-400">Guide d&apos;utilisation</Link>
          <span>•</span>
          <Link href="/tarifs" className="hover:text-emerald-400">Formules & Tarifs</Link>
          <span>•</span>
          <Link href="/login" className="hover:text-emerald-400">Connexion</Link>
        </div>
      </footer>
    </div>
  )
}

