import {
  Syringe, CheckCircle2, Clock, AlertCircle, Plus,
  User, Calendar, Activity, Pill
} from 'lucide-react'
import { getSoins } from './actions'
import { getPatients } from '../patients/actions'
import NouveauSoinModal from './NouveauSoinModal'
import SoinStatutToggle from './SoinStatutToggle'

export default async function SoinsPage() {
  const [{ soins }, { patients }] = await Promise.all([
    getSoins(),
    getPatients(),
  ])

  // Données de démonstration si aucun soin n'a encore été enregistré en base
  const mockSoins = [
    {
      id: 'soin-1',
      patientNom: 'Diallo Oumar',
      ipp: 'PAT-2610-001',
      typeSoin: 'perfusion',
      description: 'Pose perfusion Ringer Lactate 500ml + Vitamine C',
      soignant: 'Inf. Fall',
      heure: '14:30',
      statut: 'effectue',
      lit: 'Lit L101 (Chambre 1)',
    },
    {
      id: 'soin-2',
      patientNom: 'Ba Aïssatou',
      ipp: 'PAT-2610-003',
      typeSoin: 'injection',
      description: 'Injection intramusculaire Céftriaxone 1g',
      soignant: 'SF Diop',
      heure: '15:00',
      statut: 'planifie',
      lit: 'Suite VIP 1',
    },
    {
      id: 'soin-3',
      patientNom: 'Sow Fatoumata',
      ipp: 'PAT-2610-004',
      typeSoin: 'pansement',
      description: 'Réfection pansement plaie jambe droite stérile',
      soignant: 'Inf. Ndiaye',
      heure: '11:15',
      statut: 'effectue',
      lit: 'Urgence Box 2',
    },
  ]

  // Normalisation des soins (base de données Supabase vs données de secours)
  const listeSoins = soins && soins.length > 0 ? soins.map((s: any) => {
    // Extraction des métadonnées stockées dans observations si présentes
    let lit = 'Ambulatoire'
    let soignant = 'Équipe Soins'
    let cleanObs = s.observations || ''

    if (cleanObs.includes('Emplacement:')) {
      const match = cleanObs.match(/Emplacement:\s*([^|]+)/)
      if (match) lit = match[1].trim()
    }
    if (cleanObs.includes('Soignant:')) {
      const match = cleanObs.match(/Soignant:\s*([^|]+)/)
      if (match) soignant = match[1].trim()
    }

    const dateObj = s.date_soin ? new Date(s.date_soin) : new Date()
    const heure = dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

    const patientNom = s.patients
      ? `${s.patients.prenom || ''} ${s.patients.nom || ''}`.trim()
      : 'Patient'

    return {
      id: s.id,
      patientNom,
      ipp: s.patients?.ipp || 'PAT-N/A',
      typeSoin: s.type_soin || 'soin',
      description: s.description || 'Soin infirmier',
      soignant,
      heure,
      statut: s.statut || 'effectue',
      lit,
    }
  }) : mockSoins

  const typeBadges: Record<string, string> = {
    perfusion: 'bg-sky-500/10 text-sky-600',
    injection: 'bg-indigo-500/10 text-indigo-600',
    pansement: 'bg-amber-500/10 text-amber-600',
    nebulisation: 'bg-purple-500/10 text-purple-600',
    sondage: 'bg-teal-500/10 text-teal-600',
    prelevement: 'bg-rose-500/10 text-rose-600',
    autre: 'bg-gray-500/10 text-gray-600',
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-foreground">
            Carnet de Soins & Actes Infirmiers
          </h2>
          <p className="text-xs text-foreground-muted">
            Administration des traitements prescrits, injections, perfusions et pansements au chevet.
          </p>
        </div>

        {/* Modal d'enregistrement d'un nouveau soin */}
        <NouveauSoinModal patients={patients || []} />
      </div>

      <div className="bg-surface rounded-3xl border border-surface-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-background text-foreground-muted uppercase tracking-wider text-[11px] font-bold border-b border-surface-border">
              <tr>
                <th className="py-3 px-4">Type de Soin</th>
                <th className="py-3 px-4">Patient & Emplacement</th>
                <th className="py-3 px-4">Prescription & Description</th>
                <th className="py-3 px-4">Soignant & Heure</th>
                <th className="py-3 px-4 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {listeSoins.map((s) => (
                <tr key={s.id} className="hover:bg-background/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${typeBadges[s.typeSoin] || 'bg-gray-100 text-gray-700'}`}>
                      {s.typeSoin}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-foreground block">{s.patientNom}</span>
                    <span className="text-[11px] font-mono text-primary font-bold">{s.ipp} • {s.lit}</span>
                  </td>
                  <td className="py-3.5 px-4 text-foreground font-medium text-xs max-w-sm">
                    {s.description}
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    <span className="font-semibold text-foreground block">{s.soignant}</span>
                    <span className="text-[11px] text-foreground-muted font-mono">{s.heure}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <SoinStatutToggle soinId={s.id} initialStatut={s.statut} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
