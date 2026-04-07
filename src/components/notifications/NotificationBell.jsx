/*
  NotificationBell.jsx
  --------------------
  Futuristic navbar notification bell with cyber glow badge.
*/

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiOutlineBell } from "react-icons/hi";
import { supabase } from "../../lib/supabaseClient";
import { useRealtime } from "../../hooks/useRealtime";
import useAuthStore from "../../store/authStore";

export default function NotificationBell() {
  const user = useAuthStore((s) => s.user);
  const [baseCount, setBaseCount] = useState(0);

  const { incoming } = useRealtime("notifications", user ? { column: "user_id", value: user.id } : null);

  useEffect(() => {
    if (!user) return;

    async function fetchCount() {
      const { count: c } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("read", false);

      setBaseCount(c || 0);
    }

    fetchCount();
  }, [user]);

  const count = baseCount + incoming.length;

  return (
    <Link
      to="/notifications"
      className="group relative p-2.5 rounded-xl text-slate-400 hover:text-cyan-400 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-violet-500/0 group-hover:from-cyan-500/10 group-hover:to-violet-500/10 rounded-xl blur transition-all duration-300" />
      
      <HiOutlineBell className="relative w-5 h-5 transition-transform duration-300 group-hover:scale-110" />

      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center">
          {/* Outer glow */}
          <span className="absolute inset-0 h-5 min-w-[20px] rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 blur-sm animate-pulse" />
          {/* Badge */}
          <span className="relative h-5 min-w-[20px] flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 px-1.5 text-[10px] font-bold font-mono text-white shadow-lg shadow-cyan-500/50">
            {count > 99 ? "99+" : count}
          </span>
        </span>
      )}
    </Link>
  );
}
