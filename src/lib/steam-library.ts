import { cache } from "react";

import type { GamingGame } from "@/lib/gaming-schema";
import { getDisplayGaming } from "@/lib/gaming-store";
import { steamLibraryCopyByAppId } from "@/config/steam-library-copy";
import { fetchSteamOwnedGames } from "@/lib/steam-owned-games";
import {
  formatSteamPlaytime,
  slugifySteamTitle,
  steamHeaderImageUrl,
  steamStoreUrl,
  uniqueSteamSlug,
} from "@/lib/steam-utils";

function buildSteamLibraryGame(owned: { appid: number; name: string; playtime_forever: number }, slug: string): GamingGame {
  const playtime = formatSteamPlaytime(owned.playtime_forever);
  const copy = steamLibraryCopyByAppId[owned.appid];
  const title = owned.name;
  return {
    slug,
    title,
    tagline: copy?.tagline ?? `Ett spel jag lagt tid i — ${title}.`,
    summary: copy?.summary ?? `${title} — finns i biblioteket med speltid från Steam.`,
    previewBadge: copy?.previewBadge ?? "Bibliotek",
    image: steamHeaderImageUrl(owned.appid),
    imageAlt: `${title} — Steam-omslag`,
    tags: copy?.tags ?? ["Steam"],
    steamAppId: owned.appid,
    playtime,
    settingsSections: [
      {
        id: "steam",
        title: "Steam",
        rows: [
          { label: "Speltid", value: playtime },
          { label: "Store", value: steamStoreUrl(owned.appid) },
        ],
      },
    ],
  };
}

/**
 * Topp N ägda spel (efter speltid) som inte redan finns i manuell konfiguration.
 * Används för /gaming-biblioteket.
 */
export const getSteamSyncedLibraryGames = cache(async (): Promise<GamingGame[]> => {
  const { layout, games } = await getDisplayGaming();
  const { enabled, maxGames, minPlaytimeMinutes } = layout.steamLibrary;
  if (!enabled || maxGames <= 0) return [];

  const owned = await fetchSteamOwnedGames();
  if (owned.length === 0) return [];

  const excludedAppIds = new Set<number>();
  for (const g of games) {
    if (g.steamAppId != null) excludedAppIds.add(g.steamAppId);
  }
  const reservedSlugs = new Set(games.map((g) => g.slug));

  const candidates = owned
    .filter((g) => !excludedAppIds.has(g.appid))
    .filter((g) => g.playtime_forever >= minPlaytimeMinutes)
    .sort((a, b) => b.playtime_forever - a.playtime_forever)
    .slice(0, maxGames);

  const out: GamingGame[] = [];
  const usedSlugs = new Set(reservedSlugs);

  for (const game of candidates) {
    const baseSlug = slugifySteamTitle(game.name, game.appid);
    const slug = uniqueSteamSlug(baseSlug, game.appid, usedSlugs);
    usedSlugs.add(slug);
    out.push(buildSteamLibraryGame(game, slug));
  }

  return out;
});
