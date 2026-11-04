'use client'

import { useState } from 'react'
import { signupAction } from './actions'
import {
  HeartPulse, Building2, User, Mail, Phone, Lock,
  ArrowRight, Loader2, ShieldCheck, CheckCircle2
} from 'lucide-react'

export function ClientSignupForm({
  initialPlan,
}: {
  initialPlan?: string
}) {
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(initialPlan || 'clinique')

  return (
    <form
      action={async (formData) => {
        setLoading(true)
        await signupAction(formData)
      }}
      className="space-y-4 text-xs"
    >
      <input type="hidden" name="plan" value={selectedPlan} />

      {/* Choix du forfait */}
      <div className="space-y-1.5">
        <label className="font-bold text-foreground block">
          Formule de structure choisie :
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'poste', label: 'Poste de Santé', price: '10.000 F/m' },
            { id: 'clinique', label: 'Clinique / Centre', price: '15.000 F/m' },
            { id: 'hopital', label: 'Hôpital / EPS', price: '20.000 F/m' },
          ].map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedPlan(p.id)}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                selectedPlan === p.id
                  ? 'border-primary bg-primary/10 text-primary font-bold shadow-xs'
                  : 'border-surface-border bg-background text-foreground-muted hover:border-surface-border/80'
              }`}
            >
              <span className="block font-bold text-[11px] truncate">{p.label}</span>
              <span className="text-[10px] text-foreground-muted font-mono">{p.price}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Informations de l'Établissement */}
      <div className="space-y-1.5">
        <label className="font-bold text-foreground block">
          Nom de la structure de santé *
        </label>
        <div className="relative">
          <Building2 className="w-4 h-4 absolute left-3 top-3 text-foreground-muted" />
          <input
            type="text"
            name="structure_nom"
            required
            placeholder="ex: Clinique Médicale Al-Amine ou Poste de Santé de Ndioum"
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-surface-border bg-background text-foreground focus:outline-none focus:border-primary text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="font-semibold text-foreground-muted block">
            Type d’établissement :
          </label>
          <select
            name="structure_type"
            className="w-full px-3 py-2.5 rounded-xl border border-surface-border bg-background text-foreground focus:outline-none focus:border-primary text-xs"
          >
            <option value="clinique">Clinique Privée</option>
            <option value="centre_sante">Centre de Santé</option>
            <option value="poste_sante">Poste de Santé / Dispensaire</option>
            <option value="hopital">Hôpital Régional / Polyclinique</option>
            <option value="cabinet">Cabinet Médical / Infirmerie</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="font-semibold text-foreground-muted block">
            Téléphone Wave / OM *
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 absolute left-3 top-3 text-foreground-muted" />
            <input
              type="tel"
              name="telephone"
              required
              placeholder="ex: 77 123 45 67"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-surface-border bg-background text-foreground focus:outline-none focus:border-primary text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* Responsable & Accès */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="font-semibold text-foreground-muted block">
            Prénom du Responsable
          </label>
          <input
            type="text"
            name="prenom"
            placeholder="ex: Dr. Aminata"
            className="w-full px-3 py-2.5 rounded-xl border border-surface-border bg-background text-foreground focus:outline-none focus:border-primary text-xs"
          />
        </div>
        <div className="space-y-1.5">
          <label className="font-semibold text-foreground-muted block">
            Nom de famille
          </label>
          <input
            type="text"
            name="nom"
            placeholder="ex: Diallo"
            className="w-full px-3 py-2.5 rounded-xl border border-surface-border bg-background text-foreground focus:outline-none focus:border-primary text-xs"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="font-bold text-foreground block">
          Adresse Email Professionnelle *
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 absolute left-3 top-3 text-foreground-muted" />
          <input
            type="email"
            name="email"
            required
            placeholder="direction@clinique-alamine.sn"
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-surface-border bg-background text-foreground focus:outline-none focus:border-primary text-xs"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="font-bold text-foreground block">
          Mot de passe secret *
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 absolute left-3 top-3 text-foreground-muted" />
          <input
            type="password"
            name="password"
            required
            minLength={6}
            placeholder="••••••••••••"
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-surface-border bg-background text-foreground focus:outline-none focus:border-primary text-xs"
          />
        </div>
        <span className="text-[10px] text-foreground-muted block">
          Minimum 6 caractères. Utilisé pour sécuriser les dossiers médicaux.
        </span>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-primary/20 transition-all cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
          <span>Créer la structure & Démarrer l&apos;essai gratuit</span>
        </button>
      </div>

      <div className="text-[11px] text-center text-foreground-muted pt-2 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>7 jours d&apos;essai gratuit • Aucun engagement bancaire</span>
      </div>
    </form>
  )
}

