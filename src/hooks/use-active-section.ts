"use client";

import { useEffect, useState } from "react";

import type { NavId } from "@/config/site";

export function useActiveSection(sectionIds: readonly NavId[]) {
  const [active, setActive] = useState<NavId>(sectionIds[0]);

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];
        if (visible?.target?.id) setActive(visible.target.id as NavId);
      },
      { root: null, rootMargin: "-42% 0px -42% 0px", threshold: [0.05, 0.15, 0.35, 0.55] }
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [sectionIds]);

  return active;
}
