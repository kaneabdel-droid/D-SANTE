'use server'

import { createClient } from '@/utils/supabase/server'
import { getTenantContext } from '@/utils/supabase/tenant'

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
