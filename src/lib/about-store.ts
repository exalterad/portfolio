import { site } from "@/config/site";

import { aboutContentSchema, type PortfolioAboutContent } from "@/lib/about-schema";
import { createSupabaseAdmin, isSupabaseServiceConfigured } from "@/lib/supabase/admin";

const TABLE = "portfolio_about";
const ROW_ID = "default";

function isMissingAboutTableError(err: { message?: string; code?: string }): boolean {
  const msg = err.message ?? "";
  if (err.code === "PGRST205") return true;
  if (msg.includes("Could not find the table") && msg.includes(TABLE)) return true;
  if (msg.includes("schema cache") && msg.includes(TABLE)) return true;
  return false;
}

/** Snapshot från `site.ts` — används när Supabase saknas eller ingen rad finns än. */
export function getStaticAbout(): PortfolioAboutContent {
  const raw = JSON.parse(JSON.stringify(site.about)) as unknown;
  return aboutContentSchema.parse(raw);
}

export async function getDisplayAbout(): Promise<PortfolioAboutContent> {
  const supabase = createSupabaseAdmin();
  if (!supabase) return getStaticAbout();

  const { data, error } = await supabase.from(TABLE).select("content").eq("id", ROW_ID).maybeSingle();

  if (error) {
    if (!isMissingAboutTableError(error) && process.env.NODE_ENV === "development") {
      console.warn("[portfolio_about] read:", error.message);
    }
    return getStaticAbout();
  }

  if (!data?.content) return getStaticAbout();

  const parsed = aboutContentSchema.safeParse(data.content);
  if (!parsed.success) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[portfolio_about] parse:", parsed.error.message);
    }
    return getStaticAbout();
  }

  return parsed.data;
}

export function isAboutStorageConfigured(): boolean {
  return isSupabaseServiceConfigured();
}

export async function persistAbout(content: PortfolioAboutContent): Promise<void> {
  const supabase = createSupabaseAdmin();
  if (!supabase) {
    throw new Error(
      "Saknar Supabase. Sätt NEXT_PUBLIC_SUPABASE_URL och SUPABASE_SERVICE_ROLE_KEY i miljön (se env.local.example).",
    );
  }

  const parsed = aboutContentSchema.parse(content);

  const { error } = await supabase.from(TABLE).upsert(
    {
      id: ROW_ID,
      content: parsed,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) {
    if (isMissingAboutTableError(error)) {
      throw new Error(
        "Tabellen portfolio_about finns inte än. Öppna Supabase → SQL Editor och kör filen supabase/sql/004_portfolio_about.sql.",
      );
    }
    throw new Error(`Supabase: ${error.message}`);
  }
}
