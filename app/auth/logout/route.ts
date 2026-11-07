import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

async function handleLogout(request: NextRequest) {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch (err) {
    console.warn('Erreur lors du signOut Supabase:', err)
  }

  const cookieStore = await cookies()
  // Supprimer tous les cookies de session et de démo
  cookieStore.delete('dsante_demo_session')
  cookieStore.delete('dsante_demo_role')
  cookieStore.delete('demba_offline_active')

  // Redirection complète vers /login
  const loginUrl = new URL('/login', request.url)
  const response = NextResponse.redirect(loginUrl)

  // Effacer les cookies au niveau de la réponse HTTP également
  response.cookies.delete('dsante_demo_session')
  response.cookies.delete('dsante_demo_role')
  response.cookies.delete('demba_offline_active')

  return response
}

export async function GET(request: NextRequest) {
  return handleLogout(request)
}

export async function POST(request: NextRequest) {
  return handleLogout(request)
}
