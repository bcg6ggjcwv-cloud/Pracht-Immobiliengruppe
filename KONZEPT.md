# Konzept: Digitale WEG-Verwaltungsplattform – Pracht Immobiliengruppe

Stand: 10.10.2026

## Zielbild und Zielgruppen

Eine Plattform im Branding der Pracht Immobiliengruppe, auf der eine WEG-Verwaltung komplett digital läuft: Der Verwalter arbeitet darin, die Eigentümer sehen darin alles zu ihrem Objekt, und die Eigentümerversammlung findet darin statt. Fokus ist die Verwaltung; Anfragen zu Bewertung, Vermietung oder Verkauf sind eine Nebenfunktion im Eigentümerportal.

| Rolle | Was sie in der Plattform tut |
| --- | --- |
| Verwalter / Mitarbeiter | Objekte, Eigentümer und Dokumente pflegen, Versammlungen vorbereiten und leiten, KI-Protokoll prüfen und freigeben, Abrechnungen bereitstellen, Anliegen bearbeiten |
| Verwaltungsbeirat | Zusätzlich: Rechnungsprüfung, Belegeinsicht, Mitzeichnung des Protokolls, Abstimmung mit dem Verwalter |
| Eigentümer | Eigener Login, sieht nur seine freigeschalteten Objekte: Abrechnungen, Wirtschaftsplan, Protokolle, Beschluss-Sammlung, Unterlagen; nimmt an Versammlungen teil und stimmt ab; meldet Schäden und Anliegen; stellt Anfragen zu Bewertung, Vermietung, Verkauf |
| Mieter (spätere Stufe) | Schadensmeldung und Hausinfos, nur wenn der Eigentümer oder die SEV-Verwaltung das freischaltet |
| Dienstleister (spätere Stufe) | Aufträge annehmen, Termine und Rechnungen zurückmelden |

Nicht Ziel der ersten Stufen: eine eigene Finanzbuchhaltung. Die Abrechnung entsteht anfangs in bestehender Verwaltersoftware und wird ins Portal übernommen (siehe Ausbaustufen).

## Branding

- Name: Pracht Immobiliengruppe, im Portal kurz „Pracht Eigentümerportal“
- Stil: Old Money, zurückhaltend, viel Weißraum, feine Linien statt Schatten und Verläufe
- Farben: Dunkelgrün #1E3A2F (Hauptfarbe), Beige #EDE4D1 (Grund), Sand #C9B488 (Akzent), Creme #F4EEE2 (Flächen)
- Schriften: Libre Caslon Text für Logo und Überschriften, Jost für Fließtext und Bedienelemente (beide Google Fonts)
- Logo: Wortmarke PRACHT in Libre Caslon, Versalien weit gesperrt (ca. 0.26em), zwischen zwei feinen Doppellinien, darunter IMMOBILIENGRUPPE klein und weit gesperrt; hell (Grün auf Beige) und dunkel (Beige auf Grün)
- Bildzeichen: kursives P (EB Garamond) in einem doppelt umrandeten Schild; für Favicon, App-Icon und E-Mail-Signatur

## Rechtlicher Rahmen

Die Plattform muss die gesetzlichen Verwalterpflichten abbilden, sonst ist sie für eine WEG-Verwaltung wertlos.

| Vorgabe | Inhalt | Folge für die Plattform |
| --- | --- | --- |
| § 24 WEG Einberufung | Mindestens eine Versammlung pro Jahr; Einberufungsfrist soll mindestens drei Wochen betragen; Vorsitz führt der Verwalter | Einladungsmodul mit Fristprüfung, Tagesordnung, Zustellnachweis |
| § 24 Abs. 6 WEG Niederschrift | Beschlüsse sind zu protokollieren; Unterschrift durch Vorsitzenden, einen Eigentümer und, falls vorhanden, den Beiratsvorsitzenden | KI-Entwurf, Prüfung durch Verwalter, digitale Mitzeichnung durch Eigentümer und Beirat |
| § 24 Abs. 7–8 WEG Beschluss-Sammlung | Pflicht des Verwalters; jeder Eigentümer hat Einsichtsrecht; Anfechtungen sind zu vermerken | Eigene, durchsuchbare Beschluss-Sammlung pro WEG mit Anfechtungsvermerk |
| § 28 WEG Finanzen | Wirtschaftsplan pro Kalenderjahr, Jahresabrechnung, Vermögensbericht mit Rücklagen und wesentlichem Gemeinschaftsvermögen für jeden Eigentümer | Bereitstellung aller drei Dokumente pro Eigentümer, Versionsstand, Lesebestätigung |
| § 18 Abs. 4 WEG Einsicht | Jeder Eigentümer kann Einsicht in die Verwaltungsunterlagen verlangen | Digitale Belegeinsicht im Portal |
| § 23 Abs. 1 S. 2 WEG Hybrid | Online-Teilnahme an Präsenzversammlung per Beschluss möglich | Online-Teilnahme und Online-Abstimmung parallel zur Präsenz |
| § 23 Abs. 1a WEG virtuell | Seit 17.10.2024 rein virtuelle Versammlung möglich; Beschluss mit drei Vierteln der abgegebenen Stimmen, für höchstens drei Jahre; Teilnahme und Rechteausübung müssen mit Präsenz vergleichbar sein | Beschluss-Status pro WEG speichern (gilt bis wann), Bild und Ton aller Teilnehmer |
| § 48 Abs. 6 WEG Übergang | Bei Beschluss vor dem 1.1.2028: bis Ende 2028 jährlich eine Präsenzversammlung, außer einstimmiger Verzicht | Erinnerung im Verwalter-Dashboard |
| § 23 Abs. 3 WEG Umlaufbeschluss | Beschluss außerhalb der Versammlung in Textform möglich | Digitale Umlaufbeschlüsse mit Fristen und Stimmzählung |
| § 25 Abs. 3 WEG Vollmacht | Vollmachten in Textform | Vollmachten digital, automatisch in der Stimmzählung |
| § 201 StGB, DSGVO KI-Protokoll | Verwalter ist datenschutzrechtlich verantwortlich; für Tonaufnahmen reicht ein Mehrheitsbeschluss wohl nicht; Information schon in der Einladung; Aufzeichnung nur zum Protokollzweck | Einwilligung jedes Teilnehmers vor Start, Audio nach Protokollerstellung löschen, Hinweis in jeder Einladung |
| § 26a WEG, § 34c GewO | Anspruch auf zertifizierten Verwalter; Erlaubnis nach § 34c GewO plus Weiterbildungspflicht | Kein Software-Thema, aber Voraussetzung für das Geschäftsmodell |

Reine Live-Transkription ohne gespeichertes Audio gilt nach überwiegender Ansicht nicht als Aufnahme im Sinne von § 201 StGB. Sobald Audio zwischengespeichert wird, braucht es die Einwilligung aller. Die Plattform arbeitet deshalb immer mit Einwilligung.

Offen und mit Anwalt oder VDIV-Musterbeschlüssen zu klären: Wortlaut des Einwilligungstextes, Aufbewahrungsfristen für Belege (üblich zehn Jahre), Umgang mit Eigentümern, die nicht digital teilnehmen wollen.

## Marktüberblick

| Anbieter | Schwerpunkt | Relevanz |
| --- | --- | --- |
| casavi | Portal und Service-App für Eigentümer und Mieter, Vorgangsmanagement, Dienstleisterplattform; dockt an bestehende ERP-Systeme an | Vorbild für das Portal |
| DOMUS Software | ERP mit integriertem Eigentümerportal, hybride Versammlungen | Klassischer Komplettanbieter |
| Aareon | ERP; integriert externe Versammlungstools | Bestätigt den Ansatz Zoom/Teams einbinden |
| Immoware24 | Cloud-Hausverwaltung mit Buchhaltung und Portal | Möglicher Buchhaltungsunterbau |
| HausPerfekt, iDWELL u. a. | Komplettlösungen | Weitere Optionen für die Buchhaltung |

Architektur-Entscheidung: eigene Plattform für Portal, Kommunikation, Versammlung und Protokoll; Buchhaltung und Abrechnung zunächst aus einer bestehenden ERP-Software, später per Schnittstelle angebunden.

## Funktionsliste

Stufe 1 = Portal, 2 = Versammlung, 3 = Finanzen, 4 = Erweiterungen.

### A. Stammdaten

| Funktion | Stufe |
| --- | --- |
| WEG-Objekte mit Adresse, Baujahr, Einheitenzahl | 1 |
| Einheiten mit Miteigentumsanteilen (MEA) | 1 |
| Eigentümer, auch mehrere pro Einheit (Ehepaare, Erbengemeinschaften) | 1 |
| Eigentümerwechsel mit Stichtag; alter Eigentümer verliert Zugriff, Historie bleibt | 1 |
| Verwaltungsbeirat mit Vorsitz | 1 |
| Teilungserklärung und Gemeinschaftsordnung als Stammdokument | 1 |
| Verwalterbestellung mit Laufzeit und Erinnerung an Wiederbestellung | 1 |
| Notfallkontakte je WEG | 1 |
| Stimmrechtsprinzip pro WEG: Kopf, MEA oder Objekt | 2 |
| Verteilerschlüssel pro Kostenart | 3 |
| Dienstleister, Versicherungen, Wartungsverträge mit Laufzeiten | 4 |

### B. Zugang und Rechte

| Funktion | Stufe |
| --- | --- |
| Einladung per E-Mail, Eigentümer setzt eigenes Passwort | 1 |
| Zwei-Faktor-Anmeldung, Passwort-Reset | 1 |
| Rollen: Verwalter, Mitarbeiter, Beirat, Eigentümer | 1 |
| Freischaltung pro Objekt; ein Eigentümer mit mehreren Wohnungen sieht alle | 1 |
| Protokoll aller Zugriffe und Änderungen (Audit-Log) | 1 |
| Bevollmächtigte (Kinder, Steuerberater, Mieter) mit eingeschränkten Rechten | 2 |

### C. Dokumente

| Funktion | Stufe |
| --- | --- |
| Ordnerstruktur pro WEG: Abrechnungen, Protokolle, Verträge, Pläne, Energieausweis, Versicherungen | 1 |
| Persönliche Dokumente nur für den einzelnen Eigentümer | 1 |
| Lesebestätigung und Zustellnachweis | 1 |
| Volltextsuche | 1 |
| Beschluss-Sammlung als durchsuchbare Ansicht mit Anfechtungsvermerk | 1 |
| Massen-Upload von Altunterlagen bei Übernahme einer WEG | 1 |
| Digitale Belegeinsicht für Eigentümer und Beirat | 3 |
| Datenexport bei Verwalterwechsel | 3 |
| Verkaufspaket für Käufer: Beschlüsse, Protokolle, Wirtschaftsplan, Rücklagenstand | 4 |

### D. Kommunikation

| Funktion | Stufe |
| --- | --- |
| Rundschreiben an alle Eigentümer einer WEG | 1 |
| Schwarzes Brett pro Objekt | 1 |
| E-Mail-Benachrichtigung bei neuen Dokumenten | 1 |
| Nachrichten zwischen Eigentümer und Verwaltung | 1 |
| Postversand für Eigentümer ohne Portal | 2 |

### E. Anliegen und Schäden

| Funktion | Stufe |
| --- | --- |
| Schadensmeldung mit Fotos und Ort im Gebäude | 1 |
| Ticket mit Status, für Eigentümer sichtbar | 1 |
| Weiterleitung an Handwerker mit Rückmeldung | 4 |
| Versicherungsschaden-Akte | 4 |

### F. Eigentümerversammlung

| Funktion | Stufe |
| --- | --- |
| Versammlung anlegen: Datum, Format (Präsenz, hybrid, virtuell) | 2 |
| Prüfung, ob ein gültiger Beschluss zur virtuellen Versammlung vorliegt | 2 |
| Tagesordnung mit Beschlussvorlagen und Anlagen | 2 |
| Anträge der Eigentümer zur Tagesordnung | 2 |
| Einladung mit Fristprüfung (drei Wochen) und Hinweis zur Transkription | 2 |
| Anmeldung mit Teilnahmeart, Vollmachten digital | 2 |
| Zoom- oder Teams-Meeting automatisch erzeugen | 2 |
| Anwesenheitsliste und Beschlussfähigkeit live | 2 |
| Abstimmung im Portal nach Stimmrechtsprinzip, mit Stimmverboten | 2 |
| Einwilligung jedes Teilnehmers zur Transkription | 2 |
| KI-Protokollentwurf mit Beschlusswortlaut und Abstimmungsergebnis | 2 |
| Prüfung, Bearbeitung und Freigabe durch den Verwalter | 2 |
| Digitale Mitzeichnung durch Eigentümer und Beiratsvorsitz | 2 |
| Beschluss-Sammlung wird aus dem freigegebenen Protokoll gefüllt | 2 |
| Audio wird nach Freigabe gelöscht | 2 |
| Anfechtungsfrist von einem Monat je Beschluss nachverfolgen | 2 |
| Umlaufbeschlüsse | 2 |
| Umsetzung der Beschlüsse als Aufgabenliste | 2 |
| Erinnerung an Präsenzpflicht bis Ende 2028 | 2 |

### G. Finanzen

| Funktion | Stufe |
| --- | --- |
| Wirtschaftsplan, Jahresabrechnung, Vermögensbericht hochladen und je Eigentümer bereitstellen | 1 |
| Import der Abrechnungen aus der ERP-Software | 3 |
| Hausgeld-Übersicht: Soll, Ist, Rückstand | 3 |
| Rücklagenstand je WEG | 3 |
| Bescheinigung nach § 35a EStG je Eigentümer | 3 |
| Belegprüfung durch den Beirat | 3 |
| Eigene Abrechnungslogik (nur wenn ERP nicht reicht) | 4 |

### H. Makler-Anfragen

| Funktion | Stufe |
| --- | --- |
| Buttons: Wert ermitteln, vermieten, verkaufen | 1 |
| Anfrage landet als Aufgabe beim Verwalter, Objektdaten vorausgefüllt | 1 |

### I. Verwalter-Backoffice

| Funktion | Stufe |
| --- | --- |
| Dashboard: offene Tickets, Versammlungen, Fristen, auslaufende Verwalterbestellungen | 1 |
| Impressum und Datenschutzerklärung | 1 |
| Fristen für Wartungen und Prüfungen (Aufzug, Trinkwasser, Rauchmelder) | 4 |
| Vertragsübersicht mit Kündigungsfristen | 4 |

### J. Spätere Erweiterungen

| Funktion | Stufe |
| --- | --- |
| Mieter-Zugang | 4 |
| Dienstleister-Portal | 4 |
| Sondereigentumsverwaltung | 4 |
| KI-Assistent für Eigentümerfragen aus den WEG-Unterlagen | 4 |
| Native App | 4 |

## Ausbaustufen

1. **Stufe 1 – Eigentümerportal:** Logins, Rechte, Dokumente, Beschluss-Sammlung, schwarzes Brett, Anliegen, Makler-Buttons; Abrechnungen als PDF aus der Buchhaltung.
   - Übergang: Portal läuft bei einer Pilot-WEG; Zoom oder Teams entschieden; Einwilligungstext geprüft.
2. **Stufe 2 – Versammlung und KI-Protokoll:** Einladung, Vollmachten, Meeting-Link, Abstimmung, Transkript, KI-Entwurf, Freigabe, Beschluss-Sammlung automatisch.
   - Übergang: erste Versammlung digital durchgeführt; Buchhaltungssoftware ausgewählt.
3. **Stufe 3 – Finanzen:** Import aus der Buchhaltung, Abrechnung je Eigentümer, Hausgeld, Rücklagen, § 35a, Belegprüfung, Datenexport.
   - Übergang: nur bei Bedarf weiter.
4. **Stufe 4 – Erweiterungen:** Mieter, Dienstleister, Wartungsfristen, Mietverwaltung, Verkaufspaket, KI-Assistent, App.

## Technik, Sicherheit, Rollen

| Baustein | Vorschlag |
| --- | --- |
| Oberfläche | Next.js (React), mobil zuerst |
| Datenbank, Login, Dateien | Supabase, Region Frankfurt |
| Rechte | Row Level Security in der Datenbank |
| Videomeeting | Zoom- oder Microsoft-Teams-Schnittstelle |
| KI-Protokoll | Sprachmodell-Schnittstelle (z. B. Claude API) |
| E-Mail | Versanddienst mit Servern in der EU, Absender in eigener Domain |
| Hosting | Anbieter mit EU-Rechenzentrum; getrennte Test- und Live-Umgebung |

Pflichtpunkte: Auftragsverarbeitungsverträge mit jedem Dienst, Verzeichnis der Verarbeitungstätigkeiten, Löschkonzept, tägliche Backups, Verschlüsselung, Barrierefreiheit (Kontraste, Tastaturbedienung, Schriftgrößen), externer Sicherheitstest vor echten Daten.

## Risiken und offene Entscheidungen

| Risiko | Gegenmaßnahme |
| --- | --- |
| KI-Protokoll gibt Beschluss falsch wieder | Nur Entwurf; Beschlusswortlaut aus der Vorlage, nicht aus dem Transkript |
| Technische Panne in virtueller Versammlung | Ausweichplan in der Einladung, Abbruchregel, Test-Login |
| Eigentümer ohne Internet | Postversand bleibt, hybrid als Regelfall |
| Datenleck | Zugriffsregeln in der Datenbank, Sicherheitstest, Zwei-Faktor |
| Software wird zum Zweitjob | Klein anfangen, Buchhaltung zukaufen |

Offene Entscheidungen:

- [ ] Welche Buchhaltungssoftware wird der Unterbau?
- [ ] Zoom oder Microsoft Teams?
- [ ] Reicht eine elektronische Unterschrift für das Protokoll nach § 24 Abs. 6 WEG? Mit Anwalt klären.
- [ ] Einwilligungstext und Musterbeschluss zur virtuellen Versammlung
- [ ] Nur eigene Verwaltung oder später an andere Verwalter verkaufen?
- [ ] Erlaubnis nach § 34c GewO, Berufshaftpflicht, Zertifizierung nach § 26a WEG
- [ ] Domain, E-Mail-Absender, laufende Kosten, Pilot-WEG

## Erster Auftrag an Claude Code

```
Du baust mit mir die Web-Plattform der Pracht Immobiliengruppe, einer WEG-Hausverwaltung in Stuttgart. Wir starten mit Stufe 1: dem Eigentümerportal. Alle Texte der Oberfläche auf Deutsch.

Technik:
- Next.js (App Router, TypeScript), Tailwind
- Supabase (Postgres, Auth mit Zwei-Faktor, Storage), Region Frankfurt
- Zugriffsschutz über Row Level Security in der Datenbank, nicht nur im Frontend
- Mobil zuerst gestaltet, ruhiges, seriöses Design

Branding:
- Name: Pracht Immobiliengruppe, im Portal kurz "Pracht Eigentümerportal"
- Farben: Dunkelgrün #1E3A2F als Hauptfarbe, Beige #EDE4D1 als Grund, Sand #C9B488 als Akzent, Creme #F4EEE2 für Flächen; alle Farben als zentrale Design-Variablen
- Schrift: Libre Caslon Text für Logo und Überschriften, Jost für Fließtext und Bedienelemente (beide Google Fonts)
- Stil: Old Money, zurückhaltend, viel Weißraum, feine Linien statt Schatten und Verläufe
- Logo: Wortmarke PRACHT in Libre Caslon, Versalien weit gesperrt (ca. 0.26em), zwischen zwei feinen Doppellinien, darunter IMMOBILIENGRUPPE klein und weit gesperrt; als SVG-Komponente in hell (Grün auf Beige) und dunkel (Beige auf Grün)
- Bildzeichen: kursives P (EB Garamond) in einem doppelt umrandeten Schild; für Favicon, App-Icon und E-Mail-Signatur
- Logo in Kopfzeile, Login-Seite, E-Mails und PDF-Exporten
- E-Mails und Einladungen im gleichen Look mit Absender Pracht Immobiliengruppe

Rollen: Verwalter, Mitarbeiter, Beirat, Eigentümer.

Datenmodell (bitte zuerst als Migration vorschlagen und mir erklären, bevor du baust):
- WEG (Objekt): Name, Adresse, Baujahr, Stimmrechtsprinzip (Kopf, MEA, Objekt), Verwalterbestellung von/bis, Notfallkontakte
- Einheit: gehört zu WEG, Nummer, Lage, Miteigentumsanteil
- Person: Name, E-Mail, Telefon, Postanschrift, möchte Post statt Portal (ja/nein)
- Eigentum: verbindet Person und Einheit, mit Beginn- und Enddatum (für Eigentümerwechsel)
- Beiratsmitglied: Person, WEG, Vorsitz ja/nein
- Dokument: WEG, optional einzelne Einheit oder Person (dann nur für diese sichtbar), Kategorie (Abrechnung, Wirtschaftsplan, Vermögensbericht, Protokoll, Vertrag, Plan, Sonstiges), Jahr, Datei
- Lesebestätigung: Dokument, Person, Zeitpunkt
- Beschluss: WEG, Datum, Versammlung, Wortlaut, Ergebnis, angefochten ja/nein
- Anliegen: WEG, Einheit, Person, Art (Schaden, Frage, Makleranfrage: Bewertung, Vermietung, Verkauf), Text, Fotos, Status
- Mitteilung: WEG, Titel, Text, Datum (schwarzes Brett und Rundschreiben)
- Audit-Log: wer hat wann was gesehen oder geändert

Funktionen Stufe 1:
1. Verwalter legt WEGs, Einheiten, Personen und Eigentum an (auch per CSV-Import)
2. Einladung per E-Mail, Eigentümer setzt Passwort, Zwei-Faktor wird angeboten
3. Eigentümer sieht nur WEGs, in denen er aktuell Eigentum hat; persönliche Dokumente nur er selbst
4. Dokumentenbereich pro WEG mit Kategorien, Jahresfilter und Suche; Lesebestätigung beim Öffnen
5. Beschluss-Sammlung pro WEG als Liste mit Suche
6. Schwarzes Brett und Rundschreiben mit E-Mail-Benachrichtigung
7. Anliegen melden mit Fotos; Status für den Eigentümer sichtbar
8. Drei Buttons: Wert ermitteln, vermieten, verkaufen; erzeugen ein Anliegen vom Typ Makleranfrage
9. Verwalter-Dashboard: offene Anliegen, neue Makleranfragen, ungelesene Pflichtdokumente, auslaufende Verwalterbestellungen
10. Notfallkontakte je WEG (Notdienst außerhalb der Bürozeiten) gut sichtbar für Eigentümer
11. Seiten für Impressum und Datenschutzerklärung (Texte liefere ich)
12. Massen-Upload von Altunterlagen bei Übernahme einer WEG

Vorgehen:
- Lies zuerst die Datei KONZEPT.md in diesem Ordner; sie enthält das Gesamtkonzept mit allen Stufen
- Arbeite in kleinen Schritten, nach jedem Schritt kurze Zusammenfassung und wie ich es teste
- Ich bin kein Entwickler: erkläre Einrichtungsschritte (Supabase, Hosting) so, dass ich sie selbst klicken kann
- Sichere jeden fertigen Schritt mit einem Git-Commit
- Lege Testdaten an: eine WEG in Stuttgart mit 8 Einheiten und 10 Eigentümern
- Schreibe Tests für die Zugriffsregeln: ein Eigentümer darf nie Daten einer fremden WEG oder fremde persönliche Dokumente sehen
- Keine echten Personendaten im Code oder in Testdaten

Fang an mit: Projekt aufsetzen und Datenmodell als Vorschlag.
```

## So setzt du es mit Claude Code um

1. **Konten anlegen:** Claude-Abo mit Claude Code, GitHub, Supabase (Region Frankfurt), Netlify oder Vercel, eigene Domain.
2. **Ordner vorbereiten:** leeren Ordner „pracht-portal“ anlegen, diese Datei als KONZEPT.md hineinlegen.
3. **Claude Code starten:** in der Desktop-App, im Browser oder im Terminal, mit diesem Ordner.
4. **Auftrag einfügen:** den Text aus „Erster Auftrag an Claude Code“ komplett hineinkopieren.
5. **Datenmodell prüfen** und freigeben.
6. **Zugangsdaten** von Supabase in die Datei .env.local eintragen, nie in einen Chat oder in GitHub.
7. **Schritt für Schritt testen** mit den Testdaten.
8. **Online stellen** und Domain verbinden.
9. **Vor echten Eigentümerdaten:** Auftragsverarbeitungsverträge, Rechtstexte prüfen lassen, Sicherheitstest, Pilot mit einer WEG.

Rechtliche Angaben ersetzen keine Rechtsberatung; vor Stufe 2 mit Anwalt oder Verband abstimmen.
