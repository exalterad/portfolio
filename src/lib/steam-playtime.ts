import { cache } from "react";

import { getConfiguredGames } from "@/lib/gaming";
import { getSteamSyncedLibraryGames } from "@/lib/steam-library";
import { fetchSteamOwnedGames } from "@/lib/steam-owned-games";
import { formatSteamPlaytime } from "@/lib/steam-utils";

/** Cache mellan requestar; fetch använder även Next data cache (revalidate). */
export const getSteamPlaytimeBySlug = cache(async (): Promise<Partial<Record<string, string>>> => {
  const owned = await fetchSteamOwnedGames();
  if (owned.length === 0) return {};

  const slugByAppId = new Map<number, string>();
  for (const g of await getConfiguredGames()) {
    if (g.steamAppId != null) slugByAppId.set(g.steamAppId, g.slug);
  }
  for (const g of await getSteamSyncedLibraryGames()) {
    if (g.steamAppId != null) slugByAppId.set(g.steamAppId, g.slug);
  }

  const byApp = new Map(owned.map((g) => [g.appid, g.playtime_forever]));
  const out: Partial<Record<string, string>> = {};

  for (const [appId, slug] of slugByAppId) {
    const mins = byApp.get(appId);
    if (mins == null || mins <= 0) continue;
    out[slug] = formatSteamPlaytime(mins);
  }

  return out;
});
