"use server";

import { cookies } from "next/headers";

export async function setLanguage(lang: string) {
  const cookieStore = await cookies();
  cookieStore.set("lang", lang, {
    path: "/",
    maxAge: 31536000,
    sameSite: "lax",
  });
  return { success: true };
}

