import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Printer, Mail, FileText, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { exportCsv, registrationsQuery, STATUSES, type Registration } from "@/lib/admin-data";

export const Route = createFileRoute("/_authenticated/admin/registrations")({
  component: RegistrationsPage,
});

const statusTone: Record<string, string> = {
  pending: "bg-secondary text-muted-foreground",
  shortlisted: "bg-azure/20 text-azure",
  approved: "bg-cyan/20 text-cyan",
  rejected: "bg-destructive/20 text-destructive",
  winner: "bg-gold/20 text-gold",
};

function RegistrationsPage() {
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useQuery(registrationsQuery);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const list = useMemo(() => {
    const s = q.toLowerCase();
    return rows.filter(
      (r) =>
        (filter === "all" || r.status === filter) &&
        (!s || [r.team_name, r.leader_name, r.email, r.college].some((v) => v.toLowerCase().includes(s))),
    );
  }, [rows, q, filter]);

  const update = useMutation({
    mutationFn: async ({ ids, patch }: { ids: string[]; patch: Partial<Registration> }) => {
      const { error } = await supabase.from("registrations").update(patch).in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["registrations"] });
      toast.success("Updated");
    },
    onError: () => toast.error("Update failed"),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("registrations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["registrations"] });
      toast.success("Deleted");
    },
  });

  async function openDeck(path: string) {
    const { data, error } = await supabase.storage.from("pitch-decks").createSignedUrl(path, 300);
    if (error || !data) return toast.error("Couldn't open the file");
    window.open(data.signedUrl, "_blank");
  }

  const sel = [...selected];
  const selRows = rows.filter((r) => selected.has(r.id));
  const toggle = (id: string) =>
    setSelected((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 print:hidden">
        <div>
          <p className="section-label">Teams</p>
          <h1 className="mt-2 font-display text-3xl font-bold">Registrations</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => exportCsv(list)} className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm">
            <Download className="h-4 w-4" /> Excel (CSV)
          </button>
          <button onClick={() => window.print()} className="glass flex items-center gap-2 rounded-full px-4 py-2 text-sm">
            <Printer className="h-4 w-4" /> PDF
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 print:hidden">
        <label className="glass flex flex-1 items-center gap-2 rounded-full px-4 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search team, leader, email, college" className="w-full bg-transparent text-sm outline-none" />
        </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="glass rounded-full px-4 py-2 text-sm capitalize">
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {sel.length > 0 && (
        <div className="glass-strong flex flex-wrap items-center gap-2 rounded-2xl p-3 text-sm print:hidden">
          <span className="px-2">{sel.length} selected</span>
          <button onClick={() => update.mutate({ ids: sel, patch: { status: "approved" } })} className="rounded-full bg-cyan/20 px-3 py-1.5 text-cyan">Approve</button>
          <button onClick={() => update.mutate({ ids: sel, patch: { status: "shortlisted" } })} className="rounded-full bg-azure/20 px-3 py-1.5 text-azure">Shortlist</button>
          <button onClick={() => update.mutate({ ids: sel, patch: { status: "rejected" } })} className="rounded-full bg-destructive/20 px-3 py-1.5 text-destructive">Reject</button>
          <a href={`mailto:?bcc=${selRows.map((r) => r.email).join(",")}&subject=Pitch Arena 2026`} className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5">
            <Mail className="h-4 w-4" /> Email
          </a>
          <button onClick={() => setSelected(new Set())} className="ml-auto px-3 py-1.5 text-muted-foreground">Clear</button>
        </div>
      )}

      <div className="glass overflow-x-auto rounded-2xl">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="border-b border-border text-left text-muted-foreground">
            <tr>
              <th className="p-3 print:hidden">
                <input type="checkbox" checked={list.length > 0 && list.every((r) => selected.has(r.id))} onChange={(e) => setSelected(e.target.checked ? new Set(list.map((r) => r.id)) : new Set())} />
              </th>
              <th className="p-3">Team</th>
              <th className="p-3">Contact</th>
              <th className="p-3">College</th>
              <th className="p-3">Stage</th>
              <th className="p-3">Size</th>
              <th className="p-3">Status</th>
              <th className="p-3">Payment</th>
              <th className="p-3 print:hidden"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && <tr><td colSpan={9} className="p-6 text-center text-muted-foreground">Loading…</td></tr>}
            {!isLoading && list.length === 0 && <tr><td colSpan={9} className="p-6 text-center text-muted-foreground">No registrations found.</td></tr>}
            {list.map((r) => (
              <tr key={r.id} className="align-top">
                <td className="p-3 print:hidden"><input type="checkbox" checked={selected.has(r.id)} onChange={() => toggle(r.id)} /></td>
                <td className="p-3">
                  <p className="font-medium">{r.team_name}</p>
                  <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString("en-IN")}</p>
                </td>
                <td className="p-3">
                  <p>{r.leader_name}</p>
                  <a href={`mailto:${r.email}`} className="text-xs text-cyan">{r.email}</a>
                  <p className="text-xs text-muted-foreground">{r.phone}</p>
                </td>
                <td className="p-3">{r.college}</td>
                <td className="p-3">{r.stage}</td>
                <td className="p-3">{r.team_size}</td>
                <td className="p-3">
                  <select value={r.status} onChange={(e) => update.mutate({ ids: [r.id], patch: { status: e.target.value } })} className={`rounded-full px-2.5 py-1 text-xs capitalize ${statusTone[r.status] ?? ""}`}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-3">
                  <button onClick={() => update.mutate({ ids: [r.id], patch: { payment_status: r.payment_status === "paid" ? "unpaid" : "paid" } })} className={`rounded-full px-2.5 py-1 text-xs ${r.payment_status === "paid" ? "bg-cyan/20 text-cyan" : "bg-secondary text-muted-foreground"}`}>
                    {r.payment_status}
                  </button>
                </td>
                <td className="p-3 print:hidden">
                  <div className="flex gap-1">
                    {r.deck_path && (
                      <button title="Open pitch deck" onClick={() => openDeck(r.deck_path!)} className="rounded-lg p-2 hover:bg-secondary"><FileText className="h-4 w-4" /></button>
                    )}
                    <button title="Delete" onClick={() => confirm(`Delete ${r.team_name}?`) && remove.mutate(r.id)} className="rounded-lg p-2 text-destructive hover:bg-secondary"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
