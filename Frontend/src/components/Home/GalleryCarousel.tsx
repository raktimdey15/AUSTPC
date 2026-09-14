import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryPhoto } from "../../services/galleryService";

interface GalleryCarouselProps {
  photos: GalleryPhoto[];
  fallbackHighlights: string[];
}

interface Slide {
  id: string;
  image: string;
  title?: string;
  photographer?: string;
}

const AUTO_INTERVAL = 5000;

export default function GalleryCarousel({ photos, fallbackHighlights }: GalleryCarouselProps) {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const slides: Slide[] =
    photos.length > 0
      ? photos.map((p) => ({ id: p.id, image: p.image_url, title: p.title, photographer: p.photographer_name ?? undefined }))
      : fallbackHighlights.map((img, i) => ({ id: `fb-${i}`, image: img }));

  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedRef = useRef(false);
  const count = slides.length;

  const goTo = useCallback((i: number) => {
    setCurrent(((i % count) + count) % count);
  }, [count]);

  const next = useCallback(() => goTo(current + 1), [goTo, current]);
  const prev = useCallback(() => goTo(current - 1), [goTo, current]);

  // Auto-advance
  useEffect(() => {
    if (count <= 1) return;
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) setCurrent((c) => (c + 1) % count);
    }, AUTO_INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [count]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) setCurrent((c) => (c + 1) % count);
    }, AUTO_INTERVAL);
  }, [count]);

  // Lightbox body scroll lock
  useEffect(() => {
    document.body.style.overflow = expandedImage ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [expandedImage]);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (expandedImage && e.key === "Escape") { setExpandedImage(null); return; }
      if (e.key === "ArrowRight") { next(); resetTimer(); }
      if (e.key === "ArrowLeft") { prev(); resetTimer(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev, expandedImage, resetTimer]);

  if (slides.length === 0) {
    return (
      <div className="mt-10 flex items-center justify-center rounded-[24px] border border-white/10 bg-black/30 p-12">
        <p className="text-zinc-500">No gallery photos to display yet.</p>
      </div>
    );
  }

  // Calculate indices for the 3-slide view (prev, current, next)
  const getIndex = (offset: number) => ((current + offset) % count + count) % count;

  return (
    <div
      className="mt-10"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      {/* SketchzLab-style 3-panel slider */}
      <div className="relative flex items-center justify-center gap-3 sm:gap-5 py-4 overflow-hidden">
        {/* Left blurred preview */}
        {count > 1 && (
          <button
            type="button"
            onClick={() => { prev(); resetTimer(); }}
            className="relative hidden sm:block w-[18%] shrink-0 overflow-hidden rounded-[16px] aspect-[3/2] transition-all duration-500 cursor-pointer opacity-60 hover:opacity-80"
            style={{ filter: "blur(4px) brightness(0.6)" }}
          >
            <img
              src={slides[getIndex(-1)].image}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
          </button>
        )}

        {/* Center active slide */}
        <div className="relative w-full sm:w-[60%] shrink-0 overflow-hidden rounded-[20px] sm:rounded-[24px] border border-white/10 shadow-2xl shadow-black/50">
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={slides[current].id}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute inset-0 cursor-pointer"
                onClick={() => setExpandedImage(slides[current].image)}
              >
                <img
                  src={slides[current].image}
                  alt={slides[current].title ?? "Gallery photo"}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                {/* Caption */}
                {(slides[current].title || slides[current].photographer) && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 pointer-events-none">
                    {slides[current].title && (
                      <h3 className="text-base sm:text-xl font-semibold text-white drop-shadow-lg line-clamp-1">{slides[current].title}</h3>
                    )}
                    {slides[current].photographer && (
                      <p className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm text-[#00FF66] drop-shadow-lg">
                        📷 By {slides[current].photographer}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation arrows inside center */}
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => { prev(); resetTimer(); }}
                className="absolute left-2 sm:left-3 top-1/2 z-10 flex h-8 w-8 sm:h-10 sm:w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-lg text-white/80 backdrop-blur-sm transition hover:bg-[#00FF66] hover:text-black"
                aria-label="Previous slide"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => { next(); resetTimer(); }}
                className="absolute right-2 sm:right-3 top-1/2 z-10 flex h-8 w-8 sm:h-10 sm:w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-lg text-white/80 backdrop-blur-sm transition hover:bg-[#00FF66] hover:text-black"
                aria-label="Next slide"
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* Right blurred preview */}
        {count > 1 && (
          <button
            type="button"
            onClick={() => { next(); resetTimer(); }}
            className="relative hidden sm:block w-[18%] shrink-0 overflow-hidden rounded-[16px] aspect-[3/2] transition-all duration-500 cursor-pointer opacity-60 hover:opacity-80"
            style={{ filter: "blur(4px) brightness(0.6)" }}
          >
            <img
              src={slides[getIndex(1)].image}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
          </button>
        )}
      </div>

      {/* Dot indicators */}
      {count > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => { goTo(i); resetTimer(); }}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "h-2.5 w-8 bg-[#00FF66] shadow-[0_0_10px_rgba(0,255,102,0.5)]"
                  : "h-2.5 w-2.5 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={() => setExpandedImage(null)}
          >
            <button
              className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[#00FF66] hover:text-black"
              onClick={() => setExpandedImage(null)}
            >
              ✕
            </button>
            <motion.img
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              src={expandedImage}
              alt="Expanded gallery photo"
              className="max-h-[90vh] max-w-full rounded-[16px] object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
