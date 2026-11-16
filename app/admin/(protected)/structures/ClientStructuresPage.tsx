'use client'

import { useState } from 'react'
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
  Edit2,
  Trash2,
  Activity,
  HeartPulse,
} from 'lucide-react'
import {
  type StructureItem,
  creerStructureSuperAdmin,
  modifierStructureSuperAdmin,
  supprimerStructureSuperAdmin,
  toggleVerrouillerStructure,
} from '@/app/admin/(protected)/actions'

export function ClientStructuresPage({
  initialStructures,
}: {
  initialStructures: StructureItem[]
}) {
  const [structures, setStructures] = useState<StructureItem[]>(initialStructures)
  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState('tous')
  const [filterTier, setFilterTier] = useState('tous')

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingStructure, setEditingStructure] = useState<StructureItem | null>(null)
  const [deletingStructure, setDeletingStructure] = useState<StructureItem | null>(null)

  const [loadingActionId, setLoadingActionId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3500)
  }

  // Verrouiller / Déverrouiller
  const handleToggleLock = async (s: StructureItem) => {
    const isLocked = s.status === 'suspendu' || s.compte_verrouille
    const newBlockedState = !isLocked
    setLoadingActionId(s.id)

    const res = await toggleVerrouillerStructure(s.id, newBlockedState)
    setLoadingActionId(null)

    if (res?.success) {
      setStructures((prev) =>
        prev.map((item) =>
          item.id === s.id
            ? {
              ...item,
              status: newBlockedState ? 'suspendu' : 'actif',
              compte_verrouille: newBlockedState,
            }
            : item
        )
      )
      showToast(
        newBlockedState
          ? `La structure "${s.nom}" a été verrouillée (accès bloqué).`
          : `La structure "${s.nom}" a été activée et déverrouillée avec succès.`
      )
    } else {
      showToast(res?.error || 'Action impossible', 'error')
    }
  }

  // Création
  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const res = await creerStructureSuperAdmin(formData)
    setIsSubmitting(false)

    if (res?.success) {
      if (res.structure) {
        setStructures((prev) => [res.structure as StructureItem, ...prev])
      }
      setIsAddModalOpen(false)
      showToast(`La structure médicale a été créée avec succès !`)
    } else {
      showToast(res?.error || 'Erreur lors de la création', 'error')
    }
  }

  // Modification
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingStructure) return
    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    formData.set('id', editingStructure.id)

    const res = await modifierStructureSuperAdmin(formData)
    setIsSubmitting(false)

    if (res?.success) {
      const updatedNom = (formData.get('nom') as string) || editingStructure.nom
      const updatedType = (formData.get('type') as string) || editingStructure.type
      const updatedVille = (formData.get('ville') as string) || editingStructure.ville
      const updatedContact = (formData.get('contact') as string) || editingStructure.contact
      const updatedEmail = (formData.get('email') as string) || editingStructure.email
      const updatedTier = (formData.get('tier') as string) || editingStructure.tier
      const updatedStatut = (formData.get('statut') as string) || editingStructure.status

      setStructures((prev) =>
        prev.map((item) =>
          item.id === editingStructure.id
            ? {
              ...item,
              nom: updatedNom,
              type: updatedType,
              ville: updatedVille,
              contact: updatedContact,
              email: updatedEmail,
              tier: updatedTier,
              status: updatedStatut as 'actif' | 'suspendu',
              compte_verrouille: updatedStatut === 'suspendu',
            }
            : item
        )
      )
      setEditingStructure(null)
      showToast(`La structure "${updatedNom}" a été modifiée avec succès !`)
    } else {
      showToast(res?.error || 'Erreur lors de la modification', 'error')
    }
  }

  // Suppression
  const handleDeleteConfirm = async () => {
    if (!deletingStructure) return
    setIsSubmitting(true)
    const res = await supprimerStructureSuperAdmin(deletingStructure.id)
    setIsSubmitting(false)

    if (res?.success) {
      setStructures((prev) => prev.filter((item) => item.id !== deletingStructure.id))
      const nomSupprime = deletingStructure.nom
      setDeletingStructure(null)
      showToast(`La structure "${nomSupprime}" a été supprimée définitivement.`)
    } else {
      showToast(res?.error || 'Erreur lors de la suppression', 'error')
    }
  }

  // Filtrage
  const filtered = structures.filter((s) => {
    const matchSearch =
      s.nom.toLowerCase().includes(search.toLowerCase()) ||
      s.ville.toLowerCase().includes(search.toLowerCase()) ||
      (s.email && s.email.toLowerCase().includes(search.toLowerCase())) ||
      s.contact.toLowerCase().includes(search.toLowerCase())
    const matchStatut = filterStatut === 'tous' || s.status === filterStatut
    const matchTier = filterTier === 'tous' || s.tier === filterTier
    return matchSearch && matchStatut && matchTier
  })

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce ${toast.type === 'success'
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-rose-500 text-white'
            }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-emerald-600" />
            Structures Médicales Déployées
          </h1>
          <p className="text-sm text-foreground-muted mt-1">
            Supervision, gestion des accès, modifications et suppressions des structures de santé clientes.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-hover shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Structure</span>
        </button>
      </div>

      {/* Barre de Recherche et Filtres */}
      <div className="p-4 rounded-xl bg-background border border-surface-border flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-foreground-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher une clinique, un hôpital, une ville ou un contact..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-surface border border-surface-border text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg bg-surface border border-surface-border text-foreground focus:outline-none focus:border-primary"
          >
            <option value="tous">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="suspendu">Suspendu / Verrouillé</option>
          </select>

          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg bg-surface border border-surface-border text-foreground focus:outline-none focus:border-primary"
          >
            <option value="tous">Tous les forfaits</option>
            <option value="poste_sante">Poste de santé</option>
            <option value="clinique">Centre & Clinique</option>
            <option value="hopital">Hôpital & CHU</option>
          </select>
        </div>
      </div>

      {/* Table des Structures */}
      <div className="rounded-xl bg-background border border-surface-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface border-b border-surface-border text-foreground-muted uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Structure Médicale</th>
                <th className="py-3.5 px-4">Localisation</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Licence & Forfait</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-foreground-muted">
                    Aucune structure médicale ne correspond à vos critères.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => {
                  const isLocked = s.status === 'suspendu' || s.compte_verrouille
                  const isLoading = loadingActionId === s.id

                  return (
                    <tr key={s.id} className="hover:bg-surface/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                            <Activity className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-foreground text-sm truncate">{s.nom}</p>
                            <span className="text-[11px] text-foreground-muted capitalize">
                              {s.type.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-foreground">
                          <MapPin className="w-3.5 h-3.5 text-foreground-muted shrink-0" />
                          <span>{s.ville}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div>
                          <p className="text-foreground">{s.contact}</p>
                          {s.email && <p className="text-[11px] text-foreground-muted truncate">{s.email}</p>}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase">
                          {s.tier.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {isLocked ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-danger/10 text-danger border border-danger/20">
                            <Lock className="w-3 h-3" />
                            Verrouillé
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            Actif
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Verrouiller / Activer */}
                          <button
                            type="button"
                            onClick={() => handleToggleLock(s)}
                            disabled={isLoading}
                            title={isLocked ? 'Déverrouiller l\'accès' : 'Verrouiller l\'accès'}
                            className={`p-1.5 rounded-lg transition-all ${isLocked
                                ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                                : 'bg-danger/10 text-danger hover:bg-danger/20'
                              }`}
                          >
                            {isLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : isLocked ? (
                              <Unlock className="w-4 h-4" />
                            ) : (
                              <Lock className="w-4 h-4" />
                            )}
                          </button>

                          {/* Modifier */}
                          <button
                            type="button"
                            onClick={() => setEditingStructure(s)}
                            title="Modifier cette structure"
                            className="p-1.5 rounded-lg bg-surface hover:bg-surface-border text-foreground transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Supprimer */}
                          <button
                            type="button"
                            onClick={() => setDeletingStructure(s)}
                            title="Supprimer cette structure"
                            className="p-1.5 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* ── MODAL NOUVELLE STRUCTURE ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-surface-border shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-surface-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="font-bold font-heading text-base text-foreground">Ajouter une Structure de Santé</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-foreground-muted hover:bg-surface-border"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">Nom de la structure *</label>
                <input
                  type="text"
                  name="nom"
                  required
                  placeholder="Ex : Clinique Pasteur Dakar"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Type d&apos;établissement</label>
                  <select
                    name="type"
                    defaultValue="clinique"
                    className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="clinique">Clinique / Centre</option>
                    <option value="hopital">Hôpital / CHU</option>
                    <option value="poste_sante">Poste de santé</option>
                    <option value="cabinet">Cabinet médical</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Ville / Région</label>
                  <input
                    type="text"
                    name="ville"
                    defaultValue="Dakar"
                    className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Téléphone de contact</label>
                  <input
                    type="text"
                    name="contact"
                    placeholder="+221 33 000 00 00"
                    className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Email administratif</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="contact@clinique.sn"
                    className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Forfait d&apos;abonnement</label>
                  <select
                    name="tier"
                    defaultValue="clinique"
                    className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="poste_sante">Poste de santé (15 000 FCFA/m)</option>
                    <option value="clinique">Centre & Clinique (35 000 FCFA/m)</option>
                    <option value="hopital">Hôpital & CHU (60 000 FCFA/m)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Statut initial</label>
                  <select
                    name="statut"
                    defaultValue="actif"
                    className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="actif">Actif (Accès ouvert)</option>
                    <option value="suspendu">Verrouillé</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-surface-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-surface-border text-foreground hover:bg-surface-border"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary-hover disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>Créer la structure</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL MODIFICATION STRUCTURE ── */}
      {editingStructure && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-surface-border shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-surface-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Edit2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold font-heading text-base text-foreground">Modifier la Structure</h3>
              </div>
              <button
                onClick={() => setEditingStructure(null)}
                className="p-1 rounded-lg text-foreground-muted hover:bg-surface-border"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">Nom de la structure *</label>
                <input
                  type="text"
                  name="nom"
                  required
                  defaultValue={editingStructure.nom}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Type d&apos;établissement</label>
                  <select
                    name="type"
                    defaultValue={editingStructure.type}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="clinique">Clinique / Centre</option>
                    <option value="hopital">Hôpital / CHU</option>
                    <option value="poste_sante">Poste de santé</option>
                    <option value="cabinet">Cabinet médical</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Ville / Région</label>
                  <input
                    type="text"
                    name="ville"
                    defaultValue={editingStructure.ville}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Téléphone de contact</label>
                  <input
                    type="text"
                    name="contact"
                    defaultValue={editingStructure.contact}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Email administratif</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingStructure.email || ''}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-foreground mb-1">Forfait d&apos;abonnement</label>
                  <select
                    name="tier"
                    defaultValue={editingStructure.tier}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="poste_sante">Poste de santé (15 000 FCFA/m)</option>
                    <option value="clinique">Centre & Clinique (35 000 FCFA/m)</option>
                    <option value="hopital">Hôpital & CHU (60 000 FCFA/m)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-foreground mb-1">Statut du compte</label>
                  <select
                    name="statut"
                    defaultValue={editingStructure.status}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-surface-border text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="actif">Actif (Accès ouvert)</option>
                    <option value="suspendu">Verrouillé / Suspendu</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-surface-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStructure(null)}
                  className="px-4 py-2 rounded-xl border border-surface-border text-foreground hover:bg-surface-border"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary-hover disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Enregistrer les modifications</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL CONFIRMATION SUPPRESSION ── */}
      {deletingStructure && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-danger/30 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-surface-border flex items-center justify-between bg-danger/10">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-danger/20 text-danger">
                  <Trash2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold font-heading text-base text-danger">Supprimer la Structure</h3>
              </div>
              <button
                onClick={() => setDeletingStructure(null)}
                className="p-1 rounded-lg text-foreground-muted hover:bg-surface-border"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-foreground leading-relaxed">
                Êtes-vous certain de vouloir supprimer définitivement la structure médicale{' '}
                <strong className="text-danger font-bold">{deletingStructure.nom}</strong> ?
              </p>
              <div className="p-3.5 rounded-xl bg-danger/10 border border-danger/20 text-danger flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Cette action est irréversible. Les comptes utilisateurs, dossiers et données rattachés seront purgés de la plateforme.
                </span>
              </div>

              <div className="pt-4 border-t border-surface-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeletingStructure(null)}
                  className="px-4 py-2 rounded-xl border border-surface-border text-foreground hover:bg-surface-border"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-danger text-white font-bold hover:bg-danger/90 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  <span>Confirmer la suppression</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

