/** Zugangsdaten aus .env.local (siehe .env.example und docs/EINRICHTUNG.md). */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

/** Adresse des Portals, für Links in E-Mails (z. B. https://portal.pracht-immobilien.de). */
export const seitenUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const supabaseKonfiguriert = Boolean(supabaseUrl && supabaseKey);
