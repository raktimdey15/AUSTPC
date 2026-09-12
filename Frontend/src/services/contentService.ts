import { supabase } from "../lib/supabase";
import type { SiteContentState } from "../context/ContentContext";

/**
 * Fetch the global site content JSON from Supabase.
 * Returns null if it doesn't exist yet (so the frontend can fallback to local cache/defaults).
 */
export async function fetchSiteContent(): Promise<Partial<SiteContentState> | null> {
  const { data, error } = await supabase
    .from("site_content")
    .select("data")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error("[contentService] fetchSiteContent error:", error.message);
    return null;
  }

  return data?.data ? (data.data as Partial<SiteContentState>) : null;
}

/**
 * Upsert the global site content JSON to Supabase.
 * Requires an authenticated admin session.
 */
export async function updateSiteContent(content: SiteContentState): Promise<void> {
  const { error } = await supabase.from("site_content").upsert({
    id: 1,
    data: content as unknown as Record<string, unknown>, // typecast to satisfy JSONB
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("[contentService] updateSiteContent error:", error.message);
    throw new Error(`Failed to save site content: ${error.message}`);
  }
}
