/*
  NotificationList.jsx
  --------------------
  Futuristic notification list with cyber aesthetics.
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
      <div className="relative rounded-2xl bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 p-12 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0, 255, 255, 0.3) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />
        <div className="relative">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center">
            <HiOutlineBell className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-slate-400">Log in to see your notifications.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-cyan-400 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/20">
            <HiOutlineBell className="w-6 h-6 text-cyan-400" />
          </div>
          Notifications
        </h1>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={markAllRead}
            className="group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 cursor-pointer"
          >
            <HiOutlineCheck className="w-4 h-4 transition-transform group-hover:scale-110" />
            Mark all read
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-400 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative rounded-2xl bg-slate-900/50 border border-slate-700/50 p-5 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent animate-shimmer" />
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-slate-700 mt-1" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-800/50 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="relative rounded-2xl bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 p-16 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0, 255, 255, 0.3) 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }} />
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border border-cyan-500/20 flex items-center justify-center">
              <HiOutlineBell className="w-10 h-10 text-cyan-500/30" />
            </div>
            <p className="text-slate-400 text-sm">No notifications yet</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n, index) => (
            <button
              key={n.id}
              onClick={() => toggleRead(n.id, n.read)}
              style={{ animationDelay: `${index * 50}ms` }}
              className={`group w-full text-left rounded-2xl p-5 flex items-start gap-4 cursor-pointer transition-all duration-300 animate-fade-up border ${
                n.read 
                  ? "bg-slate-900/40 border-slate-700/30 opacity-60 hover:opacity-80" 
                  : "bg-slate-900/80 border-cyan-500/20 hover:border-cyan-500/40"
              }`}
            >
              <div className={`relative w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                n.read ? "bg-slate-600" : "bg-cyan-400"
              }`}>
                {!n.read && (
                  <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-75" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm leading-relaxed ${n.read ? "text-slate-400" : "text-white"}`}>
                  {n.message}
                </p>
                <p className="text-xs text-slate-600 mt-2 font-mono">{timeAgo(n.created_at)}</p>
              </div>
              <div className={`text-xs font-mono px-2 py-1 rounded-lg transition-colors duration-300 ${
                n.read 
                  ? "text-slate-600 bg-slate-800/50" 
                  : "text-cyan-400 bg-cyan-500/10 border border-cyan-500/20"
              }`}>
                {n.read ? "READ" : "NEW"}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
