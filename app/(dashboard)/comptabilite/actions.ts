'use server'

import { createClient } from '@/utils/supabase/server'
import { getTenantContext } from '@/utils/supabase/tenant'
import { revalidatePath } from 'next/cache'

export type ImportEcriturePayload = {
  journal: string
  date_ecriture: string
  numero_piece?: string
  libelle: string
  lignes: Array<{
    compte: string
    libelle?: string
    debit: number
    credit: number
  }>
}

export async function importerEcrituresBatch(ecritures: ImportEcriturePayload[]) {
  const supabase = await createClient()
  const tenant = await getTenantContext()
  if (!tenant) return { error: 'Non authentifié' }
  if (!ecritures || ecritures.length === 0) return { error: 'Aucune écriture à importer' }

  let countImportees = 0
  const structureId = tenant.structureId || tenant.gieId || null

  for (const ec of ecritures) {
    const journal = ec.journal || 'od'
    const dateEcriture = ec.date_ecriture || new Date().toISOString().split('T')[0]
    const numeroPiece = (ec.numero_piece || '').trim()
    const libelle = (ec.libelle || '').trim() || 'Écriture importée'

    const insertData: any = {
      journal,
      date_ecriture: dateEcriture,
      numero_piece: numeroPiece || null,
      libelle,
      validee: true,
    }
    if (structureId) {
      insertData.structure_id = structureId
    }

    const { data: ecriture, error: errEcriture } = await supabase
      .from('ecritures_comptables')
      .insert(insertData)
      .select('id')
      .single()

    if (errEcriture || !ecriture) {
      console.warn('Erreur insertion en-tête import d-sante:', errEcriture?.message)
      continue
    }

    const lignesToInsert = ec.lignes.map((l) => ({
      ecriture_id: ecriture.id,
      compte: l.compte,
      libelle: (l.libelle || libelle).trim(),
      debit: Number(l.debit || 0),
      credit: Number(l.credit || 0),
      ...(structureId ? { structure_id: structureId } : {}),
    }))

    const { error: errLignes } = await supabase
      .from('lignes_ecritures_comptables')
      .insert(lignesToInsert)

    if (!errLignes) {
      countImportees++
    }
  }

  revalidatePath('/comptabilite')
  return { success: true, count: countImportees }
}

export async function getEcrituresComptables(journal?: string) {
  const supabase = await createClient()
  const tenant = await getTenantContext()

  try {
    let query = supabase
      .from('ecritures_comptables')
      .select('id, journal, date_ecriture, numero_piece, libelle, validee, created_at, lignes_ecritures_comptables(id, compte, libelle, debit, credit)')
      .order('date_ecriture', { ascending: false })
      .order('created_at', { ascending: false })

    if (tenant?.structureId) {
      query = query.eq('structure_id', tenant.structureId)
    }

    if (journal && journal !== 'tous') {
      query = query.eq('journal', journal)
    }

    const { data, error } = await query

    if (error) {
      console.warn('Note lecture ecritures_comptables:', error.message)
      return { ecritures: [] }
    }

    return { ecritures: data || [] }
  } catch (err: any) {
    return { ecritures: [], error: err.message }
  }
}
