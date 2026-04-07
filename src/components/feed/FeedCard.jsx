/*
  FeedCard.jsx
  ------------
  Futuristic feed card with cyber aesthetics and neon accents.
*/

import { Link } from "react-router-dom";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import { timeAgo } from "../../utils/formatDate";

const typeConfig = {
  project:     { color: "brand",  glow: "cyan" },
  opportunity: { color: "green",  glow: "emerald" },
  update:      { color: "yellow", glow: "amber" },
};

export default function FeedCard({ post }) {
  const config = typeConfig[post.type] || { color: "slate", glow: "slate" };

  return (
    <div className="group relative animate-fade-up">
      {/* Glow effect on hover */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-${config.glow}-500/0 via-${config.glow}-500/0 to-${config.glow}-500/0 group-hover:from-${config.glow}-500/20 group-hover:via-violet-500/10 group-hover:to-cyan-500/20 rounded-2xl blur-lg transition-all duration-500 opacity-0 group-hover:opacity-100`} />
      
      <div className="relative rounded-2xl bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 group-hover:border-cyan-500/30 p-5 transition-all duration-300 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0, 255, 255, 0.3) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />

        {/* top row — avatar + name + timestamp */}
        <div className="relative flex items-center gap-3 mb-4">
          <Link to={`/u/${post.author_id}`} className="relative group/avatar">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/50 to-violet-500/50 rounded-full blur opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300" />
            <Avatar
              src={post.profiles?.avatar_url}
              name={post.profiles?.display_name}
              size="sm"
            />
          </Link>

          <div className="flex-1 min-w-0">
            <Link
              to={`/u/${post.author_id}`}
              className="text-sm font-medium text-white hover:text-cyan-400 transition-colors duration-300"
            >
              {post.profiles?.display_name || "Unknown"}
            </Link>
            <p className="text-xs text-slate-500 font-mono">{timeAgo(post.created_at)}</p>
          </div>

          <Badge color={config.color}>{post.type}</Badge>
        </div>

        {/* body text */}
        <p className="relative text-sm text-slate-300 leading-relaxed">
          {post.content}
        </p>

        {/* Bottom decorative line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  );
}
