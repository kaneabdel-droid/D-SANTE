// Configuration centralisée des paiements DEMBA pour D-Santé
// Priorité : Maketou (avec Wave, Orange Money, Carte Bancaire)
// Secours : Chariow

export const chariowApiKey = process.env.CHARIOW_API_KEY
export const chariowWebhookSecret = process.env.CHARIOW_WEBHOOK_SECRET
export const chariowApiUrl = process.env.CHARIOW_API_URL || 'https://api.chariow.com/v1'

export const hasChariowKeys = Boolean(chariowApiKey && chariowWebhookSecret)

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// Clé Maketou de production Demba Solution
export const DEMBA_MAKETOU_KEY =
  process.env.MAKETOU_API_KEY ||
  'msk_585f798965a35bda5adfe4afbdc96689ee3df5f0a2407e8634968e4f863296d7'
