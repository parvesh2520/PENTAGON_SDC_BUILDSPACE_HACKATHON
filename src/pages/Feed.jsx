/*
  Feed.jsx
  --------
  Real-time activity feed with terminal-inspired design.
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
import { HiOutlinePaperAirplane, HiOutlineSparkles, HiOutlineTerminal, HiOutlineCode } from "react-icons/hi";

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

  /* Prepend new realtime posts (de-duplicated) */
  useEffect(() => {
    if (incoming.length > 0) {
      setPosts((prev) => {
        const newOnes = incoming.filter((inc) => !prev.some((p) => p.id === inc.id));
        return [...newOnes, ...prev];
      });
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
    <PageWrapper className="relative">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[150px] pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 animate-fade-up">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <HiOutlineSparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-white">Activity Feed</h1>
              <p className="text-sm text-slate-400">See what the community is building</p>
            </div>
          </div>
          
          {/* Live indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span className="text-xs font-medium text-cyan-400">Live</span>
          </div>
        </div>

        {/* Post form */}
        {user && (
          <form onSubmit={handlePost} className="card p-6 mb-8 animate-fade-up delay-100">
            <div className="flex items-start gap-4">
              <Avatar
                src={user.user_metadata?.avatar_url}
                name={user.user_metadata?.display_name || user.email}
                size="md"
              />
              <div className="flex-1">
                <textarea
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share what you're building..."
                  className="w-full bg-transparent text-white placeholder:text-slate-500 resize-none focus:outline-none text-sm leading-relaxed"
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-cyan-500/10 mt-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <HiOutlineTerminal className="w-4 h-4 text-cyan-400/50" />
                <span>Markdown supported</span>
              </div>
              <Button type="submit" size="sm" disabled={posting || !content.trim()}>
                <HiOutlinePaperAirplane className="w-4 h-4 rotate-90" />
                {posting ? "Posting..." : "Post"}
              </Button>
            </div>
          </form>
        )}

        {/* Posts list */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-6 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-slate-800 rounded w-1/4" />
                    <div className="h-3 bg-slate-800 rounded w-3/4" />
                    <div className="h-3 bg-slate-800 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="card p-16 text-center animate-fade-up delay-200">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
              <HiOutlineCode className="w-8 h-8 text-cyan-400/40" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No posts yet</h3>
            <p className="text-slate-400 text-sm">Be the first to share something!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, i) => (
              <div 
                key={post.id} 
                className="card p-6 group animate-fade-up"
                style={{ animationDelay: `${Math.min(i * 75, 400)}ms` }}
              >
                <div className="flex items-start gap-4">
                  <Avatar
                    src={post.profiles?.avatar_url}
                    name={post.profiles?.display_name}
                    size="md"
                    className="ring-2 ring-transparent group-hover:ring-cyan-500/30 transition-all"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white">
                        {post.profiles?.display_name || "Anonymous"}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        @{post.profiles?.username || "user"}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-slate-600">
                        {timeAgo(post.created_at)}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
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
