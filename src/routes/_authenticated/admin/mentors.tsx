import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/_authenticated/admin/mentors")({
  head: () => ({ meta: [{ title: "Mentors — Admin · Pitch Arena 2026" }, { name: "robots", content: "noindex" }] }),
  component: () => <CrudManager table="mentors" />,
});
