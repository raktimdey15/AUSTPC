import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHero from "../../components/Common/PageHero";
import {
  deletePhoto,
  fetchGalleryCategories,
  fetchGalleryPhotos,
  updatePhotoMetadata,
  uploadPhoto,
  validateImageFile,
  type GalleryPhoto,
} from "../../services/galleryService";
import { useSiteContent } from "../../context/ContentContext";

// ─── Tiny utility components ─────────────────────────────────────────────────

function Spinner() {
  return (
    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-[#00FF66]" />
  );
}

function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border px-5 py-4 text-sm font-medium shadow-2xl backdrop-blur-md transition-all ${
        type === "success"
          ? "border-[#00FF66]/30 bg-zinc-900/90 text-[#00FF66]"
          : "border-red-500/30 bg-zinc-900/90 text-red-400"
      }`}
    >
      <span>{type === "success" ? "✓" : "✕"}</span>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        ✕
      </button>
    </div>
  );
}

// ─── Upload Form ──────────────────────────────────────────────────────────────

interface UploadFormProps {
  onUploaded: (photo: GalleryPhoto) => void;
  onError: (msg: string) => void;
}

function UploadForm({ onUploaded, onError }: UploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [photographerName, setPhotographerName] = useState("");
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setFileError(null);

    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    const error = validateImageFile(file);
    if (error) {
      setFileError(error);
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    if (!title) setTitle(file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(fakeEvent);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;
    const finalTitle = title.trim() || selectedFile.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
    const finalCategory = category.trim() || "General";

    setIsUploading(true);
    setProgress(0);

    try {
      const photo = await uploadPhoto(
        selectedFile,
        { title: finalTitle, description: description.trim() || undefined, category: finalCategory, photographer_name: photographerName.trim() || undefined },
        setProgress
      );
      // Reset form before calling onUploaded so the grid refresh sees a clean state
      setSelectedFile(null);
      setPreviewUrl(null);
      setTitle("");
      setDescription("");
      setCategory("");
      setPhotographerName("");
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
      onUploaded(photo);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed. Please try again.";
      onError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-8">
      <h2 className="text-2xl font-semibold text-white">Upload New Photo</h2>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-white/15 bg-black/30 p-6 transition hover:border-[#00FF66]/50 hover:bg-[#00FF66]/5"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-48 max-w-full rounded-[16px] object-contain"
            />
          ) : (
            <div className="text-center">
              <p className="text-4xl">📷</p>
              <p className="mt-3 text-sm font-medium text-zinc-300">
                Click or drag & drop an image here
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                JPEG, PNG, WebP, GIF — auto-compressed to ≤500 KB WebP
              </p>
            </div>
          )}
        </div>

        {fileError && (
          <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
            {fileError}
          </p>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-zinc-300">
            <span>Title <span className="text-zinc-500">(optional — defaults to filename)</span></span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isUploading}
              placeholder="e.g. DBI 2026 Opening Ceremony"
              className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-[#00FF66] transition-colors disabled:opacity-50"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-zinc-300">
            <span>Category <span className="text-zinc-500">(optional — defaults to "General")</span></span>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isUploading}
              placeholder="e.g. Exhibition, Photowalk, Workshop"
              className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-[#00FF66] transition-colors disabled:opacity-50"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-zinc-300 md:col-span-2">
            <span>Description <span className="text-zinc-500">(optional)</span></span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isUploading}
              rows={3}
              placeholder="Brief description of this photo..."
              className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-[#00FF66] transition-colors disabled:opacity-50"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-zinc-300 md:col-span-2">
            <span>Photographer Name <span className="text-zinc-500">(optional)</span></span>
            <input
              type="text"
              value={photographerName}
              onChange={(e) => setPhotographerName(e.target.value)}
              disabled={isUploading}
              placeholder="e.g. Raktim Dey"
              className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-[#00FF66] transition-colors disabled:opacity-50"
            />
          </label>
        </div>

        {/* Progress bar */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Uploading…</span>
              <span className="text-[#00FF66]">{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-[#00FF66] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isUploading || !selectedFile}
          className="flex items-center justify-center gap-2 rounded-full bg-[#00FF66] px-8 py-3.5 text-sm font-bold text-black shadow-[0_0_15px_rgba(0,255,102,0.25)] transition hover:scale-105 hover:bg-white disabled:cursor-not-allowed disabled:scale-100 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:shadow-none"
        >
          {isUploading ? (
            <>
              <Spinner />
              Uploading…
            </>
          ) : (
            "Upload Photo"
          )}
        </button>
      </form>
    </section>
  );
}

// ─── Photo Card ───────────────────────────────────────────────────────────────

interface PhotoCardProps {
  photo: GalleryPhoto;
  isFeatured: boolean;
  onToggleFeatured: (photo: GalleryPhoto) => void;
  onDeleted: (id: string) => void;
  onUpdated: (updated: GalleryPhoto) => void;
  onError: (msg: string) => void;
}

function PhotoCard({ photo, isFeatured, onToggleFeatured, onDeleted, onUpdated, onError }: PhotoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editTitle, setEditTitle] = useState(photo.title);
  const [editDescription, setEditDescription] = useState(photo.description ?? "");
  const [editCategory, setEditCategory] = useState(photo.category);
  const [editPhotographer, setEditPhotographer] = useState(photo.photographer_name ?? "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    setIsSaving(true);
    try {
      const updated = await updatePhotoMetadata(photo.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || null,
        category: editCategory.trim(),
        photographer_name: editPhotographer.trim() || null,
      });
      onUpdated(updated);
      setIsEditing(false);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to update photo.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePhoto(photo.id, photo.storage_path);
      onDeleted(photo.id);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to delete photo.");
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const uploadDate = new Date(photo.created_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-zinc-900/80 transition hover:border-white/20">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-800">
        <img
          src={photo.image_url}
          alt={photo.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-xs font-semibold text-[#00FF66] backdrop-blur-sm">
          {photo.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#00FF66]"
              placeholder="Title"
            />
            <input
              type="text"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#00FF66]"
              placeholder="Category"
            />
            <input
              type="text"
              value={editPhotographer}
              onChange={(e) => setEditPhotographer(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#00FF66]"
              placeholder="Photographer Name"
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-[#00FF66]"
              placeholder="Description (optional)"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={isSaving || !editTitle.trim()}
                className="flex items-center gap-2 rounded-full bg-[#00FF66] px-4 py-2 text-xs font-bold text-black disabled:opacity-50"
              >
                {isSaving ? <Spinner /> : null}
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
                className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/5"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold text-white line-clamp-1">{photo.title}</h3>
              <button
                onClick={() => onToggleFeatured(photo)}
                className={`flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition ${
                  isFeatured
                    ? "border-[#00FF66]/40 bg-[#00FF66]/10 text-[#00FF66] hover:bg-[#00FF66]/20"
                    : "border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10"
                }`}
                title={isFeatured ? "Remove from Homepage" : "Feature on Homepage"}
              >
                {isFeatured ? "★ Featured" : "☆ Feature"}
              </button>
            </div>
            {photo.description && (
              <p className="mt-1 text-sm leading-6 text-zinc-400 line-clamp-2">{photo.description}</p>
            )}
            {photo.photographer_name && (
              <p className="mt-2 flex items-center gap-1 text-xs text-[#00FF66]">
                <span className="opacity-70">📷 By</span> {photo.photographer_name}
              </p>
            )}
            <p className="mt-2 text-xs text-zinc-500">{uploadDate}</p>

            {/* Delete confirmation */}
            {showDeleteConfirm ? (
              <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm">
                <p className="text-red-300">Delete this photo permanently?</p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-2 rounded-full bg-red-500 px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50"
                  >
                    {isDeleting ? <Spinner /> : null}
                    {isDeleting ? "Deleting…" : "Yes, delete"}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-zinc-300 transition hover:bg-white/10"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="rounded-full border border-red-400/30 px-4 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-400/10"
                >
                  Delete
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminGallery() {
  const { content, setContent, saveChanges } = useSiteContent();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => setToast({ message, type });
  const closeToast = useCallback(() => setToast(null), []);

  const loadPhotos = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedPhotos, fetchedCategories] = await Promise.all([
        fetchGalleryPhotos({ category: filterCategory, search: searchQuery }),
        fetchGalleryCategories(),
      ]);
      setPhotos(fetchedPhotos);
      setCategories(fetchedCategories);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to load gallery.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [filterCategory, searchQuery]);

  useEffect(() => {
    void loadPhotos();
  }, [loadPhotos]);

  const handleUploaded = useCallback(async (photo: GalleryPhoto) => {
    showToast(`"${photo.title}" uploaded successfully!`, "success");
    // Reset filters to "all" so the newly uploaded photo is guaranteed to be visible
    setFilterCategory("all");
    setSearchQuery("");
    // Optimistically prepend the photo, then do a full refresh from Supabase to confirm
    setPhotos((prev) => [photo, ...prev]);
    try {
      const [freshPhotos, freshCategories] = await Promise.all([
        fetchGalleryPhotos(),
        fetchGalleryCategories(),
      ]);
      setPhotos(freshPhotos);
      setCategories(freshCategories);
    } catch {
      // Optimistic update is still visible — a full refresh will happen on next filter change
    }
  }, []);



  const handleDeleted = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    setContent((prev) => {
      const exists = prev.featuredGalleryPhotos.some(fp => fp.id === id);
      if (exists) {
        const newState = { ...prev, featuredGalleryPhotos: prev.featuredGalleryPhotos.filter(fp => fp.id !== id) };
        import("../../services/contentService").then(({ updateSiteContent }) => {
          updateSiteContent(newState).then(() => {
            window.localStorage.setItem("austpc-content-v2", JSON.stringify(newState));
          }).catch(console.error);
        });
        return newState;
      }
      return prev;
    });
    showToast("Photo deleted successfully.", "success");
  };

  const handleUpdated = (updated: GalleryPhoto) => {
    setPhotos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast("Photo updated successfully.", "success");
  };

  const handleError = (msg: string) => showToast(msg, "error");



  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <PageHero
            eyebrow="Gallery Management"
            title="Photo Library"
            description="Upload, manage, and organise all AUSTPC photos. Changes appear on the public website immediately."
          />
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="rounded-full border border-white/10 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-white/5"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Upload form */}
        <UploadForm onUploaded={handleUploaded} onError={(msg) => showToast(msg, "error")} />

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title…"
            className="min-w-[200px] flex-1 rounded-2xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white outline-none focus:border-[#00FF66] transition-colors"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterCategory("all")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filterCategory === "all" ? "bg-[#00FF66] text-black" : "border border-white/10 bg-zinc-900 text-zinc-300 hover:bg-white/5"}`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filterCategory === cat ? "bg-[#00FF66] text-black" : "border border-white/10 bg-zinc-900 text-zinc-300 hover:bg-white/5"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery grid */}
        {isLoading ? (
          <div className="flex h-48 items-center justify-center">
            <Spinner />
          </div>
        ) : photos.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-[32px] border border-white/10 bg-zinc-900/50">
            <p className="text-2xl">📷</p>
            <p className="text-zinc-400">
              {searchQuery || filterCategory !== "all"
                ? "No photos match your filter."
                : "No photos yet. Upload your first photo above."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {photos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                isFeatured={content.featuredGalleryPhotos.some(p => p.id === photo.id)}
                onToggleFeatured={(p) => {
                  setContent(prev => {
                    const exists = prev.featuredGalleryPhotos.some(fp => fp.id === p.id);
                    let newFeatured;
                    if (exists) {
                      newFeatured = prev.featuredGalleryPhotos.filter(fp => fp.id !== p.id);
                    } else {
                      newFeatured = [p, ...prev.featuredGalleryPhotos];
                    }
                    return { ...prev, featuredGalleryPhotos: newFeatured };
                  });
                }}
                onDeleted={handleDeleted}
                onUpdated={handleUpdated}
                onError={handleError}
              />
            ))}
          </div>
        )}

        {/* Stats bar */}
        {!isLoading && photos.length > 0 && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-center text-xs text-zinc-600">
              {photos.length} photo{photos.length !== 1 ? "s" : ""} in gallery
            </p>
            <button
              onClick={async () => {
                try {
                  await saveChanges();
                } catch (e) {
                  showToast("Failed to save featured updates.", "error");
                }
              }}
              className="rounded-full bg-[#00FF66] px-8 py-3 text-sm font-bold text-black shadow-lg transition hover:scale-105"
            >
              Save Featured Updates
            </button>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </div>
  );
}

