import {
  UserCog, ShieldCheck, Stethoscope, Syringe,
  Pill, Clock, Plus, Phone, Mail, Award, HeartPulse, Microscope, Activity
} from 'lucide-react'
import { getPersonnel } from './actions'
import AjouterCollaborateurModal from './AjouterCollaborateurModal'

export default async function PersonnelPage() {
  const { personnel } = await getPersonnel()

  const defaultStaff = [
    {
      id: 'staff-1',
      nom: 'Dr. Cheikh Anta Diop',
      role: 'medecin',
      specialite: 'Chirurgie Générale / Médecin Chef',
      telephone: '+221 77 500 12 34',
      email: 'dr.diop@hopital.com',
      statutGarde: 'En Service',
      enGardeAujourdhui: true,
    },
    {
      id: 'staff-2',
      nom: 'Dr. Mariama Bâ',
      role: 'medecin',
      specialite: 'Pédiatrie & Néonatalogie',
      telephone: '+221 70 610 88 90',
      email: 'dr.ba@hopital.com',
      statutGarde: 'Astreinte Nuit',
      enGardeAujourdhui: true,
    },
    {
      id: 'staff-3',
      nom: 'Inf. Abdoulaye Fall',
      role: 'infirmier',
      specialite: 'Soins d’Urgences & Triage',
      telephone: '+221 78 440 22 11',
      email: 'a.fall@hopital.com',
      statutGarde: 'Garde 24h',
      enGardeAujourdhui: true,
    },
    {
      id: 'staff-4',
      nom: 'Mme Khady Sène',
      role: 'pharmacien',
      specialite: 'Gestionnaire Pharmacie & Dépôt',
      telephone: '+221 77 330 99 88',
      email: 'k.sene@hopital.com',
      statutGarde: 'Journée',
      enGardeAujourdhui: false,
    },
    {
      id: 'staff-5',
      nom: 'M. Ousmane Ndiaye',
      role: 'caissier',
      specialite: 'Caisse Centrale & Tiers-Payant',
      telephone: '+221 76 112 00 45',
      email: 'o.ndiaye@hopital.com',
      statutGarde: 'Guichet 1',
      enGardeAujourdhui: false,
    },
  ]

  // Normalisation du personnel
  const staff = personnel && personnel.length > 0 ? personnel.map((p: any) => ({
    id: p.id,
    nom: p.nom,
    role: p.role || 'medecin',
    specialite: p.specialite || 'Santé Générale',
    telephone: p.telephone || 'Non renseigné',
    email: p.email || 'Non renseigné',
    statutGarde: p.statut_garde || 'En Service',
    enGardeAujourdhui: !!p.en_garde_aujourdhui,
  })) : defaultStaff

  const roleBadges: Record<string, { label: string; icon: any; color: string }> = {
    medecin: { label: 'Médecin Praticien', icon: Stethoscope, color: 'bg-primary/10 text-primary' },
    infirmier: { label: 'Infirmier Diplômé', icon: Syringe, color: 'bg-indigo-500/10 text-indigo-600' },
    sage_femme: { label: 'Sage-Femme d’État', icon: HeartPulse, color: 'bg-rose-500/10 text-rose-600' },
    pharmacien: { label: 'Pharmacien', icon: Pill, color: 'bg-emerald-500/10 text-emerald-600' },
    caissier: { label: 'Agent de Caisse', icon: Award, color: 'bg-amber-500/10 text-amber-600' },
    laborantin: { label: 'Biologiste / Labo', icon: Microscope, color: 'bg-purple-500/10 text-purple-600' },
    aide_soignant: { label: 'Aide-Soignant(e)', icon: Activity, color: 'bg-sky-500/10 text-sky-600' },
    administrateur: { label: 'Cadre Administratif', icon: UserCog, color: 'bg-gray-500/10 text-gray-700' },
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-foreground">
            Personnel Soignant & Équipes Médicales
          </h2>
          <p className="text-xs text-foreground-muted">
            Gestion des praticiens, infirmiers, sages-femmes, astreintes et tableaux de garde.
          </p>
        </div>

        {/* Modal d'ajout de collaborateur */}
        <AjouterCollaborateurModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((s) => {
          const conf = roleBadges[s.role] || roleBadges.medecin
          const Icon = conf.icon

          return (
            <div
              key={s.id}
              className="bg-surface rounded-3xl p-5 border border-surface-border shadow-xs space-y-4 hover:border-primary/40 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-surface-border/40 text-foreground flex items-center justify-center font-bold font-mono">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-sm">{s.nom}</h3>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${conf.color}`}>
                      {conf.label}
                    </span>
                  </div>
                </div>

                {s.enGardeAujourdhui && (
                  <span className="px-2 py-0.5 rounded-full bg-danger/10 text-danger text-[9px] font-black uppercase animate-pulse">
                    En Garde
                  </span>
                )}
              </div>

              <div className="text-xs space-y-1 text-foreground-muted">
                <p className="font-medium text-foreground">{s.specialite}</p>
                <div className="flex items-center gap-2 pt-1 font-mono text-[11px]">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  <span>{s.telephone}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  <span>{s.email}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-surface-border/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-foreground-muted">Créneau de service :</span>
                <span className="font-bold text-foreground">{s.statutGarde}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
