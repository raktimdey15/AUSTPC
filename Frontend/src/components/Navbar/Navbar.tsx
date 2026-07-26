import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "../../assets/icon/austpc.png";
import { useSiteContent } from "../../context/ContentContext";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/events", label: "Events" },
  { to: "/executive", label: "Executive" },
  { to: "/sub-executive", label: "Sub Executive" },
  { to: "/hall-of-fame", label: "Hall of Fame" },
  { to: "/upcoming-events", label: "Upcoming Events" },
  { to: "/notice", label: "Notice" },
  { to: "/join", label: "Join" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hallOfFameOpen, setHallOfFameOpen] = useState(false);
  const { content } = useSiteContent();

  const hallOfFameItems = [...content.hallOfFameSemesters]
    .sort((left, right) => right.year.localeCompare(left.year) || right.title.localeCompare(left.title))
    .slice(0, 3)
    .map((semester) => ({ to: `/hall-of-fame/${semester.slug}`, label: semester.title }));

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center transition duration-300 hover:scale-105">
          <img src={logo} alt="AUSTPC logo" className="h-12 w-auto max-w-[180px] object-contain" />
        </Link>

        <button className="rounded-full border border-white/15 p-2 text-white md:hidden" onClick={() => setOpen(!open)}>
          {open ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>

        <nav className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
          {navItems.map((item) =>
            item.label === "Hall of Fame" ? (
              <div
                key={item.to}
                className="relative"
                onMouseEnter={() => setHallOfFameOpen(true)}
                onMouseLeave={() => setHallOfFameOpen(false)}
                onFocus={() => setHallOfFameOpen(true)}
                onBlur={() => setHallOfFameOpen(false)}
              >
                <button
                  type="button"
                  className="rounded-full px-3 py-2 text-zinc-300 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#00FF66]/10 hover:text-[#00FF66] hover:shadow-[0_0_20px_rgba(0,255,102,0.18)]"
                >
                  {item.label}
                </button>
                <div
                  className={`absolute left-0 top-full mt-3 w-40 rounded-2xl border border-white/10 bg-zinc-950/95 p-2 shadow-2xl transition duration-300 ${hallOfFameOpen ? "visible opacity-100" : "invisible opacity-0"}`}
                >
                  {hallOfFameItems.map((subItem) => (
                    <Link
                      key={subItem.to}
                      to={subItem.to}
                      className="block rounded-xl px-3 py-2 text-sm text-zinc-300 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#00FF66]/10 hover:text-[#00FF66] hover:shadow-[0_0_12px_rgba(0,255,102,0.12)]"
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 transition-all duration-300 ${isActive ? "bg-[#00FF66]/10 text-[#00FF66] shadow-[0_0_18px_rgba(0,255,102,0.16)]" : "text-zinc-300 hover:-translate-y-0.5 hover:bg-[#00FF66]/10 hover:text-[#00FF66] hover:shadow-[0_0_16px_rgba(0,255,102,0.12)]"}`
                }
              >
                {item.label}
              </NavLink>
            )
          )}
        </nav>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-zinc-950/95 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm text-zinc-300">
            {navItems.map((item) =>
              item.label === "Hall of Fame" ? (
                <div key={item.to}>
                  <p className="text-[#00FF66]">{item.label}</p>
                  <div className="mt-2 flex flex-col gap-2 pl-3">
                    {hallOfFameItems.map((subItem) => (
                      <Link key={subItem.to} to={subItem.to} onClick={() => setOpen(false)}>
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>
                  {item.label}
                </NavLink>
              )
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
