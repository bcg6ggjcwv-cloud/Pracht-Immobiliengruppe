"use client";

import { useActionState } from "react";
import { Feld, Karte, Knopf, Meldung } from "@/components/ui/Formular";
import { passwortVergessen, type Zustand } from "../anmelden/aktionen";

export function PasswortVergessenFormular() {
  const [zustand, aktion, laeuft] = useActionState<Zustand, FormData>(passwortVergessen, {});

  return (
    <form action={aktion}>
      <Karte>
        <Feld label="E-Mail" type="email" name="email" autoComplete="email" required />
        <Meldung art="erfolg">{zustand.erfolg}</Meldung>
        <Knopf type="submit" disabled={laeuft}>
          {laeuft ? "Bitte warten …" : "Link anfordern"}
        </Knopf>
      </Karte>
    </form>
  );
}
