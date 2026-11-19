import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role") || "medecin";
  let target = searchParams.get("next");

  if (!target) {
    if (role === "infirmier") target = "/triage";
    else if (role === "pharmacien") target = "/pharmacie";
    else if (role === "caissier") target = "/facturation";
    else target = "/dashboard";
  }

  const response = NextResponse.redirect(new URL(target, request.url));
  const options = { path: "/", maxAge: 86400, sameSite: "lax" as const };

  response.cookies.set("dsante_demo_session", "1", options);
  response.cookies.set("dsante_demo_role", role, options);

  return response;
}

