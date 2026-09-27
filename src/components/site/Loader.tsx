import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import logo from "@/assets/sukhf-logo.png.asset.json";
import { Particles } from "./Particles";

export function Loader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 2100);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <div className="hero-aura absolute inset-0" />
          <Particles count={30} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="surface-glow absolute inset-0 rounded-full" />
            <img
              src={logo.url}
              alt="SU Knowledge Hub Foundation"
              className="animate-float relative h-28 w-28 rounded-2xl bg-foreground/95 p-3 sm:h-32 sm:w-32"
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="relative mt-8 font-display text-lg tracking-[0.2em] uppercase text-gradient sm:text-xl"
          >
            Ideas. People. Possibilities.
          </motion.p>
          <div className="relative mt-8 h-px w-48 overflow-hidden bg-border">
            <motion.div
              className="gradient-brand h-full"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.9, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
