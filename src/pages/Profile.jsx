/*
  Profile.jsx
  -----------
  User profile page at /u/:username.
  Dark glassmorphic design with violet accents.
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
import { HiOutlineCode, HiOutlineCollection } from "react-icons/hi";

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
        <div className="space-y-4">
          <div className="card p-8 animate-pulse">
            <div className="flex gap-6">
              <div className="w-24 h-24 rounded-full bg-slate-800" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-slate-800 rounded w-1/3" />
                <div className="h-3 bg-slate-800 rounded w-1/4" />
                <div className="h-3 bg-slate-800 rounded w-2/3" />
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
        <div className="card p-16 text-center">
          <p className="text-slate-400 text-lg">User not found.</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="space-y-8">
        <ProfileHeader
          profile={profile}
          isOwn={isOwn}
          onEdit={() => setDrawerOpen(true)}
        />

        {/* skills section */}
        <section className="card p-6">
          <h2 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <HiOutlineCode className="w-5 h-5 text-violet-400" />
            Skills
          </h2>
          <SkillsGrid skills={profile.skills || []} />
          {(!profile.skills || profile.skills.length === 0) && (
            <p className="text-sm text-slate-500">No skills listed yet.</p>
          )}
        </section>

        {/* projects section */}
        <section>
          <h2 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <HiOutlineCollection className="w-5 h-5 text-violet-400" />
            Projects ({projects.length})
          </h2>

          {projects.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <p className="text-sm text-slate-500">No projects yet.</p>
            </div>
          )}
        </section>
      </div>

      {/* edit drawer */}
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
