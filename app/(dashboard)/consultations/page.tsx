import { getConsultations, getServicesMedicaux } from './actions'
import { getPatients } from '../patients/actions'
import NouvelleConsultationModal from './NouvelleConsultationModal'
import { DownloadOrdonnanceButton } from '@/components/DownloadOrdonnanceButton'
import Link from 'next/link'
import {
  Stethoscope, Search, Pill, FileText, Calendar,
  User, CheckCircle2, AlertCircle, Filter, Printer
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

  // Données de secours / démo si base neuve
  const consultationsAffichees =
    consultations && consultations.length > 0
      ? consultations
      : [
        {
          id: 'demo-cs-1',
          numero_consultation: 'CS-2610-0012',
          date_consultation: '2026-10-30',
          type_consultation: 'generale',
          motif: 'Fièvre, céphalées, courbatures depuis 48h',
          diagnostic_principal: 'Accès palustre simple',
          code_cim10: 'B54',
          conduite_a_tenir: 'CTA 3 jours, paracétamol si fièvre > 38.5°C',
          patients: {
            nom: 'Diallo',
            prenom: 'Aminata',
            ipp: 'PAT-2610-001',
            sexe: 'F',
            date_naissance: '1992-04-15',
          },
          prescriptions: [
            {
              id: 'ord-1',
              numero_ordonnance: 'ORD-2610-0012',
              lignes_prescriptions: [
                { id: 'l1', designation: 'Artéméther/Luméfantrine 20/120mg', posologie: '4 cp/j pendant 3j' },
                { id: 'l2', designation: 'Paracétamol 1g comprimé', posologie: '1 cp toutes les 6h en cas de douleur/fièvre' },
              ],
            },
          ],
        },
        {
          id: 'demo-cs-2',
          numero_consultation: 'CS-2610-0013',
          date_consultation: '2026-10-29',
          type_consultation: 'prenatale',
          motif: 'Consultation prénatale du 3ème trimestre',
          diagnostic_principal: 'Grossesse évolutive de 32 SA sans complication',
          code_cim10: 'Z34.8',
          conduite_a_tenir: 'Continuer fer/folates, repos, RDV échographie du T3',
          patients: {
            nom: 'Ba',
            prenom: 'Aïssatou',
            ipp: 'PAT-2610-003',
            sexe: 'F',
            date_naissance: '2001-08-05',
          },
          prescriptions: [
            {
              id: 'ord-2',
              numero_ordonnance: 'ORD-2610-0013',
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
            Observations cliniques, diagnostics CIM-10 et prescriptions d&apos;ordonnances sécurisées.
          </p>
        </div>

        <NouvelleConsultationModal
          patients={patients || []}
          services={services || []}
          preselectedPatientId={patientId}
        />
      </div>

      {/* Filtres par Spécialité / Type */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-foreground-muted mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Type :
        </span>
        {[
          { id: 'tous', label: 'Toutes les consultations' },
          { id: 'generale', label: 'Générale' },
          { id: 'urgence', label: 'Urgences' },
          { id: 'prenatale', label: 'Prénatale (CPN)' },
          { id: 'pediatrique', label: 'Pédiatrie' },
          { id: 'specialiste', label: 'Spécialistes' },
        ].map((t) => {
          const isActive = selectedType === t.id
          return (
            <Link
              key={t.id}
              href={`/consultations?type=${t.id}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${isActive
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface text-foreground-muted hover:text-foreground border border-surface-border'
                }`}
            >
              {t.label}
            </Link>
          )
        })}
      </div>

      {error && (
        <div className="p-4 bg-danger/10 border border-danger/20 text-danger rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Liste des Consultations */}
      <div className="space-y-4">
        {consultationsAffichees.map((cs: any) => {
          const pat = cs.patients
          const presc = cs.prescriptions?.[0]
          const lignes = presc?.lignes_prescriptions || []

          return (
            <div
              key={cs.id}
              className="bg-surface rounded-3xl p-5 sm:p-6 border border-surface-border shadow-xs space-y-4 hover:border-primary/40 transition-colors"
            >
              {/* En-tête de la consultation */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-surface-border/60 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-foreground block text-sm">
                      {pat ? `${pat.nom} ${pat.prenom}` : 'Patient non renseigné'}
                    </span>
                    <span className="text-[11px] font-mono text-primary font-bold">
                      {pat?.ipp} • {cs.numero_consultation}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase">
                    {typeLabels[cs.type_consultation] || cs.type_consultation}
                  </span>
                  <span className="text-xs text-foreground-muted font-mono">
                    {cs.date_consultation}
                  </span>
                </div>
              </div>

              {/* Détails cliniques */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-semibold text-foreground-muted block mb-0.5">
                    Motif de Consultation
                  </span>
                  <p className="text-foreground font-medium">{cs.motif}</p>
                </div>

                <div>
                  <span className="font-semibold text-foreground-muted block mb-0.5">
                    Diagnostic Retenu (CIM-10)
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{cs.diagnostic_principal}</span>
                    {cs.code_cim10 && (
                      <span className="px-2 py-0.5 rounded bg-surface-border text-foreground font-mono text-[10px] font-bold">
                        {cs.code_cim10}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {cs.conduite_a_tenir && (
                <div className="text-xs p-3 rounded-2xl bg-background border border-surface-border/50">
                  <span className="font-semibold text-foreground-muted block text-[11px] mb-0.5">
                    Conduite à tenir / Consignes
                  </span>
                  <p className="text-foreground font-medium">{cs.conduite_a_tenir}</p>
                </div>
              )}

              {/* Ordonnance / Prescriptions rattachées */}
              {lignes.length > 0 && (
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Pill className="w-4 h-4 text-primary" />
                      Ordonnance Médicale ({presc?.numero_ordonnance})
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-foreground-muted mr-1">
                        {lignes.length} spécialité(s)
                      </span>
                      <DownloadOrdonnanceButton
                        data={{
                          structureNom: 'D-Santé Médical',
                          medecinNom: 'Médecin Traitant',
                          patientNom: pat?.nom || 'Patient',
                          patientPrenom: pat?.prenom || '',
                          patientIpp: pat?.ipp || 'N/A',
                          datePrescription: presc?.date_prescription || cs.date_consultation || new Date().toISOString().split('T')[0],
                          lignes: lignes.map((lig: any) => ({
                            medicamentNom: lig.designation,
                            posologie: lig.posologie,
                            dureeJours: lig.duree_jours || 7,
                            instructions: lig.instructions,
                          })),
                          notes: cs.conduite_a_tenir,
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {lignes.map((l: any, idx: number) => (
                      <div
                        key={l.id || idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between text-xs p-2 rounded-xl bg-surface border border-surface-border/50 gap-1"
                      >
                        <span className="font-bold text-foreground">
                          {idx + 1}. {l.designation}
                        </span>
                        <span className="text-foreground-muted font-medium">
                          {l.posologie}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
