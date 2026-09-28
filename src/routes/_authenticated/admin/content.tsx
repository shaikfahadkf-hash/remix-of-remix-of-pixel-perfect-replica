import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { websiteContentQuery } from "@/lib/content";

export const Route = createFileRoute("/_authenticated/admin/content")({
  head: () => ({ meta: [{ title: "Website content — Admin · Pitch Arena 2026" }, { name: "robots", content: "noindex" }] }),
  component: ContentPage,
});

function ContentPage() {
  const qc = useQueryClient();
  const q = useQuery(websiteContentQuery);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (q.data) setValues(Object.fromEntries(q.data.map((r) => [r.key, r.value])));
  }, [q.data]);

  async function save() {
    setSaving(true);
    const rows = (q.data ?? []).map((r) => ({ key: r.key, label: r.label, value: values[r.key] ?? "" }));
    const { error } = await (supabase.from("website_content" as any) as any).upsert(rows);
    setSaving(false);
    if (error) return void toast.error(error.message);
    const { data } = await supabase.auth.getUser();
    if (data.user) await supabase.from("admin_activity_log").insert({ user_id: data.user.id, user_email: data.user.email ?? null, action: "Updated website content", details: null });
    toast.success("Saved — live on the website");
    qc.invalidateQueries({ queryKey: ["website_content"] });
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Website content</h1>
        <p className="text-sm text-muted-foreground">Edit the text shown on the public website.</p>
      </div>
      <div className="glass space-y-4 rounded-2xl p-6">
        {(q.data ?? []).map((r) => (
          <label key={r.key} className="block text-sm">
            <span className="mb-1 block font-medium">{r.label ?? r.key}</span>
            {(values[r.key] ?? "").length > 80 || r.key.endsWith("_text") ? (
              <textarea rows={4} value={values[r.key] ?? ""} onChange={(e) => setValues({ ...values, [r.key]: e.target.value })} className="w-full rounded-xl border border-border bg-background px-3 py-2" />
            ) : (
              <input value={values[r.key] ?? ""} onChange={(e) => setValues({ ...values, [r.key]: e.target.value })} className="w-full rounded-xl border border-border bg-background px-3 py-2" />
            )}
          </label>
        ))}
        <button onClick={save} disabled={saving} className="gradient-brand rounded-full px-6 py-3 font-semibold text-primary-foreground disabled:opacity-60">
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
