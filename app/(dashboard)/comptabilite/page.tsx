import { getEcrituresComptables } from './actions'
import ImportJournauxModal from './ImportJournauxModal'
import ArchiveComptableButton from './ArchiveComptableButton'
import NouvelleEcritureModal from './NouvelleEcritureModal'
import Link from 'next/link'
import {
  FileText, ArrowDownRight, ArrowUpRight, CheckCircle2,
  Filter, AlertCircle, BookOpen, ShieldCheck, Plus
} from 'lucide-react'

export default async function ComptabilitePage(props: {
  searchParams: Promise<{ journal?: string }>
}) {
  const searchParams = await props.searchParams
  const selectedJournal = searchParams.journal || 'tous'

  const { ecritures, error } = await getEcrituresComptables(selectedJournal)

  // Données de démonstration complètes pour TOUS les journaux SYSCOHADA Santé
  const mockEcritures = [
    // 1. Journal des Ventes & Recettes (ventes)
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
      date_ecriture: '2026-10-28',
      journal: 'ventes',
      numero_piece: 'FAC-2610-0089',
      libelle: 'Séjour hospitalisation & surveillance VIP',
      lignes_ecritures_comptables: [
        { id: 'l6', compte: '411', libelle: 'Créances clients hospitalisations', debit: 65000, credit: 0 },
        { id: 'l7', compte: '706', libelle: 'Prestations de séjour & hébergement médicalisé', debit: 0, credit: 65000 },
      ],
    },

    // 2. Journal des Achats & Fournisseurs (achats)
    {
      id: 'ec-4',
      date_ecriture: '2026-10-29',
      journal: 'achats',
      numero_piece: 'FAC-FOURN-881',
      libelle: 'Approvisionnement réactifs et solutés laboratoire',
      lignes_ecritures_comptables: [
        { id: 'l8', compte: '601', libelle: 'Achats fournitures médicales & consommables', debit: 85000, credit: 0 },
        { id: 'l9', compte: '401', libelle: 'Fournisseur Répartiteurs Médicaux', debit: 0, credit: 85000 },
      ],
    },
    {
      id: 'ec-5',
      date_ecriture: '2026-10-27',
      journal: 'achats',
      numero_piece: 'FAC-FOURN-879',
      libelle: 'Réapprovisionnement grossiste pharmacie (antibiotiques, antalgiques)',
      lignes_ecritures_comptables: [
        { id: 'l10', compte: '601', libelle: 'Achats de médicaments pour le dépôt', debit: 220000, credit: 0 },
        { id: 'l11', compte: '401', libelle: 'Fournisseur Laborex Sénégal', debit: 0, credit: 220000 },
      ],
    },

    // 3. Journal de Caisse (caisse)
    {
      id: 'ec-6',
      date_ecriture: '2026-10-30',
      journal: 'caisse',
      numero_piece: 'CAISSE-2610-01',
      libelle: 'Règlement ticket modérateur consultations matinée en espèces',
      lignes_ecritures_comptables: [
        { id: 'l12', compte: '571', libelle: 'Encaissements espèces guichet caisse', debit: 45000, credit: 0 },
        { id: 'l13', compte: '706', libelle: 'Prestations consultations de médecine générale', debit: 0, credit: 45000 },
      ],
    },
    {
      id: 'ec-7',
      date_ecriture: '2026-10-29',
      journal: 'caisse',
      numero_piece: 'CAISSE-DEP-14',
      libelle: 'Menue dépense caisse : Produits de désinfection et nettoyage pavillon',
      lignes_ecritures_comptables: [
        { id: 'l14', compte: '605', libelle: 'Fournitures d’entretien et désinfection', debit: 12500, credit: 0 },
        { id: 'l15', compte: '571', libelle: 'Sortie espèces de caisse', debit: 0, credit: 12500 },
      ],
    },

    // 4. Journal de Banque (banque)
    {
      id: 'ec-8',
      date_ecriture: '2026-10-30',
      journal: 'banque',
      numero_piece: 'VIR-IPM-9912',
      libelle: 'Virement bancaire reçu IPM Sonatel (Règlement Bordereau n° 2610)',
      lignes_ecritures_comptables: [
        { id: 'l16', compte: '521', libelle: 'Compte Bancaire CBAO Sénégal', debit: 180000, credit: 0 },
        { id: 'l17', compte: '411', libelle: 'Règlement créances tiers-payant IPM Sonatel', debit: 0, credit: 180000 },
      ],
    },
    {
      id: 'ec-9',
      date_ecriture: '2026-10-28',
      journal: 'banque',
      numero_piece: 'CHQ-BANC-5501',
      libelle: 'Règlement facture fournisseur Répartiteurs Médicaux par chèque bancaire',
      lignes_ecritures_comptables: [
        { id: 'l18', compte: '401', libelle: 'Fournisseur Répartiteurs Médicaux', debit: 85000, credit: 0 },
        { id: 'l19', compte: '521', libelle: 'Compte Bancaire CBAO Sénégal', debit: 0, credit: 85000 },
      ],
    },

    // 5. Journal des Opérations Diverses (od)
    {
      id: 'ec-10',
      date_ecriture: '2026-10-31',
      journal: 'od',
      numero_piece: 'OD-AMORT-2610',
      libelle: 'Dotation mensuelle aux amortissements des équipements biomédicaux',
      lignes_ecritures_comptables: [
        { id: 'l20', compte: '681', libelle: 'Dotations aux amortissements du matériel médical', debit: 95000, credit: 0 },
        { id: 'l21', compte: '281', libelle: 'Amortissement matériel biomédical & lits', debit: 0, credit: 95000 },
      ],
    },
    {
      id: 'ec-11',
      date_ecriture: '2026-10-31',
      journal: 'od',
      numero_piece: 'OD-STOCK-2610',
      libelle: 'Régularisation inventaire et variation stocks pharmacie fin de mois',
      lignes_ecritures_comptables: [
        { id: 'l22', compte: '603', libelle: 'Variation des stocks de produits pharmaceutiques', debit: 35000, credit: 0 },
        { id: 'l23', compte: '311', libelle: 'Stock pharmacie et réactifs', debit: 0, credit: 35000 },
      ],
    },
  ]

  // Normalisation des écritures : base réelle ou démo complète
  const sourceEcritures = ecritures && ecritures.length > 0 ? ecritures : mockEcritures

  // Filtrage effectif selon le journal sélectionné
  const ecrituresAffichees = selectedJournal === 'tous'
    ? sourceEcritures
    : sourceEcritures.filter((ec) => ec.journal === selectedJournal)

  // Totaux Débit / Crédit calculés sur les écritures affichées
  const totalDebits = ecrituresAffichees.reduce((acc, ec) => {
    return acc + (ec.lignes_ecritures_comptables || []).reduce((s: number, l: any) => s + Number(l.debit || 0), 0)
  }, 0)

  const totalCredits = ecrituresAffichees.reduce((acc, ec) => {
    return acc + (ec.lignes_ecritures_comptables || []).reduce((s: number, l: any) => s + Number(l.credit || 0), 0)
  }, 0)

  const formatCFA = (val: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'decimal', maximumFractionDigits: 0 }).format(val) + ' FCFA'

  const journalLabels: Record<string, string> = {
    tous: 'Tous les journaux',
    ventes: 'Ventes & Recettes',
    achats: 'Achats & Fournisseurs',
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
          <NouvelleEcritureModal defaultJournal={selectedJournal} />
          <ArchiveComptableButton
            nomStructure="Centre Hospitalier / Clinique D-Santé"
            ecritures={ecrituresAffichees}
            totalDebits={totalDebits}
            totalCredits={totalCredits}
          />
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
          <span className="text-xs font-semibold text-foreground-muted">
            Nombre d&apos;Écritures ({journalLabels[selectedJournal] || selectedJournal})
          </span>
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
                  ? 'bg-primary text-white shadow-xs font-bold'
                  : 'bg-surface text-foreground-muted hover:text-foreground border border-surface-border'
              }`}
            >
              {j.label}
            </Link>
          )
        })}
      </div>

      {/* Tableau du Journal */}
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
              {ecrituresAffichees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-foreground-muted">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="font-bold text-foreground">
                      Aucune écriture enregistrée dans le journal {journalLabels[selectedJournal] || selectedJournal}
                    </p>
                    <p className="text-xs mt-1">
                      Utilisez le bouton &quot;+ Nouvelle Écriture&quot; pour enregistrer la première opération.
                    </p>
                  </td>
                </tr>
              ) : (
                ecrituresAffichees.map((ec) => {
                  const lignes = ec.lignes_ecritures_comptables || []
                  return lignes.map((ligne: any, idx: number) => {
                    const isFirstLine = idx === 0
                    const isDebit = Number(ligne.debit || 0) > 0

                    return (
                      <tr
                        key={`${ec.id}-${ligne.id || idx}`}
                        className={`hover:bg-surface-border/20 transition-colors ${
                          isFirstLine ? 'border-t-2 border-surface-border' : ''
                        }`}
                      >
                        {/* Date (uniquement 1ère ligne) */}
                        <td className="py-2.5 px-4 font-mono text-xs text-foreground whitespace-nowrap align-top">
                          {isFirstLine ? ec.date_ecriture : ''}
                        </td>

                        {/* Journal (uniquement 1ère ligne) */}
                        <td className="py-2.5 px-4 whitespace-nowrap align-top">
                          {isFirstLine && (
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-surface-border/80 text-foreground">
                              {journalLabels[ec.journal] || ec.journal}
                            </span>
                          )}
                        </td>

                        {/* Réf / Pièce (uniquement 1ère ligne) */}
                        <td className="py-2.5 px-4 font-mono text-xs font-bold text-foreground-muted whitespace-nowrap align-top">
                          {isFirstLine ? ec.numero_piece || '—' : ''}
                        </td>

                        {/* Numéro Compte SYSCOHADA */}
                        <td className="py-2.5 px-4 font-mono text-xs font-bold text-primary whitespace-nowrap">
                          {ligne.compte}
                        </td>

                        {/* Libellé */}
                        <td className="py-2.5 px-4 text-xs text-foreground font-medium">
                          <span className={isDebit ? 'pl-0' : 'pl-4 text-foreground-muted'}>
                            {ligne.libelle || ec.libelle}
                          </span>
                        </td>

                        {/* Débit */}
                        <td className="py-2.5 px-4 font-mono text-xs text-right font-bold text-primary whitespace-nowrap">
                          {Number(ligne.debit || 0) > 0 ? formatCFA(Number(ligne.debit)) : '—'}
                        </td>

                        {/* Crédit */}
                        <td className="py-2.5 px-4 font-mono text-xs text-right font-bold text-secondary whitespace-nowrap">
                          {Number(ligne.credit || 0) > 0 ? formatCFA(Number(ligne.credit)) : '—'}
                        </td>
                      </tr>
                    )
                  })
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
