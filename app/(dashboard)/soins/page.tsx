import {
  Syringe, CheckCircle2, Clock, AlertCircle, Plus,
  User, Calendar, Activity, Pill
} from 'lucide-react'

export default async function SoinsPage() {
  const soins = [
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

  const typeBadges: Record<string, string> = {
    perfusion: 'bg-sky-500/10 text-sky-600',
    injection: 'bg-indigo-500/10 text-indigo-600',
    pansement: 'bg-amber-500/10 text-amber-600',
    nebulisation: 'bg-purple-500/10 text-purple-600',
    prelevement: 'bg-rose-500/10 text-rose-600',
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

        <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-primary-hover transition-colors">
          <Plus className="w-4 h-4" />
          <span>+ Enregistrer un Soin</span>
        </button>
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
              {soins.map((s) => (
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
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      s.statut === 'effectue' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                    }`}>
                      {s.statut === 'effectue' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Fait
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" /> À Faire
                        </>
                      )}
                    </span>
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
