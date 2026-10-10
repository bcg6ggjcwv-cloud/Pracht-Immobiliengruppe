"use server";

import type { EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { sichererPfad } from "@/lib/sicherer-pfad";
import { createClient } from "@/lib/supabase/server";

const erlaubteTypen: EmailOtpType[] = ["invite", "recovery", "email_change"];

/** Prüft den Einmal-Code aus der E-Mail und meldet den Nutzer an. */
export async function bestaetigen(formData: FormData) {
  const tokenHash = String(formData.get("token_hash") ?? "");
  const typ = String(formData.get("type") ?? "") as EmailOtpType;
  const weiter = sichererPfad(formData.get("weiter"), "/passwort-setzen");

  if (tokenHash && erlaubteTypen.includes(typ)) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: typ });
    if (!error) redirect(weiter);
  }
  redirect("/link-ungueltig");
}
