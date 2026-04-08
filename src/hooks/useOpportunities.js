/*
  useOpportunities.js
  -------------------
  Manages opportunities with Supabase persistence.
  - All users can view opportunities from the database
  - Logged-in users can create opportunities
  - Real-time updates when new opportunities are posted
*/

import { useState, useEffect, useCallback } from "react";
import { supabase, SUPABASE_CONFIG_VALID } from "../lib/supabaseClient";
import useAuthStore from "../store/authStore";

export function useOpportunities() {
  const user = useAuthStore((s) => s.user);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all opportunities from Supabase with poster profile
  const fetchOpportunities = useCallback(async () => {
    if (!SUPABASE_CONFIG_VALID) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from("opportunities")
      .select(`
        *,
        profiles:poster_id (
          username,
          display_name,
          avatar_url
        )
      `)
      .order("created_at", { ascending: false });

    if (fetchError) {
      console.error("Error fetching opportunities:", fetchError);
      setError(fetchError.message);
      setOpportunities([]);
    } else {
      setOpportunities(data || []);
    }
    setLoading(false);
  }, []);

  // Create a new opportunity
  const createOpportunity = useCallback(
    async ({ type, title, description, skillsNeeded, deadline }) => {
      if (!user) {
        throw new Error("You must be logged in to create opportunities");
      }

      if (!SUPABASE_CONFIG_VALID) {
        throw new Error("Supabase is not configured");
      }

      // Insert into opportunities table
      const { data, error: insertError } = await supabase
        .from("opportunities")
        .insert({
          poster_id: user.id,
          type: type,
          title: title.trim(),
          description: description?.trim() || null,
          skills_needed: skillsNeeded || [],
          deadline: deadline || null,
        })
        .select(`
          *,
          profiles:poster_id (
            username,
            display_name,
            avatar_url
          )
        `)
        .single();

      if (insertError) {
        console.error("Error creating opportunity:", insertError);
        throw insertError;
      }

      // Create a feed post to notify the community
      const { error: feedError } = await supabase.from("feed_posts").insert({
        author_id: user.id,
        type: "opportunity",
        ref_id: data.id,
        content: `Posted a new ${type}: ${data.title}`,
      });

      if (feedError) {
        console.error("Error creating feed post:", feedError);
        // Don't throw - feed post is secondary
      }

      // Optimistically add to the list
      setOpportunities((prev) => [data, ...prev]);

      return data;
    },
    [user]
  );

  // Delete an opportunity (only by owner)
  const deleteOpportunity = useCallback(
    async (opportunityId) => {
      if (!user) return;

      const { error: deleteError } = await supabase
        .from("opportunities")
        .delete()
        .eq("id", opportunityId)
        .eq("poster_id", user.id);

      if (deleteError) {
        console.error("Error deleting opportunity:", deleteError);
        throw deleteError;
      }

      // Remove from local state
      setOpportunities((prev) => prev.filter((opp) => opp.id !== opportunityId));
    },
    [user]
  );

  // Close an opportunity (only by owner)
  const closeOpportunity = useCallback(
    async (opportunityId) => {
      if (!user) return;

      // Optimistic update
      setOpportunities((prev) =>
        prev.map((opp) =>
          opp.id === opportunityId ? { ...opp, status: "closed" } : opp
        )
      );

      const { error: updateError } = await supabase
        .from("opportunities")
        .update({ status: "closed" })
        .eq("id", opportunityId)
        .eq("poster_id", user.id);

      if (updateError) {
        console.error("Error closing opportunity:", updateError);
        // Revert optimistic update
        fetchOpportunities();
        throw updateError;
      }
    },
    [user, fetchOpportunities]
  );

  // Reopen an opportunity (only by owner)
  const reopenOpportunity = useCallback(
    async (opportunityId) => {
      if (!user) return;

      // Optimistic update
      setOpportunities((prev) =>
        prev.map((opp) =>
          opp.id === opportunityId ? { ...opp, status: "open" } : opp
        )
      );

      const { error: updateError } = await supabase
        .from("opportunities")
        .update({ status: "open" })
        .eq("id", opportunityId)
        .eq("poster_id", user.id);

      if (updateError) {
        console.error("Error reopening opportunity:", updateError);
        // Revert optimistic update
        fetchOpportunities();
        throw updateError;
      }
    },
    [user, fetchOpportunities]
  );

  // Load opportunities on mount
  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!SUPABASE_CONFIG_VALID) return;

    const channel = supabase
      .channel("opportunities-changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "opportunities",
        },
        async (payload) => {
          // Fetch the new opportunity with profile data
          const { data } = await supabase
            .from("opportunities")
            .select(`
              *,
              profiles:poster_id (
                username,
                display_name,
                avatar_url
              )
            `)
            .eq("id", payload.new.id)
            .single();

          if (data) {
            setOpportunities((prev) => {
              const exists = prev.some((o) => o.id === data.id);
              if (exists) return prev;
              return [data, ...prev];
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    opportunities,
    loading,
    error,
    createOpportunity,
    deleteOpportunity,
    closeOpportunity,
    reopenOpportunity,
    refetch: fetchOpportunities,
  };
}
