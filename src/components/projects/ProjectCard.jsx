/*
  ProjectCard.jsx
  ---------------
  Premium glassmorphic project card with hover glow effect.
  Shows title, description, tech stack badges, and status.
*/

import { Link } from "react-router-dom";
import Badge from "../ui/Badge";
import Avatar from "../ui/Avatar";
import { HiOutlineCode, HiOutlineArrowRight } from "react-icons/hi";

export default function ProjectCard({ project }) {
  const isOpen = project.status === "open";

  return (
    <div className="card p-6 flex flex-col h-full group">
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Header: title + status */}
      <div className="relative flex items-start justify-between gap-3 mb-3">
        <Link
          to={`/projects/${project.id}`}
          className="text-lg font-display font-semibold text-white hover:text-cyan-300 transition-colors line-clamp-1"
        >
          {project.title}
        </Link>
        <Badge color={isOpen ? "green" : "red"} className="flex-shrink-0 text-[10px]">
          {project.status}
        </Badge>
      </div>

      {/* Description */}
      <p className="relative text-sm text-slate-400 line-clamp-2 mb-5 leading-relaxed">
        {project.description}
      </p>

      {/* Tech stack */}
      {project.tech_stack?.length > 0 && (
        <div className="relative flex flex-wrap gap-1.5 mb-5">
          {project.tech_stack.slice(0, 4).map((t) => (
            <Badge key={t} color="slate" className="text-[10px]">
              <HiOutlineCode className="w-3 h-3 mr-1 opacity-50" />
              {t}
            </Badge>
          ))}
          {project.tech_stack.length > 4 && (
            <Badge color="slate" className="text-[10px]">
              +{project.tech_stack.length - 4} more
            </Badge>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="relative mt-auto flex items-center justify-between pt-4 border-t border-cyan-500/10">
        {/* Team avatars */}
        <div className="flex -space-x-2">
          {project.members?.slice(0, 4).map((m) => (
            <Avatar 
              key={m.user_id} 
              src={m.profiles?.avatar_url} 
              name={m.profiles?.display_name} 
              size="sm" 
              className="ring-2 ring-slate-900 group-hover:ring-cyan-500/20 transition-all"
            />
          ))}
          {(!project.members || project.members.length === 0) && (
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-cyan-500/10">
              <HiOutlineCode className="w-4 h-4 text-slate-600" />
            </div>
          )}
        </div>

        {/* View link */}
        <Link
          to={`/projects/${project.id}`}
          className="flex items-center gap-1.5 text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors group/link"
        >
          <span>View</span>
          <HiOutlineArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
