import imageCompression from "browser-image-compression";
import { supabase } from "../lib/supabase";

/**
 * Compresses an image and uploads it to the `site-assets` bucket in Supabase.
 * Returns the public URL of the uploaded image.
 */
export async function uploadSiteImage(file: File, folder = "general"): Promise<string> {
  try {
    // 1. Compress the image
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: "image/webp", // Convert to WebP for modern web performance
    };
    
    console.log(`Original file size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    const compressedFile = await imageCompression(file, options);
    console.log(`Compressed file size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);

    // 2. Generate unique filename
    const fileExt = "webp"; // We forced WebP above
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // 3. Upload to Supabase Storage bucket 'site-assets'
    const { error: uploadError } = await supabase.storage
      .from("site-assets")
      .upload(filePath, compressedFile, {
        cacheControl: "3600",
        upsert: false,
        contentType: "image/webp",
      });

    if (uploadError) {
      throw uploadError;
    }

    // 4. Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("site-assets").getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error("[storageService] Error uploading image:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to upload image");
  }
}
