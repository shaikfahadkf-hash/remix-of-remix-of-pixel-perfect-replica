import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { passwordChecks, StrengthMeter } from "@/routes/_authenticated/admin/account";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — Pitch Arena 2026" },
      { name: "description", content: "Set a new password for your Pitch Arena 2026 admin account." },
      { property: "og:title", content: "Reset password — Pitch Arena 2026" },
      { property: "og:description", content: "Set a new password for your Pitch Arena 2026 admin account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPage,
});

const input = "mt-2 w-full rounded-2xl border border-input bg-secondary/50 px-4 py-3 text-sm outline-none focus:border-ring";

function ResetPage() {
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (passwordChecks(pw).some((c) => !c.ok)) return toast.error("Password isn't strong enough");
    if (pw !== confirm) return toast.error("Passwords don't match");
    setBusy(true);
    const { data, error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return toast.error(error.message);
    if (data.user) {
      await supabase.from("admin_activity_log").insert({ user_id: data.user.id, user_email: data.user.email ?? null, action: "Password reset via email link" });
    }
    toast.success("Password updated");
    navigate({ to: "/admin" });
  }

  return (
    <div className="hero-aura flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="glass-strong surface-glow w-full max-w-md space-y-4 rounded-3xl p-8">
        <h1 className="font-display text-2xl font-bold">Set a new password</h1>
        <label className="block text-sm font-medium">New password
          <input required type="password" value={pw} onChange={(e) => setPw(e.target.value)} className={input} />
          <StrengthMeter value={pw} />
        </label>
        <label className="block text-sm font-medium">Confirm password
          <input required type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={input} />
        </label>
        <button disabled={busy} className="gradient-brand w-full rounded-full px-6 py-3 font-display font-semibold text-primary-foreground disabled:opacity-60">
          {busy ? "Saving…" : "Save new password"}
        </button>
      </form>
    </div>
  );
}
