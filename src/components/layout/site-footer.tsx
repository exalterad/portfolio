import Link from "next/link";
import { FaDiscord, FaGithub, FaInstagram, FaSteam, FaTwitch } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";

import { site } from "@/config/site";

const iconMap = {
  discord: FaDiscord,
  instagram: FaInstagram,
  tiktok: SiTiktok,
  github: FaGithub,
  steam: FaSteam,
  twitch: FaTwitch,
} as const;

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="shrink-0 border-t border-white/10 bg-black/20 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 text-center sm:flex-row sm:text-left sm:px-6">
        <div className="flex flex-col items-center sm:items-start">
          <p className="font-[family-name:var(--font-orbitron)] text-sm font-semibold tracking-wide text-foreground">
            {site.name}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">© {year} {site.username}. Alla rättigheter förbehållna.</p>
          <p className="mt-4 text-xs">
            <Link
              href="/login"
              className="text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
            >
              Logga in
            </Link>
            <span className="text-muted-foreground"> (endast administratörer)</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {site.social.map((s) => {
            const Icon = iconMap[s.icon as keyof typeof iconMap];
            return (
              <Link
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground transition hover:border-primary/40 hover:text-foreground hover:shadow-[0_0_24px_rgba(168,85,247,0.35)]"
              >
                <Icon className="size-4" aria-hidden />
                <span className="sr-only">{s.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
