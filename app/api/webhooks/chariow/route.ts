import { NextRequest, NextResponse } from 'next/server'
import { fulfillSubscriptionPayment } from '@/lib/payments/fulfill'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('[Webhook Chariow D-Santé]', body)

    const meta = body?.data?.meta || body?.meta || {}
    const structureId = meta?.structureId || meta?.gieId
    const forfait = meta?.forfait || 'centre_medical'
    const montant = body?.data?.amount || body?.amount || 0
    const reference = body?.data?.reference || body?.id || 'ref_chariow'

    if (structureId) {
      await fulfillSubscriptionPayment(structureId, forfait, montant, 'chariow', reference)
    }

    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('[Webhook Chariow Error]', err)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
