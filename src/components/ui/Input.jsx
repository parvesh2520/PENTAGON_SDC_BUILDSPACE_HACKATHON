/*
  Input.jsx
  ---------
  Sleek dark-themed input with violet focus glow.
  Matches the AI-themed design system.
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
    <div className="flex flex-col gap-1.5">
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
          "w-full rounded-xl border bg-slate-800/60 px-4 py-2.5 text-sm " +
          "text-white placeholder:text-slate-500 " +
          "border-violet-500/15 " +
          "focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 " +
          "hover:border-violet-500/25 " +
          "transition-all duration-200 " +
          (error ? "border-red-500/50 ring-1 ring-red-500/30 " : "") +
          className
        }
        {...props}
      />

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
