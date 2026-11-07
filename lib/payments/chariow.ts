import { chariowApiKey, chariowApiUrl } from './config'

export type InitiateChariowParams = {
  productId: string
  montantAttendu: number
  reference: string
  phoneLocal: string
  countryCode?: string
  customerEmail: string
  customerName?: string
  returnUrl: string
}

export type InitiateChariowResult =
  | { ok: true; providerTransactionId: string; checkoutUrl: string }
  | { ok: false; error: string }

function splitName(full: string | undefined, fallbackEmail: string): { first: string; last: string } {
  const v = (full ?? '').trim()
  if (!v) {
    const local = fallbackEmail.split('@')[0] || 'Client'
    return { first: local, last: '-' }
  }
  const parts = v.split(/\s+/)
  return { first: parts[0]!, last: parts.slice(1).join(' ') || '-' }
}

export async function initiateChariowPayment(params: InitiateChariowParams): Promise<InitiateChariowResult> {
  if (!chariowApiKey) {
    return { ok: false, error: 'Chariow non configuré (CHARIOW_API_KEY manquant)' }
  }

  const { first, last } = splitName(params.customerName, params.customerEmail)

  const body = {
    product_id: params.productId,
    email: params.customerEmail,
    first_name: first,
    last_name: last,
    phone_number: params.phoneLocal,
    country: params.countryCode || 'SN',
    redirect_url: params.returnUrl,
    tracking_id: params.reference,
  }

  let res: Response
  try {
    res = await fetch(`${chariowApiUrl}/sales`, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${chariowApiKey}`,
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15_000),
    })
  } catch (err) {
    return { ok: false, error: `Erreur réseau Chariow : ${(err as Error).message}` }
  }

  let parsed: any
  try {
    parsed = await res.json()
  } catch {
    return { ok: false, error: `Chariow a répondu ${res.status} (réponse non-JSON)` }
  }

  const data = parsed?.data ?? parsed
  const providerTransactionId = data?.id
  const checkoutUrl = data?.checkout_url ?? data?.url

  if (!res.ok || !providerTransactionId || !checkoutUrl) {
    return { ok: false, error: parsed?.message || `Chariow a répondu ${res.status}` }
  }

  return { ok: true, providerTransactionId, checkoutUrl }
}

export async function fetchChariowSale(saleId: string): Promise<{ status: string; amount?: number; currency?: string } | null> {
  if (!chariowApiKey) return null
  let res: Response
  try {
    res = await fetch(`${chariowApiUrl}/sales/${encodeURIComponent(saleId)}`, {
      headers: { authorization: `Bearer ${chariowApiKey}`, accept: 'application/json' },
      signal: AbortSignal.timeout(15_000),
    })
  } catch {
    return null
  }
  if (!res.ok) return null
  const json = (await res.json().catch(() => null)) as any
  const data = json?.data ?? json
  if (!data?.status) return null
  return { status: data.status, amount: data.amount, currency: data.currency }
}

export function mapChariowStatus(raw: string): 'completed' | 'failed' | 'pending' {
  const s = raw.toLowerCase()
  if (s === 'completed' || s === 'success' || s === 'paid') return 'completed'
  if (s === 'failed' || s === 'cancelled' || s === 'expired') return 'failed'
  return 'pending'
}

