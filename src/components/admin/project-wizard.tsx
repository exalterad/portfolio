"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { AlertCircle, ArrowLeft, ChevronLeft, ChevronRight, Loader2, Trash2 } from "lucide-react";

import { saveProjectsAction } from "@/app/admin/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { slugifyFromTitle } from "@/lib/project-draft";
import { projectSchema, type PortfolioProject } from "@/lib/project-schema";
import { cn } from "@/lib/utils";

const STEP_COUNT = 7;

const steps = [
  { title: "Namn & URL", hint: "Vad heter bygget, och hur ska det synas i adressfältet?" },
  { title: "Kort pitch", hint: "En mening eller två som fångar vad projektet gör." },
  { title: "År & taggar", hint: "Hjälp besökaren att snabbt placera projektet." },
  { title: "Omslagsbild", hint: "En stark bild som syns på kortet och projektsidan." },
  { title: "Länkar", hint: "Live-demo och källkod — helt valfritt." },
  { title: "Berätta mer", hint: "Längre text. Tom rad = nytt stycke." },
  { title: "Granska & publicera", hint: "Kolla igenom och spara till portfolion." },
] as const;

function paragraphsToBlock(p: string[]): string {
  return p.join("\n\n");
}

function blockToParagraphs(text: string): string[] {
  const parts = text
    .split(/\n\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length ? parts : ["Lägg till minst ett stycke."];
}

function normalizeDraft(d: PortfolioProject): PortfolioProject {
  const paragraphs = d.paragraphs.map((s) => s.trim()).filter(Boolean);
  return {
    ...d,
    slug: d.slug.trim().toLowerCase().replace(/\s+/g, "-"),
    title: d.title.trim(),
    summary: d.summary.trim(),
    year: d.year.trim(),
    image: d.image.trim(),
    imageAlt: d.imageAlt.trim(),
    tags: d.tags.map((t) => t.trim()).filter(Boolean),
    paragraphs: paragraphs.length ? paragraphs : ["Innehåll kommer snart."],
    links: {
      live: d.links.live.trim(),
      repo: d.links.repo.trim(),
    },
  };
}

type ProjectWizardProps = {
  mode: "create" | "edit";
  projects: PortfolioProject[];
  supabaseConfigured: boolean;
  initialProject: PortfolioProject;
};

export function ProjectWizard({ mode, projects, supabaseConfigured, initialProject }: ProjectWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<PortfolioProject>(initialProject);
  const [slugManual, setSlugManual] = useState(mode === "edit");
  const [paragraphBlock, setParagraphBlock] = useState(() => paragraphsToBlock(initialProject.paragraphs));
  const [error, setError] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const editIndex = useMemo(
    () => (mode === "edit" ? projects.findIndex((p) => p.slug === initialProject.slug) : -1),
    [mode, projects, initialProject.slug],
  );

  function patch(p: Partial<PortfolioProject>) {
    setDraft((prev) => ({ ...prev, ...p }));
  }

  function patchLinks(key: "live" | "repo", value: string) {
    setDraft((prev) => ({ ...prev, links: { ...prev.links, [key]: value } }));
  }

  function syncParagraphsFromBlock() {
    patch({ paragraphs: blockToParagraphs(paragraphBlock) });
  }

  function validateStep(i: number): string | null {
    if (i === 0) {
      if (!draft.title.trim()) return "Skriv in ett projektnamn.";
      const slug = draft.slug.trim().toLowerCase();
      if (!slug) return "Slug får inte vara tom.";
      const slugRes = projectSchema.shape.slug.safeParse(slug);
      if (!slugRes.success) return slugRes.error.issues[0]?.message ?? "Ogiltig slug.";
    }
    if (i === 1) {
      if (!draft.summary.trim()) return "Skriv en kort sammanfattning.";
    }
    if (i === 3) {
      if (!draft.image.trim()) return "Lägg till en bild-URL.";
      if (!draft.imageAlt.trim()) return "Skriv en alt-text för bilden.";
    }
    if (i === 5) {
      const paras = blockToParagraphs(paragraphBlock);
      if (!paras.some((p) => p.trim())) return "Lägg till minst ett stycke.";
    }
    return null;
  }

  function goNext() {
    setStepError(null);
    const msg = validateStep(step);
    if (msg) {
      setStepError(msg);
      return;
    }
    if (step === 5) syncParagraphsFromBlock();
    setStep((s) => Math.min(s + 1, STEP_COUNT - 1));
  }

  function goBack() {
    setStepError(null);
    if (step === 6) setParagraphBlock(paragraphsToBlock(draft.paragraphs));
    setStep((s) => Math.max(s - 1, 0));
  }

  function save() {
    setError(null);
    setStepError(null);
    syncParagraphsFromBlock();
    const normalized = normalizeDraft({
      ...draft,
      paragraphs: blockToParagraphs(paragraphBlock),
    });
    const parsed = projectSchema.safeParse(normalized);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? "Kontrollera fälten och försök igen.";
      setError(msg);
      return;
    }

    startTransition(async () => {
      let next: PortfolioProject[];
      if (mode === "create") {
        const slugTaken = projects.some((p) => p.slug === parsed.data.slug);
        if (slugTaken) {
          setError("Den slug:en används redan. Byt URL-slug på första steget.");
          setStep(0);
          return;
        }
        next = [...projects, parsed.data];
      } else {
        if (editIndex < 0) {
          setError("Kunde inte hitta projektet i listan.");
          return;
        }
        const slugTaken = projects.some((p, i) => i !== editIndex && p.slug === parsed.data.slug);
        if (slugTaken) {
          setError("Den slug:en används redan av ett annat projekt.");
          setStep(0);
          return;
        }
        next = projects.map((p, i) => (i === editIndex ? parsed.data : p));
      }

      const res = await saveProjectsAction(next);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push(mode === "create" ? "/admin/projekt/redigera" : "/#projects");
      router.refresh();
    });
  }

  function remove() {
    if (mode !== "edit" || editIndex < 0) return;
    setError(null);
    startTransition(async () => {
      const next = projects.filter((_, i) => i !== editIndex);
      const res = await saveProjectsAction(next);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push("/admin/projekt/redigera");
      router.refresh();
    });
  }

  const progress = ((step + 1) / STEP_COUNT) * 100;

  const previewDraft = useMemo(
    () => normalizeDraft({ ...draft, paragraphs: blockToParagraphs(paragraphBlock) }),
    [draft, paragraphBlock],
  );

  return (
    <section className="relative border-t border-white/10 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/admin/projekt/redigera"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "inline-flex gap-2 text-muted-foreground hover:text-foreground",
              )}
            >
              <ArrowLeft className="size-4" aria-hidden />
              Tillbaka till projektöversikt
            </Link>
            {!supabaseConfigured ? (
              <p className="text-sm text-amber-200/90">
                Supabase saknas i miljön — du kan fylla i formuläret men spara är avstängt.
              </p>
            ) : null}
          </div>

          <div className="mb-8">
            <p className="text-xs font-medium tracking-[0.35em] text-violet-300/90 uppercase">Admin</p>
            <h1 className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {mode === "create" ? (
                <>
                  Nytt <span className="text-gradient">projekt</span>
                </>
              ) : (
                <>
                  Redigera <span className="text-gradient">projekt</span>
                </>
              )}
            </h1>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              Gå igenom stegen — namn, pitch, bild, länkar och text. Samma design som övriga admin-sidor.
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>
                Steg {step + 1} av {STEP_COUNT}
              </span>
              <span className="truncate text-right font-medium text-foreground/80">{steps[step].title}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 via-primary to-cyan-400 transition-[width] duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <Card className="glass-panel border-white/10 bg-white/[0.03] shadow-xl">
            <CardHeader className="text-left">
              <CardTitle className="text-xl">{steps[step].title}</CardTitle>
              <CardDescription>{steps[step].hint}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pb-2">
              {step === 0 ? (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="wiz-title">Projektnamn</Label>
                    <Input
                      id="wiz-title"
                      value={draft.title}
                      onChange={(e) => {
                        const t = e.target.value;
                        patch({ title: t });
                        if (!slugManual) patch({ slug: slugifyFromTitle(t) });
                      }}
                      placeholder="T.ex. Min dashboard-app"
                      className="h-11 bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wiz-slug">URL-slug</Label>
                    <Input
                      id="wiz-slug"
                      value={draft.slug}
                      onChange={(e) => {
                        setSlugManual(true);
                        patch({ slug: e.target.value.toLowerCase().replace(/\s+/g, "-") });
                      }}
                      placeholder="min-dashboard-app"
                      className="h-11 bg-background/50 font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Blir <span className="font-mono text-foreground/90">/projekt/{draft.slug || "…"}</span>
                    </p>
                  </div>
                </div>
              ) : null}

              {step === 1 ? (
                <div className="space-y-2">
                  <Label htmlFor="wiz-summary">Sammanfattning</Label>
                  <Textarea
                    id="wiz-summary"
                    value={draft.summary}
                    onChange={(e) => patch({ summary: e.target.value })}
                    placeholder="Vad löser projektet, för vem, och vad är det coolaste?"
                    className="min-h-28 bg-background/50 text-base leading-relaxed"
                  />
                </div>
              ) : null}

              {step === 2 ? (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="wiz-year">År (valfritt)</Label>
                    <Input
                      id="wiz-year"
                      value={draft.year}
                      onChange={(e) => patch({ year: e.target.value })}
                      placeholder="2025"
                      className="h-11 bg-background/50"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="wiz-tags">Taggar (kommatecken)</Label>
                    <Input
                      id="wiz-tags"
                      value={draft.tags.join(", ")}
                      onChange={(e) =>
                        patch({
                          tags: e.target.value
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="Next.js, TypeScript, Supabase"
                      className="h-11 bg-background/50"
                    />
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="wiz-image">Bild-URL</Label>
                    <Input
                      id="wiz-image"
                      value={draft.image}
                      onChange={(e) => patch({ image: e.target.value })}
                      placeholder="https://…"
                      className="h-11 bg-background/50 font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wiz-alt">Alt-text</Label>
                    <Input
                      id="wiz-alt"
                      value={draft.imageAlt}
                      onChange={(e) => patch({ imageAlt: e.target.value })}
                      placeholder="Kort beskrivning av bilden för skärmläsare"
                      className="h-11 bg-background/50"
                    />
                  </div>
                </div>
              ) : null}

              {step === 4 ? (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="wiz-live">Live-länk</Label>
                    <Input
                      id="wiz-live"
                      value={draft.links.live}
                      onChange={(e) => patchLinks("live", e.target.value)}
                      placeholder="https://demo…"
                      className="h-11 bg-background/50 font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="wiz-repo">Repo / källkod</Label>
                    <Input
                      id="wiz-repo"
                      value={draft.links.repo}
                      onChange={(e) => patchLinks("repo", e.target.value)}
                      placeholder="https://github.com/…"
                      className="h-11 bg-background/50 font-mono text-sm"
                    />
                  </div>
                </div>
              ) : null}

              {step === 5 ? (
                <div className="space-y-2">
                  <Label htmlFor="wiz-paras">Stycken</Label>
                  <Textarea
                    id="wiz-paras"
                    value={paragraphBlock}
                    onChange={(e) => setParagraphBlock(e.target.value)}
                    placeholder={"Första stycket.\n\nAndra stycket efter tom rad."}
                    className="min-h-48 bg-background/50 font-mono text-sm leading-relaxed"
                  />
                  <p className="text-xs text-muted-foreground">Tom rad mellan stycken skapar nya block på projektsidan.</p>
                </div>
              ) : null}

              {step === 6 ? (
                <div className="space-y-5 text-sm leading-relaxed">
                  <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 space-y-3">
                    <p>
                      <span className="text-muted-foreground">Titel:</span>{" "}
                      <span className="font-medium text-foreground">{previewDraft.title}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">URL:</span>{" "}
                      <span className="font-mono text-violet-200/95">/projekt/{previewDraft.slug}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Taggar:</span>{" "}
                      {previewDraft.tags.length ? previewDraft.tags.join(", ") : "—"}
                    </p>
                    <p className="text-muted-foreground line-clamp-4">{previewDraft.summary}</p>
                  </div>
                  <p className="text-muted-foreground">
                    När du sparar uppdateras startsidan och projektsidan direkt (Supabase + cache).
                  </p>
                </div>
              ) : null}

              {stepError ? (
                <div
                  role="status"
                  className="flex gap-3 rounded-xl border border-violet-500/30 bg-gradient-to-br from-violet-500/[0.14] via-white/[0.04] to-cyan-500/[0.1] px-4 py-3 text-sm text-foreground"
                >
                  <AlertCircle className="mt-0.5 size-5 shrink-0 text-violet-300" aria-hidden />
                  <p>{stepError}</p>
                </div>
              ) : null}

              {error ? (
                <div
                  role="alert"
                  className="flex gap-3 rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-100"
                >
                  <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden />
                  <p>{error}</p>
                </div>
              ) : null}

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
                {mode === "edit" && step === 6 ? (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={isPending || !supabaseConfigured}
                    onClick={remove}
                    className="gap-1.5"
                  >
                    <Trash2 className="size-4" />
                    Ta bort projekt
                  </Button>
                ) : (
                  <span />
                )}
                <div className="flex flex-wrap justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={goBack}
                    disabled={step === 0 || isPending}
                    className="gap-1"
                  >
                    <ChevronLeft className="size-4" />
                    Föregående
                  </Button>
                  {step < STEP_COUNT - 1 ? (
                    <Button type="button" size="sm" onClick={goNext} disabled={isPending} className="gap-1">
                      Nästa
                      <ChevronRight className="size-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      disabled={isPending || !supabaseConfigured}
                      onClick={save}
                      className={cn(
                        "gap-1.5 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 font-semibold text-slate-950 shadow-[0_0_28px_rgba(168,85,247,0.35)] hover:brightness-110 disabled:opacity-60",
                      )}
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Sparar…
                        </>
                      ) : (
                        "Spara & publicera"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollReveal>
      </div>
    </section>
  );
}
