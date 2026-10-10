import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Rolle = "verwalter" | "mitarbeiter" | "eigentuemer";

/**
 * Angemeldeten Nutzer samt Personendatensatz laden.
 * Wer Zwei-Faktor eingerichtet, den Code aber noch nicht eingegeben hat, wird zur Code-Abfrage geschickt.
 */
export async function sitzungLaden() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/anmelden");

  const { data: stufe } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (stufe && stufe.nextLevel === "aal2" && stufe.currentLevel !== "aal2") {
    redirect("/anmelden/zwei-faktor");
  }

  const { data: person } = await supabase
    .from("person")
    .select("id, vorname, nachname, rolle")
    .eq("user_id", user.id)
    .maybeSingle();

  return {
    supabase,
    user,
    person: person as { id: string; vorname: string; nachname: string; rolle: Rolle } | null,
    zweiFaktorAktiv: stufe?.currentLevel === "aal2",
  };
}
