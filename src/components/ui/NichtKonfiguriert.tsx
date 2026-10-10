import { Meldung } from "./Formular";

export function NichtKonfiguriert() {
  return (
    <Meldung art="fehler">
      Supabase ist noch nicht verbunden. Bitte die Zugangsdaten in <code>.env.local</code> eintragen – Anleitung in{" "}
      <code>docs/EINRICHTUNG.md</code>.
    </Meldung>
  );
}
