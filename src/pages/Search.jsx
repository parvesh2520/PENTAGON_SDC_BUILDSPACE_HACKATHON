/*
  Search.jsx
  ----------
  Global search page with cyberpunk design.
  Debounced search across people, projects, and opportunities.
*/

import { Link } from "react-router-dom";
import { useSearch } from "../hooks/useSearch";
import PageWrapper from "../components/layout/PageWrapper";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import { HiOutlineSearch, HiOutlineUserGroup, HiOutlineCollection, HiOutlineBriefcase, HiOutlineTerminal } from "react-icons/hi";
import { useState } from "react";

export default function Search() {
  const { query, results, loading, handleChange } = useSearch();
  const [tab, setTab] = useState("people");

  const tabs = [
    { key: "people",        label: "People",        count: results.people.length, icon: HiOutlineUserGroup },
    { key: "projects",      label: "Projects",      count: results.projects.length, icon: HiOutlineCollection },
    { key: "opportunities", label: "Opportunities", count: results.opportunities.length, icon: HiOutlineBriefcase },
  ];

  const totalResults = results.people.length + results.projects.length + results.opportunities.length;

  return (
    <PageWrapper className="relative">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[150px] pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 animate-fade-up">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <HiOutlineSearch className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Search</h1>
            <p className="text-sm text-slate-400">Find people, projects, and opportunities</p>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative max-w-2xl mb-10 animate-fade-up delay-100">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-xl pointer-events-none" />
          <div className="relative">
            <HiOutlineSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Search people, projects, or opportunities..."
              className="w-full rounded-2xl border border-cyan-500/15 bg-slate-800/60 pl-14 pr-6 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all hover:border-cyan-500/25 backdrop-blur-sm"
              autoFocus
            />
            {query && (
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-xs text-cyan-400 font-mono">
                {totalResults} results
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        {query && (
          <div className="flex gap-1 mb-8 p-1.5 bg-slate-800/60 rounded-2xl border border-cyan-500/10 max-w-fit animate-fade-up delay-200">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all cursor-pointer ${
                  tab === t.key
                    ? "bg-cyan-500/20 text-cyan-300 shadow-sm shadow-cyan-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
                <span className="text-xs opacity-60">({t.count})</span>
              </button>
            ))}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-6 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="h-5 bg-slate-800 rounded w-3/4 mb-3" />
                <div className="h-4 bg-slate-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && query && (
          <>
            {totalResults === 0 && (
              <div className="card p-16 text-center animate-fade-up">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
                  <HiOutlineSearch className="w-8 h-8 text-cyan-400/40" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No results found</h3>
                <p className="text-slate-400 text-sm">Try different keywords for &ldquo;{query}&rdquo;</p>
              </div>
            )}

            {/* People tab */}
            {tab === "people" && results.people.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.people.map((p, i) => (
                  <Link
                    key={p.id}
                    to={`/u/${p.username || p.id}`}
                    className="card p-5 flex items-center gap-4 group animate-fade-up"
                    style={{ animationDelay: `${i * 75}ms` }}
                  >
                    <Avatar src={p.avatar_url} name={p.display_name} size="md" className="group-hover:ring-cyan-500/40" />
                    <div className="min-w-0">
                      <p className="font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">{p.display_name}</p>
                      <p className="text-xs text-slate-500 font-mono">@{p.username}</p>
                      {p.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {p.skills.slice(0, 3).map((s) => (
                            <Badge key={s} color="slate" className="text-[10px]">{s}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Projects tab */}
            {tab === "projects" && results.projects.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.projects.map((p, i) => (
                  <Link
                    key={p.id}
                    to={`/projects/${p.id}`}
                    className="card p-5 group animate-fade-up"
                    style={{ animationDelay: `${i * 75}ms` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold text-white group-hover:text-cyan-300 transition-colors">{p.title}</p>
                      <Badge color={p.status === "open" ? "green" : "red"} className="text-[10px]">{p.status}</Badge>
                    </div>
                    <p className="text-sm text-slate-400 line-clamp-2">{p.description}</p>
                  </Link>
                ))}
              </div>
            )}

            {/* Opportunities tab */}
            {tab === "opportunities" && results.opportunities.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.opportunities.map((o, i) => (
                  <div 
                    key={o.id} 
                    className="card p-5 group animate-fade-up"
                    style={{ animationDelay: `${i * 75}ms` }}
                  >
                    <Badge color="cyan" className="mb-3 text-[10px]">{o.type}</Badge>
                    <p className="font-semibold text-white group-hover:text-cyan-300 transition-colors">{o.title}</p>
                    <p className="text-sm text-slate-400 line-clamp-2 mt-2">{o.description}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {!query && (
          <div className="card p-20 text-center animate-fade-up delay-200">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
              <HiOutlineTerminal className="w-8 h-8 text-cyan-400/40" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Ready to search</h3>
            <p className="text-slate-400 text-sm">Start typing to search across BuildSpace</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
