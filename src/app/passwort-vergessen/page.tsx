import type { Metadata } from "next";
import { Seitenkopf } from "@/components/ui/Formular";
import { NichtKonfiguriert } from "@/components/ui/NichtKonfiguriert";
import { supabaseKonfiguriert } from "@/lib/supabase/env";
import { PasswortVergessenFormular } from "./Formular";

export const metadata: Metadata = { title: "Passwort vergessen" };

export default function PasswortVergessen() {
  return (
    <div className="mx-auto max-w-sm space-y-8">
      <Seitenkopf
        titel="Passwort vergessen"
        text="Wir senden Ihnen einen Link, mit dem Sie ein neues Passwort festlegen."
      />
      {supabaseKonfiguriert ? <PasswortVergessenFormular /> : <NichtKonfiguriert />}
    </div>
  );
}
