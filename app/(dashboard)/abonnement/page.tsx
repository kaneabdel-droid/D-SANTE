import { getTenantContext } from '@/utils/supabase/tenant'
import {
  CreditCard, CheckCircle2, ShieldCheck, Zap,
  Building2, Sparkles, AlertCircle, Phone
} from 'lucide-react'

export default async function AbonnementPage() {
  const tenant = await getTenantContext()
  const currentTier = tenant?.subscriptionTier || 'clinique'

  const plans = [
    {
      id: 'poste_sante',
      nom: 'Poste & Dispensaire',
      prix: '25 000',
      periode: 'FCFA / mois',
      desc: 'Idéal pour les postes de santé ruraux, dispensaires et cabinets infirmiers.',
      fonctionnalites: [
        'Fichier Patients & IPP illimités',
        'Triage & Constantes vitales',
        'Consultations de base & CPN',
        'Dépôt de médicaments d’urgence',
        'Caisse recettes guichet simple',
        'Mode Hors-Ligne (PWA / Sync)',
      ],
      populaire: false,
    },
    {
      id: 'centre_medical',
      nom: 'Centre Médical & Clinique',
      prix: '65 000',
      periode: 'FCFA / mois',
      desc: 'Conçu pour les cliniques privées, maternités et centres de santé urbains.',
      fonctionnalites: [
        'Toutes les fonctions Poste de Santé',
        'Jusqu’à 15 praticiens soignants',
        'Dossier Médical Partagé complet',
        'Ordonnances sécurisées avec QR code',
        'Hospitalisation (jusqu’à 20 lits)',
        'Facturation Tiers-Payant (IPM & CMU)',
        'Pharmacie interne avec suivi des péremptions',
      ],
      populaire: true,
    },
    {
      id: 'hopital',
      nom: 'Hôpital & Polyclinique',
      prix: '150 000',
      periode: 'FCFA / mois',
      desc: 'Pour les centres hospitaliers régionaux, polycliniques et cliniques chirurgicales.',
      fonctionnalites: [
        'Utilisateurs & Praticiens illimités',
        'Multi-pavillons & Multi-services',
        'Capacité de lits illimitée',
        'Gestion des blocs opératoires',
        'Comptabilité SYSCOHADA complète',
        'Inventaire biomédical & Maintenance',
        'Support technique dédié 24/7',
      ],
      populaire: false,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Entête */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gestion des Abonnements D-SANTÉ</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black font-heading text-foreground">
          Un abonnement transparent et adapté à votre structure
        </h2>
        <p className="text-xs sm:text-sm text-foreground-muted">
          Paiement sécurisé par Mobile Money (Wave, Orange Money) ou Carte Bancaire via nos passerelles certifiées Maketou & Chariow.
        </p>
      </div>

      {/* Grille des Forfaits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => {
          const estActuel = currentTier === p.id

          return (
            <div
              key={p.id}
              className={`bg-surface rounded-3xl p-6 sm:p-8 border transition-all flex flex-col justify-between relative ${
                p.populaire
                  ? 'border-primary ring-2 ring-primary/20 shadow-lg'
                  : 'border-surface-border shadow-xs'
              }`}
            >
              {p.populaire && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-wider">
                  Recommandé
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-black font-heading text-foreground">{p.nom}</h3>
                  <p className="text-xs text-foreground-muted mt-1 leading-relaxed">{p.desc}</p>
                </div>

                <div className="pt-2">
                  <span className="text-3xl sm:text-4xl font-black font-mono text-foreground">
                    {p.prix}
                  </span>
                  <span className="text-xs font-bold text-foreground-muted ml-1.5">
                    {p.periode}
                  </span>
                </div>

                <div className="pt-4 border-t border-surface-border/60 space-y-2.5">
                  {p.fonctionnalites.map((f, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-foreground-muted font-medium">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                {estActuel ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-2xl bg-primary/10 text-primary font-bold text-xs cursor-default"
                  >
                    ✓ Votre Forfait Actif
                  </button>
                ) : (
                  <button
                    className="w-full py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-md shadow-primary/20 transition-all flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Souscrire via Wave / Orange Money</span>
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Garantie & Sécurité */}
      <div className="bg-surface rounded-3xl p-6 border border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">Paiements 100% Sécurisés en Afrique de l&apos;Ouest</h4>
            <p className="text-xs text-foreground-muted">
              Passerelle principale Maketou avec bascule automatique sur Chariow en cas d&apos;indisponibilité réseau.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-foreground-muted">
          Support DEMBA Solution
        </span>
      </div>
    </div>
  )
}
