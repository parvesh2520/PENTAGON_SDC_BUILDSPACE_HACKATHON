/*
  NotificationBell.jsx
  --------------------
  Navbar notification bell icon with unread count badge.
  Uses violet/cyan glow for the badge animation.
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
      className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
    >
      <HiOutlineBell className="w-5 h-5" />

      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-1 text-[10px] font-bold text-white animate-soft-pulse shadow-lg shadow-violet-500/30">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
