/*
  ProjectCard.jsx
  ---------------
  Premium glassmorphic project card with hover glow effect.
  Shows title, description, tech stack badges, and status.
*/

import { Link } from "react-router-dom";
import Badge from "../ui/Badge";
import Avatar from "../ui/Avatar";

export default function ProjectCard({ project }) {
  const isOpen = project.status === "open";

  return (
    <div className="card p-5 flex flex-col h-full">
      {/* title + status */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <Link
          to={`/projects/${project.id}`}
          className="text-base font-display font-semibold text-white hover:text-violet-300 transition-colors"
        >
          {project.title}
        </Link>
        <Badge color={isOpen ? "green" : "red"} className="flex-shrink-0">
          {project.status}
        </Badge>
      </div>

      {/* description — clamped to 2 lines */}
      <p className="text-sm text-slate-400 line-clamp-2 mb-4">
        {project.description}
      </p>

      {/* tech stack tags */}
      {project.tech_stack?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech_stack.slice(0, 5).map((t) => (
            <Badge key={t} color="slate" className="text-[10px]">{t}</Badge>
          ))}
          {project.tech_stack.length > 5 && (
            <Badge color="slate" className="text-[10px]">+{project.tech_stack.length - 5}</Badge>
          )}
        </div>
      )}

      {/* footer — members + link */}
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-violet-500/10">
        <div className="flex -space-x-2">
          {project.members?.slice(0, 4).map((m) => (
            <Avatar key={m.user_id} src={m.profiles?.avatar_url} name={m.profiles?.display_name} size="sm" />
          ))}
        </div>

        <Link
          to={`/projects/${project.id}`}
          className="text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
        >
          View →
        </Link>
      </div>
    </div>
  );
}
