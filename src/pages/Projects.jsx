/*
  Projects.jsx
  ------------
  Project listing with glassmorphic cards and filtering.
  Features: animated search, create project modal, hover effects.
*/

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import useAuthStore from "../store/authStore";
import PageWrapper from "../components/layout/PageWrapper";
import ProjectCard from "../components/projects/ProjectCard";
import CreateProject from "../components/projects/CreateProjectModal";
import Button from "../components/ui/Button";
import { HiOutlinePlus, HiOutlineSearch, HiOutlineCollection, HiOutlineCode, HiOutlineSparkles } from "react-icons/hi";

export default function Projects() {
  const user = useAuthStore((s) => s.user);
  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch]       = useState("");

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("projects")
        .select("*, profiles(display_name, username, avatar_url)")
        .order("created_at", { ascending: false });

      setProjects(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = projects.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      p.tech_stack?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <PageWrapper className="relative">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <div className="animate-fade-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <HiOutlineCollection className="w-5 h-5 text-white" />
              </div>
              <h1 className="font-display text-3xl font-bold text-white">
                Projects
              </h1>
            </div>
            <p className="text-slate-400 ml-13">Discover projects or start your own</p>
          </div>
          
          {user && (
            <Button onClick={() => setShowCreate(true)} className="animate-fade-up delay-100">
              <HiOutlinePlus className="w-4 h-4" />
              New Project
            </Button>
          )}
        </div>

        {/* Search bar */}
        <div className="relative mb-10 animate-fade-up delay-200">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-xl pointer-events-none" />
          <div className="relative">
            <HiOutlineSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, description, or tech..."
              className="w-full rounded-2xl border border-cyan-500/15 bg-slate-800/60 pl-14 pr-6 py-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all hover:border-cyan-500/25 backdrop-blur-sm"
            />
            {search && (
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-xs text-cyan-400">
                {filtered.length} results
              </div>
            )}
          </div>
        </div>

        {/* Project grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card p-6 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="h-5 bg-slate-800 rounded w-3/4 mb-4" />
                <div className="h-3 bg-slate-800 rounded w-full mb-2" />
                <div className="h-3 bg-slate-800 rounded w-5/6 mb-4" />
                <div className="flex gap-2">
                  <div className="h-6 bg-slate-800 rounded-full w-16" />
                  <div className="h-6 bg-slate-800 rounded-full w-12" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-20 text-center animate-fade-up">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
              <HiOutlineCode className="w-8 h-8 text-cyan-400/40" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {search ? "No projects match your search" : "No projects yet"}
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              {search ? "Try adjusting your search terms." : "Be the first to create a project!"}
            </p>
            {!search && user && (
              <Button onClick={() => setShowCreate(true)}>
                <HiOutlineSparkles className="w-4 h-4" />
                Create First Project
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <div 
                key={p.id} 
                className="animate-fade-up"
                style={{ animationDelay: `${Math.min(i * 75, 600)}ms` }}
              >
                <ProjectCard project={p} />
              </div>
            ))}
          </div>
        )}

        {/* Create modal */}
        {showCreate && (
          <CreateProject
            onClose={() => setShowCreate(false)}
            onCreated={() => {
              setShowCreate(false);
              supabase
                .from("projects")
                .select("*, profiles(display_name, username, avatar_url)")
                .order("created_at", { ascending: false })
                .then(({ data }) => setProjects(data || []));
            }}
          />
        )}
      </div>
    </PageWrapper>
  );
}
