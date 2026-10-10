# Pracht Eigentümerportal

Web-Plattform der Pracht Immobiliengruppe für die digitale WEG-Verwaltung. Gesamtkonzept: [KONZEPT.md](KONZEPT.md).

## Stand

- [x] Projekt aufgesetzt (Next.js, TypeScript, Tailwind)
- [x] Branding: Farben, Schriften, Logo (hell/dunkel), Bildzeichen, Favicon
- [x] Datenmodell als Vorschlag: [docs/DATENMODELL.md](docs/DATENMODELL.md)
- [ ] Supabase anbinden, Anmeldung mit Einladung und Zwei-Faktor
- [ ] Testdaten (WEG in Stuttgart, 8 Einheiten, 10 Eigentümer) und Tests der Zugriffsregeln
- [ ] Funktionen Stufe 1

## Lokal starten

Voraussetzung: [Node.js](https://nodejs.org) (Version 20 oder neuer).

```bash
npm install
npm run dev
```

Dann im Browser öffnen: http://localhost:3000 – die Markenübersicht liegt unter http://localhost:3000/marke.

## Ordner

| Ordner | Inhalt |
| --- | --- |
| `src/app` | Seiten des Portals |
| `src/components/marke` | Logo, Bildzeichen, Markenfarben |
| `src/app/globals.css` | Zentrale Design-Variablen (Farben, Schriften) |
| `supabase/migrations` | Datenbank-Aufbau inkl. Zugriffsregeln |
| `docs` | Erklärungen |

Zugangsdaten gehören in `.env.local` (Vorlage: `.env.example`) und niemals ins Git.
