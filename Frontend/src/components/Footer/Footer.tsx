import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa6";
import logo from "../../assets/icon/austpc.png";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand & Intro */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block transition duration-300 hover:scale-105">
              <img src={logo} alt="AUSTPC logo" className="h-20 w-auto object-contain" />
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-7 text-zinc-400">
              Building a culture of creativity, discipline, and visual excellence for students who believe in photography as both art and impact.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <a href="https://www.facebook.com/austpc" target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-zinc-300 transition-all hover:-translate-y-1 hover:bg-[#00FF66]/20 hover:text-[#00FF66]">
                <FaFacebook size={18} />
              </a>
              <a href="https://www.instagram.com/austpc_official/" target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-zinc-300 transition-all hover:-translate-y-1 hover:bg-[#00FF66]/20 hover:text-[#00FF66]">
                <FaInstagram size={18} />
              </a>
              <a href="https://www.linkedin.com/company/aust-photography-club/" target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-zinc-300 transition-all hover:-translate-y-1 hover:bg-[#00FF66]/20 hover:text-[#00FF66]">
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-white">Explore</h3>
            <ul className="mt-6 flex flex-col gap-3">
              <li><Link to="/about" className="text-sm text-zinc-400 transition hover:text-[#00FF66]">About Us</Link></li>
              <li><Link to="/events" className="text-sm text-zinc-400 transition hover:text-[#00FF66]">Events & Workshops</Link></li>
              <li><Link to="/executive" className="text-sm text-zinc-400 transition hover:text-[#00FF66]">Executive Panel</Link></li>
              <li><Link to="/hall-of-fame" className="text-sm text-zinc-400 transition hover:text-[#00FF66]">Hall of Fame</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-white">Contact</h3>
            <ul className="mt-6 flex flex-col gap-3 text-sm text-zinc-400">
              <li>Ahsanullah University of Science and Technology</li>
              <li>141 & 142, Love Road, Tejgaon Industrial Area</li>
              <li>Dhaka-1208, Bangladesh</li>
              <li className="mt-2"><a href="mailto:austpc43@gmail.com" className="transition hover:text-[#00FF66]">austpc43@gmail.com</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} AUST Photography Club. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-zinc-300">Privacy Policy</Link>
            <Link to="#" className="hover:text-zinc-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
