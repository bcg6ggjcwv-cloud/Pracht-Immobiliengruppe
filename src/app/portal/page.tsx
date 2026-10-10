import type { Metadata } from "next";
import Link from "next/link";
import { Meldung } from "@/components/ui/Formular";
import { sitzungLaden } from "@/lib/sitzung";

export const metadata: Metadata = { title: "Übersicht" };

export default async function Portal({ searchParams }: { searchParams: Promise<{ zweifaktor?: string }> }) {
  const { zweifaktor } = await searchParams;
  const { supabase, person, zweiFaktorAktiv } = await sitzungLaden();
  const istPersonal = person?.rolle === "verwalter" || person?.rolle === "mitarbeiter";

  // RLS liefert nur die WEGs, die diese Person sehen darf.
  const { data: wegs } = await supabase.from("weg").select("id, name, strasse, plz, ort").order("name");

  return (
    <div className="space-y-10">
      <section className="space-y-2">
        <p className="text-xs tracking-[0.3em] text-text-leise uppercase">Pracht Eigentümerportal</p>
        <h1 className="text-3xl">Guten Tag{person ? `, ${person.vorname} ${person.nachname}` : ""}</h1>
      </section>

      {zweifaktor === "aktiv" && <Meldung art="erfolg">Die Zwei-Faktor-Anmeldung ist jetzt aktiv.</Meldung>}
      {!person && (
        <Meldung art="fehler">
          Ihr Zugang ist noch keiner Person zugeordnet. Bitte wenden Sie sich an die Verwaltung.
        </Meldung>
      )}
      {!zweiFaktorAktiv && (
        <Meldung>
          Schützen Sie Ihr Konto zusätzlich mit einem Code vom Handy.{" "}
          <Link href="/konto/zwei-faktor" className="underline underline-offset-4">
            Zwei-Faktor einrichten
          </Link>
        </Meldung>
      )}

      <section className="space-y-4">
        <h2 className="text-xl">{istPersonal ? "Verwaltete Gemeinschaften" : "Ihre Gemeinschaften"}</h2>
        {wegs && wegs.length > 0 ? (
          <ul className="divide-y divide-linie border-y border-linie">
            {wegs.map((weg) => (
              <li key={weg.id} className="py-4">
                <p className="font-serif text-lg">{weg.name}</p>
                <p className="text-sm text-text-leise">
                  {weg.strasse}, {weg.plz} {weg.ort}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-text-leise">Noch keine Gemeinschaft freigeschaltet.</p>
        )}
      </section>

      {istPersonal && (
        <section className="space-y-4">
          <h2 className="text-xl">Verwaltung</h2>
          <Link
            href="/verwaltung/einladen"
            className="inline-block border border-gruen px-5 py-3 text-sm tracking-[0.18em] uppercase hover:bg-gruen hover:text-beige"
          >
            Eigentümer einladen
          </Link>
        </section>
      )}
    </div>
  );
}
