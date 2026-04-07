/*
  Button.jsx
  ----------
  Premium button component with gradient glow effects.
  Variants: primary (gradient), secondary (glass), ghost, danger.
*/

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold " +
  "transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-400/50 " +
  "focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer " +
  "active:scale-[0.97]";

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

const variants = {
  primary:
    "bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-lg shadow-violet-500/25 " +
    "hover:shadow-violet-500/40 hover:brightness-110",
  secondary:
    "bg-slate-800/80 text-slate-200 border border-violet-500/20 backdrop-blur-sm " +
    "hover:border-violet-500/40 hover:bg-slate-700/80 hover:shadow-lg hover:shadow-violet-500/10",
  ghost:
    "text-slate-300 hover:bg-slate-800/60 hover:text-white",
  danger:
    "bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-lg shadow-red-500/25 " +
    "hover:shadow-red-500/40 hover:brightness-110",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
