"use client";

import { motion, useReducedMotion } from "framer-motion";

export function AmbientBlobs() {
  const reduce = useReducedMotion();
  const duration = reduce ? 0 : 22;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-violet-600/25 blur-[120px]"
        animate={reduce ? undefined : { x: [0, 40, -20, 0], y: [0, 30, 10, 0] }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-120px] top-1/3 h-[380px] w-[380px] rounded-full bg-cyan-500/20 blur-[110px]"
        animate={reduce ? undefined : { x: [0, -50, 20, 0], y: [0, -20, 25, 0] }}
        transition={{ duration: duration * 1.1, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-80px] left-1/3 h-[360px] w-[360px] rounded-full bg-fuchsia-500/15 blur-[100px]"
        animate={reduce ? undefined : { scale: [1, 1.08, 0.96, 1] }}
        transition={{ duration: duration * 0.9, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
