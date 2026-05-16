"use client";

import Link from "next/link";
import { ExternalLink, Pencil } from "lucide-react";
import { FaDiscord, FaGithub, FaInstagram, FaSteam, FaTwitch } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";

import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { PortfolioSocialContent, SocialIconId } from "@/lib/social";
import { cn } from "@/lib/utils";

const iconMap = {
  discord: FaDiscord,
  instagram: FaInstagram,
  tiktok: SiTiktok,
  github: FaGithub,
  steam: FaSteam,
  twitch: FaTwitch,
} as const;

const tileTheme: Record<SocialIconId, { glow: string; icon: string; ring: string }> = {
  twitch: {
    glow: "from-[#9146FF]/35 via-[#9146FF]/8 to-transparent",
    icon: "text-[#9146FF]",
    ring: "hover:shadow-[0_0_40px_rgba(145,70,255,0.4)]",
  },
  discord: {
    glow: "from-[#5865F2]/30 via-[#5865F2]/8 to-transparent",
    icon: "text-[#5865F2]",
    ring: "hover:shadow-[0_0_36px_rgba(88,101,242,0.35)]",
  },
  github: {
    glow: "from-white/18 via-white/6 to-transparent",
    icon: "text-foreground",
    ring: "hover:shadow-[0_0_32px_rgba(255,255,255,0.14)]",
  },
  steam: {
    glow: "from-[#66C0F4]/30 via-[#66C0F4]/8 to-transparent",
    icon: "text-[#66C0F4]",
    ring: "hover:shadow-[0_0_36px_rgba(102,192,244,0.32)]",
  },
  instagram: {
    glow: "from-[#E4405F]/30 via-[#E4405F]/8 to-transparent",
    icon: "text-[#E4405F]",
    ring: "hover:shadow-[0_0_36px_rgba(228,64,95,0.32)]",
  },
  tiktok: {
    glow: "from-cyan-400/22 via-fuchsia-500/10 to-transparent",
    icon: "text-foreground",
    ring: "hover:shadow-[0_0_32px_rgba(34,211,238,0.25)]",
  },
};

function handleFromHref(href: string, name: string): string {
  try {
    const url = new URL(href);
    const parts = url.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1];
    if (!last) return name.toLowerCase();
    return last.startsWith("@") ? last : last.replace(/-/g, " ");
  } catch {
    return name.toLowerCase();
  }
}

function SocialIconTile({
  name,
  href,
  icon,
  handle: handleOverride,
}: {
  name: string;
  href: string;
  icon: SocialIconId;
  handle?: string;
}) {
  const Icon = iconMap[icon];
  const theme = tileTheme[icon];
  const handle = handleOverride ?? handleFromHref(href, name);

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${name} — ${handle}`}
      className={cn(
        "group relative z-0 flex h-[5.25rem] w-[5.25rem] shrink-0 flex-row items-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl",
        "transition-[width,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:z-20 hover:w-[13rem] hover:border-primary/40 sm:hover:w-[14rem]",
        theme.ring,
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          theme.glow,
        )}
        aria-hidden
      />

      <ExternalLink
        className={cn(
          "pointer-events-none absolute right-2.5 top-2.5 z-[2] size-3.5 shrink-0 text-muted-foreground opacity-0 transition duration-300",
          "group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-cyan-300/90 group-hover:opacity-100",
        )}
        aria-hidden
      />

      <span
        className={cn(
          "relative z-[1] flex size-[5.25rem] shrink-0 items-center justify-center",
          "border-r border-transparent transition-colors duration-300 group-hover:border-white/10",
        )}
      >
        <span
          className={cn(
            "inline-flex size-12 items-center justify-center rounded-xl border border-white/10 bg-black/30 transition-colors duration-300",
            "group-hover:border-white/20 group-hover:bg-white/[0.06]",
            theme.icon,
          )}
        >
          <Icon className="size-6" aria-hidden />
        </span>
      </span>

      <div
        className={cn(
          "relative z-[1] min-w-0 flex-1 overflow-hidden pr-4 opacity-0 transition-[opacity,margin,padding] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "ml-0 group-hover:ml-4 group-hover:pl-1 group-hover:opacity-100",
        )}
      >
        <p className="truncate font-[family-name:var(--font-orbitron)] text-sm font-semibold tracking-tight text-foreground">
          {name}
        </p>
        <p className="mt-1 truncate text-xs text-muted-foreground">{handle}</p>
      </div>
    </Link>
  );
}

type SocialSectionProps = {
  content: PortfolioSocialContent;
  isAdmin?: boolean;
  supabaseConfigured?: boolean;
};

export function SocialSection({ content, isAdmin = false, supabaseConfigured = false }: SocialSectionProps) {
  return (
    <section id="social" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium tracking-[0.35em] text-violet-300/90 uppercase">{content.eyebrow}</p>
              <h2 className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {content.heading.before}
                <span className="text-gradient">{content.heading.accent}</span>
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {content.description}
              </p>
            </div>
            {isAdmin ? (
              supabaseConfigured ? (
                <Link
                  href="/admin/social/redigera"
                  title="Redigera Socialt"
                  aria-label="Redigera Socialt"
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
                  disabled
                  title="Supabase saknas — kan inte redigera"
                  aria-label="Supabase saknas — kan inte redigera"
                  className="shrink-0 rounded-xl border-white/15 bg-white/5 opacity-60"
                >
                  <Pencil className="size-5" strokeWidth={2.25} />
                </Button>
              )
            ) : null}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.08} className="mt-12">
          <p className="mb-4 text-[0.65rem] font-medium tracking-[0.2em] text-muted-foreground/80 uppercase sm:hidden">
            Hovra för namn
          </p>
          <div className="flex flex-wrap gap-3">
            {content.links.map((link) => (
              <SocialIconTile
                key={link.id}
                name={link.name}
                href={link.href}
                icon={link.icon}
                handle={link.handle}
              />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
