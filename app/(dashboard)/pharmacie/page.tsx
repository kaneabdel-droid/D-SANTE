import { getStocksMedicaments } from './actions'
import NouveauMedicamentModal from './NouveauMedicamentModal'
import PharmacieRowActions from './PharmacieRowActions'
import {
  Pill, Search, AlertTriangle, AlertCircle, ShieldCheck, CheckCircle2,
  Calendar, Layers, ArrowDownRight, Package, Sparkles
} from 'lucide-react'

export default async function PharmaciePage(props: {
  searchParams: Promise<{ q?: string }>
}) {
  const searchParams = await props.searchParams
  const q = searchParams.q || ''

  const { stocks, error } = await getStocksMedicaments(q)
  const aDesStocksReels = Boolean(stocks && stocks.length > 0)

  // Données indicatives d'exemple en filigrane si base neuve
  const stocksAffiches = aDesStocksReels
    ? stocks
    : [
      {
        id: 'med-1',
        code_medicament: 'MED-EX-001',
        dci: 'Paracétamol',
        nom_commercial: 'Doliprane',
        forme: 'comprime',
        dosage: '1000 mg',
        quantite_en_stock: 140,
        seuil_alerte: 20,
        prix_vente: 1500,
        numero_lot: 'LT-88102',
        date_peremption: '2027-08-30',
      },
      {
        id: 'med-2',
        code_medicament: 'MED-EX-002',
        dci: 'Amoxicilline',
        nom_commercial: 'Clamoxyl',
        forme: 'gellule',
        dosage: '500 mg',
        quantite_en_stock: 12,
        seuil_alerte: 15,
        prix_vente: 3200,
        numero_lot: 'LT-77401',
        date_peremption: '2026-12-15',
      },
      {
        id: 'med-3',
        code_medicament: 'MED-EX-003',
        dci: 'Artéméther + Luméfantrine',
        nom_commercial: 'Coartem',
        forme: 'comprime',
        dosage: '20/120 mg',
        quantite_en_stock: 45,
        seuil_alerte: 10,
        prix_vente: 2500,
        numero_lot: 'LT-99210',
        date_peremption: '2027-04-10',
      },
      {
        id: 'med-4',
        code_medicament: 'MED-EX-004',
        dci: 'Sérum Glucosé 5%',
        nom_commercial: 'Perfusion Glucosée',
        forme: 'solute',
        dosage: '500 ml',
        quantite_en_stock: 4,
        seuil_alerte: 10,
        prix_vente: 1800,
        numero_lot: 'LT-44109',
        date_peremption: '2026-11-20',
      },
    ]

  const formatCFA = (montant: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'decimal', maximumFractionDigits: 0 }).format(montant) + ' FCFA'

  // Calcul KPI (sans impact si en filigrane)
  const valeurStockTotale = aDesStocksReels
    ? stocksAffiches.reduce(
      (acc: number, m: any) => acc + (Number(m.quantite_en_stock) * Number(m.prix_vente)),
      0
    )
    : 0

  const articlesEnAlerte = aDesStocksReels
    ? stocksAffiches.filter(
      (m: any) => Number(m.quantite_en_stock) <= Number(m.seuil_alerte)
    ).length
    : 0

  return (
    <div className="space-y-6">
      {/* Entête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-foreground">
            Pharmacie Interne & Dépôt d&apos;Urgence
          </h2>
          <p className="text-xs text-foreground-muted">
            Gestion des stocks de médicaments, contrôle des dates de péremption et dispensation.
          </p>
        </div>

        <NouveauMedicamentModal />
      </div>

      {/* Bannière filigrane sans impact */}
      {!aDesStocksReels && (
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 rounded-2xl text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              <strong>Exemples en filigrane :</strong> Votre établissement ne compte aucun produit en stock pour le moment. Les lignes ci-dessous sont présentées à titre indicatif et sans impact sur vos valorisations. Cliquez sur « Nouveau Médicament » pour enregistrer votre premier produit réel.
            </span>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-surface-border bg-surface flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground-muted">Articles Référencés</p>
            <p className="text-xl font-black font-heading text-foreground">
              {aDesStocksReels ? stocksAffiches.length : '0 (4 exemples)'}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-surface-border bg-surface flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground-muted">Valeur Réelle du Stock</p>
            <p className="text-xl font-black font-heading text-foreground">
              {formatCFA(valeurStockTotale)}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-surface-border bg-surface flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-danger/10 text-danger flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground-muted">Ruptures & Alertes</p>
            <p className="text-xl font-black font-heading text-danger">
              {articlesEnAlerte} {articlesEnAlerte > 1 ? 'articles' : 'article'}
            </p>
          </div>
        </div>
      </div>

      {/* Barre de Recherche */}
      <div className="bg-surface p-4 rounded-2xl border border-surface-border shadow-xs">
        <form method="get" className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Rechercher par DCI, Nom commercial ou Code..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-border bg-background text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-surface-border/60 hover:bg-surface-border text-foreground font-bold text-xs transition-colors"
          >
            Filtrer
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-danger/10 border border-danger/20 text-danger rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tableau des Médicaments */}
      <div className="bg-surface rounded-3xl border border-surface-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-background text-foreground-muted uppercase tracking-wider text-[11px] font-bold border-b border-surface-border">
              <tr>
                <th className="py-3 px-4">DCI & Nom Commercial</th>
                <th className="py-3 px-4">Forme & Dosage</th>
                <th className="py-3 px-4">Stock Actuel</th>
                <th className="py-3 px-4">Prix Vente</th>
                <th className="py-3 px-4">Lot & Péremption</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {stocksAffiches.map((m: any) => {
                const estAlerte = Number(m.quantite_en_stock) <= Number(m.seuil_alerte)
                const estRupture = Number(m.quantite_en_stock) === 0

                return (
                  <tr
                    key={m.id}
                    className={`transition-colors ${!aDesStocksReels
                        ? 'opacity-70 bg-amber-500/5 hover:bg-amber-500/10'
                        : 'hover:bg-background/40'
                      }`}
                  >
                    {/* DCI & Nom */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground block text-sm">
                          {m.dci}
                        </span>
                        {!aDesStocksReels && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25">
                            Exemple
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-foreground-muted">
                        {m.nom_commercial ? `Com. : ${m.nom_commercial}` : m.code_medicament || '—'}
                      </span>
                    </td>

                    {/* Forme & Dosage */}
                    <td className="py-3.5 px-4 text-xs">
                      <span className="capitalize text-foreground font-medium block">
                        {m.forme}
                      </span>
                      <span className="text-[11px] text-foreground-muted font-mono">
                        {m.dosage || '—'}
                      </span>
                    </td>

                    {/* Stock */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-bold text-sm ${estRupture ? 'text-danger' : estAlerte ? 'text-amber-500' : 'text-emerald-500'
                          }`}>
                          {m.quantite_en_stock}
                        </span>
                        {estRupture ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-danger/10 text-danger border border-danger/20">
                            Rupture
                          </span>
                        ) : estAlerte ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            Alerte seuil
                          </span>
                        ) : null}
                      </div>
                    </td>

                    {/* Prix */}
                    <td className="py-3.5 px-4 font-mono font-bold text-foreground text-xs sm:text-sm">
                      {formatCFA(m.prix_vente)}
                    </td>

                    {/* Lot & Péremption */}
                    <td className="py-3.5 px-4 text-xs font-mono">
                      <span className="text-foreground block">
                        {m.numero_lot ? `Lot ${m.numero_lot}` : '—'}
                      </span>
                      <span className="text-[11px] text-foreground-muted">
                        {m.date_peremption ? `Pér. ${new Date(m.date_peremption).toLocaleDateString('fr-FR')}` : '—'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <PharmacieRowActions
                        medicament={m}
                        isExempleFiligrane={!aDesStocksReels}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
