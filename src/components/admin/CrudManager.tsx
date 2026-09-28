import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { TABLES, tableQuery, uploadMedia, type Row, type TableKey } from "@/lib/content";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

async function log(action: string, details: string) {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;
  await supabase.from("admin_activity_log").insert({ user_id: data.user.id, user_email: data.user.email, action, details });
}

export function CrudManager({ table }: { table: TableKey }) {
  const cfg = TABLES[table];
  const qc = useQueryClient();
  const q = useQuery(tableQuery(table));
  const [editing, setEditing] = useState<Partial<Row> | null>(null);
  const [saving, setSaving] = useState(false);
  const db = () => supabase.from(table as any) as any;
  const refresh = () => qc.invalidateQueries({ queryKey: ["content", table] });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const payload: Record<string, any> = {};
      cfg.fields.forEach((f) => {
        const v = editing[f.key];
        payload[f.key] = f.type === "number" ? (v === "" || v == null ? null : Number(v)) : v || null;
      });
      if (editing.id) {
        const { error } = await db().update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        payload.sort_order = (q.data?.length ?? 0) + 1;
        const { error } = await db().insert(payload);
        if (error) throw error;
      }
      await log(`${editing.id ? "Updated" : "Added"} ${cfg.singular}`, String(payload[cfg.primary] ?? ""));
      toast.success("Saved — live on the website");
      setEditing(null);
      refresh();
    } catch (err: any) {
      toast.error(err.message ?? "Could not save");
    } finally {
      setSaving(false);
    }
  }

  async function patch(r: Row, values: Record<string, any>) {
    const { error } = await db().update(values).eq("id", r.id);
    if (error) toast.error(error.message);
    refresh();
  }
  async function remove(r: Row) {
    if (!confirm(`Delete this ${cfg.singular}?`)) return;
    const { error } = await db().delete().eq("id", r.id);
    if (error) return void toast.error(error.message);
    await log(`Deleted ${cfg.singular}`, String(r[cfg.primary] ?? ""));
    refresh();
  }
  async function move(i: number, dir: -1 | 1) {
    const rows = q.data ?? [];
    const j = i + dir;
    if (j < 0 || j >= rows.length) return;
    await Promise.all([
      db().update({ sort_order: j }).eq("id", rows[i].id),
      db().update({ sort_order: i }).eq("id", rows[j].id),
    ]);
    refresh();
  }

  const rows = q.data ?? [];
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">{cfg.title}</h1>
          <p className="text-sm text-muted-foreground">{rows.length} total · changes appear on the website instantly</p>
        </div>
        <button onClick={() => setEditing({})} className="gradient-brand text-primary-foreground inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold">
          <Plus className="h-4 w-4" /> Add {cfg.singular}
        </button>
      </div>

      {q.isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-muted-foreground">Nothing here yet. Add your first {cfg.singular}.</div>
      ) : (
        <div className="grid gap-3">
          {rows.map((r, i) => (
            <div key={r.id} className={`glass flex items-center gap-4 rounded-2xl p-3 ${r.visible ? "" : "opacity-60"}`}>
              {r.signed ? (
                <img src={r.signed} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
              ) : (
                <div className="h-14 w-14 shrink-0 rounded-xl bg-secondary" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{r[cfg.primary] || "Untitled"}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {[r.designation, r.organization, r.position, r.prize, r.caption, r.description].filter(Boolean).join(" · ")}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <IconBtn label="Move up" onClick={() => move(i, -1)}><ArrowUp className="h-4 w-4" /></IconBtn>
                <IconBtn label="Move down" onClick={() => move(i, 1)}><ArrowDown className="h-4 w-4" /></IconBtn>
                <IconBtn label={r.visible ? "Hide" : "Show"} onClick={() => patch(r, { visible: !r.visible })}>
                  {r.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </IconBtn>
                <IconBtn label="Edit" onClick={() => setEditing(r)}><Pencil className="h-4 w-4" /></IconBtn>
                <IconBtn label="Delete" onClick={() => remove(r)}><Trash2 className="h-4 w-4 text-destructive" /></IconBtn>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit" : "Add"} {cfg.singular}</DialogTitle>
          </DialogHeader>
          {editing && (
            <form onSubmit={save} className="space-y-4">
              {cfg.fields.map((f) => (
                <label key={f.key} className="block text-sm">
                  <span className="mb-1 block font-medium">{f.label}{f.required && " *"}</span>
                  {f.type === "textarea" ? (
                    <textarea rows={3} value={editing[f.key] ?? ""} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })} className="w-full rounded-xl border border-border bg-background px-3 py-2" />
                  ) : f.type === "image" ? (
                    <div className="space-y-2">
                      {(editing.signed || (editing[f.key] && /^https?:/.test(editing[f.key]))) && (
                        <img src={editing.signed ?? editing[f.key]} alt="" className="h-24 rounded-xl object-cover" />
                      )}
                      <input type="file" accept="image/*" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const path = await uploadMedia(file);
                          setEditing({ ...editing, [f.key]: path, signed: URL.createObjectURL(file) });
                        } catch (err: any) { toast.error(err.message); }
                      }} className="block w-full text-sm" />
                      {f.required && !editing[f.key] && <p className="text-xs text-muted-foreground">Upload a photo to continue.</p>}
                    </div>
                  ) : (
                    <input type={f.type === "number" ? "number" : f.type === "url" ? "url" : "text"} required={f.required} value={editing[f.key] ?? ""} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })} className="w-full rounded-xl border border-border bg-background px-3 py-2" />
                  )}
                </label>
              ))}
              <button disabled={saving || cfg.fields.some((f) => f.required && !editing[f.key])} className="gradient-brand text-primary-foreground w-full rounded-full py-2.5 text-sm font-semibold disabled:opacity-50">
                {saving ? "Saving…" : "Save changes"}
              </button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground">
      {children}
    </button>
  );
}
