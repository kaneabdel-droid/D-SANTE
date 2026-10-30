import { getFactures, encaisserFacture } from './actions'
import { getPatients, getOrganismesAssurances } from '../patients/actions'
import NouvelleFactureModal from './NouvelleFactureModal'
import { DownloadFactureButton } from '@/components/DownloadFactureButton'
import {
  Receipt, ShieldCheck, CheckCircle2, Clock,
  Wallet, DollarSign, ArrowUpRight, Filter
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

  // Données de secours / démo si base neuve
  const facturesAffichees = factures && factures.length > 0 ? factures : [
    {
      id: 'fac-1',
      numero_facture: 'FAC-2610-0091',
      date_facture: '2026-10-30',
      montant_total_brut: 15000,
      part_patient: 3000,
      part_assurance: 12000,
      montant_regle_patient: 3000,
      statut_paiement_patient: 'paye',
      statut_paiement_assurance: 'en_attente',
      moyen_paiement: 'wave',
      patients: { nom: 'Diallo', prenom: 'Aminata', ipp: 'PAT-2610-001' },
      organismes_assurances: { nom: 'IPM Sonatel', type_organisme: 'ipm' },
    },
    {
      id: 'fac-2',
      numero_facture: 'FAC-2610-0092',
      date_facture: '2026-10-30',
      montant_total_brut: 5000,
      part_patient: 5000,
      part_assurance: 0,
      montant_regle_patient: 5000,
      statut_paiement_patient: 'paye',
      statut_paiement_assurance: 'exonere',
      moyen_paiement: 'especes',
      patients: { nom: 'Sow', prenom: 'Moussa', ipp: 'PAT-2610-002' },
      organismes_assurances: null,
    },
    {
      id: 'fac-3',
      numero_facture: 'FAC-2610-0093',
      date_facture: '2026-10-29',
      montant_total_brut: 45000,
      part_patient: 22500,
      part_assurance: 22500,
      montant_regle_patient: 0,
      statut_paiement_patient: 'en_attente',
      statut_paiement_assurance: 'en_attente',
      moyen_paiement: 'especes',
      patients: { nom: 'Ba', prenom: 'Aïssatou', ipp: 'PAT-2610-003' },
      organismes_assurances: { nom: 'CMU Sénégal', type_organisme: 'cmu' },
    },
  ]

  const formatCFA = (val: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'decimal', maximumFractionDigits: 0 }).format(val) + ' FCFA'

  // KPI
  const totalEncaissePatient = facturesAffichees
    .filter((f: any) => f.statut_paiement_patient === 'paye')
    .reduce((acc: number, f: any) => acc + Number(f.part_patient || 0), 0)

  const totalCreancesAssurance = facturesAffichees
    .filter((f: any) => f.statut_paiement_assurance === 'en_attente')
    .reduce((acc: number, f: any) => acc + Number(f.part_assurance || 0), 0)

  return (
    <div className="space-y-6">
      {/* Entête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-foreground">
            Caisse & Facturation Tiers-Payant
          </h2>
          <p className="text-xs text-foreground-muted">
            Encaissement immédiat du ticket modérateur patient et suivi des bordereaux mutuelles/IPM.
          </p>
        </div>

        <NouvelleFactureModal
          patients={patients || []}
          organismes={organismes || []}
        />
      </div>

      {/* Cartes KPI Financières */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface rounded-3xl p-5 border border-surface-border shadow-xs">
          <span className="text-xs font-semibold text-foreground-muted">Encaissé Guichet (Part Patient)</span>
          <p className="text-2xl font-black font-mono text-emerald-600 mt-2">
            {formatCFA(totalEncaissePatient)}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">Recettes en caisse et mobile money</span>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-surface-border shadow-xs">
          <span className="text-xs font-semibold text-foreground-muted">Créances Tiers-Payant (IPM / CMU)</span>
          <p className="text-2xl font-black font-mono text-amber-600 mt-2">
            {formatCFA(totalCreancesAssurance)}
          </p>
          <span className="text-[11px] text-amber-600 font-medium">À recouvrer auprès des mutuelles</span>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-surface-border shadow-xs">
          <span className="text-xs font-semibold text-foreground-muted">Nombre Total de Pièces</span>
          <p className="text-3xl font-black font-heading text-foreground mt-2">
            {facturesAffichees.length}
          </p>
          <span className="text-[11px] text-foreground-muted">Factures et reçus émis</span>
        </div>
      </div>

      {/* Tableau des Factures */}
      <div className="bg-surface rounded-3xl border border-surface-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-background text-foreground-muted uppercase tracking-wider text-[11px] font-bold border-b border-surface-border">
              <tr>
                <th className="py-3 px-4">N° Pièce & Date</th>
                <th className="py-3 px-4">Patient (IPP)</th>
                <th className="py-3 px-4 text-right">Montant Total</th>
                <th className="py-3 px-4 text-right">Part Patient</th>
                <th className="py-3 px-4 text-right">Part Tiers-Payant</th>
                <th className="py-3 px-4">Statut Patient</th>
                <th className="py-3 px-4 text-right">Action Caisse</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {facturesAffichees.map((fac: any) => {
                const pat = fac.patients
                const org = fac.organismes_assurances
                const estPaye = fac.statut_paiement_patient === 'paye'

                return (
                  <tr key={fac.id} className="hover:bg-background/40 transition-colors">
                    {/* N° Facture & Date */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-foreground block">
                        {fac.numero_facture}
                      </span>
                      <span className="text-[11px] font-mono text-foreground-muted">
                        {fac.date_facture}
                      </span>
                    </td>

                    {/* Patient */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-foreground block">
                        {pat ? `${pat.nom} ${pat.prenom}` : 'Patient non renseigné'}
                      </span>
                      <span className="font-mono text-[11px] text-foreground-muted">
                        {pat?.ipp}
                      </span>
                    </td>

                    {/* Montant Brut Total */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground">
                      {formatCFA(fac.montant_total_brut)}
                    </td>

                    {/* Part Patient */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-primary">
                      {formatCFA(fac.part_patient)}
                      <span className="block text-[10px] text-foreground-muted font-sans font-normal uppercase">
                        {fac.moyen_paiement}
                      </span>
                    </td>

                    {/* Part Tiers-Payant */}
                    <td className="py-3.5 px-4 text-right font-mono text-xs">
                      {fac.part_assurance > 0 ? (
                        <div>
                          <span className="font-bold text-amber-600 block">
                            {formatCFA(fac.part_assurance)}
                          </span>
                          <span className="text-[10px] text-foreground-muted font-sans font-semibold">
                            {org?.nom || 'Assurance'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-foreground-muted font-sans text-xs">—</span>
                      )}
                    </td>

                    {/* Statut Patient */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          estPaye
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-danger/10 text-danger'
                        }`}
                      >
                        {estPaye ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            Acquitté
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            En Attente
                          </>
                        )}
                      </span>
                    </td>

                    {/* Action Encaissement & Téléchargement */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <DownloadFactureButton
                          size="sm"
                          data={{
                            structureNom: 'D-Santé Médical',
                            factureNumero: fac.numero_facture,
                            dateEmission: fac.date_facture,
                            patientNom: pat?.nom || 'Patient',
                            patientPrenom: pat?.prenom || '',
                            patientIpp: pat?.ipp || 'N/A',
                            organismeAssurance: org?.nom,
                            tauxCouverture: fac.montant_total_brut > 0 ? Math.round((fac.part_assurance / fac.montant_total_brut) * 100) : 0,
                            lignes: [
                              {
                                designation: 'Actes & Soins Médicaux Ambulatoires',
                                type: 'consultation',
                                quantite: 1,
                                prixUnitaire: fac.montant_total_brut,
                                total: fac.montant_total_brut,
                              }
                            ],
                            montantTotal: fac.montant_total_brut,
                            partAssurance: fac.part_assurance,
                            partPatient: fac.part_patient,
                            montantPaye: fac.montant_regle_patient || 0,
                            resteAPayer: fac.part_patient - (fac.montant_regle_patient || 0),
                            statutPaiement: fac.statut_paiement_patient,
                            modePaiement: fac.moyen_paiement,
                          }}
                        />
                        {!estPaye && (
                          <form
                            action={async () => {
                              'use server'
                              await encaisserFacture(fac.id, 'especes')
                            }}
                          >
                            <button
                              type="submit"
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold transition-colors cursor-pointer"
                            >
                              Encaisser
                            </button>
                          </form>
                        )}
                      </div>
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
