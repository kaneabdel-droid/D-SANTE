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

let demoStructuresStore: StructureItem[] = [
  {
    id: 'str-01',
    nom: 'Clinique Modèle de Dakar',
    type: 'clinique',
    ville: 'Dakar Plateau',
    pays: 'Sénégal',
    contact: '+221 33 889 94 70',
    email: 'contact@clinique-modele.sn',
    tier: 'hopital',
    lits: 45,
    medecins: 18,
    status: 'actif',
    compte_verrouille: false,
    source: 'demo',
  },
  {
    id: 'str-02',
    nom: 'Centre Médical Modèle Noflaye',
    type: 'poste_sante',
    ville: 'Rufisque',
    pays: 'Sénégal',
    contact: '+221 77 412 88 90',
    email: 'sante.modele@gmail.com',
    tier: 'poste_sante',
    lits: 8,
    medecins: 3,
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
      return [...realStructures, ...demoStructuresStore]
    }
    return [...demoStructuresStore]
  } catch (err) {
    console.warn('[d-sante:admin] Erreur getStructuresSuperAdmin:', err)
    return [...demoStructuresStore]
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
      } catch { }
    }

    // 3. Mise à jour dans demoStructuresStore si démo
    const dIdx = demoStructuresStore.findIndex(s => s.id === structureId)
    if (dIdx !== -1) {
      demoStructuresStore[dIdx].compte_verrouille = bloquer
      demoStructuresStore[dIdx].status = bloquer ? 'suspendu' : 'actif'
    }

    revalidatePath('/admin/structures')
    revalidatePath('/admin/sante')
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

export async function creerStructureSuperAdmin(formData: FormData) {
  const nom = (formData.get('nom') as string)?.trim()
  const type = (formData.get('type') as string)?.trim() || 'clinique'
  const ville = (formData.get('ville') as string)?.trim() || 'Dakar'
  const contact = (formData.get('contact') as string)?.trim() || '+221 33 000 00 00'
  const email = (formData.get('email') as string)?.trim() || `contact@${nom.toLowerCase().replace(/[^a-z0-9]/g, '')}.sn`
  const password = (formData.get('password') as string) || 'Demba@2026!'
  const tier = (formData.get('tier') as string)?.trim() || 'clinique'
  const statut = (formData.get('statut') as string)?.trim() || 'actif'

  if (!nom) return { error: 'Le nom de la structure est requis.' }

  try {
    const admin = createAdminClient()

    // 1. Création compte auth
    const { data: userData, error: userError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        nom_structure: nom,
        type_structure: type,
        telephone: contact,
        tier,
        ville,
      },
    })

    if (userError) console.warn('Notice création auth user:', userError.message)

    // 2. Insertion dans structures_sante
    let createdId = userData?.user?.id
    try {
      const { data: structData } = await admin
        .from('structures_sante')
        .insert({
          nom,
          type_structure: type,
          telephone: contact,
          email,
          region: ville,
          subscription_tier: tier,
          compte_verrouille: statut === 'suspendu',
        })
        .select('id')
        .maybeSingle()
      if (structData?.id) createdId = structData.id
    } catch (e) {
      console.warn('Notice insert structures_sante:', e)
    }

    revalidatePath('/admin/structures')
    revalidatePath('/admin/sante')
    revalidatePath('/admin')

    const newStruct: StructureItem = {
      id: createdId || `str-${Date.now()}`,
      nom,
      type,
      ville,
      pays: 'Sénégal',
      contact,
      email,
      tier,
      lits: tier === 'hopital' ? 80 : tier === 'clinique' ? 25 : 8,
      medecins: tier === 'hopital' ? 20 : 5,
      status: statut === 'suspendu' ? 'suspendu' : 'actif',
      compte_verrouille: statut === 'suspendu',
      source: 'supabase',
    }

    demoStructuresStore.unshift(newStruct)

    return { success: true, structure: newStruct }
  } catch (err: any) {
    return { error: err.message || 'Erreur lors de la création de la structure' }
  }
}

export async function modifierStructureSuperAdmin(formData: FormData) {
  const id = (formData.get('id') as string)?.trim()
  const nom = (formData.get('nom') as string)?.trim()
  const type = (formData.get('type') as string)?.trim() || 'clinique'
  const ville = (formData.get('ville') as string)?.trim() || 'Dakar'
  const contact = (formData.get('contact') as string)?.trim() || '+221 33 000 00 00'
  const email = (formData.get('email') as string)?.trim()
  const tier = (formData.get('tier') as string)?.trim() || 'clinique'
  const statut = (formData.get('statut') as string)?.trim() || 'actif'
  const bloquer = statut === 'suspendu'

  if (!id) return { error: 'ID structure manquant.' }
  if (!nom) return { error: 'Le nom est requis.' }

  try {
    const admin = createAdminClient()

    // 1. Mise à jour structures_sante
    try {
      await admin
        .from('structures_sante')
        .update({
          nom,
          type_structure: type,
          telephone: contact,
          email,
          region: ville,
          subscription_tier: tier,
          compte_verrouille: bloquer,
        })
        .eq('id', id)
    } catch (e) {
      console.warn('Notice update structures_sante:', e)
    }

    // 2. Mise à jour auth user
    try {
      await admin.auth.admin.updateUserById(id, {
        email: email || undefined,
        ban_duration: bloquer ? '87600h' : 'none',
        user_metadata: {
          nom_structure: nom,
          type_structure: type,
          telephone: contact,
          tier,
          ville,
        },
      })
    } catch (e) {
      console.warn('Notice update auth user:', e)
    }

    // 3. Mise à jour de la liste locale / démo
    const index = demoStructuresStore.findIndex(s => s.id === id)
    if (index !== -1) {
      demoStructuresStore[index] = {
        ...demoStructuresStore[index],
        nom,
        type,
        ville,
        contact,
        email,
        tier,
        status: bloquer ? 'suspendu' : 'actif',
        compte_verrouille: bloquer,
      }
    }

    revalidatePath('/admin/structures')
    revalidatePath('/admin/sante')
    revalidatePath('/admin')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Erreur lors de la modification de la structure' }
  }
}

export async function supprimerStructureSuperAdmin(structureId: string) {
  if (!structureId) return { error: 'ID structure manquant.' }

  try {
    const admin = createAdminClient()

    // 1. Suppression dans structures_sante
    try {
      await admin.from('structures_sante').delete().eq('id', structureId)
    } catch (e) {
      console.warn('Notice delete structures_sante:', e)
    }

    try {
      await admin.from('utilisateurs').delete().eq('structure_id', structureId)
    } catch { }

    // 2. Suppression auth user
    try {
      await admin.auth.admin.deleteUser(structureId)
    } catch (e) {
      console.warn('Notice delete auth user:', e)
    }

    // 3. Suppression dans la liste locale / démo
    demoStructuresStore = demoStructuresStore.filter(s => s.id !== structureId)

    revalidatePath('/admin/structures')
    revalidatePath('/admin/sante')
    revalidatePath('/admin')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Erreur lors de la suppression' }
  }
}


