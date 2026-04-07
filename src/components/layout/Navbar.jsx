/*
  Navbar.jsx
  ----------
  Premium floating navigation with glassmorphism and neon accents.
  Features: animated logo, smooth mobile drawer, glowing hover states.
*/

import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { HiOutlineMoon, HiOutlineSun, HiOutlineMenu, HiOutlineX, HiOutlineCode } from "react-icons/hi";
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

  /* Track scroll for glass effect intensity */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close dropdown on outside click */
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
    `relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
      isActive
        ? "text-cyan-300 bg-cyan-500/10 shadow-sm shadow-cyan-500/10"
        : "text-slate-400 hover:text-white hover:bg-white/5"
    }`;

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-slate-900/80 backdrop-blur-2xl border-b border-cyan-500/10 shadow-lg shadow-cyan-500/5"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* Animated top border */}
      <div className={`absolute top-0 left-0 right-0 h-px transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'}`}>
        <div className="h-full bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
      </div>

      <div className="app-shell flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl tracking-tight group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
            <HiOutlineCode className="w-5 h-5 text-white" />
          </div>
          <span className="text-gradient">Build</span>
          <span className="text-white group-hover:text-cyan-200 transition-colors">Space</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {(user ? primaryLinks : guestLinks).map((l) => (
            <NavLink key={l.to} to={l.to} className={navLinkClass}>
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="p-2.5 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all cursor-pointer"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
          </button>

          {user ? (
            <>
              {/* Notification bell */}
              <NotificationBell />

              {/* Avatar dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdown(!dropdownOpen)}
                  className="cursor-pointer rounded-full transition-all hover:ring-2 hover:ring-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/20"
                >
                  <Avatar
                    src={user.user_metadata?.avatar_url}
                    name={user.user_metadata?.display_name || user.email}
                    size="sm"
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-cyan-500/15 shadow-2xl shadow-black/50 py-2 animate-slide-down">
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-cyan-500/10">
                      <p className="text-sm font-semibold text-white truncate">
                        {user.user_metadata?.display_name || "Developer"}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      <Link
                        to={`/u/${user.user_metadata?.username || user.id}`}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all"
                        onClick={() => setDropdown(false)}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        My Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all"
                        onClick={() => setDropdown(false)}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        Settings
                      </Link>
                    </div>

                    <hr className="my-1 border-cyan-500/10" />

                    <button
                      onClick={handleSignOut}
                      className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Guest CTAs */
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
                Log In
              </Button>
              <Button size="sm" onClick={() => navigate("/auth")}>
                Sign Up
              </Button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2.5 text-slate-400 hover:text-cyan-400 cursor-pointer rounded-xl hover:bg-cyan-500/10 transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-cyan-500/10 bg-slate-900/98 backdrop-blur-2xl px-4 pb-6 pt-4 animate-slide-down">
          <div className="flex flex-col gap-2">
            {(user ? primaryLinks : guestLinks).map((l, i) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-3 text-sm font-medium transition-all animate-fade-up ${
                    isActive
                      ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                      : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`
                }
                style={{ animationDelay: `${i * 50}ms` }}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          {!user && (
            <div className="flex flex-col gap-3 pt-4 border-t border-cyan-500/10 mt-4">
              <Button variant="ghost" className="w-full" onClick={() => { navigate("/auth"); setMenuOpen(false); }}>
                Log In
              </Button>
              <Button className="w-full" onClick={() => { navigate("/auth"); setMenuOpen(false); }}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
