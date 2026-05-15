"use client";

import { LogOut } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { signOutAction } from "@/app/(auth)/auth-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { NavSessionUser } from "@/lib/auth-types";
import { cn } from "@/lib/utils";

function initialsFromUser(user: NavSessionUser): string {
  if (user.displayName) {
    const parts = user.displayName.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      const a = parts[0][0];
      const b = parts[parts.length - 1][0];
      if (a && b) return (a + b).toUpperCase();
    }
    if (parts[0]?.length >= 2) return parts[0].slice(0, 2).toUpperCase();
    if (parts[0]?.length === 1) return parts[0].toUpperCase();
  }
  if (user.email) {
    const local = user.email.split("@")[0] ?? user.email;
    return local.slice(0, 2).toUpperCase();
  }
  return "?";
}

type NavbarUserMenuProps = {
  user: NavSessionUser;
};

export function NavbarUserMenu({ user }: NavbarUserMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const initials = initialsFromUser(user);
  const label = user.displayName ?? user.email ?? "Konto";

  useEffect(() => {
    if (!open) return;
    function onDocMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className={cn(
          "cursor-pointer rounded-full ring-2 ring-white/10 transition hover:ring-primary/40 focus-visible:outline-none focus-visible:ring-primary/55",
          open && "ring-primary/45",
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-label={`Konto: ${label}`}
        onClick={() => setOpen((v) => !v)}
      >
        <Avatar size="lg" className="size-10 border border-white/15 bg-white/5">
          {user.avatarUrl ? (
            <AvatarImage src={user.avatarUrl} alt="" referrerPolicy="no-referrer" />
          ) : null}
          <AvatarFallback className="bg-gradient-to-br from-violet-500/25 to-cyan-500/20 text-xs font-medium text-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-[100] w-56 overflow-hidden rounded-xl border border-white/10 bg-background/95 py-1 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl"
        >
          <div className="border-b border-white/10 px-3 py-2">
            {user.displayName ? (
              <p className="truncate text-sm font-medium text-foreground">{user.displayName}</p>
            ) : null}
            {user.email ? (
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            ) : null}
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              role="menuitem"
              className="flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-left text-sm text-foreground transition hover:bg-white/10"
            >
              <LogOut className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              Logga ut
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
