"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <AnimatePresence>
      {show ? (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          onClick={scrollTop}
          className="fixed bottom-6 right-4 z-50 inline-flex size-12 items-center justify-center rounded-full border border-white/15 bg-background/70 text-foreground shadow-[0_0_40px_rgba(168,85,247,0.25)] backdrop-blur-md transition hover:border-primary/50 hover:shadow-[0_0_48px_rgba(168,85,247,0.45)] sm:right-6"
          aria-label="Till toppen"
        >
          <ArrowUp className="size-5" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
