'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Activity,
  Building2,
  Users,
  CreditCard,
  Bed,
  Stethoscope,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  Phone,
  Zap,
  SlidersHorizontal,
  X,
  ShieldCheck,
  Lock,
  Unlock,
  HeartPulse,
} from 'lucide-react'
import { ParametragePasserelles } from './ParametragePasserelles'

export function SuperAdminDashboardClient() {
  const [activeTab, setActiveTab] = useState<'structures' | 'passerelles' | 'kpis'>('structures')
  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState('tous')
  const [filterTier, setFilterTier] = useState('tous')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  const [structures, setStructures] = useState([
    {
      id: 'str-01',
      nom: 'Clinique de la Madeleine',
      type: 'clinique',
      ville: 'Dakar Plateau',
      pays: 'Sénégal',
      contact: '+221 33 889 94 70',
      email: 'contact@madeleine.sn',
      tier: 'clinique',
      prix: '15 000 FCFA/m',
      lits: 45,
      medecins: 18,
      status: 'actif',
      expireLe: '2027-10-30',
    },
    {
      id: 'str-02',
      nom: 'Polyclinique Cheikh Anta Diop',
      type: 'hopital',
      ville: 'Fann Résidence',
      pays: 'Sénégal',
      contact: '+221 33 825 00 00',
      email: 'direction@polyclinique-ucad.sn',
      tier: 'hopital',
      prix: '20 000 FCFA/m',
      lits: 80,
      medecins: 32,
      status: 'actif',
      expireLe: '2027-08-15',
    },
    {
      id: 'str-03',
      nom: 'Centre Médical Noflaye',
      type: 'poste_sante',
      ville: 'Rufisque',
      pays: 'Sénégal',
      contact: '+221 77 412 88 90',
      email: 'sante.noflaye@gmail.com',
      tier: 'poste_sante',
      prix: '10 000 FCFA/m',
      lits: 8,
      medecins: 3,
      status: 'actif',
      expireLe: '2026-11-14',
    },
    {
      id: 'str-04',
      nom: 'Cabinet Pédiatrique & Maternité Al-Baraka',
      type: 'clinique',
      ville: 'Thiès',
      pays: 'Sénégal',
      contact: '+221 78 520 11 22',
      email: 'albaraka.sante@gmail.com',
      tier: 'clinique',
      prix: '15 000 FCFA/m',
      lits: 12,
      medecins: 5,
      status: 'actif',
      expireLe: '2027-04-20',
    },
    {
      id: 'str-05',
      nom: 'Poste de Santé Communautaire de Toubacouta',
      type: 'poste_sante',
      ville: 'Toubacouta',
      pays: 'Sénégal',
      contact: '+221 77 200 44 99',
      email: 'ps.toubacouta@sante.sn',
      tier: 'poste_sante',
      prix: '10 000 FCFA/m',
      lits: 6,
      medecins: 2,
      status: 'essai',
      expireLe: '2026-11-20',
    },
  ])

  // New Structure Form State
  const [newNom, setNewNom] = useState('')
  const [newType, setNewType] = useState('clinique')
  const [newVille, setNewVille] = useState('Dakar')
  const [newLits, setNewLits] = useState(20)
  const [newMedecins, setNewMedecins] = useState(5)
  const [newContact, setNewContact] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newTier, setNewTier] = useState<'poste_sante' | 'clinique' | 'hopital'>('clinique')
  const [newStatus, setNewStatus] = useState('essai')

  const handleCreateStructure = (e: React.FormEvent) => {
    e.preventDefault()
    const prixMap = {
      poste_sante: '10 000 FCFA/m',
      clinique: '15 000 FCFA/m',
      hopital: '20 000 FCFA/m',
    }

    const newEntry = {
      id: `str-${Date.now().toString().slice(-4)}`,
      nom: newNom,
      type: newType,
      ville: newVille,
      pays: 'Sénégal',
      contact: newContact || '+221 77 000 00 00',
      email: newEmail || 'contact@structure.sn',
      tier: newTier,
      prix: prixMap[newTier],
      lits: Number(newLits),
      medecins: Number(newMedecins),
      status: newStatus,
      expireLe: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
    }

    setStructures([newEntry, ...structures])
    setIsModalOpen(false)
    setNewNom('')
    setNewContact('')
    setNewEmail('')
    setSuccessToast(`La structure "${newEntry.nom}" a été créée avec succès !`)
    setTimeout(() => setSuccessToast(null), 3500)
  }

  const toggleStatut = (id: string) => {
    setStructures((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const next = s.status === 'actif' ? 'suspendu' : 'actif'
          return { ...s, status: next }
        }
        return s
      })
    )
  }

  const cycleTier = (id: string) => {
    setStructures((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          let nextTier: 'poste_sante' | 'clinique' | 'hopital' = 'clinique'
          let nextPrix = '15 000 FCFA/m'
          if (s.tier === 'poste_sante') {
            nextTier = 'clinique'
            nextPrix = '15 000 FCFA/m'
          } else if (s.tier === 'clinique') {
            nextTier = 'hopital'
            nextPrix = '20 000 FCFA/m'
          } else {
            nextTier = 'poste_sante'
            nextPrix = '10 000 FCFA/m'
          }
          return { ...s, tier: nextTier, prix: nextPrix }
        }
        return s
      })
    )
  }

  const prolongerAbonnement = (id: string) => {
    setStructures((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const current = new Date(s.expireLe)
          current.setFullYear(current.getFullYear() + 1)
          return { ...s, expireLe: current.toISOString().split('T')[0], status: 'actif' }
        }
        return s
      })
    )
    setSuccessToast("Abonnement prolongé d'une année supplémentaire.")
    setTimeout(() => setSuccessToast(null), 3000)
  }

  const filteredStructures = structures.filter((s) => {
    const matchSearch =
      s.nom.toLowerCase().includes(search.toLowerCase()) ||
      s.ville.toLowerCase().includes(search.toLowerCase()) ||
      s.contact.toLowerCase().includes(search.toLowerCase())
    const matchStatut = filterStatut === 'tous' || s.status === filterStatut
    const matchTier = filterTier === 'tous' || s.tier === filterTier
    return matchSearch && matchStatut && matchTier
  })

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-2.5">
            <Activity className="w-7 h-7 text-emerald-400" />
            Tableau de Bord SuperAdmin • D-SANTÉ
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Gestion centrale des structures médicales et passerelles Maketou & Chariow
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Créer une Structure de Santé</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('structures')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'structures'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Gestion des Structures ({structures.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('passerelles')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'passerelles'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Paramétrage Maketou & Chariow</span>
        </button>

        <button
          onClick={() => setActiveTab('kpis')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'kpis'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Abonnements & Licences</span>
        </button>
      </div>

      {/* ── ONGLET 1 : GESTION DES STRUCTURES ── */}
      {activeTab === 'structures' && (
        <div className="space-y-6">
          {/* Filtres */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Rechercher structure, ville, contact..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-emerald-500"
              >
                <option value="tous">Tous les statuts</option>
                <option value="actif">Actif</option>
                <option value="essai">En essai</option>
                <option value="suspendu">Suspendu</option>
              </select>

              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-emerald-500"
              >
                <option value="tous">Tous les forfaits</option>
                <option value="poste_sante">Poste de Santé (10k)</option>
                <option value="clinique">Centre / Clinique (12.5k)</option>
                <option value="hopital">Hôpital (15k)</option>
              </select>
            </div>
          </div>

          {/* Tableau */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-4">Structure</th>
                    <th className="px-5 py-4">Forfait Actif</th>
                    <th className="px-5 py-4">Capacité Lits & Équipe</th>
                    <th className="px-5 py-4">Contact</th>
                    <th className="px-5 py-4">Statut</th>
                    <th className="px-5 py-4">Échéance</th>
                    <th className="px-5 py-4 text-right">Actions SuperAdmin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredStructures.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-white text-sm">{s.nom}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-emerald-400" />
                          <span>{s.ville}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              s.tier === 'hopital'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : s.tier === 'clinique'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            }`}
                          >
                            {s.tier === 'hopital'
                              ? 'Hôpital'
                              : s.tier === 'clinique'
                              ? 'Centre / Clinique'
                              : 'Poste de Santé'}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 mt-1">{s.prix}</div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 font-semibold text-white">
                            <Bed className="w-3.5 h-3.5 text-slate-400" />
                            {s.lits} lits
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="flex items-center gap-1 text-slate-300">
                            <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                            {s.medecins} méd.
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-mono text-white text-xs">{s.contact}</div>
                        <div className="text-[11px] text-slate-400">{s.email}</div>
                      </td>

                      <td className="px-5 py-4">
                        {s.status === 'actif' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Actif
                          </span>
                        )}
                        {s.status === 'essai' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            <Clock className="w-3 h-3 text-amber-400" />
                            Essai 7j
                          </span>
                        )}
                        {s.status === 'suspendu' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            <AlertCircle className="w-3 h-3 text-rose-400" />
                            Suspendu
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 font-mono text-slate-400 text-xs">
                        {s.expireLe}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => cycleTier(s.id)}
                            title="Basculer forfait Poste (10k) / Clinique (12.5k) / Hôpital (15k)"
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700 transition-colors"
                          >
                            Changer Plan
                          </button>
                          <button
                            type="button"
                            onClick={() => prolongerAbonnement(s.id)}
                            title="Prolonger la licence d'1 an"
                            className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 text-[11px] font-semibold border border-emerald-800/60 transition-colors"
                          >
                            +1 An
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleStatut(s.id)}
                            title={s.status === 'actif' ? 'Suspendre' : 'Activer'}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              s.status === 'actif'
                                ? 'bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border-slate-700'
                                : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            }`}
                          >
                            {s.status === 'actif' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── ONGLET 2 : PARAMÉTRAGE PASSERELLES ── */}
      {activeTab === 'passerelles' && <ParametragePasserelles />}

      {/* ── ONGLET 3 : KPIS & REVENUS ── */}
      {activeTab === 'kpis' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs uppercase font-semibold text-slate-400 block mb-1">
              Structures de Santé
            </span>
            <div className="text-3xl font-black text-emerald-400">{structures.length}</div>
            <div className="text-[11px] text-slate-500 mt-1">Hôpitaux, cliniques & postes</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs uppercase font-semibold text-slate-400 block mb-1">
              Lits d&apos;hospitalisation
            </span>
            <div className="text-3xl font-black text-white">151</div>
            <div className="text-[11px] text-slate-500 mt-1">Capacité lits sous gestion</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs uppercase font-semibold text-slate-400 block mb-1">
              MRR Licences Santé
            </span>
            <div className="text-3xl font-black text-teal-400">60 000 F</div>
            <div className="text-[11px] text-slate-500 mt-1">Revenu récurrent mensuel</div>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs uppercase font-semibold text-slate-400 block mb-1">
              Volume Mobile Money (Maketou)
            </span>
            <div className="text-3xl font-black text-sky-400">96.8%</div>
            <div className="text-[11px] text-slate-500 mt-1">Wave & Orange Money</div>
          </div>
        </div>
      )}

      {/* ── MODAL : CRÉER UNE STRUCTURE ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Créer une Structure de Santé</h3>
                <p className="text-xs text-slate-400">Enrôlement d&apos;un hôpital, clinique ou poste de santé</p>
              </div>
            </div>

            <form onSubmit={handleCreateStructure} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nom de la structure *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Clinique Pasteur Dakar"
                  value={newNom}
                  onChange={(e) => setNewNom(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Ville / Région *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dakar"
                    value={newVille}
                    onChange={(e) => setNewVille(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Type de structure *
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value="clinique">Clinique Privée</option>
                    <option value="hopital">Hôpital / Polyclinique</option>
                    <option value="centre">Centre de Santé</option>
                    <option value="poste_sante">Poste de Santé / Dispensaire</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Formule d&apos;Abonnement *
                  </label>
                  <select
                    value={newTier}
                    onChange={(e) => setNewTier(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value="poste_sante">Poste de Santé (10 000 F/m)</option>
                    <option value="clinique">Centre & Clinique (15 000 F/m)</option>
                    <option value="hopital">Hôpital & Polyclinique (20 000 F/m)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Statut initial *
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value="essai">Période d&apos;essai 7 jours</option>
                    <option value="actif">Actif (Abonnement réglé)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nombre de Lits
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newLits}
                    onChange={(e) => setNewLits(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Médecins & Soignants
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newMedecins}
                    onChange={(e) => setNewMedecins(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Téléphone WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+221 77 000 00 00"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email officiel
                  </label>
                  <input
                    type="email"
                    placeholder="direction@structure.sn"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20"
                >
                  Créer la Structure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
