import { site } from "@/config/site";

import {
  experienceContentSchema,
  type ExperienceMilestone,
  type PortfolioExperienceContent,
} from "@/lib/experience-schema";
import { createSupabaseAdmin, isSupabaseServiceConfigured } from "@/lib/supabase/admin";

const TABLE = "portfolio_experience";
const ROW_ID = "default";

function isMissingExperienceTableError(err: { message?: string; code?: string }): boolean {
  const msg = err.message ?? "";
  if (err.code === "PGRST205") return true;
  if (msg.includes("Could not find the table") && msg.includes(TABLE)) return true;
  if (msg.includes("schema cache") && msg.includes(TABLE)) return true;
  return false;
}

function milestoneWithId(m: { period: string; title: string; detail?: string }, index: number): ExperienceMilestone {
  return {
    id: `milestone-${index}`,
    period: m.period,
    title: m.title,
    detail: m.detail ?? "",
  };
}

function normalizeContent(raw: PortfolioExperienceContent): PortfolioExperienceContent {
  return {
    ...raw,
    milestones: raw.milestones.map((m, i) => ({
      ...m,
      id: m.id?.trim() || `milestone-${i}`,
      detail: m.detail ?? "",
    })),
  };
}

/** Snapshot från `site.ts` — används när Supabase saknas eller ingen rad finns än. */
export function getStaticExperience(): PortfolioExperienceContent {
  const exp = site.experience;
  const content: PortfolioExperienceContent = {
    eyebrow: exp.eyebrow,
    heading: { ...exp.heading },
    milestones: exp.milestones.map(milestoneWithId),
  };
  return experienceContentSchema.parse(content);
}

export async function getDisplayExperience(): Promise<PortfolioExperienceContent> {
  const supabase = createSupabaseAdmin();
  if (!supabase) return getStaticExperience();

  const { data, error } = await supabase.from(TABLE).select("content").eq("id", ROW_ID).maybeSingle();

  if (error) {
    if (!isMissingExperienceTableError(error) && process.env.NODE_ENV === "development") {
      console.warn("[portfolio_experience] read:", error.message);
    }
    return getStaticExperience();
  }

  if (!data?.content) return getStaticExperience();

  const parsed = experienceContentSchema.safeParse(data.content);
  if (!parsed.success) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[portfolio_experience] parse:", parsed.error.message);
    }
    return getStaticExperience();
  }

  return normalizeContent(parsed.data);
}

export function isExperienceStorageConfigured(): boolean {
  return isSupabaseServiceConfigured();
}

export async function persistExperience(content: PortfolioExperienceContent): Promise<void> {
  const supabase = createSupabaseAdmin();
  if (!supabase) {
    throw new Error(
      "Saknar Supabase. Sätt NEXT_PUBLIC_SUPABASE_URL och SUPABASE_SERVICE_ROLE_KEY i miljön (se env.local.example).",
    );
  }

  const parsed = normalizeContent(experienceContentSchema.parse(content));

  const { error } = await supabase.from(TABLE).upsert(
    {
      id: ROW_ID,
      content: parsed,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) {
    if (isMissingExperienceTableError(error)) {
      throw new Error(
        "Tabellen portfolio_experience finns inte än. Öppna Supabase → SQL Editor och kör filen supabase/sql/005_portfolio_experience.sql.",
      );
    }
    throw new Error(`Supabase: ${error.message}`);
  }
}
