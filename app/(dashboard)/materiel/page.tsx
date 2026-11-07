import {
  Wrench, CheckCircle2, AlertTriangle, Clock, Plus,
  ShieldCheck, Activity, Cpu, Calendar
} from 'lucide-react'
import { AjouterAppareilModal } from './AjouterAppareilModal'

export default async function MaterielPage() {
  const equipements = [
    {
      id: 'mat-1',
      code: 'BIO-ECH-01',
      nom: 'Échographe Doppler Couleur 4D',
      service: 'Gynéco-Obstétrique / Imagerie',
      marque: 'Mindray DC-40',
      etat: 'operationnel',
      derniereRevision: '2026-08-15',
      prochaineMaintenance: '2027-02-15',
      valeur: 18500000,
    },
    {
      id: 'mat-2',
      code: 'BIO-MON-02',
      nom: 'Moniteur Multiparamétrique Vital',
      service: 'Urgences & Réanimation',
      marque: 'Comen C80',
      etat: 'operationnel',
      derniereRevision: '2026-09-10',
      prochaineMaintenance: '2027-03-10',
      valeur: 3200000,
    },
    {
      id: 'mat-3',
      code: 'BIO-AUT-01',
      nom: 'Autoclave Stérilisation Vapeur 50L',
      service: 'Bloc Opératoire Central',
      marque: 'Tuttnauer',
      etat: 'maintenance',
      derniereRevision: '2026-05-20',
      prochaineMaintenance: '2026-11-20',
      valeur: 5800000,
    },
    {
      id: 'mat-4',
      code: 'BIO-ECG-03',
      nom: 'Electrocardiographe ECG 12 Pistes',
      service: 'Cardiologie / Médecine',
      marque: 'Fukuda Denshi',
      etat: 'operationnel',
      derniereRevision: '2026-07-04',
      prochaineMaintenance: '2027-01-04',
      valeur: 2400000,
    },
  ]

  const formatCFA = (montant: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'decimal', maximumFractionDigits: 0 }).format(montant) + ' FCFA'

  const totalParc = equipements.reduce((acc, eq) => acc + eq.valeur, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-foreground">
            Parc de Matériel Biomédical & Équipements
          </h2>
          <p className="text-xs text-foreground-muted">
            Inventaire des appareils de diagnostic, blocs opératoires, suivi de maintenance et étalonnages.
          </p>
        </div>

        <AjouterAppareilModal />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface rounded-3xl p-5 border border-surface-border shadow-xs">
          <span className="text-xs font-semibold text-foreground-muted">Total Appareils Référencés</span>
          <p className="text-3xl font-black font-heading text-foreground mt-2">{equipements.length}</p>
          <span className="text-[11px] text-foreground-muted">Dispositifs biomédicaux actifs</span>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-surface-border shadow-xs">
          <span className="text-xs font-semibold text-foreground-muted">Valeur Globale du Parc</span>
          <p className="text-2xl font-bold font-mono text-primary mt-2">{formatCFA(totalParc)}</p>
          <span className="text-[11px] text-foreground-muted">Investissement matériel immobilisé</span>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-surface-border shadow-xs">
          <span className="text-xs font-semibold text-foreground-muted">Disponibilité Opérationnelle</span>
          <p className="text-3xl font-black font-heading text-emerald-600 mt-2">75%</p>
          <span className="text-[11px] text-amber-600 font-medium">1 appareil en maintenance programmée</span>
        </div>
      </div>

      <div className="bg-surface rounded-3xl border border-surface-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-background text-foreground-muted uppercase tracking-wider text-[11px] font-bold border-b border-surface-border">
              <tr>
                <th className="py-3 px-4">Code & Nom de l&apos;Appareil</th>
                <th className="py-3 px-4">Service Affecté</th>
                <th className="py-3 px-4">Modèle & Marque</th>
                <th className="py-3 px-4 text-right">Valeur Estimée</th>
                <th className="py-3 px-4">Prochaine Révision</th>
                <th className="py-3 px-4 text-right">État</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60">
              {equipements.map((eq) => (
                <tr key={eq.id} className="hover:bg-background/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-foreground block text-sm">{eq.nom}</span>
                    <span className="font-mono text-[11px] text-primary font-bold">{eq.code}</span>
                  </td>
                  <td className="py-3.5 px-4 text-xs font-medium text-foreground">
                    {eq.service}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-mono text-foreground-muted">
                    {eq.marque}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground">
                    {formatCFA(eq.valeur)}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-foreground-muted">
                    {eq.prochaineMaintenance}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      eq.etat === 'operationnel' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'
                    }`}>
                      {eq.etat === 'operationnel' ? 'Opérationnel' : 'Maintenance'}
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
