import { cache } from "react";

export type SteamOwnedGame = {
  appid: number;
  name: string;
  playtime_forever: number;
};

type OwnedGamesResponse = {
  response?: {
    games?: {
      appid: number;
      name?: string;
      playtime_forever?: number;
    }[];
  };
};

/** Hämtar ägda spel från Steam Web API (kräver publikt bibliotek). */
export const fetchSteamOwnedGames = cache(async (): Promise<SteamOwnedGame[]> => {
  const key = process.env.STEAM_WEB_API_KEY;
  const steamId = process.env.STEAM_ID?.trim();
  if (!key?.length || !steamId?.length) return [];

  const url = new URL("https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/");
  url.searchParams.set("key", key);
  url.searchParams.set("steamid", steamId);
  url.searchParams.set("include_appinfo", "true");
  url.searchParams.set("format", "json");

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 600 } });
    if (!res.ok) return [];
    const data = (await res.json()) as OwnedGamesResponse;
    return (data.response?.games ?? [])
      .filter((g) => typeof g.name === "string" && g.name.length > 0)
      .map((g) => ({
        appid: g.appid,
        name: g.name!,
        playtime_forever: g.playtime_forever ?? 0,
      }));
  } catch {
    return [];
  }
});
