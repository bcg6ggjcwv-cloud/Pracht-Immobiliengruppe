-- =====================================================================
-- Pracht Eigentümerportal – Datenmodell Stufe 1 (VORSCHLAG)
-- Erklärung in Alltagssprache: docs/DATENMODELL.md
--
-- Grundsatz: Jede Tabelle hat Row Level Security (RLS). Die Datenbank
-- selbst entscheidet, wer welche Zeile sehen darf – nicht das Frontend.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Auswahllisten
-- ---------------------------------------------------------------------

create type public.app_rolle as enum ('verwalter', 'mitarbeiter', 'eigentuemer');
create type public.stimmrechtsprinzip as enum ('kopf', 'mea', 'objekt');
create type public.dokument_kategorie as enum (
  'abrechnung', 'wirtschaftsplan', 'vermoegensbericht', 'protokoll',
  'vertrag', 'plan', 'teilungserklaerung', 'sonstiges'
);
create type public.beschluss_ergebnis as enum ('angenommen', 'abgelehnt');
create type public.anliegen_art as enum (
  'schaden', 'frage', 'makler_bewertung', 'makler_vermietung', 'makler_verkauf'
);
create type public.anliegen_status as enum ('neu', 'in_bearbeitung', 'erledigt', 'geschlossen');
create type public.mitteilung_art as enum ('aushang', 'rundschreiben');

-- ---------------------------------------------------------------------
-- 2. Tabellen
-- ---------------------------------------------------------------------

-- WEG (Objekt)
create table public.weg (
  id                      uuid primary key default gen_random_uuid(),
  name                    text not null,
  strasse                 text not null,
  plz                     text not null check (plz ~ '^[0-9]{5}$'),
  ort                     text not null,
  baujahr                 int  check (baujahr between 1600 and 2100),
  stimmrechtsprinzip      public.stimmrechtsprinzip not null default 'kopf',
  verwalter_bestellt_von  date,
  verwalter_bestellt_bis  date,
  erstellt_am             timestamptz not null default now(),
  check (verwalter_bestellt_bis is null or verwalter_bestellt_von is null
         or verwalter_bestellt_bis >= verwalter_bestellt_von)
);

-- Notfallkontakte je WEG (z. B. Notdienst Heizung, Schlüsseldienst)
create table public.notfallkontakt (
  id           uuid primary key default gen_random_uuid(),
  weg_id       uuid not null references public.weg on delete cascade,
  bezeichnung  text not null,
  telefon      text not null,
  hinweis      text,
  reihenfolge  int  not null default 0
);

-- Einheit (Wohnung, Gewerbe, Stellplatz …)
create table public.einheit (
  id      uuid primary key default gen_random_uuid(),
  weg_id  uuid not null references public.weg on delete cascade,
  nummer  text not null,
  lage    text,
  mea     numeric(10,4) not null check (mea > 0),  -- Miteigentumsanteil, z. B. in Tausendstel
  unique (weg_id, nummer)
);

-- Person (Eigentümer und Mitarbeiter der Verwaltung)
create table public.person (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid unique references auth.users on delete set null, -- Login, erst nach Einladung gesetzt
  rolle              public.app_rolle not null default 'eigentuemer',
  vorname            text not null,
  nachname           text not null,
  email              text unique,
  telefon            text,
  strasse            text,
  plz                text,
  ort                text,
  post_statt_portal  boolean not null default false,
  erstellt_am        timestamptz not null default now()
);

-- Eigentum: wer besitzt welche Einheit von wann bis wann
create table public.eigentum (
  id         uuid primary key default gen_random_uuid(),
  person_id  uuid not null references public.person on delete restrict,
  einheit_id uuid not null references public.einheit on delete cascade,
  beginn     date not null,
  ende       date,                         -- leer = Eigentum besteht noch
  check (ende is null or ende >= beginn)
);
create index on public.eigentum (person_id);
create index on public.eigentum (einheit_id);

-- Verwaltungsbeirat
create table public.beiratsmitglied (
  id         uuid primary key default gen_random_uuid(),
  person_id  uuid not null references public.person on delete restrict,
  weg_id     uuid not null references public.weg on delete cascade,
  vorsitz    boolean not null default false,
  beginn     date not null default current_date,
  ende       date,
  check (ende is null or ende >= beginn)
);
-- höchstens ein aktiver Vorsitz je WEG
create unique index beirat_ein_vorsitz on public.beiratsmitglied (weg_id)
  where vorsitz and ende is null;

-- Dokument
-- Sichtbarkeit: nur weg_id → alle aktuellen Eigentümer der WEG
--               + einheit_id → nur aktuelle Eigentümer dieser Einheit
--               + person_id  → nur diese Person
create table public.dokument (
  id               uuid primary key default gen_random_uuid(),
  weg_id           uuid not null references public.weg on delete cascade,
  einheit_id       uuid references public.einheit on delete cascade,
  person_id        uuid references public.person on delete cascade,
  kategorie        public.dokument_kategorie not null,
  titel            text not null,
  jahr             int check (jahr between 1900 and 2100),
  pflichtdokument  boolean not null default false,  -- Lesebestätigung wird im Dashboard nachverfolgt
  datei_pfad       text not null unique,            -- Pfad im Storage-Bucket "dokumente"
  dateiname        text not null,
  mime_typ         text,
  groesse_bytes    bigint,
  inhalt_text      text,                            -- aus der PDF gelesener Text für die Volltextsuche
  suche            tsvector generated always as (
                     to_tsvector('german', coalesce(titel, '') || ' ' || coalesce(inhalt_text, ''))
                   ) stored,
  hochgeladen_von  uuid references public.person on delete set null,
  erstellt_am      timestamptz not null default now()
);
create index on public.dokument (weg_id, kategorie, jahr);
create index dokument_suche on public.dokument using gin (suche);

-- Lesebestätigung
create table public.lesebestaetigung (
  dokument_id  uuid not null references public.dokument on delete cascade,
  person_id    uuid not null references public.person on delete cascade,
  gelesen_am   timestamptz not null default now(),
  primary key (dokument_id, person_id)
);

-- Beschluss (Beschluss-Sammlung nach § 24 Abs. 7 WEG)
create table public.beschluss (
  id                  uuid primary key default gen_random_uuid(),
  weg_id              uuid not null references public.weg on delete cascade,
  laufende_nummer     int not null,
  datum               date not null,
  versammlung         text,   -- z. B. "Ordentliche Versammlung 2026"; ab Stufe 2 Verweis auf Tabelle versammlung
  top                 text,   -- Tagesordnungspunkt
  wortlaut            text not null,
  ergebnis            public.beschluss_ergebnis not null,
  stimmen_ja          int,
  stimmen_nein        int,
  enthaltungen        int,
  angefochten         boolean not null default false,
  anfechtung_vermerk  text,
  suche               tsvector generated always as (
                        to_tsvector('german', coalesce(wortlaut, '') || ' ' || coalesce(top, ''))
                      ) stored,
  erstellt_am         timestamptz not null default now(),
  unique (weg_id, laufende_nummer)
);
create index beschluss_suche on public.beschluss using gin (suche);

-- Anliegen (Schaden, Frage, Makleranfrage)
create table public.anliegen (
  id               uuid primary key default gen_random_uuid(),
  weg_id           uuid not null references public.weg on delete cascade,
  einheit_id       uuid references public.einheit on delete set null,
  person_id        uuid not null references public.person on delete restrict,
  art              public.anliegen_art not null,
  betreff          text not null,
  text             text not null,
  ort_im_gebaeude  text,
  status           public.anliegen_status not null default 'neu',
  erstellt_am      timestamptz not null default now(),
  aktualisiert_am  timestamptz not null default now()
);
create index on public.anliegen (weg_id, status);

create table public.anliegen_foto (
  id           uuid primary key default gen_random_uuid(),
  anliegen_id  uuid not null references public.anliegen on delete cascade,
  datei_pfad   text not null unique,  -- Pfad im Storage-Bucket "anliegen-fotos"
  erstellt_am  timestamptz not null default now()
);

-- Mitteilung (schwarzes Brett und Rundschreiben)
create table public.mitteilung (
  id                 uuid primary key default gen_random_uuid(),
  weg_id             uuid not null references public.weg on delete cascade,
  art                public.mitteilung_art not null default 'aushang',
  titel              text not null,
  text               text not null,
  veroeffentlicht_am timestamptz not null default now(),
  email_versendet_am timestamptz,
  erstellt_von       uuid references public.person on delete set null
);

-- Audit-Log: wer hat wann was gesehen oder geändert (nur anhängen, nie ändern)
create table public.audit_log (
  id           bigint generated always as identity primary key,
  zeitpunkt    timestamptz not null default now(),
  user_id      uuid,
  aktion       text not null check (aktion in ('angesehen', 'angelegt', 'geaendert', 'geloescht')),
  tabelle      text not null,
  datensatz_id uuid,
  details      jsonb
);
create index on public.audit_log (zeitpunkt desc);

-- Freigaben für Mitarbeiter: ohne Eintrag sieht ein Mitarbeiter nichts.
-- weg_id leer = Freigabe für alle WEGs (auch neu angelegte).
create table public.mitarbeiter_zugriff (
  id           uuid primary key default gen_random_uuid(),
  person_id    uuid not null references public.person on delete cascade,
  weg_id       uuid references public.weg on delete cascade,
  erteilt_am   timestamptz not null default now(),
  erteilt_von  uuid references public.person on delete set null
);
create unique index mitarbeiter_zugriff_eindeutig
  on public.mitarbeiter_zugriff (person_id, coalesce(weg_id, '00000000-0000-0000-0000-000000000000'));

-- ---------------------------------------------------------------------
-- 3. Hilfsfunktionen für die Zugriffsregeln
--    "security definer" = laufen mit Rechten des Erstellers, damit sie
--    selbst nicht an RLS scheitern. Sie geben nur Ja/Nein bzw. die
--    eigene Personen-ID zurück, nie fremde Daten.
-- ---------------------------------------------------------------------

create function public.meine_person_id() returns uuid
language sql stable security definer set search_path = '' as $$
  select id from public.person where user_id = auth.uid()
$$;

create function public.ist_verwalter() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.person where user_id = auth.uid() and rolle = 'verwalter')
$$;

-- Verwalter oder Mitarbeiter (unabhängig von Freigaben)
create function public.ist_personal() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.person
    where user_id = auth.uid() and rolle in ('verwalter', 'mitarbeiter')
  )
$$;

-- Mitarbeiter mit Freigabe für alle WEGs
create function public.hat_freigabe_alle() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.mitarbeiter_zugriff z
    join public.person p on p.id = z.person_id
    where p.user_id = auth.uid() and p.rolle = 'mitarbeiter' and z.weg_id is null
  )
$$;

-- Mitarbeiter mit irgendeiner Freigabe
create function public.hat_freigabe() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.mitarbeiter_zugriff z
    join public.person p on p.id = z.person_id
    where p.user_id = auth.uid() and p.rolle = 'mitarbeiter'
  )
$$;

-- Darf diese WEG verwalten: Verwalter immer, Mitarbeiter nur mit Freigabe
create function public.darf_weg_verwalten(p_weg uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.ist_verwalter() or exists (
    select 1 from public.mitarbeiter_zugriff z
    join public.person p on p.id = z.person_id
    where p.user_id = auth.uid() and p.rolle = 'mitarbeiter'
      and (z.weg_id is null or z.weg_id = p_weg)
  )
$$;

-- Darf die Stammdaten dieses Eigentümers pflegen: Person gehört (auch früher)
-- zu einer freigegebenen WEG oder ist noch keiner WEG zugeordnet (gerade angelegt)
create function public.darf_person_verwalten(p_person uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.ist_verwalter() or public.hat_freigabe_alle() or (
    public.hat_freigabe() and (
      exists (select 1 from public.eigentum e join public.einheit ei on ei.id = e.einheit_id
              where e.person_id = p_person and public.darf_weg_verwalten(ei.weg_id))
      or exists (select 1 from public.beiratsmitglied b
                 where b.person_id = p_person and public.darf_weg_verwalten(b.weg_id))
      or (not exists (select 1 from public.eigentum where person_id = p_person)
          and not exists (select 1 from public.beiratsmitglied where person_id = p_person))
    )
  )
$$;

-- aktuelles Eigentum an einer bestimmten Einheit
create function public.ist_eigentuemer_der_einheit(p_einheit uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.eigentum e
    join public.person p on p.id = e.person_id
    where p.user_id = auth.uid()
      and e.einheit_id = p_einheit
      and e.beginn <= current_date
      and (e.ende is null or e.ende >= current_date)
  )
$$;

-- aktuelles Eigentum oder Beiratsamt in einer WEG
create function public.ist_mitglied_der_weg(p_weg uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.eigentum e
    join public.einheit ei on ei.id = e.einheit_id
    join public.person p on p.id = e.person_id
    where p.user_id = auth.uid()
      and ei.weg_id = p_weg
      and e.beginn <= current_date
      and (e.ende is null or e.ende >= current_date)
  ) or exists (
    select 1 from public.beiratsmitglied b
    join public.person p on p.id = b.person_id
    where p.user_id = auth.uid()
      and b.weg_id = p_weg
      and b.beginn <= current_date
      and (b.ende is null or b.ende >= current_date)
  )
$$;

-- ---------------------------------------------------------------------
-- 4. Row Level Security
-- ---------------------------------------------------------------------

alter table public.weg                 enable row level security;
alter table public.notfallkontakt      enable row level security;
alter table public.einheit             enable row level security;
alter table public.person              enable row level security;
alter table public.eigentum            enable row level security;
alter table public.beiratsmitglied     enable row level security;
alter table public.dokument            enable row level security;
alter table public.lesebestaetigung    enable row level security;
alter table public.beschluss           enable row level security;
alter table public.anliegen            enable row level security;
alter table public.anliegen_foto       enable row level security;
alter table public.mitteilung          enable row level security;
alter table public.audit_log           enable row level security;
alter table public.mitarbeiter_zugriff enable row level security;

-- 4a. Verwaltung: Verwalter immer, Mitarbeiter nur in freigegebenen WEGs

-- WEG anlegen: Verwalter oder Mitarbeiter mit Freigabe für alle WEGs; löschen nur der Verwalter
create policy verwaltung_lesen   on public.weg for select using (public.darf_weg_verwalten(id));
create policy verwaltung_anlegen on public.weg for insert with check (public.ist_verwalter() or public.hat_freigabe_alle());
create policy verwaltung_aendern on public.weg for update using (public.darf_weg_verwalten(id)) with check (public.darf_weg_verwalten(id));
create policy verwalter_loeschen on public.weg for delete using (public.ist_verwalter());

create policy verwaltung_alles on public.notfallkontakt  for all using (public.darf_weg_verwalten(weg_id)) with check (public.darf_weg_verwalten(weg_id));
create policy verwaltung_alles on public.einheit         for all using (public.darf_weg_verwalten(weg_id)) with check (public.darf_weg_verwalten(weg_id));
create policy verwaltung_alles on public.beiratsmitglied for all using (public.darf_weg_verwalten(weg_id)) with check (public.darf_weg_verwalten(weg_id));
create policy verwaltung_alles on public.dokument        for all using (public.darf_weg_verwalten(weg_id)) with check (public.darf_weg_verwalten(weg_id));
create policy verwaltung_alles on public.beschluss       for all using (public.darf_weg_verwalten(weg_id)) with check (public.darf_weg_verwalten(weg_id));
create policy verwaltung_alles on public.anliegen        for all using (public.darf_weg_verwalten(weg_id)) with check (public.darf_weg_verwalten(weg_id));
create policy verwaltung_alles on public.mitteilung      for all using (public.darf_weg_verwalten(weg_id)) with check (public.darf_weg_verwalten(weg_id));

create policy verwaltung_alles on public.eigentum for all
  using (exists (select 1 from public.einheit e where e.id = einheit_id and public.darf_weg_verwalten(e.weg_id)))
  with check (exists (select 1 from public.einheit e where e.id = einheit_id and public.darf_weg_verwalten(e.weg_id)));

create policy verwaltung_alles on public.anliegen_foto for all
  using (exists (select 1 from public.anliegen a where a.id = anliegen_id and public.darf_weg_verwalten(a.weg_id)))
  with check (exists (select 1 from public.anliegen a where a.id = anliegen_id and public.darf_weg_verwalten(a.weg_id)));

create policy verwaltung_lesen on public.lesebestaetigung for select
  using (exists (select 1 from public.dokument d where d.id = dokument_id and public.darf_weg_verwalten(d.weg_id)));

-- Personen: Mitarbeiter pflegen nur Eigentümer ihrer WEGs und legen nur Eigentümer ohne Login an.
-- Rolle und Login ändert nur der Verwalter (siehe Trigger person_schutz).
create policy verwaltung_lesen on public.person for select
  using (public.ist_verwalter() or (rolle = 'eigentuemer' and public.darf_person_verwalten(id)));
create policy verwaltung_anlegen on public.person for insert
  with check (public.ist_verwalter() or (public.hat_freigabe() and rolle = 'eigentuemer' and user_id is null));
create policy verwaltung_aendern on public.person for update
  using (public.ist_verwalter() or (rolle = 'eigentuemer' and public.darf_person_verwalten(id)))
  with check (public.ist_verwalter() or (rolle = 'eigentuemer' and public.darf_person_verwalten(id)));
create policy verwalter_loeschen on public.person for delete using (public.ist_verwalter());

-- Freigaben vergibt nur der Verwalter; Mitarbeiter sehen ihre eigenen
create policy verwalter_alles on public.mitarbeiter_zugriff for all
  using (public.ist_verwalter()) with check (public.ist_verwalter());
create policy selbst_lesen on public.mitarbeiter_zugriff for select
  using (person_id = public.meine_person_id());

-- Audit-Log: nur der Verwalter liest; geschrieben wird ausschließlich über
-- die Funktionen unten. Niemand darf ändern oder löschen.
create policy verwalter_lesen on public.audit_log for select using (public.ist_verwalter());

-- 4b. Eigentümer und Beirat: nur eigene WEGs, keine Daten anderer Personen

create policy mitglied_lesen on public.weg            for select using (public.ist_mitglied_der_weg(id));
create policy mitglied_lesen on public.notfallkontakt for select using (public.ist_mitglied_der_weg(weg_id));
create policy mitglied_lesen on public.einheit        for select using (public.ist_mitglied_der_weg(weg_id));
create policy mitglied_lesen on public.beschluss      for select using (public.ist_mitglied_der_weg(weg_id));
create policy mitglied_lesen on public.mitteilung     for select using (public.ist_mitglied_der_weg(weg_id));

-- Beirat: jeder sieht nur seinen eigenen Eintrag (keine Namen anderer, Datenschutz)
create policy selbst_lesen on public.beiratsmitglied for select using (person_id = public.meine_person_id());

-- Person: eigener Datensatz lesen und Kontaktdaten selbst ändern
-- (welche Felder, regelt der Trigger person_schutz)
create policy selbst_lesen   on public.person for select using (user_id = auth.uid());
create policy selbst_aendern on public.person for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Eigentum: nur eigene Einträge
create policy selbst_lesen on public.eigentum for select using (person_id = public.meine_person_id());

-- Dokumente: WEG muss aktuell sichtbar sein UND
--   allgemeines Dokument, ODER Einheit gehört mir aktuell, ODER persönlich an mich
create policy mitglied_lesen on public.dokument for select using (
  public.ist_mitglied_der_weg(weg_id)
  and (einheit_id is null or public.ist_eigentuemer_der_einheit(einheit_id))
  and (person_id  is null or person_id = public.meine_person_id())
);

-- Lesebestätigung: eigene lesen und anlegen, nur für Dokumente, die ich sehen darf
create policy selbst_lesen on public.lesebestaetigung for select using (person_id = public.meine_person_id());
create policy selbst_anlegen on public.lesebestaetigung for insert with check (
  person_id = public.meine_person_id()
  and exists (select 1 from public.dokument d where d.id = dokument_id)  -- RLS von dokument greift hier mit
);

-- Anliegen: eigene sehen; neue nur für eigene WEG/Einheit und nur mit Status "neu"
create policy selbst_lesen on public.anliegen for select using (person_id = public.meine_person_id());
create policy selbst_anlegen on public.anliegen for insert with check (
  person_id = public.meine_person_id()
  and status = 'neu'
  and public.ist_mitglied_der_weg(weg_id)
  and (einheit_id is null or public.ist_eigentuemer_der_einheit(einheit_id))
);

create policy selbst_lesen on public.anliegen_foto for select using (
  exists (select 1 from public.anliegen a where a.id = anliegen_id and a.person_id = public.meine_person_id())
);
create policy selbst_anlegen on public.anliegen_foto for insert with check (
  exists (select 1 from public.anliegen a where a.id = anliegen_id and a.person_id = public.meine_person_id())
);

-- 4c. Schutz einzelner Felder der Person
--   Verwalter: alles. Mitarbeiter: alles außer Rolle und Login.
--   Eigentümer selbst: nur Telefon, Anschrift und "Post statt Portal".
--   Name und E-Mail ändert die Verwaltung (E-Mail = Login, läuft über Bestätigungs-Mail).
create function public.person_schutz() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null or public.ist_verwalter() then
    return new;  -- Server-Prozesse (Einladung) und Verwalter
  end if;
  if new.rolle is distinct from old.rolle or new.user_id is distinct from old.user_id then
    raise exception 'Rolle und Login darf nur der Verwalter ändern';
  end if;
  if old.user_id = auth.uid() and not public.darf_person_verwalten(old.id) then
    if new.vorname is distinct from old.vorname or new.nachname is distinct from old.nachname
       or new.email is distinct from old.email then
      raise exception 'Name und E-Mail ändert die Verwaltung – bitte eine Nachricht senden';
    end if;
  end if;
  return new;
end $$;

create trigger person_schutz before update on public.person
  for each row execute function public.person_schutz();

-- ---------------------------------------------------------------------
-- 5. Audit-Log befüllen
-- ---------------------------------------------------------------------

create function public.protokolliere(p_aktion text, p_tabelle text, p_id uuid) returns void
language sql security definer set search_path = '' as $$
  insert into public.audit_log (user_id, aktion, tabelle, datensatz_id)
  values (auth.uid(), p_aktion, p_tabelle, p_id)
$$;

-- Änderungen werden automatisch per Trigger protokolliert
create function public.audit_aenderung() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.audit_log (user_id, aktion, tabelle, datensatz_id, details)
  values (
    auth.uid(),
    case tg_op when 'INSERT' then 'angelegt' when 'UPDATE' then 'geaendert' else 'geloescht' end,
    tg_table_name,
    case when tg_op = 'DELETE' then (to_jsonb(old) ->> 'id')::uuid else (to_jsonb(new) ->> 'id')::uuid end,
    case when tg_op = 'UPDATE' then jsonb_build_object('vorher', to_jsonb(old), 'nachher', to_jsonb(new))
         when tg_op = 'DELETE' then to_jsonb(old)
         else to_jsonb(new) end
  );
  return coalesce(new, old);
end $$;

do $$
declare t text;
begin
  foreach t in array array['weg','notfallkontakt','einheit','person','eigentum','beiratsmitglied',
                           'dokument','beschluss','anliegen','mitteilung','mitarbeiter_zugriff']
  loop
    execute format('create trigger audit after insert or update or delete on public.%I
                    for each row execute function public.audit_aenderung()', t);
  end loop;
end $$;

-- "Angesehen" ruft die App beim Öffnen eines Dokuments auf.
-- Gleichzeitig wird die Lesebestätigung gesetzt.
create function public.dokument_geoeffnet(p_dokument uuid) returns void
language plpgsql security invoker set search_path = '' as $$
declare v_person uuid := public.meine_person_id();
begin
  -- prüft mit den Rechten des Nutzers, ob er das Dokument sehen darf
  if not exists (select 1 from public.dokument where id = p_dokument) then
    raise exception 'Kein Zugriff auf dieses Dokument';
  end if;
  perform public.protokolliere('angesehen', 'dokument', p_dokument);
  if v_person is not null and not public.ist_personal() then
    insert into public.lesebestaetigung (dokument_id, person_id)
    values (p_dokument, v_person) on conflict do nothing;
  end if;
end $$;

-- Datenauskunft nach Art. 15 DSGVO: alle Daten, die zur eigenen Person gespeichert sind.
-- Läuft mit den Rechten des Nutzers, liefert also nie fremde Daten.
create function public.meine_daten() returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare v_person uuid := public.meine_person_id();
begin
  perform public.protokolliere('angesehen', 'person', v_person);
  return jsonb_build_object(
    'erstellt_am',       now(),
    'person',            (select to_jsonb(p) from public.person p where p.id = v_person),
    'eigentum',          (select coalesce(jsonb_agg(to_jsonb(e)), '[]') from public.eigentum e where e.person_id = v_person),
    'beirat',            (select coalesce(jsonb_agg(to_jsonb(b)), '[]') from public.beiratsmitglied b where b.person_id = v_person),
    'anliegen',          (select coalesce(jsonb_agg(to_jsonb(a)), '[]') from public.anliegen a where a.person_id = v_person),
    'lesebestaetigungen',(select coalesce(jsonb_agg(to_jsonb(l)), '[]') from public.lesebestaetigung l where l.person_id = v_person),
    'persoenliche_dokumente',
                         (select coalesce(jsonb_agg(jsonb_build_object('titel', d.titel, 'jahr', d.jahr, 'kategorie', d.kategorie)), '[]')
                          from public.dokument d where d.person_id = v_person)
  );
end $$;

-- Anliegen: Änderungszeitpunkt automatisch pflegen
create function public.setze_aktualisiert_am() returns trigger
language plpgsql set search_path = '' as $$
begin new.aktualisiert_am := now(); return new; end $$;

create trigger aktualisiert before update on public.anliegen
  for each row execute function public.setze_aktualisiert_am();

-- ---------------------------------------------------------------------
-- 6. Dateiablage (Supabase Storage), beide Buckets privat
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public) values
  ('dokumente', 'dokumente', false),
  ('anliegen-fotos', 'anliegen-fotos', false);

-- Datei darf geladen werden, wenn der zugehörige Datensatz sichtbar ist
-- (die Abfrage auf dokument/anliegen_foto unterliegt deren RLS).
create policy dokumente_lesen on storage.objects for select using (
  bucket_id = 'dokumente'
  and exists (select 1 from public.dokument d where d.datei_pfad = storage.objects.name)
);
-- Pfad-Schema für Dokumente: <weg_id>/<datei>
create policy dokumente_hochladen on storage.objects for insert with check (
  bucket_id = 'dokumente'
  and public.darf_weg_verwalten(((storage.foldername(name))[1])::uuid)
);
create policy dokumente_loeschen on storage.objects for delete using (
  bucket_id = 'dokumente'
  and public.darf_weg_verwalten(((storage.foldername(name))[1])::uuid)
);

create policy fotos_lesen on storage.objects for select using (
  bucket_id = 'anliegen-fotos'
  and exists (select 1 from public.anliegen_foto f where f.datei_pfad = storage.objects.name)
);
-- Pfad-Schema für Fotos: <person_id>/<anliegen_id>/<datei>
create policy fotos_hochladen on storage.objects for insert with check (
  bucket_id = 'anliegen-fotos'
  and (storage.foldername(name))[1] = public.meine_person_id()::text
);
