import { motion } from "framer-motion";
import HeroSection from "../../components/Hero/HeroSection";
import SectionTitle from "../../components/Common/SectionTitle";
import EventCard from "../../components/EventCard/EventCard";
import { featuredEvents, galleryHighlights, stats, testimonials } from "../../data/siteContent";
import PrimaryButton from "../../components/Common/PrimaryButton";

function Home() {
  return (
    <div className="bg-black text-white">
      <HeroSection />

      <main className="mx-auto flex max-w-7xl flex-col gap-20 px-4 py-20 sm:px-6 lg:px-8">
        <section className="grid gap-10 rounded-[32px] border border-white/10 bg-zinc-900/70 p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
          <div>
            <SectionTitle eyebrow="About the Club" title="Built for visual thinkers, storytellers, and future leaders." />
            <p className="mt-6 text-lg leading-8 text-zinc-400">
              AUSTPC brings together ambitious students who want to sharpen their eye, grow through collaboration, and turn passion into visible impact.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <PrimaryButton to="/about">Read More</PrimaryButton>
              <PrimaryButton to="/executive" className="border-white/20 bg-transparent text-white hover:bg-white/10">
                Meet the Team
              </PrimaryButton>
            </div>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-black/50 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {stats.map((stat) => (
                <motion.div key={stat.label} whileHover={{ y: -4 }} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-3xl font-semibold text-[#00FF66]">{stat.value}</p>
                  <p className="mt-2 text-sm text-zinc-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <SectionTitle eyebrow="Featured Events" title="Our most awaited experiences" description="Every event is designed to be memorable, relevant, and professionally executed." center />
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {featuredEvents.map((event) => (
              <EventCard key={event.slug} {...event} />
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-zinc-900/80 to-black/90 p-8 lg:p-12">
          <SectionTitle eyebrow="Gallery Preview" title="Moments shaped by creativity and craft" center />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {galleryHighlights.map((image, index) => (
              <img key={image} src={image} alt={`Gallery highlight ${index + 1}`} className="h-64 w-full rounded-[24px] object-cover" />
            ))}
          </div>
        </section>

        <section className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[32px] border border-white/10 bg-zinc-900/70 p-8">
            <SectionTitle eyebrow="Upcoming Events" title="What’s next on the calendar" />
            <div className="mt-8 space-y-4">
              {featuredEvents.map((event) => (
                <div key={event.slug} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#00FF66]">{event.category}</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">{event.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400">{event.date} • {event.venue}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[32px] border border-white/10 bg-zinc-900/70 p-8">
            <SectionTitle eyebrow="Testimonials" title="Members speak about the experience" />
            <div className="mt-8 space-y-5">
              {testimonials.map((item) => (
                <blockquote key={item.name} className="rounded-2xl border border-white/10 bg-black/40 p-6">
                  <p className="text-lg leading-8 text-zinc-300">“{item.quote}”</p>
                  <footer className="mt-4 text-sm font-semibold text-[#00FF66]">{item.name}</footer>
                  <p className="text-sm text-zinc-500">{item.role}</p>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}

export default Home;