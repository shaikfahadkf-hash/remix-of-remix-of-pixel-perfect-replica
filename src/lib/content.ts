import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type FieldType = "text" | "textarea" | "url" | "number" | "image";
export type Field = { key: string; label: string; type: FieldType; required?: boolean };
export type TableKey = "event_tracks" | "mentors" | "judges" | "winners" | "gallery";

export const TABLES: Record<TableKey, { title: string; singular: string; primary: string; fields: Field[] }> = {
  event_tracks: {
    title: "Event tracks", singular: "track", primary: "title",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "image_url", label: "Image", type: "image" },
    ],
  },
  mentors: {
    title: "Mentors", singular: "mentor", primary: "name",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "designation", label: "Designation", type: "text" },
      { key: "organization", label: "Organization", type: "text" },
      { key: "bio", label: "Short bio", type: "textarea" },
      { key: "linkedin_url", label: "LinkedIn URL", type: "url" },
      { key: "image_url", label: "Photo", type: "image" },
    ],
  },
  judges: {
    title: "Judges", singular: "judge", primary: "name",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "designation", label: "Designation", type: "text" },
      { key: "organization", label: "Organization", type: "text" },
      { key: "bio", label: "Short bio", type: "textarea" },
      { key: "linkedin_url", label: "LinkedIn URL", type: "url" },
      { key: "image_url", label: "Photo", type: "image" },
    ],
  },
  winners: {
    title: "Winners", singular: "winner", primary: "team_name",
    fields: [
      { key: "team_name", label: "Team name", type: "text", required: true },
      { key: "position", label: "Position (e.g. 1st Place)", type: "text" },
      { key: "prize", label: "Prize", type: "text" },
      { key: "startup_idea", label: "Startup idea", type: "textarea" },
      { key: "year", label: "Year", type: "number" },
      { key: "image_url", label: "Photo", type: "image" },
    ],
  },
  gallery: {
    title: "Gallery", singular: "photo", primary: "title",
    fields: [
      { key: "image_url", label: "Photo", type: "image", required: true },
      { key: "title", label: "Title", type: "text" },
      { key: "caption", label: "Caption", type: "textarea" },
    ],
  },
};

export type Row = Record<string, any> & { id: string; sort_order: number; visible: boolean; signed?: string | null };

/** Images are stored as paths in the private sponsor-logos bucket (media/…) or as full https links. */
export async function signRows(rows: Row[]) {
  const paths = rows.map((r) => r["image_url"]).filter((p) => p && !/^https?:\/\//.test(p)) as string[];
  const map = new Map<string, string>();
  if (paths.length) {
    const { data } = await supabase.storage.from("sponsor-logos").createSignedUrls(paths, 60 * 60 * 24);
    (data ?? []).forEach((d) => d.path && d.signedUrl && map.set(d.path, d.signedUrl));
  }
  rows.forEach((r) => (r.signed = r["image_url"] ? (/^https?:\/\//.test(r["image_url"]) ? r["image_url"] : map.get(r["image_url"]) ?? null) : null));
  return rows;
}

export const tableQuery = (t: TableKey) =>
  queryOptions({
    queryKey: ["content", t],
    queryFn: async () => {
      const { data, error } = await (supabase.from(t as any) as any).select("*").order("sort_order").order("created_at");
      if (error) throw error;
      return signRows((data ?? []) as Row[]);
    },
  });

export const websiteContentQuery = queryOptions({
  queryKey: ["website_content"],
  queryFn: async () => {
    const { data, error } = await (supabase.from("website_content" as any) as any).select("*").order("key");
    if (error) throw error;
    return (data ?? []) as { key: string; label: string | null; value: string }[];
  },
});

export async function uploadMedia(file: File) {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `media/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("sponsor-logos").upload(path, file, { contentType: file.type });
  if (error) throw error;
  return path;
}
