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
  isDemo?: boolean
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

  // Détection du mode démo
  let isDemoCookie = false
  try {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    isDemoCookie = cookieStore.get('dsante_demo_session')?.value === '1'
  } catch {
    // Contexte sans cookies
  }

  const demoEmail = process.env.DEMO_SANTE_EMAIL || 'kaneabdou@yahoo.fr'
  const isDemo =
    isDemoCookie ||
    user.email === demoEmail ||
    user.email?.toLowerCase().includes('demo') ||
    struct?.nom?.toLowerCase().includes('demba santé') ||
    struct?.nom?.toLowerCase().includes('démonstration') ||
    struct?.nom?.toLowerCase().includes('demonstration')

  const essaiExpireLe = struct?.essai_expire_le ? new Date(struct.essai_expire_le) : null
  const maintenant = new Date()
  const essaiEstExpire = isDemo ? false : (essaiExpireLe ? essaiExpireLe < maintenant : false)

  // En mode démo, la version est intégralement débloquée au niveau Hôpital (maximum)
  const subscriptionTier = isDemo ? 'hopital' : (struct?.subscription_tier || 'clinique')

  return {
    userId: user.id,
    structureId,
    gieId: structureId,
    role: data.role || 'medecin',
    permissions: (data.permissions as PermissionMap) || null,
    structureName: struct?.nom || (isDemo ? 'Polyclinique Demba Santé' : 'Structure Médicale'),
    gieName: struct?.nom || (isDemo ? 'Polyclinique Demba Santé' : 'Structure Médicale'),
    structureType: struct?.type_structure || 'clinique',
    subscriptionTier,
    devise: struct?.devise || 'FCFA',
    compteVerrouille: isDemo ? false : Boolean(struct?.compte_verrouille),
    essaiExpire: essaiEstExpire,
    isDemo,
  }
})
