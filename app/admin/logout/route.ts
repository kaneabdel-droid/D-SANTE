import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const cookieStore = await cookies()
  cookieStore.delete('d_sante_admin_session')
  cookieStore.delete('d_sante_admin_email')

  const url = new URL('/admin/login', request.url)
  return NextResponse.redirect(url)
}
