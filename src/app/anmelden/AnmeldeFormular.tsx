"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Feld, Karte, Knopf, Meldung } from "@/components/ui/Formular";
import { anmelden, type Zustand } from "./aktionen";

export function AnmeldeFormular({ weiter }: { weiter?: string }) {
  const [zustand, aktion, laeuft] = useActionState<Zustand, FormData>(anmelden, {});

  return (
    <form action={aktion}>
      <Karte>
        <input type="hidden" name="weiter" value={weiter ?? "/portal"} />
        <Feld label="E-Mail" type="email" name="email" autoComplete="email" defaultValue={zustand.email} key={zustand.email} required />
        <Feld label="Passwort" type="password" name="passwort" autoComplete="current-password" required />
        <Meldung art="fehler">{zustand.fehler}</Meldung>
        <Knopf type="submit" disabled={laeuft}>
          {laeuft ? "Bitte warten …" : "Anmelden"}
        </Knopf>
        <p className="text-center text-sm">
          <Link href="/passwort-vergessen" className="underline decoration-linie underline-offset-4 hover:text-gruen">
            Passwort vergessen?
          </Link>
        </p>
      </Karte>
    </form>
  );
}
