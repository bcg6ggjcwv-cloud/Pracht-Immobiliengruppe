"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { seitenUrl } from "@/lib/supabase/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function zurueck(meldung: string, art: "erfolg" | "fehler"): never {
  redirect(`/verwaltung/einladen?${art}=${encodeURIComponent(meldung)}`);
}

/** Einladung per E-Mail verschicken und den neuen Login mit der Person verknüpfen. */
export async function einladen(formData: FormData) {
  const personId = String(formData.get("personId") ?? "");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/anmelden");

  // Berechtigung über die Zugriffsregeln prüfen: Nur wer die Person sehen und pflegen darf, findet sie hier.
  const { data: ich } = await supabase.from("person").select("rolle").eq("user_id", user.id).maybeSingle();
  if (ich?.rolle !== "verwalter" && ich?.rolle !== "mitarbeiter") zurueck("Keine Berechtigung.", "fehler");

  const { data: person } = await supabase
    .from("person")
    .select("id, vorname, nachname, email, user_id")
    .eq("id", personId)
    .maybeSingle();
  if (!person) zurueck("Person nicht gefunden oder keine Berechtigung.", "fehler");
  if (person.user_id) zurueck(`${person.vorname} ${person.nachname} hat bereits einen Zugang.`, "fehler");
  if (!person.email) zurueck("Für diese Person ist keine E-Mail-Adresse hinterlegt.", "fehler");

  const admin = createAdminClient();
  const { data: einladung, error } = await admin.auth.admin.inviteUserByEmail(person.email, {
    redirectTo: `${seitenUrl}/passwort-setzen`,
    data: { person_id: person.id },
  });
  if (error || !einladung.user) {
    zurueck(
      error?.code === "email_exists"
        ? "Zu dieser E-Mail-Adresse gibt es bereits einen Zugang."
        : "Die Einladung konnte nicht versendet werden.",
      "fehler",
    );
  }

  const { error: verknuepfung } = await admin
    .from("person")
    .update({ user_id: einladung.user.id })
    .eq("id", person.id)
    .is("user_id", null);
  if (verknuepfung) {
    await admin.auth.admin.deleteUser(einladung.user.id);
    zurueck("Die Einladung konnte nicht gespeichert werden.", "fehler");
  }

  await admin.from("audit_log").insert({
    user_id: user.id,
    aktion: "geaendert",
    tabelle: "person",
    datensatz_id: person.id,
    details: { einladung_versendet_an: person.email },
  });

  revalidatePath("/verwaltung/einladen");
  zurueck(`Einladung an ${person.vorname} ${person.nachname} versendet.`, "erfolg");
}
