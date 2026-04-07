/*
  Feed.jsx
  --------
  Real-time activity feed with terminal-inspired dark cards.
  Features: create post form, live updates via Supabase Realtime.
*/

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import useAuthStore from "../store/authStore";
import { useRealtime } from "../hooks/useRealtime";
import PageWrapper from "../components/layout/PageWrapper";
import Button from "../components/ui/Button";
import Avatar from "../components/ui/Avatar";
import { timeAgo } from "../utils/formatDate";
import { HiOutlinePaperAirplane, HiOutlineSparkles } from "react-icons/hi";

export default function Feed() {
  const user = useAuthStore((s) => s.user);
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const { incoming }          = useRealtime("feed_posts");

  const loadPosts = useCallback(async () => {
    const { data } = await supabase
      .from("feed_posts")
      .select("*, profiles(display_name, username, avatar_url)")
      .order("created_at", { ascending: false })
      .limit(50);

    setPosts(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  /* prepend new realtime posts */
  useEffect(() => {
    if (incoming.length > 0) {
      setPosts((prev) => [...incoming, ...prev]);
    }
  }, [incoming]);

  async function handlePost(e) {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setPosting(true);
    await supabase.from("feed_posts").insert({
      author_id: user.id,
      content: content.trim(),
    });

    setContent("");
    setPosting(false);
    loadPosts();
  }

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto">
        {/* header */}
        <div className="flex items-center gap-3 mb-8">
          <HiOutlineSparkles className="w-6 h-6 text-violet-400" />
          <h1 className="font-display text-2xl font-bold text-white">Activity Feed</h1>
          <div className="ml-auto">
            <div className="flex items-center gap-2 text-xs text-cyan-400">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-soft-pulse" />
              Live
            </div>
          </div>
        </div>

        {/* post form */}
        {user && (
          <form onSubmit={handlePost} className="card p-4 mb-8">
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share what you're building…"
              className="w-full bg-transparent text-white placeholder:text-slate-500 resize-none focus:outline-none text-sm leading-relaxed"
            />
            <div className="flex justify-end pt-2 border-t border-violet-500/10">
              <Button type="submit" size="sm" disabled={posting || !content.trim()}>
                <HiOutlinePaperAirplane className="w-4 h-4 rotate-90" />
                {posting ? "Posting…" : "Post"}
              </Button>
            </div>
          </form>
        )}

        {/* posts list */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-800 rounded w-1/4" />
                    <div className="h-3 bg-slate-800 rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="card p-12 text-center">
            <HiOutlineSparkles className="w-10 h-10 text-violet-500/30 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No posts yet. Be the first to share something!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, i) => (
              <div key={post.id} className={`card p-5 animate-fade-up delay-${Math.min(i * 100, 500)}`}>
                <div className="flex items-start gap-3">
                  <Avatar
                    src={post.profiles?.avatar_url}
                    name={post.profiles?.display_name}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">
                        {post.profiles?.display_name || "Anonymous"}
                      </span>
                      <span className="text-xs text-slate-500">
                        @{post.profiles?.username || "user"}
                      </span>
                      <span className="text-xs text-slate-600 ml-auto flex-shrink-0">
                        {timeAgo(post.created_at)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {post.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
