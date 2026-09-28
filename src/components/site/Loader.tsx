import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Particles } from "./Particles";
import { BrandImage } from "./BrandImage";

export function Loader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 2600);
    return () => clearTimeout(t);
  }, []);

  const logo = "relative h-24 w-24 object-contain sm:h-32 sm:w-32";

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background px-4"
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          <div className="hero-aura absolute inset-0" />
          <Particles count={30} />
          <div className="relative flex items-center gap-4 sm:gap-8">
            <div className="surface-glow absolute inset-0 rounded-full opacity-60 blur-2xl" />
            <motion.div
              className={logo}
              initial={{ opacity: 0, x: -30, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <BrandImage brand="sukhf" alt="SU Knowledge Hub Foundation" className="h-full w-full object-contain" decoding="async" fetchPriority="high" />
            </motion.div>
            <motion.span
              className="relative font-display text-2xl font-light text-muted-foreground"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              ×
            </motion.span>
            <motion.div
              className={logo}
              initial={{ opacity: 0, x: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <BrandImage brand="sues" alt="Sultan-ul-Uloom Education Society" className="h-full w-full object-contain" decoding="async" fetchPriority="high" />
            </motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="relative mt-8 text-center font-display text-base tracking-[0.2em] uppercase text-gradient sm:text-xl"
          >
            Powering Innovation Together
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.7 }}
            className="relative mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl"
          >
            Pitch Arena 2026
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
