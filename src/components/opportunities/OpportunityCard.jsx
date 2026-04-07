/*
  OpportunityCard.jsx
  -------------------
  Card for the opportunities board. Shows the type badge
  (teammate / hackathon / role), skills needed, deadline, etc.
*/

import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { formatShort } from "../../utils/formatDate";

const typeBadge = {
  teammate:  { color: "brand",  label: "Teammate" },
  hackathon: { color: "green",  label: "Hackathon" },
  role:      { color: "yellow", label: "Role" },
};

export default function OpportunityCard({ opp }) {
  const badge = typeBadge[opp.type] || typeBadge.role;

  return (
    <div className="panel panel-hover p-5 animate-fade-up flex flex-col">
      {/* top row — type + deadline */}
      <div className="flex items-center justify-between mb-3">
        <Badge color={badge.color}>{badge.label}</Badge>
        {opp.deadline && (
          <span className="text-xs text-muted">Due {formatShort(opp.deadline)}</span>
        )}
      </div>

      <h3 className="text-base font-semibold text-heading dark:text-white mb-1">
        {opp.title}
      </h3>

      <p className="text-sm text-body dark:text-slate-400 line-clamp-2 mb-4">
        {opp.description}
      </p>

      {/* skills needed */}
      {opp.skills_needed?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {opp.skills_needed.map((s) => (
            <Badge key={s} color="slate">{s}</Badge>
          ))}
        </div>
      )}

      {/* footer — poster + CTA */}
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-border dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Avatar
            src={opp.profiles?.avatar_url}
            name={opp.profiles?.display_name}
            size="sm"
          />
          <span className="text-xs text-muted">{opp.profiles?.display_name}</span>
        </div>

        <Button variant="secondary" size="sm">
          Respond
        </Button>
      </div>
    </div>
  );
}
