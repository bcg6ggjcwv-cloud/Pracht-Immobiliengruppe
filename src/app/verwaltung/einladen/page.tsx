import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Meldung } from "@/components/ui/Formular";
import { sitzungLaden } from "@/lib/sitzung";
import { einladen } from "./aktionen";

export const metadata: Metadata = { title: "Eigentümer einladen" };

type Person = {
  id: string;
  vorname: string;
  nachname: string;
  email: string | null;
  user_id: string | null;
  post_statt_portal: boolean;
};

export default async function Einladen({
  searchParams,
}: {
  searchParams: Promise<{ erfolg?: string; fehler?: string }>;
}) {
  const { erfolg, fehler } = await searchParams;
  const { supabase, person: ich } = await sitzungLaden();
  if (ich?.rolle !== "verwalter" && ich?.rolle !== "mitarbeiter") redirect("/portal");

  // Liefert dank RLS nur Personen, die diese Mitarbeiterin bzw. dieser Mitarbeiter pflegen darf.
  const { data } = await supabase
    .from("person")
    .select("id, vorname, nachname, email, user_id, post_statt_portal")
    .neq("id", ich.id)
    .order("nachname");
  const personen = (data ?? []) as Person[];
  const offen = personen.filter((p) => !p.user_id);
  const mitZugang = personen.filter((p) => p.user_id);

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <Link href="/portal" className="text-sm text-text-leise hover:text-gruen">
          ← Übersicht
        </Link>
        <h1 className="text-3xl">Eigentümer einladen</h1>
        <p className="text-sm text-text-leise">
          Die Person erhält eine E-Mail von der Pracht Immobiliengruppe, legt ihr Passwort fest und kann danach
          Zwei-Faktor einrichten.
        </p>
      </div>

      <Meldung art="erfolg">{erfolg}</Meldung>
      <Meldung art="fehler">{fehler}</Meldung>

      <section className="space-y-4">
        <h2 className="text-xl">Noch ohne Zugang</h2>
        {offen.length === 0 ? (
          <p className="text-sm text-text-leise">Alle Personen haben bereits einen Zugang.</p>
        ) : (
          <ul className="divide-y divide-linie border-y border-linie">
            {offen.map((p) => (
              <li key={p.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p>
                    {p.vorname} {p.nachname}
                  </p>
                  <p className="text-sm text-text-leise">
                    {p.email ?? "keine E-Mail hinterlegt"}
                    {p.post_statt_portal && " · wünscht Post statt Portal"}
                  </p>
                </div>
                <form action={einladen}>
                  <input type="hidden" name="personId" value={p.id} />
                  <button
                    type="submit"
                    disabled={!p.email}
                    className="border border-gruen px-4 py-2 text-xs tracking-[0.18em] uppercase hover:bg-gruen hover:text-beige disabled:opacity-40"
                  >
                    Einladen
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>

      {mitZugang.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl">Mit Zugang</h2>
          <ul className="divide-y divide-linie border-y border-linie text-sm">
            {mitZugang.map((p) => (
              <li key={p.id} className="py-3">
                {p.vorname} {p.nachname} <span className="text-text-leise">· {p.email}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
