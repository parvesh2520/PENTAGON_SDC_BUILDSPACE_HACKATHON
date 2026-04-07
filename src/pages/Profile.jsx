/*
  Profile.jsx
  -----------
  User profile page at /u/:username.
  Premium dark glassmorphic design with neon accents.
*/

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import useAuthStore from "../store/authStore";
import { useProfile } from "../hooks/useProfile";
import PageWrapper from "../components/layout/PageWrapper";
import ProfileHeader from "../components/profile/ProfileHeader";
import SkillsGrid from "../components/profile/SkillsGrid";
import EditProfileDrawer from "../components/profile/EditProfileDrawer";
import ProjectCard from "../components/projects/ProjectCard";
import { HiOutlineCode, HiOutlineCollection, HiOutlineSparkles } from "react-icons/hi";

export default function Profile() {
  const { username } = useParams();
  const currentUser  = useAuthStore((s) => s.user);
  const { profile, loading, updateProfile, refetch } = useProfile(username);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [projects, setProjects]     = useState([]);

  const isOwn = currentUser && profile && currentUser.id === profile.id;

  useEffect(() => {
    if (!profile) return;

    async function loadProjects() {
      const { data } = await supabase
        .from("project_members")
        .select("project_id, role, projects(*)")
        .eq("user_id", profile.id);

      setProjects((data || []).map((d) => d.projects).filter(Boolean));
    }

    loadProjects();
  }, [profile]);

  if (loading) {
    return (
      <PageWrapper>
        <div className="space-y-6 animate-pulse">
          <div className="card p-8">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-24 h-24 rounded-2xl bg-slate-800" />
              <div className="flex-1 space-y-4">
                <div className="h-6 bg-slate-800 rounded w-1/3" />
                <div className="h-4 bg-slate-800 rounded w-1/4" />
                <div className="h-4 bg-slate-800 rounded w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (!profile) {
    return (
      <PageWrapper>
        <div className="card p-20 text-center animate-fade-up">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
            <HiOutlineSparkles className="w-8 h-8 text-cyan-400/40" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">User not found</h3>
          <p className="text-slate-400">This profile doesn&apos;t exist or has been removed.</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="relative">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 space-y-8">
        <div className="animate-fade-up">
          <ProfileHeader
            profile={profile}
            isOwn={isOwn}
            onEdit={() => setDrawerOpen(true)}
          />
        </div>

        {/* Skills section */}
        <section className="card p-6 animate-fade-up delay-100">
          <h2 className="font-display text-lg font-semibold text-white mb-5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <HiOutlineCode className="w-4 h-4 text-cyan-400" />
            </div>
            Skills
          </h2>
          <SkillsGrid skills={profile.skills || []} />
          {(!profile.skills || profile.skills.length === 0) && (
            <p className="text-sm text-slate-500">No skills listed yet.</p>
          )}
        </section>

        {/* Projects section */}
        <section className="animate-fade-up delay-200">
          <h2 className="font-display text-lg font-semibold text-white mb-5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <HiOutlineCollection className="w-4 h-4 text-cyan-400" />
            </div>
            Projects ({projects.length})
          </h2>

          {projects.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <div 
                  key={p.id} 
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 100 + 300}ms` }}
                >
                  <ProjectCard project={p} />
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <p className="text-sm text-slate-500">No projects yet.</p>
            </div>
          )}
        </section>
      </div>

      {/* Edit drawer */}
      <EditProfileDrawer
        key={`${profile.id}-${drawerOpen ? "open" : "closed"}`}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        profile={profile}
        onSave={async (updates) => {
          await updateProfile(updates);
          refetch();
        }}
      />
    </PageWrapper>
  );
}
