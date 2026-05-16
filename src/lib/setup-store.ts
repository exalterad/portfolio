import { site } from "@/config/site";

import { setupContentSchema, type PortfolioSetupContent, type SetupItem } from "@/lib/setup-schema";
import { createSupabaseAdmin, isSupabaseServiceConfigured } from "@/lib/supabase/admin";

const TABLE = "portfolio_setup";
const ROW_ID = "default";

function isMissingSetupTableError(err: { message?: string; code?: string }): boolean {
  const msg = err.message ?? "";
  if (err.code === "PGRST205") return true;
  if (msg.includes("Could not find the table") && msg.includes(TABLE)) return true;
  if (msg.includes("schema cache") && msg.includes(TABLE)) return true;
  return false;
}

function itemWithId(
  item: { label: string; value: string; href?: string },
  index: number,
  prefix: string,
): SetupItem {
  return {
    id: `${prefix}-${index}`,
    label: item.label,
    value: item.value,
    href: item.href,
  };
}

function normalizeContent(raw: PortfolioSetupContent): PortfolioSetupContent {
  return {
    ...raw,
    specs: raw.specs.map((item, i) => ({
      ...item,
      id: item.id?.trim() || `spec-${i}`,
      href: item.href?.trim() || undefined,
    })),
    peripherals: {
      ...raw.peripherals,
      items: raw.peripherals.items.map((item, i) => ({
        ...item,
        id: item.id?.trim() || `peripheral-${i}`,
        href: item.href?.trim() || undefined,
      })),
    },
  };
}

/** Snapshot från `site.ts` — används när Supabase saknas eller ingen rad finns än. */
export function getStaticSetup(): PortfolioSetupContent {
  const setup = site.setup;
  return setupContentSchema.parse({
    title: setup.title,
    specs: setup.specs.map((s, i) => itemWithId(s, i, "spec")),
    peripherals: {
      title: setup.peripherals.title,
      items: setup.peripherals.items.map((s, i) => itemWithId(s, i, "peripheral")),
    },
  });
}

export async function getDisplaySetup(): Promise<PortfolioSetupContent> {
  const supabase = createSupabaseAdmin();
  if (!supabase) return getStaticSetup();

  const { data, error } = await supabase.from(TABLE).select("content").eq("id", ROW_ID).maybeSingle();

  if (error) {
    if (!isMissingSetupTableError(error) && process.env.NODE_ENV === "development") {
      console.warn("[portfolio_setup] read:", error.message);
    }
    return getStaticSetup();
  }

  if (!data?.content) return getStaticSetup();

  const parsed = setupContentSchema.safeParse(data.content);
  if (!parsed.success) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[portfolio_setup] parse:", parsed.error.message);
    }
    return getStaticSetup();
  }

  return normalizeContent(parsed.data);
}

export function isSetupStorageConfigured(): boolean {
  return isSupabaseServiceConfigured();
}

export async function persistSetup(content: PortfolioSetupContent): Promise<void> {
  const supabase = createSupabaseAdmin();
  if (!supabase) {
    throw new Error(
      "Saknar Supabase. Sätt NEXT_PUBLIC_SUPABASE_URL och SUPABASE_SERVICE_ROLE_KEY i miljön (se env.local.example).",
    );
  }

  const parsed = normalizeContent(setupContentSchema.parse(content));

  const { error } = await supabase.from(TABLE).upsert(
    {
      id: ROW_ID,
      content: parsed,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) {
    if (isMissingSetupTableError(error)) {
      throw new Error(
        "Tabellen portfolio_setup finns inte än. Öppna Supabase → SQL Editor och kör filen supabase/sql/007_portfolio_setup.sql.",
      );
    }
    throw new Error(`Supabase: ${error.message}`);
  }
}
