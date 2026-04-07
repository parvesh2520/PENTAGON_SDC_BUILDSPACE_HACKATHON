/*
  FeedList.jsx
  ------------
  Futuristic activity feed with cyber loading states.
*/

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRealtime } from "../../hooks/useRealtime";
import FeedCard from "./FeedCard";

export default function FeedList() {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { incoming } = useRealtime("feed_posts");

  useEffect(() => {
    async function load() {
      setError(null);
      const { data, error: loadError } = await supabase
        .from("feed_posts")
        .select("*, profiles(display_name, avatar_url)")
        .order("created_at", { ascending: false })
        .limit(30);

      if (loadError) {
        setError(loadError.message || "Could not load feed right now.");
        setLoading(false);
        return;
      }

      setPosts(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const allPosts = [...incoming, ...posts].filter(
    (post, index, arr) => arr.findIndex((candidate) => candidate.id === post.id) === index
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="relative rounded-2xl bg-slate-900/50 border border-slate-700/50 p-5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent animate-shimmer" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-slate-800 animate-pulse" />
              <div className="flex-1">
                <div className="h-4 bg-slate-800 rounded w-32 mb-2 animate-pulse" />
                <div className="h-3 bg-slate-800/50 rounded w-20 animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-800 rounded w-full animate-pulse" />
              <div className="h-4 bg-slate-800 rounded w-3/4 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 backdrop-blur-sm px-6 py-5 text-sm text-red-400">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (allPosts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-violet-500/30 rounded-full blur-xl animate-pulse" />
          <div className="relative p-6 rounded-full bg-slate-800/50 border border-slate-700/50">
            <svg className="w-12 h-12 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>
        <p className="text-lg font-medium text-slate-300 mb-2">No posts yet</p>
        <p className="text-sm text-slate-500">Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {allPosts.map((post, index) => (
        <div key={post.id} style={{ animationDelay: `${index * 50}ms` }}>
          <FeedCard post={post} />
        </div>
      ))}
    </div>
  );
}
