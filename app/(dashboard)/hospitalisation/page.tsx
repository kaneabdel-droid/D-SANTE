import { getLitsEtHospitalisations } from './actions'
import { getPatients } from '../patients/actions'
import AdmissionModal from './AdmissionModal'
import CloturerSortieModal from './CloturerSortieModal'
import {
  BedDouble, CheckCircle2, Clock, AlertTriangle,
  User, Calendar, LogOut, ArrowRight, Activity
} from 'lucide-react'

export default async function HospitalisationPage() {
  const [{ lits, hospitalisations }, { patients }] = await Promise.all([
    getLitsEtHospitalisations(),
    getPatients(),
  ])

  // Données de secours / démo si base neuve
  const litsAffiches = lits && lits.length > 0 ? lits : [
    { id: 'lit-1', numero_lit: 'L101', chambre: 'Chambre 1', categorie: 'standard', statut: 'occupe' },
    { id: 'lit-2', numero_lit: 'L102', chambre: 'Chambre 1', categorie: 'standard', statut: 'libre' },
    { id: 'lit-3', numero_lit: 'L103', chambre: 'Chambre 2', categorie: 'standard', statut: 'libre' },
    { id: 'lit-4', numero_lit: 'VIP-01', chambre: 'Suite VIP 1', categorie: 'vip', statut: 'occupe' },
    { id: 'lit-5', numero_lit: 'USI-01', chambre: 'Soins Intensifs', categorie: 'soins_intensifs', statut: 'occupe' },
    { id: 'lit-6', numero_lit: 'USI-02', chambre: 'Soins Intensifs', categorie: 'soins_intensifs', statut: 'nettoyage' },
  ]

  const hospitalisationsAffichees = hospitalisations && hospitalisations.length > 0 ? hospitalisations : [
    {
      id: 'hosp-1',
      numero_sejour: 'SEJ-2610-001',
      date_entree: '2026-10-28T09:30:00Z',
      motif_admission: 'Pneumopathie infectieuse avec désaturation',
      statut: 'en_cours',
      lit_id: 'lit-1',
      patients: { nom: 'Diallo', prenom: 'Oumar', ipp: 'PAT-2610-001', groupe_sanguin: 'O+' },
      lits: { numero_lit: 'L101', chambre: 'Chambre 1' },
    },
    {
      id: 'hosp-2',
      numero_sejour: 'SEJ-2610-002',
      date_entree: '2026-10-29T14:15:00Z',
      motif_admission: 'Surveillance post-césarienne programmée',
      statut: 'en_cours',
      lit_id: 'lit-4',
      patients: { nom: 'Ba', prenom: 'Aïssatou', ipp: 'PAT-2610-003', groupe_sanguin: 'A-' },
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
      badge: 'bg-amber-400 text-black',
      card: 'border-amber-400/30 bg-amber-400/5 hover:border-amber-400',
      label: 'Désinfection',
    },
    maintenance: {
      badge: 'bg-red-500 text-white',
      card: 'border-red-500/30 bg-red-500/5 hover:border-red-500',
      label: 'Maintenance',
    },
  }

  return (
    <div className="space-y-6">
      {/* Entête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-foreground">
            Hospitalisation & Plan des Lits
          </h2>
          <p className="text-xs text-foreground-muted">
            Gestion des chambres, séjours en cours, tournées de soins et libération de lits.
          </p>
        </div>

        <AdmissionModal
          patients={patients || []}
          litsDisponibles={litsLibres}
        />
      </div>

      {/* Cartographie Visuelle des Lits */}
      <div className="bg-surface rounded-3xl p-6 border border-surface-border shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-heading text-foreground flex items-center gap-2">
            <BedDouble className="w-4 h-4 text-indigo-600" />
            Occupation des Lits en Temps Réel ({litsLibres.length} libre(s) sur {litsAffiches.length})
          </h3>

          <div className="flex items-center gap-2 text-[10px] font-bold">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
              ● Libre
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600">
              ● Occupé
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">
              ● Désinfection
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {litsAffiches.map((lit: any) => {
            const conf = statutCouleurs[lit.statut] || statutCouleurs.libre

            return (
              <div
                key={lit.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between h-28 ${conf.card}`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-black font-heading text-foreground">
                    {lit.numero_lit}
                  </span>
                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md ${conf.badge}`}>
                    {conf.label}
                  </span>
                </div>

                <div className="text-[11px] leading-tight">
                  <span className="text-foreground font-semibold block truncate">
                    {lit.chambre}
                  </span>
                  <span className="text-[10px] text-foreground-muted capitalize">
                    {lit.categorie?.replace('_', ' ')}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tableau des Séjours d'Hospitalisation en Cours */}
      <div className="bg-surface rounded-3xl border border-surface-border overflow-hidden shadow-xs">
        <div className="p-4 border-b border-surface-border flex items-center justify-between">
          <h3 className="text-sm font-bold font-heading text-foreground">
            Séjours d&apos;Hospitalisation en Cours ({hospitalisationsAffichees.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-background text-foreground-muted uppercase tracking-wider text-[11px] font-bold border-b border-surface-border">
              <tr>
                <th className="py-3 px-4">Patient (IPP)</th>
                <th className="py-3 px-4">Lit & Chambre</th>
                <th className="py-3 px-4">Date d&apos;Entrée</th>
                <th className="py-3 px-4">Motif d&apos;Admission</th>
                <th className="py-3 px-4 text-right">Action Soignante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {hospitalisationsAffichees.map((h: any) => {
                const pat = h.patients
                const lit = h.lits

                return (
                  <tr key={h.id} className="hover:bg-background/40 transition-colors">
                    {/* Patient */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-foreground block text-sm">
                        {pat ? `${pat.nom} ${pat.prenom}` : 'Patient non renseigné'}
                      </span>
                      <span className="font-mono text-[11px] text-primary font-bold">
                        {pat?.ipp} • {h.numero_sejour}
                      </span>
                    </td>

                    {/* Lit */}
                    <td className="py-3.5 px-4 text-xs">
                      <span className="font-mono font-bold text-indigo-600 block">
                        Lit {lit?.numero_lit}
                      </span>
                      <span className="text-[11px] text-foreground-muted">
                        {lit?.chambre}
                      </span>
                    </td>

                    {/* Date entrée */}
                    <td className="py-3.5 px-4 font-mono text-xs text-foreground-muted">
                      {new Date(h.date_entree).toLocaleDateString('fr-FR')}
                    </td>

                    {/* Motif */}
                    <td className="py-3.5 px-4 text-xs font-medium text-foreground max-w-xs">
                      {h.motif_admission}
                    </td>

                    {/* Action libération */}
                    <td className="py-3.5 px-4 text-right">
                      <CloturerSortieModal hospitalisation={h} />
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
