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
  { to: "/sub-executive", label: "Sub Exec" },
  { to: "/hall-of-fame", label: "Hall of Fame" },
  { to: "/upcoming-events", label: "Upcoming" },
  { to: "/notice", label: "Notice" },
  { to: "/gallery", label: "Gallery" },
  { to: "/join", label: "Join" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hallOfFameOpen, setHallOfFameOpen] = useState(false);
  const { content } = useSiteContent();

  const hallOfFameItems = [...content.hallOfFameSemesters]
    .sort((left, right) => right.year.localeCompare(left.year) || right.title.localeCompare(left.title))
    .map((semester) => ({ to: `/hall-of-fame/${semester.slug}`, label: semester.title }));

  const linkClasses = (isActive: boolean) =>
    `rounded-full px-3 py-1.5 text-[13px] font-medium transition-all duration-200 whitespace-nowrap ${
      isActive
        ? "bg-[#00FF66]/15 text-[#00FF66]"
        : "text-zinc-300 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/95 backdrop-blur-md supports-[backdrop-filter]:bg-zinc-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center transition duration-300 hover:scale-105">
          <img src={logo} alt="AUSTPC logo" className="h-10 w-auto max-w-[160px] object-contain" />
        </Link>

        {/* Mobile toggle */}
        <button
          className="rounded-full border border-white/15 p-2 text-white lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) =>
            item.label === "Hall of Fame" ? (
              <div
                key={item.to}
                className="relative"
                onMouseEnter={() => setHallOfFameOpen(true)}
                onMouseLeave={() => setHallOfFameOpen(false)}
              >
                <button
                  type="button"
                  className="rounded-full px-3 py-1.5 text-[13px] font-medium text-zinc-300 transition-all duration-200 hover:bg-white/5 hover:text-white whitespace-nowrap"
                >
                  {item.label}
                </button>
                <div
                  className={`absolute left-0 top-full mt-2 min-w-[160px] rounded-2xl border border-white/10 bg-zinc-950 p-1.5 shadow-2xl transition-all duration-200 ${hallOfFameOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"}`}
                >
                  {hallOfFameItems.map((subItem) => (
                    <Link
                      key={subItem.to}
                      to={subItem.to}
                      className="block rounded-xl px-3 py-2 text-sm text-zinc-300 transition hover:bg-[#00FF66]/10 hover:text-[#00FF66]"
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
                className={({ isActive }) => linkClasses(isActive)}
              >
                {item.label}
              </NavLink>
            )
          )}
        </nav>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-zinc-950 px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((item) =>
              item.label === "Hall of Fame" ? (
                <div key={item.to}>
                  <p className="rounded-xl px-3 py-2.5 text-sm font-semibold text-[#00FF66]">{item.label}</p>
                  <div className="ml-3 flex flex-col gap-0.5 border-l border-white/10 pl-3">
                    {hallOfFameItems.map((subItem) => (
                      <Link
                        key={subItem.to}
                        to={subItem.to}
                        onClick={() => setOpen(false)}
                        className="rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
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
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      isActive ? "bg-[#00FF66]/10 text-[#00FF66]" : "text-zinc-300 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
}
