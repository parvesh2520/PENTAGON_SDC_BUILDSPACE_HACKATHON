/*
  Badge.jsx
  ---------
  Neon-accented pill badges with subtle glow effects.
  Perfect for tech skills, status labels, and tags.
*/

const colors = {
  brand:  "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10",
  green:  "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-500/10",
  red:    "bg-red-500/10 text-red-300 border border-red-500/30 shadow-sm shadow-red-500/10",
  yellow: "bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-sm shadow-amber-500/10",
  slate:  "bg-slate-700/50 text-slate-300 border border-slate-600/50",
  cyan:   "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10",
  blue:   "bg-blue-500/10 text-blue-300 border border-blue-500/30 shadow-sm shadow-blue-500/10",
  emerald: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-500/10",
  violet: "bg-violet-500/10 text-violet-300 border border-violet-500/30 shadow-sm shadow-violet-500/10",
};

export default function Badge({ children, color = "brand", className = "", style = {} }) {
  return (
    <span
      className={
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition-all hover:brightness-110 " +
        (colors[color] || colors.brand) +
        " " +
        className
      }
      style={style}
    >
      {children}
    </span>
  );
}
