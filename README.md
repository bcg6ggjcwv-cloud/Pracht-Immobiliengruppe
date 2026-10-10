# Pracht Eigentümerportal

Web-Plattform der Pracht Immobiliengruppe für die digitale WEG-Verwaltung. Gesamtkonzept: [KONZEPT.md](KONZEPT.md).

## Stand

- [x] Projekt aufgesetzt (Next.js, TypeScript, Tailwind)
- [x] Branding: Farben, Schriften, Logo (hell/dunkel), Bildzeichen, Favicon
- [x] Datenmodell als Vorschlag: [docs/DATENMODELL.md](docs/DATENMODELL.md)
- [x] Supabase angebunden: Einladung per E-Mail, Passwort festlegen, Zwei-Faktor (Authenticator-App), Passwort vergessen
- [x] E-Mail-Vorlagen im Pracht-Look (`supabase/templates`)
- [ ] Testdaten (WEG in Stuttgart, 8 Einheiten, 10 Eigentümer) und Tests der Zugriffsregeln
- [ ] Funktionen Stufe 1

## Einrichtung

Supabase-Projekt anlegen, Zugangsdaten eintragen, ersten Verwalter anlegen: **[docs/EINRICHTUNG.md](docs/EINRICHTUNG.md)**.

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
| `src/lib/supabase` | Verbindung zu Supabase |
| `supabase/migrations` | Datenbank-Aufbau inkl. Zugriffsregeln |
| `supabase/templates` | E-Mail-Vorlagen |
| `docs` | Erklärungen |

Zugangsdaten gehören in `.env.local` (Vorlage: `.env.example`) und niemals ins Git.
