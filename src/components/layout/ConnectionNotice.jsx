import { SUPABASE_CONFIG_VALID } from "../../lib/supabaseClient";

export default function ConnectionNotice() {
  if (SUPABASE_CONFIG_VALID) return null;

  return (
    <div className="relative border-b border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/10 backdrop-blur-sm overflow-hidden">
      {/* Animated scan line */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent animate-shimmer" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3 text-sm text-amber-300">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            </div>
            <span className="font-mono text-xs text-amber-400">ALERT</span>
          </div>
          <span className="text-amber-200">
            <strong className="font-semibold">Connection setup required:</strong> Supabase environment variables are missing.
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <code className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-200 text-xs font-mono">
            VITE_SUPABASE_URL
          </code>
          <code className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-200 text-xs font-mono">
            VITE_SUPABASE_ANON_KEY
          </code>
        </div>
      </div>
    </div>
  );
}
