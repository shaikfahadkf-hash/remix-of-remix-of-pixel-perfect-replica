import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Sparkles, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { groupVisible, sponsorsQuery, type Sponsor, type SponsorCategory } from "@/lib/sponsors";
import { Particles } from "./Particles";
import { Reveal, SectionHeading } from "./Reveal";

export function SponsorsSection() {
  const { data } = useQuery(sponsorsQuery);
  return <SponsorsView categories={data?.categories ?? []} sponsors={data?.sponsors ?? []} />;
}

export function SponsorsView({
  categories,
  sponsors,
  preview = false,
}: {
  categories: SponsorCategory[];
  sponsors: Sponsor[];
  preview?: boolean;
}) {
  const groups = groupVisible(categories, sponsors);

  if (!groups.length) {
    return (
      <section id={preview ? undefined : "sponsors"} className="relative overflow-hidden px-4 py-16 sm:py-24">
        <Particles count={14} />
        <div className="relative mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7 }}
            className="glass-strong relative overflow-hidden rounded-[2rem] px-6 py-12 text-center sm:px-12 sm:py-16"
          >
            <div className="hero-aura absolute inset-0 opacity-80" />
            <motion.div
              animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              className="surface-glow absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            />
            <div className="relative">
              <p className="section-label">Sponsors &amp; Partners</p>
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="gradient-brand mx-auto mt-6 inline-flex rounded-2xl p-4"
              >
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </motion.div>
              <h2 className="mt-6 font-display text-3xl font-bold sm:text-5xl">
                Sponsors <span className="text-gradient">Coming Soon</span>
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm text-muted-foreground sm:text-base">
                We are onboarding leading brands, institutions, investors and ecosystem partners.
              </p>
              {!preview && (
                <a
                  href="mailto:ceo@suknowledge.org?subject=Pitch%20Arena%202026%20Sponsorship"
                  className="glass mt-8 inline-flex rounded-full px-6 py-3 font-display text-sm font-semibold hover:bg-secondary/70"
                >
                  Become a sponsor
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id={preview ? undefined : "sponsors"} className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading label="Sponsors & partners" title="Backed by people who build" />
      <div className="mt-12 grid gap-12">
        {groups.map((g) => (
          <Reveal key={g.id}>
            <h3 className="text-center font-display text-lg font-semibold text-foreground/90">{g.name}</h3>
            <SponsorRow items={g.items} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function SponsorRow({ items }: { items: Sponsor[] }) {
  const sorted = [...items].sort((a, b) => Number(b.featured) - Number(a.featured) || a.sort_order - b.sort_order);
  return (
    <div className="-mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
      {sorted.map((s, i) => (
        <motion.a
          key={s.id}
          href={s.website_url || undefined}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => s.website_url && supabase.rpc("track_sponsor_click", { _id: s.id })}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ y: -6 }}
          whileTap={{ scale: 0.97 }}
          className={`glass surface-lift relative flex shrink-0 snap-center flex-col items-center justify-center gap-3 rounded-3xl p-5 ${
            s.featured ? "h-40 w-64 border-gold/40 surface-glow" : "h-32 w-48"
          }`}
        >
          {s.featured && <Star className="absolute right-3 top-3 h-4 w-4 fill-gold text-gold" />}
          {s.signed ? (
            <img
              src={s.signed}
              alt={s.name}
              loading="lazy"
              className="max-h-16 max-w-full object-contain"
              onError={(event) => { event.currentTarget.hidden = true; }}
            />
          ) : (
            <span className="font-display text-lg font-bold text-gradient">{s.name}</span>
          )}
          <span className="text-xs text-muted-foreground">{s.name}</span>
        </motion.a>
      ))}
    </div>
  );
}
