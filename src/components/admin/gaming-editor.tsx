"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { AlertCircle, ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react";

import { saveGamingAction } from "@/app/admin/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { GamingGame, PortfolioGamingContent } from "@/lib/gaming-schema";
import { cn } from "@/lib/utils";

function newGame(): GamingGame {
  return {
    slug: `draft-${crypto.randomUUID().slice(0, 8)}`,
    title: "",
    tagline: "",
    summary: "",
    previewBadge: "Bibliotek",
    image: "",
    imageAlt: "",
    tags: ["Steam"],
    playtime: "",
    settingsSections: [
      {
        id: "info",
        title: "Info",
        rows: [{ label: "Notering", value: "" }],
      },
    ],
  };
}

type GamingEditorProps = {
  initial: PortfolioGamingContent;
  supabaseConfigured: boolean;
};

export function GamingEditor({ initial, supabaseConfigured }: GamingEditorProps) {
  const router = useRouter();
  const [layout, setLayout] = useState(initial.layout);
  const [games, setGames] = useState<GamingGame[]>(initial.games);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const slugOptions = useMemo(() => games.map((g) => ({ slug: g.slug, title: g.title })), [games]);

  const editingGame = editingSlug ? games.find((g) => g.slug === editingSlug) : null;

  function updateGame(slug: string, patch: Partial<GamingGame>) {
    setGames((list) => list.map((g) => (g.slug === slug ? { ...g, ...patch } : g)));
  }

  function removeGame(slug: string) {
    setGames((list) => list.filter((g) => g.slug !== slug));
    if (editingSlug === slug) setEditingSlug(null);
  }

  function addGame() {
    const game = newGame();
    setGames((list) => [...list, game]);
    setEditingSlug(game.slug || "__new__");
  }

  function save() {
    setError(null);

    const trimmedGames = games.map((g) => ({
      ...g,
      slug: g.slug.trim().toLowerCase(),
      title: g.title.trim(),
      tagline: g.tagline.trim(),
      summary: g.summary.trim(),
      previewBadge: g.previewBadge.trim(),
      image: g.image.trim(),
      imageAlt: g.imageAlt.trim(),
      playtime: g.playtime.trim(),
      tags: g.tags.map((t) => t.trim()).filter(Boolean),
    }));

    if (!trimmedGames.length) {
      setError("Lägg till minst ett spel.");
      return;
    }

    const slugs = trimmedGames.map((g) => g.slug);
    if (new Set(slugs).size !== slugs.length) {
      setError("Alla slug-värden måste vara unika.");
      return;
    }

    for (const g of trimmedGames) {
      if (!g.slug || !g.title || !g.image) {
        setError("Varje spel behöver slug, titel och bild-URL.");
        return;
      }
    }

    const slugSet = new Set(slugs);
    const { mainGameSlug, top3Slugs } = layout;
    if (!slugSet.has(mainGameSlug)) {
      setError("Huvudspelet måste finnas i spellistan.");
      return;
    }
    for (const s of top3Slugs) {
      if (!slugSet.has(s)) {
        setError("Alla topp 3-spel måste finnas i spellistan.");
        return;
      }
    }
    if (new Set(top3Slugs).size !== 3) {
      setError("Topp 3 måste vara tre olika spel.");
      return;
    }

    const content: PortfolioGamingContent = {
      layout: {
        ...layout,
        steamLibrary: {
          ...layout.steamLibrary,
          maxGames: Math.max(0, Math.min(50, layout.steamLibrary.maxGames)),
          minPlaytimeMinutes: Math.max(0, layout.steamLibrary.minPlaytimeMinutes),
        },
      },
      games: trimmedGames,
    };

    startTransition(async () => {
      const res = await saveGamingAction(content);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push("/#gaming");
      router.refresh();
    });
  }

  return (
    <section className="relative border-t border-white/10 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <ScrollReveal>
          <Link
            href="/#gaming"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "mb-8 inline-flex gap-2 text-muted-foreground hover:text-foreground",
            )}
          >
            <ArrowLeft className="size-4" aria-hidden />
            Tillbaka till Gaming
          </Link>

          <p className="text-xs font-medium tracking-[0.35em] text-violet-300/90 uppercase">Admin</p>
          <h1 className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Redigera <span className="text-gradient">Gaming</span>
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            Byt huvudspel, topp 3 och manuella titlar. Steam fyller biblioteket automatiskt om det är aktiverat nedan.
          </p>

          {!supabaseConfigured ? (
            <p className="mt-6 flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
              Supabase saknas — konfigurera miljövariabler och kör{" "}
              <code className="text-xs">006_portfolio_gaming.sql</code> för att kunna spara.
            </p>
          ) : null}
        </ScrollReveal>

        <div className="mt-10 space-y-6">
          <Card className="glass-panel border-white/10 bg-white/[0.03]">
            <CardHeader>
              <CardTitle>Layout på startsidan</CardTitle>
              <CardDescription>Vilket spel som visas som main och i podium.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="main-game">Huvudspel (main)</Label>
                <NativeSelect
                  id="main-game"
                  value={layout.mainGameSlug}
                  onChange={(e) => setLayout((l) => ({ ...l, mainGameSlug: e.target.value }))}
                >
                  {slugOptions.map((o) => (
                    <option key={o.slug} value={o.slug}>
                      {o.title || o.slug}
                    </option>
                  ))}
                </NativeSelect>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {(
                  [
                    ["Topp 1 (mitten)", 0],
                    ["Topp 2 (vänster)", 1],
                    ["Topp 3 (höger)", 2],
                  ] as const
                ).map(([label, i]) => (
                  <div key={label} className="space-y-2">
                    <Label>{label}</Label>
                    <NativeSelect
                      value={layout.top3Slugs[i]}
                      onChange={(e) => {
                        const next = [...layout.top3Slugs] as [string, string, string];
                        next[i] = e.target.value;
                        setLayout((l) => ({ ...l, top3Slugs: next }));
                      }}
                    >
                      {slugOptions.map((o) => (
                        <option key={o.slug} value={o.slug}>
                          {o.title || o.slug}
                        </option>
                      ))}
                    </NativeSelect>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-white/10 bg-white/[0.03]">
            <CardHeader>
              <CardTitle>Steam-bibliotek</CardTitle>
              <CardDescription>Fyller /gaming med fler spel från ditt Steam-konto (utöver listan nedan).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={layout.steamLibrary.enabled}
                  onChange={(e) =>
                    setLayout((l) => ({
                      ...l,
                      steamLibrary: { ...l.steamLibrary, enabled: e.target.checked },
                    }))
                  }
                  className="size-4 rounded border-white/20"
                />
                Hämta extra spel från Steam
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="steam-max">Max antal Steam-spel</Label>
                  <Input
                    id="steam-max"
                    type="number"
                    min={0}
                    max={50}
                    value={layout.steamLibrary.maxGames}
                    onChange={(e) =>
                      setLayout((l) => ({
                        ...l,
                        steamLibrary: { ...l.steamLibrary, maxGames: Number(e.target.value) || 0 },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="steam-min">Min speltid (minuter)</Label>
                  <Input
                    id="steam-min"
                    type="number"
                    min={0}
                    value={layout.steamLibrary.minPlaytimeMinutes}
                    onChange={(e) =>
                      setLayout((l) => ({
                        ...l,
                        steamLibrary: {
                          ...l.steamLibrary,
                          minPlaytimeMinutes: Number(e.target.value) || 0,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-white/10 bg-white/[0.03]">
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>Spel ({games.length})</CardTitle>
                <CardDescription>Manuella titlar med egna sidor under /gaming/[slug].</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addGame} className="gap-1.5">
                <Plus className="size-4" aria-hidden />
                Lägg till spel
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {games.map((game) => (
                <div
                  key={game.slug || `draft-${games.indexOf(game)}`}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{game.title || "Nytt spel"}</p>
                      <p className="text-xs text-muted-foreground">{game.slug || "saknar-slug"}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingSlug(game.slug || `draft-${games.indexOf(game)}`)}
                      >
                        Redigera
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeGame(game.slug)}
                        disabled={games.length <= 1}
                        aria-label={`Ta bort ${game.title}`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {editingGame ? (
            <Card className="glass-panel border-primary/25 bg-white/[0.04]">
              <CardHeader>
                <CardTitle>Redigera: {editingGame.title || "Nytt spel"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Slug (URL)</Label>
                    <Input
                      value={editingGame.slug}
                      onChange={(e) => {
                        const old = editingGame.slug;
                        const slug = e.target.value.toLowerCase();
                        updateGame(old, { slug });
                        if (editingSlug === old) setEditingSlug(slug);
                      }}
                      placeholder="mitt-spel"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Titel</Label>
                    <Input
                      value={editingGame.title}
                      onChange={(e) => updateGame(editingGame.slug, { title: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tagline (kort)</Label>
                  <Input
                    value={editingGame.tagline}
                    onChange={(e) => updateGame(editingGame.slug, { tagline: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sammanfattning</Label>
                  <Textarea
                    value={editingGame.summary}
                    onChange={(e) => updateGame(editingGame.slug, { summary: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Badge på kort</Label>
                    <Input
                      value={editingGame.previewBadge}
                      onChange={(e) => updateGame(editingGame.slug, { previewBadge: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Speltid (reserv)</Label>
                    <Input
                      value={editingGame.playtime}
                      onChange={(e) => updateGame(editingGame.slug, { playtime: e.target.value })}
                      placeholder="t.ex. 120+ timmar"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Bild-URL</Label>
                  <Input
                    value={editingGame.image}
                    onChange={(e) => updateGame(editingGame.slug, { image: e.target.value })}
                    placeholder="/gaming/covers/... eller https://"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Alt-text bild</Label>
                  <Input
                    value={editingGame.imageAlt}
                    onChange={(e) => updateGame(editingGame.slug, { imageAlt: e.target.value })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Taggar (kommaseparerade)</Label>
                    <Input
                      value={editingGame.tags.join(", ")}
                      onChange={(e) =>
                        updateGame(editingGame.slug, {
                          tags: e.target.value
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Steam app-id (valfritt)</Label>
                    <Input
                      type="number"
                      value={editingGame.steamAppId ?? ""}
                      onChange={(e) => {
                        const v = e.target.value.trim();
                        updateGame(editingGame.slug, {
                          steamAppId: v ? Number(v) : undefined,
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Inställningssektioner (JSON)</Label>
                  <Textarea
                    className="font-mono text-xs"
                    rows={10}
                    value={JSON.stringify(editingGame.settingsSections, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value) as GamingGame["settingsSections"];
                        updateGame(editingGame.slug, { settingsSections: parsed });
                      } catch {
                        /* vänta på giltig JSON */
                      }
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Avancerat: crosshair-rutnät och tabeller som på CS2-sidan. Ogiltig JSON ignoreras tills den är korrekt.
                  </p>
                </div>
                <Button type="button" variant="secondary" size="sm" onClick={() => setEditingSlug(null)}>
                  Stäng redigering
                </Button>
              </CardContent>
            </Card>
          ) : null}

          {error ? (
            <p className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="button" onClick={save} disabled={isPending || !supabaseConfigured} className="min-w-[8rem]">
              {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : "Spara"}
            </Button>
            <Link href="/#gaming" className={buttonVariants({ variant: "ghost" })}>
              Avbryt
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
