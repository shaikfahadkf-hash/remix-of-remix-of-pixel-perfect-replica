import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { settingsQuery } from "@/lib/admin-data";
import { deadlineInput, parseDeadline } from "@/lib/deadline";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  head: () => ({ meta: [
    { title: "Website settings — Pitch Arena 2026" },
    { name: "description", content: "Manage Pitch Arena registration settings and deadline." },
    { property: "og:title", content: "Website settings — Pitch Arena 2026" },
    { property: "og:description", content: "Manage Pitch Arena registration settings and deadline." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: SettingsPage,
});

const input = "mt-2 w-full rounded-2xl border border-input bg-secondary/50 px-4 py-3 text-sm outline-none focus:border-ring";

function SettingsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery(settingsQuery);
  const [saving, setSaving] = useState(false);

  if (isLoading || !data) return <p className="text-muted-foreground">Loading…</p>;

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setSaving(true);
    try {
    const { data: saved, error } = await supabase
      .from("site_settings")
      .update({
        fee: Number(f.get("fee")),
        deadline: parseDeadline(String(f.get("deadline"))),
        registrations_open: f.get("open") === "on",
        announcement: String(f.get("announcement") || "").trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1).select().single();
    if (error || !saved) throw new Error("Could not save settings. Check your admin access and try again.");
    qc.setQueryData(settingsQuery.queryKey, saved);
    await qc.invalidateQueries({ queryKey: settingsQuery.queryKey });
    toast.success("Settings saved — the website is updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save settings");
    } finally {
      setSaving(false);
    }
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
          Registration deadline (India time)
          <input required name="deadline" type="datetime-local" defaultValue={deadlineInput(data.deadline)} className={input} />
        </label>
        <label className="flex items-center gap-3 text-sm font-medium">
          <input name="open" type="checkbox" defaultChecked={data.registrations_open} className="h-4 w-4" />
          Registrations are open
        </label>
        <label className="block text-sm font-medium">
          Announcement banner (optional)
          <textarea name="announcement" rows={3} defaultValue={data.announcement ?? ""} className={input} placeholder="e.g. Shortlist announced on 10 October" />
        </label>
        <Button disabled={saving} className="gradient-brand rounded-full px-6 py-3 font-display font-semibold text-primary-foreground disabled:opacity-60">
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </form>
    </div>
  );
}
