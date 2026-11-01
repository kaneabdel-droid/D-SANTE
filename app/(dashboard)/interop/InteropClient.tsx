'use client'

import { useState } from 'react'
import { EchangeCliniquePharma, BordereauIpm } from './actions'
import { ValidationSubstitutionModal } from './ValidationSubstitutionModal'
import { SignalApprovisionnementModal } from './SignalApprovisionnementModal'
import { GenererBordereauIpmModal } from './GenererBordereauIpmModal'
import {
  Network, Pill, AlertTriangle, TrendingUp, FileCheck2,
  Building2, CheckCircle2, Clock, XCircle, Send, ArrowUpRight,
  ShieldCheck, Filter, Search, Plus
} from 'lucide-react'

export function InteropClient({
  echanges,
  bordereaux,
}: {
  echanges: EchangeCliniquePharma[]
  bordereaux: BordereauIpm[]
}) {
  const [activeTab, setActiveTab] = useState<'substitutions' | 'signaux' | 'ipm'>('substitutions')
  const [selectedEchange, setSelectedEchange] = useState<EchangeCliniquePharma | null>(null)
  const [isSignalModalOpen, setIsSignalModalOpen] = useState(false)
  const [isBordereauModalOpen, setIsBordereauModalOpen] = useState(false)

  const substitutions = echanges.filter((e) => e.type_echange === 'substitution')
  const signaux = echanges.filter((e) => e.type_echange === 'signal_epidemique' || e.type_echange === 'alerte_rupture')

  const enAttenteCount = substitutions.filter((s) => s.statut === 'en_attente').length

  const formatCFA = (montant: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'decimal', maximumFractionDigits: 0 }).format(montant) + ' FCFA'

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Modals */}
      {selectedEchange && (
        <ValidationSubstitutionModal
          echange={selectedEchange}
          onClose={() => setSelectedEchange(null)}
        />
      )}
      {isSignalModalOpen && (
        <SignalApprovisionnementModal onClose={() => setIsSignalModalOpen(false)} />
      )}
      {isBordereauModalOpen && (
        <GenererBordereauIpmModal onClose={() => setIsBordereauModalOpen(false)} />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
              DEMBA Health Bridge
            </span>
            {enAttenteCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-bold animate-pulse">
                {enAttenteCount} substitution(s) à valider
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Liaison D-Pharma & Organismes Tiers-Payant (IPM / CMU)
          </h2>
          <p className="text-xs sm:text-sm text-foreground-muted">
            Échange clinique direct avec les officines, accord de substitution DCI et télétransmission des bordereaux d’assurances.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsSignalModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-primary/30 text-primary hover:bg-primary/10 text-xs font-bold transition-colors cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Signal Approvisionnement</span>
          </button>

          <button
            onClick={() => setIsBordereauModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Télétransmettre Bordereau IPM</span>
          </button>
        </div>
      </div>

      {/* KPIs du Réseau */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface rounded-3xl p-5 border border-surface-border shadow-xs space-y-1">
          <div className="flex items-center justify-between text-foreground-muted text-xs">
            <span className="font-semibold">Substitutions en attente</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">{enAttenteCount}</p>
          <p className="text-[11px] text-amber-600 font-medium">
            Ruptures signalées au comptoir par D-Pharma
          </p>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-surface-border shadow-xs space-y-1">
          <div className="flex items-center justify-between text-foreground-muted text-xs">
            <span className="font-semibold">Signaux Épidémiques Émis</span>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{signaux.length}</p>
          <p className="text-[11px] text-primary font-medium">
            Alertes transmises aux grossistes & officines
          </p>
        </div>

        <div className="bg-surface rounded-3xl p-5 border border-surface-border shadow-xs space-y-1">
          <div className="flex items-center justify-between text-foreground-muted text-xs">
            <span className="font-semibold">Bordereaux IPM Télétransmis</span>
            <ShieldCheck className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-bold text-foreground">{bordereaux.length}</p>
          <p className="text-[11px] text-teal-600 font-medium">
            {formatCFA(bordereaux.reduce((acc, b) => acc + Number(b.montant_total_reclame || 0), 0))} réclamés
          </p>
        </div>
      </div>

      {/* Navigation Onglets */}
      <div className="flex border-b border-surface-border gap-2">
        {[
          { id: 'substitutions', label: 'Demandes de Substitution DCI', count: substitutions.length },
          { id: 'signaux', label: 'Signaux Prédictifs & Alertes Ruptures', count: signaux.length },
          { id: 'ipm', label: 'Télétransmission Bordereaux IPM / CMU', count: bordereaux.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-foreground-muted hover:text-foreground'
            }`}
          >
            <span>{tab.label}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-surface-border text-[10px] text-foreground font-mono">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Onglet 1 : Demandes de Substitution */}
      {activeTab === 'substitutions' && (
        <div className="space-y-4">
          {substitutions.map((sub) => {
            const isEnAttente = sub.statut === 'en_attente'
            const isApprouve = sub.statut === 'approuve'

            return (
              <div
                key={sub.id}
                className={`bg-surface rounded-3xl p-5 sm:p-6 border transition-all ${
                  isEnAttente
                    ? 'border-amber-400 shadow-md ring-1 ring-amber-400/20'
                    : 'border-surface-border'
                } space-y-4`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-surface-border/60 pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isEnAttente
                          ? 'bg-amber-500/10 text-amber-600'
                          : isApprouve
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : 'bg-danger/10 text-danger'
                      }`}
                    >
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-foreground block text-sm">
                        {sub.patient_nom} (IPP : {sub.patient_ipp})
                      </span>
                      <span className="text-[11px] text-foreground-muted flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {sub.pharmacie_nom} • Ordonnance : {sub.numero_ordonnance}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        isEnAttente
                          ? 'bg-amber-500/10 text-amber-600'
                          : isApprouve
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : 'bg-danger/10 text-danger'
                      }`}
                    >
                      {sub.statut === 'en_attente'
                        ? 'En attente d’avis médecin'
                        : sub.statut === 'approuve'
                        ? 'Validé médicalement'
                        : 'Rejeté par médecin'}
                    </span>

                    {isEnAttente && (
                      <button
                        onClick={() => setSelectedEchange(sub)}
                        className="px-3 py-1.5 rounded-xl bg-primary text-white hover:bg-primary-hover text-xs font-bold transition-colors cursor-pointer shadow-xs"
                      >
                        Examiner & Valider
                      </button>
                    )}
                  </div>
                </div>

                {/* Comparatif visuel Médicament épuisé vs Substitut */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-danger/5 border border-danger/20">
                    <span className="text-[10px] font-bold text-danger uppercase block mb-0.5">
                      Prescription d’Origine (En Rupture) :
                    </span>
                    <span className="font-bold text-foreground block">{sub.medicament_prescrit}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase block mb-0.5">
                      Substitut Proposé (En Stock D-Pharma) :
                    </span>
                    <span className="font-bold text-emerald-600 block">{sub.medicament_propose}</span>
                    {sub.posologie_ajustee && (
                      <span className="text-[11px] text-foreground-muted block mt-1">
                        Posologie proposée : {sub.posologie_ajustee}
                      </span>
                    )}
                  </div>
                </div>

                {sub.reponse_medecin && (
                  <div className="p-3 rounded-2xl bg-background border border-surface-border text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-semibold text-foreground">
                        {sub.valide_par_medecin_nom || 'Médecin Traitant'} :
                      </span>{' '}
                      <span className="text-foreground-muted">{sub.reponse_medecin}</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Onglet 2 : Signaux Prédictifs & Alertes Ruptures */}
      {activeTab === 'signaux' && (
        <div className="space-y-4">
          {signaux.map((sig) => (
            <div
              key={sig.id}
              className="bg-surface rounded-3xl p-5 border border-surface-border shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-surface-border/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-foreground text-sm block">
                      {sig.type_echange === 'signal_epidemique'
                        ? 'Signal Clinique d’Approvisionnement Préventif'
                        : 'Alerte Rupture Fournisseur / Grossiste'}
                    </span>
                    <span className="text-[11px] text-foreground-muted">
                      Destinataire : {sig.pharmacie_nom}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    sig.niveau_urgence === 'critique'
                      ? 'bg-danger/10 text-danger'
                      : sig.niveau_urgence === 'urgent'
                      ? 'bg-amber-500/10 text-amber-600'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  Urgence : {sig.niveau_urgence}
                </span>
              </div>

              <div className="text-xs space-y-1">
                <span className="font-bold text-foreground block">
                  Produits ciblés : {sig.medicament_prescrit}
                </span>
                <p className="text-foreground-muted">{sig.motif}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Onglet 3 : Télétransmission Bordereaux IPM / CMU */}
      {activeTab === 'ipm' && (
        <div className="bg-surface rounded-3xl border border-surface-border overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-background text-foreground-muted uppercase tracking-wider font-bold border-b border-surface-border text-[11px]">
                <tr>
                  <th className="py-3 px-4">N° Bordereau</th>
                  <th className="py-3 px-4">Organisme Assureur</th>
                  <th className="py-3 px-4">Période</th>
                  <th className="py-3 px-4 text-center">Factures</th>
                  <th className="py-3 px-4 text-right">Montant Réclamé</th>
                  <th className="py-3 px-4 text-right">Montant Admis</th>
                  <th className="py-3 px-4 text-center">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {bordereaux.map((b) => {
                  const estRegle = b.statut_organisme === 'regle'
                  const estAudit = b.statut_organisme === 'en_audit'

                  return (
                    <tr key={b.id} className="hover:bg-surface-hover/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-primary">
                        {b.numero_bordereau}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-foreground">
                        {b.organisme_nom}
                      </td>
                      <td className="py-3.5 px-4 text-foreground-muted font-mono">
                        {b.periode_debut} au {b.periode_fin}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold">
                        {b.nombre_factures}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground">
                        {formatCFA(b.montant_total_reclame)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600">
                        {formatCFA(b.montant_total_admis)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            estRegle
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : estAudit
                              ? 'bg-amber-500/10 text-amber-600'
                              : 'bg-primary/10 text-primary'
                          }`}
                        >
                          {estRegle ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              Règlement Effectué
                            </>
                          ) : estAudit ? (
                            <>
                              <Clock className="w-3 h-3" />
                              Audit Médical IPM
                            </>
                          ) : (
                            <>
                              <Send className="w-3 h-3" />
                              Télétransmis
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

