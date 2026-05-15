import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Anon-nyckel + cookies — använd i server actions, RSC och efter middleware har uppdaterat session. */
export async function createSupabaseSessionClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url?.length || !anon?.length) {
    throw new Error("Saknar NEXT_PUBLIC_SUPABASE_URL eller NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  const cookieStore = await cookies();

  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          /* Server Component utan muterbar cookie — ignoreras */
        }
      },
    },
  });
}
