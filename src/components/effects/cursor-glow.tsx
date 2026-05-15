"use client";

import { motion, useMotionTemplate, useSpring } from "framer-motion";
import { useEffect } from "react";

export function CursorGlow() {
  const x = useSpring(0, { stiffness: 120, damping: 22, mass: 0.35 });
  const y = useSpring(0, { stiffness: 120, damping: 22, mass: 0.35 });

  useEffect(() => {
    const prefersFine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!prefersFine || reduce) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  const background = useMotionTemplate`radial-gradient(420px circle at ${x}px ${y}px, rgba(168,85,247,0.16), transparent 55%)`;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[2] hidden mix-blend-screen md:block"
      style={{ background }}
    />
  );
}
