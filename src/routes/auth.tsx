import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import logo from "@/assets/sukhf-logo.png.asset.json";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin sign in — Pitch Arena 2026" },
      { name: "description", content: "Sign in to the Pitch Arena 2026 admin dashboard." },
      { property: "og:title", content: "Admin sign in — Pitch Arena 2026" },
      { property: "og:description", content: "Sign in to the Pitch Arena 2026 admin dashboard." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const input =
  "mt-2 w-full rounded-2xl border border-input bg-secondary/50 px-4 py-3 text-sm outline-none focus:border-ring";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email"));
    const password = String(f.get("password"));
    setBusy(true);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) { toast.error(error.message); return; }
      navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      setBusy(false);
      if (error) { toast.error(error.message); return; }
      setSent(true);
    }
  }

  return (
    <div className="hero-aura flex min-h-screen items-center justify-center px-4">
      <div className="glass-strong surface-glow w-full max-w-md rounded-3xl p-8">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo.url} alt="SUKHF" className="h-11 w-11 rounded-full object-contain" />
          <div>
            <p className="font-display font-bold">Pitch Arena 2026</p>
            <p className="text-xs text-muted-foreground">Admin dashboard</p>
          </div>
        </Link>
        {sent ? (
          <p className="mt-8 text-sm text-muted-foreground">
            Check your inbox and click the confirmation link, then come back and sign in.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-4">
            <h1 className="font-display text-2xl font-bold">
              {mode === "in" ? "Sign in" : "Create admin account"}
            </h1>
            <label className="block text-sm font-medium">
              Email
              <input required type="email" name="email" className={input} />
            </label>
            <label className="block text-sm font-medium">
              Password
              <input required type="password" name="password" minLength={8} className={input} />
            </label>
            <button
              disabled={busy}
              className="gradient-brand w-full rounded-full px-6 py-3 font-display font-semibold text-primary-foreground disabled:opacity-60"
            >
              {busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}
            </button>
            <button
              type="button"
              onClick={() => setMode(mode === "in" ? "up" : "in")}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
            >
              {mode === "in" ? "First time? Create the admin account" : "Have an account? Sign in"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
