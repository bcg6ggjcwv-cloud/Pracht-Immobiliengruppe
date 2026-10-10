import type { Metadata } from "next";
import { Bildzeichen } from "@/components/marke/Bildzeichen";
import { farben } from "@/components/marke/farben";
import { Logo } from "@/components/marke/Logo";

export const metadata: Metadata = { title: "Marke", robots: { index: false } };

/** Interne Übersicht zum Prüfen von Logo, Farben und Schriften. */
export default function Marke() {
  return (
    <div className="space-y-12">
      <h1 className="text-3xl">Markenübersicht</h1>

      <section className="space-y-4">
        <h2 className="text-xl">Logo</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Logo mitFlaeche className="w-full border border-linie" />
          <Logo variante="dunkel" mitFlaeche className="w-full" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl">Bildzeichen</h2>
        <div className="flex gap-6">
          <Bildzeichen className="h-24 w-auto" />
          <Bildzeichen variante="dunkel" className="h-24 w-auto" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl">Farben</h2>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Object.entries(farben).map(([name, wert]) => (
            <li key={name} className="space-y-2">
              <div className="h-16 border border-linie" style={{ background: wert }} />
              <p className="text-sm capitalize">{name}</p>
              <p className="text-xs text-text-leise">{wert}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl">Schriften</h2>
        <p className="font-serif text-2xl">Libre Caslon Text – Überschriften</p>
        <p>Jost – Fließtext und Bedienelemente. Äußerst übersichtlich, ruhig und gut lesbar.</p>
      </section>
    </div>
  );
}
