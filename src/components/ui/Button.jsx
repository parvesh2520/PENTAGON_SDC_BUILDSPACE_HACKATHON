/*
  Button.jsx
  ----------
  Premium button with neon glow effects and smooth animations.
  Variants: primary (gradient), secondary (glass), ghost, danger.
*/

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold " +
  "transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 " +
  "focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer " +
  "active:scale-[0.97] relative overflow-hidden group";

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-8 py-4 text-base",
};

const variants = {
  primary:
    "bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/25 " +
    "hover:shadow-cyan-500/50 hover:shadow-xl hover:brightness-110 " +
    "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent " +
    "before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700",
  secondary:
    "bg-slate-800/80 text-slate-200 border border-cyan-500/20 backdrop-blur-sm " +
    "hover:border-cyan-500/50 hover:bg-slate-700/80 hover:shadow-lg hover:shadow-cyan-500/10 " +
    "hover:text-cyan-200",
  ghost:
    "text-slate-300 hover:bg-slate-800/60 hover:text-cyan-300 " +
    "border border-transparent hover:border-cyan-500/20",
  danger:
    "bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-lg shadow-red-500/25 " +
    "hover:shadow-red-500/50 hover:shadow-xl hover:brightness-110 " +
    "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent " +
    "before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700",
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
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}
