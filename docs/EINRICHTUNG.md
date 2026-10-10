# Einrichtung Schritt für Schritt

Diese Anleitung brauchst du einmal. Danach läuft das Portal auf deinem Rechner mit deinem eigenen Supabase-Projekt.
Dauer: etwa 30–45 Minuten. Die Bezeichnungen im Supabase-Dashboard können leicht abweichen, wenn Supabase seine Oberfläche ändert – die Reihenfolge bleibt gleich.

> **Wichtig:** Zugangsdaten (Schlüssel, Passwörter) niemals in einen Chat, eine E-Mail oder auf GitHub kopieren. Sie gehören nur in die Datei `.env.local` auf deinem Rechner und in einen Passwort-Manager.

---

## 1. Supabase-Projekt anlegen

1. Öffne [supabase.com](https://supabase.com) und klicke **Start your project**. Am einfachsten meldest du dich mit deinem GitHub-Konto an.
2. Lege eine **Organization** an (Name z. B. „Pracht Immobiliengruppe“, Typ „Company“, Plan „Free“ zum Testen).
3. Klicke **New project** und fülle aus:
   - **Name:** `pracht-portal`
   - **Database Password:** auf **Generate a password** klicken und das Passwort sofort im Passwort-Manager speichern.
   - **Region:** **Central EU (Frankfurt)** – wichtig für den Datenschutz.
4. **Create new project** klicken und 1–2 Minuten warten, bis das Projekt bereit ist.

**Free oder Pro?** Zum Testen reicht „Free“. Für echte Eigentümerdaten brauchst du **Pro** (ca. 25 $ im Monat): Erst dann gibt es tägliche Backups, und das Projekt wird bei Inaktivität nicht pausiert.

## 2. Datenmodell einspielen

1. Links im Menü **SQL Editor** öffnen.
2. **New query** (oder „+“) klicken.
3. Die Datei `supabase/migrations/20261010000000_datenmodell.sql` aus diesem Projekt öffnen, den **gesamten Inhalt** kopieren und in das Feld einfügen.
4. Unten rechts auf **Run** klicken.
5. Es soll **„Success. No rows returned“** erscheinen. Bei einer roten Fehlermeldung: Meldung abfotografieren (ohne Zugangsdaten) und mir zeigen.

Kontrolle: Links **Table Editor** öffnen – dort stehen jetzt Tabellen wie `weg`, `einheit`, `person`, `dokument`. Neben jeder Tabelle steht ein Hinweis, dass RLS (der Zugriffsschutz) aktiv ist.

## 3. Anmeldung einstellen

Alles unter **Authentication** im linken Menü.

**a) Keine Selbstregistrierung** – nur die Verwaltung lädt ein
- **Sign In / Providers** (bzw. „Providers“) → Abschnitt **User Signups**: **Allow new users to sign up** **ausschalten** → **Save**.
- Der Anbieter **Email** bleibt eingeschaltet.

**b) Sichere Passwörter**
- Beim Anbieter **Email**: **Minimum password length** auf **10**, **Password Requirements** auf **Lowercase, uppercase letters and digits** → **Save**.

**c) Adressen des Portals**
- **URL Configuration**:
  - **Site URL:** `http://localhost:3000` (später ersetzt du das durch die echte Adresse, z. B. `https://portal.deine-domain.de`)
  - **Redirect URLs** → **Add URL:** `http://localhost:3000/**`
- **Save**.

**d) Zwei-Faktor**
- **Multi-Factor** (bzw. „MFA“): **TOTP (App Authenticator)** muss **Enabled** sein (ist meist schon so).

**e) E-Mails im Pracht-Look**
- **Emails** → Reiter **Templates**. Für jede der drei Vorlagen: Betreff eintragen, den Inhalt der Datei komplett in das Feld **Body / Message body** (Ansicht „Source“) einfügen, **Save**.

| Vorlage im Dashboard | Betreff | Datei |
| --- | --- | --- |
| Invite user | Ihre Einladung in das Pracht Eigentümerportal | `supabase/templates/einladung.html` |
| Reset Password | Neues Passwort für das Pracht Eigentümerportal | `supabase/templates/passwort.html` |
| Change Email Address | Bitte bestätigen Sie Ihre neue E-Mail-Adresse | `supabase/templates/email-aendern.html` |

**f) E-Mail-Versand (für den Testbetrieb erst einmal so lassen)**
Supabase verschickt ohne weitere Einstellung nur wenige Mails pro Stunde und **nur an Adressen von Mitgliedern deiner Supabase-Organisation**. Zum Testen mit deiner eigenen Adresse reicht das. Für echte Eigentümer brauchst du einen eigenen Versanddienst mit Servern in der EU und einer Absenderadresse in deiner Domain (z. B. `portal@deine-domain.de`). Die Zugangsdaten trägst du dann unter **Emails → SMTP Settings** ein, mit Absendername **Pracht Immobiliengruppe**. Welchen Dienst du nimmst, entscheiden wir zusammen.

## 4. Zugangsdaten auf deinen Rechner

1. **Project Settings** (Zahnrad unten links) → **API Keys**.
2. Dort gibt es einen **Publishable key** (beginnt mit `sb_publishable_`) und einen **Secret key** (beginnt mit `sb_secret_`, über **Reveal** sichtbar). Gibt es noch keinen Secret key: **Create new API Keys** bzw. **Add new secret key** klicken.
3. Die **Project URL** steht unter **Project Settings → Data API** (oder oben über den **Connect**-Knopf) und sieht so aus: `https://abcdefgh.supabase.co`.
4. Im Projektordner die Datei `.env.example` kopieren, die Kopie `.env.local` nennen und ausfüllen:

```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Der **Secret key** ist ein Generalschlüssel für alle Daten. Er bleibt nur in `.env.local` und später in den Einstellungen des Hostings. `.env.local` wird automatisch nicht zu GitHub hochgeladen.

## 5. Portal auf deinem Rechner starten

Einmalig:
1. [Node.js](https://nodejs.org) herunterladen (die Version mit „LTS“) und installieren.
2. Das Projekt von GitHub herunterladen: auf der GitHub-Seite des Repositorys **Code → Download ZIP**, entpacken. (Oder mit **GitHub Desktop** klonen – damit kannst du spätere Änderungen mit einem Klick holen.)
3. Ein Terminal im Projektordner öffnen:
   - **Mac:** Ordner im Finder mit rechter Maustaste → **Neues Terminal beim Ordner**.
   - **Windows:** Ordner im Explorer öffnen, oben in die Adresszeile `cmd` tippen, Enter.
4. Eingeben und Enter: `npm install` (dauert 1–2 Minuten).

Jedes Mal zum Starten:
```
npm run dev
```
Dann im Browser **http://localhost:3000** öffnen. Beenden mit `Strg + C` im Terminal.

## 6. Dich selbst als Verwalter anlegen

1. Supabase → **Authentication → Users** → **Add user** → **Send invitation** → deine E-Mail-Adresse → **Invite**.
2. **SQL Editor → New query**, folgendes einfügen, **deine Adresse und deinen Namen einsetzen**, **Run**:

```sql
insert into public.person (user_id, rolle, vorname, nachname, email)
select id, 'verwalter', 'Vorname', 'Nachname', email
from auth.users
where email = 'deine@adresse.de';
```

3. In deinem Postfach die Einladung „Ihre Einladung in das Pracht Eigentümerportal“ öffnen (ggf. im Spam-Ordner nachsehen) und **Passwort festlegen** klicken, im Portal dann **Weiter zum Passwort**. Das Portal muss dafür auf deinem Rechner laufen (Schritt 5).
   (Der Zwischenschritt mit dem Knopf ist Absicht: Manche E-Mail-Programme öffnen Links vorab zur Virenprüfung – ohne Knopf wäre der Einmal-Link dann schon verbraucht.)
4. Passwort festlegen → danach wird dir Zwei-Faktor angeboten. **Für dich als Verwalter bitte unbedingt einrichten**, denn du siehst alle Daten.

## 7. So testest du die Anmeldung

| Test | Erwartung |
| --- | --- |
| http://localhost:3000/portal ohne Anmeldung öffnen | Du landest auf „Anmelden“ |
| Mit falschem Passwort anmelden | „E-Mail oder Passwort ist nicht korrekt.“ – die E-Mail bleibt im Feld stehen |
| Richtig anmelden | Nach dem Passwort wird der Code aus der Authenticator-App abgefragt, dann „Guten Tag, …“ |
| Abmelden (oben rechts) und erneut anmelden | Wieder Passwort + Code |
| „Passwort vergessen?“ mit deiner Adresse | Mail „Neues Passwort …“; der Link führt erst zur Code-Abfrage, dann zum neuen Passwort |
| Denselben Passwort-Link ein zweites Mal öffnen | „Dieser Link ist nicht mehr gültig“ |
| „Passwort vergessen?“ mit einer erfundenen Adresse | Dieselbe Meldung wie oben (so kann niemand ausprobieren, wer Kunde ist) |

Eigentümer einladen kannst du schon unter **Portal → Eigentümer einladen**. Echte Testdaten (WEG mit 8 Einheiten und 10 Eigentümern) lege ich im nächsten Schritt an.

---

## Später: Mitarbeiter freischalten

Mitarbeiter lädst du genauso ein. Danach gibst du per SQL eine Freigabe (eine Bedienoberfläche dafür folgt):

```sql
-- Mitarbeiter anlegen (nach der Einladung über Authentication → Users)
insert into public.person (user_id, rolle, vorname, nachname, email)
select id, 'mitarbeiter', 'Vorname', 'Nachname', email from auth.users where email = 'mitarbeiter@adresse.de';

-- Freigabe für eine bestimmte WEG …
insert into public.mitarbeiter_zugriff (person_id, weg_id)
select p.id, w.id from public.person p, public.weg w
where p.email = 'mitarbeiter@adresse.de' and w.name = 'WEG Musterstraße 12';

-- … oder für alle WEGs
insert into public.mitarbeiter_zugriff (person_id)
select id from public.person where email = 'mitarbeiter@adresse.de';
```
