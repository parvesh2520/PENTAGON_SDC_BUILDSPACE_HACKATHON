/*
  NotificationList.jsx
  --------------------
  Full notification list with dark AI-themed styling.
  Displays read/unread states with violet accent indicators.
*/

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";
import useAuthStore from "../../store/authStore";
import { timeAgo } from "../../utils/formatDate";
import { HiOutlineBell, HiOutlineCheck } from "react-icons/hi";

export default function NotificationList() {
  const user = useAuthStore((s) => s.user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    const { data, error: loadError } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (loadError) {
      setError(loadError.message);
    } else {
      setNotifications(data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  async function toggleRead(id, currentRead) {
    await supabase
      .from("notifications")
      .update({ read: !currentRead })
      .eq("id", id);

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !currentRead } : n))
    );
  }

  async function markAllRead() {
    if (!user) return;
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  if (!user) {
    return (
      <div className="card p-12 text-center">
        <p className="text-slate-400">Log in to see your notifications.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
          <HiOutlineBell className="w-6 h-6 text-violet-400" />
          Notifications
        </h1>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={markAllRead}
            className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors cursor-pointer flex items-center gap-1"
          >
            <HiOutlineCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {error && (
        <div className="card px-4 py-3 text-sm text-red-400 border-red-500/20 mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="h-3 bg-slate-800 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="card p-12 text-center">
          <HiOutlineBell className="w-10 h-10 text-violet-500/20 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => toggleRead(n.id, n.read)}
              className={`w-full text-left card p-4 flex items-start gap-3 cursor-pointer transition-all ${
                n.read ? "opacity-60" : "border-violet-500/20"
              }`}
            >
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                n.read ? "bg-slate-600" : "bg-violet-400 animate-soft-pulse"
              }`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${n.read ? "text-slate-400" : "text-white"}`}>
                  {n.message}
                </p>
                <p className="text-xs text-slate-600 mt-1">{timeAgo(n.created_at)}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
