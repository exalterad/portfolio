"use client";

import Image from "next/image";
import Link from "next/link";
import { Trophy } from "lucide-react";

import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { GamingGame } from "@/lib/gaming";

const PODIUM_RANKS = [2, 1, 3] as const;
const PODIUM_LABELS: Record<(typeof PODIUM_RANKS)[number], string> = {
  1: "Topp 1",
  2: "Topp 2",
  3: "Topp 3",
};

type GamingPodiumProps = {
  /** Ordning: vänster (#2), mitten (#1), höger (#3). */
  games: [GamingGame, GamingGame, GamingGame];
};

export function GamingPodium({ games }: GamingPodiumProps) {
  return (
    <div className="mt-16 w-full">
      <ScrollReveal delay={0.08}>
        <div className="flex items-end gap-2 sm:gap-3">
          <Trophy className="size-4 text-amber-300/90" aria-hidden />
          <h3 className="font-[family-name:var(--font-orbitron)] text-lg font-semibold text-foreground sm:text-xl">
            Topp 3 <span className="text-gradient">genom tiderna</span>
          </h3>
        </div>
      </ScrollReveal>

      <div className="mt-8 grid w-full grid-cols-3 items-stretch gap-3 sm:gap-4 md:gap-6">
        {games.map((game, i) => {
          const rank = PODIUM_RANKS[i]!;
          const coverUnoptimized = game.image.startsWith("/");

          return (
            <ScrollReveal key={game.slug} delay={0.1 + i * 0.06} className="min-w-0">
              <Link
                href={`/gaming/${game.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/[0.04] shadow-lg transition hover:border-violet-400/40 hover:shadow-[0_0_32px_rgba(168,85,247,0.25)]"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden border-b border-white/10">
                  <Image
                    src={game.image}
                    alt={game.imageAlt}
                    fill
                    unoptimized={coverUnoptimized}
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width:640px) 33vw, 20rem"
                  />
                </div>

                <div className="flex h-[5.5rem] shrink-0 flex-col justify-center border-t border-white/10 bg-gradient-to-b from-violet-500/20 via-white/[0.05] to-white/[0.03] px-3 py-3 sm:h-[6.5rem] sm:px-4 sm:py-4">
                  <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-violet-200/90 uppercase sm:text-xs">
                    {PODIUM_LABELS[rank]}
                  </p>
                  <p className="mt-1.5 line-clamp-2 font-[family-name:var(--font-orbitron)] text-sm font-semibold leading-snug text-foreground sm:text-base">
                    {game.title}
                  </p>
                </div>
              </Link>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}
