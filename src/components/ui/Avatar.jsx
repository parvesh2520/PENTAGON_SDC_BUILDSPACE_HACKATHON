/*
  Avatar.jsx
  ----------
  Circular user avatar with neon cyan ring glow.
  Falls back to gradient initials when there's no image URL.
*/

const sizeMap = {
  sm: "w-8 h-8 text-xs",
  md: "w-11 h-11 text-sm",
  lg: "w-16 h-16 text-lg",
  xl: "w-24 h-24 text-2xl",
};

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Avatar({ src, name, size = "md", className = "" }) {
  const sizeClass = sizeMap[size] || sizeMap.md;

  if (src) {
    return (
      <img
        src={src}
        alt={name || "User avatar"}
        className={`${sizeClass} rounded-full object-cover ring-2 ring-cyan-500/30 transition-all ${className}`}
      />
    );
  }

  /* Fallback — gradient circle with initials */
  return (
    <div
      className={
        `${sizeClass} rounded-full flex items-center justify-center ` +
        "bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-300 " +
        "font-semibold select-none ring-2 ring-cyan-500/20 transition-all " +
        className
      }
    >
      {getInitials(name)}
    </div>
  );
}
