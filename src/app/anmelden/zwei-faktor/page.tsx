import type { Metadata } from "next";
import { Bildzeichen } from "@/components/marke/Bildzeichen";
import { Seitenkopf } from "@/components/ui/Formular";
import { CodeFormular } from "./CodeFormular";

export const metadata: Metadata = { title: "Zwei-Faktor-Code" };

export default async function ZweiFaktorCode({ searchParams }: { searchParams: Promise<{ weiter?: string }> }) {
  const { weiter } = await searchParams;

  return (
    <div className="mx-auto max-w-sm space-y-8">
      <Seitenkopf
        icon={<Bildzeichen className="h-16 w-auto" />}
        titel="Code eingeben"
        text="Öffnen Sie Ihre Authenticator-App und geben Sie den aktuellen Code für das Pracht Eigentümerportal ein."
      />
      <CodeFormular weiter={weiter} />
    </div>
  );
}
