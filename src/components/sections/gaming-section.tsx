"use client";

import Link from "next/link";
import { ChevronRight, Library, Pencil } from "lucide-react";

import { GamingMainFeature } from "@/components/gaming/gaming-main-feature";
import { GamingPodium } from "@/components/gaming/gaming-podium";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { GamingGame } from "@/lib/gaming";
import { cn } from "@/lib/utils";

type GamingSectionProps = {
  mainGame: GamingGame;
  podiumGames: [GamingGame, GamingGame, GamingGame];
  libraryCount: number;
  isAdmin?: boolean;
  supabaseConfigured?: boolean;
};

export function GamingSection({
  mainGame,
  podiumGames,
  libraryCount,
  isAdmin = false,
  supabaseConfigured = false,
}: GamingSectionProps) {
  return (
    <section id="gaming" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium tracking-[0.35em] text-cyan-300/90 uppercase">Gaming</p>
              <h2 className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Det jag <span className="text-gradient">spelar</span>
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Mitt fokus just nu, favoriterna genom åren — och fler titlar i biblioteket.
              </p>
            </div>
            {isAdmin ? (
              supabaseConfigured ? (
                <Link
                  href="/admin/gaming/redigera"
                  title="Redigera Gaming"
                  aria-label="Redigera Gaming"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "icon" }),
                    "shrink-0 cursor-pointer rounded-xl border-white/15 bg-white/5 text-foreground shadow-[0_0_20px_rgba(168,85,247,0.12)] hover:border-primary/40 hover:bg-white/10",
                  )}
                >
                  <Pencil className="size-5" strokeWidth={2.25} />
                </Link>
              ) : (
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  title="Konfigurera Supabase för att spara"
                  disabled
                  className="shrink-0 cursor-not-allowed rounded-xl border-white/15 bg-white/5 text-foreground opacity-40"
                  aria-label="Redigera Gaming (inaktiverat)"
                >
                  <Pencil className="size-5" strokeWidth={2.25} />
                </Button>
              )
            ) : null}
          </div>
        </ScrollReveal>

        <div className="mt-12">
          <GamingMainFeature game={mainGame} />
        </div>

        <GamingPodium games={podiumGames} />

        {libraryCount > 0 ? (
          <ScrollReveal delay={0.14} className="mt-14 flex justify-center">
            <Link
              href="/gaming"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "group gap-2 rounded-xl border-white/15 bg-white/5 px-6 shadow-[0_0_24px_rgba(168,85,247,0.12)] hover:border-cyan-400/35 hover:bg-white/10",
              )}
            >
              <Library className="size-4 text-cyan-300/90" aria-hidden />
              Fler spel i biblioteket
              <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
                {libraryCount}
              </span>
              <ChevronRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </ScrollReveal>
        ) : null}
      </div>
    </section>
  );
}
