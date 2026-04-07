/*
  FeedList.jsx
  ------------
  Renders the main activity feed. Loads initial posts from Supabase,
  then merges in any new ones arriving via the realtime hook.
*/

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRealtime } from "../../hooks/useRealtime";
import FeedCard from "./FeedCard";

export default function FeedList() {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // live inserts from the realtime channel
  const { incoming } = useRealtime("feed_posts");

  // grab the latest 30 posts on mount
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

  // whenever realtime inserts come in, keep a clean deduplicated list
  const allPosts = [...incoming, ...posts].filter(
    (post, index, arr) => arr.findIndex((candidate) => candidate.id === post.id) === index
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20 px-4 py-5 text-sm text-red-700 dark:text-red-200">
        {error}
      </div>
    );
  }

  if (allPosts.length === 0) {
    return (
      <div className="text-center py-16 text-muted">
        <p className="text-lg">No posts yet — be the first to share something!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {allPosts.map((post) => (
        <FeedCard key={post.id} post={post} />
      ))}
    </div>
  );
}
