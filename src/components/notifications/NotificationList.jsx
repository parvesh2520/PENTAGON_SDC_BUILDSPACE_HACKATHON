/*
  NotificationList.jsx
  --------------------
  Full-page notification list. Each item shows a message, type badge,
  and read/unread state. Users can mark individual items or all as read.
*/

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";
import useAuthStore from "../../store/authStore";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { timeAgo } from "../../utils/formatDate";

const typeColour = {
  join_request: "brand",
  mention:      "green",
  update:       "yellow",
};

export default function NotificationList() {
  const user = useAuthStore((s) => s.user);
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (loadError) {
      setError(loadError.message || "Could not load notifications.");
      setLoading(false);
      return;
    }

    setItems(data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    loadNotifications();
  }, [user, loadNotifications]);

  async function markAllRead() {
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);

    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  async function toggleRead(id, currentState) {
    await supabase
      .from("notifications")
      .update({ read: !currentState })
      .eq("id", id);

    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !currentState } : n))
    );
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20 px-4 py-4 text-sm text-red-700 dark:text-red-200">
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* header row */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-heading dark:text-white">Notifications</h2>
        {items.some((n) => !n.read) && (
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            Mark all read
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-center py-12 text-muted">You're all caught up!</p>
      ) : (
        <ul className="space-y-2">
          {items.map((n) => (
            <li
              key={n.id}
              onClick={() => toggleRead(n.id, n.read)}
              className={
                "flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors " +
                (n.read
                  ? "border-border dark:border-slate-700 bg-white dark:bg-slate-800/50 opacity-70"
                  : "border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-900/20")
              }
            >
              {/* unread dot */}
              {!n.read && <span className="mt-1.5 h-2 w-2 rounded-full bg-brand-500 shrink-0" />}

              <div className="flex-1 min-w-0">
                <p className="text-sm text-heading dark:text-white">{n.message}</p>
                <p className="text-xs text-muted mt-1">{timeAgo(n.created_at)}</p>
              </div>

              <Badge color={typeColour[n.type] || "slate"}>{n.type.replace("_", " ")}</Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
