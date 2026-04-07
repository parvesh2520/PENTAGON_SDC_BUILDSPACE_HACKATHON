/*
  FeedCard.jsx
  ------------
  Single card in the activity feed. Shows the author, timestamp,
  post type badge, and content. Fades in with the animate-fade-up class.
*/

import { Link } from "react-router-dom";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import { timeAgo } from "../../utils/formatDate";

// quick colour map so different post types stand out
const typeColour = {
  project:     "brand",
  opportunity: "green",
  update:      "yellow",
};

export default function FeedCard({ post }) {
  return (
    <div className="panel panel-hover p-5 animate-fade-up">
      {/* top row — avatar + name + timestamp */}
      <div className="flex items-center gap-3 mb-3">
        <Link to={`/u/${post.author_id}`}>
          <Avatar
            src={post.profiles?.avatar_url}
            name={post.profiles?.display_name}
            size="sm"
          />
        </Link>

        <div className="flex-1 min-w-0">
          <Link
            to={`/u/${post.author_id}`}
            className="text-sm font-medium text-heading dark:text-white hover:underline"
          >
            {post.profiles?.display_name || "Unknown"}
          </Link>
          <p className="text-xs text-muted">{timeAgo(post.created_at)}</p>
        </div>

        <Badge color={typeColour[post.type] || "slate"}>{post.type}</Badge>
      </div>

      {/* body text */}
      <p className="text-sm text-body dark:text-slate-300 leading-relaxed">
        {post.content}
      </p>
    </div>
  );
}
