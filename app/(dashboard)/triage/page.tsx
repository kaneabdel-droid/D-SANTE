import { getDernieresConstantes } from './actions'
import { getPatients } from '../patients/actions'
import NouveauTriageModal from './NouveauTriageModal'
import {
  Activity, HeartPulse, AlertTriangle, ShieldAlert,
  Thermometer, Droplet, User, Clock, FileText
} from 'lucide-react'

export default async function TriagePage(props: {
  searchParams: Promise<{ patient_id?: string; ipp?: string }>
}) {
  const searchParams = await props.searchParams
  const preselectedPatientId = searchParams.patient_id

  const [{ constantes }, { patients }] = await Promise.all([
    getDernieresConstantes(),
    getPatients(),
  ])

  const constantesAffichees = constantes && constantes.length > 0 ? constantes : [
    {
      id: 'c-1',
      tension_systolique: 180,
      tension_diastolique: 100,
      temperature: 38.6,
      pouls: 110,
      saturation_o2: 93,
      glycemie: 1.45,
      poids_kg: 82.0,
      taille_cm: 175,
      imc: 26.8,
      douleur_eva: 8,
      niveau_triage: 'orange',
      observations: 'Céphalées intenses avec nausées.',
      created_at: new Date(Date.now() - 15 * 60000).toISOString(),
      patients: {
        nom: 'Diallo',
        prenom: 'Oumar',
        ipp: 'PAT-2610-001',
        sexe: 'M',
        date_naissance: '1990-06-12',
      },
    },
    {
      id: 'c-2',
      tension_systolique: 120,
      tension_diastolique: 80,
      temperature: 37.0,
      pouls: 72,
      saturation_o2: 99,
      glycemie: 0.95,
      poids_kg: 64.0,
      taille_cm: 168,
      imc: 22.7,
      douleur_eva: 1,
      niveau_triage: 'vert',
      observations: 'Visite de contrôle de routine.',
      created_at: new Date(Date.now() - 45 * 60000).toISOString(),
      patients: {
        nom: 'Ba',
        prenom: 'Aïssatou',
        ipp: 'PAT-2610-003',
        sexe: 'F',
        date_naissance: '2001-08-05',
      },
    },
  ]

  const graviteBadges: Record<string, { label: string; badgeClass: string; rowClass: string }> = {
    rouge: {
      label: 'Code Rouge (Urgence Vitale)',
      badgeClass: 'bg-red-500 text-white animate-pulse',
      rowClass: 'border-l-4 border-l-red-500',
    },
    orange: {
      label: 'Code Orange (Très Urgent)',
      badgeClass: 'bg-orange-500 text-white',
      rowClass: 'border-l-4 border-l-orange-500',
    },
    jaune: {
      label: 'Code Jaune (Urgent)',
      badgeClass: 'bg-amber-400 text-black',
      rowClass: 'border-l-4 border-l-amber-400',
    },
    vert: {
      label: 'Code Vert (Non Urgent)',
      badgeClass: 'bg-emerald-500 text-white',
      rowClass: 'border-l-4 border-l-emerald-500',
    },
  }

  return (
    <div className="space-y-6">
      {/* Entête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-foreground">
            Poste de Triage & Constantes Vitales
          </h2>
          <p className="text-xs text-foreground-muted">
            Prise des constantes cliniques et hiérarchisation médicale des flux de patients.
          </p>
        </div>

        <NouveauTriageModal
          patients={patients || []}
          preselectedPatientId={preselectedPatientId}
        />
      </div>

      {/* Guide des codes couleur de triage */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs">
          <span className="font-bold text-red-600 block">Code Rouge</span>
          <span className="text-[11px] text-foreground-muted">Urgence vitale immédiate (SpO2 &lt; 90%, TA critique)</span>
        </div>
        <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-xs">
          <span className="font-bold text-orange-600 block">Code Orange</span>
          <span className="text-[11px] text-foreground-muted">Très urgent (&lt; 15 min, SpO2 90-94%, EVA &gt;= 7)</span>
        </div>
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
          <span className="font-bold text-amber-600 block">Code Jaune</span>
          <span className="text-[11px] text-foreground-muted">Urgent différable (&lt; 60 min, fièvre, douleur modérée)</span>
        </div>
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
          <span className="font-bold text-emerald-600 block">Code Vert</span>
          <span className="text-[11px] text-foreground-muted">Non urgent (Constantes normales, soins de routine)</span>
        </div>
      </div>

      {/* Tableau des Constantes Récentes */}
      <div className="bg-surface rounded-3xl border border-surface-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-background text-foreground-muted uppercase tracking-wider text-[11px] font-bold border-b border-surface-border">
              <tr>
                <th className="py-3 px-4">Gravité</th>
                <th className="py-3 px-4">Patient (IPP)</th>
                <th className="py-3 px-4">Tension (TA)</th>
                <th className="py-3 px-4">T° & Pouls</th>
                <th className="py-3 px-4">SpO2 & Glycémie</th>
                <th className="py-3 px-4">Poids / IMC</th>
                <th className="py-3 px-4">Douleur EVA</th>
                <th className="py-3 px-4">Heure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {constantesAffichees.map((c: any) => {
                const conf = graviteBadges[c.niveau_triage] || graviteBadges.vert
                const pat = c.patients

                return (
                  <tr key={c.id} className={`hover:bg-background/40 transition-colors ${conf.rowClass}`}>
                    {/* Gravité */}
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${conf.badgeClass}`}>
                        {c.niveau_triage}
                      </span>
                    </td>

                    {/* Patient */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-foreground block">
                        {pat ? `${pat.nom} ${pat.prenom}` : 'Patient non identifié'}
                      </span>
                      <span className="font-mono text-[11px] text-foreground-muted">
                        {pat?.ipp || '—'}
                      </span>
                    </td>

                    {/* Tension Artérielle */}
                    <td className="py-3 px-4 font-mono font-bold">
                      {c.tension_systolique && c.tension_diastolique ? (
                        <span className={c.tension_systolique >= 160 ? 'text-danger' : 'text-foreground'}>
                          {c.tension_systolique}/{c.tension_diastolique} mmHg
                        </span>
                      ) : (
                        <span className="text-foreground-muted font-normal">—</span>
                      )}
                    </td>

                    {/* Température & Pouls */}
                    <td className="py-3 px-4 text-xs">
                      <span className={`font-mono font-bold block ${Number(c.temperature) >= 38.5 ? 'text-danger' : 'text-foreground'}`}>
                        {c.temperature ? `${c.temperature} °C` : '—'}
                      </span>
                      <span className="text-[11px] text-foreground-muted font-mono">
                        {c.pouls ? `${c.pouls} bpm` : '—'}
                      </span>
                    </td>

                    {/* SpO2 & Glycémie */}
                    <td className="py-3 px-4 text-xs">
                      <span className={`font-mono font-bold block ${c.saturation_o2 && c.saturation_o2 < 94 ? 'text-danger' : 'text-foreground'}`}>
                        {c.saturation_o2 ? `SpO2 ${c.saturation_o2}%` : '—'}
                      </span>
                      <span className="text-[11px] text-foreground-muted font-mono">
                        {c.glycemie ? `${c.glycemie} g/L` : '—'}
                      </span>
                    </td>

                    {/* Poids / IMC */}
                    <td className="py-3 px-4 text-xs font-mono">
                      <span className="text-foreground font-bold block">
                        {c.poids_kg ? `${c.poids_kg} kg` : '—'}
                      </span>
                      <span className="text-[11px] text-foreground-muted">
                        {c.imc ? `${c.imc} kg/m²` : '—'}
                      </span>
                    </td>

                    {/* Douleur EVA */}
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-xs ${
                        c.douleur_eva >= 7
                          ? 'bg-danger/10 text-danger'
                          : c.douleur_eva >= 4
                          ? 'bg-amber-500/10 text-amber-600'
                          : 'bg-emerald-500/10 text-emerald-600'
                      }`}>
                        {c.douleur_eva}/10
                      </span>
                    </td>

                    {/* Heure */}
                    <td className="py-3 px-4 font-mono text-xs text-foreground-muted whitespace-nowrap">
                      {new Date(c.created_at).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
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
