import { getLitsEtHospitalisations } from './actions'
import { getPatients } from '../patients/actions'
import AdmissionModal from './AdmissionModal'
import NouveauLitModal from './NouveauLitModal'
import HospitalisationRowActions from './HospitalisationRowActions'
import {
  BedDouble, CheckCircle2, Clock, AlertTriangle,
  User, Calendar, LogOut, ArrowRight, Activity, Sparkles
} from 'lucide-react'

export default async function HospitalisationPage() {
  const [{ lits, hospitalisations }, { patients }] = await Promise.all([
    getLitsEtHospitalisations(),
    getPatients(),
  ])

  const aDesLitsReels = Boolean(lits && lits.length > 0)
  const aDesHospitalisationsReelles = Boolean(hospitalisations && hospitalisations.length > 0)
  const estBaseNeuve = !aDesLitsReels && !aDesHospitalisationsReelles

  // Données indicatives d'exemple en filigrane si base neuve
  const litsAffiches = aDesLitsReels
    ? lits
    : [
        { id: 'lit-1', numero_lit: 'L101', chambre: 'Chambre 1', categorie: 'standard', statut: 'occupe' },
        { id: 'lit-2', numero_lit: 'L102', chambre: 'Chambre 1', categorie: 'standard', statut: 'libre' },
        { id: 'lit-3', numero_lit: 'L103', chambre: 'Chambre 2', categorie: 'standard', statut: 'libre' },
        { id: 'lit-4', numero_lit: 'VIP-01', chambre: 'Suite VIP 1', categorie: 'vip', statut: 'occupe' },
        { id: 'lit-5', numero_lit: 'USI-01', chambre: 'Soins Intensifs', categorie: 'soins_intensifs', statut: 'occupe' },
        { id: 'lit-6', numero_lit: 'USI-02', chambre: 'Soins Intensifs', categorie: 'soins_intensifs', statut: 'nettoyage' },
      ]

  const hospitalisationsAffichees = aDesHospitalisationsReelles
    ? hospitalisations
    : [
        {
          id: 'hosp-1',
          numero_sejour: 'SEJ-EX-001',
          date_entree: '2026-10-28T09:30:00Z',
          motif_admission: 'Pneumopathie infectieuse avec désaturation',
          statut: 'en_cours',
          lit_id: 'lit-1',
          patients: { nom: 'Diallo', prenom: 'Oumar', ipp: 'PAT-EX-001', groupe_sanguin: 'O+' },
          lits: { numero_lit: 'L101', chambre: 'Chambre 1' },
        },
        {
          id: 'hosp-2',
          numero_sejour: 'SEJ-EX-002',
          date_entree: '2026-10-29T14:15:00Z',
          motif_admission: 'Surveillance post-césarienne programmée',
          statut: 'en_cours',
          lit_id: 'lit-4',
          patients: { nom: 'Ba', prenom: 'Aïssatou', ipp: 'PAT-EX-003', groupe_sanguin: 'A-' },
          lits: { numero_lit: 'VIP-01', chambre: 'Suite VIP 1' },
        },
      ]

  const litsLibres = litsAffiches.filter((l: any) => l.statut === 'libre')

  const statutCouleurs: Record<string, { badge: string; card: string; label: string }> = {
    libre: {
      badge: 'bg-emerald-500 text-white',
      card: 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500',
      label: 'Disponible',
    },
    occupe: {
      badge: 'bg-indigo-600 text-white',
      card: 'border-indigo-500/30 bg-indigo-500/5 hover:border-indigo-500',
      label: 'Occupé',
    },
    nettoyage: {
      badge: 'bg-amber-500 text-white',
      card: 'border-amber-500/30 bg-amber-500/5 hover:border-amber-500',
      label: 'Désinfection',
    },
    maintenance: {
      badge: 'bg-danger text-white',
      card: 'border-danger/30 bg-danger/5 hover:border-danger',
      label: 'Hors service',
    },
  }

  return (
    <div className="space-y-6">
      {/* Entête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-foreground">
            Hospitalisation & Gestion des Lits
          </h2>
          <p className="text-xs text-foreground-muted">
            Occupation en temps réel, admissions cliniques et clôtures de séjours.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <NouveauLitModal />
          <AdmissionModal patients={patients || []} litsDisponibles={litsLibres} />
        </div>
      </div>

      {/* Bannière filigrane sans impact */}
      {estBaseNeuve && (
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 rounded-2xl text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              <strong>Exemples en filigrane :</strong> Votre établissement ne compte aucun lit ni séjour enregistré pour le moment. Les éléments ci-dessous sont présentés à titre indicatif et sans impact. Cliquez sur « Ajouter un Lit » ou « Nouvelle Admission » pour configurer votre service.
            </span>
          </div>
        </div>
      )}

      {/* Plan Visuel des Lits */}
      <div className="bg-surface p-5 sm:p-6 rounded-3xl border border-surface-border shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-foreground text-sm sm:text-base flex items-center gap-2">
            <BedDouble className="w-5 h-5 text-primary" />
            Plan de Chambre & Disponibilité
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-emerald-600">
              {aDesLitsReels ? litsLibres.length : 0} libre(s)
            </span>
            <span className="text-foreground-muted">/</span>
            <span className="font-bold text-foreground">
              {aDesLitsReels ? litsAffiches.length : 0} lit(s)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {litsAffiches.map((lit: any) => {
            const st = statutCouleurs[lit.statut] || statutCouleurs.libre

            return (
              <div
                key={lit.id}
                className={`p-3 rounded-2xl border transition-all ${st.card} ${
                  estBaseNeuve ? 'opacity-70' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono font-black text-sm text-foreground">
                    {lit.numero_lit}
                  </span>
                  <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full ${st.badge}`}>
                    {st.label}
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-foreground truncate">
                  {lit.chambre}
                </p>
                <p className="text-[10px] text-foreground-muted capitalize">
                  {lit.categorie?.replace('_', ' ')}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Séjours en cours */}
      <div className="space-y-3">
        <h3 className="font-bold text-foreground text-sm sm:text-base flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          Patients Actuellement Hospitalisés
        </h3>

        <div className="space-y-3">
          {hospitalisationsAffichees.map((h: any) => {
            const pat = h.patients
            const lit = h.lits

            return (
              <div
                key={h.id}
                className={`p-4 sm:p-5 rounded-3xl border border-surface-border shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${
                  estBaseNeuve
                    ? 'opacity-70 bg-amber-500/5 hover:bg-amber-500/10'
                    : 'bg-surface hover:border-primary/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-sm sm:text-base">
                        {pat?.nom} {pat?.prenom}
                      </span>
                      {pat?.ipp && (
                        <span className="font-mono text-xs text-primary font-bold bg-primary/5 px-2 py-0.5 rounded-md">
                          {pat.ipp}
                        </span>
                      )}
                      {estBaseNeuve && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25">
                          Exemple
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-foreground-muted mt-0.5">
                      {h.motif_admission}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs self-stretch sm:self-auto justify-between sm:justify-end">
                  <div className="text-right hidden sm:block">
                    <span className="font-bold text-foreground block">
                      {lit?.chambre} • Lit {lit?.numero_lit}
                    </span>
                    <span className="text-[11px] text-foreground-muted">
                      Admis le {new Date(h.date_entree).toLocaleDateString('fr-FR')}
                    </span>
                  </div>

                  <HospitalisationRowActions
                    hospitalisation={h}
                    isExempleFiligrane={estBaseNeuve}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
