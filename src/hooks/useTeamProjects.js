/*
  useTeamProjects.js
  -------------------
  Manages all projects the user is part of (as owner OR member).
  - Fetches projects where user is owner from `projects` table
  - Fetches projects where user joined as member from `project_members` table
  - Shows member count for each project
  - Real-time updates when members join/leave
*/

import { useState, useEffect, useCallback } from "react";
import { supabase, SUPABASE_CONFIG_VALID } from "../lib/supabaseClient";
import useAuthStore from "../store/authStore";

export function useTeamProjects() {
  const user = useAuthStore((s) => s.user);
  const [teamProjects, setTeamProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all projects the user is part of (owned + joined)
  const fetchTeamProjects = useCallback(async () => {
    if (!SUPABASE_CONFIG_VALID || !user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Fetch all memberships for this user
      const { data: memberships, error: membersError } = await supabase
        .from("project_members")
        .select("project_id, role, joined_at")
        .eq("user_id", user.id)
        .order("joined_at", { ascending: false });

      if (membersError) throw membersError;

      if (!memberships || memberships.length === 0) {
        setTeamProjects([]);
        setLoading(false);
        return;
      }

      // Step 2: Get all project IDs
      const projectIds = memberships.map(m => m.project_id);

      // Step 3: Fetch all projects with their member counts
      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("*")
        .in("id", projectIds);

      if (projectsError) throw projectsError;

      console.log(`Found ${projects?.length || 0} projects for user`);

      // Step 4: Fetch member counts for each project
      const transformed = await Promise.all(
        (projects || []).map(async (project) => {
          const membership = memberships.find(m => m.project_id === project.id);

          // Fetch member count
          const { count } = await supabase
            .from("project_members")
            .select("*", { count: "exact", head: true })
            .eq("project_id", project.id);

          // Fetch a few members for display (limit to 10)
          const { data: members } = await supabase
            .from("project_members")
            .select(`
              user_id,
              role,
              profiles(display_name, avatar_url, username)
            `)
            .eq("project_id", project.id)
            .limit(10);

          return {
            ...project,
            membership_role: membership?.role || "member",
            member_count: count || 0,
            members: members || [],
            joined_at: membership?.joined_at,
          };
        })
      );

      console.log(`Transformed ${transformed.length} team projects:`, transformed.map(p => ({ id: p.id, title: p.title, role: p.membership_role, members: p.member_count })));

      setTeamProjects(transformed);
    } catch (err) {
      console.error("Error fetching team projects:", err);
      setError(err.message);
      setTeamProjects([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch detailed member info for a specific project
  const fetchProjectMembers = useCallback(async (projectId) => {
    if (!SUPABASE_CONFIG_VALID) return [];

    const { data, error } = await supabase
      .from("project_members")
      .select(`
        *,
        profiles(display_name, avatar_url, username)
      `)
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching project members:", error);
      return [];
    }

    return data || [];
  }, []);

  // Leave a project (only if not owner)
  const leaveProject = useCallback(async (projectId) => {
    if (!user) return;

    const { error: deleteError } = await supabase
      .from("project_members")
      .delete()
      .eq("project_id", projectId)
      .eq("user_id", user.id)
      .neq("role", "owner"); // Can't leave if you're the owner

    if (deleteError) {
      console.error("Error leaving project:", deleteError);
      throw deleteError;
    }

    // Remove from local state
    setTeamProjects((prev) => prev.filter((p) => p.id !== projectId));
  }, [user]);

  // Update member count when someone joins
  const refreshMemberCount = useCallback(async (projectId) => {
    const members = await fetchProjectMembers(projectId);
    setTeamProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, member_count: members.length, members }
          : p
      )
    );
  }, [fetchProjectMembers]);

  // Load on mount
  useEffect(() => {
    fetchTeamProjects();
  }, [fetchTeamProjects]);

  // Subscribe to realtime updates for project_members changes
  useEffect(() => {
    if (!SUPABASE_CONFIG_VALID || !user) return;

    console.log("Setting up realtime subscription for team projects");

    const channel = supabase
      .channel("team-projects-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "project_members",
        },
        (payload) => {
          console.log("Team projects change detected:", payload);
          // Refresh team projects when any membership changes
          fetchTeamProjects();
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });

    return () => {
      console.log("Cleaning up realtime subscription");
      supabase.removeChannel(channel);
    };
  }, [user, fetchTeamProjects]);

  return {
    teamProjects,
    loading,
    error,
    leaveProject,
    refreshMemberCount,
    fetchProjectMembers,
    refetch: fetchTeamProjects,
  };
}
