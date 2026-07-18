import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950/90">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#00FF66]">AUST Photography Club</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">Capturing stories with intention and craft.</h2>
          <p className="mt-4 text-sm leading-7 text-zinc-400">
            We build a culture of creativity, discipline, and visual excellence for students who believe in photography as both art and impact.
          </p>
        </div>

        <div className="flex flex-col gap-3 text-sm text-zinc-400">
          <div className="flex items-center gap-3">
            <a href="#" className="rounded-full border border-white/10 p-2 text-white transition hover:border-[#00FF66] hover:text-[#00FF66]">
              <FaFacebook />
            </a>
            <a href="#" className="rounded-full border border-white/10 p-2 text-white transition hover:border-[#00FF66] hover:text-[#00FF66]">
              <FaInstagram />
            </a>
            <a href="#" className="rounded-full border border-white/10 p-2 text-white transition hover:border-[#00FF66] hover:text-[#00FF66]">
              <FaLinkedin />
            </a>
          </div>
          <p>© {new Date().getFullYear()} AUSTPC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
