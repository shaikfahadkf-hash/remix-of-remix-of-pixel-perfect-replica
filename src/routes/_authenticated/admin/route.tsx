import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, Users, Settings, LogOut, Globe, ShieldAlert, Handshake, UserCog, FileText, Crown } from "lucide-react";
import { BrandImage } from "@/components/site/BrandImage";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Pitch Arena 2026" },
      { name: "description", content: "Pitch Arena 2026 admin dashboard." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/registrations", label: "Registrations", icon: Users, exact: false },
  { to: "/admin/sponsors", label: "Sponsors", icon: Handshake, exact: false },
  { to: "/admin/content", label: "Website content", icon: FileText, exact: false },
  { to: "/admin/settings", label: "Website settings", icon: Settings, exact: false },
  { to: "/admin/admins", label: "Admins", icon: Crown, exact: false },
  { to: "/admin/account", label: "Account settings", icon: UserCog, exact: false },
] as const;

function AdminLayout() {
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const role = useQuery({
    queryKey: ["is-admin", user.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("claim_first_admin");
      if (error) throw error;
      return Boolean(data);
    },
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (role.isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  }
  if (!role.data) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="glass-strong max-w-md rounded-3xl p-8 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-gold" />
          <h1 className="mt-4 font-display text-xl font-bold">No admin access</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {user.email} is signed in but isn't an admin. Ask the super admin to grant access.
          </p>
          <button onClick={signOut} className="mt-6 rounded-full border border-border px-5 py-2 text-sm">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:flex">
      <aside className="glass-strong border-b border-border lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 p-5">
          <BrandImage brand="sukhf" alt="SUKHF" className="h-10 w-10 rounded-full object-contain" decoding="async" />
          <div>
            <p className="font-display text-sm font-bold">Pitch Arena 2026</p>
            <p className="text-xs text-muted-foreground">Super admin</p>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.exact }}
              className="flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              <n.icon className="h-4 w-4" /> {n.label}
            </Link>
          ))}
          <Link to="/" className="flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary/60">
            <Globe className="h-4 w-4" /> View website
          </Link>
          <button onClick={signOut} className="flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-left text-sm text-muted-foreground hover:bg-secondary/60">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </nav>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
}
