import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import logo from "@/assets/sukhf-logo.png.asset.json";

const NAV = [
  { label: "Home", hash: "top" },
  { label: "About", hash: "about" },
  { label: "Event Flow", hash: "event-flow" },
  { label: "Benefits", hash: "benefits" },
  { label: "Sponsors", hash: "sponsors" },
  { label: "FAQ", hash: "faq" },
  { label: "Contact", hash: "contact" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-strong py-2" : "py-4"
      }`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img
            src={logo.url}
            alt="SU Knowledge Hub Foundation"
            className="h-11 w-11 shrink-0 rounded-xl bg-foreground/95 p-1"
          />
          <span className="min-w-0">
            <span className="block truncate font-display text-sm font-bold sm:text-base">
              Pitch Arena 2026
            </span>
            <span className="block truncate text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
              SU Knowledge Hub Foundation
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.hash}
                to="/"
                hash={item.hash}
                className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            to="/register"
            className="btn-shimmer surface-glow hidden rounded-full px-5 py-2.5 font-display text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 sm:inline-flex"
          >
            Register Now
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="rounded-xl border border-border p-2 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.97 }}
          transition={{ duration: 0.22 }}
          className="glass-strong mx-4 mt-2 max-h-[75vh] overflow-y-auto rounded-2xl p-3 lg:hidden"
        >
          <nav className="grid gap-1">
            {NAV.map((item) => (
              <Link
                key={item.hash}
                to="/"
                hash={item.hash}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-base text-muted-foreground active:bg-secondary/70 hover:bg-secondary/70 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/register"
              onClick={() => setOpen(false)}
              className="gradient-brand mt-1 rounded-xl px-3 py-2.5 text-center font-display text-sm font-semibold text-primary-foreground"
            >
              Register Now
            </Link>
          </nav>
        </motion.div>
      )}
      </AnimatePresence>
    </header>
  );
}
