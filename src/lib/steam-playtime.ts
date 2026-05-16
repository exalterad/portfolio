import { cache } from "react";

import { gamingGames } from "@/config/gaming-games";

/** Cache mellan requestar; fetch använder även Next data cache (revalidate). */
export const getSteamPlaytimeBySlug = cache(async (): Promise<Partial<Record<string, string>>> => {
  const key = process.env.STEAM_WEB_API_KEY;
  const steamId = process.env.STEAM_ID?.trim();
  if (!key?.length || !steamId?.length) return {};

  const slugByAppId = new Map<number, string>();
  const wanted = new Set<number>();
  for (const g of gamingGames) {
    if (g.steamAppId != null) {
      wanted.add(g.steamAppId);
      slugByAppId.set(g.steamAppId, g.slug);
    }
  }
  if (wanted.size === 0) return {};

  const url = new URL("https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/");
  url.searchParams.set("key", key);
  url.searchParams.set("steamid", steamId);
  url.searchParams.set("include_appinfo", "true");
  url.searchParams.set("format", "json");

  let data: { response?: { game_count?: number; games?: { appid: number; playtime_forever: number }[] } };
  try {
    const res = await fetch(url.toString(), { next: { revalidate: 600 } });
    if (!res.ok) return {};
    data = (await res.json()) as typeof data;
  } catch {
    return {};
  }

  const byApp = new Map<number, number>();
  for (const game of data.response?.games ?? []) {
    if (wanted.has(game.appid)) byApp.set(game.appid, game.playtime_forever);
  }

  const out: Partial<Record<string, string>> = {};
  for (const appId of wanted) {
    const slug = slugByAppId.get(appId);
    if (!slug) continue;
    const mins = byApp.get(appId);
    if (mins == null || mins <= 0) continue;
    out[slug] = formatSteamPlaytime(mins);
  }
  return out;
});

function formatSteamPlaytime(playtimeMinutes: number): string {
  const h = Math.floor(playtimeMinutes / 60);
  if (h < 1) return "Under 1 timme";
  return `${h.toLocaleString("sv-SE")} timmar`;
}
