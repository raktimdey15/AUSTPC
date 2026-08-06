import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import HeroSection from "../../components/Hero/HeroSection";
import SectionTitle from "../../components/Common/SectionTitle";
import EventCard from "../../components/EventCard/EventCard";
import PrimaryButton from "../../components/Common/PrimaryButton";
import { useSiteContent } from "../../context/ContentContext";

function CountUpValue({ value, shouldStart }: { value: string; shouldStart: boolean }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!shouldStart) {
      return;
    }

    const match = value.match(/(\d+(?:\.\d+)?)/);
    if (!match) {
      return;
    }

    const target = Number(match[1]);
    const duration = 1400;
    const startTime = performance.now();
    let frameId = 0;

    const step = (timestamp: number) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(target * eased);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      }
    };

    frameId = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(frameId);
  }, [shouldStart, value]);

  const suffix = value.replace(/\d+(?:\.\d+)?/, "");
  const formattedValue = Number.isInteger(displayValue) ? displayValue.toString() : displayValue.toFixed(1);

  return <span>{`${formattedValue}${suffix}`}</span>;
}

function Home() {
  const { content } = useSiteContent();
  const statsSectionRef = useRef<HTMLElement>(null);
  const statsSectionInView = useInView(statsSectionRef, { once: true, amount: 0.35 });

  return (
    <div className="bg-black text-white">
      <HeroSection />

      <main className="mx-auto flex max-w-7xl flex-col gap-20 px-4 py-20 sm:px-6 lg:px-8">
        <motion.section
          ref={statsSectionRef}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid gap-10 rounded-[32px] border border-white/10 bg-zinc-900/70 p-8 text-center lg:grid-cols-[1.1fr_0.9fr] lg:p-12 lg:text-left"
        >
          <div className="mx-auto max-w-2xl lg:mx-0">
            <SectionTitle eyebrow="About the Club" title="Built for visual thinkers, storytellers, and future leaders." />
            <p className="mt-6 text-lg leading-8 text-zinc-400">
              AUSTPC brings together ambitious students who want to sharpen their eye, grow through collaboration, and turn passion into visible impact.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
              <PrimaryButton to="/about">Read More</PrimaryButton>
              <PrimaryButton to="/executive" className="border-white/20 bg-transparent text-white hover:bg-white/10">
                Meet the Team
              </PrimaryButton>
            </div>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-black/50 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {content.stats.map((stat) => (
                <motion.div key={stat.label} whileHover={{ y: -4 }} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-3xl font-semibold text-[#00FF66]">
                    <CountUpValue value={stat.value} shouldStart={statsSectionInView} />
                  </p>
                  <p className="mt-2 text-sm text-zinc-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <SectionTitle eyebrow="Featured Events" title="Our most awaited experiences" description="Every event is designed to be memorable, relevant, and professionally executed." center />
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {content.featuredEvents.map((event) => (
              <EventCard key={event.slug} {...event} />
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="rounded-[32px] border border-white/10 bg-gradient-to-br from-zinc-900/80 to-black/90 p-8 lg:p-12"
        >
          <SectionTitle eyebrow="Gallery Preview" title="Moments shaped by creativity and craft" center />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {content.galleryHighlights.map((image, index) => (
              <img key={image} src={image} alt={`Gallery highlight ${index + 1}`} className="h-64 w-full rounded-[24px] object-cover" />
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid gap-10 text-center lg:grid-cols-[0.95fr_1.05fr] lg:text-left"
        >
          <div className="rounded-[32px] border border-white/10 bg-zinc-900/70 p-8">
            <SectionTitle eyebrow="Upcoming Events" title="What’s next on the calendar" />
            <div className="mt-8 space-y-4">
              {content.upcomingEventsList.map((event) => (
                <div key={event.title} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center lg:text-left">
                  <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400">{event.date} • {event.venue}</p>
                  <p className="mt-2 text-sm leading-7 text-zinc-400">{event.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[32px] border border-white/10 bg-zinc-900/70 p-8">
            <SectionTitle eyebrow="Latest Notices" title="Fresh updates from the club" />
            <div className="mt-8 space-y-4">
              {content.notices.map((notice) => (
                <div key={notice.title} className="rounded-2xl border border-white/10 bg-black/40 p-4 text-center lg:text-left">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-white">{notice.title}</h3>
                    <span className="text-sm text-[#00FF66]">{notice.date}</span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-zinc-400">{notice.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="rounded-[32px] border border-white/10 bg-zinc-900/70 p-8 text-center lg:p-12"
        >
          <SectionTitle eyebrow="Executive Preview" title="Leaders steering the creative vision" description="A dedicated team guiding events, partnerships, and club growth." center />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {content.executiveMembers.slice(0, 3).map((member) => (
              <div key={member.name} className="rounded-[24px] border border-white/10 bg-black/40 p-6 text-center">
                <img src={member.photo} alt={member.name} className="mx-auto h-24 w-24 rounded-2xl object-cover" />
                <h3 className="mt-4 text-xl font-semibold text-white">{member.name}</h3>
                <p className="mt-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#00FF66]">{member.position}</p>
                <p className="mt-3 text-sm leading-7 text-zinc-400">Executive leadership preview</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="rounded-[32px] border border-white/10 bg-gradient-to-br from-zinc-900/80 to-black/90 p-8 lg:p-12"
        >
          <SectionTitle eyebrow="Collaborations" title="Partners who help shape the experience" center />
          <div className="mt-10 overflow-hidden rounded-[28px] border border-white/10 bg-black/30 p-4">
            <div className="marquee-track flex w-max gap-4">
              {[...content.collaborations, ...content.collaborations].map((item, index) => (
                <div key={`${item.name}-${index}`} className="flex min-w-[320px] items-center gap-4 rounded-2xl border border-white/10 bg-zinc-950/80 px-5 py-4 text-left shadow-[0_0_30px_rgba(0,255,102,0.05)]">
                  <img src={item.logo} alt={item.name} className="h-14 w-14 rounded-xl object-cover" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold uppercase tracking-[0.3em] text-[#00FF66]">{item.eventName}</p>
                    <h3 className="mt-1 truncate text-lg font-semibold text-white">{item.name}</h3>
                    <p className="mt-1 text-sm text-zinc-400">{item.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="rounded-[32px] border border-white/10 bg-zinc-900/70 p-8 text-center lg:p-12"
        >
          <SectionTitle eyebrow="Testimonials" title="Members speak about the experience" center />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {content.testimonials.map((item) => (
              <blockquote key={item.name} className="rounded-[24px] border border-white/10 bg-black/40 p-6 text-center">
                <p className="text-lg leading-8 text-zinc-300">“{item.quote}”</p>
                <footer className="mt-4 text-sm font-semibold text-[#00FF66]">{item.name}</footer>
                <p className="text-sm text-zinc-500">{item.role}</p>
              </blockquote>
            ))}
          </div>
        </motion.section>
      </main>

    </div>
  );
}

export default Home;