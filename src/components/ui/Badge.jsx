/*
  Badge.jsx
  ---------
  Neon-accented pill badges for tech skills, status labels, etc.
  Redesigned with glowing borders and premium dark styling.
*/

const colors = {
  brand:  "bg-violet-500/10 text-violet-300 border border-violet-500/25",
  green:  "bg-emerald-500/10 text-emerald-300 border border-emerald-500/25",
  red:    "bg-red-500/10 text-red-300 border border-red-500/25",
  yellow: "bg-amber-500/10 text-amber-300 border border-amber-500/25",
  slate:  "bg-slate-700/50 text-slate-300 border border-slate-600/50",
  cyan:   "bg-cyan-500/10 text-cyan-300 border border-cyan-500/25",
};

export default function Badge({ children, color = "brand", className = "" }) {
  return (
    <span
      className={
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide " +
        (colors[color] || colors.brand) +
        " " +
        className
      }
    >
      {children}
    </span>
  );
}
