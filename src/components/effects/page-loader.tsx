"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function PageLoader() {
  const [visible, setVisible] = useState(true);
  /**
   * false tills klient läst matchMedia — undvik SSR/klient-mismatch om vi läste reduced motion i render
   * (t.ex. Framer useReducedMotion), vilket kan bryta hydration så useEffect aldrig körs och laddaren fastnar.
   */
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    const ms = mq.matches ? 200 : 900;
    const t = window.setTimeout(() => setVisible(false), ms);
    mq.addEventListener("change", update);
    return () => {
      window.clearTimeout(t);
      mq.removeEventListener("change", update);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[oklch(0.06_0.02_280)]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative flex flex-col items-center gap-4">
            <motion.div
              className="h-14 w-14 rounded-2xl border border-violet-400/40 bg-white/5 shadow-[0_0_60px_rgba(168,85,247,0.35)]"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
              className="h-1 w-32 overflow-hidden rounded-full bg-white/10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div
                className="h-full w-1/2 rounded-full bg-gradient-to-r from-violet-400 to-cyan-300"
                initial={{ x: "-120%" }}
                animate={{ x: reduceMotion ? "-120%" : "220%" }}
                transition={{
                  duration: reduceMotion ? 0.01 : 0.9,
                  repeat: reduceMotion ? 0 : Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>
            <p className="text-xs tracking-[0.35em] text-muted-foreground uppercase">Initierar</p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
