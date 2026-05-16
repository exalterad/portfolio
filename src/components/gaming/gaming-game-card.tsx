"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { GamingGame } from "@/lib/gaming";
import { cn } from "@/lib/utils";

type GamingGameCardProps = {
  game: GamingGame;
  className?: string;
  compact?: boolean;
};

export function GamingGameCard({ game, className, compact = false }: GamingGameCardProps) {
  const coverUnoptimized = game.image.startsWith("/");

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className={cn("relative h-full", className)}
    >
      <Link href={`/gaming/${game.slug}`} className="group block h-full">
        <Card className="glass-panel h-full cursor-pointer overflow-hidden border-white/10 bg-white/[0.03] transition hover:border-primary/35 hover:shadow-[0_0_36px_rgba(34,211,238,0.18)]">
          <div
            className={cn(
              "relative w-full overflow-hidden border-b border-white/10",
              compact ? "aspect-[16/10]" : "aspect-[16/10]",
            )}
          >
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
          <CardHeader className={cn("pb-4", compact && "px-4 pt-4")}>
            <CardTitle className={cn("leading-snug", compact ? "text-base" : "text-lg")}>{game.title}</CardTitle>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{game.tagline}</p>
          </CardHeader>
        </Card>
      </Link>
    </motion.div>
  );
}
