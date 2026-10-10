"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Feld, Karte, Knopf, Meldung } from "@/components/ui/Formular";
import { createClient } from "@/lib/supabase/browser";

type Einrichtung = { faktorId: string; qrCode: string; geheimnis: string };

/** Zwei-Faktor per Authenticator-App (z. B. Google Authenticator, Microsoft Authenticator, 1Password). */
export function ZweiFaktorEinrichten() {
  const router = useRouter();
  const [einrichtung, setEinrichtung] = useState<Einrichtung | null>(null);
  const [fehler, setFehler] = useState<string>();
  const [laeuft, setLaeuft] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      // Abgebrochene Einrichtungen aufräumen, sonst sammeln sich unbestätigte Faktoren an.
      const { data: faktoren } = await supabase.auth.mfa.listFactors();
      for (const f of faktoren?.all ?? []) {
        if (f.status === "unverified") await supabase.auth.mfa.unenroll({ factorId: f.id });
      }
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: `Authenticator ${new Date().toLocaleDateString("de-DE")}`,
        issuer: "Pracht Eigentümerportal",
      });
      if (error || !data) return setFehler("Die Einrichtung konnte nicht gestartet werden. Bitte Seite neu laden.");
      setEinrichtung({ faktorId: data.id, qrCode: data.totp.qr_code, geheimnis: data.totp.secret });
    })();
  }, []);

  async function bestaetigen(formData: FormData) {
    if (!einrichtung) return;
    setLaeuft(true);
    setFehler(undefined);
    const code = String(formData.get("code") ?? "").replace(/\s/g, "");
    const { error } = await createClient().auth.mfa.challengeAndVerify({ factorId: einrichtung.faktorId, code });
    setLaeuft(false);
    if (error) return setFehler("Der Code stimmt nicht. Bitte den aktuellen Code aus der App eingeben.");
    router.push("/portal?zweifaktor=aktiv");
    router.refresh();
  }

  return (
    <Karte>
      <ol className="list-decimal space-y-2 pl-5 text-sm">
        <li>Authenticator-App auf dem Handy öffnen (z. B. Google oder Microsoft Authenticator).</li>
        <li>Den QR-Code scannen.</li>
        <li>Den sechsstelligen Code aus der App unten eingeben.</li>
      </ol>

      {einrichtung ? (
        <div className="flex flex-col items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- QR-Code kommt als Daten-URL von Supabase */}
          <img src={einrichtung.qrCode} alt="QR-Code für die Authenticator-App" className="h-48 w-48 bg-white p-2" />
          <details className="text-center text-xs text-text-leise">
            <summary className="cursor-pointer">Scannen nicht möglich?</summary>
            <p className="mt-2">Diesen Schlüssel in der App von Hand eingeben:</p>
            <code className="mt-1 block break-all select-all">{einrichtung.geheimnis}</code>
          </details>
        </div>
      ) : (
        !fehler && <p className="text-center text-sm text-text-leise">QR-Code wird erstellt …</p>
      )}

      <form action={bestaetigen} className="space-y-5">
        <Feld
          label="Code aus der App"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9 ]{6,7}"
          maxLength={7}
          required
        />
        <Meldung art="fehler">{fehler}</Meldung>
        <Knopf type="submit" disabled={!einrichtung || laeuft}>
          {laeuft ? "Bitte warten …" : "Aktivieren"}
        </Knopf>
      </form>
    </Karte>
  );
}
