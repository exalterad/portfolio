"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AlertCircle, ArrowDown, ArrowLeft, ArrowUp, Loader2, Plus, Trash2 } from "lucide-react";

import { saveExperienceAction } from "@/app/admin/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { ExperienceMilestone, PortfolioExperienceContent } from "@/lib/experience";
import { cn } from "@/lib/utils";

function newMilestone(): ExperienceMilestone {
  return {
    id: crypto.randomUUID(),
    period: "",
    title: "",
    detail: "",
  };
}

type ExperienceEditorProps = {
  initial: PortfolioExperienceContent;
  supabaseConfigured: boolean;
};

export function ExperienceEditor({ initial, supabaseConfigured }: ExperienceEditorProps) {
  const router = useRouter();
  const [eyebrow, setEyebrow] = useState(initial.eyebrow);
  const [headingBefore, setHeadingBefore] = useState(initial.heading.before);
  const [headingAccent, setHeadingAccent] = useState(initial.heading.accent);
  const [milestones, setMilestones] = useState<ExperienceMilestone[]>(initial.milestones);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateMilestone(id: string, patch: Partial<ExperienceMilestone>) {
    setMilestones((list) => list.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }

  function removeMilestone(id: string) {
    setMilestones((list) => list.filter((m) => m.id !== id));
  }

  function moveMilestone(index: number, dir: -1 | 1) {
    const next = index + dir;
    if (next < 0 || next >= milestones.length) return;
    setMilestones((list) => {
      const copy = [...list];
      const [item] = copy.splice(index, 1);
      copy.splice(next, 0, item!);
      return copy;
    });
  }

  function save() {
    setError(null);
    const trimmed = milestones.map((m) => ({
      ...m,
      period: m.period.trim(),
      title: m.title.trim(),
      detail: m.detail.trim(),
    }));

    if (!trimmed.length) {
      setError("Lägg till minst en milstolpe.");
      return;
    }

    for (const m of trimmed) {
      if (!m.period || !m.title) {
        setError("Varje milstolpe behöver period och titel.");
        return;
      }
    }

    const content: PortfolioExperienceContent = {
      eyebrow: eyebrow.trim() || "Tidslinje",
      heading: {
        before: headingBefore.trim(),
        accent: headingAccent.trim(),
      },
      milestones: trimmed,
    };

    startTransition(async () => {
      const res = await saveExperienceAction(content);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push("/#experience");
      router.refresh();
    });
  }

  return (
    <section className="relative border-t border-white/10 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <ScrollReveal>
          <Link
            href="/#experience"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "mb-8 inline-flex gap-2 text-muted-foreground hover:text-foreground",
            )}
          >
            <ArrowLeft className="size-4" aria-hidden />
            Tillbaka till Tidslinje
          </Link>

          <p className="text-xs font-medium tracking-[0.35em] text-violet-300/90 uppercase">Admin</p>
          <h1 className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Redigera <span className="text-gradient">Tidslinje</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
            Ändra rubriker och milstolpar. Ordningen uppifrån och ned är samma som på startsidan.
          </p>
          {!supabaseConfigured ? (
            <p className="mt-3 text-sm text-amber-200/90">
              Supabase saknas i miljön — du kan fylla i formuläret men spara är avstängt.
            </p>
          ) : null}
        </ScrollReveal>

        <ScrollReveal delay={0.06} className="mt-10 space-y-6">
          <Card className="glass-panel border-white/10 bg-white/[0.03] shadow-xl">
            <CardHeader className="text-left">
              <CardTitle className="text-lg">Rubriker</CardTitle>
              <CardDescription>Överst i sektionen på startsidan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="exp-eyebrow">Överrubrik (liten text)</Label>
                <Input
                  id="exp-eyebrow"
                  value={eyebrow}
                  onChange={(e) => setEyebrow(e.target.value)}
                  placeholder="Tidslinje"
                  className="h-11 bg-background/50"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="exp-heading-before">Huvudrubrik — före accent</Label>
                  <Input
                    id="exp-heading-before"
                    value={headingBefore}
                    onChange={(e) => setHeadingBefore(e.target.value)}
                    placeholder="Resa & "
                    className="h-11 bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exp-heading-accent">Accent (gradient)</Label>
                  <Input
                    id="exp-heading-accent"
                    value={headingAccent}
                    onChange={(e) => setHeadingAccent(e.target.value)}
                    placeholder="milstolpar"
                    className="h-11 bg-background/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-medium text-foreground">Milstolpar</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setMilestones((list) => [...list, newMilestone()])}
            >
              <Plus className="size-4" />
              Lägg till
            </Button>
          </div>

          {milestones.map((m, index) => (
            <Card key={m.id} className="glass-panel border-white/10 bg-white/[0.03] shadow-xl">
              <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-2 text-left">
                <CardTitle className="text-base">#{index + 1}</CardTitle>
                <div className="flex shrink-0 gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="size-8"
                    disabled={index === 0}
                    onClick={() => moveMilestone(index, -1)}
                    aria-label="Flytta upp"
                  >
                    <ArrowUp className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="size-8"
                    disabled={index === milestones.length - 1}
                    onClick={() => moveMilestone(index, 1)}
                    aria-label="Flytta ned"
                  >
                    <ArrowDown className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="size-8 text-destructive hover:text-destructive"
                    disabled={milestones.length <= 1}
                    onClick={() => removeMilestone(m.id)}
                    aria-label="Ta bort milstolpe"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`period-${m.id}`}>Period</Label>
                    <Input
                      id={`period-${m.id}`}
                      value={m.period}
                      onChange={(e) => updateMilestone(m.id, { period: e.target.value })}
                      placeholder="2024"
                      className="h-10 bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`title-${m.id}`}>Titel</Label>
                    <Input
                      id={`title-${m.id}`}
                      value={m.title}
                      onChange={(e) => updateMilestone(m.id, { title: e.target.value })}
                      placeholder="Rubrik"
                      className="h-10 bg-background/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`detail-${m.id}`}>Beskrivning (valfritt)</Label>
                  <Textarea
                    id={`detail-${m.id}`}
                    value={m.detail}
                    onChange={(e) => updateMilestone(m.id, { detail: e.target.value })}
                    className="min-h-20 bg-background/50 text-sm"
                    placeholder="Kort text under titeln…"
                  />
                </div>
              </CardContent>
            </Card>
          ))}

          {error ? (
            <div
              role="alert"
              className="flex gap-3 rounded-xl border border-violet-500/30 bg-gradient-to-br from-violet-500/[0.14] via-white/[0.04] to-cyan-500/[0.1] px-4 py-3 text-sm text-foreground"
            >
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-violet-300" aria-hidden />
              <p>{error}</p>
            </div>
          ) : null}

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <Link href="/#experience" className={buttonVariants({ variant: "outline", size: "default" })}>
              Avbryt
            </Link>
            <Button
              type="button"
              disabled={isPending || !supabaseConfigured}
              onClick={save}
              className="gap-1.5 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 font-semibold text-slate-950 shadow-[0_0_28px_rgba(168,85,247,0.35)] hover:brightness-110 disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Sparar…
                </>
              ) : (
                "Spara ändringar"
              )}
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
