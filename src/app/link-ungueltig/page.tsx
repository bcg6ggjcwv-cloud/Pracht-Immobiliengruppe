import type { Metadata } from "next";
import Link from "next/link";
import { Seitenkopf } from "@/components/ui/Formular";

export const metadata: Metadata = { title: "Link ungültig" };

export default function LinkUngueltig() {
  return (
    <div className="mx-auto max-w-sm space-y-8 text-center">
      <Seitenkopf
        titel="Dieser Link ist nicht mehr gültig"
        text="Links aus unseren E-Mails gelten aus Sicherheitsgründen nur einmal und nur begrenzte Zeit."
      />
      <p className="text-sm">
        <Link href="/passwort-vergessen" className="underline decoration-linie underline-offset-4">
          Neuen Link anfordern
        </Link>{" "}
        oder die Verwaltung um eine neue Einladung bitten.
      </p>
    </div>
  );
}
