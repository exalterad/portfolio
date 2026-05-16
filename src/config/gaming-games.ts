/** Spel i Gaming-sektionen + detaljsidor under /gaming/[slug]. Redigera fritt. */

export type GamingSettingRow = {
  label: string;
  value: string;
};

/** Förhandsbilder (t.ex. crosshair). Vid `copyCommand` kopieras texten till urklipp vid klick. */
export type GamingPreviewImage = {
  image: string;
  alt: string;
  copyCommand?: string;
  /** Ram + etikett för det du t.ex. kör mest (max ett per rutnät rekommenderas). */
  highlight?: boolean;
  /** Text på highlight-märket. Standard: "Mest använt". */
  highlightLabel?: string;
};

export type GamingSettingsSection = {
  id: string;
  title: string;
  rows: GamingSettingRow[];
  /** Valfritt rutnät med bilder ovanför tabellen (t.ex. olika crosshair-varianter). */
  previewGrid?: GamingPreviewImage[];
};

export type GamingGame = {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  /** Kort etikett på kortet (t.ex. rank eller “Huvudspel”) */
  previewBadge: string;
  image: string;
  imageAlt: string;
  tags: string[];
  /** Steam store app-id — hämtar speltid via Web API om STEAM_WEB_API_KEY + STEAM_ID finns. */
  steamAppId?: number;
  /** Total speltid på gaming-kortet under titeln (reserv om Steam saknas). */
  playtime: string;
  /** Valfri rad som hero (Status / Age / Base): tre kolumner med label + stort värde. */
  heroStats?: { label: string; value: string }[];
  settingsSections: GamingSettingsSection[];
};

export const gamingGames: GamingGame[] = [
  {
    slug: "counter-strike-2",
    title: "Counter-Strike 2",
    tagline: "Competitive — aim, ljudbild och rond för rond.",
    summary: "Mitt huvudspel just nu. Här hittar du rank, känsla, crosshair och övriga inställningar jag kör med.",
    previewBadge: "Huvudspel",
    /** `cb` höj när du byter fil men behåller samma namn — undvik gammal webbläsar-/CDN-cache. */
    image: "/gaming/covers/counter-strike-2.png?cb=4",
    imageAlt: "Counter-Strike 2 — liggande omslag med CT- och T-figurer, diagonal bakgrund och logotyp längst ner",
    tags: ["FPS", "Competitive", "Steam"],
    steamAppId: 730,
    playtime: "2700+ timmar",
    heroStats: [
      { label: "Faceit", value: "Level 10" },
      { label: "Roll", value: "Entry Fragger" },
      { label: "Premier", value: "25k+" },
    ],
    settingsSections: [
      {
        id: "mouse-settings",
        title: "Mouse Settings",
        rows: [
          { label: "DPI", value: "800" },
          { label: "Muskänslighet", value: "1.8" },
          { label: "Zoom Sensitivity Multiplier", value: "1" },
          { label: "Pollingfrekvens", value: "1000 Hz" },
          { label: "m_yaw", value: "0.022" },
        ],
      },
      {
        id: "grafik",
        title: "Grafikinställningar",
        rows: [
          { label: "Ljusstyrka", value: "33 %" },
          { label: "Scaling mode", value: "Stretched" },
          { label: "Bildförhållande", value: "4:3" },
          { label: "Upplösning", value: "1280×960" },
          { label: "Visningsläge", value: "Helskärm" },
          { label: "Bildfrekvens", value: "240 Hz" },
        ],
      },
      {
        id: "avancerad-video",
        title: "Avancerad video",
        rows: [
          { label: "Förstärk kontrasten på spelare", value: "Aktiverad" },
          { label: "V-Sync", value: "Inaktiverad" },
          { label: "Multisampling-kantutjämningsläge", value: "CMAA2" },
          { label: "Global skuggkvalitet", value: "Låg" },
          { label: "Detaljnivå för modeller/textur", value: "Medium" },
          { label: "Texturfiltreringsläge", value: "Anisotropisk 4X" },
          { label: "Shader-detaljnivå", value: "Låg" },
          { label: "Partikeldetaljer", value: "Låg" },
          { label: "Ambient Occlusion", value: "Inaktiverad" },
          { label: "High Dynamic Range", value: "Kvalitet" },
          { label: "FidelityFX Super Resolution", value: "Inaktiverad (högsta kvalitet)" },
          { label: "NVIDIA Reflex – låg latens", value: "Aktiverad" },
        ],
      },
      {
        id: "crosshair",
        title: "Crosshair",
        previewGrid: [
          {
            image: "/gaming/crosshairs/crosshair-1.png",
            alt: "Crosshair: vit prick på svart bakgrund",
            copyCommand: "CSGO-9dMca-LqMQP-O5sp9-oVNP8-VH5mA",
          },
          {
            image: "/gaming/crosshairs/crosshair-2.png",
            alt: "Crosshair: gult kors med litet mittgap",
            copyCommand: "CSGO-bE7fR-ZGH8c-kv2Zd-FjZuc-32NQC",
            highlight: true,
          },
          {
            image: "/gaming/crosshairs/crosshair-3.png",
            alt: "Crosshair: litet gult kors runt centrum",
            copyCommand: "CSGO-5wO6P-KhaG6-e7ZpN-X45dU-BBZ2Q",
          },
          {
            image: "/gaming/crosshairs/crosshair-4.png",
            alt: "Crosshair: liten vit prick (dot)",
            copyCommand: "CSGO-t4Shu-ZhrPW-WFwuS-UNOvS-5HwLA",
          },
          {
            image: "/gaming/crosshairs/crosshair-5.png",
            alt: "Crosshair: grönt kors med mittgap och svart outline",
            copyCommand: "CSGO-xbpe2-E24RJ-YXNuO-pQvt8-ppNAK",
          },
          {
            image: "/gaming/crosshairs/crosshair-6.png",
            alt: "Crosshair: vitt kort kors med mittgap",
            copyCommand: "CSGO-FNOLG-fQcPX-V8P7K-VqtAf-ZbJaA",
          },
        ],
        rows: [],
      },
      {
        id: "viewmodel",
        title: "Viewmodel",
        rows: [
          {
            label: "Kommandon",
            value: "viewmodel_fov 60; viewmodel_offset_y 2; viewmodel_offset_z -1.7; cl_prefer_lefthanded true",
          },
        ],
      },
      {
        id: "hud",
        title: "HUD",
        rows: [
          {
            label: "Kommandon",
            value: "cl_hud_color 11; cl_showloadout true; safezonex 1; safezoney 1",
          },
        ],
      },
      {
        id: "radar",
        title: "Radar",
        rows: [
          {
            label: "Kommandon",
            value:
              "cl_hud_radar_scale 1.197891; cl_radar_scale 0.7; cl_radar_always_centered true; cl_radar_rotate true; cl_radar_icon_scale_min 0.6",
          },
        ],
      },
      {
        id: "startalternativ",
        title: "Startalternativ",
        rows: [{ label: "Kommandon", value: "+exec autoexec.cfg" }],
      },
    ],
  },
  {
    slug: "red-dead-redemption-2",
    title: "Red Dead Redemption 2",
    tagline: "Berättelse, värld och stämning.",
    summary: "Topp bland singleplayer-upplevelser — här är hur jag spelar och vad jag kör med.",
    previewBadge: "Topp 1",
    /** `cb` höj vid byte av fil med samma namn. */
    image: "/gaming/covers/red-dead-redemption-2.png?cb=3",
    imageAlt: "Red Dead Redemption 2 — omslag med gäng i siluett mot sol och röd bakgrund med titel",
    tags: ["Singleplayer", "Berättelse", "Rockstar"],
    steamAppId: 1174180,
    playtime: "50+ timmar",
    settingsSections: [
      {
        id: "progress",
        title: "Framsteg & stil",
        rows: [
          { label: "Kapitel / completion", value: "Fyll i var du är i berättelsen" },
          { label: "Svårighetsgrad", value: "Normal / hard — efter smak" },
          { label: "Spelstil", value: "Utforska först / story i fokus" },
        ],
      },
      {
        id: "settings",
        title: "Inställningar",
        rows: [
          { label: "Grafikprofil", value: "Balanserat / kvalitet — GPU-anpassat" },
          { label: "Kontroll", value: "Handkontroll / mus+ tangentbord" },
          { label: "HDR / raytracing", value: "På / av — kort motivering" },
        ],
      },
    ],
  },
  {
    slug: "hogwarts-legacy",
    title: "Hogwarts Legacy",
    tagline: "Magisk värld att fastna i.",
    summary: "Utforska slottet och omgivningarna — mina val och inställningar.",
    previewBadge: "Topp 2",
    /** `cb` höj vid byte av fil med samma namn. */
    image: "/gaming/covers/hogwarts-legacy.png?cb=2",
    imageAlt: "Hogwarts Legacy — omslag med elev mot slottsdal, gyllene titel, drake och uggla i skyn",
    tags: ["RPG", "Harry Potter", "Singleplayer"],
    steamAppId: 990080,
    playtime: "90+ timmar",
    settingsSections: [
      {
        id: "character",
        title: "Karaktär & hus",
        rows: [
          { label: "Hus", value: "Slytherin / Gryffindor / …" },
          { label: "Svårighetsgrad", value: "Normal" },
          { label: "Fokus i spelet", value: "Uppdrag / samlande / utforskning" },
        ],
      },
      {
        id: "tech",
        title: "Teknik",
        rows: [
          { label: "Grafik", value: "Upplösning, DLSS/FSR, raytracing" },
          { label: "Kontroll", value: "Handkontroll rekommenderas" },
        ],
      },
    ],
  },
  {
    slug: "a-way-out",
    title: "A Way Out",
    tagline: "Co-op rakt igenom med rätt kompis.",
    summary: "Kort om hur vi spelade och vilka inställningar som funkade bra.",
    previewBadge: "Topp 3",
    /** `cb` höj vid byte av fil med samma namn. */
    image: "/gaming/covers/a-way-out.png?cb=2",
    imageAlt: "A Way Out — omslag med två protagonister rygg mot rygg, stängsel, strålkastare och gul titel",
    tags: ["Co-op", "Split screen", "EA Originals"],
    steamAppId: 1222700,
    playtime: "6+ timmar",
    settingsSections: [
      {
        id: "coop",
        title: "Co-op",
        rows: [
          { label: "Spelat med", value: "Vän / partner — valfritt namn" },
          { label: "Plattform", value: "Steam Remote Play / lokalt / online" },
        ],
      },
      {
        id: "settings",
        title: "Inställningar",
        rows: [
          { label: "Språk", value: "Svenska / engelska" },
          { label: "Undertexter", value: "På / av" },
        ],
      },
    ],
  },
  {
    slug: "gray-zone-warfare",
    title: "Gray Zone Warfare",
    tagline: "Taktisk öppen värld — loot, PvPvE och tempo du sätter själv.",
    summary:
      "Taktisk shooter på Lamang — loadout, inställningar och hur du helst spelar kan du fylla i här allt eftersom.",
    previewBadge: "Extraction",
    /** `cb` höj vid byte av fil med samma namn. */
    image: "/gaming/covers/gray-zone-warfare.png?cb=2",
    imageAlt: "Gray Zone Warfare — omslag med soldat i djungel, vit logotyp till vänster",
    tags: ["FPS", "Taktik", "Steam"],
    steamAppId: 2479810,
    playtime: "130+ timmar",
    settingsSections: [
      {
        id: "play",
        title: "Spel & fokus",
        rows: [
          { label: "Roll / stil", value: "Solo / squad — beskriv kort" },
          { label: "Utrustning i fokus", value: "T.ex. DMR, CQB, support — fyll i" },
          { label: "Mål i säsongen", value: "Uppdrag, traders, bygg — valfritt" },
        ],
      },
      {
        id: "tech",
        title: "Teknik",
        rows: [
          { label: "Grafik", value: "Upplösning, DLSS/FSR, fältvy" },
          { label: "Nätverk", value: "Region, ping, ev. VPN — efter behov" },
        ],
      },
    ],
  },
  {
    slug: "grand-theft-auto-v",
    title: "Grand Theft Auto V",
    tagline: "Los Santos i story eller online — fortfarande relevant.",
    summary:
      "Los Santos i story eller online — favoritläge, heists och grafik kan du komplettera här när du vill.",
    previewBadge: "Online",
    /** `cb` höj vid byte av fil med samma namn. */
    image: "/gaming/covers/grand-theft-auto-v.png?cb=1",
    imageAlt: "Grand Theft Auto V — omslag med kollage av karaktärer, fordon och Los Santos i Rockstars stil",
    tags: ["Action", "Online", "Rockstar"],
    steamAppId: 271590,
    playtime: "300+ timmar",
    settingsSections: [
      {
        id: "modes",
        title: "Lägen",
        rows: [
          { label: "Story / Online", value: "Vad du spelar mest — kort motivering" },
          { label: "Roll i online", value: "CEO, heist, races — valfritt" },
        ],
      },
      {
        id: "settings",
        title: "Inställningar",
        rows: [
          { label: "Grafik", value: "Upplösning, trådning, population density" },
          { label: "Kontroll", value: "Mus+ tangentbord / handkontroll" },
        ],
      },
    ],
  },
];
