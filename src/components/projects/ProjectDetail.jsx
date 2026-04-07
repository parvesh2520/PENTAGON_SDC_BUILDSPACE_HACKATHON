/*
  ProjectDetail.jsx  (component version)
  ---------------------------------------
  Full detail view for a single project with dark glassmorphic styling.
*/

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";
import useAuthStore from "../../store/authStore";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { HiOutlineExternalLink } from "react-icons/hi";

export default function ProjectDetailView({ projectId }) {
  const user = useAuthStore((s) => s.user);
  const [project, setProject]   = useState(null);
  const [members, setMembers]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [requested, setRequested] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
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
    return <div className="h-64 rounded-2xl bg-slate-800/50 animate-pulse" />;
  }

  if (error) {
    return (
      <div className="card px-5 py-4 text-sm text-red-400 border-red-500/20">
        {error}
      </div>
    );
  }

  if (!project) {
    return <p className="text-center py-12 text-slate-500">Project not found.</p>;
  }

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="card p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">{project.title}</h1>
            <p className="text-sm text-slate-500 mt-1">
              by {project.profiles?.display_name || "Unknown"}
            </p>
          </div>
          <Badge color={project.status === "open" ? "green" : "red"}>
            {project.status}
          </Badge>
        </div>

        <p className="text-slate-300 mt-4 leading-relaxed">{project.description}</p>

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
            className="inline-flex items-center gap-1.5 mt-4 text-sm text-violet-400 hover:text-violet-300 transition-colors"
          >
            <HiOutlineExternalLink className="w-4 h-4" />
            View Repository
          </a>
        )}

        {user && !requested && project.status === "open" && user.id !== project.owner_id && (
          <Button onClick={requestJoin} className="mt-4">
            Request to Join
          </Button>
        )}

        {requested && (
          <p className="mt-4 text-sm text-slate-500">You've already joined or requested to join.</p>
        )}
      </div>

      {/* members list */}
      <div className="card p-6">
        <h2 className="font-display text-lg font-semibold text-white mb-4">
          Team Members ({members.length})
        </h2>

        {members.length === 0 ? (
          <p className="text-sm text-slate-500">No members yet.</p>
        ) : (
          <div className="space-y-3">
            {members.map((m) => (
              <div key={m.user_id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-violet-500/5">
                <Avatar src={m.profiles?.avatar_url} name={m.profiles?.display_name} size="sm" />
                <div>
                  <p className="text-sm font-medium text-white">
                    {m.profiles?.display_name}
                  </p>
                  <p className="text-xs text-slate-500">{m.role}</p>
                </div>
                <Badge color={m.role === "owner" ? "brand" : "slate"} className="ml-auto text-[10px]">
                  {m.role}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
