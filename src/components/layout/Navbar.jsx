/*
  Navbar.jsx
  ----------
  Persistent top navigation bar — shows across every page.
  Handles: logo, nav links, dark-mode toggle, login/signup CTAs,
  and (when logged in) the notification bell + avatar dropdown.
*/

import { useState } from "react";
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

  function handleSignOut() {
    signOut();
    navigate("/");
  }

  const primaryLinks = [
    { to: "/feed",          label: "Feed" },
    { to: "/projects",      label: "Projects" },
    { to: "/opportunities", label: "Opportunities" },
    { to: "/search",        label: "Search" },
  ];

  const guestLinks = [
    { to: "/", label: "Home" },
    { to: "/projects", label: "Projects" },
    { to: "/opportunities", label: "Opportunities" },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border dark:border-slate-700 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* --- logo --- */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-heading dark:text-white">
          <span className="text-brand-600">Build</span>Space
        </Link>

        {/* --- desktop nav links --- */}
        <div className="hidden md:flex items-center gap-6">
          {(user ? primaryLinks : guestLinks).map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm transition-colors ${
                    isActive
                      ? "text-brand-600 dark:text-brand-400 font-semibold"
                      : "text-body dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
        </div>

        {/* --- right side controls --- */}
        <div className="flex items-center gap-3">
          {/* theme toggle */}
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-body dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
          </button>

          {user ? (
            <>
              {/* notification bell */}
              <NotificationBell />

              {/* avatar dropdown */}
              <div className="relative">
                <button onClick={() => setDropdown(!dropdownOpen)} className="cursor-pointer">
                  <Avatar
                    src={user.user_metadata?.avatar_url}
                    name={user.user_metadata?.display_name || user.email}
                    size="sm"
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-slate-800 border border-border dark:border-slate-700 shadow-lg py-1 animate-fade-up">
                    <Link
                      to={`/u/${user.user_metadata?.username || user.id}`}
                      className="block px-4 py-2 text-sm text-body dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                      onClick={() => setDropdown(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-body dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                      onClick={() => setDropdown(false)}
                    >
                      Settings
                    </Link>
                    <hr className="my-1 border-border dark:border-slate-700" />
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
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
            className="md:hidden p-2 text-body dark:text-slate-300 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* --- mobile drawer --- */}
      {menuOpen && (
        <div className="md:hidden border-t border-border dark:border-slate-700 bg-white dark:bg-slate-900 px-4 pb-4 animate-fade-up">
          {user ? (
            primaryLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `block rounded-lg px-2 py-2 text-sm ${
                    isActive
                      ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
                      : "text-body dark:text-slate-300"
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </NavLink>
            ))
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              {guestLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-lg px-2 py-2 text-sm ${
                      isActive
                        ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
                        : "text-body dark:text-slate-300"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
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
