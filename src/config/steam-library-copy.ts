/** Tagline, summary m.m. för Steam-syncade biblioteksspel (nyckel = app-id). */
export type SteamLibraryCopy = {
  tagline: string;
  summary: string;
  previewBadge?: string;
  tags?: string[];
};

export const steamLibraryCopyByAppId: Record<number, SteamLibraryCopy> = {
  518790: {
    tagline: "Öppen terräng, spor och tyst jakt.",
    summary: "theHunter — långa pass i skogen, spårning och troféer när jag vill varva ner.",
    previewBadge: "Jakt",
    tags: ["Sim", "Öppen värld", "Steam"],
  },
  621060: {
    tagline: "Bygg, benchmarka, optimera — nördigt på rätt sätt.",
    summary: "PC Building Simulator — testa riggar och komponenter utan att skruva i verkligheten.",
    previewBadge: "Sim",
    tags: ["Sim", "Bygge", "Steam"],
  },
  1506830: {
    tagline: "Säsonger, Ultimate Team och kvällsmatcher.",
    summary: "FIFA 22 — fotboll när det ska vara snabbt in, en match till.",
    previewBadge: "Sport",
    tags: ["Sport", "Fotboll", "Steam"],
  },
  1134570: {
    tagline: "Formel 1 — kurvor, strategi och racehelger.",
    summary: "F1 2021 — karriär, tidtagning och helger som känns som riktiga Grand Prix.",
    previewBadge: "Racing",
    tags: ["Racing", "Sim", "Steam"],
  },
  1811260: {
    tagline: "Nästa års säsong — samma fix, nya lag.",
    summary: "FIFA 23 — fortsatt fokus på klubbläge och matcher online.",
    previewBadge: "Sport",
    tags: ["Sport", "Fotboll", "Steam"],
  },
  1938090: {
    tagline: "Snabb action när det ska gå fort.",
    summary: "Call of Duty — multiplayer och intensiva rundor mellan andra titlar.",
    previewBadge: "FPS",
    tags: ["FPS", "Action", "Steam"],
  },
  2195250: {
    tagline: "Fotboll online och karriär — ett sätt till.",
    summary: "EA SPORTS FC 24 — division, klubb och helgmatcher med kompisar.",
    previewBadge: "Sport",
    tags: ["Sport", "Fotboll", "Steam"],
  },
  227300: {
    tagline: "Långa körningar, podradio och europeiska vägar.",
    summary: "Euro Truck Simulator 2 — avslappnat tempo och leveranser i egen takt.",
    previewBadge: "Sim",
    tags: ["Sim", "Racing", "Steam"],
  },
  252950: {
    tagline: "Bilar som fotboll — svårt att lägga av.",
    summary: "Rocket League — mekanik, aerials och snabba matcher som fortfarande håller.",
    previewBadge: "Sport",
    tags: ["Sport", "Arcade", "Steam"],
  },
  928600: {
    tagline: "Klassisk F1-känsla innan den nya motorn.",
    summary: "F1 2019 — nostalgisk racing när jag vill tillbaka till ett äldre grid.",
    previewBadge: "Racing",
    tags: ["Racing", "Sim", "Steam"],
  },
  3405690: {
    tagline: "Senaste FC — klubb, division och helger.",
    summary: "EA SPORTS FC 26 — där jag lägger mest tid i fotboll just nu.",
    previewBadge: "Sport",
    tags: ["Sport", "Fotboll", "Steam"],
  },
  2669320: {
    tagline: "Mellan säsongerna — fortfarande lika beroendeframkallande.",
    summary: "EA SPORTS FC 25 — bro mellan årens Ultimate Team och klubbläge.",
    previewBadge: "Sport",
    tags: ["Sport", "Fotboll", "Steam"],
  },
};
