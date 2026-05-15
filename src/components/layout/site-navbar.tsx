"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogIn, LogOut, Menu, X } from "lucide-react";

import { signOutAction } from "@/app/(auth)/auth-actions";
import { NavbarUserMenu } from "@/components/layout/navbar-user-menu";
import { site } from "@/config/site";
import { useActiveSection } from "@/hooks/use-active-section";
import type { NavSessionUser } from "@/lib/auth-types";
import { cn } from "@/lib/utils";

const navIds = site.nav.map((n) => n.id);

type SiteNavbarProps = {
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  navUser?: NavSessionUser | null;
};

export function SiteNavbar({ isLoggedIn = false, isAdmin = false, navUser = null }: SiteNavbarProps) {
  const pathname = usePathname();
  const active = useActiveSection(navIds);
  const [open, setOpen] = useState(false);
  const onAuthRoute = pathname === "/login" || pathname === "/register";

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/55 font-sans backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-center px-4 sm:px-6">
        <nav className="hidden items-center gap-1 md:flex">
          {site.nav.map((item) => {
            const isActive = active === item.id;
            return (
              <Link
                key={item.id}
                href={`/#${item.id}`}
                className={cn(
                  "relative px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
                  isActive && "text-foreground",
                )}
              >
                <span className="relative z-10">{item.label}</span>
                {isActive ? (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-violet-400 via-primary to-cyan-400 shadow-[0_0_14px_rgba(168,85,247,0.45)]"
                    transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.55 }}
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-1 sm:right-6">
          {isLoggedIn && isAdmin && navUser ? (
            <NavbarUserMenu user={navUser} />
          ) : isLoggedIn ? (
            <form action={signOutAction}>
              <button
                type="submit"
                className="inline-flex size-10 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:border-white/20 hover:bg-white/10 hover:text-foreground"
                aria-label="Logga ut"
              >
                <LogOut className="size-5" aria-hidden />
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:border-white/20 hover:bg-white/10 hover:text-foreground",
                onAuthRoute && "border-primary/35 text-foreground shadow-[0_0_20px_rgba(168,85,247,0.2)]",
              )}
              aria-label="Logga in"
            >
              <LogIn className="size-5" aria-hidden />
            </Link>
          )}
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-foreground md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
            <span className="sr-only">Meny</span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-white/5 bg-background/90 backdrop-blur-xl md:hidden"
            id="mobile-nav"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 font-sans">
              {site.nav.map((item) => (
                <Link
                  key={item.id}
                  href={`/#${item.id}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "border-b-2 border-transparent px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground",
                    active === item.id && "border-primary text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
