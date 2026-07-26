import { useState, type ChangeEvent } from "react";
import { uploadImage } from "../../utils/api";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** Tags the upload in MongoDB so you can filter later, e.g. "event", "member", "gallery", "hero" */
  category?: string;
}

export default function ImageUploadField({ label, value, onChange, category = "general" }: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const uploaded = await uploadImage(file, category);
      onChange(uploaded.url);
    } catch (uploadError) {
      console.error("Image upload failed:", uploadError);
      setError("Upload failed. Check backend auth, storage config, and file type.");
    } finally {
      setIsUploading(false);
      // allow re-selecting the same file name later
      event.target.value = "";
    }
  };

  return (
    <label className="flex flex-col gap-2 text-sm text-zinc-300">
      <span>{label}</span>

      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        disabled={isUploading}
        className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none disabled:opacity-50"
      />

      {isUploading ? <span className="text-xs text-[#00FF66]">Uploading…</span> : null}
      {error ? <span className="text-xs text-red-400">{error}</span> : null}

      {value ? (
        <div className="mt-1 flex items-center gap-3">
          <img src={value} alt={label} className="h-16 w-16 rounded-xl object-cover" />
          <input
            type="text"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Or paste an image URL"
            className="flex-1 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
          />
        </div>
      ) : (
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Or paste an image URL"
          className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none"
        />
      )}
    </label>
  );
}
