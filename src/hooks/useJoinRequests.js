/*
  useJoinRequests.js
  -------------------
  Manages join requests between users and projects.
  
  For requesters:
    - sendJoinRequest(projectId, ownerId, projectTitle) — sends a request
    - hasRequested(projectId) — checks if already requested
  
  For project owners:
    - incomingRequests — array of pending requests for their projects
    - updateRequest(id, 'accepted' | 'declined') — respond to a request
*/

import { useState, useEffect, useCallback } from "react";
import { supabase, SUPABASE_CONFIG_VALID } from "../lib/supabaseClient";
import useAuthStore from "../store/authStore";

export function useJoinRequests() {
  const user = useAuthStore((s) => s.user);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch the current user's outgoing requests (to know which projects they've applied to)
  const fetchOutgoing = useCallback(async () => {
    if (!SUPABASE_CONFIG_VALID || !user) return;

    const { data, error } = await supabase
      .from("join_requests")
      .select("*, projects(title)")
      .eq("requester_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOutgoingRequests(data);
    }
  }, [user]);

  // Fetch incoming requests for the current user's projects
  const fetchIncoming = useCallback(async () => {
    if (!SUPABASE_CONFIG_VALID || !user) return;

    const { data, error } = await supabase
      .from("join_requests")
      .select("*, projects(title)")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      // Fetch requester profiles in a separate call
      const requesterIds = [...new Set(data.map((r) => r.requester_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name, username, avatar_url")
        .in("id", requesterIds);

      const profileMap = {};
      (profiles || []).forEach((p) => { profileMap[p.id] = p; });

      const enriched = data.map((r) => ({
        ...r,
        requester_profile: profileMap[r.requester_id] || null,
      }));

      setIncomingRequests(enriched);
    } else if (!error) {
      setIncomingRequests([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchOutgoing();
      fetchIncoming();
    }
  }, [user, fetchOutgoing, fetchIncoming]);

  // Check if the current user has already requested to join a project
  const hasRequested = useCallback(
    (projectId) => {
      return outgoingRequests.some(
        (r) => r.project_id === projectId && r.status === "pending"
      );
    },
    [outgoingRequests]
  );

  // Get the status of the request for a specific project
  const getRequestStatus = useCallback(
    (projectId) => {
      const req = outgoingRequests.find((r) => r.project_id === projectId);
      return req ? req.status : null;
    },
    [outgoingRequests]
  );

  // Send a join request
  const sendJoinRequest = useCallback(
    async (projectId, ownerId, projectTitle) => {
      if (!user || !SUPABASE_CONFIG_VALID) return { error: "Not logged in" };

      // Optimistic update
      const optimistic = {
        id: `local-${Date.now()}`,
        project_id: projectId,
        requester_id: user.id,
        owner_id: ownerId,
        status: "pending",
        created_at: new Date().toISOString(),
      };
      setOutgoingRequests((prev) => [optimistic, ...prev]);

      const { data, error } = await supabase
        .from("join_requests")
        .insert({
          project_id: projectId,
          requester_id: user.id,
          owner_id: ownerId,
          status: "pending",
        })
        .select()
        .single();

      if (error) {
        // Revert optimistic update
        setOutgoingRequests((prev) =>
          prev.filter((r) => r.id !== optimistic.id)
        );
        return { error: error.message };
      }

      // Replace optimistic with real
      setOutgoingRequests((prev) =>
        prev.map((r) => (r.id === optimistic.id ? data : r))
      );

      // Create a notification for the project owner
      await supabase.from("notifications").insert({
        user_id: ownerId,
        type: "join_request",
        message: `${user.username || "Someone"} requested to join "${projectTitle || "your project"}"`,
        ref_id: projectId,
        read: false,
      });

      return { data };
    },
    [user]
  );

  // Accept or decline a request (for project owners)
  const updateRequest = useCallback(
    async (requestId, newStatus) => {
      if (!user || !SUPABASE_CONFIG_VALID) return;

      // Get the request details before updating
      const request = incomingRequests.find((r) => r.id === requestId);
      if (!request) {
        console.error("Request not found:", requestId);
        return;
      }

      console.log(`Updating request ${requestId} to status: ${newStatus}`);

      // Optimistic update
      setIncomingRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r))
      );

      const { error } = await supabase
        .from("join_requests")
        .update({ status: newStatus })
        .eq("id", requestId);

      if (error) {
        console.error("Error updating join request:", error);
        // Revert on error
        fetchIncoming();
        return;
      }

      console.log(`Join request ${requestId} updated successfully`);

      // If accepted, add user to project_members table
      if (newStatus === "accepted") {
        try {
          console.log(`Adding user ${request.requester_id} to project ${request.project_id}`);

          const { error: memberError } = await supabase
            .from("project_members")
            .insert({
              project_id: request.project_id,
              user_id: request.requester_id,
              role: "member",
            });

          if (memberError) {
            console.error("Error adding member to project_members:", memberError);
            throw memberError;
          }

          console.log("Successfully added to project_members");

          // Create notification for requester
          const { error: notifError } = await supabase
            .from("notifications")
            .insert({
              user_id: request.requester_id,
              type: "join_accepted",
              message: `Your request to join "${request.projects?.title || "the project"}" was accepted!`,
              ref_id: request.project_id,
              read: false,
            });

          if (notifError) {
            console.error("Error creating notification:", notifError);
          } else {
            console.log("Notification created successfully");
          }
        } catch (err) {
          console.error("Error in accept flow:", err);
        }
      } else if (newStatus === "declined") {
        // Notify requester that their request was declined
        try {
          await supabase.from("notifications").insert({
            user_id: request.requester_id,
            type: "join_declined",
            message: `Your request to join "${request.projects?.title || "the project"}" was declined.`,
            ref_id: request.project_id,
            read: false,
          });
        } catch (err) {
          console.error("Error creating decline notification:", err);
        }
      }
    },
    [user, fetchIncoming, incomingRequests]
  );

  return {
    outgoingRequests,
    incomingRequests,
    loading,
    sendJoinRequest,
    hasRequested,
    getRequestStatus,
    updateRequest,
    refetch: () => { fetchOutgoing(); fetchIncoming(); },
  };
}
