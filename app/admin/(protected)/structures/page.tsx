'use client'

import { useState, useTransition } from 'react'
import {
  Building2,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  ShieldCheck,
  Stethoscope,
  X,
  Phone,
  Mail,
  MapPin,
  Loader2,
} from 'lucide-react'
import { toggleVerrouillerStructure } from '@/app/admin/(protected)/actions'

export default function StructuresPage() {
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const [structuresList, setStructuresList] = useState([
    {
      id: 'str-01',
      nom: 'Clinique de la Madeleine',
      type: 'clinique',
      ville: 'Dakar Plateau',
      pays: 'Sénégal',
      contact: '+221 33 889 94 70',
      email: 'contact@madeleine.sn',
      tier: 'hopital',
      lits: 45,
      medecins: 18,
      status: 'actif',
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
      lits: 80,
      medecins: 32,
      status: 'actif',
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
      lits: 8,
      medecins: 3,
      status: 'actif',
    },
    {
      id: 'str-04',
      nom: 'Cabinet Pédiatrique & Maternité Al-Baraka',
      type: 'cabinet',
      ville: 'Thiès',
      pays: 'Sénégal',
      contact: '+221 78 520 11 22',
      email: 'albaraka.sante@gmail.com',
      tier: 'clinique',
      lits: 12,
      medecins: 5,
      status: 'actif',
    },
  ])

  // New Structure Form State
  const [newNom, setNewNom] = useState('')
  const [newType, setNewType] = useState('clinique')
  const [newVille, setNewVille] = useState('')
  const [newContact, setNewContact] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newTier, setNewTier] = useState('clinique')
  const [newLits, setNewLits] = useState('20')

  function handleCreateStructure(e: React.FormEvent) {
    e.preventDefault()
    const newStructure = {
      id: `str-${Date.now().toString().slice(-4)}`,
      nom: newNom,
      type: newType,
      ville: newVille || 'Dakar',
      pays: 'Sénégal',
      contact: newContact || '+221 77 000 00 00',
      email: newEmail || 'admin@structure.sn',
      tier: newTier,
      lits: parseInt(newLits) || 10,
      medecins: 4,
      status: 'actif',
    }

    setStructuresList([newStructure, ...structuresList])
    setIsModalOpen(false)
    setSuccessMsg(`La structure médicale "${newNom}" a été déployée avec succès.`)
    setNewNom('')
    setNewVille('')
    setNewContact('')
    setNewEmail('')
    setTimeout(() => setSuccessMsg(null), 5000)
  }

  async function toggleLock(id: string, currentlyActive: boolean) {
    const bloquer = currentlyActive
    setLoadingActionId(id)

    const res = await toggleVerrouillerStructure(id, bloquer)
    setLoadingActionId(null)

    if (res?.success) {
      setStructuresList((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, status: bloquer ? 'suspendu' : 'actif' }
            : s
        )
      )
      setSuccessMsg(
        bloquer
          ? 'Structure médicale verrouillée (accès bloqué).'
          : 'Structure médicale activée et déverrouillée avec succès.'
      )
      setTimeout(() => setSuccessMsg(null), 4000)
    } else {
      setSuccessMsg(`Erreur : ${res?.error || 'Action impossible'}`)
      setTimeout(() => setSuccessMsg(null), 4000)
    }
  }

  const filtered = structuresList.filter(
    (s) =>
      s.nom.toLowerCase().includes(search.toLowerCase()) ||
      s.ville.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Structures de santé déployées
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Gestion du parc de cliniques, hôpitaux, postes de santé et cabinets médicaux.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Déployer une nouvelle structure
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom de clinique ou ville..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="text-xs text-slate-400 font-medium">
          {filtered.length} structure(s) enregistrée(s)
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl relative flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-extrabold text-emerald-400 text-lg">
                    {s.nom.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">{s.nom}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-400 capitalize">
                        {s.type.replace('_', ' ')}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {s.ville}
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${s.status === 'actif'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                >
                  {s.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800/80 my-3 text-center text-xs">
                <div className="p-2 bg-slate-950/60 rounded-xl">
                  <span className="text-slate-400 block text-[10px] uppercase">
                    Capacité Lits
                  </span>
                  <span className="font-bold text-white text-sm">{s.lits}</span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-xl">
                  <span className="text-slate-400 block text-[10px] uppercase">
                    Praticiens
                  </span>
                  <span className="font-bold text-white text-sm">{s.medecins}</span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-xl">
                  <span className="text-slate-400 block text-[10px] uppercase">
                    Abonnement
                  </span>
                  <span className="font-bold text-emerald-400 uppercase text-xs">
                    {s.tier}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-400 pt-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{s.contact}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{s.email}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800">
              <span className="text-[11px] text-slate-500 font-mono">
                ID: {s.id}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleLock(s.id, s.status === 'actif')}
                  disabled={loadingActionId === s.id}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 ${s.status === 'actif'
                    ? 'bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/20'
                    : 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/20'
                    }`}
                >
                  {loadingActionId === s.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : s.status === 'actif' ? (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Verrouiller</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      <span>Activer</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Déploiement Structure */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-white">
                  Déployer une structure médicale
                </h3>
                <p className="text-xs text-slate-400">
                  Initialisation d&apos;un nouveau tenant médical sur D-SANTÉ
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStructure} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nom de l&apos;établissement médical *
                </label>
                <input
                  required
                  value={newNom}
                  onChange={(e) => setNewNom(e.target.value)}
                  placeholder="Ex: Clinique Al-Amine"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Type de structure
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="poste_sante">Poste / Dispensaire</option>
                    <option value="cabinet">Cabinet Médical Spécialisé</option>
                    <option value="clinique">Clinique Médico-Chirurgicale</option>
                    <option value="hopital">Hôpital & Polyclinique</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Formule Licence
                  </label>
                  <select
                    value={newTier}
                    onChange={(e) => setNewTier(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="poste_sante">Poste de santé (10 000 F/m)</option>
                    <option value="clinique">Centre & Clinique (15 000 F/m)</option>
                    <option value="hopital">Hôpital & Polyclinique (20 000 F/m)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Ville d&apos;implantation
                  </label>
                  <input
                    value={newVille}
                    onChange={(e) => setNewVille(e.target.value)}
                    placeholder="Ex: Dakar, Thiès, Kaolack"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nombre de lits
                  </label>
                  <input
                    type="number"
                    value={newLits}
                    onChange={(e) => setNewLits(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Téléphone contact
                  </label>
                  <input
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    placeholder="+221 77 000 00 00"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email administrateur
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="direction@clinique.sn"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20"
                >
                  Activer le tenant médical
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

