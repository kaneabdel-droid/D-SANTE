import Link from 'next/link'
import {
  Users, Activity, BedDouble, Receipt, Stethoscope,
  HeartPulse, AlertTriangle, ArrowUpRight, Clock, Plus,
  ShieldCheck, CheckCircle2, ChevronRight, Pill
} from 'lucide-react'

export default async function DashboardPage() {
  // Données synthétiques du cockpit de santé
  const stats = {
    patientsDuJour: 38,
    urgencesTriage: 5,
    litsOccupes: 18,
    totalLits: 24,
    recetteJour: 485000,
    tiersPayantEnAttente: 320000,
  }

  const fileAttenteUrgences = [
    {
      id: '1',
      ipp: 'PAT-2610-001',
      nom: 'Diallo Oumar',
      age: '34 ans',
      constantes: 'TA 180/100 • Pouls 110 • SpO2 93%',
      gravite: 'orange',
      tempsAttente: '8 min',
      motif: 'Céphalées intenses et vertiges',
    },
    {
      id: '2',
      ipp: 'PAT-2610-004',
      nom: 'Sow Fatoumata',
      age: '5 ans',
      constantes: 'T° 39.8°C • Pouls 130',
      gravite: 'rouge',
      tempsAttente: '3 min',
      motif: 'Fièvre aiguë avec convulsion fébrile',
    },
    {
      id: '3',
      ipp: 'PAT-2610-007',
      nom: 'Ba Amadou',
      age: '62 ans',
      constantes: 'Glycémie 3.4 g/L • TA 140/85',
      gravite: 'jaune',
      tempsAttente: '22 min',
      motif: 'Décompensation diabétique',
    },
    {
      id: '4',
      ipp: 'PAT-2610-011',
      nom: 'Ndiaye Awa',
      age: '28 ans',
      constantes: 'TA 110/70 • T° 37.1°C',
      gravite: 'vert',
      tempsAttente: '35 min',
      motif: 'Consultation prénatale 2ème trimestre',
    },
  ]

  const formatCFA = (montant: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'decimal', maximumFractionDigits: 0 }).format(montant) + ' FCFA'

  const tauxOccupation = Math.round((stats.litsOccupes / stats.totalLits) * 100)

  return (
    <div className="space-y-6">
      {/* Top Banner / Salutation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface p-6 rounded-3xl border border-surface-border shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
            <HeartPulse className="w-3.5 h-3.5 animate-pulse" />
            <span>Cockpit Médical Actif</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-foreground">
            Tableau de Bord Hospitalier & Soins
          </h2>
          <p className="text-xs text-foreground-muted">
            Vue d&apos;ensemble en temps réel des flux de patients, constantes, lits et caisse.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/triage"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-danger text-white text-xs font-bold hover:bg-danger/90 shadow-sm transition-all"
          >
            <Activity className="w-4 h-4" />
            <span>Triage Constantes</span>
          </Link>

          <Link
            href="/patients"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Admission Patient</span>
          </Link>
        </div>
      </div>

      {/* Cartes KPI Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 : Patients */}
        <div className="bg-surface rounded-3xl p-5 border border-surface-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground-muted">Patients du Jour</span>
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black font-heading text-foreground mt-3">
            {stats.patientsDuJour}
          </p>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +12% par rapport à hier
          </span>
        </div>

        {/* KPI 2 : Triage Urgences */}
        <div className="bg-surface rounded-3xl p-5 border border-surface-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground-muted">Triage en Attente</span>
            <div className="w-9 h-9 rounded-xl bg-danger/10 text-danger flex items-center justify-center">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <p className="text-3xl font-black font-heading text-danger mt-3">
            {stats.urgencesTriage}
          </p>
          <span className="text-[11px] text-danger font-medium mt-1 block">
            1 cas rouge prioritaire immédiat
          </span>
        </div>

        {/* KPI 3 : Lits & Hospitalisation */}
        <div className="bg-surface rounded-3xl p-5 border border-surface-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground-muted">Occupation Lits</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <BedDouble className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black font-heading text-foreground mt-3">
            {stats.litsOccupes} <span className="text-sm font-normal text-foreground-muted">/ {stats.totalLits}</span>
          </p>
          <div className="w-full bg-surface-border h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${tauxOccupation > 80 ? 'bg-danger' : 'bg-primary'}`}
              style={{ width: `${tauxOccupation}%` }}
            />
          </div>
          <span className="text-[10px] text-foreground-muted mt-1 block font-medium">
            {tauxOccupation}% des capacités occupées
          </span>
        </div>

        {/* KPI 4 : Finances & Tiers-Payant */}
        <div className="bg-surface rounded-3xl p-5 border border-surface-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground-muted">Recettes & Tiers-Payant</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xl font-bold font-mono text-foreground mt-3">
            {formatCFA(stats.recetteJour)}
          </p>
          <span className="text-[11px] text-amber-600 font-semibold block mt-1">
            IPM / Mutuelles : {formatCFA(stats.tiersPayantEnAttente)}
          </span>
        </div>
      </div>

      {/* Section 2 : File de Triage & Urgences Récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface rounded-3xl p-6 border border-surface-border shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold font-heading text-foreground flex items-center gap-2">
                <Activity className="w-4 h-4 text-danger animate-pulse" />
                File d&apos;Attente & Triage des Constantes
              </h3>
              <p className="text-xs text-foreground-muted">
                Patients en attente d&apos;orientation ou de consultation médicale.
              </p>
            </div>
            <Link
              href="/triage"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              Voir tout <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background text-foreground-muted uppercase tracking-wider text-[10px] font-bold border-b border-surface-border">
                <tr>
                  <th className="py-2.5 px-3">Gravité</th>
                  <th className="py-2.5 px-3">Patient (IPP)</th>
                  <th className="py-2.5 px-3">Constantes</th>
                  <th className="py-2.5 px-3">Motif</th>
                  <th className="py-2.5 px-3 text-right">Attente</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/60">
                {fileAttenteUrgences.map((p) => {
                  const graviteColors: Record<string, string> = {
                    rouge: 'bg-red-500 text-white animate-pulse',
                    orange: 'bg-orange-500 text-white',
                    jaune: 'bg-amber-400 text-black',
                    vert: 'bg-emerald-500 text-white',
                  }

                  return (
                    <tr key={p.id} className="hover:bg-background/40 transition-colors">
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            graviteColors[p.gravite] || 'bg-gray-400 text-white'
                          }`}
                        >
                          Code {p.gravite}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-foreground block">{p.nom}</span>
                        <span className="text-[10px] font-mono text-foreground-muted">{p.ipp} • {p.age}</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-foreground-muted">
                        {p.constantes}
                      </td>
                      <td className="py-3 px-3 text-foreground font-medium">
                        {p.motif}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-foreground-muted">
                        {p.tempsAttente}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Accès Rapides Soignants & Matériel */}
        <div className="space-y-4">
          <div className="bg-surface rounded-3xl p-6 border border-surface-border shadow-xs">
            <h3 className="text-base font-bold font-heading text-foreground mb-3 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-primary" />
              Accès Rapides Soignants
            </h3>

            <div className="space-y-2">
              <Link
                href="/patients"
                className="flex items-center justify-between p-3 rounded-2xl bg-background hover:bg-black/5 transition-colors border border-surface-border/60 text-xs font-bold"
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Dossier Médical Partagé
                </span>
                <ChevronRight className="w-4 h-4 text-foreground-muted" />
              </Link>

              <Link
                href="/hospitalisation"
                className="flex items-center justify-between p-3 rounded-2xl bg-background hover:bg-black/5 transition-colors border border-surface-border/60 text-xs font-bold"
              >
                <span className="flex items-center gap-2">
                  <BedDouble className="w-4 h-4 text-indigo-600" />
                  Plan des Lits & Pavillons
                </span>
                <ChevronRight className="w-4 h-4 text-foreground-muted" />
              </Link>

              <Link
                href="/pharmacie"
                className="flex items-center justify-between p-3 rounded-2xl bg-background hover:bg-black/5 transition-colors border border-surface-border/60 text-xs font-bold"
              >
                <span className="flex items-center gap-2">
                  <Pill className="w-4 h-4 text-emerald-600" />
                  Pharmacie & Dépôt Urgences
                </span>
                <ChevronRight className="w-4 h-4 text-foreground-muted" />
              </Link>

              <Link
                href="/facturation"
                className="flex items-center justify-between p-3 rounded-2xl bg-background hover:bg-black/5 transition-colors border border-surface-border/60 text-xs font-bold"
              >
                <span className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-amber-600" />
                  Caisse & Tiers-Payant (IPM)
                </span>
                <ChevronRight className="w-4 h-4 text-foreground-muted" />
              </Link>
            </div>
          </div>

          <div className="bg-primary/5 rounded-3xl p-5 border border-primary/20 text-xs space-y-2">
            <span className="font-bold text-primary flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Secret Médical & Données Sécurisées
            </span>
            <p className="text-foreground-muted text-[11px] leading-relaxed">
              Toutes les données de santé sont cloisonnées par établissement. Traçabilité complète de l&apos;ouverture des dossiers patients.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
