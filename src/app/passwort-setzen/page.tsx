import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Seitenkopf } from "@/components/ui/Formular";
import { createClient } from "@/lib/supabase/server";
import { PasswortSetzenFormular } from "./Formular";

export const metadata: Metadata = { title: "Passwort festlegen" };

/**
 * Erreichbar nur über den Link aus der Einladungs- oder Passwort-E-Mail (dann besteht eine Sitzung).
 */
export default async function PasswortSetzen() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/anmelden");

  // Mit aktiver Zwei-Faktor-Anmeldung reicht der E-Mail-Link allein nicht: erst den Code abfragen.
  const { data: stufe } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (stufe?.nextLevel === "aal2" && stufe.currentLevel !== "aal2") {
    redirect("/anmelden/zwei-faktor?weiter=/passwort-setzen");
  }

  return (
    <div className="mx-auto max-w-sm space-y-8">
      <Seitenkopf titel="Passwort festlegen" text={`Für ${user.email}`} />
      <PasswortSetzenFormular />
    </div>
  );
}
