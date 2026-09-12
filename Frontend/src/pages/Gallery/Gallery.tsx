import { useEffect, useState } from "react";
import PageHero from "../../components/Common/PageHero";
import { fetchGalleryPhotos, type GalleryPhoto } from "../../services/galleryService";
import { motion } from "framer-motion";

export default function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchGalleryPhotos()
      .then((data) => setPhotos(data))
      .catch((error) => console.error("Error fetching gallery:", error))
      .finally(() => setLoading(false));
  }, []);

  // Close lightbox when hitting Escape key
  useEffect(() => {
    if (expandedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [expandedImage]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <PageHero
        eyebrow="Gallery"
        title="Moments captured in time"
        description="A curated collection of photographs taken by our talented members across various events and photowalks."
      />

      <section className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-8">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#00FF66] border-t-transparent"></div>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-12 text-zinc-400">
            <p className="text-xl mb-2">No photos uploaded yet</p>
            <p>Check back later for stunning visuals from our members.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <motion.div
                key={photo.id}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => setExpandedImage(photo.image_url)}
                className="relative overflow-hidden rounded-[24px] border border-white/10 bg-black/30 shadow-xl cursor-pointer group"
              >
                <img
                  src={photo.image_url}
                  alt={photo.title}
                  className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-lg font-semibold text-white truncate">{photo.title}</h3>
                  {photo.photographer_name && (
                    <p className="mt-1 flex items-center gap-2 text-sm text-[#00FF66]">
                      <span>📷</span> By {photo.photographer_name}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox Overlay */}
      {expandedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setExpandedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#00FF66] hover:text-black"
            onClick={() => setExpandedImage(null)}
          >
            ✕
          </button>
          <img 
            src={expandedImage} 
            alt="Expanded gallery photo" 
            className="max-h-[90vh] max-w-full rounded-[16px] object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  );
}
