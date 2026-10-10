"use server";

import { redirect } from "next/navigation";
import { sichererPfad } from "@/lib/sicherer-pfad";
import { createClient } from "@/lib/supabase/server";

export type Zustand = { fehler?: string; erfolg?: string; email?: string };

export async function anmelden(_: Zustand, formData: FormData): Promise<Zustand> {
  const email = String(formData.get("email") ?? "").trim();
  const passwort = String(formData.get("passwort") ?? "");
  const weiter = sichererPfad(formData.get("weiter"));

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password: passwort });
  if (error) {
    // Bewusst allgemein: verrät nicht, ob die E-Mail-Adresse existiert.
    return { fehler: "E-Mail oder Passwort ist nicht korrekt.", email };
  }

  const { data: stufe } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (stufe?.nextLevel === "aal2" && stufe.currentLevel !== "aal2") {
    redirect(`/anmelden/zwei-faktor?weiter=${encodeURIComponent(weiter)}`);
  }
  redirect(weiter);
}

export async function zweiFaktorPruefen(_: Zustand, formData: FormData): Promise<Zustand> {
  const code = String(formData.get("code") ?? "").replace(/\s/g, "");
  const weiter = sichererPfad(formData.get("weiter"));

  const supabase = await createClient();
  const { data: faktoren } = await supabase.auth.mfa.listFactors();
  const faktor = faktoren?.totp.find((f) => f.status === "verified");
  if (!faktor) redirect("/anmelden");

  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: faktor.id, code });
  if (error) return { fehler: "Der Code stimmt nicht. Bitte den aktuellen Code aus der App eingeben." };
  redirect(weiter);
}

export async function passwortVergessen(_: Zustand, formData: FormData): Promise<Zustand> {
  const email = String(formData.get("email") ?? "").trim();
  if (email) {
    const supabase = await createClient();
    await supabase.auth.resetPasswordForEmail(email);
  }
  // Immer dieselbe Antwort – niemand soll so prüfen können, ob eine Adresse registriert ist.
  return { erfolg: "Falls diese Adresse bei uns hinterlegt ist, haben wir Ihnen einen Link geschickt." };
}

export async function passwortSetzen(_: Zustand, formData: FormData): Promise<Zustand> {
  const passwort = String(formData.get("passwort") ?? "");
  const wiederholung = String(formData.get("wiederholung") ?? "");

  if (passwort !== wiederholung) return { fehler: "Die beiden Passwörter stimmen nicht überein." };
  if (passwort.length < 10 || !/[a-z]/.test(passwort) || !/[A-Z]/.test(passwort) || !/[0-9]/.test(passwort)) {
    return { fehler: "Mindestens 10 Zeichen mit Groß- und Kleinbuchstaben und einer Ziffer." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: passwort });
  if (error) {
    if (error.code === "same_password") return { fehler: "Bitte ein neues Passwort wählen." };
    if (error.code === "weak_password") return { fehler: "Dieses Passwort ist zu schwach." };
    if (error.code === "insufficient_aal") redirect("/anmelden/zwei-faktor?weiter=/passwort-setzen");
    return { fehler: "Das Passwort konnte nicht gespeichert werden. Bitte den Link aus der E-Mail erneut öffnen." };
  }

  const { data: faktoren } = await supabase.auth.mfa.listFactors();
  redirect(faktoren?.totp.some((f) => f.status === "verified") ? "/portal" : "/konto/zwei-faktor?neu=1");
}
