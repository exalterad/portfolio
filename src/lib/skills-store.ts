import { site } from "@/config/site";

import {
  skillsContentSchema,
  type PortfolioSkillsContent,
  type SkillGroup,
  type SkillItem,
} from "@/lib/skills-schema";
import { createSupabaseAdmin, isSupabaseServiceConfigured } from "@/lib/supabase/admin";

const TABLE = "portfolio_skills";
const ROW_ID = "default";

function isMissingSkillsTableError(err: { message?: string; code?: string }): boolean {
  const msg = err.message ?? "";
  if (err.code === "PGRST205") return true;
  if (msg.includes("Could not find the table") && msg.includes(TABLE)) return true;
  if (msg.includes("schema cache") && msg.includes(TABLE)) return true;
  return false;
}

function itemFromSite(name: string, index: number, groupPrefix: string): SkillItem {
  return {
    id: `${groupPrefix}-item-${index}`,
    name,
  };
}

function groupFromSite(
  group: { title: string; items: readonly string[] },
  groupIndex: number,
): SkillGroup {
  const prefix = `group-${groupIndex}`;
  return {
    id: prefix,
    title: group.title,
    items: group.items.map((name, i) => itemFromSite(name, i, prefix)),
  };
}

function normalizeContent(raw: PortfolioSkillsContent): PortfolioSkillsContent {
  return {
    ...raw,
    eyebrow: raw.eyebrow.trim(),
    description: raw.description.trim(),
    heading: {
      before: raw.heading.before,
      accent: raw.heading.accent.trim(),
    },
    groups: raw.groups.map((group, gi) => ({
      ...group,
      id: group.id?.trim() || `group-${gi}`,
      title: group.title.trim(),
      items: group.items.map((item, ii) => ({
        ...item,
        id: item.id?.trim() || `group-${gi}-item-${ii}`,
        name: item.name.trim(),
      })),
    })),
  };
}

/** Snapshot från `site.ts` — används när Supabase saknas eller ingen rad finns än. */
export function getStaticSkills(): PortfolioSkillsContent {
  const { eyebrow, heading, description, groups } = site.skills;
  return skillsContentSchema.parse({
    eyebrow,
    heading,
    description,
    groups: groups.map((g, i) => groupFromSite(g, i)),
  });
}

export async function getDisplaySkills(): Promise<PortfolioSkillsContent> {
  const supabase = createSupabaseAdmin();
  if (!supabase) return getStaticSkills();

  const { data, error } = await supabase.from(TABLE).select("content").eq("id", ROW_ID).maybeSingle();

  if (error) {
    if (!isMissingSkillsTableError(error) && process.env.NODE_ENV === "development") {
      console.warn("[portfolio_skills] read:", error.message);
    }
    return getStaticSkills();
  }

  if (!data?.content) return getStaticSkills();

  const parsed = skillsContentSchema.safeParse(data.content);
  if (!parsed.success) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[portfolio_skills] parse:", parsed.error.message);
    }
    return getStaticSkills();
  }

  return normalizeContent(parsed.data);
}

export function isSkillsStorageConfigured(): boolean {
  return isSupabaseServiceConfigured();
}

export async function persistSkills(content: PortfolioSkillsContent): Promise<void> {
  const supabase = createSupabaseAdmin();
  if (!supabase) {
    throw new Error(
      "Saknar Supabase. Sätt NEXT_PUBLIC_SUPABASE_URL och SUPABASE_SERVICE_ROLE_KEY i miljön (se env.local.example).",
    );
  }

  const parsed = normalizeContent(skillsContentSchema.parse(content));

  const { error } = await supabase.from(TABLE).upsert(
    {
      id: ROW_ID,
      content: parsed,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) {
    if (isMissingSkillsTableError(error)) {
      throw new Error(
        "Tabellen portfolio_skills finns inte än. Öppna Supabase → SQL Editor och kör filen supabase/sql/009_portfolio_skills.sql.",
      );
    }
    throw new Error(`Supabase: ${error.message}`);
  }
}
