"use client";

import { useActionState } from "react";
import { Feld, Karte, Knopf, Meldung } from "@/components/ui/Formular";
import { passwortSetzen, type Zustand } from "../anmelden/aktionen";

export function PasswortSetzenFormular() {
  const [zustand, aktion, laeuft] = useActionState<Zustand, FormData>(passwortSetzen, {});

  return (
    <form action={aktion}>
      <Karte>
        <Feld
          label="Neues Passwort"
          type="password"
          name="passwort"
          autoComplete="new-password"
          minLength={10}
          required
          hinweis="Mindestens 10 Zeichen, Groß- und Kleinbuchstaben und eine Ziffer."
        />
        <Feld label="Passwort wiederholen" type="password" name="wiederholung" autoComplete="new-password" required />
        <Meldung art="fehler">{zustand.fehler}</Meldung>
        <Knopf type="submit" disabled={laeuft}>
          {laeuft ? "Bitte warten …" : "Passwort speichern"}
        </Knopf>
      </Karte>
    </form>
  );
}
