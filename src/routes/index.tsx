import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Lightbulb,
  Rocket,
  Handshake,
  Users,
  Cpu,
  Globe2,
  FileText,
  Presentation,
  Trophy,
  BadgeCheck,
  Building2,
  GraduationCap,
  IndianRupee,
  Sparkles,
  Phone,
  Mail,
  Globe,
  ChevronDown,
} from "lucide-react";

import rocket from "@/assets/rocket.png";
import { Particles, LightBeams } from "@/components/site/Particles";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { Countdown } from "@/components/site/Countdown";

const TITLE = "Pitch Arena 2026 — Nationwide Startup & Innovation Pitch Competition";
const DESC =
  "Pitch Arena 2026 by SU Knowledge Hub Foundation brings students, innovators and startup teams from across India to pitch before investors and industry experts in Hyderabad.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: Home,
});

const HIGHLIGHTS = [
  { icon: Lightbulb, label: "Innovation", text: "Fresh thinking from any domain, at any stage." },
  { icon: Rocket, label: "Startups", text: "Early teams building products people need." },
  { icon: Handshake, label: "Investors", text: "Direct conversations with people who fund ideas." },
  { icon: Users, label: "Mentorship", text: "Founders and domain experts who sharpen your pitch." },
  { icon: Cpu, label: "Prototypes", text: "Working models, demos and proof of concept." },
  { icon: Globe2, label: "Real-World Impact", text: "Solutions that matter outside the classroom." },
];

const FLOW = [
  {
    step: "01",
    icon: FileText,
    title: "Application & Submission",
    date: "1 – 7 October 2026",
    items: [
      "Idea, product or prototype",
      "Problem statement & solution",
      "Abstract and pitch deck",
      "Team details",
    ],
    note: null,
  },
  {
    step: "02",
    icon: Presentation,
    title: "Startup Mentoring & Pitch Preparation",
    date: "13 – 14 October 2026",
    items: [
      "Expert mentoring and guidance",
      "Business and revenue model support",
      "Pitch deck improvement",
      "Market and customer validation",
      "Mock pitch and Q&A",
    ],
    note: "Selected teams will be intimated on 14 October 2026.",
  },
  {
    step: "03",
    icon: Trophy,
    title: "Investor Pitch & Grand Finale",
    date: "29 October 2026",
    items: [
      "Pitch before investors and industry experts",
      "Final evaluation by the investor and jury panel",
      "Winners announced",
      "Networking, incubation and ecosystem access",
    ],
    note: null,
  },
];

const BENEFITS = [
  "Expert mentorship and guidance",
  "Pitch and business model support",
  "Interaction with investors and industry experts",
  "Industry exposure across sectors",
  "Opportunity for incubation support",
  "Recognition and certificates",
  "Access to SUKHF labs, facilities and ecosystem",
];

const WINNER_PERKS = [
  { title: "Company Registration Support", text: "Paperwork and registration help to get you formally started." },
  { title: "₹1,00,000 Startup Support", text: "Funding support for each of the five winning teams." },
  { title: "Mentorship Access", text: "Continued guidance after the finale, not just on stage." },
  { title: "Investor Introductions", text: "Warm intros to investors who follow your space." },
  { title: "Incubation Support", text: "Workspace, labs and the SUKHF ecosystem behind you." },
];

const SPONSOR_TIERS = [
  { tier: "Title Sponsors", note: "Headline partner for Pitch Arena 2026" },
  { tier: "Powered By", note: "Presenting partners of the finale" },
  { tier: "Education Partners", note: "Institutions backing student innovation" },
  { tier: "Startup Partners", note: "Ecosystem builders and accelerators" },
  { tier: "Community Partners", note: "Networks bringing teams together" },
  { tier: "Media Partners", note: "Coverage across the event journey" },
];

const SUPPORTED_BY = [
  { name: "Muffakham Jah College of Engineering & Technology", short: "MJCET" },
  { name: "Sultan-ul-Uloom College of Pharmacy", short: "SUCP" },
  { name: "Amjad Ali Khan College of Business Administration", short: "AAKCBA" },
  { name: "Sultan-ul-Uloom College of Law", short: "SUCL" },
  { name: "Ghulam Ahmed College of Education", short: "GACE" },
];

const FAQS = [
  {
    q: "Who can apply to Pitch Arena 2026?",
    a: "Students, individual innovators and startup teams from anywhere in India. Ideas from any domain are welcome — good ideas have no boundaries.",
  },
  {
    q: "Do I need a working product to apply?",
    a: "No. An idea with a clear problem statement is enough to start. Prototypes and early products are equally welcome.",
  },
  {
    q: "What is the registration fee?",
    a: "₹499 per team. It covers the mentoring sessions, the pitch preparation days and the grand finale.",
  },
  {
    q: "How big can a team be?",
    a: "Teams of one to five members work best. Mention every member in your application so we can plan mentoring sessions.",
  },
  {
    q: "When will I know if my team is selected?",
    a: "Shortlisted teams are informed on 14 October 2026, after the mentoring and pitch preparation rounds.",
  },
  {
    q: "Where does the grand finale take place?",
    a: "In Hyderabad, on 29 October 2026, in front of an investor and industry jury panel. Venue details go out to selected teams.",
  },
];

function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <section className="relative -mt-24 pt-32 pb-16 sm:pb-24">
        <div className="hero-aura absolute inset-0" />
        <LightBeams />
        <Particles count={22} />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs tracking-[0.18em] uppercase text-muted-foreground"
            >
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              SUKHF presents
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.7 }}
              className="mt-5 text-4xl leading-[1.05] font-bold sm:text-6xl lg:text-7xl"
            >
              Pitch <span className="text-gradient">Arena</span> 2026
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.7 }}
              className="mt-4 font-display text-lg text-foreground/90 sm:text-xl"
            >
              Nationwide Startup &amp; Innovation Pitch Competition
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36, duration: 0.7 }}
              className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-display text-base font-semibold sm:text-lg"
            >
              <span className="text-azure">Think.</span>
              <span className="text-cyan">Innovate.</span>
              <span className="text-violet">Pitch.</span>
              <span className="text-gold">Transform.</span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.44, duration: 0.7 }}
              className="mt-4 max-w-xl text-muted-foreground"
            >
              Ideas today. Impact tomorrow. Bring your idea, prototype or startup to
              Hyderabad and pitch it to mentors, industry experts and investors.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.52, duration: 0.7 }}
              className="mt-9 flex flex-wrap gap-3"
            >
              <Link
                to="/register"
                className="btn-shimmer surface-glow rounded-full px-7 py-3.5 font-display font-semibold text-primary-foreground transition-transform hover:scale-105"
              >
                Register Now
              </Link>
              <Link
                to="/"
                hash="event-flow"
                className="glass rounded-full px-7 py-3.5 font-display font-semibold transition-colors hover:bg-secondary/70"
              >
                See the event flow
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.9 }}
            className="relative mx-auto max-w-sm lg:max-w-none"
          >
            <div className="surface-glow absolute inset-8 rounded-full blur-2xl" />
            <img
              src={rocket}
              alt="A rocket launching inside a lightbulb"
              width={1024}
              height={1280}
              className="animate-float relative w-full"
            />
          </motion.div>
        </div>

        <div className="relative mx-auto mt-16 max-w-7xl px-4 sm:px-6">
          <Countdown />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading
          label="About Pitch Arena"
          title={
            <>
              A national stage for ideas that <span className="text-gradient">deserve backing</span>
            </>
          }
          description="Pitch Arena connects innovators, startups, mentors, investors and industry leaders in one place, so a good idea has a real path from a slide deck to something people use."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {HIGHLIGHTS.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.06}>
              <div className="glass surface-lift group h-full rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1.5">
                <div className="gradient-brand inline-flex rounded-2xl p-3">
                  <item.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{item.label}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* EVENT FLOW */}
      <section id="event-flow" className="relative py-20">
        <LightBeams />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            label="Event flow & key dates"
            title="Three stages, one month"
            description="From your first submission to the investor finale, here is exactly what happens and when."
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {FLOW.map((stage, i) => (
              <Reveal key={stage.step} delay={i * 0.1}>
                <div className="glass surface-lift flex h-full flex-col rounded-3xl p-7">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-display text-4xl font-bold text-gradient">
                      {stage.step}
                    </span>
                    <div className="gradient-brand rounded-2xl p-3">
                      <stage.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold">{stage.title}</h3>
                  <p className="mt-2 font-display text-sm font-semibold text-cyan">
                    {stage.date}
                  </p>
                  <ul className="mt-5 grid gap-2.5 text-sm text-muted-foreground">
                    {stage.items.map((it) => (
                      <li key={it} className="flex gap-2.5">
                        <span className="gradient-brand mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                        {it}
                      </li>
                    ))}
                  </ul>
                  {stage.note && (
                    <p className="mt-5 rounded-2xl bg-secondary/70 px-4 py-3 text-sm font-medium">
                      {stage.note}
                    </p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHO CAN APPLY + BENEFITS */}
      <section id="benefits" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <div className="glass surface-lift h-full rounded-3xl p-8">
              <p className="section-label">Who can apply</p>
              <h3 className="mt-3 font-display text-2xl font-bold">
                Students, innovators and startup teams from across India
              </h3>
              <p className="mt-4 text-sm text-muted-foreground">
                Open to innovative ideas, prototypes and startup concepts from any domain
                — engineering, pharmacy, business, law, education, or something nobody has
                tried yet.
              </p>
              <div className="mt-7 flex items-center gap-3 rounded-2xl bg-secondary/70 p-4">
                <Globe2 className="h-8 w-8 shrink-0 text-cyan" />
                <p className="font-display font-semibold">Good ideas have no boundaries</p>
              </div>
              <div className="mt-7 grid grid-cols-3 gap-3 text-center">
                {[
                  { icon: GraduationCap, label: "Students" },
                  { icon: Lightbulb, label: "Innovators" },
                  { icon: Rocket, label: "Startups" },
                ].map((g) => (
                  <div key={g.label} className="rounded-2xl border border-border p-4">
                    <g.icon className="mx-auto h-5 w-5 text-violet" />
                    <p className="mt-2 text-xs text-muted-foreground">{g.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="glass surface-lift h-full rounded-3xl p-8">
              <p className="section-label">What you get</p>
              <h3 className="mt-3 font-display text-2xl font-bold">
                Support that continues after the pitch
              </h3>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {BENEFITS.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 rounded-2xl bg-secondary/50 p-4 text-sm"
                  >
                    <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />
                    <span className="text-muted-foreground">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* WINNER OPPORTUNITIES */}
      <section className="relative py-20">
        <div className="hero-aura absolute inset-0 opacity-70" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            label="5 special winner opportunities"
            title={
              <>
                Five teams. <span className="text-gradient">₹1,00,000 each.</span>
              </>
            }
            description="Winning teams get funding support plus the practical help needed to turn a pitch into a registered, funded company."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WINNER_PERKS.map((perk, i) => (
              <Reveal key={perk.title} delay={i * 0.07}>
                <div className="glass surface-lift h-full rounded-3xl border-gold/25 p-6 transition-transform duration-300 hover:-translate-y-1.5">
                  <Trophy className="h-6 w-6 text-gold" />
                  <h3 className="mt-4 font-display text-lg font-semibold">{perk.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{perk.text}</p>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.35}>
              <div className="glass-strong surface-glow flex h-full flex-col justify-between rounded-3xl p-6">
                <div>
                  <p className="section-label">Registration fee</p>
                  <div className="mt-3 flex items-center gap-1">
                    <IndianRupee className="h-7 w-7 text-cyan" />
                    <span className="font-display text-5xl font-bold">499</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">per team</p>
                </div>
                <Link
                  to="/register"
                  className="btn-shimmer mt-6 rounded-full px-6 py-3 text-center font-display font-semibold text-primary-foreground transition-transform hover:scale-105"
                >
                  Register your team
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SPONSORS */}
      <SponsorsSection />

      {/* SUPPORTED BY */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeading label="Supported by" title="Backed by the Sultan-ul-Uloom institutions" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {SUPPORTED_BY.map((c, i) => (
            <Reveal key={c.short} delay={i * 0.05}>
              <div className="glass h-full rounded-2xl p-5 text-center">
                <Building2 className="mx-auto h-5 w-5 text-azure" />
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{c.name}</p>
                <p className="mt-2 font-display text-sm font-bold text-gradient">{c.short}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
        <SectionHeading label="FAQ" title="Questions teams ask us" />
        <div className="mt-12 grid gap-3">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.05}>
              <details className="glass group rounded-2xl px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-display font-semibold">
                  {f.q}
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative py-20">
        <Particles count={16} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            label="Contact"
            title="Talk to the Pitch Arena team"
            description="Questions about eligibility, submissions or sponsorship? Call or write to us — we reply on working days."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {[
              {
                icon: Phone,
                label: "Phone",
                lines: ["040-23280301", "040-23280305"],
                href: "tel:04023280301",
              },
              {
                icon: Mail,
                label: "Email",
                lines: ["ceo@suknowledge.org"],
                href: "mailto:ceo@suknowledge.org",
              },
              {
                icon: Globe,
                label: "Website",
                lines: ["www.suknowledge.org"],
                href: "https://www.suknowledge.org",
              },
            ].map((c, i) => (
              <Reveal key={c.label} delay={i * 0.08}>
                <a
                  href={c.href}
                  className="glass surface-lift block h-full rounded-3xl p-7 transition-transform duration-300 hover:-translate-y-1.5"
                >
                  <div className="gradient-brand inline-flex rounded-2xl p-3">
                    <c.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <p className="mt-4 section-label">{c.label}</p>
                  {c.lines.map((l) => (
                    <p key={l} className="mt-1 font-display font-semibold break-words">
                      {l}
                    </p>
                  ))}
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
