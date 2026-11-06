'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/utils/supabase/admin'

export interface StructureItem {
  id: string
  nom: string
  type: string
  ville: string
  pays: string
  contact: string
  email?: string
  tier: string
  lits: number
  medecins: number
  status: 'actif' | 'suspendu'
  compte_verrouille: boolean
  source?: 'supabase' | 'demo'
}

const DEMO_STRUCTURES: StructureItem[] = [
  {
    id: 'str-01',
    nom: 'Clinique de la Madeleine',
    type: 'clinique',
    ville: 'Dakar Plateau',
    pays: 'Sénégal',
    contact: '+221 33 889 94 70',
    email: 'contact@madeleine.sn',
    tier: 'hopital',
    lits: 45,
    medecins: 18,
    status: 'actif',
    compte_verrouille: false,
    source: 'demo',
  },
  {
    id: 'str-02',
    nom: 'Polyclinique Cheikh Anta Diop',
    type: 'hopital',
    ville: 'Fann Résidence',
    pays: 'Sénégal',
    contact: '+221 33 825 00 00',
    email: 'direction@polyclinique-ucad.sn',
    tier: 'hopital',
    lits: 80,
    medecins: 32,
    status: 'actif',
    compte_verrouille: false,
    source: 'demo',
  },
  {
    id: 'str-03',
    nom: 'Centre Médical Noflaye',
    type: 'poste_sante',
    ville: 'Rufisque',
    pays: 'Sénégal',
    contact: '+221 77 412 88 90',
    email: 'sante.noflaye@gmail.com',
    tier: 'poste_sante',
    lits: 8,
    medecins: 3,
    status: 'actif',
    compte_verrouille: false,
    source: 'demo',
  },
  {
    id: 'str-04',
    nom: 'Cabinet Pédiatrique & Maternité Al-Baraka',
    type: 'cabinet',
    ville: 'Thiès',
    pays: 'Sénégal',
    contact: '+221 78 520 11 22',
    email: 'albaraka.sante@gmail.com',
    tier: 'clinique',
    lits: 12,
    medecins: 5,
    status: 'actif',
    compte_verrouille: false,
    source: 'demo',
  },
]

export async function getStructuresSuperAdmin(): Promise<StructureItem[]> {
  try {
    const admin = createAdminClient()
    const realStructures: StructureItem[] = []

    const { data: dbStructures, error } = await admin
      .from('structures_sante')
      .select('*')

    if (!error && dbStructures && dbStructures.length > 0) {
      for (const s of dbStructures) {
        const isVerrouille = Boolean(s.compte_verrouille)
        realStructures.push({
          id: s.id,
          nom: s.nom,
          type: s.type_structure || 'clinique',
          ville: s.region || s.adresse || 'Dakar',
          pays: 'Sénégal',
          contact: s.telephone || '+221 --',
          email: s.email,
          tier: s.subscription_tier || 'clinique',
          lits: 20,
          medecins: 5,
          status: isVerrouille ? 'suspendu' : 'actif',
          compte_verrouille: isVerrouille,
          source: 'supabase',
        })
      }
    }

    if (realStructures.length > 0) {
      return [...realStructures, ...DEMO_STRUCTURES]
    }
    return DEMO_STRUCTURES
  } catch (err) {
    console.warn('[d-sante:admin] Erreur getStructuresSuperAdmin:', err)
    return DEMO_STRUCTURES
  }
}

export async function toggleVerrouillerStructure(structureId: string, bloquer: boolean) {
  const admin = createAdminClient()
  try {
    // 1. Mise à jour de la table structures_sante
    try {
      await admin
        .from('structures_sante')
        .update({
          compte_verrouille: bloquer,
        })
        .eq('id', structureId)
    } catch (e) {
      console.warn('Note mise à jour structures_sante:', e)
    }

    // 2. Bannir ou dé-bannir les utilisateurs Auth associés
    try {
      await admin.auth.admin.updateUserById(structureId, {
        ban_duration: bloquer ? '87600h' : 'none',
      })
    } catch {
      try {
        const { data: users } = await admin
          .from('utilisateurs')
          .select('id')
          .eq('structure_id', structureId)

        if (users && users.length > 0) {
          for (const u of users) {
            await admin.auth.admin.updateUserById(u.id, {
              ban_duration: bloquer ? '87600h' : 'none',
            })
          }
        }
      } catch {}
    }

    revalidatePath('/admin/structures')
    revalidatePath('/admin')
    return { success: true, bloquer }
  } catch (err: any) {
    return { error: err.message || 'Erreur lors du verrouillage' }
  }
}

export interface PaiementAbonnementSanteItem {
  id: string
  structureId?: string
  structureNom: string
  montant: number
  devise: string
  niveau: string
  provider: string
  moyenPaiement: string
  statut: 'pending' | 'completed' | 'failed'
  notes?: string
  date: string
}

export async function getPaiementsAbonnementsSanteSuperAdmin(): Promise<PaiementAbonnementSanteItem[]> {
  const admin = createAdminClient()
  try {
    const { data, error } = await admin
      .from('abonnement_paiements')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data && data.length > 0) {
      return data.map((p) => ({
        id: p.id,
        structureId: p.structure_id,
        structureNom: p.structure_nom || 'Structure Médicale',
        montant: Number(p.montant),
        devise: p.devise || 'XOF',
        niveau: p.niveau,
        provider: p.provider,
        moyenPaiement: p.moyen_paiement,
        statut: p.statut as any,
        notes: p.notes,
        date: p.created_at ? p.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
      }))
    }
  } catch (err) {
    console.warn('Note getPaiementsAbonnementsSanteSuperAdmin:', err)
  }

  // Fallback démo
  return [
    {
      id: 'TXN-9842',
      structureNom: 'Polyclinique Cheikh Anta Diop',
      montant: 216000,
      devise: 'XOF',
      niveau: 'hopital',
      provider: 'virement',
      moyenPaiement: 'virement',
      statut: 'completed',
      date: '2026-10-28',
    },
    {
      id: 'TXN-9755',
      structureNom: 'Clinique de la Madeleine',
      montant: 162000,
      devise: 'XOF',
      niveau: 'clinique',
      provider: 'maketou',
      moyenPaiement: 'wave',
      statut: 'completed',
      date: '2026-10-25',
    },
    {
      id: 'TXN-9689',
      structureNom: 'Cabinet Al-Baraka',
      montant: 15000,
      devise: 'XOF',
      niveau: 'clinique',
      provider: 'maketou',
      moyenPaiement: 'orange',
      statut: 'completed',
      date: '2026-10-20',
    },
    {
      id: 'TXN-9510',
      structureNom: 'Centre Médical Noflaye',
      montant: 10000,
      devise: 'XOF',
      niveau: 'poste_sante',
      provider: 'chariow',
      moyenPaiement: 'carte',
      statut: 'completed',
      date: '2026-10-18',
    },
  ]
}

export async function validerPaiementCaisseSante(paiementId: string) {
  const admin = createAdminClient()
  try {
    const { data: p, error } = await admin
      .from('abonnement_paiements')
      .select('*')
      .eq('id', paiementId)
      .maybeSingle()

    if (error || !p) {
      return { error: 'Paiement introuvable' }
    }

    const { fulfillSubscriptionPayment } = await import('@/lib/payments/fulfill')
    await fulfillSubscriptionPayment({
      structureId: p.structure_id,
      forfait: p.niveau,
      montant: p.montant,
      provider: 'caisse',
      paymentId: p.id,
    })

    revalidatePath('/admin')
    revalidatePath('/admin/abonnements')
    revalidatePath('/admin/structures')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Erreur lors de la validation caisse' }
  }
}

export async function validerPaiementVirementSante(paiementId: string) {
  const admin = createAdminClient()
  try {
    const { data: p, error } = await admin
      .from('abonnement_paiements')
      .select('*')
      .eq('id', paiementId)
      .maybeSingle()

    if (error || !p) {
      return { error: 'Paiement introuvable' }
    }

    const { fulfillSubscriptionPayment } = await import('@/lib/payments/fulfill')
    await fulfillSubscriptionPayment({
      structureId: p.structure_id,
      forfait: p.niveau,
      montant: p.montant,
      provider: 'virement',
      paymentId: p.id,
    })

    revalidatePath('/admin')
    revalidatePath('/admin/abonnements')
    revalidatePath('/admin/structures')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Erreur lors de la validation du virement' }
  }
}

export async function supprimerPaiementAbonnementSante(paiementId: string) {
  const admin = createAdminClient()
  try {
    await admin.from('abonnement_paiements').delete().eq('id', paiementId)
    revalidatePath('/admin/abonnements')
    return { success: true }
  } catch (err: any) {
    return { error: err.message }
  }
}
