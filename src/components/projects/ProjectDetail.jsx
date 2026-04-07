/*
  ProjectDetail.jsx  (component version)
  ---------------------------------------
  Full detail view for a single project. Shows members list,
  description, repo link, and a "Request to Join" button
  for logged-in users who aren't already members.
*/

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";
import useAuthStore from "../../store/authStore";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

export default function ProjectDetailView({ projectId }) {
  const user = useAuthStore((s) => s.user);
  const [project, setProject]   = useState(null);
  const [members, setMembers]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [requested, setRequested] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setError(null);
    // get the project
    const { data: proj, error: projectError } = await supabase
      .from("projects")
      .select("*, profiles(display_name, avatar_url)")
      .eq("id", projectId)
      .single();
    if (projectError) {
      setError(projectError.message || "Could not load this project.");
      setLoading(false);
      return;
    }

    // get the members
    const { data: mems, error: membersError } = await supabase
      .from("project_members")
      .select("*, profiles(display_name, avatar_url, username)")
      .eq("project_id", projectId);
    if (membersError) {
      setError(membersError.message || "Could not load team members.");
      setLoading(false);
      return;
    }

    setProject(proj);
    setMembers(mems || []);
    setLoading(false);

    // figure out if current user already requested / joined
    if (user) {
      const already = (mems || []).some((m) => m.user_id === user.id);
      setRequested(already);
    }
  }, [projectId, user]);

  useEffect(() => {
    if (projectId) load();
  }, [projectId, load]);

  async function requestJoin() {
    if (!user || requested) return;

    await supabase.from("project_members").insert({
      project_id: projectId,
      user_id:    user.id,
      role:       "pending",
    });

    // notify the project owner
    if (project?.owner_id) {
      await supabase.from("notifications").insert({
        user_id: project.owner_id,
        type:    "join_request",
        message: `Someone requested to join "${project.title}"`,
        ref_id:  projectId,
      });
    }

    setRequested(true);
  }

  if (loading) {
    return <div className="h-64 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20 px-4 py-4 text-sm text-red-700 dark:text-red-200">
        {error}
      </div>
    );
  }

  if (!project) {
    return <p className="text-center py-12 text-muted">Project not found.</p>;
  }

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="rounded-2xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-heading dark:text-white">{project.title}</h1>
            <p className="text-sm text-muted mt-1">
              by {project.profiles?.display_name || "Unknown"}
            </p>
          </div>
          <Badge color={project.status === "open" ? "green" : "red"}>
            {project.status}
          </Badge>
        </div>

        <p className="text-body dark:text-slate-300 mt-4 leading-relaxed">{project.description}</p>

        {project.tech_stack?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {project.tech_stack.map((t) => (
              <Badge key={t} color="slate">{t}</Badge>
            ))}
          </div>
        )}

        {project.repo_url && (
          <a
            href={project.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-sm text-brand-600 dark:text-brand-400 hover:underline"
          >
            View Repository ↗
          </a>
        )}

        {user && !requested && project.status === "open" && user.id !== project.owner_id && (
          <Button onClick={requestJoin} className="mt-4">
            Request to Join
          </Button>
        )}

        {requested && (
          <p className="mt-4 text-sm text-muted">You've already joined or requested to join.</p>
        )}
      </div>

      {/* members list */}
      <div className="rounded-2xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 p-6">
        <h2 className="text-lg font-semibold text-heading dark:text-white mb-4">
          Team Members ({members.length})
        </h2>

        {members.length === 0 ? (
          <p className="text-sm text-muted">No members yet.</p>
        ) : (
          <div className="space-y-3">
            {members.map((m) => (
              <div key={m.user_id} className="flex items-center gap-3">
                <Avatar src={m.profiles?.avatar_url} name={m.profiles?.display_name} size="sm" />
                <div>
                  <p className="text-sm font-medium text-heading dark:text-white">
                    {m.profiles?.display_name}
                  </p>
                  <p className="text-xs text-muted">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
