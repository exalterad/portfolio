"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { gamingGames } from "@/config/gaming-games";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export function GamingSection() {
  return (
    <section id="gaming" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <p className="text-xs font-medium tracking-[0.35em] text-cyan-300/90 uppercase">Gaming</p>
          <h2 className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Main game & <span className="text-gradient">favoriter</span>
          </h2>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {gamingGames.map((game, i) => {
            /** Lokala filer från /public — undvik /_next/image-cache som annars håller kvar gammal bitmap vid samma URL. */
            const coverUnoptimized = game.image.startsWith("/");
            return (
            <ScrollReveal key={game.slug} delay={0.05 * i}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                className="relative"
              >
                <Link href={`/gaming/${game.slug}`} className="group block h-full">
                  <Card className="glass-panel h-full cursor-pointer overflow-hidden border-white/10 bg-white/[0.03] transition hover:border-primary/35 hover:shadow-[0_0_36px_rgba(34,211,238,0.18)]">
                    <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-white/10">
                      <Image
                        src={game.image}
                        alt={game.imageAlt}
                        fill
                        unoptimized={coverUnoptimized}
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <span className="pointer-events-none absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-lg border border-white/15 bg-black/50 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
                        <ArrowUpRight className="size-4" aria-hidden />
                      </span>
                      <span className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-white/15 bg-black/55 px-2.5 py-1 text-[0.65rem] font-medium text-white backdrop-blur-sm">
                        {game.previewBadge}
                      </span>
                    </div>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg leading-snug">{game.title}</CardTitle>
                      <div
                        className="mt-2 inline-flex w-fit max-w-full items-center rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-1.5 text-xs font-medium tabular-nums tracking-wide text-muted-foreground shadow-inner"
                        aria-label={`Speltid: ${game.playtime}`}
                      >
                        {game.playtime}
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              </motion.div>
            </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
