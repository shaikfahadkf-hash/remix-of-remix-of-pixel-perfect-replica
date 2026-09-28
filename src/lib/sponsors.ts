import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SponsorCategory = { id: string; name: string; sort_order: number; visible: boolean };
export type Sponsor = {
  id: string;
  category_id: string | null;
  name: string;
  logo_url: string | null; // storage path in sponsor-logos
  website_url: string | null;
  sort_order: number;
  visible: boolean;
  featured: boolean;
  clicks: number;
  signed?: string | null;
};

export async function fetchSponsorData() {
  const [c, s] = await Promise.all([
    supabase.from("sponsor_categories").select("*").order("sort_order"),
    supabase.from("sponsors").select("*").order("sort_order"),
  ]);
  if (c.error) throw c.error;
  if (s.error) throw s.error;
  const sponsors = (s.data ?? []) as Sponsor[];
  const paths = sponsors.map((x) => x.logo_url).filter(Boolean) as string[];
  if (paths.length) {
    const { data } = await supabase.storage.from("sponsor-logos").createSignedUrls(paths, 60 * 60 * 24);
    const map = new Map((data ?? []).map((d) => [d.path, d.signedUrl]));
    sponsors.forEach((x) => (x.signed = x.logo_url ? map.get(x.logo_url) ?? null : null));
  }
  return { categories: (c.data ?? []) as SponsorCategory[], sponsors };
}

export const sponsorsQuery = queryOptions({ queryKey: ["sponsors"], queryFn: fetchSponsorData });

/** Only visible categories that contain at least one visible sponsor. */
export function groupVisible(categories: SponsorCategory[], sponsors: Sponsor[]) {
  return categories
    .filter((c) => c.visible)
    .map((c) => ({ ...c, items: sponsors.filter((s) => s.visible && s.category_id === c.id) }))
    .filter((c) => c.items.length > 0);
}
