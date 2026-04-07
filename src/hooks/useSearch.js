/*
  useSearch.js
  ------------
  Debounced global search — hits profiles, projects, and
  opportunities tables with ilike queries. Returns results
  grouped by category so the Search page can show tabs.
*/

import { useState, useMemo, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { debounce } from "../utils/debounce";

export function useSearch() {
  const [results, setResults] = useState({ people: [], projects: [], opportunities: [] });
  const [loading, setLoading] = useState(false);
  const [query, setQuery]     = useState("");

  // the actual search — runs after the debounce fires
  const doSearch = useCallback(async (term) => {
    if (!term || term.length < 2) {
      setResults({ people: [], projects: [], opportunities: [] });
      return;
    }

    setLoading(true);
    const pattern = `%${term}%`;

    // fire all three queries at once
    const [people, projects, opps] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url, skills")
        .or(`username.ilike.${pattern},display_name.ilike.${pattern}`)
        .limit(20),

      supabase
        .from("projects")
        .select("id, title, description, tech_stack, status")
        .or(`title.ilike.${pattern},description.ilike.${pattern}`)
        .limit(20),

      supabase
        .from("opportunities")
        .select("id, title, description, type, skills_needed")
        .or(`title.ilike.${pattern},description.ilike.${pattern}`)
        .limit(20),
    ]);

    setResults({
      people:        people.data   ?? [],
      projects:      projects.data ?? [],
      opportunities: opps.data     ?? [],
    });

    setLoading(false);
  }, []);

  // wrap doSearch in a 350ms debounce so rapid typing doesn't
  // spam the database
  const debouncedSearch = useMemo(() => debounce(doSearch, 350), [doSearch]);

  useEffect(() => () => debouncedSearch.cancel?.(), [debouncedSearch]);

  function handleChange(value) {
    setQuery(value);
    debouncedSearch(value);
  }

  return { query, results, loading, handleChange };
}
