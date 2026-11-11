import { getPatients, getOrganismesAssurances } from './actions'
import NouveauPatientModal from './NouveauPatientModal'
import PatientRowActions from './PatientRowActions'
import {
  Users, Search, ShieldCheck, AlertCircle, Sparkles
} from 'lucide-react'

export default async function PatientsPage(props: {
  searchParams: Promise<{ q?: string }>
}) {
  const searchParams = await props.searchParams
  const q = searchParams.q || ''

  const [{ patients, error }, { organismes }] = await Promise.all([
    getPatients(q),
    getOrganismesAssurances(),
  ])

  const aDesPatientsReels = Boolean(patients && patients.length > 0)

  // Données indicatives d'exemple en filigrane (sans impact) si l'établissement est neuf
  const patientsAffiches = aDesPatientsReels
    ? patients
    : [
      {
        id: 'demo-1',
        ipp: 'PAT-EX-001',
        nom: 'Diallo',
        prenom: 'Aminata',
        date_naissance: '1992-04-15',
        sexe: 'F',
        groupe_sanguin: 'O+',
        telephone: '+221 77 452 10 99',
        taux_couverture: 80,
        organismes_assurances: { nom: 'IPM Sonatel', type_organisme: 'ipm' },
      },
      {
        id: 'demo-2',
        ipp: 'PAT-EX-002',
        nom: 'Sow',
        prenom: 'Moussa',
        date_naissance: '1985-11-20',
        sexe: 'M',
        groupe_sanguin: 'B+',
        telephone: '+221 70 882 14 30',
        taux_couverture: 0,
        organismes_assurances: null,
      },
      {
        id: 'demo-3',
        ipp: 'PAT-EX-003',
        nom: 'Ba',
        prenom: 'Aïssatou',
        date_naissance: '2001-08-05',
        sexe: 'F',
        groupe_sanguin: 'A-',
        telephone: '+221 78 312 90 44',
        taux_couverture: 50,
        organismes_assurances: { nom: 'CMU Sénégal', type_organisme: 'cmu' },
      },
    ]

  const calculerAge = (dateStr?: string) => {
    if (!dateStr) return '—'
    const diff = Date.now() - new Date(dateStr).getTime()
    const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
    return `${age} ans`
  }

  return (
    <div className="space-y-6">
      {/* Entête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-foreground">
            Fichier Central des Patients
          </h2>
          <p className="text-xs text-foreground-muted">
            Gestion des identités uniques (IPP), dossiers médicaux et affiliations mutuelles.
          </p>
        </div>

        <NouveauPatientModal organismes={organismes} />
      </div>

      {/* Bannière filigrane sans impact si base neuve */}
      {!aDesPatientsReels && (
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 rounded-2xl text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>
              <strong>Exemples en filigrane :</strong> Votre établissement ne compte aucun patient pour le moment. Les données ci-dessous sont affichées à titre d&apos;exemple indicatif sans impact sur vos statistiques. Cliquez sur « Nouveau Patient » pour ajouter votre premier patient réel.
            </span>
          </div>
        </div>
      )}

      {/* Barre de Recherche */}
      <div className="bg-surface p-4 rounded-2xl border border-surface-border shadow-xs">
        <form method="get" className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Rechercher par Nom, Prénom, IPP ou Téléphone..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-border bg-background text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-surface-border/60 hover:bg-surface-border text-foreground font-bold text-xs transition-colors"
          >
            Filtrer
          </button>
        </form>
      </div>

      {error && (
        <div className="p-4 bg-danger/10 border border-danger/20 text-danger rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tableau des Patients */}
      <div className="bg-surface rounded-3xl border border-surface-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-background text-foreground-muted uppercase tracking-wider text-[11px] font-bold border-b border-surface-border">
              <tr>
                <th className="py-3 px-4">IPP & Identité</th>
                <th className="py-3 px-4">Âge & Sexe</th>
                <th className="py-3 px-4">Groupe Sanguin</th>
                <th className="py-3 px-4">Couverture / Mutuelle</th>
                <th className="py-3 px-4">Téléphone</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {patientsAffiches.map((p: any) => {
                const org = p.organismes_assurances

                return (
                  <tr
                    key={p.id}
                    className={`transition-colors ${!aDesPatientsReels
                        ? 'opacity-65 bg-amber-500/5 hover:bg-amber-500/10'
                        : 'hover:bg-background/40'
                      }`}
                  >
                    {/* IPP & Nom */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground block text-sm">
                          {p.nom} {p.prenom}
                        </span>
                        {!aDesPatientsReels && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25">
                            Exemple
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[11px] text-primary font-bold">
                        {p.ipp}
                      </span>
                    </td>

                    {/* Âge & Sexe */}
                    <td className="py-3.5 px-4 text-xs">
                      <span className="text-foreground font-medium block">
                        {calculerAge(p.date_naissance)}
                      </span>
                      <span className="text-[11px] text-foreground-muted">
                        Sexe : {p.sexe === 'F' ? 'Féminin' : 'Masculin'}
                      </span>
                    </td>

                    {/* Groupe Sanguin */}
                    <td className="py-3.5 px-4">
                      {p.groupe_sanguin ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-danger/10 text-danger font-mono font-bold text-xs border border-danger/20">
                          {p.groupe_sanguin}
                        </span>
                      ) : (
                        <span className="text-foreground-muted text-xs">—</span>
                      )}
                    </td>

                    {/* Prise en Charge / Mutuelle */}
                    <td className="py-3.5 px-4 text-xs">
                      {org ? (
                        <div>
                          <span className="inline-flex items-center gap-1 font-bold text-primary">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            {org.nom}
                          </span>
                          <span className="block text-[11px] text-foreground-muted">
                            Prise en charge {p.taux_couverture || org.taux_couverture_defaut}%
                          </span>
                        </div>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded bg-surface-border/50 text-foreground-muted text-[10px] font-semibold">
                          Plein Tarif (100% Patient)
                        </span>
                      )}
                    </td>

                    {/* Téléphone */}
                    <td className="py-3.5 px-4 font-mono text-xs text-foreground-muted">
                      {p.telephone || '—'}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <PatientRowActions
                        patient={p}
                        organismes={organismes}
                        isExempleFiligrane={!aDesPatientsReels}
                      />
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
