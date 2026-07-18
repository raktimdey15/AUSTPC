import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

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
  { to: "/admin", label: "Admin" },
];

const hallOfFameItems = [
  { to: "/hall-of-fame/spring-2026", label: "Spring 2026" },
  { to: "/hall-of-fame/fall-2025", label: "Fall 2025" },
  { to: "/hall-of-fame/spring-2025", label: "Spring 2025" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-semibold tracking-[0.3em] text-white">
          AUSTPC
        </Link>

        <button className="rounded-full border border-white/15 p-2 text-white md:hidden" onClick={() => setOpen(!open)}>
          {open ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>

        <nav className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
          {navItems.map((item) =>
            item.label === "Hall of Fame" ? (
              <div key={item.to} className="group relative">
                <button className="transition hover:text-[#00FF66]">{item.label}</button>
                <div className="invisible absolute left-0 top-full mt-3 w-40 rounded-2xl border border-white/10 bg-zinc-950/95 p-2 opacity-0 shadow-2xl transition group-hover:visible group-hover:opacity-100">
                  {hallOfFameItems.map((subItem) => (
                    <Link
                      key={subItem.to}
                      to={subItem.to}
                      className="block rounded-xl px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-[#00FF66]"
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
                className={({ isActive }) =>
                  `transition ${isActive ? "text-[#00FF66]" : "hover:text-[#00FF66]"}`
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
