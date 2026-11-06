'use client'

import { useState, useTransition } from 'react'
import {
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  Banknote,
  Landmark,
  Smartphone,
  Check,
  Trash2,
  Loader2,
  Stethoscope,
} from 'lucide-react'
import {
  type PaiementAbonnementSanteItem,
  validerPaiementCaisseSante,
  validerPaiementVirementSante,
  supprimerPaiementAbonnementSante,
} from '@/app/admin/(protected)/actions'

export function AbonnementsSanteClient({
  initialPaiements,
}: {
  initialPaiements: PaiementAbonnementSanteItem[]
}) {
  const [paiements, setPaiements] = useState<PaiementAbonnementSanteItem[]>(initialPaiements)
  const [filterStatut, setFilterStatut] = useState<'tous' | 'pending' | 'completed'>('tous')
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleValiderCaisse = (id: string, structureNom: string) => {
    setLoadingId(id)
    startTransition(async () => {
      const res = await validerPaiementCaisseSante(id)
      setLoadingId(null)
      if (res?.success) {
        setPaiements((prev) =>
          prev.map((p) => (p.id === id ? { ...p, statut: 'completed' } : p))
        )
        setFeedback(`✓ Paiement en Caisse validé ! La structure médicale "${structureNom}" est activée.`)
        setTimeout(() => setFeedback(null), 4000)
      } else {
        setFeedback(`Erreur : ${res?.error || 'Validation impossible'}`)
        setTimeout(() => setFeedback(null), 4000)
      }
    })
  }

  const handleValiderVirement = (id: string, structureNom: string) => {
    setLoadingId(id)
    startTransition(async () => {
      const res = await validerPaiementVirementSante(id)
      setLoadingId(null)
      if (res?.success) {
        setPaiements((prev) =>
          prev.map((p) => (p.id === id ? { ...p, statut: 'completed' } : p))
        )
        setFeedback(`✓ Virement bancaire validé ! L'abonnement de "${structureNom}" est activé.`)
        setTimeout(() => setFeedback(null), 4000)
      } else {
        setFeedback(`Erreur : ${res?.error || 'Validation impossible'}`)
        setTimeout(() => setFeedback(null), 4000)
      }
    })
  }

  const handleSupprimer = (id: string) => {
    if (!confirm('Supprimer définitivement cet enregistrement de transaction ?')) return
    setLoadingId(id)
    startTransition(async () => {
      const res = await supprimerPaiementAbonnementSante(id)
      setLoadingId(null)
      if (res?.success) {
        setPaiements((prev) => prev.filter((p) => p.id !== id))
        setFeedback('Transaction supprimée.')
        setTimeout(() => setFeedback(null), 3000)
      }
    })
  }

  const filtered = paiements.filter((p) => {
    if (filterStatut === 'pending') return p.statut === 'pending'
    if (filterStatut === 'completed') return p.statut === 'completed'
    return true
  })

  const totalEncaisse = paiements
    .filter((p) => p.statut === 'completed')
    .reduce((sum, p) => sum + p.montant, 0)

  const enAttenteCount = paiements.filter((p) => p.statut === 'pending').length

  const formatNiveau = (niv: string) => {
    if (niv === 'hopital') return 'Hôpital & Polyclinique'
    if (niv === 'poste_sante') return 'Poste & Dispensaire'
    return 'Clinique & Centre Médical'
  }

  return (
    <div className="space-y-8">
      {/* Toast Feedback */}
      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Cartes KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <span className="text-xs text-slate-400">Total Encaissé Licences D-SANTÉ</span>
          <p className="text-2xl font-black text-emerald-400 font-mono mt-1">
            {totalEncaisse.toLocaleString('fr-FR')} FCFA
          </p>
          <span className="text-[11px] text-slate-500">Toutes passerelles confondues</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <span className="text-xs text-slate-400">Règlements en Attente (Caisse / Virement)</span>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-2xl font-black text-emerald-400 font-mono">
              {enAttenteCount}
            </p>
            {enAttenteCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Action Requise
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-500">Validation directe en 1 clic</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <span className="text-xs text-slate-400">Passerelles Actives</span>
          <p className="text-sm font-bold text-white mt-1">
            Maketou (Direct sans webhook)
          </p>
          <span className="text-[11px] text-emerald-400 font-semibold block mt-0.5">
            + Chariow en secours automatique
          </span>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterStatut('tous')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterStatut === 'tous'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Tous ({paiements.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatut('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterStatut === 'pending'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>En attente ({enAttenteCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterStatut('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              filterStatut === 'completed'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Complétés</span>
          </button>
        </div>
      </div>

      {/* Tableau des Paiements */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Réf.</th>
                <th className="py-3 px-4">Structure Médicale</th>
                <th className="py-3 px-4">Formule</th>
                <th className="py-3 px-4">Montant</th>
                <th className="py-3 px-4">Moyen / Passerelle</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-center">Validation SuperAdmin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Aucun paiement trouvé dans cette catégorie.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const isLoading = loadingId === p.id
                  const isPendingStatus = p.statut === 'pending'
                  const isCaisse = p.provider === 'caisse' || p.moyenPaiement === 'caisse'
                  const isVirement = p.provider === 'virement' || p.moyenPaiement === 'virement'

                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        #{p.id.slice(0, 8)}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        {p.structureNom}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {formatNiveau(p.niveau)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400 text-sm">
                        {p.montant.toLocaleString('fr-FR')} {p.devise}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          {isCaisse ? (
                            <Banknote className="w-3.5 h-3.5 text-amber-400" />
                          ) : isVirement ? (
                            <Landmark className="w-3.5 h-3.5 text-sky-400" />
                          ) : (
                            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                          <span className="capitalize text-slate-300">
                            {p.moyenPaiement} ({p.provider})
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono">{p.date}</td>
                      <td className="py-3.5 px-4">
                        {p.statut === 'completed' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Confirmé
                          </span>
                        ) : p.statut === 'pending' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Clock className="w-3.5 h-3.5 animate-pulse" />
                            En attente
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <XCircle className="w-3.5 h-3.5" />
                            Échoué
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {isPendingStatus && isCaisse && (
                            <button
                              type="button"
                              onClick={() => handleValiderCaisse(p.id, p.structureNom)}
                              disabled={isLoading}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
                            >
                              {isLoading ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Check className="w-3 h-3 stroke-[3]" />
                              )}
                              <span>Valider paiement Caisse</span>
                            </button>
                          )}

                          {isPendingStatus && isVirement && (
                            <button
                              type="button"
                              onClick={() => handleValiderVirement(p.id, p.structureNom)}
                              disabled={isLoading}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all disabled:opacity-50"
                            >
                              {isLoading ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Check className="w-3 h-3 stroke-[3]" />
                              )}
                              <span>Valider le Virement</span>
                            </button>
                          )}

                          {isPendingStatus && !isCaisse && !isVirement && (
                            <span className="text-[11px] text-slate-500 italic">
                              Vérification live au retour
                            </span>
                          )}

                          {p.statut === 'completed' && (
                            <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Actif
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleSupprimer(p.id)}
                            title="Supprimer la trace"
                            className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
