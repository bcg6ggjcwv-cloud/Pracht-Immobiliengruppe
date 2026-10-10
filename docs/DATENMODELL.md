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
| **audit_log** | Wer hat wann was angesehen, angelegt, geändert oder gelöscht | |

## Wer darf was sehen?

Die Regeln stehen **in der Datenbank selbst** (Row Level Security). Selbst wenn im Frontend ein Fehler wäre, liefert die Datenbank fremde Daten nicht aus.

| | Verwalter | Mitarbeiter | Beirat | Eigentümer |
| --- | --- | --- | --- | --- |
| Alle WEGs, Einheiten, Personen | ✔ | ✔ | – | – |
| Eigene WEG(s): Stammdaten, Notfallkontakte, Beschlüsse, Mitteilungen | ✔ | ✔ | ✔ | ✔ |
| Allgemeine Dokumente der WEG | ✔ | ✔ | ✔ | ✔ |
| Dokumente einer Einheit | ✔ | ✔ | nur eigene Einheit | nur eigene Einheit |
| Persönliche Dokumente | ✔ | ✔ | nur eigene | nur eigene |
| Daten anderer Eigentümer (Adresse, Telefon) | ✔ | ✔ | – | – |
| Anliegen | alle | alle | nur eigene | nur eigene |
| Audit-Log lesen | ✔ | – | – | – |
| Audit-Log ändern/löschen | niemand | niemand | niemand | niemand |

**Eigentümerwechsel:** Beim alten Eigentümer wird bei `eigentum` das Enddatum eingetragen. Ab dem Folgetag sieht er nichts mehr von dieser WEG; die Historie bleibt gespeichert. Der neue Eigentümer sieht ab seinem Beginn-Datum alle allgemeinen Unterlagen (auch ältere Protokolle), aber keine persönlichen Dokumente des Vorbesitzers.

**Dateien** liegen in zwei privaten Ablagen (`dokumente`, `anliegen-fotos`). Eine Datei darf nur laden, wer den zugehörigen Datensatz sehen darf.

## Bereits geprüft

Die Migration wurde in einer lokalen Postgres-16-Datenbank eingespielt und mit Probedaten durchgespielt:

- Eigentümerin aus WEG 1 sieht nur das allgemeine Protokoll ihrer WEG – nicht die WEG 2, nicht die persönliche Abrechnung ihrer Nachbarin, nicht den Grundriss der Nachbarwohnung, und nur ihren eigenen Personendatensatz.
- Ehemalige Eigentümerin sieht nichts mehr.
- Anliegen in fremder WEG oder mit gefälschtem Status „erledigt" wird abgewiesen.
- Öffnen eines Dokuments setzt die Lesebestätigung und schreibt einen Audit-Eintrag; fremde Dokumente lassen sich nicht öffnen.
- Eigentümer können das Audit-Log weder lesen noch löschen und den Status ihres Anliegens nicht ändern.

Die richtigen, wiederholbaren Tests für diese Regeln folgen als eigener Schritt.

## Bewusste Entscheidungen – bitte bestätigen oder ändern

1. **Mitarbeiter dürfen alles, was der Verwalter darf**, außer das Audit-Log lesen. Sollen Mitarbeiter eingeschränkt werden (z. B. nur bestimmte WEGs)?
2. **Beirat hat in Stufe 1 keine Zusatzrechte** gegenüber Eigentümern. Belegeinsicht kommt mit Stufe 3.
3. **Eigentümer sehen die Namen anderer Eigentümer nicht.** Auch die Namen der Beiratsmitglieder sind für Eigentümer noch nicht sichtbar – soll der Beirat namentlich angezeigt werden?
4. **Eigentümer können ihre Kontaktdaten nicht selbst ändern**, sondern melden Änderungen per Nachricht. Alternative: Telefon/Anschrift selbst pflegen.
5. **Volltextsuche** durchsucht Titel und den Text aus dem PDF (deutsche Sprachregeln, „Abrechnungen" findet auch „Abrechnung").
6. **Teilungserklärung** ist eine eigene Dokument-Kategorie (zusätzlich zu deiner Liste), weil sie ein Stammdokument ist.
7. **„Versammlung" beim Beschluss** ist vorerst ein freier Text. In Stufe 2 wird daraus eine eigene Tabelle mit Einladung, Tagesordnung usw.
8. **Mitarbeiter sind auch „Personen"** mit Rolle `verwalter` oder `mitarbeiter` – eine Tabelle für alle Menschen.

Noch nicht enthalten (kommt mit späteren Stufen): Versammlungen, Vollmachten, Bevollmächtigte, Verteilerschlüssel, Dienstleister, Nachrichten zwischen Eigentümer und Verwaltung (als eigene Tabelle im nächsten Schritt, falls gewünscht).
