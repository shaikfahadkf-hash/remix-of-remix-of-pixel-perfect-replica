import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/_authenticated/admin/judges")({
  head: () => ({ meta: [{ title: "Judges — Admin · Pitch Arena 2026" }, { name: "robots", content: "noindex" }] }),
  component: () => <CrudManager table="judges" />,
});
