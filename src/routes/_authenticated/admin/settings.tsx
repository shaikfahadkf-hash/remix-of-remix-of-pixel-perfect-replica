import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { settingsQuery } from "@/lib/admin-data";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsPage,
});

const input = "mt-2 w-full rounded-2xl border border-input bg-secondary/50 px-4 py-3 text-sm outline-none focus:border-ring";

function toLocal(iso: string) {
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

function SettingsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery(settingsQuery);
  const [saving, setSaving] = useState(false);

  if (isLoading || !data) return <p className="text-muted-foreground">Loading…</p>;

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update({
        fee: Number(f.get("fee")),
        deadline: new Date(String(f.get("deadline"))).toISOString(),
        registrations_open: f.get("open") === "on",
        announcement: String(f.get("announcement") || "").trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);
    setSaving(false);
    if (error) return toast.error("Could not save");
    qc.invalidateQueries({ queryKey: ["site_settings"] });
    toast.success("Settings saved — the website is updated");
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <p className="section-label">Website</p>
        <h1 className="mt-2 font-display text-3xl font-bold">Website settings</h1>
      </div>
      <form onSubmit={save} className="glass space-y-5 rounded-2xl p-6">
        <label className="block text-sm font-medium">
          Registration fee (₹ per team)
          <input name="fee" type="number" min={0} defaultValue={data.fee} className={input} />
        </label>
        <label className="block text-sm font-medium">
          Registration deadline
          <input name="deadline" type="datetime-local" defaultValue={toLocal(data.deadline)} className={input} />
        </label>
        <label className="flex items-center gap-3 text-sm font-medium">
          <input name="open" type="checkbox" defaultChecked={data.registrations_open} className="h-4 w-4" />
          Registrations are open
        </label>
        <label className="block text-sm font-medium">
          Announcement banner (optional)
          <textarea name="announcement" rows={3} defaultValue={data.announcement ?? ""} className={input} placeholder="e.g. Shortlist announced on 10 October" />
        </label>
        <button disabled={saving} className="gradient-brand rounded-full px-6 py-3 font-display font-semibold text-primary-foreground disabled:opacity-60">
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
