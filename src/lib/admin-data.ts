import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Registration = {
  id: string;
  created_at: string;
  team_name: string;
  leader_name: string;
  email: string;
  phone: string;
  college: string;
  stage: string;
  team_size: number;
  deck_path: string | null;
  status: string;
  payment_status: string;
  notes: string | null;
};

export const STATUSES = ["pending", "shortlisted", "approved", "rejected", "winner"] as const;

export const registrationsQuery = queryOptions({
  queryKey: ["registrations"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Registration[];
  },
});

export const settingsQuery = queryOptions({
  queryKey: ["site_settings"],
  queryFn: async () => {
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single();
    if (error) throw error;
    return data;
  },
});

export function exportCsv(rows: Registration[]) {
  const cols = [
    "created_at", "team_name", "leader_name", "email", "phone", "college",
    "stage", "team_size", "status", "payment_status", "notes",
  ] as const;
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `pitch-arena-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}
