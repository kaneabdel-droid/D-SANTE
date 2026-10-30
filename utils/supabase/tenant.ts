import { cache } from 'react'
import { createClient } from './server'
import type { PermissionMap } from '@/lib/permissions'

export type TenantContext = {
  userId: string
  structureId: string
  /** Alias rétro-compatible DEMBA */
  gieId: string
  role: string
  permissions: PermissionMap | null
  structureName: string
  /** Alias rétro-compatible DEMBA */
  gieName: string
  structureType: 'hopital' | 'clinique' | 'poste_sante' | 'cabinet'
  subscriptionTier: string
  devise: string
  compteVerrouille?: boolean
  essaiExpire?: boolean
}

export const getTenantContext = cache(async (): Promise<TenantContext | null> => {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Chargement de l'utilisateur avec jointure sur structure_sante (ou structures_sante)
  const { data } = await supabase
    .from('utilisateurs')
    .select(`
      structure_id,
      gie_id,
      role,
      permissions,
      structures_sante (
        nom,
        type_structure,
        subscription_tier,
        devise,
        essai_expire_le,
        compte_verrouille
      )
    `)
    .eq('id', user.id)
    .maybeSingle()

  if (!data) return null

  const struct = (Array.isArray(data.structures_sante) ? data.structures_sante[0] : data.structures_sante) as any
  const structureId = data.structure_id || data.gie_id || ''

  const essaiExpireLe = struct?.essai_expire_le ? new Date(struct.essai_expire_le) : null
  const maintenant = new Date()
  const essaiEstExpire = essaiExpireLe ? essaiExpireLe < maintenant : false

  return {
    userId: user.id,
    structureId,
    gieId: structureId,
    role: data.role || 'medecin',
    permissions: (data.permissions as PermissionMap) || null,
    structureName: struct?.nom || 'Structure Médicale',
    gieName: struct?.nom || 'Structure Médicale',
    structureType: struct?.type_structure || 'clinique',
    subscriptionTier: struct?.subscription_tier || 'gratuit',
    devise: struct?.devise || 'FCFA',
    compteVerrouille: struct?.compte_verrouille || false,
    essaiExpire: essaiEstExpire,
  }
})
