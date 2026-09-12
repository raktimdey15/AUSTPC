import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import PageHero from "../../components/Common/PageHero";
import SectionTitle from "../../components/Common/SectionTitle";
import PrimaryButton from "../../components/Common/PrimaryButton";
import CountUpValue from "../../components/Common/CountUpValue";
import { useSiteContent } from "../../context/ContentContext";

export default function About() {
  const { content } = useSiteContent();
  const statsRef = useRef<HTMLElement>(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });

  // Use up to 3 gallery highlights for the About page collage
  const collageImages = content.galleryHighlights.slice(0, 3);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 py-8 sm:px-6 lg:px-8 lg:py-10 pb-24">
      <PageHero eyebrow={content.about.eyebrow} title={content.about.title} description={content.about.description} />

      {/* The Story - Split Layout */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid gap-12 lg:grid-cols-2 lg:items-center"
      >
        <div className="space-y-6">
          <SectionTitle eyebrow="Our Story" title="Capturing moments that define a legacy." />
          <div className="pt-4">
            <PrimaryButton to="/join" className="border-white/20 bg-white/5 text-white hover:bg-white/10">
              Become a Member
            </PrimaryButton>
          </div>
        </div>

        {/* Dynamic Image Collage */}
        {collageImages.length >= 3 && (
          <div className="grid grid-cols-2 gap-4">
            <img src={collageImages[0]} alt="AUSTPC Highlight 1" className="h-full w-full rounded-3xl object-cover min-h-[250px]" />
            <div className="grid gap-4">
              <img src={collageImages[1]} alt="AUSTPC Highlight 2" className="h-40 w-full rounded-3xl object-cover" />
              <img src={collageImages[2]} alt="AUSTPC Highlight 3" className="h-40 w-full rounded-3xl object-cover" />
            </div>
          </div>
        )}
      </motion.section>

      {/* By The Numbers (Stats) */}
      <motion.section
        ref={statsRef}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-[32px] border border-white/10 bg-zinc-900/80 p-10 lg:p-16"
      >
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {content.stats.map((stat, index) => (
            <motion.div 
              key={stat.label} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={statsInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <p className="text-4xl lg:text-5xl font-bold text-[#00FF66] mb-2">
                <CountUpValue value={stat.value} shouldStart={statsInView} />
              </p>
              <p className="text-sm font-medium uppercase tracking-widest text-zinc-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Member Voices (Testimonials) */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-10"
      >
        <SectionTitle eyebrow="Voices" title="What our community says" center />
        <div className="grid gap-6 md:grid-cols-2">
          {content.testimonials.map((item) => (
            <blockquote key={item.name} className="flex flex-col justify-between rounded-[24px] border border-white/10 bg-black/40 p-8">
              <p className="text-lg leading-relaxed text-zinc-300">“{item.quote}”</p>
              <footer className="mt-8 border-t border-white/10 pt-4">
                <div className="font-semibold text-white">{item.name}</div>
                <div className="text-sm text-[#00FF66]">{item.role}</div>
              </footer>
            </blockquote>
          ))}
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-[32px] bg-gradient-to-br from-[#00FF66]/20 to-black border border-[#00FF66]/30 p-12 text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-4">Ready to frame your journey?</h2>
        <p className="text-lg text-zinc-300 mb-8 max-w-2xl mx-auto">
          Join a community of passionate visual storytellers, learn from experienced members, and gain access to exclusive workshops and photowalks.
        </p>
        <PrimaryButton to="/join" className="text-lg px-8 py-4">
          Join AUSTPC Today
        </PrimaryButton>
      </motion.section>

    </div>
  );
}