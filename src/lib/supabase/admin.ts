import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client with the **service role** key.
 * Kringgår RLS — använd endast i server actions, route handlers och RSC (aldrig i "use client").
 */
export function createSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function isSupabaseServiceConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.length && process.env.SUPABASE_SERVICE_ROLE_KEY?.length);
}
