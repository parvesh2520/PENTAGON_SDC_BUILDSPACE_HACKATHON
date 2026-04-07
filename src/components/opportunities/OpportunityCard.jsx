/*
  OpportunityCard.jsx
  -------------------
  Futuristic opportunity card with cyber glow and neon accents.
*/

import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { formatShort } from "../../utils/formatDate";

const typeConfig = {
  teammate:  { color: "brand",  label: "Teammate", glow: "cyan" },
  hackathon: { color: "green",  label: "Hackathon", glow: "emerald" },
  role:      { color: "yellow", label: "Role", glow: "amber" },
};

export default function OpportunityCard({ opp }) {
  const config = typeConfig[opp.type] || typeConfig.role;

  return (
    <div className="group relative animate-fade-up">
      {/* Glow effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r from-${config.glow}-500/0 to-violet-500/0 group-hover:from-${config.glow}-500/20 group-hover:to-violet-500/10 rounded-2xl blur-lg transition-all duration-500 opacity-0 group-hover:opacity-100`} />
      
      <div className="relative flex flex-col h-full rounded-2xl bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 group-hover:border-cyan-500/30 p-5 transition-all duration-300 overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0, 255, 255, 0.3) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }} />

        {/* top row — type + deadline */}
        <div className="relative flex items-center justify-between mb-4">
          <Badge color={config.color}>{config.label}</Badge>
          {opp.deadline && (
            <span className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatShort(opp.deadline)}
            </span>
          )}
        </div>

        <h3 className="relative text-base font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300">
          {opp.title}
        </h3>

        <p className="relative text-sm text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {opp.description}
        </p>

        {/* skills needed */}
        {opp.skills_needed?.length > 0 && (
          <div className="relative flex flex-wrap gap-2 mb-4">
            {opp.skills_needed.map((s) => (
              <span key={s} className="px-2.5 py-1 text-xs font-mono text-cyan-400/80 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                {s}
              </span>
            ))}
          </div>
        )}

        {/* footer — poster + CTA */}
        <div className="relative mt-auto flex items-center justify-between pt-4 border-t border-slate-700/50">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/50 to-violet-500/50 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Avatar
                src={opp.profiles?.avatar_url}
                name={opp.profiles?.display_name}
                size="sm"
              />
            </div>
            <span className="text-xs text-slate-500">{opp.profiles?.display_name}</span>
          </div>

          <Button variant="secondary" size="sm">
            Respond
          </Button>
        </div>

        {/* Bottom line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  );
}
