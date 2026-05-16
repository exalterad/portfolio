"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Gamepad2 } from "lucide-react";

import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { GamingGame } from "@/lib/gaming";

type GamingMainFeatureProps = {
  game: GamingGame;
};

export function GamingMainFeature({ game }: GamingMainFeatureProps) {
  const coverUnoptimized = game.image.startsWith("/");

  return (
    <ScrollReveal delay={0.05}>
      <Link href={`/gaming/${game.slug}`} className="group block">
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="glass-panel relative overflow-hidden rounded-3xl border border-cyan-500/25 bg-white/[0.04] shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_0_60px_rgba(34,211,238,0.12)] transition hover:border-cyan-400/40 hover:shadow-[0_0_80px_rgba(34,211,238,0.2)]"
        >
          <div className="grid gap-0 lg:grid-cols-[1.15fr_1fr]">
            <div className="relative aspect-[16/10] min-h-[12rem] overflow-hidden lg:aspect-auto lg:min-h-[18rem]">
              <Image
                src={game.image}
                alt={game.imageAlt}
                fill
                unoptimized={coverUnoptimized}
                className="object-cover transition duration-700 group-hover:scale-[1.02]"
                sizes="(max-width:1024px) 100vw, 55vw"
                priority
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent lg:bg-gradient-to-t lg:from-black/90 lg:via-black/50 lg:to-transparent" />
              <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-500/20 px-3 py-1 text-[0.65rem] font-semibold tracking-wider text-cyan-100 uppercase backdrop-blur-sm">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-400 opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-cyan-300" />
                </span>
                Spelar nu
              </span>
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <p className="flex items-center gap-2 text-xs font-medium tracking-[0.25em] text-cyan-300/90 uppercase">
                <Gamepad2 className="size-3.5" aria-hidden />
                Mitt main
              </p>
              <h3 className="mt-3 font-[family-name:var(--font-orbitron)] text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {game.title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">{game.tagline}</p>
              {game.heroStats && game.heroStats.length > 0 ? (
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {game.heroStats.slice(0, 2).map((stat) => (
                    <span
                      key={stat.label}
                      className="inline-flex rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-muted-foreground"
                    >
                      <span className="text-foreground/90">{stat.value}</span>
                      <span className="mx-1.5 text-white/20">·</span>
                      {stat.label}
                    </span>
                  ))}
                </div>
              ) : null}
              <p className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-200/90 transition group-hover:text-cyan-100">
                Inställningar &amp; detaljer
                <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </p>
            </div>
          </div>
        </motion.div>
      </Link>
    </ScrollReveal>
  );
}
