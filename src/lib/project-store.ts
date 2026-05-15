import { site } from "@/config/site";

import { projectArraySchema, projectSchema, type PortfolioProject } from "@/lib/project-schema";
import { createSupabaseAdmin, isSupabaseServiceConfigured } from "@/lib/supabase/admin";

const TABLE = "portfolio_projects";
const ROW_ID = "default";
const ROWS_TABLE = "portfolio_project_rows";

/** PostgREST när tabellen inte finns eller inte laddats i cache ännu. */
function isMissingPortfolioTableError(err: { message?: string; code?: string }): boolean {
  const msg = err.message ?? "";
  if (err.code === "PGRST205") return true;
  if (msg.includes("Could not find the table") && msg.includes("portfolio_projects")) return true;
  if (msg.includes("schema cache") && msg.includes("portfolio_projects")) return true;
  return false;
}

function isMissingPortfolioProjectRowsError(err: { message?: string; code?: string }): boolean {
  const msg = err.message ?? "";
  if (err.code === "PGRST205") return true;
  if (msg.includes("Could not find the table") && msg.includes(ROWS_TABLE)) return true;
  if (msg.includes("schema cache") && msg.includes(ROWS_TABLE)) return true;
  return false;
}

async function tryReadProjectsFromRowTable(
  supabase: NonNullable<ReturnType<typeof createSupabaseAdmin>>,
): Promise<PortfolioProject[] | undefined> {
  const { data, error } = await supabase
    .from(ROWS_TABLE)
    .select("payload, sort_index")
    .order("sort_index", { ascending: true });

  if (error) {
    if (isMissingPortfolioProjectRowsError(error)) return undefined;
    if (process.env.NODE_ENV === "development") {
      console.warn(`[${ROWS_TABLE}] read:`, error.message);
    }
    return undefined;
  }
  if (!data?.length) return undefined;

  const out: PortfolioProject[] = [];
  for (const row of data) {
    const parsed = projectSchema.safeParse(row.payload as unknown);
    if (!parsed.success) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`[${ROWS_TABLE}] parse row:`, parsed.error.message);
      }
      return undefined;
    }
    out.push(parsed.data);
  }
  return out;
}

async function syncProjectRowsToSupabase(
  supabase: NonNullable<ReturnType<typeof createSupabaseAdmin>>,
  projects: PortfolioProject[],
): Promise<void> {
  const { data: existing, error: selErr } = await supabase.from(ROWS_TABLE).select("slug");
  if (selErr) {
    if (isMissingPortfolioProjectRowsError(selErr)) return;
    if (process.env.NODE_ENV === "development") {
      console.warn(`[${ROWS_TABLE}] list:`, selErr.message);
    }
    return;
  }

  const existingSlugs = new Set((existing ?? []).map((r: { slug: string }) => r.slug));
  const nextSlugs = new Set(projects.map((p) => p.slug));
  const toDelete = [...existingSlugs].filter((s) => !nextSlugs.has(s));
  if (toDelete.length) {
    const { error: delErr } = await supabase.from(ROWS_TABLE).delete().in("slug", toDelete);
    if (delErr && !isMissingPortfolioProjectRowsError(delErr) && process.env.NODE_ENV === "development") {
      console.warn(`[${ROWS_TABLE}] delete:`, delErr.message);
    }
  }

  for (let i = 0; i < projects.length; i++) {
    const p = projects[i]!;
    const { error: upErr } = await supabase.from(ROWS_TABLE).upsert(
      {
        slug: p.slug,
        payload: p,
        sort_index: i,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "slug" },
    );
    if (upErr && !isMissingPortfolioProjectRowsError(upErr) && process.env.NODE_ENV === "development") {
      console.warn(`[${ROWS_TABLE}] upsert:`, upErr.message);
    }
  }
}

/** Snapshot från `site.ts` — används när Supabase saknas eller ingen rad finns än. */
export function getStaticProjects(): PortfolioProject[] {
  const raw = JSON.parse(JSON.stringify(site.projects)) as unknown;
  return projectArraySchema.parse(raw);
}

export async function getDisplayProjects(): Promise<PortfolioProject[]> {
  const supabase = createSupabaseAdmin();
  if (!supabase) return getStaticProjects();

  const fromRows = await tryReadProjectsFromRowTable(supabase);
  if (fromRows !== undefined) return fromRows;

  const { data, error } = await supabase.from(TABLE).select("projects").eq("id", ROW_ID).maybeSingle();

  if (error) {
    if (isMissingPortfolioTableError(error)) {
      // Förväntat tills du kört supabase/sql/001_portfolio_projects.sql — använd fallback utan att spamma konsolen.
    } else if (process.env.NODE_ENV === "development") {
      console.warn("[portfolio_projects] read:", error.message);
    }
    return getStaticProjects();
  }

  if (!data || data.projects == null) return getStaticProjects();

  const parsed = projectArraySchema.safeParse(data.projects);
  if (!parsed.success) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[portfolio_projects] parse:", parsed.error.message);
    }
    return getStaticProjects();
  }

  return parsed.data;
}

export function isSupabaseConfigured(): boolean {
  return isSupabaseServiceConfigured();
}

export async function persistProjects(projects: PortfolioProject[]): Promise<void> {
  const supabase = createSupabaseAdmin();
  if (!supabase) {
    throw new Error(
      "Saknar Supabase. Sätt NEXT_PUBLIC_SUPABASE_URL och SUPABASE_SERVICE_ROLE_KEY i miljön (se env.local.example).",
    );
  }

  projectArraySchema.parse(projects);

  const { error } = await supabase.from(TABLE).upsert(
    {
      id: ROW_ID,
      projects,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) {
    if (isMissingPortfolioTableError(error)) {
      throw new Error(
        "Tabellen portfolio_projects finns inte än. Öppna Supabase → SQL Editor och kör filen supabase/sql/001_portfolio_projects.sql.",
      );
    }
    throw new Error(`Supabase: ${error.message}`);
  }

  await syncProjectRowsToSupabase(supabase, projects);
}
