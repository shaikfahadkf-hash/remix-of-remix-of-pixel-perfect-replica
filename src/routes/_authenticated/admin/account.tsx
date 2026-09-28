import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { KeyRound, Mail, User, History } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/account")({
  component: AccountPage,
});

const input =
  "mt-2 w-full rounded-2xl border border-input bg-secondary/50 px-4 py-3 text-sm outline-none focus:border-ring";
const btn =
  "gradient-brand rounded-full px-6 py-3 font-display font-semibold text-primary-foreground disabled:opacity-60";

export function passwordChecks(p: string) {
  return [
    { ok: p.length >= 8, label: "At least 8 characters" },
    { ok: /[A-Z]/.test(p), label: "An uppercase letter" },
    { ok: /[a-z]/.test(p), label: "A lowercase letter" },
    { ok: /\d/.test(p), label: "A number" },
    { ok: /[^A-Za-z0-9]/.test(p), label: "A symbol" },
  ];
}

export function StrengthMeter({ value }: { value: string }) {
  const checks = passwordChecks(value);
  const score = checks.filter((c) => c.ok).length;
  const label = ["Very weak", "Very weak", "Weak", "Fair", "Good", "Strong"][score];
  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full ${i < score ? (score >= 4 ? "bg-primary" : "bg-gold") : "bg-secondary"}`} />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Strength: {label}</p>
      <ul className="grid grid-cols-2 gap-1 text-xs">
        {checks.map((c) => (
          <li key={c.label} className={c.ok ? "text-primary" : "text-muted-foreground"}>
            {c.ok ? "✓" : "○"} {c.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

async function logActivity(action: string, details?: string) {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;
  await supabase.from("admin_activity_log").insert({
    user_id: data.user.id,
    user_email: data.user.email,
    action,
    details: details ?? null,
  });
}

async function verifyCurrent(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return !error;
}

function AccountPage() {
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const [busy, setBusy] = useState<string | null>(null);
  const [newPw, setNewPw] = useState("");
  const email = user.email ?? "";
  const meta = (user.user_metadata ?? {}) as { full_name?: string; phone?: string; designation?: string };

  const log = useQuery({
    queryKey: ["admin-activity"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });
  const refreshLog = () => qc.invalidateQueries({ queryKey: ["admin-activity"] });

  async function saveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const data = {
      full_name: String(f.get("full_name") || "").trim().slice(0, 100),
      phone: String(f.get("phone") || "").trim().slice(0, 20),
      designation: String(f.get("designation") || "").trim().slice(0, 100),
    };
    setBusy("profile");
    const { error } = await supabase.auth.updateUser({ data });
    setBusy(null);
    if (error) return toast.error(error.message);
    await logActivity("Profile updated", data.full_name || undefined);
    refreshLog();
    toast.success("Profile saved");
  }

  async function changeEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const newEmail = String(f.get("new_email")).trim().toLowerCase();
    const current = String(f.get("current"));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail) || newEmail.length > 255) return toast.error("Enter a valid email");
    if (newEmail === email) return toast.error("That's already your email");
    setBusy("email");
    if (!(await verifyCurrent(email, current))) { setBusy(null); return toast.error("Current password is incorrect"); }
    const { error } = await supabase.auth.updateUser(
      { email: newEmail },
      { emailRedirectTo: `${window.location.origin}/admin/account` },
    );
    setBusy(null);
    if (error) return toast.error(error.message);
    await logActivity("Email change requested", `${email} → ${newEmail}`);
    refreshLog();
    form.reset();
    toast.success("Confirmation links sent — confirm from your inbox to finish the change");
  }

  async function changePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const current = String(f.get("current"));
    const confirm = String(f.get("confirm"));
    if (passwordChecks(newPw).some((c) => !c.ok)) return toast.error("New password isn't strong enough");
    if (newPw !== confirm) return toast.error("Passwords don't match");
    if (newPw === current) return toast.error("New password must be different");
    setBusy("pw");
    if (!(await verifyCurrent(email, current))) { setBusy(null); return toast.error("Current password is incorrect"); }
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setBusy(null);
    if (error) return toast.error(error.message);
    await logActivity("Password changed");
    refreshLog();
    form.reset();
    setNewPw("");
    toast.success("Password updated");
  }

  async function sendReset() {
    setBusy("reset");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(null);
    if (error) return toast.error(error.message);
    await logActivity("Password reset email sent");
    refreshLog();
    toast.success(`Reset link sent to ${email}`);
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <p className="section-label">Security</p>
        <h1 className="mt-2 font-display text-3xl font-bold">Admin account settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Signed in as {email}. Only super admins can change login details.</p>
      </div>

      <form onSubmit={saveProfile} className="glass space-y-4 rounded-2xl p-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold"><User className="h-5 w-5" /> Profile information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">Full name<input name="full_name" maxLength={100} defaultValue={meta.full_name ?? ""} className={input} /></label>
          <label className="block text-sm font-medium">Phone<input name="phone" maxLength={20} defaultValue={meta.phone ?? ""} className={input} /></label>
          <label className="block text-sm font-medium sm:col-span-2">Designation<input name="designation" maxLength={100} defaultValue={meta.designation ?? ""} placeholder="e.g. Event Director" className={input} /></label>
        </div>
        <button disabled={busy === "profile"} className={btn}>{busy === "profile" ? "Saving…" : "Save changes"}</button>
      </form>

      <form onSubmit={changeEmail} className="glass space-y-4 rounded-2xl p-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold"><Mail className="h-5 w-5" /> Change email</h2>
        <label className="block text-sm font-medium">New email<input required type="email" name="new_email" maxLength={255} className={input} /></label>
        <label className="block text-sm font-medium">Current password<input required type="password" name="current" autoComplete="current-password" className={input} /></label>
        <button disabled={busy === "email"} className={btn}>{busy === "email" ? "Checking…" : "Save new email"}</button>
      </form>

      <form onSubmit={changePassword} className="glass space-y-4 rounded-2xl p-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold"><KeyRound className="h-5 w-5" /> Change password</h2>
        <label className="block text-sm font-medium">Current password<input required type="password" name="current" autoComplete="current-password" className={input} /></label>
        <label className="block text-sm font-medium">New password
          <input required type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} autoComplete="new-password" className={input} />
          <StrengthMeter value={newPw} />
        </label>
        <label className="block text-sm font-medium">Confirm new password<input required type="password" name="confirm" autoComplete="new-password" className={input} /></label>
        <div className="flex flex-wrap items-center gap-3">
          <button disabled={busy === "pw"} className={btn}>{busy === "pw" ? "Updating…" : "Save new password"}</button>
          <button type="button" onClick={sendReset} disabled={busy === "reset"} className="text-sm text-muted-foreground underline hover:text-foreground">
            Forgot current password? Email me a reset link
          </button>
        </div>
      </form>

      <div className="glass rounded-2xl p-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold"><History className="h-5 w-5" /> Activity log</h2>
        {log.isLoading ? <p className="mt-3 text-sm text-muted-foreground">Loading…</p> : !log.data?.length ? (
          <p className="mt-3 text-sm text-muted-foreground">No account changes yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border text-sm">
            {log.data.map((r) => (
              <li key={r.id} className="flex flex-wrap justify-between gap-2 py-2.5">
                <span><span className="font-medium">{r.action}</span>{r.details ? <span className="text-muted-foreground"> — {r.details}</span> : null}<span className="block text-xs text-muted-foreground">{r.user_email}</span></span>
                <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString("en-IN")}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
