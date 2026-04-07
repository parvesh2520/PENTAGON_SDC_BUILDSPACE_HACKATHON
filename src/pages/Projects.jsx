/*
  Projects.jsx
  ------------
  Project listing page with glassmorphic cards and filtering.
  Features: search/filter, create project modal, premium card hover effects.
*/

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import useAuthStore from "../store/authStore";
import PageWrapper from "../components/layout/PageWrapper";
import ProjectCard from "../components/projects/ProjectCard";
import CreateProject from "../components/projects/CreateProjectModal";
import Button from "../components/ui/Button";
import { HiOutlinePlus, HiOutlineSearch, HiOutlineCollection } from "react-icons/hi";

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
    <PageWrapper>
      {/* header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <HiOutlineCollection className="w-6 h-6 text-violet-400" />
            Projects
          </h1>
          <p className="text-sm text-slate-400 mt-1">Discover projects or start your own</p>
        </div>
        {user && (
          <Button onClick={() => setShowCreate(true)} size="sm">
            <HiOutlinePlus className="w-4 h-4" />
            New Project
          </Button>
        )}
      </div>

      {/* search bar */}
      <div className="relative mb-8">
        <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, description, or tech…"
          className="w-full rounded-xl border border-violet-500/15 bg-slate-800/60 pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
        />
      </div>

      {/* project grid */}
      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-3/4 mb-3" />
              <div className="h-3 bg-slate-800 rounded w-full mb-2" />
              <div className="h-3 bg-slate-800 rounded w-5/6" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <HiOutlineCollection className="w-12 h-12 text-violet-500/20 mx-auto mb-4" />
          <p className="text-slate-400 text-sm">
            {search ? "No projects match your search." : "No projects yet. Be the first!"}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <div key={p.id} className={`animate-fade-up delay-${Math.min(i * 100, 500)}`}>
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      )}

      {/* create modal */}
      {showCreate && (
        <CreateProject
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            /* reload projects */
            supabase
              .from("projects")
              .select("*, profiles(display_name, username, avatar_url)")
              .order("created_at", { ascending: false })
              .then(({ data }) => setProjects(data || []));
          }}
        />
      )}
    </PageWrapper>
  );
}
