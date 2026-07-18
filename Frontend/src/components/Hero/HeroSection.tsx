import { motion } from "framer-motion";
import PrimaryButton from "../Common/PrimaryButton";

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,255,102,0.14),transparent_35%),linear-gradient(120deg,rgba(255,255,255,0.04),transparent)]" />
      <img
        src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1800&q=80"
        alt="Photography club event"
        className="absolute inset-0 h-full w-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative mx-auto flex min-h-[90vh] max-w-7xl items-center px-4 py-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#00FF66]">AUST Photography Club</p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-7xl">
            Where stories become timeless frames.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            Explore exhibitions, workshops, and a thriving creative community built around photography, design, and visual leadership.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <PrimaryButton to="/events">Explore Events</PrimaryButton>
            <PrimaryButton to="/join" className="border-white/20 bg-transparent text-white hover:bg-white/10">
              Join the Club
            </PrimaryButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
