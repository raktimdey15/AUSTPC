import { supabase } from "../lib/supabase";
import imageCompression from "browser-image-compression";

export interface GalleryPhoto {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  storage_path: string;
  category: string;
  event_id: string | null;
  uploaded_by: string;
  photographer_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface UploadPhotoMetadata {
  title: string;
  description?: string;
  category: string;
  event_id?: string;
  photographer_name?: string;
}

export interface GalleryFilters {
  category?: string;
  search?: string;
}

// Supported upload types
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Validate a file before upload.
 * Returns an error string or null if valid.
 */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Unsupported file type. Please upload a JPEG, PNG, WebP, or GIF.";
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Please upload a file under 10 MB — it will be auto-compressed to ≤500 KB WebP.`;
  }
  return null;
}

/**
 * Fetch gallery photos with optional filters.
 * Public operation — uses anon key.
 */
export async function fetchGalleryPhotos(
  filters?: GalleryFilters
): Promise<GalleryPhoto[]> {
  let query = supabase
    .from("gallery_photos")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.category && filters.category !== "all") {
    query = query.eq("category", filters.category);
  }
  if (filters?.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[galleryService] fetchGalleryPhotos:", error.message);
    throw new Error("Failed to load gallery photos. Please try again.");
  }
  return (data ?? []) as GalleryPhoto[];
}

/**
 * Fetch a limited number of the most recent photos for the public homepage gallery preview.
 * Public operation — uses anon key.
 */
export async function fetchGalleryHighlights(
  limit = 3
): Promise<GalleryPhoto[]> {
  const { data, error } = await supabase
    .from("gallery_photos")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[galleryService] fetchGalleryHighlights:", error.message);
    return []; // Silently return empty — caller falls back to static data
  }
  return (data ?? []) as GalleryPhoto[];
}

/**
 * Upload a photo file to Supabase Storage and save its metadata to the database.
 * Requires an authenticated admin session.
 *
 * Handles the orphaned-file case: if the DB insert fails after a successful
 * storage upload, the storage file is deleted before throwing.
 */
export async function uploadPhoto(
  file: File,
  metadata: UploadPhotoMetadata,
  onProgress?: (progress: number) => void
): Promise<GalleryPhoto> {
  // 1. Client-side validation
  const validationError = validateImageFile(file);
  if (validationError) throw new Error(validationError);

  // 2. Compress the image to ≤500KB and convert to WebP
  onProgress?.(5);
  const compressionOptions = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: "image/webp",
  };
  console.log(`[galleryService] Original: ${(file.size / 1024).toFixed(0)} KB`);
  const compressedFile = await imageCompression(file, compressionOptions);
  console.log(`[galleryService] Compressed: ${(compressedFile.size / 1024).toFixed(0)} KB (WebP)`);

  // 3. Build storage path: gallery/{category}/{timestamp}_{random}.webp
  const sanitizedCategory = metadata.category
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-");
  const storagePath = `gallery/${sanitizedCategory}/${Date.now()}_${Math.random().toString(36).slice(2)}.webp`;

  // 4. Upload compressed file to Supabase Storage
  onProgress?.(10);
  const { error: storageError } = await supabase.storage
    .from("gallery")
    .upload(storagePath, compressedFile, {
      cacheControl: "3600",
      upsert: false,
      contentType: "image/webp",
    });

  if (storageError) {
    console.error("[galleryService] storage upload failed:", storageError.message);
    throw new Error(`Storage upload failed: ${storageError.message}`);
  }

  onProgress?.(70);

  // 4. Get the public URL
  const { data: publicUrlData } = supabase.storage
    .from("gallery")
    .getPublicUrl(storagePath);
  const imageUrl = publicUrlData.publicUrl;

  // 5. Get the current user ID
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 6. Insert metadata into gallery_photos
  const { data, error: dbError } = await supabase
    .from("gallery_photos")
    .insert({
      title: metadata.title,
      description: metadata.description ?? null,
      image_url: imageUrl,
      storage_path: storagePath,
      category: metadata.category,
      event_id: metadata.event_id ?? null,
      uploaded_by: user?.id ?? null,
      photographer_name: metadata.photographer_name ?? null,
    })
    .select()
    .single();

  if (dbError) {
    // Attempt to clean up the orphaned storage file
    console.error("[galleryService] DB insert failed, cleaning up storage:", dbError.message);
    await supabase.storage.from("gallery").remove([storagePath]);
    throw new Error(`Database save failed: ${dbError.message}`);
  }

  onProgress?.(100);
  return data as GalleryPhoto;
}

/**
 * Update photo metadata (title, description, category).
 * Requires an authenticated admin session.
 */
export async function updatePhotoMetadata(
  id: string,
  fields: Partial<Pick<GalleryPhoto, "title" | "description" | "category" | "event_id" | "photographer_name">>
): Promise<GalleryPhoto> {
  const { data, error } = await supabase
    .from("gallery_photos")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[galleryService] updatePhotoMetadata:", error.message);
    throw new Error(`Failed to update photo: ${error.message}`);
  }
  return data as GalleryPhoto;
}

/**
 * Delete a photo from both Supabase Storage and the database.
 * Requires an authenticated admin session.
 *
 * If DB delete fails after storage delete, the state may be inconsistent.
 * The storage file is deleted first; if that fails, the DB row is not deleted.
 */
export async function deletePhoto(id: string, storagePath: string): Promise<void> {
  // 1. Remove from storage first
  const { error: storageError } = await supabase.storage
    .from("gallery")
    .remove([storagePath]);

  if (storageError) {
    console.error("[galleryService] storage delete failed:", storageError.message);
    throw new Error(`Storage delete failed: ${storageError.message}`);
  }

  // 2. Delete the database record
  const { error: dbError } = await supabase
    .from("gallery_photos")
    .delete()
    .eq("id", id);

  if (dbError) {
    console.error("[galleryService] DB delete failed:", dbError.message);
    throw new Error(`Database record delete failed: ${dbError.message}`);
  }
}

/**
 * Get distinct categories from the gallery_photos table.
 * Used to populate filter dropdowns.
 */
export async function fetchGalleryCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from("gallery_photos")
    .select("category");

  if (error || !data) return [];
  const unique = [...new Set(data.map((row) => row.category as string))].filter(Boolean);
  return unique.sort();
}
