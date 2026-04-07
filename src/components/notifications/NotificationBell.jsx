/*
  NotificationBell.jsx
  --------------------
  The little bell icon in the navbar. Shows a red badge with the
  count of unread notifications by subscribing to the realtime
  channel on the notifications table.
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

  // subscribe to new notifications aimed at this user
  const { incoming } = useRealtime("notifications", user ? { column: "user_id", value: user.id } : null);

  // fetch unread count on mount
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
      className="relative p-2 rounded-lg text-body dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
    >
      <HiOutlineBell className="w-5 h-5" />

      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white animate-soft-pulse">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
