import { createAdminClient } from '@/utils/supabase/admin'

export async function fulfillSubscriptionPayment(
  structureId: string,
  forfait: string,
  montant: number,
  provider: 'maketou' | 'chariow',
  reference: string
) {
  const supabase = createAdminClient()

  try {
    // 1. Mettre à jour la structure de santé
    const { error: errStructure } = await supabase
      .from('structures_sante')
      .update({
        subscription_tier: forfait,
        compte_verrouille: false,
        essai_expire_le: null,
      })
      .eq('id', structureId)

    if (errStructure) {
      console.error('[d-sante:abonnement] Erreur activation structure:', errStructure.message)
      return { success: false, error: errStructure.message }
    }

    console.log(`[d-sante:abonnement] Forfait '${forfait}' activé avec succès pour la structure ${structureId}`)
    return { success: true }
  } catch (err: any) {
    console.error('[d-sante:abonnement] Erreur inattendue fulfill:', err)
    return { success: false, error: err.message }
  }
}
