"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import type { GamingPreviewImage } from "@/config/gaming-games";
import { cn } from "@/lib/utils";

type CrosshairPreviewGridProps = {
  items: GamingPreviewImage[];
};

export function CrosshairPreviewGrid({ items }: CrosshairPreviewGridProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (clearTimer.current) clearTimeout(clearTimer.current);
    };
  }, []);

  const copy = useCallback((index: number, text: string | undefined) => {
    if (!text) return;
    if (clearTimer.current) clearTimeout(clearTimer.current);
    void navigator.clipboard.writeText(text).then(
      () => {
        setCopiedIndex(index);
        clearTimer.current = setTimeout(() => {
          setCopiedIndex((i) => (i === index ? null : i));
          clearTimer.current = null;
        }, 1800);
      },
      () => setCopiedIndex(null),
    );
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
      {items.map((p, idx) => {
        const interactive = Boolean(p.copyCommand?.trim());
        const highlight = Boolean(p.highlight);
        const highlightText = p.highlightLabel?.trim() || "Mest använt";
        const inner = (
          <>
            <Image
              src={p.image}
              alt={p.alt}
              width={56}
              height={56}
              className="object-contain"
              unoptimized
            />
            {interactive && copiedIndex === idx ? (
              <span className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-black/75 text-xs font-medium tracking-wide text-cyan-200">
                Kopierat
              </span>
            ) : null}
          </>
        );

        const shellClass = cn(
          "relative flex aspect-square items-center justify-center rounded-xl border bg-zinc-950/80 p-3 shadow-inner transition",
          highlight
            ? "border-cyan-400/55 shadow-[0_0_0_1px_rgba(34,211,238,0.35),0_0_22px_rgba(34,211,238,0.12)]"
            : "border-white/10",
          interactive &&
            "cursor-pointer hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50",
          interactive &&
            (highlight
              ? "hover:border-cyan-300/70 hover:shadow-[0_0_0_1px_rgba(103,232,249,0.45),0_0_26px_rgba(34,211,238,0.16)]"
              : "hover:border-cyan-400/40"),
          !interactive && "opacity-90",
        );

        const badge =
          highlight && copiedIndex !== idx ? (
            <span className="pointer-events-none absolute left-1.5 top-1.5 z-10 max-w-[calc(100%-0.75rem)] truncate rounded-md border border-cyan-400/45 bg-cyan-950/90 px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase leading-none tracking-wide text-cyan-100">
              {highlightText}
            </span>
          ) : null;

        const copyLabel = highlight
          ? `Kopiera konsolkod (${highlightText}): ${p.alt}`
          : `Kopiera konsolkod: ${p.alt}`;

        if (interactive) {
          return (
            <button
              key={`${p.image}-${idx}`}
              type="button"
              className={shellClass}
              aria-label={copyLabel}
              title="Klicka för att kopiera konsolkod"
              onClick={() => copy(idx, p.copyCommand)}
            >
              {badge}
              {inner}
            </button>
          );
        }

        return (
          <div key={`${p.image}-${idx}`} className={shellClass}>
            {badge}
            {inner}
          </div>
        );
      })}
    </div>
  );
}
