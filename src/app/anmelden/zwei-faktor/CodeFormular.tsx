"use client";

import { useActionState } from "react";
import { Feld, Karte, Knopf, Meldung } from "@/components/ui/Formular";
import { zweiFaktorPruefen, type Zustand } from "../aktionen";

export function CodeFormular({ weiter }: { weiter?: string }) {
  const [zustand, aktion, laeuft] = useActionState<Zustand, FormData>(zweiFaktorPruefen, {});

  return (
    <form action={aktion}>
      <Karte>
        <input type="hidden" name="weiter" value={weiter ?? "/portal"} />
        <Feld
          label="Sechsstelliger Code"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9 ]{6,7}"
          maxLength={7}
          required
          autoFocus
        />
        <Meldung art="fehler">{zustand.fehler}</Meldung>
        <Knopf type="submit" disabled={laeuft}>
          {laeuft ? "Bitte warten …" : "Bestätigen"}
        </Knopf>
      </Karte>
    </form>
  );
}
