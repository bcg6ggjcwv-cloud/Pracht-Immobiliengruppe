import type { Metadata } from "next";

export const metadata: Metadata = { title: "Datenschutzerklärung" };

export default function Datenschutz() {
  return (
    <article className="space-y-4">
      <h1 className="text-3xl">Datenschutzerklärung</h1>
      <p className="text-text-leise">Der Text folgt – er wird von der Pracht Immobiliengruppe geliefert.</p>
    </article>
  );
}
