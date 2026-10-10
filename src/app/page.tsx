import Link from "next/link";

export default function Startseite() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <p className="text-xs tracking-[0.3em] text-text-leise uppercase">Pracht Eigentümerportal</p>
        <h1 className="text-[1.75rem] leading-tight sm:text-4xl">Ihre Eigentümer&shy;gemeinschaft. Geordnet an einem Ort.</h1>
        <p className="max-w-prose text-text-leise">
          Abrechnungen, Wirtschaftsplan, Protokolle, Beschluss-Sammlung und Ihre Anliegen – für Eigentümer der
          von uns verwalteten Gemeinschaften jederzeit einsehbar.
        </p>
      </section>

      <div className="h-px bg-linie" />

      <Link
        href="/anmelden"
        className="inline-block bg-gruen px-6 py-3 text-sm tracking-[0.18em] text-beige uppercase hover:bg-gruen/90"
      >
        Zum Login
      </Link>
    </div>
  );
}
