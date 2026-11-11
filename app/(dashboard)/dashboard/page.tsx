import Link from 'next/link'
import {
  Users, Activity, BedDouble, Receipt, Stethoscope,
  HeartPulse, AlertTriangle, ArrowUpRight, Clock, Plus,
  ShieldCheck, CheckCircle2, ChevronRight, Pill, Sparkles
} from 'lucide-react'
import { getDictionary } from '@/dictionaries'
import { createClient } from '@/utils/supabase/server'
import { getTenantContext } from '@/utils/supabase/tenant'

export default async function DashboardPage() {
  const dict = await getDictionary()
  const d = dict?.dashboard || {}
  const actions = dict?.actions || {}
  const nav = dict?.nav || {}

  const supabase = await createClient()
  const tenant = await getTenantContext()

  let totalPatients = 0
  let totalLits = 0
  let litsOccupes = 0
  let recetteJour = 0
  let tiersPayantEnAttente = 0

  if (tenant?.structureId) {
    try {
      const [
        { count: pCount },
        { count: lCount },
        { count: loCount },
        { data: facs },
      ] = await Promise.all([
        supabase.from('patients').select('*', { count: 'exact', head: true }).eq('structure_id', tenant.structureId),
        supabase.from('lits').select('*', { count: 'exact', head: true }).eq('structure_id', tenant.structureId),
        supabase.from('lits').select('*', { count: 'exact', head: true }).eq('structure_id', tenant.structureId).eq('statut', 'occupe'),
        supabase.from('factures_sante').select('montant_regle_patient, part_assurance, statut_paiement_assurance').eq('structure_id', tenant.structureId),
      ])

      totalPatients = pCount || 0
      totalLits = lCount || 0
      litsOccupes = loCount || 0
      if (facs) {
        recetteJour = facs.reduce((acc, f) => acc + Number(f.montant_regle_patient || 0), 0)
        tiersPayantEnAttente = facs
          .filter((f) => f.statut_paiement_assurance === 'en_attente')
          .reduce((acc, f) => acc + Number(f.part_assurance || 0), 0)
      }
    } catch (err) {
      console.warn('Erreur lecture stats réelles dashboard santé:', err)
    }
  }

  const estNouvelEtablissement = totalPatients === 0 && totalLits === 0 && recetteJour === 0

  // Si établissement avec données, utiliser les vrais chiffres. Sinon afficher zéro réel avec exemples en filigrane
  const stats = {
    patientsDuJour: totalPatients,
    urgencesTriage: 0,
    litsOccupes: litsOccupes,
    totalLits: totalLits,
    recetteJour: recetteJour,
    tiersPayantEnAttente: tiersPayantEnAttente,
  }

  const fileAttenteUrgences = [
    {
      id: '1',
      ipp: 'PAT-EX-001',
      nom: 'Diallo Oumar',
      age: '34 ans',
      constantes: 'TA 180/100 • Pouls 110 • SpO2 93%',
      gravite: 'orange',
      tempsAttente: '8 min',
      motif: 'Céphalées intenses et vertiges',
    },
    {
      id: '2',
      ipp: 'PAT-EX-004',
      nom: 'Sow Fatoumata',
      age: '5 ans',
      constantes: 'T° 39.8°C • Pouls 130',
      gravite: 'rouge',
      tempsAttente: '3 min',
      motif: 'Fièvre aiguë avec convulsion fébrile',
    },
    {
      id: '3',
      ipp: 'PAT-EX-007',
      nom: 'Ba Amadou',
      age: '62 ans',
      constantes: 'Glycémie 3.4 g/L • TA 140/85',
      gravite: 'jaune',
      tempsAttente: '22 min',
      motif: 'Décompensation diabétique',
    },
    {
      id: '4',
      ipp: 'PAT-EX-011',
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

  const tauxOccupation = stats.totalLits > 0 ? Math.round((stats.litsOccupes / stats.totalLits) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Top Banner / Salutation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface p-6 rounded-3xl border border-surface-border shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
            <HeartPulse className="w-3.5 h-3.5 animate-pulse" />
            <span>{d.active_cockpit || 'Cockpit Médical Actif'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-foreground">
            {d.title || 'Tableau de Bord Hospitalier & Soins'}
          </h2>
          <p className="text-xs text-foreground-muted">
            {d.subtitle || 'Vue d\'ensemble en temps réel des flux de patients, constantes, lits et caisse.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/triage"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-danger text-white text-xs font-bold hover:bg-danger/90 shadow-sm transition-all"
          >
            <Activity className="w-4 h-4" />
            <span>{actions.new_triage || 'Nouveau Triage'}</span>
          </Link>

          <Link
            href="/patients"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{actions.new_patient || '+ Patient'}</span>
          </Link>
        </div>
      </div>

      {/* Message de bienvenue établissement neuf */}
      {estNouvelEtablissement && (
        <div className="p-4 bg-primary/10 border border-primary/20 text-primary rounded-2xl text-xs flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold text-sm">Bienvenue dans votre nouvel établissement !</p>
              <p className="text-foreground-muted mt-0.5">
                Votre base est prête et vierge. Vos données de démo indicatives sont présentées en filigrane sans impact sur vos statistiques réelles. Utilisez les boutons du haut pour créer vos premiers patients et consultations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cartes KPI Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 : Patients */}
        <div className="bg-surface rounded-3xl p-5 border border-surface-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground-muted">
              {d.kpi_patients_today || 'Patients Enregistrés'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black font-heading text-foreground mt-3">
            {stats.patientsDuJour}
          </p>
          <span className="text-[11px] text-foreground-muted font-medium flex items-center gap-1 mt-1">
            Fichier central actif
          </span>
        </div>

        {/* KPI 2 : Triage Urgences */}
        <div className="bg-surface rounded-3xl p-5 border border-surface-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground-muted">
              {d.kpi_triage_queue || 'Triage en Attente'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-danger/10 text-danger flex items-center justify-center">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <p className="text-3xl font-black font-heading text-danger mt-3">
            {stats.urgencesTriage}
          </p>
          <span className="text-[11px] text-foreground-muted font-medium mt-1 block">
            File d&apos;attente active
          </span>
        </div>

        {/* KPI 3 : Lits & Hospitalisation */}
        <div className="bg-surface rounded-3xl p-5 border border-surface-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground-muted">
              {d.bed_occupancy || 'Occupation des Lits'}
            </span>
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
            {tauxOccupation}% {d.capacity_occupied || 'des capacités occupées'}
          </span>
        </div>

        {/* KPI 4 : Finances & Tiers-Payant */}
        <div className="bg-surface rounded-3xl p-5 border border-surface-border shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground-muted">
              {d.kpi_daily_revenue || 'Recettes Encaissées'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black font-heading text-foreground mt-3 truncate">
            {formatCFA(stats.recetteJour)}
          </p>
          <span className="text-[11px] text-amber-600 font-bold block mt-1">
            {formatCFA(stats.tiersPayantEnAttente)} en attente IPM
          </span>
        </div>
      </div>

      {/* File d'attente Triage & Urgences (avec filigrane si établissement neuf) */}
      <div className="bg-surface rounded-3xl border border-surface-border p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-foreground text-sm sm:text-base">
              File d&apos;Attente Triage Médical
            </h3>
            {estNouvelEtablissement && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                Exemple indicatif en filigrane
              </span>
            )}
          </div>
          <Link href="/triage" className="text-xs text-primary font-bold hover:underline">
            Voir le flux complet ➔
          </Link>
        </div>

        <div className="divide-y divide-surface-border/60">
          {fileAttenteUrgences.map((p) => (
            <div
              key={p.id}
              className={`py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 ${
                estNouvelEtablissement ? 'opacity-65' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-3 h-3 rounded-full shrink-0 ${
                    p.gravite === 'rouge'
                      ? 'bg-danger animate-ping'
                      : p.gravite === 'orange'
                      ? 'bg-amber-500'
                      : p.gravite === 'jaune'
                      ? 'bg-yellow-400'
                      : 'bg-emerald-500'
                  }`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground text-xs sm:text-sm">
                      {p.nom}
                    </span>
                    <span className="text-[11px] text-foreground-muted">({p.age})</span>
                    <span className="font-mono text-[10px] text-primary">{p.ipp}</span>
                  </div>
                  <p className="text-[11px] text-foreground-muted">{p.motif}</p>
                </div>
              </div>

              <div className="text-right text-[11px] self-end sm:self-auto">
                <span className="font-mono text-foreground font-semibold block">
                  {p.constantes}
                </span>
                <span className="text-foreground-muted">Attente : {p.tempsAttente}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
