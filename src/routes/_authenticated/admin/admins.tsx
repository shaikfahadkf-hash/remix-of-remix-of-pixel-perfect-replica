import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Crown, Shield, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/admins")({
  head: () => ({ meta: [{ title: "Admins — Admin · Pitch Arena 2026" }, { name: "robots", content: "noindex" }] }),
  component: AdminsPage,
});

function AdminsPage() {
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [superAdmin, setSuperAdmin] = useState(false);
  const isSuper = useQuery({
    queryKey: ["is-super", user.id],
    queryFn: async () => (await supabase.rpc("has_role", { _user_id: user.id, _role: "super_admin" as any })).data === true,
  });
  const list = useQuery({
    queryKey: ["admins"],
    enabled: isSuper.data === true,
    queryFn: async () => {
      const { data, error } = await (supabase.rpc as any)("list_admins");
      if (error) throw error;
      return (data ?? []) as { user_id: string; email: string; roles: string[] }[];
    },
  });
  const logIt = (action: string, details: string) =>
    supabase.from("admin_activity_log").insert({ user_id: user.id, user_email: user.email, action, details });

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const { data, error } = await (supabase.rpc as any)("grant_admin_by_email", { _email: email, _super: superAdmin });
    if (error) return void toast.error(error.message);
    if (data === "not_found") return void toast.error("No account with that email. Ask them to create one on the sign-in page first.");
    await logIt(superAdmin ? "Granted super admin" : "Granted admin", email);
    toast.success("Access granted");
    setEmail("");
    qc.invalidateQueries({ queryKey: ["admins"] });
  }
  async function revoke(uid: string, mail: string, role?: "super_admin") {
    if (!confirm(role ? `Remove super admin from ${mail}?` : `Remove all admin access from ${mail}?`)) return;
    let q = supabase.from("user_roles").delete().eq("user_id", uid);
    if (role) q = q.eq("role", role as any);
    const { error } = await q;
    if (error) return void toast.error(error.message);
    await logIt(role ? "Removed super admin" : "Removed admin", mail);
    qc.invalidateQueries({ queryKey: ["admins"] });
  }

  if (isSuper.isLoading) return <p className="text-muted-foreground">Loading…</p>;
  if (!isSuper.data)
    return <div className="glass rounded-2xl p-8 text-center text-muted-foreground">Only a Super Admin can manage admins.</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Admins</h1>
        <p className="text-sm text-muted-foreground">Super Admins can manage admins and login details. Admins can manage content and registrations.</p>
      </div>
      <form onSubmit={add} className="glass flex flex-wrap items-end gap-3 rounded-2xl p-5">
        <label className="min-w-60 flex-1 text-sm">
          <span className="mb-1 block font-medium">Email of an existing account</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2" />
        </label>
        <label className="flex items-center gap-2 pb-2 text-sm">
          <input type="checkbox" checked={superAdmin} onChange={(e) => setSuperAdmin(e.target.checked)} /> Super Admin
        </label>
        <button className="gradient-brand rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground">Grant access</button>
      </form>
      <div className="grid gap-3">
        {(list.data ?? []).map((a) => {
          const sup = a.roles.includes("super_admin");
          const me = a.user_id === user.id;
          return (
            <div key={a.user_id} className="glass flex items-center gap-3 rounded-2xl p-4">
              {sup ? <Crown className="h-5 w-5 text-gold" /> : <Shield className="h-5 w-5 text-muted-foreground" />}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{a.email}{me && " (you)"}</p>
                <p className="text-xs text-muted-foreground">{sup ? "Super Admin" : "Admin"}</p>
              </div>
              {!me && sup && (
                <button onClick={() => revoke(a.user_id, a.email, "super_admin")} className="rounded-full border border-border px-3 py-1 text-xs">Make Admin</button>
              )}
              {!me && (
                <button aria-label="Remove access" onClick={() => revoke(a.user_id, a.email)} className="rounded-lg p-2 hover:bg-secondary">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
