/*
  useProfile.js
  -------------
  Fetches and updates a user profile from the `profiles` table.
  Accepts either a user ID or a username — if neither is passed
  it falls back to the currently logged-in user.
*/

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import useAuthStore from "../store/authStore";

export function useProfile(identifier) {
  const currentUser  = useAuthStore((s) => s.user);
  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);

  const fetchProfile = useCallback(async () => {
    setLoading(true);

    let query = supabase.from("profiles").select("*");

    if (identifier) {
      // decide whether it looks like a UUID or a username
      const isUUID = /^[0-9a-f-]{36}$/i.test(identifier);
      query = isUUID
        ? query.eq("id", identifier)
        : query.eq("username", identifier);
    } else if (currentUser) {
      query = query.eq("id", currentUser.id);
    } else {
      setLoading(false);
      return;
    }

    const { data, error } = await query.single();
    if (!error) setProfile(data);
    setLoading(false);
  }, [identifier, currentUser]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // update fields on the logged-in user's own profile
  async function updateProfile(updates) {
    if (!currentUser) return;

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", currentUser.id)
      .select()
      .single();

    if (!error) setProfile(data);
    return { data, error };
  }

  return { profile, loading, updateProfile, refetch: fetchProfile };
}
