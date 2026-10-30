import { NextRequest, NextResponse } from 'next/server'
import { fulfillSubscriptionPayment } from '@/lib/payments/fulfill'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('[Webhook Maketou D-Santé]', body)

    // Événement cart.paid ou transaction.completed
    const eventType = body?.event || body?.type || 'payment.completed'
    const meta = body?.data?.meta || body?.meta || {}
    const structureId = meta?.structureId || meta?.gieId
    const forfait = meta?.forfait || 'centre_medical'
    const montant = body?.data?.amount || body?.amount || 0
    const reference = body?.data?.id || body?.id || 'ref_unknown'

    if (structureId) {
      await fulfillSubscriptionPayment(structureId, forfait, montant, 'maketou', reference)
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('[Webhook Maketou Error]', err)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
