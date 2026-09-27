import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { IndianRupee, CheckCircle2, Upload } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { Particles } from "@/components/site/Particles";

const TITLE = "Register your team — Pitch Arena 2026";
const DESC =
  "Register your team for Pitch Arena 2026. Fee ₹499 per team. Submit team details, your startup stage and your pitch deck before 7 October 2026.";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
  }),
  component: RegisterPage;
});

const inputClass =
  "mt-2 w-full rounded-2xl border border-input bg-secondary/50 px-4 py-3 text-sm outline-none transition-colors focus:border-ring";

function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="relative">
      <div className="hero-aura absolute inset-0" />
      <Particles count={18} />
      <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <Reveal className="text-center">
          <p className="section-label">Registration</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-5xl">
            Register for <span className="text-gradient">Pitch Arena 2026</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Applications are open from 1 to 7 October 2026. Fill in your team details and
            attach your pitch deck — we confirm by email.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-10">
          <div className="glass-strong surface-glow mx-auto flex max-w-md items-center justify-between gap-4 rounded-3xl p-6">
            <div>
              <p className="section-label">Registration fee</p>
              <div className="mt-2 flex items-center gap-1">
                <IndianRupee className="h-6 w-6 text-cyan" />
                <span className="font-display text-4xl font-bold">499</span>
              </div>
            </div>
            <p className="text-right text-sm text-muted-foreground">
              per team
              <br />
              all rounds included
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.14} className="mt-10">
          {submitted ? (
            <div className="glass surface-lift mx-auto max-w-2xl rounded-3xl p-10 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-cyan" />
              <h2 className="mt-5 font-display text-2xl font-bold">Details received</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Thanks — your team details have been noted. Our team will email you the
                payment and confirmation steps. For anything urgent, call 040-23280301.
              </p>
              <Link
                to="/"
                className="gradient-brand mt-7 inline-flex rounded-full px-6 py-3 font-display font-semibold text-primary-foreground"
              >
                Back to home
              </Link>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="glass surface-lift rounded-3xl p-6 sm:p-9"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm font-medium">
                  Team name
                  <input required name="team" className={inputClass} placeholder="e.g. Terra Labs" />
                </label>
                <label className="block text-sm font-medium">
                  Team leader
                  <input required name="leader" className={inputClass} placeholder="Full name" />
                </label>
                <label className="block text-sm font-medium">
                  Email
                  <input
                    required
                    type="email"
                    name="email"
                    className={inputClass}
                    placeholder="you@example.com"
                  />
                </label>
                <label className="block text-sm font-medium">
                  Phone
                  <input
                    required
                    type="tel"
                    name="phone"
                    className={inputClass}
                    placeholder="10-digit mobile number"
                  />
                </label>
                <label className="block text-sm font-medium sm:col-span-2">
                  College or organisation
                  <input
                    required
                    name="org"
                    className={inputClass}
                    placeholder="Institution or company name"
                  />
                </label>
                <label className="block text-sm font-medium">
                  Startup stage
                  <select required name="stage" defaultValue="" className={inputClass}>
                    <option value="" disabled>
                      Select a stage
                    </option>
                    <option>Idea</option>
                    <option>Prototype</option>
                    <option>Early revenue</option>
                    <option>Registered startup</option>
                  </select>
                </label>
                <label className="block text-sm font-medium">
                  Team size
                  <select required name="size" defaultValue="" className={inputClass}>
                    <option value="" disabled>
                      Select team size
                    </option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </select>
                </label>
                <div className="sm:col-span-2">
                  <span className="text-sm font-medium">Pitch deck</span>
                  <label className="mt-2 flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-border bg-secondary/40 px-4 py-5 text-sm text-muted-foreground hover:bg-secondary/70">
                    <Upload className="h-5 w-5 shrink-0 text-violet" />
                    <span>{fileName ?? "Attach a PDF or PPT (max 20 MB)"}</span>
                    <input
                      type="file"
                      name="deck"
                      accept=".pdf,.ppt,.pptx"
                      className="hidden"
                      onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                    />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="btn-shimmer surface-glow mt-8 w-full rounded-full px-6 py-4 font-display font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                Submit registration
              </button>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                By submitting you agree to be contacted about Pitch Arena 2026.
              </p>
            </form>
          )}
        </Reveal>
      </div>
    </div>
  );
}
