import { createAdminClient } from '@/utils/supabase/admin'
import Link from 'next/link'
import { CheckCircle2, Clock, XCircle, ArrowRight, RefreshCw, Stethoscope } from 'lucide-react'
import { fetchMaketouCart, mapMaketouStatus } from '@/lib/payments/maketou'
import { fetchChariowSale, mapChariowStatus } from '@/lib/payments/chariow'
import { fulfillSubscriptionPayment } from '@/lib/payments/fulfill'
import { getDictionary, getLocale } from '@/dictionaries'

export const dynamic = 'force-dynamic'

export default async function AbonnementSanteRetourPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>
}) {
  const { ref } = await searchParams
  const locale = await getLocale()
  const dict = await getDictionary(locale)
  const isRtl = locale === 'ar'
  const ab = dict.abonnement
  const admin = createAdminClient()

  let payment: any = null

  if (ref) {
    const { data } = await admin
      .from('abonnement_paiements')
      .select('*')
      .eq('id', ref)
      .maybeSingle()

    payment = data
  }

  // Vérification directe auprès de Maketou ou Chariow sans webhook
  if (payment && payment.statut === 'pending' && payment.provider_reference) {
    try {
      if (payment.provider === 'maketou') {
        const liveCart = await fetchMaketouCart(payment.provider_reference)
        if (liveCart) {
          const liveStatus = mapMaketouStatus(liveCart.status)
          if (liveStatus === 'completed') {
            await fulfillSubscriptionPayment({
              structureId: payment.structure_id,
              forfait: payment.niveau,
              montant: payment.montant,
              provider: 'maketou',
              reference: payment.provider_reference,
              paymentId: payment.id,
            })
            payment.statut = 'completed'
          } else if (liveStatus === 'failed') {
            await admin
              .from('abonnement_paiements')
              .update({ statut: 'failed', updated_at: new Date().toISOString() })
              .eq('id', payment.id)
            payment.statut = 'failed'
          }
        }
      } else if (payment.provider === 'chariow') {
        const liveSale = await fetchChariowSale(payment.provider_reference)
        if (liveSale) {
          const liveStatus = mapChariowStatus(liveSale.status)
          if (liveStatus === 'completed') {
            await fulfillSubscriptionPayment({
              structureId: payment.structure_id,
              forfait: payment.niveau,
              montant: payment.montant,
              provider: 'chariow',
              reference: payment.provider_reference,
              paymentId: payment.id,
            })
            payment.statut = 'completed'
          } else if (liveStatus === 'failed') {
            await admin
              .from('abonnement_paiements')
              .update({ statut: 'failed', updated_at: new Date().toISOString() })
              .eq('id', payment.id)
            payment.statut = 'failed'
          }
        }
      }
    } catch (err) {
      console.error('[d-sante:retour] Erreur vérification live:', err)
    }
  }

  const statut = payment?.statut || 'pending'
  const isCaisse = payment?.provider === 'caisse'
  const isVirement = payment?.provider === 'virement'

  const getNomForfait = (niveau: string) => {
    if (niveau === 'hopital') return ab.plans.hopital.nom
    if (niveau === 'poste_sante') return ab.plans.poste_sante.nom
    return ab.plans.clinique.nom
  }

  return (
    <div className={`min-h-[80vh] flex items-center justify-center p-4 ${isRtl ? 'rtl' : 'ltr'}`}>
      {statut === 'pending' && !isCaisse && !isVirement && (
        <meta httpEquiv="refresh" content="5" />
      )}

      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl space-y-6">
        {statut === 'completed' && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-white">
                {ab.retour_activated_title}
              </h1>
              <p className="text-xs text-slate-300">
                {ab.retour_transaction_confirmed}{' '}
                {payment?.montant && (
                  <strong className="text-white font-mono">
                    {payment.montant.toLocaleString(locale === 'ar' ? 'ar-EG' : 'fr-FR')} FCFA
                  </strong>
                )}
              </p>
              <div className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                {getNomForfait(payment?.niveau)} • {ab.retour_plan_active}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <Link
                href="/dashboard"
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
              >
                <span>{ab.retour_go_dashboard}</span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </Link>
            </div>
          </>
        )}

        {statut === 'pending' && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <Clock className="w-10 h-10 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-white">
                {isCaisse
                  ? ab.retour_pending_cash_title
                  : isVirement
                    ? ab.retour_pending_transfer_title
                    : ab.retour_pending_online_title}
              </h1>
              <p className="text-xs text-slate-300">
                {isCaisse
                  ? ab.retour_pending_cash_desc
                  : isVirement
                    ? ab.retour_pending_transfer_desc
                    : ab.retour_pending_online_desc}
              </p>
              {payment?.id && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400">
                  {ab.retour_ref} <span className="text-white">#{payment.id.slice(0, 8)}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-center gap-3">
              <Link
                href={`/abonnement/retour?ref=${ref}`}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{ab.retour_refresh}</span>
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold"
              >
                {ab.retour_back_home}
              </Link>
            </div>
          </>
        )}

        {statut === 'failed' && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
              <XCircle className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-white">{ab.retour_failed_title}</h1>
              <p className="text-xs text-slate-300">
                {ab.retour_failed_desc}
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800 flex items-center justify-center gap-3">
              <Link
                href="/abonnement"
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider"
              >
                {ab.retour_retry}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

