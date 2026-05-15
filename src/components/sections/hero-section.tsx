"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FaDiscord, FaGithub, FaInstagram, FaSteam, FaTwitch } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";

import { site } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const socialIcons = {
  discord: FaDiscord,
  instagram: FaInstagram,
  tiktok: SiTiktok,
  github: FaGithub,
  steam: FaSteam,
  twitch: FaTwitch,
} as const;

const heroSocialOrder = ["github", "discord", "instagram", "tiktok", "steam", "twitch"] as const;

export function HeroSection() {
  const heroLinks = heroSocialOrder
    .map((key) => site.social.find((s) => s.icon === key))
    .filter(Boolean) as (typeof site.social)[number][];

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] scroll-mt-24 flex-col items-center justify-center px-4 pt-24 pb-20 text-center sm:px-6 sm:pt-28 sm:pb-24"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 sm:gap-10">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-xs font-medium tracking-[0.35em] text-violet-300/90 uppercase"
        >
          {site.hero.eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.58, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
          className="font-[family-name:var(--font-orbitron)] text-4xl leading-[1.08] font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          <span className="text-gradient">{site.name}</span>
        </motion.h1>

        <motion.dl
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.52, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="grid w-full max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-8 sm:gap-10 sm:pt-10"
        >
          <div className="text-center">
            <dt className="text-[0.65rem] font-medium tracking-[0.2em] text-muted-foreground uppercase">Status</dt>
            <dd className="mt-2 font-[family-name:var(--font-orbitron)] text-xl font-semibold text-foreground sm:text-2xl">
              Available
            </dd>
          </div>
          <div className="text-center">
            <dt className="text-[0.65rem] font-medium tracking-[0.2em] text-muted-foreground uppercase">Age</dt>
            <dd className="mt-2 font-[family-name:var(--font-orbitron)] text-xl font-semibold text-foreground sm:text-2xl">
              {site.age} years
            </dd>
          </div>
          <div className="text-center">
            <dt className="text-[0.65rem] font-medium tracking-[0.2em] text-muted-foreground uppercase">Base</dt>
            <dd className="mt-2 font-[family-name:var(--font-orbitron)] text-xl font-semibold text-foreground sm:text-2xl">
              Sweden
            </dd>
          </div>
        </motion.dl>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap justify-center gap-3"
        >
          {site.hero.ctas.map((cta) =>
            "variant" in cta && cta.variant === "outline" ? (
              <Link
                key={cta.label}
                href={cta.href}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "relative inline-flex h-11 items-center justify-center rounded-xl border-white/15 bg-white/5 px-6 text-sm backdrop-blur-sm transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[2px] hover:border-primary/55 hover:bg-primary/[0.14] hover:shadow-[0_0_44px_rgba(168,85,247,0.38),0_0_28px_rgba(34,211,238,0.18)] active:translate-y-0",
                )}
              >
                {cta.label}
              </Link>
            ) : (
              <Link
                key={cta.label}
                href={cta.href}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "group relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-xl border-0 bg-gradient-to-r from-violet-500 to-cyan-400 px-6 text-sm font-semibold text-slate-950 shadow-[0_0_40px_rgba(168,85,247,0.42)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-white/0 before:via-white/25 before:to-white/0 before:opacity-0 before:transition-opacity before:duration-300 hover:-translate-y-[2px] hover:shadow-[0_0_56px_rgba(168,85,247,0.65),0_0_36px_rgba(34,211,238,0.35),0_14px_40px_rgba(0,0,0,0.2)] hover:brightness-[1.08] hover:before:opacity-100 active:translate-y-0",
                )}
              >
                {cta.label}
                <ArrowRight
                  className="relative size-4 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
                  aria-hidden
                />
              </Link>
            )
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.22, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {heroLinks.map(({ href, icon, name }) => {
            const Icon = socialIcons[icon as keyof typeof socialIcons];
            return (
              <Link
                key={name}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground transition hover:-translate-y-0.5 hover:border-primary/40 hover:text-foreground hover:shadow-[0_0_28px_rgba(168,85,247,0.35)]"
              >
                <Icon className="size-4" aria-hidden />
                <span className="sr-only">{name}</span>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
