import type { Metadata } from "next";

export const metadata: Metadata = { title: "Impressum" };

export default function Impressum() {
  return (
    <article className="space-y-4">
      <h1 className="text-3xl">Impressum</h1>
      <p className="text-text-leise">Der Text folgt – er wird von der Pracht Immobiliengruppe geliefert.</p>
    </article>
  );
}
