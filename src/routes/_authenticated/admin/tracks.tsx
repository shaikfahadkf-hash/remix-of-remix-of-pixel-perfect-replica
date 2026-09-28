import { createFileRoute } from "@tanstack/react-router";
import { CrudManager } from "@/components/admin/CrudManager";

export const Route = createFileRoute("/_authenticated/admin/tracks")({
  head: () => ({ meta: [{ title: "Event tracks — Admin · Pitch Arena 2026" }, { name: "robots", content: "noindex" }] }),
  component: () => <CrudManager table="event_tracks" />,
});
