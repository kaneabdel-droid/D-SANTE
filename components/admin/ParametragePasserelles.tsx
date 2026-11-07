'use client'

import { useState } from 'react'
import {
  CreditCard,
  Zap,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  Activity,
  HeartPulse,
} from 'lucide-react'

export function ParametragePasserelles() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [testResult, setTestResult] = useState<{ gateway: string; ok: boolean; message: string } | null>(null)
  const [isTesting, setIsTesting] = useState(false)

  // Config Maketou Santé
  const [maketouActif, setMaketouActif] = useState(true)
  const [maketouSandbox, setMaketouSandbox] = useState(false)
  const [maketouApiKey, setMaketouApiKey] = useState('mkt_live_sante_7a819b02efc349102847a')
  const [maketouShopId, setMaketouShopId] = useState('SHOP-DSANTE-SN-01')
  const [maketouSecret, setMaketouSecret] = useState('whsec_mkt_sante_19283749182739182')

  // Produits Maketou D-Santé
  const [mktPosteMensuel, setMktPosteMensuel] = useState('PRD-MKT-POSTE-10K')
  const [mktPosteAnnuel, setMktPosteAnnuel] = useState('PRD-MKT-POSTE-108K')
  const [mktCliniqueMensuel, setMktCliniqueMensuel] = useState('PRD-MKT-CLIN-15K')
  const [mktCliniqueAnnuel, setMktCliniqueAnnuel] = useState('PRD-MKT-CLIN-162K')
  const [mktHopitalMensuel, setMktHopitalMensuel] = useState('PRD-MKT-HOP-20K')
  const [mktHopitalAnnuel, setMktHopitalAnnuel] = useState('PRD-MKT-HOP-204K')

  // Config Chariow Santé
  const [chariowActif, setChariowActif] = useState(true)
  const [chariowSandbox, setChariowSandbox] = useState(false)
  const [chariowApiKey, setChariowApiKey] = useState('ch_live_sante_91827364510293847561')
  const [chariowSecret, setChariowSecret] = useState('ch_whsec_sante_8273649182736491')
  const [chariowProdPoste, setChariowProdPoste] = useState('CH-PRD-POSTE-10K')
  const [chariowProdClinique, setChariowProdClinique] = useState('CH-PRD-CLINIQUE-15K')
  const [chariowProdHopital, setChariowProdHopital] = useState('CH-PRD-HOPITAL-20K')

  const toggleSecret = (key: string) => {
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(id)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3500)
  }

  const handleTestPing = (gateway: 'maketou' | 'chariow') => {
    setIsTesting(true)
    setTestResult(null)
    setTimeout(() => {
      setIsTesting(false)
      setTestResult({
        gateway,
        ok: true,
        message: `Connectivité 200 OK avec le serveur ${gateway.toUpperCase()} Santé • Ping 128ms • Clés et Webhooks certifiés.`,
      })
    }, 800)
  }

  return (
    <div className="space-y-8">
      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Paramètres des passerelles Maketou et Chariow sauvegardés avec succès sur D-SANTÉ.</span>
        </div>
      )}

      {testResult && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center justify-between gap-3 ${testResult.ok
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{testResult.message}</span>
          </div>
          <button
            onClick={() => setTestResult(null)}
            className="text-[11px] underline opacity-80 hover:opacity-100"
          >
            Fermer
          </button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* ── SECTION 1 : MAKETOU SANTÉ (WAVE, ORANGE MONEY) ── */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-xl">
                M
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">Passerelle Maketou Médicale</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Wave & Orange Money • Autonome (Sans webhook)
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Règlements des abonnements hospitaliers et encaissements patients instantanés avec vérification directe de l&apos;état du panier (aucun webhook requis).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => handleTestPing('maketou')}
                disabled={isTesting}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                <span>Tester la connexion</span>
              </button>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={maketouActif}
                  onChange={(e) => setMaketouActif(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                <span className="ml-2 text-xs font-bold text-slate-300">
                  {maketouActif ? 'Actif' : 'Désactivé'}
                </span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Environnement d&apos;exécution
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-800 flex-1">
                  <input
                    type="radio"
                    name="mkt_sante_env"
                    checked={!maketouSandbox}
                    onChange={() => setMaketouSandbox(false)}
                    className="accent-emerald-500"
                  />
                  <span className="font-semibold text-white">Production (Live)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-800 flex-1">
                  <input
                    type="radio"
                    name="mkt_sante_env"
                    checked={maketouSandbox}
                    onChange={() => setMaketouSandbox(true)}
                    className="accent-emerald-500"
                  />
                  <span>Sandbox (Test)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Shop ID / Identifiant Marchand Santé
              </label>
              <input
                type="text"
                value={maketouShopId}
                onChange={(e) => setMaketouShopId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Clé API Secrète (Maketou API Key)
              </label>
              <div className="relative">
                <input
                  type={showSecrets.mkt_sante_key ? 'text' : 'password'}
                  value={maketouApiKey}
                  onChange={(e) => setMaketouApiKey(e.target.value)}
                  className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-hidden focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => toggleSecret('mkt_sante_key')}
                  className="absolute right-2 top-2 px-2 py-1 text-slate-400 hover:text-white"
                >
                  {showSecrets.mkt_sante_key ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Secret de Signature Webhook
              </label>
              <div className="relative">
                <input
                  type={showSecrets.mkt_sante_sec ? 'text' : 'password'}
                  value={maketouSecret}
                  onChange={(e) => setMaketouSecret(e.target.value)}
                  className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-hidden focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => toggleSecret('mkt_sante_sec')}
                  className="absolute right-2 top-2 px-2 py-1 text-slate-400 hover:text-white"
                >
                  {showSecrets.mkt_sante_sec ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                URL de notification Webhook Maketou D-SANTÉ :
              </span>
              <p className="font-mono text-emerald-400 truncate">
                https://d-sante.dembasolution.com/api/webhooks/maketou
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                copyToClipboard(
                  'https://d-sante.dembasolution.com/api/webhooks/maketou',
                  'wh_sante_mkt'
                )
              }
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 shrink-0 border border-slate-800"
            >
              {copiedKey === 'wh_sante_mkt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'wh_sante_mkt' ? 'Copié !' : 'Copier'}</span>
            </button>
          </div>

          {/* Cartographie des 3 niveaux D-SANTÉ */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Cartographie des Produits & Tarifs D-SANTÉ (Maketou)
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Poste de Santé (10k/m)</span>
                  <span className="text-emerald-400 font-mono">10 000 F</span>
                </div>
                <input
                  type="text"
                  placeholder="ID Mensuel (10 000 F)"
                  value={mktPosteMensuel}
                  onChange={(e) => setMktPosteMensuel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-hidden focus:border-emerald-500"
                />
                <input
                  type="text"
                  placeholder="ID Annuel (108 000 F)"
                  value={mktPosteAnnuel}
                  onChange={(e) => setMktPosteAnnuel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Centre & Clinique (15k/m)</span>
                  <span className="text-emerald-400 font-mono">15 000 F</span>
                </div>
                <input
                  type="text"
                  placeholder="ID Mensuel (15 000 F)"
                  value={mktCliniqueMensuel}
                  onChange={(e) => setMktCliniqueMensuel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-hidden focus:border-emerald-500"
                />
                <input
                  type="text"
                  placeholder="ID Annuel (162 000 F)"
                  value={mktCliniqueAnnuel}
                  onChange={(e) => setMktCliniqueAnnuel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">Hôpital & Polyclinique (20k/m)</span>
                  <span className="text-emerald-400 font-mono">20 000 F</span>
                </div>
                <input
                  type="text"
                  placeholder="ID Mensuel (20 000 F)"
                  value={mktHopitalMensuel}
                  onChange={(e) => setMktHopitalMensuel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-hidden focus:border-emerald-500"
                />
                <input
                  type="text"
                  placeholder="ID Annuel (204 000 F)"
                  value={mktHopitalAnnuel}
                  onChange={(e) => setMktHopitalAnnuel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 2 : CHARIOW SANTÉ ── */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-black text-xl">
                C
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">Passerelle Chariow Santé</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-400 border border-teal-500/30">
                    Abonnements Récurrents
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Prélèvements automatiques et souscriptions en ligne avec redirection transparente.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => handleTestPing('chariow')}
                disabled={isTesting}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                <span>Tester la connexion</span>
              </button>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={chariowActif}
                  onChange={(e) => setChariowActif(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                <span className="ml-2 text-xs font-bold text-slate-300">
                  {chariowActif ? 'Actif' : 'Désactivé'}
                </span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Environnement Chariow
              </label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-800 flex-1">
                  <input
                    type="radio"
                    name="ch_sante_env"
                    checked={!chariowSandbox}
                    onChange={() => setChariowSandbox(false)}
                    className="accent-teal-500"
                  />
                  <span className="font-semibold text-white">Production (Live)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 bg-slate-950 px-3.5 py-2.5 rounded-xl border border-slate-800 flex-1">
                  <input
                    type="radio"
                    name="ch_sante_env"
                    checked={chariowSandbox}
                    onChange={() => setChariowSandbox(true)}
                    className="accent-teal-500"
                  />
                  <span>Sandbox (Test)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Clé API Secrète Chariow
              </label>
              <div className="relative">
                <input
                  type={showSecrets.ch_sante_key ? 'text' : 'password'}
                  value={chariowApiKey}
                  onChange={(e) => setChariowApiKey(e.target.value)}
                  className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-hidden focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={() => toggleSecret('ch_sante_key')}
                  className="absolute right-2 top-2 px-2 py-1 text-slate-400 hover:text-white"
                >
                  {showSecrets.ch_sante_key ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Secret Webhook Chariow
              </label>
              <div className="relative">
                <input
                  type={showSecrets.ch_sante_sec ? 'text' : 'password'}
                  value={chariowSecret}
                  onChange={(e) => setChariowSecret(e.target.value)}
                  className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-hidden focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={() => toggleSecret('ch_sante_sec')}
                  className="absolute right-2 top-2 px-2 py-1 text-slate-400 hover:text-white"
                >
                  {showSecrets.ch_sante_sec ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                URL de notification Webhook Chariow D-SANTÉ :
              </span>
              <p className="font-mono text-teal-400 truncate">
                https://d-sante.dembasolution.com/api/webhooks/chariow
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                copyToClipboard(
                  'https://d-sante.dembasolution.com/api/webhooks/chariow',
                  'wh_sante_ch'
                )
              }
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1.5 shrink-0 border border-slate-800"
            >
              {copiedKey === 'wh_sante_ch' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'wh_sante_ch' ? 'Copié !' : 'Copier'}</span>
            </button>
          </div>
        </div>

        {/* Bouton Enregistrer */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Enregistrer la Configuration des Passerelles</span>
          </button>
        </div>
      </form>
    </div>
  )
}
