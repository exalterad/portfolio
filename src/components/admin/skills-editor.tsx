"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AlertCircle, ArrowDown, ArrowLeft, ArrowUp, Loader2, Plus, Trash2 } from "lucide-react";

import { saveSkillsAction } from "@/app/admin/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { PortfolioSkillsContent, SkillGroup, SkillItem } from "@/lib/skills-schema";
import { cn } from "@/lib/utils";

function newSkillItem(): SkillItem {
  return {
    id: `skill-${crypto.randomUUID().slice(0, 8)}`,
    name: "",
  };
}

function newSkillGroup(): SkillGroup {
  return {
    id: `group-${crypto.randomUUID().slice(0, 8)}`,
    title: "",
    items: [newSkillItem()],
  };
}

type SkillsEditorProps = {
  initial: PortfolioSkillsContent;
  supabaseConfigured: boolean;
};

export function SkillsEditor({ initial, supabaseConfigured }: SkillsEditorProps) {
  const router = useRouter();
  const [eyebrow, setEyebrow] = useState(initial.eyebrow);
  const [headingBefore, setHeadingBefore] = useState(initial.heading.before);
  const [headingAccent, setHeadingAccent] = useState(initial.heading.accent);
  const [description, setDescription] = useState(initial.description);
  const [groups, setGroups] = useState<SkillGroup[]>(initial.groups);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateGroup(id: string, patch: Partial<SkillGroup>) {
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  }

  function removeGroup(id: string) {
    setGroups((prev) => prev.filter((g) => g.id !== id));
  }

  function moveGroup(index: number, dir: -1 | 1) {
    const next = index + dir;
    if (next < 0 || next >= groups.length) return;
    const copy = [...groups];
    const [item] = copy.splice(index, 1);
    copy.splice(next, 0, item!);
    setGroups(copy);
  }

  function updateItem(groupId: string, itemId: string, name: string) {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, items: g.items.map((item) => (item.id === itemId ? { ...item, name } : item)) }
          : g,
      ),
    );
  }

  function addItem(groupId: string) {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, items: [...g.items, newSkillItem()] } : g)),
    );
  }

  function removeItem(groupId: string, itemId: string) {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, items: g.items.filter((item) => item.id !== itemId) } : g,
      ),
    );
  }

  function moveItem(groupId: string, index: number, dir: -1 | 1) {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const next = index + dir;
        if (next < 0 || next >= g.items.length) return g;
        const copy = [...g.items];
        const [item] = copy.splice(index, 1);
        copy.splice(next, 0, item!);
        return { ...g, items: copy };
      }),
    );
  }

  function save() {
    setError(null);

    const trimmedGroups = groups.map((g) => ({
      ...g,
      title: g.title.trim(),
      items: g.items.map((item) => ({ ...item, name: item.name.trim() })),
    }));

    if (!eyebrow.trim()) {
      setError("Etiketten ovanför rubriken kan inte vara tom.");
      return;
    }
    if (!headingBefore.trim() && !headingAccent.trim()) {
      setError("Rubriken behöver minst text före eller efter accenten.");
      return;
    }
    if (!description.trim()) {
      setError("Introtexten kan inte vara tom.");
      return;
    }
    if (!trimmedGroups.length) {
      setError("Lägg till minst en kategori.");
      return;
    }

    for (const g of trimmedGroups) {
      if (!g.title) {
        setError("Varje kategori behöver ett namn.");
        return;
      }
      if (!g.items.length) {
        setError(`Kategorin "${g.title}" behöver minst ett verktyg.`);
        return;
      }
      for (const item of g.items) {
        if (!item.name) {
          setError(`Tom rad i "${g.title}" — fyll i namn eller ta bort raden.`);
          return;
        }
      }
    }

    const content: PortfolioSkillsContent = {
      eyebrow: eyebrow.trim(),
      heading: { before: headingBefore, accent: headingAccent.trim() },
      description: description.trim(),
      groups: trimmedGroups,
    };

    startTransition(async () => {
      const res = await saveSkillsAction(content);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push("/#skills");
      router.refresh();
    });
  }

  return (
    <section className="relative border-t border-white/10 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <ScrollReveal>
          <Link
            href="/#skills"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "mb-8 inline-flex gap-2 text-muted-foreground hover:text-foreground",
            )}
          >
            <ArrowLeft className="size-4" aria-hidden />
            Tillbaka till Skills
          </Link>

          <p className="text-xs font-medium tracking-[0.35em] text-violet-300/90 uppercase">Admin</p>
          <h1 className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Redigera <span className="text-gradient">Skills</span>
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            Ändra rubriker, intro, kategorier och verktyg. Ordningen styr flikar och listan på startsidan.
          </p>
          {!supabaseConfigured ? (
            <p className="mt-3 text-sm text-amber-200/90">
              Supabase saknas i miljön — du kan fylla i formuläret men spara är avstängt.
            </p>
          ) : null}
        </ScrollReveal>

        <ScrollReveal delay={0.06} className="mt-10 space-y-8">
          <Card className="glass-panel border-white/10 bg-white/[0.03] shadow-xl">
            <CardHeader className="text-left">
              <CardTitle className="text-lg">Rubriker</CardTitle>
              <CardDescription>Text ovanför loadout-panelen på startsidan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="skills-eyebrow">Etikett</Label>
                <Input
                  id="skills-eyebrow"
                  value={eyebrow}
                  onChange={(e) => setEyebrow(e.target.value)}
                  placeholder="Skills"
                  className="h-11 bg-background/50"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="skills-heading-before">Rubrik — före accent</Label>
                  <Input
                    id="skills-heading-before"
                    value={headingBefore}
                    onChange={(e) => setHeadingBefore(e.target.value)}
                    placeholder="Tech stack & "
                    className="h-11 bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills-heading-accent">Rubrik — accent (gradient)</Label>
                  <Input
                    id="skills-heading-accent"
                    value={headingAccent}
                    onChange={(e) => setHeadingAccent(e.target.value)}
                    placeholder="craft"
                    className="h-11 bg-background/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills-description">Intro</Label>
                <Input
                  id="skills-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Språk, ramverk och verktyg..."
                  className="h-11 bg-background/50"
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-medium text-foreground">Kategorier</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Varje kategori blir en flik i loadout-panelen. Verktyg visas numrerade i listan.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => setGroups((prev) => [...prev, newSkillGroup()])}
              >
                <Plus className="size-4" aria-hidden />
                Lägg till kategori
              </Button>
            </div>

            {groups.map((group, groupIndex) => (
              <Card key={group.id} className="glass-panel border-white/10 bg-white/[0.03] shadow-xl">
                <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-2 text-left">
                  <CardTitle className="text-base">Kategori {groupIndex + 1}</CardTitle>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="size-8"
                      disabled={groupIndex === 0}
                      onClick={() => moveGroup(groupIndex, -1)}
                      aria-label="Flytta kategori upp"
                    >
                      <ArrowUp className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="size-8"
                      disabled={groupIndex === groups.length - 1}
                      onClick={() => moveGroup(groupIndex, 1)}
                      aria-label="Flytta kategori ned"
                    >
                      <ArrowDown className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="size-8 text-destructive hover:text-destructive"
                      disabled={groups.length <= 1}
                      onClick={() => removeGroup(group.id)}
                      aria-label="Ta bort kategori"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`group-title-${group.id}`}>Kategorinamn (flik)</Label>
                    <Input
                      id={`group-title-${group.id}`}
                      value={group.title}
                      onChange={(e) => updateGroup(group.id, { title: e.target.value })}
                      placeholder="Frontend"
                      className="h-11 bg-background/50"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-medium text-muted-foreground">Verktyg i listan</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 gap-1 text-xs"
                        onClick={() => addItem(group.id)}
                      >
                        <Plus className="size-3.5" aria-hidden />
                        Lägg till
                      </Button>
                    </div>
                    {group.items.map((item, itemIndex) => (
                      <div key={item.id} className="flex gap-2">
                        <Input
                          id={`skill-${item.id}`}
                          value={item.name}
                          onChange={(e) => updateItem(group.id, item.id, e.target.value)}
                          placeholder="React"
                          className="h-10 flex-1 bg-background/50"
                          aria-label={`Verktyg ${itemIndex + 1}`}
                        />
                        <div className="flex shrink-0 gap-1">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-10"
                            disabled={itemIndex === 0}
                            onClick={() => moveItem(group.id, itemIndex, -1)}
                            aria-label="Flytta upp"
                          >
                            <ArrowUp className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-10"
                            disabled={itemIndex === group.items.length - 1}
                            onClick={() => moveItem(group.id, itemIndex, 1)}
                            aria-label="Flytta ned"
                          >
                            <ArrowDown className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-10 text-destructive hover:text-destructive"
                            disabled={group.items.length <= 1}
                            onClick={() => removeItem(group.id, item.id)}
                            aria-label="Ta bort verktyg"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

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
            <Link href="/#skills" className={buttonVariants({ variant: "ghost" })}>
              Avbryt
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

