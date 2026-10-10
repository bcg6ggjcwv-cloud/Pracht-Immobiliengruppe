/** Nur interne Weiterleitungen zulassen (verhindert Umleitung auf fremde Seiten). */
export function sichererPfad(wert: unknown, standard = "/portal"): string {
  if (typeof wert !== "string" || !wert.startsWith("/") || wert.startsWith("//") || wert.includes("\\")) {
    return standard;
  }
  return wert;
}
