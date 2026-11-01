import { getPatientComplet, mettreAJourDossierMedical } from '../actions'
import Link from 'next/link'
import {
  User, Activity, Stethoscope, BedDouble, Receipt,
  ShieldAlert, ShieldCheck, Phone, Calendar, HeartPulse,
  Pill, AlertCircle, Clock, CheckCircle2, ArrowLeft, Save
} from 'lucide-react'

export default async function PatientDetailPage(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params
  const patientId = params.id

  const data = await getPatientComplet(patientId)

  // Patient de démonstration si non trouvé dans la base
  const patient = data?.patient || {
    id: patientId,
    nom: 'Diallo',
    prenom: 'Aminata',
    ipp: 'PAT-2610-001',
    date_naissance: '1992-04-15',
    sexe: 'F',
    groupe_sanguin: 'O+',
    telephone: '+221 77 452 10 99',
    adresse: 'Médina, Rue 22 x 15, Dakar',
    personne_contact_nom: 'Mamadou Diallo (Époux)',
    personne_contact_telephone: '+221 77 600 44 22',
    taux_couverture: 80,
    organismes_assurances: { nom: 'IPM Sonatel', type_organisme: 'ipm' },
  }

  const dossier = data?.dossier || {
    allergies: ['Pénicilline', 'Aspirine'],
    antecedents_medicaux: 'Asthme intermittent modéré depuis l’enfance',
    antecedents_chirurgicaux: 'Appendicectomie en 2018',
    antecedents_familiaux: 'Mère diabétique de type 2, père hypertendu',
    traitements_chroniques: 'Salbutamol spray en cas de crise',
    remarques_praticien: 'Bien surveiller la fonction respiratoire lors des épisodes fébriles.',
  }

  const constantes = data?.constantes && data.constantes.length > 0 ? data.constantes : [
    {
      id: 'c1',
      tension_systolique: 120,
      tension_diastolique: 80,
      temperature: 37.2,
      pouls: 75,
      saturation_o2: 98,
      glycemie: 1.05,
      poids_kg: 68.5,
      imc: 23.1,
      douleur_eva: 1,
      niveau_triage: 'vert',
      created_at: new Date().toISOString(),
    },
  ]

  const consultations = data?.consultations && data.consultations.length > 0 ? data.consultations : [
    {
      id: 'cs1',
      numero_consultation: 'CS-2610-0012',
      date_consultation: '2026-10-30',
      type_consultation: 'generale',
      motif: 'Fièvre, céphalées, courbatures depuis 48h',
      diagnostic_principal: 'Accès palustre simple',
      code_cim10: 'B54',
      conduite_a_tenir: 'CTA 3 jours, repos strict et hydratation',
      prescriptions: [
        {
          numero_ordonnance: 'ORD-2610-0012',
          lignes_prescriptions: [
            { id: 'lp1', designation: 'Artéméther/Luméfantrine 20/120mg', posologie: '4 cp/j pendant 3j' },
            { id: 'lp2', designation: 'Paracétamol 1000mg', posologie: '1 cp en cas de fièvre > 38.5°C' },
          ],
        },
      ],
    },
  ]

  const calculerAge = (dateStr?: string) => {
    if (!dateStr) return '—'
    const diff = Date.now() - new Date(dateStr).getTime()
    const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
    return `${age} ans`
  }

  const formatCFA = (montant: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'decimal', maximumFractionDigits: 0 }).format(montant) + ' FCFA'

  return (
    <div className="space-y-6">
      {/* Retour & Navigation */}
      <div className="flex items-center gap-3">
        <Link
          href="/patients"
          className="p-2 rounded-xl bg-surface border border-surface-border text-foreground-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="text-xs font-mono font-bold text-primary">
            Dossier Patient #{patient.ipp}
          </span>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-foreground">
            {patient.nom} {patient.prenom}
          </h2>
        </div>
      </div>

      {/* Carte d'Identité Médicale & Alerte Allergies */}
      <div className="bg-surface rounded-3xl p-6 border border-surface-border shadow-xs space-y-4">
        {/* Bandeau d'alerte vitale : Allergies */}
        {dossier.allergies && dossier.allergies.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-danger/10 border border-danger/30 text-danger flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 shrink-0 animate-bounce" />
              <div>
                <span className="text-xs font-black uppercase tracking-wider block">
                  Alerte Médicale - Allergies Connues :
                </span>
                <span className="text-xs font-bold font-mono">
                  {Array.isArray(dossier.allergies) ? dossier.allergies.join(', ') : dossier.allergies}
                </span>
              </div>
            </div>
            <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-danger text-white">
              Vigilance Prescription
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-foreground-muted block mb-0.5 font-medium">État civil & Âge</span>
            <p className="font-bold text-foreground text-sm">
              {calculerAge(patient.date_naissance)} ({patient.sexe === 'F' ? 'Féminin' : 'Masculin'})
            </p>
            <span className="text-[11px] text-foreground-muted">Né(e) le {patient.date_naissance || '—'}</span>
          </div>

          <div>
            <span className="text-foreground-muted block mb-0.5 font-medium">Groupe Sanguin</span>
            <span className="inline-block px-3 py-1 rounded-xl bg-danger/10 text-danger font-mono font-black text-sm border border-danger/20">
              {patient.groupe_sanguin || 'Non renseigné'}
            </span>
          </div>

          <div>
            <span className="text-foreground-muted block mb-0.5 font-medium">Coordonnées</span>
            <p className="font-bold text-foreground font-mono">{patient.telephone || '—'}</p>
            <span className="text-[11px] text-foreground-muted truncate block">{patient.adresse || '—'}</span>
          </div>

          <div>
            <span className="text-foreground-muted block mb-0.5 font-medium">Couverture Tiers-Payant</span>
            {patient.organismes_assurances ? (
              <div>
                <span className="font-bold text-primary flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  {patient.organismes_assurances.nom}
                </span>
                <span className="text-[11px] text-foreground-muted">
                  Prise en charge à {patient.taux_couverture}%
                </span>
              </div>
            ) : (
              <span className="text-foreground-muted font-medium">Plein Tarif (100% Patient)</span>
            )}
          </div>
        </div>

        {/* Boutons d'action rapide soignant */}
        <div className="pt-3 border-t border-surface-border/60 flex flex-wrap items-center gap-2">
          <Link
            href={`/triage?patient_id=${patient.id}&ipp=${patient.ipp}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-danger/10 text-danger text-xs font-bold hover:bg-danger/20 transition-colors"
          >
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Prendre Constantes</span>
          </Link>

          <Link
            href={`/consultations?patient_id=${patient.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover shadow-xs transition-colors"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Nouvelle Consultation</span>
          </Link>

          <Link
            href={`/facturation?patient_id=${patient.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 text-xs font-bold hover:bg-amber-500/20 transition-colors"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Émettre Facture</span>
          </Link>
        </div>
      </div>

      {/* Grille : Antécédents Médicaux & Dernières Constantes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Antécédents & Terrain */}
        <div className="bg-surface rounded-3xl p-6 border border-surface-border shadow-xs space-y-4">
          <h3 className="text-base font-bold font-heading text-foreground flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-primary" />
            Dossier Médical & Antécédents
          </h3>

          <form
            action={async (formData: FormData) => {
              'use server'
              await mettreAJourDossierMedical(patientId, formData)
            }}
            className="space-y-3 text-xs"
          >
            <div>
              <label className="block font-semibold text-foreground mb-1">
                Allergies Médicamenteuses & Alimentaires (séparées par des virgules)
              </label>
              <input
                type="text"
                name="allergies"
                defaultValue={Array.isArray(dossier.allergies) ? dossier.allergies.join(', ') : dossier.allergies || ''}
                placeholder="ex: Pénicilline, AINS, Sulfamides"
                className="w-full p-2.5 rounded-xl border border-surface-border bg-background font-mono text-danger font-bold text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">
                Antécédents Médicaux (Diabète, HTA, Asthme...)
              </label>
              <textarea
                name="antecedents_medicaux"
                rows={2}
                defaultValue={dossier.antecedents_medicaux || ''}
                className="w-full p-2.5 rounded-xl border border-surface-border bg-background text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">
                Antécédents Chirurgicaux & Obstétricaux
              </label>
              <input
                type="text"
                name="antecedents_chirurgicaux"
                defaultValue={dossier.antecedents_chirurgicaux || ''}
                className="w-full p-2.5 rounded-xl border border-surface-border bg-background text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground mb-1">
                Traitements Chroniques en Cours
              </label>
              <input
                type="text"
                name="traitements_chroniques"
                defaultValue={dossier.traitements_chroniques || ''}
                className="w-full p-2.5 rounded-xl border border-surface-border bg-background text-xs"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-hover shadow-xs transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Mettre à Jour le Dossier</span>
              </button>
            </div>
          </form>
        </div>

        {/* Dernières Constantes Enregistrées */}
        <div className="bg-surface rounded-3xl p-6 border border-surface-border shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-heading text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-danger animate-pulse" />
              Historique des Constantes Vitales
            </h3>
            <span className="text-[11px] font-mono text-foreground-muted">
              {constantes.length} relevé(s)
            </span>
          </div>

          <div className="space-y-3">
            {constantes.map((c: any) => (
              <div
                key={c.id}
                className="p-3 rounded-2xl bg-background border border-surface-border/60 text-xs space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                    c.niveau_triage === 'rouge'
                      ? 'bg-danger text-white'
                      : c.niveau_triage === 'orange'
                      ? 'bg-orange-500 text-white'
                      : 'bg-emerald-500 text-white'
                  }`}>
                    Code {c.niveau_triage}
                  </span>
                  <span className="text-foreground-muted font-mono text-[11px]">
                    {new Date(c.created_at).toLocaleDateString('fr-FR')} à {new Date(c.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center font-mono">
                  <div className="p-1.5 bg-surface rounded-xl">
                    <span className="text-[10px] text-foreground-muted block font-sans">Tension</span>
                    <span className="font-bold text-foreground">{c.tension_systolique}/{c.tension_diastolique}</span>
                  </div>
                  <div className="p-1.5 bg-surface rounded-xl">
                    <span className="text-[10px] text-foreground-muted block font-sans">T°</span>
                    <span className="font-bold text-foreground">{c.temperature}°C</span>
                  </div>
                  <div className="p-1.5 bg-surface rounded-xl">
                    <span className="text-[10px] text-foreground-muted block font-sans">SpO2</span>
                    <span className="font-bold text-foreground">{c.saturation_o2}%</span>
                  </div>
                  <div className="p-1.5 bg-surface rounded-xl">
                    <span className="text-[10px] text-foreground-muted block font-sans">Pouls</span>
                    <span className="font-bold text-foreground">{c.pouls} bpm</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Historique des Consultations & Prescriptions */}
      <div className="bg-surface rounded-3xl p-6 border border-surface-border shadow-xs space-y-4">
        <h3 className="text-base font-bold font-heading text-foreground flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-primary" />
          Historique des Consultations Médicales & Ordonnances
        </h3>

        <div className="space-y-3">
          {consultations.map((cs: any) => {
            const presc = cs.prescriptions?.[0]
            const lignes = presc?.lignes_prescriptions || []

            return (
              <div
                key={cs.id}
                className="p-4 rounded-2xl bg-background border border-surface-border/60 text-xs space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-primary font-bold">{cs.numero_consultation}</span>
                    <h4 className="font-bold text-foreground text-sm mt-0.5">{cs.motif}</h4>
                  </div>
                  <span className="text-foreground-muted font-mono">{cs.date_consultation}</span>
                </div>

                <div className="p-2.5 bg-surface rounded-xl border border-surface-border/50">
                  <span className="text-[11px] text-foreground-muted block font-medium">Diagnostic retenu :</span>
                  <span className="font-bold text-foreground">{cs.diagnostic_principal}</span>
                  {cs.code_cim10 && (
                    <span className="ml-2 px-1.5 py-0.5 rounded bg-surface-border font-mono text-[10px]">
                      {cs.code_cim10}
                    </span>
                  )}
                </div>

                {lignes.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-primary flex items-center gap-1">
                      <Pill className="w-3.5 h-3.5" />
                      Prescription ({presc?.numero_ordonnance}) :
                    </span>
                    <div className="pl-4 space-y-1">
                      {lignes.map((l: any, idx: number) => (
                        <p key={l.id || idx} className="text-foreground-muted">
                          • <strong className="text-foreground">{l.designation}</strong> — {l.posologie}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

