// Configuration centralisée des paiements DEMBA pour D-SANTÉ
// Priorité : Maketou (Wave, Orange Money, Carte) - Pas de webhook nécessaire (vérification live au retour)
// Secours : Chariow (Mobile Money)

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://d-sante.dembasolution.com'

// Clé Maketou de production Demba Solution
export const maketouApiKey =
  process.env.MAKETOU_API_KEY ||
  'msk_585f798965a35bda5adfe4afbdc96689ee3df5f0a2407e8634968e4f863296d7'
export const DEMBA_MAKETOU_KEY = maketouApiKey
export const maketouApiUrl = process.env.MAKETOU_API_URL || 'https://api.maketou.net'
export const hasMaketouKeys = Boolean(maketouApiKey)

// Clés Chariow (Secours)
export const chariowApiKey = process.env.CHARIOW_API_KEY
export const chariowWebhookSecret = process.env.CHARIOW_WEBHOOK_SECRET
export const chariowApiUrl = process.env.CHARIOW_API_URL || 'https://api.chariow.com/v1'
export const hasChariowKeys = Boolean(chariowApiKey)
