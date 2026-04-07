/*
  Input.jsx
  ---------
  Sleek dark-themed input with neon cyan focus glow.
  Matches the cyberpunk design system.
*/

export default function Input({
  label,
  error,
  className = "",
  id,
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-slate-300"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        className={
          "w-full rounded-xl border bg-slate-800/60 px-4 py-3 text-sm " +
          "text-white placeholder:text-slate-500 " +
          "border-cyan-500/15 " +
          "focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 " +
          "hover:border-cyan-500/30 hover:bg-slate-800/80 " +
          "transition-all duration-300 " +
          (error ? "border-red-500/50 ring-1 ring-red-500/30 " : "") +
          className
        }
        {...props}
      />

      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-400" />
          {error}
        </p>
      )}
    </div>
  );
}
