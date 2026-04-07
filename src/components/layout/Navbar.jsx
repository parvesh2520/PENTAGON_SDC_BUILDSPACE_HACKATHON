/*
  Navbar.jsx
  ----------
  Floating frosted-glass navigation bar with violet accent glow.
  Features: gradient logo, pill-shaped active links, smooth mobile
  drawer, avatar dropdown with glass effect.
*/

import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { HiOutlineMoon, HiOutlineSun, HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import useAuthStore from "../../store/authStore";
import useThemeStore from "../../store/themeStore";
import NotificationBell from "../notifications/NotificationBell";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";

export default function Navbar() {
  const user     = useAuthStore((s) => s.user);
  const signOut  = useAuthStore((s) => s.signOut);
  const theme    = useThemeStore((s) => s.theme);
  const toggle   = useThemeStore((s) => s.toggle);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen]     = useState(false);
  const [dropdownOpen, setDropdown] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const dropdownRef = useRef(null);

  /* track scroll to intensify glass effect */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* close dropdown on outside click */
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSignOut() {
    signOut();
    navigate("/");
    setDropdown(false);
  }

  const primaryLinks = [
    { to: "/feed",          label: "Feed" },
    { to: "/projects",      label: "Projects" },
    { to: "/opportunities", label: "Opportunities" },
    { to: "/search",        label: "Search" },
  ];

  const guestLinks = [
    { to: "/",              label: "Home" },
    { to: "/projects",      label: "Projects" },
    { to: "/opportunities", label: "Opportunities" },
  ];

  const navLinkClass = ({ isActive }) =>
    `relative px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
      isActive
        ? "text-white bg-violet-500/15 shadow-sm shadow-violet-500/10"
        : "text-slate-400 hover:text-white hover:bg-white/5"
    }`;

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-slate-900/80 backdrop-blur-2xl border-b border-violet-500/10 shadow-lg shadow-violet-500/5"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="app-shell flex h-16 items-center justify-between">
        {/* --- logo --- */}
        <Link to="/" className="flex items-center gap-1 font-display font-bold text-xl tracking-tight group">
          <span className="text-gradient">Build</span>
          <span className="text-white group-hover:text-violet-200 transition-colors">Space</span>
        </Link>

        {/* --- desktop nav links --- */}
        <div className="hidden md:flex items-center gap-1">
          {(user ? primaryLinks : guestLinks).map((l) => (
            <NavLink key={l.to} to={l.to} className={navLinkClass}>
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* --- right side controls --- */}
        <div className="flex items-center gap-2">
          {/* theme toggle */}
          <button
            onClick={toggle}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
          </button>

          {user ? (
            <>
              {/* notification bell */}
              <NotificationBell />

              {/* avatar dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdown(!dropdownOpen)}
                  className="cursor-pointer rounded-full transition-all hover:ring-2 hover:ring-violet-500/30"
                >
                  <Avatar
                    src={user.user_metadata?.avatar_url}
                    name={user.user_metadata?.display_name || user.email}
                    size="sm"
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-xl bg-slate-900/95 backdrop-blur-xl border border-violet-500/15 shadow-2xl shadow-black/40 py-1.5 animate-slide-down">
                    <div className="px-4 py-2 border-b border-violet-500/10">
                      <p className="text-sm font-medium text-white truncate">
                        {user.user_metadata?.display_name || "Developer"}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <Link
                      to={`/u/${user.user_metadata?.username || user.id}`}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-violet-500/10 transition-colors"
                      onClick={() => setDropdown(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-violet-500/10 transition-colors"
                      onClick={() => setDropdown(false)}
                    >
                      Settings
                    </Link>
                    <hr className="my-1 border-violet-500/10" />
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* guest CTAs */
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
                Log In
              </Button>
              <Button size="sm" onClick={() => navigate("/auth")}>
                Sign Up
              </Button>
            </div>
          )}

          {/* mobile hamburger */}
          <button
            className="md:hidden p-2 text-slate-400 hover:text-white cursor-pointer rounded-xl hover:bg-white/5 transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* --- mobile drawer --- */}
      {menuOpen && (
        <div className="md:hidden border-t border-violet-500/10 bg-slate-900/95 backdrop-blur-2xl px-4 pb-4 pt-2 animate-slide-down">
          <div className="flex flex-col gap-1">
            {(user ? primaryLinks : guestLinks).map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `block rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-violet-500/15 text-white"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
          </div>
          {!user && (
            <div className="flex flex-col gap-2 pt-3 border-t border-violet-500/10 mt-3">
              <Button variant="ghost" onClick={() => { navigate("/auth"); setMenuOpen(false); }}>
                Log In
              </Button>
              <Button onClick={() => { navigate("/auth"); setMenuOpen(false); }}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
