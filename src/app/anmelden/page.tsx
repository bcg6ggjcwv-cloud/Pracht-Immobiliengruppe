import type { Metadata } from "next";
import { Bildzeichen } from "@/components/marke/Bildzeichen";
import { Seitenkopf } from "@/components/ui/Formular";
import { NichtKonfiguriert } from "@/components/ui/NichtKonfiguriert";
import { supabaseKonfiguriert } from "@/lib/supabase/env";
import { AnmeldeFormular } from "./AnmeldeFormular";

export const metadata: Metadata = { title: "Anmelden" };

export default async function Anmelden({ searchParams }: { searchParams: Promise<{ weiter?: string }> }) {
  const { weiter } = await searchParams;

  return (
    <div className="mx-auto max-w-sm space-y-8">
      <Seitenkopf
        icon={<Bildzeichen className="h-16 w-auto" />}
        titel="Anmelden"
        text="Mit der E-Mail-Adresse, an die Ihre Einladung ging."
      />
      {supabaseKonfiguriert ? <AnmeldeFormular weiter={weiter} /> : <NichtKonfiguriert />}
      <p className="text-center text-xs text-text-leise">
        Noch kein Zugang? Die Verwaltung schickt Ihnen eine Einladung per E-Mail.
      </p>
    </div>
  );
}
