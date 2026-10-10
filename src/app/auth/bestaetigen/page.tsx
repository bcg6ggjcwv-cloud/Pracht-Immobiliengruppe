import type { Metadata } from "next";
import { Bildzeichen } from "@/components/marke/Bildzeichen";
import { Karte, Knopf, Seitenkopf } from "@/components/ui/Formular";
import { bestaetigen } from "./aktionen";

export const metadata: Metadata = { title: "Bestätigen", robots: { index: false } };

const texte: Record<string, { titel: string; text: string; knopf: string }> = {
  invite: {
    titel: "Willkommen",
    text: "Im nächsten Schritt legen Sie Ihr persönliches Passwort für das Pracht Eigentümerportal fest.",
    knopf: "Weiter zum Passwort",
  },
  recovery: {
    titel: "Neues Passwort",
    text: "Im nächsten Schritt legen Sie ein neues Passwort fest.",
    knopf: "Weiter",
  },
  email_change: {
    titel: "E-Mail-Adresse bestätigen",
    text: "Bitte bestätigen Sie Ihre neue E-Mail-Adresse.",
    knopf: "Bestätigen",
  },
};

/**
 * Ziel der Links aus den E-Mails. Der Einmal-Code wird erst beim Klick auf den Knopf eingelöst –
 * so verbrauchen Virenscanner von E-Mail-Programmen, die Links vorab öffnen, den Link nicht.
 */
export default async function Bestaetigen({
  searchParams,
}: {
  searchParams: Promise<{ token_hash?: string; type?: string; weiter?: string }>;
}) {
  const { token_hash, type, weiter } = await searchParams;
  const inhalt = texte[type ?? ""] ?? texte.invite;

  return (
    <div className="mx-auto max-w-sm space-y-8">
      <Seitenkopf icon={<Bildzeichen className="h-16 w-auto" />} titel={inhalt.titel} text={inhalt.text} />
      <form action={bestaetigen}>
        <Karte>
          <input type="hidden" name="token_hash" value={token_hash ?? ""} />
          <input type="hidden" name="type" value={type ?? ""} />
          <input type="hidden" name="weiter" value={weiter ?? ""} />
          <Knopf type="submit">{inhalt.knopf}</Knopf>
        </Karte>
      </form>
    </div>
  );
}
