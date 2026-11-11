import { getFactures } from './actions'
import { getPatients, getOrganismesAssurances } from '../patients/actions'
import NouvelleFactureModal from './NouvelleFactureModal'
import FacturationRowActions from './FacturationRowActions'
import {
  Receipt, ShieldCheck, CheckCircle2, Clock,
  Wallet, DollarSign, ArrowUpRight, Filter, Sparkles
} from 'lucide-react'

export default async function FacturationPage(props: {
  searchParams: Promise<{ statut?: string }>
}) {
  const searchParams = await props.searchParams
  const selectedStatut = searchParams.statut || 'tous'

  const [{ factures }, { patients }, { organismes }] = await Promise.all([
    getFactures(selectedStatut),
    getPatients(),
    getOrganismesAssurances(),
  ])

  const aDesFacturesReelles = Boolean(factures && factures.length > 0)

  // Données de secours / démo indicatives en filigrane si base neuve
  const facturesAffichees = aDesFacturesReelles
    ? factures
    : [
        {
          id: 'fac-1',
          numero_facture: 'FAC-EX-0091',
          date_facture: '2026-10-30',
          montant_total_brut: 15000,
          part_patient: 3000,
          part_assurance: 12000,
          montant_regle_patient: 3000,
          statut_paiement_patient: 'paye',
          statut_paiement_assurance: 'en_attente',
          moyen_paiement: 'wave',
          patients: { nom: 'Diallo', prenom: 'Aminata', ipp: 'PAT-EX-001' },
          organismes_assurances: { nom: 'IPM Sonatel', type_organisme: 'ipm' },
        },
        {
          id: 'fac-2',
          numero_facture: 'FAC-EX-0092',
          date_facture: '2026-10-30',
          montant_total_brut: 5000,
          part_patient: 5000,
          part_assurance: 0,
          montant_regle_patient: 5000,
          statut_paiement_patient: 'paye',
          statut_paiement_assurance: 'exonere',
          moyen_paiement: 'especes',
          patients: { nom: 'Sow', prenom: 'Moussa', ipp: 'PAT-EX-002' },
          organismes_assurances: null,
        },
        {
          id: 'fac-3',
          numero_facture: 'FAC-EX-0093',
          date_facture: '2026-10-29',
          montant_total_brut: 45000,
          part_patient: 22500,
          part_assurance: 22500,
          montant_regle_patient: 0,
          statut_paiement_patient: 'en_attente',
          statut_paiement_assurance: 'en_attente',
          moyen_paiement: 'especes',
          patients: { nom: 'Ba', prenom: 'Aïssatou', ipp: 'PAT-EX-003' },
          organismes_assurances: { nom: 'CMU Sénégal', type_organisme: 'cmu' },
        },
      ]

  const formatCFA = (montant: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'decimal', maximumFractionDigits: 0 }).format(montant) + ' FCFA'

  // Calcul KPI (sans impact si en filigrane)
  const totalEncaissePatient = aDesFacturesReelles
    ? facturesAffichees.reduce((acc: number, f: any) => acc + Number(f.montant_regle_patient || 0), 0)
    : 0

  const totalCreancesTiersPayant = aDesFacturesReelles
    ? facturesAffichees
        .filter((f: any) => f.statut_paiement_assurance === 'en_attente')
        .reduce((acc: number, f: any) => acc + Number(f.part_assurance || 0), 0)
    : 0

  const totalResteARecouvrer = aDesFacturesReelles
    ? facturesAffichees
        .filter((f: any) => f.statut_paiement_patient !== 'paye')
        .reduce((acc: number, f: any) => acc + (Number(f.part_patient || 0) - Number(f.montant_regle_patient || 0)), 0)
    : 0

  return (
    <div className="space-y-6">
      {/* Entête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-foreground">
            Caisse, Facturation & Tiers-Payant
          </h2>
          <p className="text-xs text-foreground-muted">
            Ventilation automatique ticket modérateur patient / prise en charge mutuelle & IPM.
          </p>
        </div>

        <NouvelleFactureModal patients={patients || []} organismes={organismes || []} />
      </div>

      {/* Bannière filigrane sans impact */}
      {!aDesFacturesReelles && (
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 rounded-2xl text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              <strong>Exemples en filigrane :</strong> Votre établissement ne compte aucune facture enregistrée pour le moment. Les lignes ci-dessous sont présentées à titre indicatif et sans impact sur vos encaissements. Cliquez sur « Nouvelle Facture » pour émettre votre premier reçu.
            </span>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-surface-border bg-surface flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground-muted">Encaissé Réel (Patients)</p>
            <p className="text-xl font-black font-heading text-emerald-600">
              {formatCFA(totalEncaissePatient)}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-surface-border bg-surface flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground-muted">Créances Tiers-Payant (IPM/CMU)</p>
            <p className="text-xl font-black font-heading text-foreground">
              {formatCFA(totalCreancesTiersPayant)}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-surface-border bg-surface flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-danger/10 text-danger flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground-muted">Reste à Recouvrer Patient</p>
            <p className="text-xl font-black font-heading text-danger">
              {formatCFA(totalResteARecouvrer)}
            </p>
          </div>
        </div>
      </div>

      {/* Tableau des Factures */}
      <div className="bg-surface rounded-3xl border border-surface-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-background text-foreground-muted uppercase tracking-wider text-[11px] font-bold border-b border-surface-border">
              <tr>
                <th className="py-3 px-4">N° Facture & Date</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Organisme / Mutuelle</th>
                <th className="py-3 px-4">Montant Total</th>
                <th className="py-3 px-4">Part Patient</th>
                <th className="py-3 px-4">Statut Patient</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {facturesAffichees.map((f: any) => {
                const pat = f.patients
                const org = f.organismes_assurances
                const estPaye = f.statut_paiement_patient === 'paye'

                return (
                  <tr
                    key={f.id}
                    className={`transition-colors ${
                      !aDesFacturesReelles
                        ? 'opacity-70 bg-amber-500/5 hover:bg-amber-500/10'
                        : 'hover:bg-background/40'
                    }`}
                  >
                    {/* Facture & Date */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-primary block">
                          {f.numero_facture}
                        </span>
                        {!aDesFacturesReelles && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25">
                            Exemple
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-foreground-muted">
                        {new Date(f.date_facture || f.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </td>

                    {/* Patient */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-foreground block">
                        {pat ? `${pat.nom} ${pat.prenom}` : 'Patient anonyme'}
                      </span>
                      {pat?.ipp && (
                        <span className="text-[11px] font-mono text-foreground-muted">
                          {pat.ipp}
                        </span>
                      )}
                    </td>

                    {/* Organisme */}
                    <td className="py-3.5 px-4 text-xs">
                      {org ? (
                        <span className="inline-flex items-center gap-1 font-bold text-primary">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {org.nom}
                        </span>
                      ) : (
                        <span className="text-foreground-muted text-[11px]">
                          Plein Tarif (Direct)
                        </span>
                      )}
                    </td>

                    {/* Montant Total */}
                    <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                      {formatCFA(f.montant_total_brut)}
                    </td>

                    {/* Part Patient vs Tiers-Payant */}
                    <td className="py-3.5 px-4 text-xs">
                      <span className="font-mono font-bold text-foreground block">
                        {formatCFA(f.part_patient)}
                      </span>
                      {f.part_assurance > 0 && (
                        <span className="text-[10px] text-primary font-mono block">
                          Assurance : {formatCFA(f.part_assurance)}
                        </span>
                      )}
                    </td>

                    {/* Statut Paiement */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        estPaye ? 'bg-emerald-500/10 text-emerald-600' : 'bg-danger/10 text-danger'
                      }`}>
                        {estPaye ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {estPaye ? 'Encaissé' : 'En attente'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <FacturationRowActions
                        facture={f}
                        isExempleFiligrane={!aDesFacturesReelles}
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
