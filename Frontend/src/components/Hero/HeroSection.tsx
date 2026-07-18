import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PrimaryButton from "../Common/PrimaryButton";
import { useSiteContent } from "../../context/ContentContext";

export default function HeroSection() {
  const { content } = useSiteContent();
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = content.hero.slides;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 2000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,255,102,0.14),transparent_35%),linear-gradient(120deg,rgba(255,255,255,0.04),transparent)]" />
      <AnimatePresence mode="wait">
        <motion.img
          key={slides[activeIndex]}
          src={slides[activeIndex]}
          alt="Photography club event"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 0.7, scale: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative mx-auto flex min-h-[90vh] max-w-7xl items-center px-4 py-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="max-w-3xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#00FF66]">{content.hero.eyebrow}</p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-7xl">
            {content.hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            {content.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <motion.div whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 1 }}>
              <PrimaryButton to="/events">{content.hero.primaryButtonLabel}</PrimaryButton>
            </motion.div>
            <motion.div whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 1 }}>
              <PrimaryButton to="/join" className="border-white/20 bg-transparent text-white hover:bg-white/10">
                {content.hero.secondaryButtonLabel}
              </PrimaryButton>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
