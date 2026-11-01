import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { cache } from 'react'
import type { NextRequest, NextResponse } from 'next/server'
import type { User } from '@supabase/supabase-js'

// Client Supabase dédié à l'identité admin partagée entre produits DembaSolution
// (SIGGIE, D-QUINCA, D-HOTEL, D-SANTÉ, ...) — projet Supabase source d'identité admin commune,
// cookie à domaine .dembasolution.com pour qu'il soit lisible par tous les produits hébergés sous ce domaine.
const ADMIN_COOKIE_OPTIONS = {
  name: 'sb-demba-admin',
  domain: process.env.NODE_ENV === 'production' ? '.dembasolution.com' : undefined,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
}

// Pour Server Components / Server Actions.
export async function createAdminIdentityClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.ADMIN_IDENTITY_SUPABASE_URL!,
    process.env.ADMIN_IDENTITY_SUPABASE_ANON_KEY!,
    {
      cookieOptions: ADMIN_COOKIE_OPTIONS,
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Appelé depuis un Server Component : sans effet si le middleware
            // rafraîchit déjà la session
          }
        },
      },
    }
  )
}

export const getSharedAdminUser = cache(async (): Promise<User | null> => {
  try {
    const supabase = await createAdminIdentityClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch {
    return null
  }
})

// Pour le middleware — mêmes options de cookie, branchées sur request/response.
export function createAdminIdentityMiddlewareClient(
  request: NextRequest,
  response: NextResponse
) {
  if (!process.env.ADMIN_IDENTITY_SUPABASE_URL || !process.env.ADMIN_IDENTITY_SUPABASE_ANON_KEY) {
    return { auth: { getUser: async () => ({ data: { user: null }, error: null }) } } as any
  }
  return createServerClient(
    process.env.ADMIN_IDENTITY_SUPABASE_URL!,
    process.env.ADMIN_IDENTITY_SUPABASE_ANON_KEY!,
    {
      cookieOptions: ADMIN_COOKIE_OPTIONS,
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )
}
