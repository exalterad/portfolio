"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

import { saveAboutAction } from "@/app/admin/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { PortfolioAboutContent } from "@/lib/about";
import { cn } from "@/lib/utils";

function paragraphsToBlock(paragraphs: string[]): string {
  return paragraphs.join("\n\n");
}

function blockToParagraphs(text: string): string[] {
  const parts = text
    .split(/\n\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length ? parts : [];
}

type AboutEditorProps = {
  initial: PortfolioAboutContent;
  supabaseConfigured: boolean;
};

export function AboutEditor({ initial, supabaseConfigured }: AboutEditorProps) {
  const router = useRouter();
  const [sectionBefore, setSectionBefore] = useState(initial.sectionTitle.before);
  const [sectionAccent, setSectionAccent] = useState(initial.sectionTitle.accent);
  const [paragraphBlock, setParagraphBlock] = useState(() => paragraphsToBlock(initial.paragraphs));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function save() {
    setError(null);
    const paragraphs = blockToParagraphs(paragraphBlock);
    if (!paragraphs.length) {
      setError("Lägg till minst ett stycke i rutan.");
      return;
    }

    const content: PortfolioAboutContent = {
      sectionTitle: {
        before: sectionBefore.trim(),
        accent: sectionAccent.trim(),
      },
      paragraphs,
    };

    startTransition(async () => {
      const res = await saveAboutAction(content);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push("/#about");
      router.refresh();
    });
  }

  const previewTitle = `${sectionBefore.trim() || "…"}${sectionAccent.trim() || "…"}`;

  return (
    <section className="relative border-t border-white/10 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <ScrollReveal>
          <Link
            href="/#about"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "mb-8 inline-flex gap-2 text-muted-foreground hover:text-foreground",
            )}
          >
            <ArrowLeft className="size-4" aria-hidden />
            Tillbaka till Om mig
          </Link>

          <p className="text-xs font-medium tracking-[0.35em] text-violet-300/90 uppercase">Admin</p>
          <h1 className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Redigera <span className="text-gradient">Om mig</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
            Ändra huvudrubriken och texten i rutan. Sparas i Supabase och syns direkt på startsidan.
          </p>
          {!supabaseConfigured ? (
            <p className="mt-3 text-sm text-amber-200/90">
              Supabase saknas i miljön — du kan fylla i formuläret men spara är avstängt.
            </p>
          ) : null}
        </ScrollReveal>

        <ScrollReveal delay={0.06} className="mt-10">
          <Card className="glass-panel border-white/10 bg-white/[0.03] shadow-xl">
            <CardHeader className="text-left">
              <CardTitle className="text-lg">Huvudrubrik</CardTitle>
              <CardDescription>
                Visas ovanför rutan på startsidan. Gradienten ligger på accentordet — här blir det &quot;
                {previewTitle}&quot;.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="about-title-before">Text före accent</Label>
                  <Input
                    id="about-title-before"
                    value={sectionBefore}
                    onChange={(e) => setSectionBefore(e.target.value)}
                    placeholder="Min "
                    className="h-11 bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="about-title-accent">Accent (gradient)</Label>
                  <Input
                    id="about-title-accent"
                    value={sectionAccent}
                    onChange={(e) => setSectionAccent(e.target.value)}
                    placeholder="historia"
                    className="h-11 bg-background/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel mt-6 border-white/10 bg-white/[0.03] shadow-xl">
            <CardHeader className="text-left">
              <CardTitle className="text-lg">Text i rutan</CardTitle>
              <CardDescription>Tom rad mellan stycken = nytt stycke, precis som på sidan.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                id="about-paragraphs"
                value={paragraphBlock}
                onChange={(e) => setParagraphBlock(e.target.value)}
                className="min-h-[min(28rem,60dvh)] bg-background/50 font-sans text-sm leading-relaxed sm:text-base"
                placeholder="Skriv dina stycken här…"
              />
            </CardContent>
          </Card>

          {error ? (
            <div
              role="alert"
              className="mt-6 flex gap-3 rounded-xl border border-violet-500/30 bg-gradient-to-br from-violet-500/[0.14] via-white/[0.04] to-cyan-500/[0.1] px-4 py-3 text-sm text-foreground"
            >
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-violet-300" aria-hidden />
              <p>{error}</p>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap justify-end gap-3">
            <Link
              href="/#about"
              className={buttonVariants({ variant: "outline", size: "default" })}
            >
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
