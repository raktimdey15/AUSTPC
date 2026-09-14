import { supabase } from "../lib/supabase";
import imageCompression from "browser-image-compression";
import type { Applicant } from "../context/ContentContext";

export type ApplicationInput = Omit<Applicant, "id" | "submittedAt">;

/**
 * Upload a passport photo to Supabase storage (using the 'gallery' bucket for convenience).
 * Compresses to ≤500KB and converts to WebP before uploading.
 * Public operation — uses anon key.
 */
export async function uploadPassportPhoto(file: File): Promise<string> {
  // Compress to ≤500KB WebP
  const compressionOptions = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: "image/webp",
  };
  const compressedFile = await imageCompression(file, compressionOptions);

  const storagePath = `passports/${Date.now()}_${Math.random().toString(36).slice(2)}.webp`;

  const { error: storageError } = await supabase.storage
    .from("gallery")
    .upload(storagePath, compressedFile, {
      cacheControl: "3600",
      upsert: false,
      contentType: "image/webp",
    });

  if (storageError) {
    console.error("[applicationService] uploadPassportPhoto error:", storageError.message);
    throw new Error(`Failed to upload photo: ${storageError.message}`);
  }

  const { data } = supabase.storage.from("gallery").getPublicUrl(storagePath);
  return data.publicUrl;
}

/**
 * Submit a new join application.
 * Public operation — uses anon key.
 */
export async function submitApplication(data: ApplicationInput): Promise<Applicant> {
  try {
    // Try to hit the Vercel Serverless Function first for Google Drive integration
    const response = await fetch('/api/membership/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log("[applicationService] Vercel API processed the application successfully.");
    } else {
      console.warn("[applicationService] Vercel API failed or not found, falling back to direct Supabase insert.");
    }
  } catch (err) {
    console.warn("[applicationService] Vercel API fetch failed, falling back to direct Supabase insert.", err);
  }

  // Fallback to direct Supabase insert so local dev and testing still work
  const { data: result, error } = await supabase
    .from("applications")
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error("[applicationService] submitApplication error:", error.message);
    throw new Error(`Failed to submit application: ${error.message}`);
  }

  // Map submitted_at to submittedAt for frontend consistency
  return {
    ...result,
    submittedAt: result.submitted_at,
  } as Applicant;
}

/**
 * Fetch all applications.
 * Requires an authenticated admin session.
 */
export async function fetchApplications(): Promise<Applicant[]> {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("[applicationService] fetchApplications error:", error.message);
    throw new Error(`Failed to load applications: ${error.message}`);
  }

  return (data ?? []).map((row) => ({
    ...row,
    submittedAt: row.submitted_at,
  })) as Applicant[];
}

/**
 * Delete an application.
 * Requires an authenticated admin session.
 */
export async function deleteApplication(id: string): Promise<void> {
  const { error } = await supabase.from("applications").delete().eq("id", id);
  if (error) {
    console.error("[applicationService] deleteApplication error:", error.message);
    throw new Error(`Failed to delete application: ${error.message}`);
  }
}
