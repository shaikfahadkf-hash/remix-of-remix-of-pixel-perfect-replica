import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, GripVertical, Pencil, Plus, Star, Trash2, Upload, ArrowUp, ArrowDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { sponsorsQuery, type Sponsor, type SponsorCategory } from "@/lib/sponsors";
import { SponsorsView } from "@/components/site/SponsorsSection";

export const Route = createFileRoute("/_authenticated/admin/sponsors")({
  component: SponsorsAdmin,
});

const input = "w-full rounded-xl border border-input bg-secondary/40 px-3 py-2 text-sm outline-none focus:border-ring";
const btn = "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold";

async function uploadLogo(file: File) {
  const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const { error } = await supabase.storage.from("sponsor-logos").upload(path, file);
  if (error) throw error;
  return path;
}

function reorder<T>(list: T[], from: number, to: number) {
  const next = [...list];
  const [m] = next.splice(from, 1);
  next.splice(to, 0, m!);
  return next;
}

function SponsorsAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery(sponsorsQuery);
  const [editing, setEditing] = useState<Partial<Sponsor> | null>(null);
  const [newCat, setNewCat] = useState("");
  const [bulkCat, setBulkCat] = useState("");
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState<{ type: "cat" | "sp"; idx: number; cat?: string | null } | null>(null);
  const refresh = () => qc.invalidateQueries({ queryKey: ["sponsors"] });

  if (isLoading || !data) return <p className="text-muted-foreground">Loading…</p>;
  const { categories, sponsors } = data;

  async function run(p: PromiseLike<{ error: unknown }>, ok?: string) {
    const { error } = await p;
    if (error) toast.error((error as Error).message ?? "Something went wrong");
    else if (ok) toast.success(ok);
    refresh();
  }

  async function saveOrder(table: "sponsors" | "sponsor_categories", ids: string[]) {
    await Promise.all(ids.map((id, i) => supabase.from(table).update({ sort_order: i }).eq("id", id)));
    refresh();
  }

  async function saveSponsor(logoFile?: File | null) {
    if (!editing?.name?.trim()) {
      toast.error("Sponsor name is required");
      return;
    }
    setBusy(true);
    try {
      let logo_url = editing.logo_url ?? null;
      if (logoFile) logo_url = await uploadLogo(logoFile);
      const row = {
        name: editing.name.trim(),
        category_id: editing.category_id || null,
        website_url: editing.website_url?.trim() || null,
        visible: editing.visible ?? true,
        featured: editing.featured ?? false,
        logo_url,
      };
      const res = editing.id
        ? await supabase.from("sponsors").update(row).eq("id", editing.id)
        : await supabase.from("sponsors").insert({ ...row, sort_order: sponsors.length });
      if (res.error) throw res.error;
      toast.success("Sponsor saved");
      setEditing(null);
      refresh();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function bulkUpload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      let order = sponsors.length;
      for (const f of Array.from(files)) {
        const path = await uploadLogo(f);
        const name = f.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
        const { error } = await supabase
          .from("sponsors")
          .insert({ name, logo_url: path, category_id: bulkCat || null, sort_order: order++ });
        if (error) throw error;
      }
      toast.success(`${files.length} logos added`);
      refresh();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const totalClicks = sponsors.reduce((a, s) => a + s.clicks, 0);
  const stats = [
    { label: "Sponsors", value: sponsors.length },
    { label: "Visible", value: sponsors.filter((s) => s.visible).length },
    { label: "Featured", value: sponsors.filter((s) => s.featured).length },
    { label: "Website clicks", value: totalClicks },
  ];
  const groups: { cat: SponsorCategory | null; items: Sponsor[] }[] = [
    ...categories.map((c) => ({ cat: c, items: sponsors.filter((s) => s.category_id === c.id) })),
    { cat: null, items: sponsors.filter((s) => !s.category_id || !categories.some((c) => c.id === s.category_id)) },
  ];

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Sponsors</h1>
          <p className="text-sm text-muted-foreground">Only visible categories with visible sponsors appear on the website.</p>
        </div>
        <button onClick={() => setEditing({ visible: true, featured: false })} className={`${btn} gradient-brand text-primary-foreground`}>
          <Plus className="h-4 w-4" /> Add sponsor
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="mt-1 font-display text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        {/* Sponsors by category */}
        <div className="grid gap-4">
          {groups.map(({ cat, items }) =>
            !cat && !items.length ? null : (
              <div key={cat?.id ?? "none"} className="glass rounded-2xl p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display font-semibold">
                    {cat?.name ?? "No category (not shown on site)"}{" "}
                    <span className="text-xs text-muted-foreground">({items.length})</span>
                  </p>
                  {cat && !cat.visible && <span className="text-xs text-gold">Hidden category</span>}
                </div>
                {!items.length && <p className="mt-2 text-xs text-muted-foreground">No sponsors — hidden on website.</p>}
                <ul className="mt-3 grid gap-2">
                  {items.map((s, idx) => (
                    <li
                      key={s.id}
                      draggable
                      onDragStart={() => setDrag({ type: "sp", idx, cat: cat?.id ?? null })}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (drag?.type === "sp" && drag.cat === (cat?.id ?? null) && drag.idx !== idx)
                          saveOrder("sponsors", reorder(items, drag.idx, idx).map((x) => x.id));
                        setDrag(null);
                      }}
                      className={`flex items-center gap-3 rounded-xl bg-secondary/40 p-2 ${s.visible ? "" : "opacity-50"}`}
                    >
                      <GripVertical className="hidden h-4 w-4 shrink-0 cursor-grab text-muted-foreground sm:block" />
                      <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-lg bg-foreground/90">
                        {s.signed ? (
                          <img
                            src={s.signed}
                            alt=""
                            className="max-h-8 max-w-12 object-contain"
                            onError={(event) => { event.currentTarget.hidden = true; }}
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{s.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{s.website_url || "No website"} · {s.clicks} clicks</p>
                      </div>
                      <div className="flex shrink-0 items-center">
                        <IconBtn label="Move up" disabled={idx === 0} onClick={() => saveOrder("sponsors", reorder(items, idx, idx - 1).map((x) => x.id))}><ArrowUp /></IconBtn>
                        <IconBtn label="Move down" disabled={idx === items.length - 1} onClick={() => saveOrder("sponsors", reorder(items, idx, idx + 1).map((x) => x.id))}><ArrowDown /></IconBtn>
                        <IconBtn label="Featured" onClick={() => run(supabase.from("sponsors").update({ featured: !s.featured }).eq("id", s.id))}>
                          <Star className={s.featured ? "fill-gold text-gold" : ""} />
                        </IconBtn>
                        <IconBtn label="Show/hide" onClick={() => run(supabase.from("sponsors").update({ visible: !s.visible }).eq("id", s.id))}>
                          {s.visible ? <Eye /> : <EyeOff />}
                        </IconBtn>
                        <IconBtn label="Edit" onClick={() => setEditing(s)}><Pencil /></IconBtn>
                        <IconBtn label="Delete" onClick={() => confirm(`Delete ${s.name}?`) && run(supabase.from("sponsors").delete().eq("id", s.id), "Deleted")}><Trash2 /></IconBtn>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ),
          )}
        </div>

        {/* Categories + bulk */}
        <div className="grid content-start gap-4">
          <div className="glass rounded-2xl p-4">
            <p className="font-display font-semibold">Categories</p>
            <ul className="mt-3 grid gap-2">
              {categories.map((c, idx) => (
                <li
                  key={c.id}
                  draggable
                  onDragStart={() => setDrag({ type: "cat", idx })}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (drag?.type === "cat" && drag.idx !== idx)
                      saveOrder("sponsor_categories", reorder(categories, drag.idx, idx).map((x) => x.id));
                    setDrag(null);
                  }}
                  className={`flex items-center gap-1 rounded-xl bg-secondary/40 p-2 text-sm ${c.visible ? "" : "opacity-50"}`}
                >
                  <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate">{c.name}</span>
                  <IconBtn label="Rename" onClick={() => {
                    const name = prompt("Category name", c.name);
                    if (name?.trim()) run(supabase.from("sponsor_categories").update({ name: name.trim() }).eq("id", c.id));
                  }}><Pencil /></IconBtn>
                  <IconBtn label="Show/hide" onClick={() => run(supabase.from("sponsor_categories").update({ visible: !c.visible }).eq("id", c.id))}>
                    {c.visible ? <Eye /> : <EyeOff />}
                  </IconBtn>
                  <IconBtn label="Delete" onClick={() => confirm(`Delete category ${c.name}? Its sponsors stay but become uncategorised.`) && run(supabase.from("sponsor_categories").delete().eq("id", c.id), "Category deleted")}><Trash2 /></IconBtn>
                </li>
              ))}
            </ul>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!newCat.trim()) return;
                run(supabase.from("sponsor_categories").insert({ name: newCat.trim(), sort_order: categories.length }), "Category added");
                setNewCat("");
              }}
            >
              <input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="New category" className={input} />
              <button className={`${btn} bg-secondary`}><Plus className="h-4 w-4" /></button>
            </form>
          </div>

          <div className="glass rounded-2xl p-4">
            <p className="font-display font-semibold">Bulk upload logos</p>
            <p className="mt-1 text-xs text-muted-foreground">Each file becomes a sponsor named after the file.</p>
            <select value={bulkCat} onChange={(e) => setBulkCat(e.target.value)} className={`${input} mt-3`}>
              <option value="">No category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <label className={`${btn} mt-3 cursor-pointer bg-secondary`}>
              <Upload className="h-4 w-4" /> {busy ? "Uploading…" : "Choose logos"}
              <input type="file" multiple accept="image/*" className="hidden" disabled={busy} onChange={(e) => bulkUpload(e.target.files)} />
            </label>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl font-semibold">Live preview</h2>
        <div className="glass mt-3 overflow-hidden rounded-3xl">
          <SponsorsView categories={categories} sponsors={sponsors} preview />
        </div>
      </div>

      {editing && <SponsorDialog value={editing} categories={categories} busy={busy} onChange={setEditing} onClose={() => setEditing(null)} onSave={saveSponsor} />}
    </div>
  );
}

function IconBtn({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} disabled={disabled} onClick={onClick}
      className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-30 [&_svg]:h-4 [&_svg]:w-4">
      {children}
    </button>
  );
}

function SponsorDialog({ value, categories, busy, onChange, onClose, onSave }: {
  value: Partial<Sponsor>; categories: SponsorCategory[]; busy: boolean;
  onChange: (v: Partial<Sponsor>) => void; onClose: () => void; onSave: (f?: File | null) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 p-4 backdrop-blur sm:items-center" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => { e.preventDefault(); onSave(file); }}
        className="glass-strong grid w-full max-w-md gap-3 rounded-3xl p-6"
      >
        <h3 className="font-display text-lg font-bold">{value.id ? "Edit sponsor" : "Add sponsor"}</h3>
        <input className={input} placeholder="Sponsor name" value={value.name ?? ""} onChange={(e) => onChange({ ...value, name: e.target.value })} />
        <input className={input} placeholder="https://website.com" value={value.website_url ?? ""} onChange={(e) => onChange({ ...value, website_url: e.target.value })} />
        <select className={input} value={value.category_id ?? ""} onChange={(e) => onChange({ ...value, category_id: e.target.value || null })}>
          <option value="">No category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <label className="text-sm text-muted-foreground">
          Logo {value.logo_url && !file ? "(keep current or replace)" : ""}
          <input type="file" accept="image/*" className="mt-1 block w-full text-sm" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={value.visible ?? true} onChange={(e) => onChange({ ...value, visible: e.target.checked })} /> Visible on website</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={value.featured ?? false} onChange={(e) => onChange({ ...value, featured: e.target.checked })} /> Featured sponsor</label>
        <div className="mt-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} className={`${btn} border border-border`}>Cancel</button>
          <button disabled={busy} className={`${btn} gradient-brand text-primary-foreground`}>{busy ? "Saving…" : "Save"}</button>
        </div>
      </form>
    </div>
  );
}
