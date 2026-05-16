import { gamingGames, gamingLayout } from "@/config/gaming-games";
import { gamingContentSchema, type PortfolioGamingContent } from "@/lib/gaming-schema";
import { createSupabaseAdmin, isSupabaseServiceConfigured } from "@/lib/supabase/admin";

const TABLE = "portfolio_gaming";
const ROW_ID = "default";

function isMissingGamingTableError(err: { message?: string; code?: string }): boolean {
  const msg = err.message ?? "";
  if (err.code === "PGRST205") return true;
  if (msg.includes("Could not find the table") && msg.includes(TABLE)) return true;
  if (msg.includes("schema cache") && msg.includes(TABLE)) return true;
  return false;
}

/** Standard från `gaming-games.ts` när Supabase saknas eller ingen rad finns. */
export function getStaticGaming(): PortfolioGamingContent {
  return gamingContentSchema.parse({
    layout: {
      mainGameSlug: gamingLayout.mainGameSlug,
      top3Slugs: [...gamingLayout.top3Slugs],
      steamLibrary: {
        enabled: true,
        maxGames: gamingLayout.steamLibrary.maxGames,
        minPlaytimeMinutes: gamingLayout.steamLibrary.minPlaytimeMinutes,
      },
    },
    games: gamingGames,
  });
}

export async function getDisplayGaming(): Promise<PortfolioGamingContent> {
  const supabase = createSupabaseAdmin();
  if (!supabase) return getStaticGaming();

  const { data, error } = await supabase.from(TABLE).select("content").eq("id", ROW_ID).maybeSingle();

  if (error) {
    if (!isMissingGamingTableError(error) && process.env.NODE_ENV === "development") {
      console.warn("[portfolio_gaming] read:", error.message);
    }
    return getStaticGaming();
  }

  if (!data?.content) return getStaticGaming();

  const parsed = gamingContentSchema.safeParse(data.content);
  if (!parsed.success) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[portfolio_gaming] parse:", parsed.error.message);
    }
    return getStaticGaming();
  }

  return parsed.data;
}

export function isGamingStorageConfigured(): boolean {
  return isSupabaseServiceConfigured();
}

export async function persistGaming(content: PortfolioGamingContent): Promise<void> {
  const supabase = createSupabaseAdmin();
  if (!supabase) {
    throw new Error(
      "Saknar Supabase. Sätt NEXT_PUBLIC_SUPABASE_URL och SUPABASE_SERVICE_ROLE_KEY i miljön (se env.local.example).",
    );
  }

  const parsed = gamingContentSchema.parse(content);

  const { error } = await supabase.from(TABLE).upsert(
    {
      id: ROW_ID,
      content: parsed,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) {
    if (isMissingGamingTableError(error)) {
      throw new Error(
        "Tabellen portfolio_gaming finns inte än. Öppna Supabase → SQL Editor och kör filen supabase/sql/006_portfolio_gaming.sql.",
      );
    }
    throw new Error(`Supabase: ${error.message}`);
  }
}
