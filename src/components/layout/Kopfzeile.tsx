import Link from "next/link";
import { Logo } from "@/components/marke/Logo";
import { supabaseKonfiguriert } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const knopf = "border border-gruen px-4 py-2 text-xs tracking-[0.18em] uppercase hover:bg-gruen hover:text-beige";

export async function Kopfzeile() {
  let angemeldet = false;
  if (supabaseKonfiguriert) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    angemeldet = Boolean(user);
  }

  return (
    <header className="border-b border-linie bg-beige">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href={angemeldet ? "/portal" : "/"} aria-label="Startseite">
          <Logo className="h-14 w-auto sm:h-16" />
        </Link>
        {angemeldet ? (
          <form action="/abmelden" method="post">
            <button type="submit" className={knopf}>
              Abmelden
            </button>
          </form>
        ) : (
          <Link href="/anmelden" className={knopf}>
            Anmelden
          </Link>
        )}
      </div>
    </header>
  );
}
