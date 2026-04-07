import { SUPABASE_CONFIG_VALID } from "../../lib/supabaseClient";

export default function ConnectionNotice() {
  if (SUPABASE_CONFIG_VALID) return null;

  return (
    <div className="border-b border-amber-300/70 bg-amber-50 text-amber-900 dark:border-amber-700/60 dark:bg-amber-900/30 dark:text-amber-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 text-sm">
        <strong>Connection setup required:</strong> Supabase environment variables are missing.
        Add <code className="mx-1">VITE_SUPABASE_URL</code> and
        <code className="mx-1">VITE_SUPABASE_ANON_KEY</code> in your environment, then restart the app.
      </div>
    </div>
  );
}
