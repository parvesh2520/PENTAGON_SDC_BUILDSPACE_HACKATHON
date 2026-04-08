/*
  NotificationList.jsx
  --------------------
  Real-time notification list wired to Supabase.
  Premium BuildSpace design system with rich text, tab filtering,
  inline actions, and distinct read/unread states.
*/

import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";
import useAuthStore from "../../store/authStore";
import { timeAgo } from "../../utils/formatDate";
import { Bell, Check, UserPlus, X, AlertCircle } from "lucide-react";

// --- ANIMATION VARIANTS ---
const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const rowVariants = {
  hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

// --- TABS ---
const TABS = ["All", "Unread", "Join Requests"]

export default function NotificationList() {
  const user = useAuthStore((s) => s.user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("All");

  const loadNotifications = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
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

  async function markRead(id) {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  async function markAllRead() {
    if (!user) return;
    await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  // --- FILTERING ---
  const filtered = notifications.filter((n) => {
    if (activeTab === "Unread") return !n.read;
    if (activeTab === "Join Requests") return n.type === "join_request";
    return true;
  });

  // --- RICH TEXT PARSING ---
  function renderContent(n) {
    // "parvesh2520 requested to join "Pentagon""
    const parts = n.message || "";

    // Try to parse: "{username} requested to join "{project}""
    const joinMatch = parts.match(/^(.+?) requested to join ["']?(.+?)["']?$/i);
    if (joinMatch) {
      return (
        <p className="text-sm leading-relaxed">
          <span className="font-bold text-white">{joinMatch[1]}</span>
          <span className="text-[#888888]"> requested to join </span>
          <span className="font-bold text-white">"{joinMatch[2]}"</span>
        </p>
      );
    }

    // Fallback: just render the message
    return <p className="text-sm text-[#888888] leading-relaxed">{parts}</p>;
  }

  // --- ICON SELECTOR ---
  function getIcon(n) {
    if (n.type === "join_request") return <UserPlus className="w-5 h-5" />;
    return <AlertCircle className="w-5 h-5" />;
  }

  // --- LOADING SKELETONS ---
  if (loading) {
    return (
      <div className="space-y-0">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-4 p-6 border-b border-[#1f1f1f]">
            <div className="w-10 h-10 bg-[#1f1f1f] rounded-none flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-[#1f1f1f] w-3/4 rounded-none" />
              <div className="h-3 bg-[#1f1f1f]/50 w-1/4 rounded-none" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // --- NOT LOGGED IN ---
  if (!user) {
    return (
      <div className="mt-8 border border-dashed border-[#1f1f1f] bg-[#0a0a0a]/50 p-16 flex flex-col items-center justify-center text-center">
        <Bell size={48} strokeWidth={1.5} className="text-[#333333]" />
        <p className="text-xl text-white mt-6 font-bold tracking-tight">Log in to see your notifications.</p>
        <p className="text-[#888888] mt-2 max-w-md text-sm">
          When you receive join requests, mentions, or team updates, they'll appear here.
        </p>
        <Link to="/auth" className="mt-6 px-6 py-2 border border-[#1f1f1f] text-white hover:text-black hover:bg-[#e8ff47] transition-colors rounded-none font-medium text-sm">
          Sign in
        </Link>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="animate-fade-up">
      {/* --- HEADER --- */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <p className="text-sm text-[#888888] mt-1 font-mono">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-none text-xs font-mono text-[#888888] hover:text-black hover:bg-[#e8ff47] border border-[#1f1f1f] transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            Mark all as read
          </button>
        )}
      </div>

      {/* --- TABS --- */}
      <div className="flex items-center gap-6 border-b border-[#1f1f1f] mb-0">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium cursor-pointer transition-colors border-b-2 -mb-px ${isActive
                ? "text-white border-[#e8ff47]"
                : "text-[#666666] border-transparent hover:text-[#aaa]"
                }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* --- ERROR --- */}
      {error && (
        <div className="border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-400 mb-6 rounded-none">
          {error}
        </div>
      )}

      {/* --- EMPTY STATE --- */}
      {filtered.length === 0 && (
        <div className="border border-dashed border-[#1f1f1f] bg-[#0a0a0a]/50 p-16 flex flex-col items-center justify-center text-center">
          <Bell size={48} strokeWidth={1.5} className="text-[#333333]" />
          <p className="text-xl text-white mt-6 font-bold tracking-tight">
            {activeTab === "Unread" ? "No unread notifications." : activeTab === "Join Requests" ? "No join requests." : "You're all caught up."}
          </p>
          <p className="text-[#888888] max-w-md mt-2 text-sm">
            When you receive join requests, mentions, or team updates, they'll appear here.
          </p>
          {activeTab !== "All" && (
            <button
              onClick={() => setActiveTab("All")}
              className="mt-6 px-6 py-2 border border-[#1f1f1f] text-white hover:text-black hover:bg-[#e8ff47] transition-colors rounded-none font-medium text-sm cursor-pointer"
            >
              View all notifications
            </button>
          )}
        </div>
      )}

      {/* --- NOTIFICATION ROWS --- */}
      {filtered.length > 0 && (
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="visible"
          className="border-t border-[#1f1f1f]"
        >
          {filtered.map((n) => (
            <NotificationItem 
              key={n.id} 
              n={n} 
              onMarkRead={markRead} 
              renderContent={renderContent} 
              getIcon={getIcon} 
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}

function NotificationItem({ n, onMarkRead, renderContent, getIcon }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      variants={rowVariants}
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden flex items-start gap-4 p-6 transition-colors border-b border-[#1f1f1f] ${!n.read ? "bg-[#0a0a0a]/60" : "bg-transparent"} hover:bg-[#0a0a0a]`}
    >
      {/* Magnetic Spotlight */}
      <div
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(232,255,71,0.06), transparent 40%)`,
        }}
      />
      <div className="relative z-10 flex items-start gap-4 w-full">
        {/* Unread dot */}
        {!n.read && (
          <div className="w-2 h-2 bg-[#e8ff47] rounded-full absolute left-2 top-8 shadow-[0_0_8px_#e8ff47]" />
        )}

        {/* Avatar/Icon */}
        <div className={`w-10 h-10 bg-[#1f1f1f] flex items-center justify-center flex-shrink-0 ${!n.read ? "text-[#e8ff47]" : "text-[#888888]"}`}>
          {getIcon(n)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {renderContent(n)}
          <p className="text-xs text-[#555555] font-mono mt-1.5">{timeAgo(n.created_at)}</p>
        </div>

        {/* Inline Actions */}
        {n.type === "join_request" && !n.read && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onMarkRead(n.id)}
              className="bg-[#1f1f1f] text-white hover:bg-white hover:text-black px-4 py-2 text-sm font-medium transition-colors rounded-none cursor-pointer"
            >
              Review
            </button>
            <button
              onClick={() => onMarkRead(n.id)}
              className="text-[#888888] hover:text-white px-4 py-2 text-sm transition-colors rounded-none cursor-pointer"
            >
              Decline
            </button>
          </div>
        )}

        {/* Read marker for read notifications */}
        {n.read && (
          <span className="text-[10px] font-mono text-[#444444] shrink-0 uppercase tracking-wider">
            Read
          </span>
        )}
      </div>
    </motion.div>
  );
}
