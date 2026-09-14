import { supabase } from "../lib/supabase";

export interface SupabaseEvent {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string | null;
  long_description: string | null;
  date: string;
  venue: string;
  image_url: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export type CreateEventInput = Omit<SupabaseEvent, "id" | "created_at" | "updated_at">;
export type UpdateEventInput = Partial<CreateEventInput>;

export interface EventFilters {
  featured?: boolean;
  category?: string;
}

/**
 * Fetch events from the database with optional filters.
 * Public operation — uses anon key.
 */
export async function fetchEvents(filters?: EventFilters): Promise<SupabaseEvent[]> {
  let query = supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.featured !== undefined) {
    query = query.eq("featured", filters.featured);
  }
  if (filters?.category) {
    query = query.eq("category", filters.category);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[eventService] fetchEvents:", error.message);
    throw new Error("Failed to load events.");
  }
  return (data ?? []) as SupabaseEvent[];
}

/**
 * Fetch a single event by slug.
 */
export async function fetchEventBySlug(slug: string): Promise<SupabaseEvent | null> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[eventService] fetchEventBySlug:", error.message);
    return null;
  }
  return data as SupabaseEvent | null;
}

/**
 * Create a new event.
 * Requires an authenticated admin session.
 */
export async function createEvent(input: CreateEventInput): Promise<SupabaseEvent> {
  const { data, error } = await supabase
    .from("events")
    .insert(input)
    .select()
    .single();

  if (error) {
    console.error("[eventService] createEvent:", error.message);
    throw new Error(`Failed to create event: ${error.message}`);
  }
  return data as SupabaseEvent;
}

/**
 * Update an existing event by ID.
 * Requires an authenticated admin session.
 */
export async function updateEvent(
  id: string,
  input: UpdateEventInput
): Promise<SupabaseEvent> {
  const { data, error } = await supabase
    .from("events")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[eventService] updateEvent:", error.message);
    throw new Error(`Failed to update event: ${error.message}`);
  }
  return data as SupabaseEvent;
}

/**
 * Delete an event by ID.
 * Requires an authenticated admin session.
 */
export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) {
    console.error("[eventService] deleteEvent:", error.message);
    throw new Error(`Failed to delete event: ${error.message}`);
  }
}
