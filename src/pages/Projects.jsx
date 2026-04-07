/*
  Projects.jsx
  ------------
  Browsable project list with search, tech-stack filter,
  and status filter. Plus a "Create Project" button that
  opens the modal.
*/

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import useAuthStore from "../store/authStore";
import PageWrapper from "../components/layout/PageWrapper";
import ProjectCard from "../components/projects/ProjectCard";
import CreateProjectModal from "../components/projects/CreateProjectModal";
import Button from "../components/ui/Button";
import { HiOutlinePlus, HiOutlineSearch } from "react-icons/hi";

export default function Projects() {
  const user = useAuthStore((s) => s.user);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [status, setStatus]     = useState("all"); // all | open | closed
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from("projects")
      .select("*, project_members(user_id, role, profiles(display_name, avatar_url))")
      .order("created_at", { ascending: false });

    if (status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error: loadError } = await query;
    if (loadError) {
      setError(loadError.message || "Failed to load projects.");
      setLoading(false);
      return;
    }

    // reshape — flatten members for the card
    const shaped = (data || []).map((p) => ({
      ...p,
      members: p.project_members || [],
    }));

    setProjects(shaped);
    setLoading(false);
  }, [status]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // client-side search filter (searching by title)
  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageWrapper>
      {/* top bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-heading dark:text-white">Projects</h1>

        {user && (
          <Button onClick={() => setModalOpen(true)}>
            <HiOutlinePlus className="w-4 h-4" />
            New Project
          </Button>
        )}
      </div>

      {/* filters row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects…"
            className="w-full rounded-lg border border-border dark:border-slate-600 bg-white dark:bg-slate-800 pl-10 pr-4 py-2 text-sm text-heading dark:text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>

        <div className="flex gap-2">
          {["all", "open", "closed"].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={
                "rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors cursor-pointer " +
                (status === s
                  ? "bg-brand-600 text-white"
                  : "bg-white dark:bg-slate-800 text-body dark:text-slate-300 border border-border dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700")
              }
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* project grid */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-52 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      ) : (
        <p className="text-center py-16 text-muted">No projects match your filters.</p>
      )}

      {/* create modal */}
      <CreateProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => loadProjects()}
      />
    </PageWrapper>
  );
}
