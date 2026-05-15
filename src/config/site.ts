/** Redigera denna fil för att anpassa namn, länkar och innehåll. */
export const site = {
  name: "Alexander Engberg",
  username: "aengberg",
  age: 24,
  tagline: "24 år · Hobbyutvecklare · CS2, projekt & nya saker att lära",
  description:
    "Alexander Engberg, 24 — gillar att sitta vid datorn och spela eller bygga hobbyprojekt. Portfolio med gaming, setup och kontakt.",
  url: "https://example.com",
  locale: "sv_SE",
  avatar:
    "https://api.dicebear.com/7.x/avataaars/png?seed=AlexanderEngberg&size=256&backgroundColor=b6e3f4",
  email: "hello@example.com",
  nav: [
    { id: "hero", label: "Hem" },
    { id: "about", label: "Om mig" },
    { id: "experience", label: "Tidslinje" },
    { id: "gaming", label: "Gaming" },
    { id: "setup", label: "Setup" },
    { id: "social", label: "Socialt" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projekt" },
    { id: "contact", label: "Kontakt" },
  ] as const,
  hero: {
    eyebrow: "Portfolio - Gaming - Hobby Developer",
    ctas: [
      { label: "Se projekt", href: "/#projects" },
      { label: "Kontakt", href: "#contact", variant: "outline" as const },
    ],
  },
  about: {
    sectionTitle: {
      before: "Min ",
      accent: "historia",
    },
    paragraphs: [
      "Jag heter Alexander Engberg och är 24 år gammal. Mycket av min fritid spenderar jag framför datorn, antingen med spel eller olika projekt. Det är där jag trivs bäst och kan koppla av samtidigt som jag håller hjärnan igång.",
      "Jag är hobbyutvecklare och gillar att testa idéer, bygga små projekt och experimentera med kod bara för att det är kul. För mig handlar det mycket om själva processen — att få något att fungera efter att ha suttit och pillat med det ett tag är nog det som gör det mest givande.",
      "Jag tycker också om att hela tiden lära mig nya saker. Det kan vara allt från ett nytt ramverk eller smartare sätt att strukturera kod till små detaljer inom spel och design som gör större skillnad än man först tror.",
      "När jag inte håller på med projekt eller kodar spelar jag en hel del Counter-Strike 2, men gillar också berättelsedrivna spel där man verkligen fastnar i världen och karaktärerna. Just nu är Counter-Strike 2 det spel jag spelar mest. Mina topp tre spel genom tiderna är Red Dead Redemption 2, Hogwarts Legacy och A Way Out — alla av helt olika anledningar, men spel som verkligen lämnat avtryck hos mig.",
    ],
  },
  experience: {
    eyebrow: "Tidslinje",
    heading: {
      before: "Resa & ",
      accent: "milstolpar",
    },
    milestones: [
      {
        period: "2022",
        title: "Började programmera",
        detail: "Första kontakten med kod — nyfikenhet som bara växte.",
      },
      {
        period: "2023",
        title: "Startade FiveM-server",
        detail: "Första steget in i multiplayer, resurser och att få en värld att leva online.",
      },
      {
        period: "2023",
        title: "HTML, CSS och första egna hemsidan",
        detail: "Började forma gränssnitt på riktigt och få idéer att synas i webbläsaren.",
      },
      {
        period: "2023",
        title: "Började plugga till .NET-utvecklare på högskola",
        detail: "Strukturerad utbildning i C#, .NET och hur man bygger mjukvara på ett hållbart sätt.",
      },
      {
        period: "2024",
        title: "Kom längre in i kod med högskolan och .NET",
        detail: "Mer avancerade labbar, projekt och tänk kring arkitektur, dataåtkomst och hela stacken runt .NET.",
      },
      {
        period: "2025",
        title: "Egen FiveM-server med egna scripts",
        detail: "Tog sats med custom-logik, databaser och att driva något skarpt från idé till spelbar funktion.",
      },
      {
        period: "2026",
        title: "Webbverktyg och den här portfolion",
        detail: "Fler små sidor som förenklar vardagen — och den här portfolion som jag fortsätter bygga ut och slipa på.",
      },
    ],
  },
  setup: {
    title: "Min dator",
    specs: [
      {
        label: "CPU",
        value: "AMD Ryzen 7 9800X3D (4,7 GHz · 104 MB cache)",
        href: "https://www.inet.se/produkt/5307058/amd-ryzen-7-9800x3d-4-7-ghz-104mb",
      },
      {
        label: "GPU",
        value: "MSI GeForce RTX 5070 Ti 16 GB Gaming Trio OC White",
        href: "https://www.inet.se/produkt/5415522/msi-geforce-rtx-5070-ti-16gb-gaming-trio-oc-white",
      },
      {
        label: "Moderkort",
        value: "ASUS TUF Gaming B650-E WiFi",
        href: "https://www.inet.se/produkt/1904217/asus-tuf-gaming-b650-e-wifi",
      },
      {
        label: "RAM",
        value: "Kingston 32 GB (2×16 GB) DDR5 6000 MHz CL30 FURY Beast",
        href: "https://www.inet.se/produkt/5306774/kingston-32gb-2x16gb-ddr5-6000mhz-cl30-fury-beast-rgb-vit-amd-expo-xmp-3-0",
      },
      {
        label: "Lagring",
        value: "WD Black SN7100 2 TB NVMe Gen4",
        href: "https://www.inet.se/produkt/4306103/wd-black-sn7100-2tb-gen-4",
      },
      {
        label: "Kylning",
        value: "Arctic Liquid Freezer III 360 A-RGB White",
        href: "https://www.inet.se/produkt/5324818/arctic-liquid-freezer-iii-360-a-rgb-vit",
      },
      {
        label: "Chassi",
        value: "NZXT H7 Flow (2024) RGB White",
        href: "https://www.inet.se/produkt/6906237/nzxt-h7-flow-2024-rgb-vit",
      },
      {
        label: "Nätaggregat",
        value: "Corsair RM1000e (2025) ATX 3.1",
        href: "https://www.inet.se/produkt/6906765/corsair-rm1000e-2025-atx-3-1",
      },
    ],
    peripherals: {
      title: "Gamingtillbehör",
      items: [
        {
          label: "Skärm 1",
          value: '24" BenQ ZOWIE XL2546X 240hz',
          href: "https://www.inet.se/produkt/2224813/zowie-25-xl2546x-dyac-2-240-hz-e-sports-monitor",
        },
        {
          label: "Skärm 2",
          value: '24" Acer Predator XB240H 144hz',
          href: "https://www.inet.se/produkt/2205385/acer-24-predator-xb240h",
        },
        {
          label: "Headset",
          value: "Logitech G PRO X 2 Lightspeed Wireless",
          href: "https://www.inet.se/produkt/6611233/logitech-g-pro-x-2-lightspeed-wireless-svart",
        },
        {
          label: "Mus",
          value: "Logitech PRO X SUPERLIGHT Wireless",
          href: "https://www.inet.se/produkt/6104230/logitech-pro-x-superlight-2-dex-vit",
        },
        {
          label: "Musmatta",
          value: "ZOWIE by BenQ G-SR III",
          href: "https://www.inet.se/produkt/6612817/zowie-g-sr-iii-mousepad",
        },
        {
          label: "Tangentbord",
          value: "Xtrfy K4 TKL RGB",
          href: "https://www.inet.se/produkt/6601159/xtrfy-k4-rgb-tkl-vit",
        },
      ],
    },
  },
  social: [
    { name: "Discord", href: "https://discord.com/", icon: "discord" },
    { name: "Instagram", href: "https://instagram.com/", icon: "instagram" },
    { name: "TikTok", href: "https://www.tiktok.com/@1enkan", icon: "tiktok" },
    { name: "GitHub", href: "https://github.com/exalterad", icon: "github" },
    { name: "Steam", href: "https://steamcommunity.com/id/enk4n", icon: "steam" },
    { name: "Twitch", href: "https://www.twitch.tv/enk4n", icon: "twitch" },
  ] as const,
  skills: {
    /** Grupper med etikett + lista — redigera fritt. */
    groups: [
      {
        title: "Frontend",
        items: ["React", "Next.js", "Tailwind CSS", "TypeScript"],
      },
      {
        title: "Backend",
        items: ["Node.js", "PostgreSQL", "Docker", "Python"],
      },
      {
        title: "Design",
        items: ["Figma", "UI/UX", "Framer Motion"],
      },
      {
        title: "Verktyg",
        items: ["Neovim", "GitHub Actions", "Git"],
      },
    ],
  },
  contact: {
    title: "Säg hej",
    eyebrow: "Kontakt",
    body: [
      "Vill du nå mig om samarbete, frågor, en idé du vill bolla eller bara snacka tech och gaming? Jag läser allt som dyker upp och återkommer så fort jag hunnit svara ordentligt.",
      "Skriv gärna kort vad det gäller — till exempel om det handlar om projekt, stream, kod, setup eller något helt annat — så blir det enklare för mig att förbereda ett vettigt svar. Om du hellre vill mejla direkt går det lika bra; adressen finns också här intill.",
      "Jag gillar nyfikenhet, tydliga frågor och när folk vågar nätverka utan onödig jargon. Oavsett om du är nyfiken på något du sett på sidan, vill diskutera hårdvara eller bara vill säga hej efter en bra rond i CS2: tack för att du hör av dig.",
    ],
  },
  projects: [
    {
      slug: "portfolio-site",
      title: "Den här portfolion",
      summary: "Modern mörk one-pager med Next.js, Tailwind CSS och shadcn/ui — gamingkänsla utan att tumma på prestanda.",
      tags: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      year: "2026",
      image: "https://picsum.photos/seed/portfolio/1200/720",
      imageAlt: "Förhandsvisning av portfolio-sidan",
      paragraphs: [
        "Det här är sajten du är på nu. Jag ville ha en snabb, responsiv portfolio som känns personlig: mörkt tema, tydliga sektioner och små animationer som inte stör.",
        "Teknikmässigt kör jag App Router i Next.js, Tailwind v4, shadcn/ui-komponenter och Framer Motion för scroll- och hover-effekter. Kontaktformuläret skickas via en server action och kan kopplas till Web3Forms eller liknande.",
        "Innehållet ligger samlat i `src/config/site.ts` så det är enkelt att byta texter, lägga till projekt eller uppdatera länkar utan att rota i hela kodbasen.",
      ],
      links: {
        live: "",
        repo: "https://github.com/exalterad",
      },
    },
    {
      slug: "nasta-projekt",
      title: "Nästa hobbyprojekt",
      summary: "Reserverad plats för nästa hemsida, intern verktyg eller experiment du vill visa upp här.",
      tags: ["Mall", "Lägg till själv"],
      year: "—",
      image: "https://picsum.photos/seed/nextbuild/1200/720",
      imageAlt: "Abstrakt illustration för kommande projekt",
      paragraphs: [
        "Du lägger till nya projekt genom att kopiera ett objekt i `projects`-arrayen i `site.ts`: sätt ett unikt `slug`, rubrik, kort `summary`, valfri `year`, `image`-URL, `tags` och en eller flera stycken i `paragraphs` för undersidan.",
        "Varje projekt får automatiskt en egen sida under `/projekt/[slug]`. Länkarna `live` och `repo` i `links` är valfria — om du fyller i dem visas knappar på projektsidan.",
      ],
      links: {
        live: "",
        repo: "",
      },
    },
  ],
} as const;

export type NavId = (typeof site.nav)[number]["id"];
