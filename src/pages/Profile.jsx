/*
  Profile.jsx
  -----------
  User profile page at /u/:username.
  Shows the profile header, skills grid, and a list of
  projects the user owns or belongs to.
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

export default function Profile() {
  const { username } = useParams();
  const currentUser  = useAuthStore((s) => s.user);
  const { profile, loading, updateProfile, refetch } = useProfile(username);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [projects, setProjects]     = useState([]);

  // determine if this is the logged-in user's own profile
  const isOwn = currentUser && profile && currentUser.id === profile.id;

  // grab the projects this user is part of
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
        <div className="h-48 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
      </PageWrapper>
    );
  }

  if (!profile) {
    return (
      <PageWrapper>
        <p className="text-center py-20 text-muted text-lg">User not found.</p>
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
        <section>
          <h2 className="text-lg font-semibold text-heading dark:text-white mb-4">Skills</h2>
          <SkillsGrid skills={profile.skills || []} />
        </section>

        {/* projects section */}
        <section>
          <h2 className="text-lg font-semibold text-heading dark:text-white mb-4">
            Projects ({projects.length})
          </h2>

          {projects.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">No projects yet.</p>
          )}
        </section>
      </div>

      {/* edit drawer (only renders when isOwn) */}
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
