import { SUPABASE_CONFIG_VALID } from "../../lib/supabaseClient";

export default function ConnectionNotice() {
  if (SUPABASE_CONFIG_VALID) return null;

  return (
    <div className="border-b border-amber-500/20 bg-amber-500/10 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 text-sm text-amber-300">
        <strong>Connection setup required:</strong> Supabase environment variables are missing.
        Add <code className="mx-1 bg-amber-500/10 px-1.5 py-0.5 rounded text-amber-200">VITE_SUPABASE_URL</code> and
        <code className="mx-1 bg-amber-500/10 px-1.5 py-0.5 rounded text-amber-200">VITE_SUPABASE_ANON_KEY</code> in your environment, then restart the app.
      </div>
    </div>
  );
}
