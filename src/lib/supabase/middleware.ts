import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseKey, supabaseKonfiguriert, supabaseUrl } from "./env";

/** Bereiche, die nur angemeldete Nutzer sehen. */
const geschuetzt = ["/portal", "/konto", "/verwaltung"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!supabaseKonfiguriert) return response;

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // Erneuert die Sitzung; getUser() prüft das Token beim Supabase-Server.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pfad = request.nextUrl.pathname;
  if (!user && geschuetzt.some((p) => pfad === p || pfad.startsWith(p + "/"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/anmelden";
    url.search = `?weiter=${encodeURIComponent(pfad)}`;
    return NextResponse.redirect(url);
  }

  return response;
}
