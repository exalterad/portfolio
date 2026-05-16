"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AlertCircle, ArrowDown, ArrowLeft, ArrowUp, Loader2, Plus, Trash2 } from "lucide-react";

import { saveSocialAction } from "@/app/admin/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import {
  socialIconLabels,
  type PortfolioSocialContent,
  type SocialIconId,
  type SocialLink,
} from "@/lib/social-schema";
import { cn } from "@/lib/utils";

function newSocialLink(): SocialLink {
  return {
    id: `social-${crypto.randomUUID().slice(0, 8)}`,
    name: "",
    href: "",
    icon: "github",
    handle: "",
  };
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

type SocialEditorProps = {
  initial: PortfolioSocialContent;
  supabaseConfigured: boolean;
};

export function SocialEditor({ initial, supabaseConfigured }: SocialEditorProps) {
  const router = useRouter();
  const [eyebrow, setEyebrow] = useState(initial.eyebrow);
  const [headingBefore, setHeadingBefore] = useState(initial.heading.before);
  const [headingAccent, setHeadingAccent] = useState(initial.heading.accent);
  const [description, setDescription] = useState(initial.description);
  const [links, setLinks] = useState<SocialLink[]>(initial.links);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateLink(id: string, patch: Partial<SocialLink>) {
    setLinks((prev) => prev.map((link) => (link.id === id ? { ...link, ...patch } : link)));
  }

  function removeLink(id: string) {
    setLinks((prev) => prev.filter((link) => link.id !== id));
  }

  function moveLink(index: number, dir: -1 | 1) {
    const next = index + dir;
    if (next < 0 || next >= links.length) return;
    const copy = [...links];
    const [item] = copy.splice(index, 1);
    copy.splice(next, 0, item!);
    setLinks(copy);
  }

  function save() {
    setError(null);

    const trimmedLinks = links.map((link) => ({
      ...link,
      name: link.name.trim(),
      href: link.href.trim(),
      handle: link.handle?.trim() || undefined,
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
    if (!trimmedLinks.length) {
      setError("Lägg till minst en kanal.");
      return;
    }

    for (const link of trimmedLinks) {
      if (!link.name || !link.href) {
        setError("Varje kanal behöver namn och länk.");
        return;
      }
      if (!isValidUrl(link.href)) {
        setError(`Ogiltig länk för "${link.name}". Använd en full URL (https://...).`);
        return;
      }
    }

    const content: PortfolioSocialContent = {
      eyebrow: eyebrow.trim(),
      heading: {
        before: headingBefore,
        accent: headingAccent.trim(),
      },
      description: description.trim(),
      links: trimmedLinks,
    };

    startTransition(async () => {
      const res = await saveSocialAction(content);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push("/#social");
      router.refresh();
    });
  }

  return (
    <section className="relative border-t border-white/10 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <ScrollReveal>
          <Link
            href="/#social"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "mb-8 inline-flex gap-2 text-muted-foreground hover:text-foreground",
            )}
          >
            <ArrowLeft className="size-4" aria-hidden />
            Tillbaka till Socialt
          </Link>

          <p className="text-xs font-medium tracking-[0.35em] text-violet-300/90 uppercase">Admin</p>
          <h1 className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Redigera <span className="text-gradient">Socialt</span>
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            Ändra rubriker, intro och kanaler (namn, ikon, länk och valfritt användarnamn). Ordningen styr hur rutorna
            visas i sektionen.
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
              <CardDescription>Text ovanför kanalrutorna på startsidan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="social-eyebrow">Etikett</Label>
                <Input
                  id="social-eyebrow"
                  value={eyebrow}
                  onChange={(e) => setEyebrow(e.target.value)}
                  placeholder="Socialt"
                  className="h-11 bg-background/50"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="heading-before">Rubrik — före accent</Label>
                  <Input
                    id="heading-before"
                    value={headingBefore}
                    onChange={(e) => setHeadingBefore(e.target.value)}
                    placeholder="Häng med "
                    className="h-11 bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heading-accent">Rubrik — accent (gradient)</Label>
                  <Input
                    id="heading-accent"
                    value={headingAccent}
                    onChange={(e) => setHeadingAccent(e.target.value)}
                    placeholder="live"
                    className="h-11 bg-background/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="social-description">Intro</Label>
                <Input
                  id="social-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Stream, kod och DM..."
                  className="h-11 bg-background/50"
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-medium text-foreground">Kanaler</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Ikon, namn, länk och valfritt användarnamn under namnet i rutorna.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => setLinks((prev) => [...prev, newSocialLink()])}
              >
                <Plus className="size-4" aria-hidden />
                Lägg till kanal
              </Button>
            </div>

            {links.map((link, index) => (
              <Card key={link.id} className="glass-panel border-white/10 bg-white/[0.03] shadow-xl">
                <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-2 text-left">
                  <CardTitle className="text-base">#{index + 1}</CardTitle>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="size-8"
                      disabled={index === 0}
                      onClick={() => moveLink(index, -1)}
                      aria-label="Flytta upp"
                    >
                      <ArrowUp className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="size-8"
                      disabled={index === links.length - 1}
                      onClick={() => moveLink(index, 1)}
                      aria-label="Flytta ned"
                    >
                      <ArrowDown className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="size-8 text-destructive hover:text-destructive"
                      disabled={links.length <= 1}
                      onClick={() => removeLink(link.id)}
                      aria-label="Ta bort kanal"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`name-${link.id}`}>Namn</Label>
                      <Input
                        id={`name-${link.id}`}
                        value={link.name}
                        onChange={(e) => updateLink(link.id, { name: e.target.value })}
                        placeholder="GitHub"
                        className="h-11 bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`icon-${link.id}`}>Ikon</Label>
                      <NativeSelect
                        id={`icon-${link.id}`}
                        value={link.icon}
                        onChange={(e) => updateLink(link.id, { icon: e.target.value as SocialIconId })}
                      >
                        {(Object.keys(socialIconLabels) as SocialIconId[]).map((id) => (
                          <option key={id} value={id}>
                            {socialIconLabels[id]}
                          </option>
                        ))}
                      </NativeSelect>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`href-${link.id}`}>Länk</Label>
                    <Input
                      id={`href-${link.id}`}
                      value={link.href}
                      onChange={(e) => updateLink(link.id, { href: e.target.value })}
                      placeholder="https://github.com/..."
                      className="h-11 bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`handle-${link.id}`}>Användarnamn (valfritt)</Label>
                    <Input
                      id={`handle-${link.id}`}
                      value={link.handle ?? ""}
                      onChange={(e) => updateLink(link.id, { handle: e.target.value })}
                      placeholder="enkan"
                      className="h-11 bg-background/50"
                    />
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
            <Link href="/#social" className={buttonVariants({ variant: "ghost" })}>
              Avbryt
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

