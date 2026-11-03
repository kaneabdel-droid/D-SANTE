import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { createAdminIdentityMiddlewareClient } from "@/utils/supabase/admin-identity";
import { isAdminEmail } from "@/lib/admin/auth";

const PUBLIC_PREFIXES = [
  "/login",
  "/signup",
  "/mot-de-passe-oublie",
  "/auth",
  "/api",
  "/robots.txt",
  "/favicon.ico",
  "/decouvrir-dsante",
  "/guide",
  "/tarifs",
  "/checkout",
  "/espace-patient",
];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const { pathname } = request.nextUrl;

  // Webhooks et crons
  if (pathname.startsWith('/api')) {
    return supabaseResponse;
  }

  // 1. Espace SuperAdmin (/admin)
  if (pathname === '/admin/login') {
    return supabaseResponse;
  }

  if (pathname.startsWith('/admin')) {
    let adminUser = null;
    try {
      adminUser = await createAdminIdentityMiddlewareClient(request, supabaseResponse)
        .auth.getUser()
        .then(({ data }: any) => data?.user);
    } catch {
      adminUser = null;
    }

    const hasLegacyAdmin = Boolean(request.cookies.get('d_sante_admin_session')?.value);

    if (isAdminEmail(adminUser?.email) || hasLegacyAdmin) {
      return supabaseResponse;
    }

    const returnTo = `https://d-sante.dembasolution.com${pathname}${request.nextUrl.search}`;
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    url.search = `?next=${encodeURIComponent(returnTo)}`;
    return NextResponse.redirect(url);
  }

  // 2. Espace applicatif hospitalier
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: sessionData } = await supabase.auth.getUser();
  const connecte = Boolean(sessionData?.user);
  const estPublic = pathname === "/" || PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));

  if (!connecte && !estPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (connecte && (pathname === "/login" || pathname === "/signup")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

