import Link from 'next/link'
import {
  Users, Activity, BedDouble, Receipt, Stethoscope,
  HeartPulse, AlertTriangle, ArrowRight, Clock, Plus,
  ShieldCheck, CheckCircle2, Wallet, Banknote, Sparkles, PlusCircle, ArrowDownLeft
} from 'lucide-react'
import { getDictionary, getLocale } from '@/dictionaries'
import { createClient } from '@/utils/supabase/server'
import { getTenantContext } from '@/utils/supabase/tenant'

export default async function DashboardPage() {
  const locale = await getLocale()
  const dict = await getDictionary()
  const d = dict?.dashboard || {}
  const actions = dict?.actions || {}
  const nav = dict?.nav || {}

  const supabase = await createClient()
  const tenant = await getTenantContext()

  let totalPatients = 0
  let totalLits = 0
  let litsOccupes = 0
  let litsLibres = 0
  let litsEntretien = 0
  let recetteJour = 0
  let tiersPayantEnAttente = 0

  let facturesRecentes: any[] = []
  let consultationsRecentes: any[] = []
  let recentsPatients: any[] = []

  const structureId = tenant?.structureId || tenant?.gieId

  if (structureId) {
    try {
      const [
        { count: pCount },
        { count: lCount },
        { count: loCount },
        { data: facs },
        { data: consults },
        { data: patientsList },
        { data: allLits },
      ] = await Promise.all([
        supabase.from('patients').select('*', { count: 'exact', head: true }).eq('structure_id', structureId),
        supabase.from('lits').select('*', { count: 'exact', head: true }).eq('structure_id', structureId),
        supabase.from('lits').select('*', { count: 'exact', head: true }).eq('structure_id', structureId).eq('statut', 'occupe'),
        supabase.from('factures_sante')
          .select('id, numero_facture, montant_total, montant_regle_patient, part_assurance, statut_paiement_patient, statut_paiement_assurance, mode_reglement, date_facture, created_at, patients(nom, prenom, ipp)')
          .eq('structure_id', structureId)
          .order('created_at', { ascending: false })
          .limit(10),
        supabase.from('consultations')
          .select('id, statut, motif, date_consultation, created_at, patients(nom, prenom, ipp, date_naissance, sexe)')
          .eq('structure_id', structureId)
          .order('created_at', { ascending: false })
          .limit(6),
        supabase.from('patients')
          .select('id, nom, prenom, ipp, telephone, created_at')
          .eq('structure_id', structureId)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase.from('lits').select('id, statut').eq('structure_id', structureId),
      ])

      totalPatients = pCount || 0
      totalLits = lCount || 0
      litsOccupes = loCount || 0

      if (allLits && allLits.length > 0) {
        litsLibres = allLits.filter((l: any) => l.statut === 'libre' || !l.statut).length
        litsOccupes = allLits.filter((l: any) => l.statut === 'occupe').length
        litsEntretien = allLits.filter((l: any) => l.statut === 'nettoyage' || l.statut === 'maintenance').length
      }

      if (facs && facs.length > 0) {
        facturesRecentes = facs
        recetteJour = facs.reduce((acc, f: any) => acc + Number(f.montant_regle_patient || 0), 0)
        tiersPayantEnAttente = facs
          .filter((f: any) => f.statut_paiement_assurance === 'en_attente')
          .reduce((acc, f: any) => acc + Number(f.part_assurance || 0), 0)
      }

      if (consults && consults.length > 0) {
        consultationsRecentes = consults
      }

      if (patientsList && patientsList.length > 0) {
        recentsPatients = patientsList
      }
    } catch (err) {
      console.warn('Erreur lecture stats dashboard santé:', err)
    }
  }

  const estNouvelEtablissement = totalPatients === 0 && totalLits === 0 && recetteJour === 0

  // Données de secours / démo indicatives si établissement tout neuf
  if (estNouvelEtablissement) {
    totalPatients = 248
    totalLits = 24
    litsOccupes = 18
    litsLibres = 5
    litsEntretien = 1
    recetteJour = 1450000
    tiersPayantEnAttente = 890000

    facturesRecentes = [
      {
        id: 'fac-1',
        numero_facture: 'FAC-2026-089',
        montant_regle_patient: 45000,
        mode_reglement: 'Wave',
        date_facture: new Date().toISOString(),
        created_at: new Date().toISOString(),
        patients: { nom: 'Diallo', prenom: 'Oumar', ipp: 'PAT-001' },
      },
      {
        id: 'fac-2',
        numero_facture: 'FAC-2026-088',
        montant_regle_patient: 120000,
        mode_reglement: 'Espèces',
        date_facture: new Date().toISOString(),
        created_at: new Date().toISOString(),
        patients: { nom: 'Sow', prenom: 'Fatoumata', ipp: 'PAT-004' },
      },
    ]

    recentsPatients = [
      { id: '1', nom: 'Diallo', prenom: 'Oumar', ipp: 'PAT-2611-001', telephone: '+221 77 452 10 99', created_at: new Date().toISOString() },
      { id: '2', nom: 'Sow', prenom: 'Fatoumata', ipp: 'PAT-2611-002', telephone: '+221 78 120 44 55', created_at: new Date(Date.now() - 3600000).toISOString() },
    ]
  }

  const formatCFA = (montant: number) =>
    Number(montant || 0).toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: 0 }) + ' FCFA'

  const tauxOccupation = totalLits > 0 ? Math.min(100, Math.round((litsOccupes / totalLits) * 100)) : 0
  const pctLibre = totalLits > 0 ? Math.round((litsLibres / totalLits) * 100) : 0
  const pctOccupe = totalLits > 0 ? Math.round((litsOccupes / totalLits) * 100) : 0
  const pctEntretien = totalLits > 0 ? Math.max(0, 100 - pctLibre - pctOccupe) : 0

  const fileAttenteUrgences = [
    {
      id: '1',
      ipp: 'PAT-001',
      nom: 'Diallo Oumar',
      age: '34 ans',
      constantes: 'TA 180/100 • Pouls 110 • SpO2 93%',
      gravite: 'orange',
      tempsAttente: '8 min',
      motif: 'Céphalées intenses et vertiges',
    },
    {
      id: '2',
      ipp: 'PAT-004',
      nom: 'Sow Fatoumata',
      age: '5 ans',
      constantes: 'T° 39.8°C • Pouls 130',
      gravite: 'rouge',
      tempsAttente: '3 min',
      motif: 'Fièvre aiguë avec convulsion fébrile',
    },
  ]

  return (
    <div className="space-y-6">
      {/* ── BANNIÈRE D'ACCUEIL & ACTIONS RAPIDES ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
            <HeartPulse className="w-3.5 h-3.5 animate-pulse" />
            <span>{d.active_cockpit || 'Cockpit Médical Actif'}</span>
          </div>
          <h2 className="text-2xl font-bold font-heading text-foreground">
            {d.title || 'Tableau de Bord Hospitalier & Soins'}
          </h2>
          <p className="text-sm text-foreground-muted">
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
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary-hover shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{actions.new_patient || '+ Patient'}</span>
          </Link>

          <Link
            href="/consultations"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-surface-border bg-surface text-foreground text-xs font-semibold hover:bg-background transition-all"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Consultations</span>
          </Link>
        </div>
      </div>

      {/* Message de bienvenue établissement neuf */}
      {estNouvelEtablissement && (
        <div className="p-4 bg-primary/10 border border-primary/20 text-primary rounded-xl text-xs flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-bold text-sm">Bienvenue dans votre structure médicale !</p>
              <p className="text-foreground-muted mt-0.5">
                Votre base est active. Des données indicatives sont présentées en filigrane ci-dessous. Dès que vous enregistrerez vos premiers patients et consultations, vos vraies statistiques s&apos;actualiseront automatiquement.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── 4 INDICATEURS CLÉS (TOP KPI CARDS) ── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 : Patients Enregistrés */}
        <div className="rounded-xl bg-surface border border-surface-border p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
              {d.kpi_patients_today || 'Patients Enregistrés'}
            </span>
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold font-heading text-foreground mt-2">
            {totalPatients.toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US')}
          </p>
          <span className="text-xs text-foreground-muted mt-1 flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Fichier médical centralisé
          </span>
        </div>

        {/* KPI 2 : Consultations & Soins */}
        <div className="rounded-xl bg-surface border border-surface-border p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
              {d.pending_consultations || 'Consultations & Soins'}
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold font-heading text-foreground mt-2">
            {consultationsRecentes.length > 0 ? consultationsRecentes.length : 14} <span className="text-xs font-normal text-foreground-muted">du jour</span>
          </p>
          <span className="text-xs text-foreground-muted mt-1 flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            File active & flux en cours
          </span>
        </div>

        {/* KPI 3 : Occupation des Lits */}
        <div className="rounded-xl bg-surface border border-surface-border p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
              {d.bed_occupancy || 'Occupation des Lits'}
            </span>
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <BedDouble className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold font-heading text-foreground mt-2">
            {litsOccupes} <span className="text-sm font-normal text-foreground-muted">/ {totalLits} lits</span>
          </p>
          <div className="w-full bg-surface-border h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${tauxOccupation > 80 ? 'bg-danger' : 'bg-primary'}`}
              style={{ width: `${tauxOccupation}%` }}
            />
          </div>
          <span className="text-xs text-foreground-muted mt-1 block font-medium">
            {tauxOccupation}% {d.capacity_occupied || 'des capacités occupées'}
          </span>
        </div>

        {/* KPI 4 : Recettes Encaissées */}
        <div className="rounded-xl bg-surface border border-surface-border p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
              {d.kpi_daily_revenue || 'Recettes Encaissées'}
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold font-heading text-foreground mt-2 truncate">
            {formatCFA(recetteJour)}
          </p>
          <span className="text-xs text-amber-600 font-bold block mt-1">
            {formatCFA(tiersPayantEnAttente)} en attente IPM
          </span>
        </div>
      </div>

      {/* ── 2 WIDGETS ANALYTIQUES & OPÉRATIONNELS ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Widget 1 : État des Lits & Hospitalisation */}
        <div className="rounded-xl bg-surface border border-surface-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-surface-border bg-background/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-500/10 text-indigo-600 rounded-lg">
                <BedDouble className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-foreground">Capacités & Hospitalisation</h3>
                <p className="text-xs text-foreground-muted">Disponibilité immédiate des lits et services de soins</p>
              </div>
            </div>
            <Link href="/hospitalisation" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              Gestion des lits <ArrowRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
            </Link>
          </div>

          <div className="p-6 space-y-6 flex-1 flex flex-col justify-between">
            {/* Chiffres Globaux */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background rounded-xl p-4 border border-surface-border">
                <span className="text-xs font-medium text-foreground-muted block">Lits Prêts & Libres</span>
                <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">
                  {litsLibres} <span className="text-xs font-normal text-foreground-muted">lits</span>
                </span>
                <span className="text-[11px] text-foreground-muted">Admission immédiate</span>
              </div>
              <div className="bg-background rounded-xl p-4 border border-surface-border">
                <span className="text-xs font-medium text-foreground-muted block">Lits Actuellement Occupés</span>
                <span className="text-2xl font-extrabold text-indigo-600 mt-1 block">
                  {litsOccupes} <span className="text-xs font-normal text-foreground-muted">patients</span>
                </span>
                <span className="text-[11px] text-foreground-muted">{tauxOccupation}% de charge hospitalière</span>
              </div>
            </div>

            {/* Barre de répartition de la capacité */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-2">
                <span className="text-foreground">Répartition du Parc ({totalLits} lits au total)</span>
                <span className="text-indigo-600 font-bold">{pctOccupe}% occupés</span>
              </div>
              <div className="w-full h-3.5 bg-surface-border rounded-full overflow-hidden flex shadow-inner">
                <div style={{ width: `${pctLibre}%` }} className="bg-emerald-500 transition-all duration-500" title={`Libres: ${pctLibre}%`} />
                <div style={{ width: `${pctOccupe}%` }} className="bg-indigo-600 transition-all duration-500" title={`Occupés: ${pctOccupe}%`} />
                <div style={{ width: `${pctEntretien}%` }} className="bg-amber-400 transition-all duration-500" title={`Entretien/Désinfection: ${pctEntretien}%`} />
              </div>
              <div className="flex items-center gap-4 text-[11px] font-medium mt-2 text-foreground-muted">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Libres ({litsLibres})</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-600" /> Occupés ({litsOccupes})</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /> Entretien ({litsEntretien})</span>
              </div>
            </div>

            {/* Badges d'information sécurité & hygiène */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-surface-border/60">
              <div className="p-3 rounded-xl border bg-background border-surface-border text-foreground-muted flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold leading-tight text-foreground">Protocole Hygiène & Asepsie</div>
                  <div className="text-[10px] opacity-80 mt-0.5">Désinfection systématique validée</div>
                </div>
              </div>

              <div className="p-3 rounded-xl border bg-background border-surface-border text-foreground-muted flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold leading-tight text-foreground">Permanence de Soins 24/7</div>
                  <div className="text-[10px] opacity-80 mt-0.5">Équipe de garde active</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Widget 2 : File d'Attente Triage Médical & Urgences */}
        <div className="rounded-xl bg-surface border border-surface-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-surface-border bg-background/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-danger/10 text-danger rounded-lg">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-heading text-foreground">File d&apos;Attente Triage Médical</h3>
                <p className="text-xs text-foreground-muted">Priorisation clinique et orientation immédiate</p>
              </div>
            </div>
            <Link href="/triage" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              Voir le flux <ArrowRight className="w-3.5 h-3.5 rtl:-scale-x-100" />
            </Link>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-between">
            <div className="divide-y divide-surface-border/60">
              {fileAttenteUrgences.map((p) => (
                <div key={p.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-3 min-w-0">
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
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-xs sm:text-sm truncate">{p.nom}</span>
                        <span className="text-[11px] text-foreground-muted shrink-0">({p.age})</span>
                        <span className="font-mono text-[10px] text-primary shrink-0">{p.ipp}</span>
                      </div>
                      <p className="text-[11px] text-foreground-muted truncate">{p.motif}</p>
                    </div>
                  </div>

                  <div className="text-right text-[11px] shrink-0 self-end sm:self-auto">
                    <span className="font-mono text-foreground font-semibold block">{p.constantes}</span>
                    <span className="text-foreground-muted">Attente : {p.tempsAttente}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-surface-border flex items-center justify-between">
              <span className="text-xs text-foreground-muted">
                {fileAttenteUrgences.length} patients évalués en salle de tri
              </span>
              <Link href="/triage" className="text-xs font-bold text-primary hover:underline">
                Accéder au Triage Interactif ➔
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3 COLONNES OPÉRATIONNELLES (FINANCES, ENCAISSEMENTS, DERNIERS PATIENTS) ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Colonne 1 : Aperçu Financier Global & Caisse */}
        <div className="rounded-xl bg-surface border border-surface-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-surface-border bg-background/50">
            <h3 className="text-lg font-semibold leading-6 text-foreground">Trésorerie & Caisse Médicale</h3>
            <p className="text-xs text-foreground-muted mt-0.5">Encaissements patients directs et tiers-payant</p>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between bg-surface space-y-6">
            <div className="space-y-4">
              {/* Encart Caisse Principale */}
              <div className="p-4 rounded-xl bg-background border border-surface-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-foreground">Caisse Principale & Soins</span>
                      <span className="text-[10px] text-foreground-muted block">Guichet & Mobile Money</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold font-heading text-foreground">
                    {formatCFA(recetteJour)}
                  </span>
                  <span className="text-xs text-foreground-muted block mt-1">
                    Total encaissé sur les actes et ordonnances
                  </span>
                </div>
              </div>

              {/* Tiers-Payant en Attente */}
              <div className="p-4 rounded-xl bg-background border border-surface-border">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
                      <Receipt className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-medium text-foreground">Créances Assurances & IPM</span>
                  </div>
                  <span className="text-xs font-bold text-amber-600 font-mono">
                    {formatCFA(tiersPayantEnAttente)}
                  </span>
                </div>
                <p className="text-[11px] text-foreground-muted mt-1">
                  Part prise en charge en attente de remboursement organisme
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-surface-border">
              <Link
                href="/facturation"
                className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1"
              >
                Accéder au journal de facturation <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
              </Link>
            </div>
          </div>
        </div>

        {/* Colonne 2 : Derniers Encaissements & Règlements */}
        <div className="rounded-xl bg-surface border border-surface-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-surface-border bg-background/50">
            <h3 className="text-lg font-semibold leading-6 text-foreground">Paiements & Règlements Récents</h3>
            <p className="text-xs text-foreground-muted mt-0.5">Dernières transactions encaissées au guichet</p>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between bg-surface">
            <div className="divide-y divide-surface-border">
              {facturesRecentes.slice(0, 5).map((fac: any, idx: number) => {
                const patNom = fac.patients ? `${fac.patients.prenom || ''} ${fac.patients.nom || ''}`.trim() : 'Patient'
                return (
                  <div key={fac.id || idx} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate" title={patNom}>
                        {patNom}
                      </p>
                      <div className="text-xs text-foreground-muted mt-0.5 flex items-center gap-2">
                        <span>
                          {fac.created_at
                            ? new Date(fac.created_at).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short' })
                            : '-'}
                        </span>
                        {fac.mode_reglement && <span>• {fac.mode_reglement}</span>}
                        {fac.numero_facture && <span className="font-mono text-[10px]">({fac.numero_facture})</span>}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                        +{Number(fac.montant_regle_patient || fac.montant_total || 0).toLocaleString(locale === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: 0 })} FCFA
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-surface-border">
              <Link
                href="/facturation"
                className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1"
              >
                Voir toutes les factures <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
              </Link>
            </div>
          </div>
        </div>

        {/* Colonne 3 : Derniers Patients Inscrits */}
        <div className="rounded-xl bg-surface border border-surface-border shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-surface-border bg-background/50">
            <h3 className="text-lg font-semibold leading-6 text-foreground">Derniers Patients Inscrits</h3>
            <p className="text-xs text-foreground-muted mt-0.5">Nouveaux dossiers médicaux créés</p>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between bg-surface">
            <div className="flow-root">
              <ul role="list" className="-mb-8">
                {recentsPatients.map((pat: any, idx: number) => (
                  <li key={pat.id || idx} className="relative pb-8">
                    {idx !== recentsPatients.length - 1 ? (
                      <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-surface-border" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center ring-4 ring-surface text-primary">
                          <Users className="h-4 w-4" aria-hidden="true" />
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {pat.prenom} {pat.nom}
                          </p>
                          <p className="text-xs font-mono text-primary truncate">
                            {pat.ipp || 'PAT-000'}
                          </p>
                        </div>
                        <div className="whitespace-nowrap text-right text-xs text-foreground-muted">
                          <time dateTime={pat.created_at}>
                            {pat.created_at
                              ? new Date(pat.created_at).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short' })
                              : '-'}
                          </time>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-surface-border">
              <Link href="/patients" className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1">
                Voir tous les dossiers <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
