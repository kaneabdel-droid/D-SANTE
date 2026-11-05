'use client'

import { useState } from 'react'
import { Activity, Plus, X, AlertTriangle, HeartPulse, CheckCircle2 } from 'lucide-react'
import { enregistrerConstantes } from './actions'

export default function NouveauTriageModal({
  patients,
  preselectedPatientId,
}: {
  patients: any[]
  preselectedPatientId?: string
}) {
  const [isOpen, setIsOpen] = useState(Boolean(preselectedPatientId))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [evaScore, setEvaScore] = useState<number>(0)
  const [poids, setPoids] = useState<string>('')
  const [taille, setTaille] = useState<string>('')

  // Calcul instantané IMC
  const p = parseFloat(poids)
  const t = parseFloat(taille)
  const imc = p > 0 && t > 0 ? (p / ((t / 100) * (t / 100))).toFixed(1) : null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const res = await enregistrerConstantes(formData)

    setIsSubmitting(false)
    if (res?.error) {
      setError(res.error)
    } else {
      setIsOpen(false)
    }
  }

  const champ =
    'block w-full rounded-xl border border-surface-border bg-background py-2.5 px-3 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true)
          setError(null)
        }}
        className="inline-flex items-center gap-2 rounded-xl bg-danger px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-danger/90 transition-colors"
      >
        <Activity className="w-4 h-4 animate-pulse" />
        <span>Prendre Constantes</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs overflow-hidden">
          <div className="bg-surface border border-surface-border w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] rounded-2xl sm:rounded-3xl shadow-2xl relative flex flex-col my-auto overflow-hidden">
            {/* En-tête fixe */}
            <div className="p-4 sm:p-6 pb-3 border-b border-surface-border/60 shrink-0 flex items-center justify-between bg-surface">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-danger/10 text-danger flex items-center justify-center shrink-0">
                  <HeartPulse className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-bold font-heading text-foreground">
                    Fiche de Triage & Constantes Vitales
                  </h3>
                  <p className="text-xs text-foreground-muted">
                    Évaluation clinique immédiate et classification du niveau d&apos;urgence.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-foreground-muted hover:text-foreground hover:bg-black/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mx-4 sm:mx-6 mt-3 p-3 bg-danger/10 border border-danger/20 text-danger rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              {/* Corps défilable */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
              {/* Choix du patient */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Patient concerné *
                </label>
                <select
                  name="patient_id"
                  defaultValue={preselectedPatientId || ''}
                  required
                  className={champ}
                >
                  <option value="">Sélectionner un patient dans le fichier...</option>
                  {patients.map((pat) => (
                    <option key={pat.id} value={pat.id}>
                      {pat.nom} {pat.prenom} ({pat.ipp})
                    </option>
                  ))}
                </select>
              </div>

              {/* Constantes cardio-vasculaires & respiratoires */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-foreground mb-1">
                    Tension Syst. (mmHg)
                  </label>
                  <input
                    type="number"
                    name="tension_systolique"
                    placeholder="ex: 120"
                    className={champ}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-foreground mb-1">
                    Tension Diast. (mmHg)
                  </label>
                  <input
                    type="number"
                    name="tension_diastolique"
                    placeholder="ex: 80"
                    className={champ}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-foreground mb-1">
                    Température (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="temperature"
                    placeholder="ex: 37.2"
                    className={champ}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-foreground mb-1">
                    Pouls (bpm)
                  </label>
                  <input
                    type="number"
                    name="pouls"
                    placeholder="ex: 75"
                    className={champ}
                  />
                </div>
              </div>

              {/* SpO2, Fréquence et Glycémie */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-foreground mb-1">
                    Saturation SpO2 (%)
                  </label>
                  <input
                    type="number"
                    name="saturation_o2"
                    placeholder="ex: 98"
                    max="100"
                    className={champ}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-foreground mb-1">
                    Fréq. Respiratoire (/min)
                  </label>
                  <input
                    type="number"
                    name="frequence_respiratoire"
                    placeholder="ex: 16"
                    className={champ}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-foreground mb-1">
                    Glycémie (g/L)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="glycemie"
                    placeholder="ex: 1.05"
                    className={champ}
                  />
                </div>
              </div>

              {/* Paramètres anthropométriques (Poids, Taille, IMC) */}
              <div className="p-3 bg-surface-border/20 rounded-2xl border border-surface-border/50 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                <div>
                  <label className="block text-[11px] font-semibold text-foreground mb-1">
                    Poids (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="poids_kg"
                    value={poids}
                    onChange={(e) => setPoids(e.target.value)}
                    placeholder="ex: 68.5"
                    className={champ}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-foreground mb-1">
                    Taille (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    name="taille_cm"
                    value={taille}
                    onChange={(e) => setTaille(e.target.value)}
                    placeholder="ex: 172"
                    className={champ}
                  />
                </div>
                <div className="text-center sm:text-right pb-1">
                  <span className="text-[10px] text-foreground-muted block font-semibold">
                    Indice IMC calculé
                  </span>
                  <span className="text-sm font-mono font-bold text-primary">
                    {imc ? `${imc} kg/m²` : '—'}
                  </span>
                </div>
              </div>

              {/* Échelle Visuelle Analogique de la Douleur (EVA 0 à 10) */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-foreground">
                    Échelle de la Douleur (EVA : 0 = Aucune, 10 = Intolérable)
                  </label>
                  <span
                    className={`text-xs font-black font-mono px-2 py-0.5 rounded-md ${
                      evaScore >= 7
                        ? 'bg-danger text-white'
                        : evaScore >= 4
                        ? 'bg-amber-400 text-black'
                        : 'bg-emerald-500 text-white'
                    }`}
                  >
                    EVA : {evaScore}/10
                  </span>
                </div>
                <input
                  type="range"
                  name="douleur_eva"
                  min="0"
                  max="10"
                  value={evaScore}
                  onChange={(e) => setEvaScore(parseInt(e.target.value, 10))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              {/* Observations & Motifs */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Observations de Triage / Plaintes principales
                </label>
                <textarea
                  name="observations"
                  rows={2}
                  placeholder="ex: Patient conscient, dyspnéique au repos, pâleur conjonctivale..."
                  className={champ}
                />
              </div>

              </div>

              {/* Boutons validation fixes en bas */}
              <div className="p-4 sm:p-6 pt-3 border-t border-surface-border/60 shrink-0 flex items-center justify-end gap-3 bg-surface">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-surface-border text-foreground-muted hover:text-foreground text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-danger text-white text-xs font-bold hover:bg-danger/90 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Analyse & Enregistrement...' : 'Valider le Triage'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
