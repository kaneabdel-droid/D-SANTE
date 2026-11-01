import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building2,
  Calendar,
  Zap,
  Clock,
  ArrowUpRight,
  Stethoscope,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function AbonnementsPage() {
  const tiers = [
    {
      id: 'poste_sante',
      name: 'Poste & Dispensaire',
      price: '25 000 FCFA',
      period: '/ mois',
      structuresCount: 1,
      popular: false,
      features: [
        'Dossier Patient Informatisé (DPI de base)',
        'Carnet de santé & constantes vitales',
        'Registre des consultations infirmières',
        'Gestion de la petite pharmacie de poste',
        'Support technique 6j/7',
      ],
    },
    {
      id: 'clinique',
      name: 'Clinique & Centre Médical',
      price: '65 000 FCFA',
      period: '/ mois',
      structuresCount: 2,
      popular: true,
      features: [
        'Tout le pack Poste & Dispensaire',
        'Triage infirmier & alertes constantes vitales',
        'Consultations spécialisées multi-praticiens',
        'Ordonnances électroniques sécurisées QR Code',
        'Gestion des lits d’hospitalisation & soins infirmiers',
        'Caisse clinique & prise en charge IPM / Assurances',
        'Support prioritaire WhatsApp & Téléphone',
      ],
    },
    {
      id: 'hopital',
      name: 'Hôpital & Polyclinique',
      price: '150 000 FCFA',
      period: '/ mois',
      structuresCount: 1,
      popular: false,
      features: [
        'Tout le pack Clinique & Centre Médical',
        'Capacité praticiens et lits illimitée',
        'Gestion complète du Tiers-Payant IPM & CMU',
        'Pharmacie hospitalière & délivrance sécurisée',
        'Exports comptables SYSCOHADA certifiés',
        'Sauvegardes chiffrées HDS redondantes',
        'Account Manager dédié & Assistance clinique 24/7',
      ],
    },
  ]

  const transactions = [
    {
      id: 'TXN-9842',
      structure: 'Polyclinique Cheikh Anta Diop',
      formule: 'Hôpital & Polyclinique',
      montant: '150 000 FCFA',
      methode: 'Virement bancaire BOA',
      date: '28 Octobre 2026',
      statut: 'paye',
    },
    {
      id: 'TXN-9755',
      structure: 'Clinique de la Madeleine',
      formule: 'Clinique & Centre Médical',
      montant: '65 000 FCFA',
      methode: 'Wave Business',
      date: '25 Octobre 2026',
      statut: 'paye',
    },
    {
      id: 'TXN-9689',
      structure: 'Cabinet Al-Baraka',
      formule: 'Clinique & Centre Médical',
      montant: '65 000 FCFA',
      methode: 'Orange Money Pro',
      date: '20 Octobre 2026',
      statut: 'paye',
    },
    {
      id: 'TXN-9510',
      structure: 'Centre Médical Noflaye',
      formule: 'Poste & Dispensaire',
      montant: '25 000 FCFA',
      methode: 'Wave Business',
      date: '10 Octobre 2026',
      statut: 'paye',
    },
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Abonnements & Licences D-SANTÉ
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Supervision des plans tarifaires SaaS médicaux, modules IPM et historique des règlements.
        </p>
      </div>

      {/* Grid of Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`rounded-3xl p-6 border relative flex flex-col justify-between ${
              tier.popular
                ? 'bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-500/10'
                : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            {tier.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500 text-slate-950">
                Plus souscrit
              </span>
            )}

            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-semibold">
                  {tier.structuresCount} client(s)
                </span>
              </div>

              <div className="my-4">
                <span className="text-2xl font-extrabold text-white">
                  {tier.price}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {' '}{tier.period}
                </span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 my-6">
                {tier.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Total MRR généré :</span>
              <span className="font-bold text-emerald-400">
                {(
                  tier.structuresCount *
                  parseInt(tier.price.replace(/\D/g, ''))
                ).toLocaleString('fr-FR')}{' '}
                FCFA
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Transaction History */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">
              Derniers encaissements d&apos;abonnements
            </h2>
            <p className="text-xs text-slate-400">
              Historique des renouvellements et licences logicielles médicales
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-6">ID Réf</th>
                <th className="py-3 px-4">Établissement</th>
                <th className="py-3 px-4">Formule</th>
                <th className="py-3 px-4">Montant</th>
                <th className="py-3 px-4">Canal de règlement</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-6 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-6 font-mono text-slate-400 font-semibold">
                    {tx.id}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {tx.structure}
                  </td>
                  <td className="py-3.5 px-4 text-slate-300">{tx.formule}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-400">
                    {tx.montant}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{tx.methode}</td>
                  <td className="py-3.5 px-4 text-slate-400">{tx.date}</td>
                  <td className="py-3.5 px-6 text-right">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      RÉGLÉ
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

