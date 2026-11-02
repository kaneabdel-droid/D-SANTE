import { getEcrituresComptables } from './actions'
import ImportJournauxModal from './ImportJournauxModal'
import Link from 'next/link'
import {
  FileText, ArrowDownRight, ArrowUpRight, CheckCircle2,
  Filter, AlertCircle, BookOpen, ShieldCheck
} from 'lucide-react'

export default async function ComptabilitePage(props: {
  searchParams: Promise<{ journal?: string }>
}) {
  const searchParams = await props.searchParams
  const selectedJournal = searchParams.journal || 'tous'

  const { ecritures, error } = await getEcrituresComptables(selectedJournal)

  // Données de démonstration SYSCOHADA Santé (consultations, pharmacie, tiers-payant)
  const ecrituresAffichees = ecritures && ecritures.length > 0 ? ecritures : [
    {
      id: 'ec-1',
      date_ecriture: '2026-10-30',
      journal: 'ventes',
      numero_piece: 'FAC-2610-0091',
      libelle: 'Facturation Consultation & Soins (Aminata Diallo - IPM Sonatel)',
      lignes_ecritures_comptables: [
        { id: 'l1', compte: '571', libelle: 'Encaissement part patient espèces', debit: 3000, credit: 0 },
        { id: 'l2', compte: '411', libelle: 'Créance tiers-payant IPM Sonatel (80%)', debit: 12000, credit: 0 },
        { id: 'l3', compte: '706', libelle: 'Prestations médicales & soins', debit: 0, credit: 15000 },
      ],
    },
    {
      id: 'ec-2',
      date_ecriture: '2026-10-30',
      journal: 'ventes',
      numero_piece: 'FAC-2610-0092',
      libelle: 'Vente médicaments urgence au comptoir',
      lignes_ecritures_comptables: [
        { id: 'l4', compte: '571', libelle: 'Caisse centrale pharmacie', debit: 5000, credit: 0 },
        { id: 'l5', compte: '701', libelle: 'Ventes de produits pharmaceutiques', debit: 0, credit: 5000 },
      ],
    },
    {
      id: 'ec-3',
      date_ecriture: '2026-10-29',
      journal: 'achats',
      numero_piece: 'FAC-FOURN-881',
      libelle: 'Approvisionnement réactifs et solutés laboratoire',
      lignes_ecritures_comptables: [
        { id: 'l6', compte: '601', libelle: 'Achats fournitures médicales & consommables', debit: 85000, credit: 0 },
        { id: 'l7', compte: '401', libelle: 'Fournisseur Répartiteurs Médicaux', debit: 0, credit: 85000 },
      ],
    },
  ]

  // Totaux Débit / Crédit
  const totalDebits = ecrituresAffichees.reduce((acc, ec) => {
    return acc + (ec.lignes_ecritures_comptables || []).reduce((s: number, l: any) => s + Number(l.debit || 0), 0)
  }, 0)

  const totalCredits = ecrituresAffichees.reduce((acc, ec) => {
    return acc + (ec.lignes_ecritures_comptables || []).reduce((s: number, l: any) => s + Number(l.credit || 0), 0)
  }, 0)

  const formatCFA = (val: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'decimal', maximumFractionDigits: 0 }).format(val) + ' FCFA'

  const journalLabels: Record<string, string> = {
    ventes: 'Ventes / Recettes',
    achats: 'Achats / Fournisseurs',
    caisse: 'Caisse',
    banque: 'Banque',
    od: 'Opérations Diverses',
  }

  const isEquilibree = Math.abs(totalDebits - totalCredits) < 0.01

  return (
    <div className="space-y-6">
      {/* Entête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-foreground">
            Livre-Journal Comptable (SYSCOHADA Santé)
          </h2>
          <p className="text-xs text-foreground-muted">
            Journal général des actes médicaux, hospitalisations, pharmacie et règlements tiers-payant.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ImportJournauxModal />
          <span className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Partie Double Rigoureuse</span>
          </span>
        </div>
      </div>

      {/* Cartes KPI Totaux */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface rounded-3xl p-5 border border-surface-border shadow-xs">
          <span className="text-xs font-semibold text-foreground-muted">Nombre d&apos;Écritures</span>
          <p className="text-3xl font-black font-heading text-foreground mt-2">
            {ecrituresAffichees.length}
          </p>
          <span className="text-[11px] text-foreground-muted">Pièces comptables enregistrées</span>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-surface-border shadow-xs">
          <span className="text-xs font-semibold text-foreground-muted">Cumul Débits Période</span>
          <p className="text-2xl font-bold font-mono text-primary mt-2">
            {formatCFA(totalDebits)}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">Flux d&apos;emplois / charges / trésorerie</span>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-surface-border shadow-xs">
          <span className="text-xs font-semibold text-foreground-muted">Cumul Crédits Période</span>
          <p className="text-2xl font-bold font-mono text-secondary mt-2">
            {formatCFA(totalCredits)}
          </p>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            {isEquilibree ? '✓ Équilibre parfait débit / crédit' : '⚠ Différence constatée'}
          </span>
        </div>
      </div>

      {/* Filtres par Journal */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-foreground-muted mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Journal :
        </span>
        {[
          { id: 'tous', label: 'Tous les journaux' },
          { id: 'ventes', label: 'Ventes & Recettes' },
          { id: 'achats', label: 'Achats & Fournisseurs' },
          { id: 'caisse', label: 'Caisse' },
          { id: 'banque', label: 'Banque' },
          { id: 'od', label: 'Opérations Diverses' },
        ].map((j) => {
          const isActive = selectedJournal === j.id
          return (
            <Link
              key={j.id}
              href={`/comptabilite?journal=${j.id}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface text-foreground-muted hover:text-foreground border border-surface-border'
              }`}
            >
              {j.label}
            </Link>
          )
        })}
      </div>

      {/* Tableau du Journal (Zéro superposition) */}
      <div className="bg-surface border border-surface-border rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-surface-border/40 text-foreground-muted text-[11px] uppercase tracking-wider border-b border-surface-border">
              <tr>
                <th className="py-3 px-4 w-28 whitespace-nowrap">Date</th>
                <th className="py-3 px-4 w-32 whitespace-nowrap">Journal</th>
                <th className="py-3 px-4 w-40 whitespace-nowrap">Réf / Pièce</th>
                <th className="py-3 px-4 w-24 whitespace-nowrap">Compte</th>
                <th className="py-3 px-4 min-w-[240px]">Libellé de l&apos;Écriture</th>
                <th className="py-3 px-4 text-right w-36 whitespace-nowrap">Débit</th>
                <th className="py-3 px-4 text-right w-36 whitespace-nowrap">Crédit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {ecrituresAffichees.map((ec: any) => {
                const lignes = ec.lignes_ecritures_comptables || []

                // Tri conforme SYSCOHADA : Débits d'abord, puis Crédits
                const lignesTriees = [...lignes].sort((a: any, b: any) => {
                  const debitA = Number(a.debit) || 0
                  const debitB = Number(b.debit) || 0
                  if (debitA > 0 && debitB === 0) return -1
                  if (debitA === 0 && debitB > 0) return 1
                  return 0
                })

                return lignesTriees.map((l: any, idx: number) => {
                  const isFirst = idx === 0

                  return (
                    <tr
                      key={l.id || `${ec.id}-${idx}`}
                      className={`hover:bg-surface-border/20 transition-colors ${
                        isFirst ? 'border-t-2 border-surface-border bg-surface' : 'bg-surface/40'
                      }`}
                    >
                      {/* Spanning des métadonnées de la pièce */}
                      {isFirst && (
                        <>
                          <td
                            rowSpan={lignesTriees.length}
                            className="py-3.5 px-4 font-mono text-xs text-foreground font-medium align-top whitespace-nowrap border-r border-surface-border/50 bg-background/30"
                          >
                            {ec.date_ecriture}
                          </td>
                          <td
                            rowSpan={lignesTriees.length}
                            className="py-3.5 px-4 align-top whitespace-nowrap border-r border-surface-border/50 bg-background/30"
                          >
                            <span className="inline-block px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase bg-primary/10 text-primary">
                              {journalLabels[ec.journal] || ec.journal}
                            </span>
                          </td>
                          <td
                            rowSpan={lignesTriees.length}
                            className="py-3.5 px-4 font-mono text-xs align-top border-r border-surface-border/50 bg-background/30"
                          >
                            <span className="font-bold text-foreground block">{ec.numero_piece || '—'}</span>
                            {ec.libelle && (
                              <span className="block text-[11px] text-foreground-muted mt-1 leading-snug break-words max-w-[170px]" title={ec.libelle}>
                                {ec.libelle}
                              </span>
                            )}
                          </td>
                        </>
                      )}

                      {/* Compte individuel */}
                      <td className="py-3 px-4 font-mono text-xs align-top whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-border/60 text-foreground font-bold font-mono text-[11px]">
                          {l.compte}
                        </span>
                      </td>

                      {/* Libellé du mouvement */}
                      <td className="py-3 px-4 text-xs align-top">
                        <span className="text-foreground font-medium block">
                          {l.libelle || ec.libelle}
                        </span>
                      </td>

                      {/* Montant Débit */}
                      <td className="py-3 px-4 text-right font-mono text-xs font-bold text-primary align-top whitespace-nowrap">
                        {Number(l.debit) > 0 ? formatCFA(Number(l.debit)) : '—'}
                      </td>

                      {/* Montant Crédit */}
                      <td className="py-3 px-4 text-right font-mono text-xs font-bold text-secondary align-top whitespace-nowrap">
                        {Number(l.credit) > 0 ? formatCFA(Number(l.credit)) : '—'}
                      </td>
                    </tr>
                  )
                })
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
