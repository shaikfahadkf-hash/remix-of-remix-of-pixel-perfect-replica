import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Users, CheckCircle2, Clock, IndianRupee, XCircle, Trophy } from "lucide-react";
import { registrationsQuery, settingsQuery } from "@/lib/admin-data";
import { DualLogo } from "@/components/site/DualLogo";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Overview,
});

function Overview() {
  const { data: rows = [], isLoading } = useQuery(registrationsQuery);
  const { data: settings } = useQuery(settingsQuery);
  const fee = settings?.fee ?? 499;
  const count = (s: string) => rows.filter((r) => r.status === s).length;
  const paid = rows.filter((r) => r.payment_status === "paid").length;

  const stats = [
    { label: "Total teams", value: rows.length, icon: Users },
    { label: "Pending review", value: count("pending"), icon: Clock },
    { label: "Approved", value: count("approved") + count("shortlisted"), icon: CheckCircle2 },
    { label: "Rejected", value: count("rejected"), icon: XCircle },
    { label: "Winners", value: count("winner"), icon: Trophy },
    { label: "Fees collected", value: `₹${(paid * fee).toLocaleString("en-IN")}`, icon: IndianRupee },
  ];

  const stages = Object.entries(
    rows.reduce<Record<string, number>>((a, r) => ((a[r.stage] = (a[r.stage] ?? 0) + 1), a), {}),
  );
  const max = Math.max(1, ...stages.map(([, n]) => n));

  return (
    <div className="space-y-8">
      <div className="glass flex flex-col items-start gap-4 rounded-3xl p-6 sm:flex-row sm:items-center">
        <DualLogo size="md" />
        <div className="min-w-0">
          <p className="section-label">Welcome back</p>
          <h1 className="mt-1 font-display text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Pitch Arena 2026 · SUKHF in association with SUES
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-5">
            <s.icon className="h-5 w-5 text-cyan" />
            <p className="mt-3 font-display text-3xl font-bold">{isLoading ? "…" : s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <h2 className="font-display font-semibold">Teams by startup stage</h2>
          <div className="mt-5 space-y-3">
            {stages.length === 0 && <p className="text-sm text-muted-foreground">No registrations yet.</p>}
            {stages.map(([stage, n]) => (
              <div key={stage}>
                <div className="flex justify-between text-sm"><span>{stage}</span><span>{n}</span></div>
                <div className="mt-1 h-2 rounded-full bg-secondary">
                  <div className="gradient-brand h-2 rounded-full" style={{ width: `${(n / max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold">Latest registrations</h2>
            <Link to="/admin/registrations" className="text-sm text-cyan">View all</Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {rows.slice(0, 6).map((r) => (
              <li key={r.id} className="flex justify-between gap-3 py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">{r.team_name}</p>
                  <p className="truncate text-muted-foreground">{r.college}</p>
                </div>
                <span className="shrink-0 capitalize text-muted-foreground">{r.status}</span>
              </li>
            ))}
            {rows.length === 0 && <li className="py-3 text-sm text-muted-foreground">Nothing yet.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
