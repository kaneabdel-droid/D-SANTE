import { getConsultations, getServicesMedicaux } from './actions'
import { getPatients } from '../patients/actions'
import NouvelleConsultationModal from './NouvelleConsultationModal'
import ConsultationRowActions from './ConsultationRowActions'
import Link from 'next/link'
import {
  Stethoscope, Search, Pill, FileText, Calendar,
  User, CheckCircle2, AlertCircle, Filter, Sparkles
} from 'lucide-react'

export default async function ConsultationsPage(props: {
  searchParams: Promise<{ type?: string; patient_id?: string }>
}) {
  const searchParams = await props.searchParams
  const selectedType = searchParams.type || 'tous'
  const patientId = searchParams.patient_id

  const [{ consultations, error }, { services }, { patients }] = await Promise.all([
    getConsultations(selectedType, patientId),
    getServicesMedicaux(),
    getPatients(),
  ])

  const aDesConsultationsReelles = Boolean(consultations && consultations.length > 0)

  // Données de secours / démo indicatives en filigrane si base neuve
  const consultationsAffichees = aDesConsultationsReelles
    ? consultations
    : [
        {
          id: 'demo-cs-1',
          numero_consultation: 'CS-EX-0012',
          date_consultation: '2026-10-30',
          type_consultation: 'generale',
          motif: 'Fièvre, céphalées, courbatures depuis 48h',
          diagnostic_principal: 'Accès palustre simple',
          code_cim10: 'B54',
          conduite_a_tenir: 'CTA 3 jours, paracétamol si fièvre > 38.5°C',
          patients: {
            nom: 'Diallo',
            prenom: 'Aminata',
            ipp: 'PAT-EX-001',
            sexe: 'F',
            date_naissance: '1992-04-15',
          },
          prescriptions: [
            {
              id: 'ord-1',
              numero_ordonnance: 'ORD-EX-0012',
              lignes_prescriptions: [
                { id: 'l1', designation: 'Artéméther/Luméfantrine 20/120mg', posologie: '4 cp/j pendant 3j' },
                { id: 'l2', designation: 'Paracétamol 1g comprimé', posologie: '1 cp toutes les 6h en cas de douleur/fièvre' },
              ],
            },
          ],
        },
        {
          id: 'demo-cs-2',
          numero_consultation: 'CS-EX-0013',
          date_consultation: '2026-10-29',
          type_consultation: 'prenatale',
          motif: 'Consultation prénatale du 3ème trimestre',
          diagnostic_principal: 'Grossesse évolutive de 32 SA sans complication',
          code_cim10: 'Z34.8',
          conduite_a_tenir: 'Continuer fer/folates, repos, RDV échographie du T3',
          patients: {
            nom: 'Ba',
            prenom: 'Aïssatou',
            ipp: 'PAT-EX-003',
            sexe: 'F',
            date_naissance: '2001-08-05',
          },
          prescriptions: [
            {
              id: 'ord-2',
              numero_ordonnance: 'ORD-EX-0013',
              lignes_prescriptions: [
                { id: 'l3', designation: 'Fer + Acide Folique', posologie: '1 comprimé par jour' },
              ],
            },
          ],
        },
      ]

  const typeLabels: Record<string, string> = {
    generale: 'Médecine Générale',
    urgence: 'Urgence',
    prenatale: 'CPN / Prénatale',
    pediatrique: 'Pédiatrie',
    specialiste: 'Spécialiste',
  }

  return (
    <div className="space-y-6">
      {/* Entête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-foreground">
            Consultations Médicales & Ordonnances
          </h2>
          <p className="text-xs text-foreground-muted">
            Diagnostics cliniques (CIM-10), examens médicaux et génération d&apos;ordonnances.
          </p>
        </div>

        <NouvelleConsultationModal patients={patients || []} services={services || []} />
      </div>

      {/* Bannière filigrane sans impact */}
      {!aDesConsultationsReelles && (
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 rounded-2xl text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              <strong>Exemples en filigrane :</strong> Votre établissement ne compte aucune consultation pour le moment. Les données ci-dessous sont présentées à titre indicatif et sans impact. Cliquez sur « Nouvelle Consultation » pour enregistrer votre premier diagnostic réel.
            </span>
          </div>
        </div>
      )}

      {/* Barre de filtres */}
      <div className="bg-surface p-4 rounded-2xl border border-surface-border shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-foreground-muted flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Types :
          </span>
          {['tous', 'generale', 'urgence', 'prenatale', 'pediatrique'].map((t) => (
            <Link
              key={t}
              href={`/consultations?type=${t}${patientId ? `&patient_id=${patientId}` : ''}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedType === t
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-border/40 text-foreground-muted hover:bg-surface-border hover:text-foreground'
              }`}
            >
              {t === 'tous' ? 'Toutes' : typeLabels[t] || t}
            </Link>
          ))}
        </div>

        {patientId && (
          <Link
            href="/consultations"
            className="text-xs text-primary font-bold hover:underline self-center"
          >
            ✕ Réinitialiser le filtre patient
          </Link>
        )}
      </div>

      {error && (
        <div className="p-4 bg-danger/10 border border-danger/20 text-danger rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Liste des Consultations */}
      <div className="space-y-4">
        {consultationsAffichees.map((c: any) => {
          const pat = c.patients
          const ord = c.prescriptions?.[0]
          const lignes = ord?.lignes_prescriptions || []

          return (
            <div
              key={c.id}
              className={`rounded-3xl border border-surface-border p-4 sm:p-5 shadow-xs transition-all ${
                !aDesConsultationsReelles
                  ? 'opacity-70 bg-amber-500/5 hover:bg-amber-500/10'
                  : 'bg-surface hover:border-primary/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-surface-border/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold font-mono text-xs shrink-0">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-foreground text-sm sm:text-base">
                        {pat ? `${pat.nom} ${pat.prenom}` : 'Patient non rattaché'}
                      </h4>
                      {pat?.ipp && (
                        <span className="font-mono text-xs text-primary font-bold bg-primary/5 px-2 py-0.5 rounded-md">
                          {pat.ipp}
                        </span>
                      )}
                      {!aDesConsultationsReelles && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25">
                          Exemple
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-foreground-muted flex items-center gap-2 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(c.date_consultation || c.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                      <span>•</span>
                      <span className="capitalize font-medium text-foreground">
                        {typeLabels[c.type_consultation] || c.type_consultation}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <ConsultationRowActions
                    consultation={c}
                    isExempleFiligrane={!aDesConsultationsReelles}
                  />
                </div>
              </div>

              {/* Contenu Diagnostic & Motif */}
              <div className="mt-3.5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold text-foreground-muted uppercase tracking-wider">
                    Motif de Consultation
                  </p>
                  <p className="text-foreground font-medium bg-background/50 p-2.5 rounded-xl border border-surface-border/40">
                    {c.motif}
                  </p>

                  {c.diagnostic_principal && (
                    <div className="pt-1 flex items-center gap-2">
                      <span className="font-bold text-foreground">Diagnostic :</span>
                      <span className="font-semibold text-primary">{c.diagnostic_principal}</span>
                      {c.code_cim10 && (
                        <span className="font-mono text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                          CIM-10 : {c.code_cim10}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold text-foreground-muted uppercase tracking-wider">
                    Conduite à Tenir & Prescription
                  </p>
                  <p className="text-foreground-muted bg-background/50 p-2.5 rounded-xl border border-surface-border/40">
                    {c.conduite_a_tenir || 'Aucune consigne spécifique renseignée.'}
                  </p>

                  {lignes.length > 0 && (
                    <div className="pt-1 text-[11px] text-foreground flex items-center gap-1.5 flex-wrap">
                      <Pill className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="font-bold">Prescription :</span>
                      {lignes.map((l: any, idx: number) => (
                        <span key={l.id || idx} className="bg-surface-border/50 px-2 py-0.5 rounded text-[10px]">
                          {l.designation} {l.posologie ? `(${l.posologie})` : ''}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
