/*
  Sidebar.jsx
  -----------
  Futuristic left sidebar with neon accents and hover animations.
*/

import { NavLink } from "react-router-dom";
import { HiOutlineUser, HiOutlineFolder, HiOutlineBookmark, HiOutlineLightningBolt } from "react-icons/hi";
import useAuthStore from "../../store/authStore";

export default function Sidebar() {
  const user = useAuthStore((s) => s.user);

  const links = [
    { to: user ? `/u/${user.id}` : "/auth", icon: HiOutlineUser, label: "My Profile", color: "cyan" },
    { to: "/projects", icon: HiOutlineFolder, label: "My Projects", color: "violet" },
    { to: "/opportunities", icon: HiOutlineLightningBolt, label: "Opportunities", color: "emerald" },
    { to: "/search", icon: HiOutlineBookmark, label: "Explore", color: "amber" },
  ];

  const colorClasses = {
    cyan: {
      active: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-cyan-500/20",
      hover: "hover:bg-cyan-500/5 hover:border-cyan-500/20 hover:text-cyan-400",
      icon: "text-cyan-400"
    },
    violet: {
      active: "bg-violet-500/10 text-violet-400 border-violet-500/30 shadow-violet-500/20",
      hover: "hover:bg-violet-500/5 hover:border-violet-500/20 hover:text-violet-400",
      icon: "text-violet-400"
    },
    emerald: {
      active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-emerald-500/20",
      hover: "hover:bg-emerald-500/5 hover:border-emerald-500/20 hover:text-emerald-400",
      icon: "text-emerald-400"
    },
    amber: {
      active: "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-amber-500/20",
      hover: "hover:bg-amber-500/5 hover:border-amber-500/20 hover:text-amber-400",
      icon: "text-amber-400"
    }
  };

  return (
    <aside className="hidden lg:block w-60 shrink-0">
      <div className="sticky top-24 flex flex-col gap-2">
        {/* Header */}
        <div className="px-4 py-3 mb-2">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">Navigation</p>
        </div>

        {links.map((l, index) => {
          const colors = colorClasses[l.color];
          return (
            <NavLink
              key={l.to}
              to={l.to}
              style={{ animationDelay: `${index * 100}ms` }}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium border transition-all duration-300 animate-fade-up ${
                  isActive
                    ? `${colors.active} shadow-lg`
                    : `text-slate-400 border-transparent ${colors.hover}`
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-2 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? `bg-gradient-to-br from-${l.color}-500/20 to-transparent` 
                      : 'bg-slate-800/50 group-hover:bg-slate-800'
                  }`}>
                    <l.icon className={`w-5 h-5 transition-colors duration-300 ${isActive ? colors.icon : 'text-slate-500 group-hover:' + colors.icon}`} />
                  </div>
                  <span className="flex-1">{l.label}</span>
                  {isActive && (
                    <div className={`w-1.5 h-1.5 rounded-full bg-${l.color}-400 animate-pulse`} />
                  )}
                </>
              )}
            </NavLink>
          );
        })}

        {/* Status indicator */}
        <div className="mt-6 mx-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-slate-400">System Online</span>
          </div>
          <div className="h-1 rounded-full bg-slate-700 overflow-hidden">
            <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 animate-pulse" />
          </div>
        </div>
      </div>
    </aside>
  );
}
