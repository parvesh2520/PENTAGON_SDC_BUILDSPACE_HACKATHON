/*
  ProjectCard.jsx
  ---------------
  Card shown in the Projects grid. Each card has a title,
  description snippet, tech stack badges, member avatars,
  and a "Join" CTA if the project is open.
*/

import { Link } from "react-router-dom";
import Badge from "../ui/Badge";
import Avatar from "../ui/Avatar";

export default function ProjectCard({ project }) {
  const isOpen = project.status === "open";

  return (
    <div className="panel panel-hover p-5 animate-fade-up flex flex-col">
      {/* title + status */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <Link
          to={`/projects/${project.id}`}
          className="text-base font-semibold text-heading dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          {project.title}
        </Link>
        <Badge color={isOpen ? "green" : "red"}>{project.status}</Badge>
      </div>

      {/* description — clamped to 2 lines */}
      <p className="text-sm text-body dark:text-slate-400 line-clamp-2 mb-4">
        {project.description}
      </p>

      {/* tech stack tags */}
      {project.tech_stack?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech_stack.slice(0, 5).map((t) => (
            <Badge key={t} color="slate">{t}</Badge>
          ))}
          {project.tech_stack.length > 5 && (
            <Badge color="slate">+{project.tech_stack.length - 5}</Badge>
          )}
        </div>
      )}

      {/* footer — members + link */}
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-border dark:border-slate-700">
        <div className="flex -space-x-2">
          {project.members?.slice(0, 4).map((m) => (
            <Avatar key={m.user_id} src={m.profiles?.avatar_url} name={m.profiles?.display_name} size="sm" />
          ))}
        </div>

        <Link
          to={`/projects/${project.id}`}
          className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline"
        >
          View →
        </Link>
      </div>
    </div>
  );
}
