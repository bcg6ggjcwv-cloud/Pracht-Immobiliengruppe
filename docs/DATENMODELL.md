# Datenmodell Stufe 1 – Vorschlag zur Freigabe

Technische Datei: `supabase/migrations/20261010000000_datenmodell.sql`
Status: **Vorschlag**, noch nicht in Supabase eingespielt.

## Die Tabellen in Alltagssprache

| Tabelle | Was steht drin | Beispiel |
| --- | --- | --- |
| **weg** | Die Eigentümergemeinschaft: Name, Adresse, Baujahr, Stimmrechtsprinzip (Kopf, MEA, Objekt), Verwalterbestellung von/bis | „WEG Musterweg 12, Stuttgart" |
| **notfallkontakt** | Notdienste je WEG, sortierbar | „Heizungsnotdienst, 0711 …" |
| **einheit** | Wohnung/Gewerbe/Stellplatz mit Nummer, Lage und Miteigentumsanteil | „WE 3, 1. OG links, 125/1000" |
| **person** | Jeder Mensch im System – Eigentümer und Verwaltungsmitarbeiter. Name, E-Mail, Telefon, Anschrift, „Post statt Portal" | |
| **eigentum** | Verbindet Person und Einheit mit Beginn und Ende. Mehrere Personen pro Einheit möglich (Ehepaar, Erbengemeinschaft), eine Person kann mehrere Einheiten haben | |
| **beiratsmitglied** | Wer sitzt im Beirat, wer hat den Vorsitz (höchstens ein Vorsitz je WEG) | |
| **dokument** | Datei mit Kategorie, Jahr, Titel; optional nur für eine Einheit oder eine Person; Häkchen „Pflichtdokument" für das Dashboard | |
| **lesebestaetigung** | Wer hat welches Dokument wann geöffnet | |
| **beschluss** | Beschluss-Sammlung: laufende Nummer, Datum, Versammlung, TOP, Wortlaut, Ergebnis, Stimmen, angefochten + Vermerk | |
| **anliegen** | Schaden, Frage oder Makleranfrage (Bewertung, Vermietung, Verkauf) mit Status | |
| **anliegen_foto** | Fotos zu einem Anliegen | |
| **mitteilung** | Aushang (schwarzes Brett) oder Rundschreiben, mit Zeitpunkt des E-Mail-Versands | |
| **mitarbeiter_zugriff** | Welcher Mitarbeiter welche WEG verwalten darf – einzeln oder „alle WEGs". Vergibt nur der Verwalter | „Max: WEG Musterweg 12" |
| **audit_log** | Wer hat wann was angesehen, angelegt, geändert oder gelöscht | |

## Wer darf was sehen?

Die Regeln stehen **in der Datenbank selbst** (Row Level Security). Selbst wenn im Frontend ein Fehler wäre, liefert die Datenbank fremde Daten nicht aus.

| | Verwalter | Mitarbeiter mit Freigabe | Mitarbeiter ohne Freigabe | Eigentümer / Beirat |
| --- | --- | --- | --- | --- |
| WEGs, Einheiten, Dokumente, Beschlüsse, Anliegen, Mitteilungen | alle | in freigegebenen WEGs alles | nichts | eigene WEG lesen (siehe unten) |
| Eigentümer-Stammdaten pflegen | alle | Eigentümer der freigegebenen WEGs | – | nur eigene Kontaktdaten |
| Neue WEG anlegen | ✔ | nur mit Freigabe „alle WEGs" | – | – |
| WEG oder Person löschen | ✔ | – | – | – |
| Rollen ändern, Logins verknüpfen, Freigaben vergeben | ✔ | – | – | – |
| Audit-Log lesen | ✔ | – | – | – |
| Audit-Log ändern/löschen | niemand | niemand | niemand | niemand |

**Eigentümer und Beirat** sehen in ihrer aktuellen WEG: Stammdaten, Notfallkontakte, Beschluss-Sammlung, Mitteilungen, allgemeine Dokumente, Dokumente der eigenen Einheit und persönliche Dokumente. Sie sehen **keine Daten anderer Personen** – weder Namen noch Adressen anderer Eigentümer oder Beiratsmitglieder.

**Eigene Daten ändern:** Eigentümer ändern Telefon, Anschrift und „Post statt Portal" selbst. Name und E-Mail ändert die Verwaltung (die E-Mail ist zugleich der Login und braucht eine Bestätigungs-Mail). Jede Änderung steht im Audit-Log mit Vorher/Nachher – die Verwaltung sieht also, wer was geändert hat.

**Datenauskunft (Art. 15 DSGVO):** Jeder Eigentümer kann per Knopfdruck alle zu ihm gespeicherten Daten abrufen (Funktion `meine_daten`).

**Eigentümerwechsel:** Beim alten Eigentümer wird bei `eigentum` das Enddatum eingetragen. Ab dem Folgetag sieht er nichts mehr von dieser WEG; die Historie bleibt gespeichert. Der neue Eigentümer sieht ab seinem Beginn-Datum alle allgemeinen Unterlagen (auch ältere Protokolle), aber keine persönlichen Dokumente des Vorbesitzers.

**Dateien** liegen in zwei privaten Ablagen (`dokumente`, `anliegen-fotos`). Eine Datei darf nur laden, wer den zugehörigen Datensatz sehen darf.

## Bereits geprüft

Die Migration wurde in einer lokalen Postgres-16-Datenbank eingespielt und mit Probedaten durchgespielt:

- Eigentümerin aus WEG 1 sieht nur das allgemeine Protokoll ihrer WEG – nicht die WEG 2, nicht die persönliche Abrechnung ihrer Nachbarin, nicht den Grundriss der Nachbarwohnung, keine anderen Personen und keinen Beirat.
- Ehemalige Eigentümerin sieht nichts mehr.
- Eigentümerin ändert ihre Telefonnummer – klappt. Nachname oder Rolle ändern – wird abgewiesen.
- Mitarbeiter mit Freigabe für WEG 1 sieht und pflegt nur WEG 1 und deren Eigentümer; Eigentümer der WEG 2 bleiben unsichtbar.
- Mitarbeiter kann sich nicht selbst zum Verwalter machen, sich keine Freigaben geben und ohne „alle WEGs" keine neue WEG anlegen.
- Mitarbeiterin ohne Freigabe sieht gar nichts.
- Anliegen in fremder WEG oder mit gefälschtem Status „erledigt" wird abgewiesen.
- Öffnen eines Dokuments setzt die Lesebestätigung und schreibt einen Audit-Eintrag; fremde Dokumente lassen sich nicht öffnen.

Die richtigen, wiederholbaren Tests für diese Regeln folgen als eigener Schritt.

## Entscheidungen

Bestätigt am 10.10.2026:

1. **Mitarbeiter** dürfen nur, was der Verwalter freigibt – je WEG oder für alle WEGs. Dann dürfen sie dort alles außer löschen, Rollen ändern, Freigaben vergeben und das Audit-Log lesen.
2. **Datenschutz:** Eigentümer sehen keine anderen Personen, auch nicht den Beirat.
3. **Kontaktdaten** pflegen Eigentümer selbst, die Verwaltung ebenso.

Weiterhin aus dem ersten Vorschlag:

4. **Beirat hat in Stufe 1 keine Zusatzrechte** gegenüber Eigentümern. Belegeinsicht kommt mit Stufe 3.
5. **Volltextsuche** durchsucht Titel und den Text aus dem PDF (deutsche Sprachregeln, „Abrechnungen" findet auch „Abrechnung").
6. **Teilungserklärung** ist eine eigene Dokument-Kategorie.
7. **„Versammlung" beim Beschluss** ist vorerst ein freier Text; in Stufe 2 wird daraus eine eigene Tabelle.
8. **Mitarbeiter sind auch „Personen"** mit Rolle `verwalter` oder `mitarbeiter`.

## Datenschutz – was noch außerhalb der Software zu klären ist

Die Software setzt Datensparsamkeit, Zugriffsschutz, Protokollierung und Auskunft um. Folgendes muss organisatorisch bzw. mit Anwalt geklärt werden, bevor echte Daten ins System kommen:

- **Löschkonzept und Aufbewahrungsfristen** (Belege üblich zehn Jahre; wann werden Daten ehemaliger Eigentümer und alte Audit-Einträge gelöscht?) – die automatische Löschung baue ich ein, sobald die Fristen feststehen.
- **Auftragsverarbeitungsverträge** mit Supabase, Hosting und E-Mail-Dienst.
- **Verzeichnis der Verarbeitungstätigkeiten** und **Datenschutzerklärung**.
- **Externer Sicherheitstest** vor dem Start mit echten Daten.

Noch nicht enthalten (kommt mit späteren Stufen): Versammlungen, Vollmachten, Bevollmächtigte, Verteilerschlüssel, Dienstleister, Nachrichten zwischen Eigentümer und Verwaltung (als eigene Tabelle im nächsten Schritt).
