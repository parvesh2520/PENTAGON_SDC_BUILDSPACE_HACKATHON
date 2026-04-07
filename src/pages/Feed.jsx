/*
  Feed.jsx
  --------
  Main dashboard page (logged-in users). 3-column layout:
  left sidebar, central feed, right sidebar with suggestions.
  The feed is realtime — new posts appear live.
*/

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import useAuthStore from "../store/authStore";
import Sidebar from "../components/layout/Sidebar";
import FeedList from "../components/feed/FeedList";
import Button from "../components/ui/Button";
import Avatar from "../components/ui/Avatar";

const trendingSkills = ["React", "Python", "TypeScript", "Rust", "Next.js", "Figma", "Go"];

export default function Feed() {
  const user = useAuthStore((s) => s.user);
  const [postContent, setPostContent] = useState("");
  const [posting, setPosting] = useState(false);

  async function handleQuickPost(e) {
    e.preventDefault();
    if (!postContent.trim() || !user) return;

    setPosting(true);
    await supabase.from("feed_posts").insert({
      author_id: user.id,
      type:      "update",
      content:   postContent.trim(),
    });
    setPostContent("");
    setPosting(false);
  }

  return (
    <div className="app-shell py-6">
      <div className="flex gap-6">
        {/* left sidebar */}
        <Sidebar />

        {/* main feed column */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* quick post box */}
          {user && (
            <form
              onSubmit={handleQuickPost}
              className="panel p-4"
            >
              <div className="flex gap-3">
                <Avatar
                  src={user.user_metadata?.avatar_url}
                  name={user.user_metadata?.display_name || user.email}
                  size="sm"
                />
                <textarea
                  rows={2}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Share an update with the community…"
                  className="flex-1 rounded-lg border border-border dark:border-slate-600 bg-surface-alt dark:bg-slate-900 px-4 py-2 text-sm text-heading dark:text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
                />
              </div>
              <div className="flex justify-end mt-3">
                <Button size="sm" type="submit" disabled={posting || !postContent.trim()}>
                  {posting ? "Posting…" : "Post"}
                </Button>
              </div>
            </form>
          )}

          {/* feed list with realtime */}
          <FeedList />
        </div>

        {/* right sidebar — desktop only */}
        <aside className="hidden xl:block w-64 shrink-0">
          <div className="sticky top-20 space-y-6">
            {/* trending skills */}
            <div className="panel p-5">
              <h3 className="text-sm font-semibold text-heading dark:text-white mb-3">Trending Skills</h3>
              <div className="flex flex-wrap gap-2">
                {trendingSkills.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-brand-50 dark:bg-brand-900/30 px-3 py-1 text-xs font-medium text-brand-700 dark:text-brand-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* quick CTA */}
            <div className="panel p-5 text-center">
              <p className="text-sm text-body dark:text-slate-400 mb-3">
                Have a project idea?
              </p>
              <Button size="sm" onClick={() => window.location.href = "/projects"}>
                Create a Project
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
