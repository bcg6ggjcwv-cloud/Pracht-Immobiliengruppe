import type { Metadata } from "next";
import { Bildzeichen } from "@/components/marke/Bildzeichen";

export const metadata: Metadata = { title: "Anmelden" };

/** Platzhalter – die echte Anmeldung über Supabase folgt im nächsten Schritt. */
export default function Anmelden() {
  return (
    <div className="mx-auto max-w-sm space-y-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <Bildzeichen className="h-16 w-auto" />
        <h1 className="text-2xl">Anmelden</h1>
        <p className="text-sm text-text-leise">Mit der E-Mail-Adresse, an die Ihre Einladung ging.</p>
      </div>

      <form className="space-y-5 border border-linie bg-creme p-6">
        <label className="block space-y-1.5">
          <span className="text-sm">E-Mail</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            disabled
            className="w-full border border-linie bg-beige/40 px-3 py-2.5"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm">Passwort</span>
          <input
            type="password"
            name="passwort"
            autoComplete="current-password"
            disabled
            className="w-full border border-linie bg-beige/40 px-3 py-2.5"
          />
        </label>
        <button
          type="submit"
          disabled
          className="w-full bg-gruen py-3 text-sm tracking-[0.18em] text-beige uppercase disabled:opacity-60"
        >
          Anmelden
        </button>
        <p className="text-center text-xs text-text-leise">Die Anmeldung wird im nächsten Schritt freigeschaltet.</p>
      </form>
    </div>
  );
}
