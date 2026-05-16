import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import type { GamingSettingsSection } from "@/config/gaming-games";
import { site } from "@/config/site";
import { CrosshairPreviewGrid } from "@/components/gaming/crosshair-preview-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getGameBySlug, getGameSlugs } from "@/lib/gaming";
import { getSteamPlaytimeBySlug } from "@/lib/steam-playtime";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PageProps = { params: Promise<{ slug: string }> };

/** Ungefärlig "höjd" för att para ihop liknande kort (fler rader / preview = tyngre). */
function gamingSectionWeight(section: GamingSettingsSection): number {
  const rows = section.rows.length;
  const previews = section.previewGrid?.length ?? 0;
  return rows + (previews > 0 ? 10 + previews : 0);
}

/** Dela sektioner i två kolumner (lägre totalhöjd = färre gluggar än CSS Grid-rader). */
function gamingSplitIntoTwoColumns(
  rest: GamingSettingsSection[],
  original: GamingSettingsSection[],
): [GamingSettingsSection[], GamingSettingsSection[]] {
  if (rest.length === 0) return [[], []];
  const byWeight = [...rest].sort((a, b) => gamingSectionWeight(b) - gamingSectionWeight(a));
  const left: GamingSettingsSection[] = [];
  const right: GamingSettingsSection[] = [];
  let leftW = 0;
  let rightW = 0;
  for (const s of byWeight) {
    const w = gamingSectionWeight(s);
    if (leftW <= rightW) {
      left.push(s);
      leftW += w;
    } else {
      right.push(s);
      rightW += w;
    }
  }
  const ix = (x: GamingSettingsSection) => original.indexOf(x);
  left.sort((a, b) => ix(a) - ix(b));
  right.sort((a, b) => ix(a) - ix(b));
  return [left, right];
}

function GamingSettingsCard({ section }: { section: GamingSettingsSection }) {
  return (
    <Card className="h-fit w-full gap-0 py-0 glass-panel border-white/10 bg-white/[0.03] transition hover:border-primary/30">
      <CardHeader className="px-4 pb-2 pt-3">
        <CardTitle className="text-sm font-medium tracking-wide text-muted-foreground uppercase">{section.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {section.previewGrid?.length ? (
          <div
            className={cn(
              "px-3 pt-0 pb-3 sm:px-4 sm:pb-3",
              section.rows.length > 0 && "border-b border-white/10",
            )}
          >
            <CrosshairPreviewGrid items={section.previewGrid} />
          </div>
        ) : null}
        {section.rows.length > 0 ? (
          <dl
            className={cn(
              "divide-y divide-white/10 pb-3",
              !section.previewGrid?.length && "border-t border-white/10",
            )}
          >
            {section.rows.map((row) => (
              <div
                key={row.label}
                className="grid gap-1.5 px-4 py-3 sm:grid-cols-[minmax(0,9.5rem)_1fr] sm:items-start sm:gap-5"
              >
                <dt className="text-[0.65rem] font-medium tracking-[0.2em] text-muted-foreground uppercase">{row.label}</dt>
                <dd className="text-sm leading-relaxed text-foreground sm:text-base sm:font-medium">
                  {row.value.includes(";") || row.value.length > 80 ? (
                    <code className="block whitespace-pre-wrap break-all rounded-lg border border-white/10 bg-black/40 px-3 py-2.5 text-xs font-normal leading-relaxed text-cyan-100/90">
                      {row.value}
                    </code>
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </CardContent>
    </Card>
  );
}

export const revalidate = 600;

export async function generateStaticParams() {
  return getGameSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) return { title: "Spel" };
  return {
    title: `${game.title} · Gaming · ${site.name}`,
    description: game.summary,
    openGraph: {
      title: `${game.title} · ${site.name}`,
      description: game.summary,
      type: "article",
    },
  };
}

export default async function GamingGamePage({ params }: PageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) notFound();

  const steamPlaytimes = await getSteamPlaytimeBySlug();
  const playtimeLabel = steamPlaytimes[slug] ?? game.playtime;

  const wideSections = game.settingsSections.filter((s) => s.previewGrid?.length);
  const restSections = game.settingsSections.filter((s) => !s.previewGrid?.length);
  const [leftCol, rightCol] = gamingSplitIntoTwoColumns(restSections, game.settingsSections);

  return (
    <div className="relative z-10 w-full px-4 pb-24 pt-8 sm:px-6 sm:pt-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 border-b border-white/10 pb-8">
          <Link
            href="/#gaming"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "-ml-2 w-fit gap-1.5 text-muted-foreground hover:text-foreground",
            )}
          >
            <ArrowLeft className="size-4" />
            Tillbaka till Gaming
          </Link>
          <h1 className="mt-5 font-[family-name:var(--font-orbitron)] text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {game.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{game.tagline}</p>
          <p
            className="mt-3 inline-flex w-fit rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1.5 text-xs font-medium tabular-nums tracking-wide text-muted-foreground"
            aria-label={`Speltid: ${playtimeLabel}`}
          >
            {playtimeLabel}
          </p>
        </div>

        {game.heroStats && game.heroStats.length > 0 ? (
          <dl className="mx-auto mb-8 grid w-full max-w-md grid-cols-3 gap-6 pt-2 text-center sm:gap-10 sm:pt-4">
            {game.heroStats.slice(0, 3).map((stat) => (
              <div key={stat.label}>
                <dt className="text-[0.65rem] font-medium tracking-[0.2em] text-muted-foreground uppercase">{stat.label}</dt>
                <dd className="mt-2 font-[family-name:var(--font-orbitron)] text-xl font-semibold text-foreground sm:text-2xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="flex flex-col gap-3 sm:gap-4">
          {wideSections.map((section) => (
            <GamingSettingsCard key={section.id} section={section} />
          ))}
          {restSections.length > 0 ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
              <div className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4">
                {leftCol.map((section) => (
                  <GamingSettingsCard key={section.id} section={section} />
                ))}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4">
                {rightCol.map((section) => (
                  <GamingSettingsCard key={section.id} section={section} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
