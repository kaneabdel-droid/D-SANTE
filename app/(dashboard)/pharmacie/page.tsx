import { getStocksMedicaments } from './actions'
import NouveauMedicamentModal from './NouveauMedicamentModal'
import DelivrerButton from './DelivrerButton'
import {
  Pill, Search, AlertTriangle, ShieldCheck, CheckCircle2,
  Calendar, Layers, ArrowDownRight, Package
} from 'lucide-react'

export default async function PharmaciePage(props: {
  searchParams: Promise<{ q?: string }>
}) {
  const searchParams = await props.searchParams
  const q = searchParams.q || ''

  const { stocks, error } = await getStocksMedicaments(q)

  // Données de secours / démo si base neuve
  const stocksAffiches = stocks && stocks.length > 0 ? stocks : [
    {
      id: 'med-1',
      code_medicament: 'MED-001',
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
      code_medicament: 'MED-002',
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
      code_medicament: 'MED-003',
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
      code_medicament: 'MED-004',
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

  // Calcul KPI
  const valeurStockTotale = stocksAffiches.reduce(
    (acc: number, m: any) => acc + (Number(m.quantite_en_stock) * Number(m.prix_vente)),
    0
  )
  const articlesEnAlerte = stocksAffiches.filter(
    (m: any) => Number(m.quantite_en_stock) <= Number(m.seuil_alerte)
  ).length

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

      {/* Cartes KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface rounded-3xl p-5 border border-surface-border shadow-xs">
          <span className="text-xs font-semibold text-foreground-muted">Références en Stock</span>
          <p className="text-3xl font-black font-heading text-foreground mt-2">
            {stocksAffiches.length}
          </p>
          <span className="text-[11px] text-foreground-muted">Spécialités pharmaceutiques référencées</span>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-surface-border shadow-xs">
          <span className="text-xs font-semibold text-foreground-muted">Valeur de Vente du Stock</span>
          <p className="text-2xl font-bold font-mono text-emerald-600 mt-2">
            {formatCFA(valeurStockTotale)}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">Capacité totale de dispensation</span>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-surface-border shadow-xs">
          <span className="text-xs font-semibold text-foreground-muted">Alertes Rupture / Stock Bas</span>
          <p className={`text-3xl font-black font-heading mt-2 ${articlesEnAlerte > 0 ? 'text-danger' : 'text-foreground'}`}>
            {articlesEnAlerte}
          </p>
          <span className="text-[11px] text-danger font-medium">Sous le seuil de sécurité</span>
        </div>
      </div>

      {/* Recherche */}
      <div className="bg-surface p-4 rounded-2xl border border-surface-border shadow-xs">
        <form method="get" className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Rechercher une molécule DCI, un nom de spécialité..."
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

      {/* Tableau des Stocks */}
      <div className="bg-surface rounded-3xl border border-surface-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-background text-foreground-muted uppercase tracking-wider text-[11px] font-bold border-b border-surface-border">
              <tr>
                <th className="py-3 px-4">Médicament (DCI)</th>
                <th className="py-3 px-4">Forme & Dosage</th>
                <th className="py-3 px-4 text-right">Quantité Stock</th>
                <th className="py-3 px-4 text-right">Prix Unitaire</th>
                <th className="py-3 px-4">N° Lot & DLUO</th>
                <th className="py-3 px-4 text-right">Dispensation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {stocksAffiches.map((m: any) => {
                const estCritique = Number(m.quantite_en_stock) <= Number(m.seuil_alerte)

                return (
                  <tr key={m.id} className="hover:bg-background/40 transition-colors">
                    {/* DCI & Nom */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-foreground block text-sm">
                        {m.dci}
                      </span>
                      {m.nom_commercial && (
                        <span className="text-[11px] text-foreground-muted italic">
                          ({m.nom_commercial})
                        </span>
                      )}
                    </td>

                    {/* Forme */}
                    <td className="py-3.5 px-4 text-xs">
                      <span className="capitalize font-medium text-foreground block">
                        {m.forme}
                      </span>
                      <span className="text-[11px] text-foreground-muted font-mono">
                        {m.dosage || '—'}
                      </span>
                    </td>

                    {/* Quantité */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-xs ${
                        estCritique
                          ? 'bg-danger/10 text-danger border border-danger/30'
                          : 'bg-emerald-500/10 text-emerald-600'
                      }`}>
                        {m.quantite_en_stock} boîtes
                      </span>
                    </td>

                    {/* Prix */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground">
                      {formatCFA(m.prix_vente)}
                    </td>

                    {/* Lot & Péremption */}
                    <td className="py-3.5 px-4 text-xs">
                      <span className="font-mono text-foreground-muted block">
                        {m.numero_lot || 'Lot N/C'}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-foreground">
                        {m.date_peremption ? `Exp : ${m.date_peremption}` : '—'}
                      </span>
                    </td>

                    {/* Dispensation rapide */}
                    <td className="py-3.5 px-4 text-right">
                      <DelivrerButton
                        medicamentId={m.id}
                        stockActuel={m.quantite_en_stock}
                        nomCommercial={m.nom_commercial}
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
