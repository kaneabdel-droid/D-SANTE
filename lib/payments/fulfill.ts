import { createAdminClient } from '@/utils/supabase/admin'

export type PaymentProvider = 'maketou' | 'chariow' | 'virement' | 'caisse'

export interface FulfillSanteParams {
  structureId: string
  forfait: string
  montant: number
  provider: PaymentProvider
  reference?: string
  paymentId?: string
}

export async function fulfillSubscriptionPayment(
  structureIdOrParams: string | FulfillSanteParams,
  forfaitArg?: string,
  montantArg?: number,
  providerArg?: PaymentProvider,
  referenceArg?: string
) {
  const supabase = createAdminClient()

  let structureId: string
  let forfait: string
  let montant: number
  let provider: PaymentProvider
  let reference: string | undefined
  let paymentId: string | undefined

  if (typeof structureIdOrParams === 'object') {
    structureId = structureIdOrParams.structureId
    forfait = structureIdOrParams.forfait
    montant = structureIdOrParams.montant
    provider = structureIdOrParams.provider
    reference = structureIdOrParams.reference
    paymentId = structureIdOrParams.paymentId
  } else {
    structureId = structureIdOrParams
    forfait = forfaitArg || 'clinique'
    montant = montantArg || 15000
    provider = providerArg || 'maketou'
    reference = referenceArg
  }

  try {
    // 1. Mettre à jour la table abonnement_paiements si applicable
    if (paymentId) {
      await supabase
        .from('abonnement_paiements')
        .update({
          statut: 'completed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', paymentId)
    } else if (reference) {
      await supabase
        .from('abonnement_paiements')
        .update({
          statut: 'completed',
          updated_at: new Date().toISOString(),
        })
        .eq('provider_reference', reference)
    }

    // 2. Mettre à jour la structure de santé (levée du verrou, forfait actif, fin d'essai)
    if (structureId) {
      const { error: errStructure } = await supabase
        .from('structures_sante')
        .update({
          subscription_tier: forfait,
          compte_verrouille: false,
          essai_expire_le: null,
        })
        .eq('id', structureId)

      if (errStructure) {
        console.warn('[d-sante:abonnement] Note mise à jour structure:', errStructure.message)
      }
    }

    console.log(`[d-sante:abonnement] Forfait '${forfait}' activé pour la structure ${structureId} via ${provider}`)
    return { success: true }
  } catch (err: any) {
    console.error('[d-sante:abonnement] Erreur inattendue fulfill:', err)
    return { success: false, error: err.message }
  }
}
