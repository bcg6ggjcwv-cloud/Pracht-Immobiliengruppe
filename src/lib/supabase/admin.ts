import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseUrl } from "./env";

/**
 * Supabase mit Generalschlüssel – umgeht alle Zugriffsregeln.
 * Nur auf dem Server und nur für Aufgaben, die ein Nutzer nicht selbst darf
 * (Einladung verschicken, Login mit Person verknüpfen). Vorher immer die
 * Berechtigung des Aufrufers mit dem normalen Client prüfen.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error("SUPABASE_SECRET_KEY fehlt in .env.local");
  return createClient(supabaseUrl, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
