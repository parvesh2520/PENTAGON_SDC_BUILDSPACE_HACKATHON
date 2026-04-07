/*
  Sidebar.jsx
  -----------
  Left sidebar used inside the Feed / Dashboard layout.
  Quick links to the user's own stuff: profile, projects, bookmarks.
*/

import { NavLink } from "react-router-dom";
import { HiOutlineUser, HiOutlineFolder, HiOutlineBookmark, HiOutlineLightningBolt } from "react-icons/hi";
import useAuthStore from "../../store/authStore";

export default function Sidebar() {
  const user = useAuthStore((s) => s.user);

  const links = [
    { to: user ? `/u/${user.id}` : "/auth", icon: HiOutlineUser, label: "My Profile" },
    { to: "/projects", icon: HiOutlineFolder, label: "My Projects" },
    { to: "/opportunities", icon: HiOutlineLightningBolt, label: "Opportunities" },
    { to: "/search", icon: HiOutlineBookmark, label: "Explore" },
  ];

  return (
    <aside className="hidden lg:block w-56 shrink-0">
      <div className="sticky top-20 flex flex-col gap-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
                  : "text-body dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`
            }
          >
            <l.icon className="w-5 h-5 text-muted" />
            {l.label}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
