/*
  supabaseClient.js
  -----------------
  Single point of contact for the Supabase SDK.
  Every module that needs Supabase imports `supabase` from here
  so we never accidentally create a second client instance.
*/

import { createClient } from "@supabase/supabase-js";

const url  = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const SUPABASE_CONFIG_VALID = Boolean(url && anon);

// quick sanity check — will show up in the console during dev
if (!SUPABASE_CONFIG_VALID) {
  console.warn(
    "[supabaseClient] Missing env vars. " +
    "Make sure .env.local has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
  );
}

const safeUrl = url || "https://placeholder.supabase.co";
const safeAnon = anon || "placeholder-anon-key";

export const supabase = createClient(safeUrl, safeAnon);
