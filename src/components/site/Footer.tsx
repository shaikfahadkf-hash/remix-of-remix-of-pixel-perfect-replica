import { Link } from "@tanstack/react-router";
import { Mail, Phone, Globe } from "lucide-react";
import logo from "@/assets/sukhf-logo.png.asset.json";
import skyline from "@/assets/skyline.jpg";

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-border">
      <img
        src={skyline}
        alt=""
        aria-hidden
        loading="lazy"
        width={1920}
        height={640}
        className="pointer-events-none absolute bottom-0 left-0 w-full opacity-45"
      />
      <div className="relative mx-auto max-w-7xl px-4 pt-14 pb-10 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={logo.url}
                alt="SU Knowledge Hub Foundation"
                loading="lazy"
                className="h-12 w-12 rounded-xl bg-foreground/95 p-1"
              />
              <div>
                <p className="font-display font-bold">SU Knowledge Hub Foundation</p>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Innovate · Incubate · Impact
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm text-muted-foreground">
              Pitch Arena 2026 is a nationwide startup and innovation pitch competition
              hosted in Hyderabad, where ideas meet opportunities.
            </p>
          </div>

          <div>
            <p className="section-label">Explore</p>
            <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
              <Link to="/" hash="about" className="hover:text-foreground">
                About
              </Link>
              <Link to="/" hash="event-flow" className="hover:text-foreground">
                Event Flow
              </Link>
              <Link to="/" hash="benefits" className="hover:text-foreground">
                Benefits
              </Link>
              <Link to="/" hash="sponsors" className="hover:text-foreground">
                Sponsors
              </Link>
              <Link to="/register" className="hover:text-foreground">
                Registration
              </Link>
            </div>
          </div>

          <div>
            <p className="section-label">Reach us</p>
            <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
              <a href="tel:04023280301" className="flex items-center gap-2 hover:text-foreground">
                <Phone className="h-4 w-4 shrink-0 text-azure" /> 040-23280301
              </a>
              <a href="tel:04023280305" className="flex items-center gap-2 hover:text-foreground">
                <Phone className="h-4 w-4 shrink-0 text-azure" /> 040-23280305
              </a>
              <a
                href="mailto:ceo@suknowledge.org"
                className="flex items-center gap-2 hover:text-foreground"
              >
                <Mail className="h-4 w-4 shrink-0 text-violet" /> ceo@suknowledge.org
              </a>
              <a
                href="https://www.suknowledge.org"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 hover:text-foreground"
              >
                <Globe className="h-4 w-4 shrink-0 text-cyan" /> www.suknowledge.org
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 border-t border-border pt-6 text-center">
          <p className="font-display text-sm tracking-[0.25em] uppercase text-gradient">
            Innovate • Inspire • Create Impact
          </p>
          <p className="text-xs text-muted-foreground">
            © 2026 SU Knowledge Hub Foundation. Hyderabad — where ideas meet
            opportunities.
          </p>
        </div>
      </div>
    </footer>
  );
}
