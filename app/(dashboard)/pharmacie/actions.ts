'use server'

import { createClient } from '@/utils/supabase/server'
import { getTenantContext } from '@/utils/supabase/tenant'
import { revalidatePath } from 'next/cache'

export async function getStocksMedicaments(recherche?: string) {
  const supabase = await createClient()
  const tenant = await getTenantContext()

  try {
    let query = supabase
      .from('pharmacie_stocks')
      .select('*')
      .eq('actif', true)
      .order('dci')

    if (tenant?.structureId) {
      query = query.eq('structure_id', tenant.structureId)
    }

    if (recherche && recherche.trim()) {
      const term = `%${recherche.trim()}%`
      query = query.or(`dci.ilike.${term},nom_commercial.ilike.${term},code_medicament.ilike.${term}`)
    }

    const { data, error } = await query

    if (error) {
      console.warn('Note lecture pharmacie_stocks:', error.message)
      return { stocks: [] }
    }

    return { stocks: data || [] }
  } catch (err: any) {
    return { stocks: [], error: err.message }
  }
}

export async function ajouterMedicament(formData: FormData) {
  const supabase = await createClient()
  const tenant = await getTenantContext()

  const dci = (formData.get('dci') as string)?.trim()
  const nom_commercial = (formData.get('nom_commercial') as string)?.trim() || null
  const forme = (formData.get('forme') as string) || 'comprime'
  const dosage = (formData.get('dosage') as string)?.trim() || null
  const quantite = parseInt(formData.get('quantite_en_stock') as string || '0', 10)
  const seuil = parseInt(formData.get('seuil_alerte') as string || '10', 10)
  const prix_vente = parseFloat(formData.get('prix_vente') as string || '0')
  const prix_achat = parseFloat(formData.get('prix_achat') as string || '0')
  const lot = (formData.get('numero_lot') as string)?.trim() || null
  const date_peremption = (formData.get('date_peremption') as string) || null

  if (!dci || prix_vente <= 0) {
    return { error: 'Veuillez renseigner la DCI et un prix unitaire de vente supérieur à zéro.' }
  }

  const structureId = tenant?.structureId || '00000000-0000-0000-0000-000000000001'

  try {
    const { error } = await supabase.from('pharmacie_stocks').insert({
      structure_id: structureId,
      dci,
      nom_commercial,
      forme,
      dosage,
      quantite_en_stock: isNaN(quantite) ? 0 : quantite,
      seuil_alerte: isNaN(seuil) ? 10 : seuil,
      prix_vente,
      prix_achat,
      numero_lot: lot,
      date_peremption,
      actif: true,
    })

    if (error) return { error: error.message }

    revalidatePath('/pharmacie')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Erreur lors de l’ajout du médicament' }
  }
}

export async function delivrerMedicament(medicamentId: string, quantiteSortie: number) {
  const supabase = await createClient()

  try {
    const { data: med } = await supabase
      .from('pharmacie_stocks')
      .select('quantite_en_stock')
      .eq('id', medicamentId)
      .single()

    if (med) {
      const nouvelleQte = Math.max(0, med.quantite_en_stock - quantiteSortie)
      await supabase
        .from('pharmacie_stocks')
        .update({ quantite_en_stock: nouvelleQte })
        .eq('id', medicamentId)
    }

    revalidatePath('/pharmacie')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Erreur lors de la délivrance' }
  }
}
