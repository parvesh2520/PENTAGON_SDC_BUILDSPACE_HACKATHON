/*
  ProjectDetail.jsx  (component version)
  ---------------------------------------
  Futuristic detail view for a single project with cyber aesthetics.
  Uses useJoinRequests for join flow + shows owner a request management panel.
*/

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";
import useAuthStore from "../../store/authStore";
import { useJoinRequests } from "../../hooks/useJoinRequests";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { HiOutlineExternalLink, HiCheck, HiX } from "react-icons/hi";

export default function ProjectDetailView({ projectId }) {
  const user = useAuthStore((s) => s.user);
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    sendJoinRequest,
    hasRequested,
    getRequestStatus,
    incomingRequests,
    updateRequest,
    refetch: refetchRequests,
  } = useJoinRequests();

  const alreadyRequested = hasRequested(projectId);
  const requestStatus = getRequestStatus(projectId);
  const isOwner = user?.id === project?.owner_id;

  // Requests specifically for this project
  const projectRequests = incomingRequests.filter((r) => r.project_id === projectId && r.status === "pending");

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
  }, [projectId]);

  useEffect(() => {
    if (projectId) load();
  }, [projectId, load]);

  async function requestJoin() {
    if (!user || alreadyRequested || !project) return;
    const result = await sendJoinRequest(project.id, project.owner_id, project.title);
    if (result.error) alert(result.error);
  }

  async function handleAccept(req) {
    await updateRequest(req.id, "accepted");
    // Note: project_members insert & notification handled inside updateRequest hook
    refetchRequests();
    load();
  }

  async function handleDecline(req) {
    await updateRequest(req.id, "declined");
    // Note: decline notification handled inside updateRequest hook
    refetchRequests();
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="relative h-64 rounded-none bg-slate-900/50 border border-slate-700/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent animate-shimmer" />
        </div>
        <div className="relative h-48 rounded-none bg-slate-900/50 border border-slate-700/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent animate-shimmer" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-none border border-red-500/30 bg-red-500/10 px-6 py-5 text-sm text-red-400 flex items-center gap-3">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        {error}
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-slate-500">Project not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* header card */}
      <div className="relative group rounded-none bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 overflow-hidden">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/0 to-violet-500/0 group-hover:from-cyan-500/10 group-hover:to-violet-500/10 rounded-none blur-lg transition-all duration-500" />
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0, 255, 255, 0.3) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />
        <div className="relative p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-violet-400">
                {project.title}
              </h1>
              <p className="text-sm text-slate-500 mt-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                by {project.profiles?.display_name || "Unknown"}
              </p>
            </div>
            <Badge color={project.status === "open" ? "green" : "red"}>
              {project.status}
            </Badge>
          </div>

          <p className="text-slate-300 leading-relaxed mb-6">{project.description}</p>

          {project.tech_stack?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tech_stack.map((t, i) => (
                <span
                  key={t}
                  style={{ animationDelay: `${i * 50}ms` }}
                  className="px-3 py-1.5 text-xs font-mono text-cyan-400/80 bg-cyan-500/10 border border-cyan-500/20 rounded-none animate-fade-up"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-none text-sm text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300"
            >
              <HiOutlineExternalLink className="w-4 h-4" />
              View Repository
            </a>
          )}

          {/* Join button for non-owners */}
          {user && !alreadyRequested && project.status === "open" && user.id !== project.owner_id && (
            <Button onClick={requestJoin} className="mt-6 rounded-none bg-[#e8ff47] text-black hover:bg-[#d4e83e]">
              Request to Join
            </Button>
          )}

          {requestStatus === "pending" && (
            <p className="mt-6 text-sm text-[#e8ff47] flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Request sent — awaiting owner response.
            </p>
          )}
          {requestStatus === "accepted" && (
            <p className="mt-6 text-sm text-green-400 flex items-center gap-2">
              <HiCheck className="w-4 h-4" />
              You've been accepted to this project!
            </p>
          )}
          {requestStatus === "declined" && (
            <p className="mt-6 text-sm text-red-400 flex items-center gap-2">
              <HiX className="w-4 h-4" />
              Your request was declined.
            </p>
          )}
        </div>
      </div>

      {/* OWNER: Join Request Management Panel */}
      {isOwner && projectRequests.length > 0 && (
        <div className="relative group rounded-none bg-slate-900/80 backdrop-blur-sm border border-[#e8ff47]/20 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(232, 255, 71, 0.3) 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }} />
          <div className="relative p-6">
            <h2 className="text-lg font-bold text-[#e8ff47] mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Join Requests ({projectRequests.length})
            </h2>
            <div className="space-y-3">
              {projectRequests.map((req) => {
                const profile = req.requester_profile || {};
                const initials = (profile.display_name || profile.username || "U")
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <div key={req.id} className="flex items-center justify-between gap-4 p-4 rounded-none bg-slate-800/40 border border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <Avatar src={profile.avatar_url} name={profile.display_name} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-white">
                          {profile.display_name || profile.username || "Unknown User"}
                        </p>
                        <p className="text-xs text-slate-500 font-mono">wants to join</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleDecline(req)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors cursor-pointer rounded-none"
                      >
                        <HiX className="w-3.5 h-3.5" />
                        Decline
                      </button>
                      <button
                        onClick={() => handleAccept(req)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-black bg-[#e8ff47] hover:bg-[#d4e83e] font-bold transition-colors cursor-pointer rounded-none"
                      >
                        <HiCheck className="w-3.5 h-3.5" />
                        Accept
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* members list */}
      <div className="relative group rounded-none bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0, 255, 255, 0.3) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }} />
        <div className="relative p-6">
          <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400 mb-6 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/20">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            Team Members ({members.length})
          </h2>

          {members.length === 0 ? (
            <p className="text-sm text-slate-500">No members yet.</p>
          ) : (
            <div className="space-y-3">
              {members.map((m, i) => (
                <div
                  key={m.user_id}
                  style={{ animationDelay: `${i * 50}ms` }}
                  className="group/member flex items-center gap-4 p-4 rounded-none bg-slate-800/40 border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 animate-fade-up"
                >
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/50 to-violet-500/50 rounded-full blur opacity-0 group-hover/member:opacity-100 transition-opacity duration-300" />
                    <Avatar src={m.profiles?.avatar_url} name={m.profiles?.display_name} size="sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">
                      {m.profiles?.display_name}
                    </p>
                    <p className="text-xs text-slate-500 font-mono">@{m.profiles?.username || "user"}</p>
                  </div>
                  <Badge color={m.role === "owner" ? "brand" : "slate"}>
                    {m.role}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
