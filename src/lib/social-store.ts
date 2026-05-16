import { site } from "@/config/site";

import {
  socialContentSchema,
  type PortfolioSocialContent,
  type SocialIconId,
  type SocialLink,
} from "@/lib/social-schema";
import { createSupabaseAdmin, isSupabaseServiceConfigured } from "@/lib/supabase/admin";

const TABLE = "portfolio_social";
const ROW_ID = "default";

function isMissingSocialTableError(err: { message?: string; code?: string }): boolean {
  const msg = err.message ?? "";
  if (err.code === "PGRST205") return true;
  if (msg.includes("Could not find the table") && msg.includes(TABLE)) return true;
  if (msg.includes("schema cache") && msg.includes(TABLE)) return true;
  return false;
}

function linkFromSite(
  item: { name: string; href: string; icon: string; handle?: string },
  index: number,
): SocialLink {
  return {
    id: `social-${index}`,
    name: item.name,
    href: item.href,
    icon: item.icon as SocialIconId,
    handle: item.handle,
  };
}

function normalizeContent(raw: PortfolioSocialContent): PortfolioSocialContent {
  return {
    ...raw,
    links: raw.links.map((link, i) => ({
      ...link,
      id: link.id?.trim() || `social-${i}`,
      name: link.name.trim(),
      href: link.href.trim(),
      handle: link.handle?.trim() || undefined,
    })),
  };
}

/** Snapshot från `site.ts` — används när Supabase saknas eller ingen rad finns än. */
export function getStaticSocial(): PortfolioSocialContent {
  return socialContentSchema.parse({
    eyebrow: "Socialt",
    heading: { before: "Häng med ", accent: "live" },
    description: "Stream, kod och DM — välj kanal så öppnas den i en ny flik.",
    links: site.social.map((s, i) => linkFromSite(s, i)),
  });
}

export async function getDisplaySocial(): Promise<PortfolioSocialContent> {
  const supabase = createSupabaseAdmin();
  if (!supabase) return getStaticSocial();

  const { data, error } = await supabase.from(TABLE).select("content").eq("id", ROW_ID).maybeSingle();

  if (error) {
    if (!isMissingSocialTableError(error) && process.env.NODE_ENV === "development") {
      console.warn("[portfolio_social] read:", error.message);
    }
    return getStaticSocial();
  }

  if (!data?.content) return getStaticSocial();

  const parsed = socialContentSchema.safeParse(data.content);
  if (!parsed.success) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[portfolio_social] parse:", parsed.error.message);
    }
    return getStaticSocial();
  }

  return normalizeContent(parsed.data);
}

export function isSocialStorageConfigured(): boolean {
  return isSupabaseServiceConfigured();
}

export async function persistSocial(content: PortfolioSocialContent): Promise<void> {
  const supabase = createSupabaseAdmin();
  if (!supabase) {
    throw new Error(
      "Saknar Supabase. Sätt NEXT_PUBLIC_SUPABASE_URL och SUPABASE_SERVICE_ROLE_KEY i miljön (se env.local.example).",
    );
  }

  const parsed = normalizeContent(socialContentSchema.parse(content));

  const { error } = await supabase.from(TABLE).upsert(
    {
      id: ROW_ID,
      content: parsed,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) {
    if (isMissingSocialTableError(error)) {
      throw new Error(
        "Tabellen portfolio_social finns inte än. Öppna Supabase → SQL Editor och kör filen supabase/sql/008_portfolio_social.sql.",
      );
    }
    throw new Error(`Supabase: ${error.message}`);
  }
}
