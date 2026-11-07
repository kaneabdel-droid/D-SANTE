import Link from 'next/link'
import { DownloadOrdonnanceButton } from '@/components/DownloadOrdonnanceButton'
import { PrendreRdvModal } from './PrendreRdvModal'
import {
  HeartPulse, Search, Pill, Calendar, Clock,
  ShieldCheck, FileText, ArrowRight, Download, Stethoscope
} from 'lucide-react'

export default async function EspacePatientPage(props: {
  searchParams: Promise<{ ipp?: string; tel?: string }>
}) {
  const searchParams = await props.searchParams
  const ippRecherche = searchParams.ipp || ''

  // Résultat démo si recherche renseignée
  const ordonnanceTrouvee = ippRecherche.trim().length > 0 ? {
    ipp: ippRecherche,
    patientNom: 'Diallo Aminata',
    medecin: 'Dr. Cheikh Anta Diop',
    date: '30 Octobre 2026',
    numeroOrdonnance: 'ORD-2610-0012',
    medicaments: [
      { nom: 'Artéméther / Luméfantrine 20/120mg', posologie: '4 comprimés par jour pendant 3 jours au cours des repas' },
      { nom: 'Paracétamol 1000mg comprimé', posologie: '1 comprimé toutes les 6 heures en cas de fièvre > 38.5°C' },
    ],
    instructions: 'Repos strict, boire abondamment de l’eau. Revenir en consultation si persistance de la fièvre après 72h.',
  } : null

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header Portail */}
      <header className="bg-surface border-b border-surface-border sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-xs">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black font-heading text-foreground">D-SANTÉ</span>
              <span className="text-[10px] text-primary font-bold ml-1.5 uppercase">Espace Patient</span>
            </div>
          </Link>

          <Link
            href="/login"
            className="text-xs font-bold text-foreground-muted hover:text-foreground px-3 py-1.5 rounded-xl border border-surface-border transition-colors"
          >
            Accès Professionnel
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl w-full mx-auto px-4 py-10 space-y-8 flex-1">
        {/* Titre & Introduction */}
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            Portail Santé Patient Sécurisé
          </span>
          <h1 className="text-2xl sm:text-4xl font-black font-heading text-foreground">
            Consultez votre Ordonnance & Prenez RDV
          </h1>
          <p className="text-xs sm:text-sm text-foreground-muted max-w-lg mx-auto">
            Accédez à vos prescriptions médicales en saisissant votre Identifiant Permanent de Patient (IPP).
          </p>
        </div>

        {/* Formulaire de recherche d'ordonnance */}
        <div className="bg-surface p-6 rounded-3xl border border-surface-border shadow-xs">
          <form method="get" className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Votre Identifiant Patient Unique (IPP)
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
                <input
                  type="text"
                  name="ipp"
                  defaultValue={ippRecherche}
                  required
                  placeholder="ex: PAT-2610-001"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-surface-border bg-background text-sm font-mono text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <span className="text-[11px] text-foreground-muted mt-1 block">
                Votre numéro IPP figure sur votre ticket de caisse ou carnet de santé.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-primary text-white font-bold text-xs sm:text-sm hover:bg-primary-hover shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Accéder à mes Ordonnances</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Affichage de l'ordonnance si trouvée */}
        {ordonnanceTrouvee && (
          <div className="bg-surface rounded-3xl p-6 sm:p-8 border-2 border-primary/30 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-surface-border pb-4">
              <div>
                <span className="text-[11px] font-mono text-primary font-bold">
                  {ordonnanceTrouvee.numeroOrdonnance}
                </span>
                <h3 className="text-lg font-bold text-foreground">
                  Ordonnance de {ordonnanceTrouvee.patientNom}
                </h3>
                <p className="text-xs text-foreground-muted">
                  Prescrite le {ordonnanceTrouvee.date} par {ordonnanceTrouvee.medecin}
                </p>
              </div>

              <DownloadOrdonnanceButton
                variant="primary"
                size="md"
                data={{
                  structureNom: 'D-Santé Médical',
                  medecinNom: ordonnanceTrouvee.medecin,
                  patientNom: ordonnanceTrouvee.patientNom,
                  patientPrenom: '',
                  patientIpp: ordonnanceTrouvee.ipp,
                  datePrescription: ordonnanceTrouvee.date,
                  lignes: ordonnanceTrouvee.medicaments.map((m) => ({
                    medicamentNom: m.nom,
                    posologie: m.posologie,
                    dureeJours: 5,
                  })),
                  notes: ordonnanceTrouvee.instructions,
                }}
              />
            </div>

            {/* Médicaments */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground-muted flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-primary" />
                Prescriptions Médicamenteuses :
              </h4>

              <div className="space-y-2">
                {ordonnanceTrouvee.medicaments.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-background border border-surface-border/60 text-xs space-y-1"
                  >
                    <span className="font-bold text-foreground text-sm block">
                      {idx + 1}. {m.nom}
                    </span>
                    <span className="text-foreground-muted font-medium">
                      Posologie : {m.posologie}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Consignes */}
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-xs space-y-1">
              <span className="font-bold text-primary block">Conseils du Praticien :</span>
              <p className="text-foreground-muted leading-relaxed">
                {ordonnanceTrouvee.instructions}
              </p>
            </div>
          </div>
        )}

        {/* Section Prise de Rendez-vous en Ligne */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-surface-border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase">
              Sans Attente
            </span>
            <h3 className="text-lg font-bold text-foreground">
              Besoin d&apos;une consultation avec un praticien ?
            </h3>
            <p className="text-xs text-foreground-muted">
              Prenez votre rendez-vous en ligne en quelques clics auprès de nos spécialistes.
            </p>
          </div>

          <PrendreRdvModal />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-surface-border bg-surface text-center text-xs text-foreground-muted">
        <p>© {new Date().getFullYear()} Demba Solution • D-SANTÉ. Espace Patient Sécurisé.</p>
      </footer>
    </div>
  )
}
