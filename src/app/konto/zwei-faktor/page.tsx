import type { Metadata } from "next";
import Link from "next/link";
import { Seitenkopf } from "@/components/ui/Formular";
import { sitzungLaden } from "@/lib/sitzung";
import { ZweiFaktorEinrichten } from "./Einrichten";

export const metadata: Metadata = { title: "Zwei-Faktor-Anmeldung" };

export default async function ZweiFaktor({ searchParams }: { searchParams: Promise<{ neu?: string }> }) {
  const { neu } = await searchParams;
  const { supabase } = await sitzungLaden();
  const { data: faktoren } = await supabase.auth.mfa.listFactors();
  const aktiv = faktoren?.totp.some((f) => f.status === "verified");

  return (
    <div className="mx-auto max-w-sm space-y-8">
      <Seitenkopf
        titel="Zwei-Faktor-Anmeldung"
        text={
          neu
            ? "Ihr Passwort ist gespeichert. Wir empfehlen, Ihr Konto zusätzlich mit einem Code vom Handy zu schützen."
            : "Zusätzlich zum Passwort fragen wir bei der Anmeldung einen Code aus Ihrer Authenticator-App ab."
        }
      />
      {aktiv ? (
        <p className="border border-linie bg-creme p-6 text-center text-sm">
          Die Zwei-Faktor-Anmeldung ist für Ihr Konto aktiv.
        </p>
      ) : (
        <ZweiFaktorEinrichten />
      )}
      <p className="text-center text-sm">
        <Link href="/portal" className="underline decoration-linie underline-offset-4">
          {aktiv ? "Zurück zum Portal" : "Später einrichten"}
        </Link>
      </p>
    </div>
  );
}
