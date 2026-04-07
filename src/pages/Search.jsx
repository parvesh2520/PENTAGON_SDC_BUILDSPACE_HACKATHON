/*
  Search.jsx
  ----------
  Global search page with dark AI-themed design.
  Debounced search across people, projects, and opportunities.
*/

import { Link } from "react-router-dom";
import { useSearch } from "../hooks/useSearch";
import PageWrapper from "../components/layout/PageWrapper";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import { HiOutlineSearch } from "react-icons/hi";
import { useState } from "react";

export default function Search() {
  const { query, results, loading, handleChange } = useSearch();
  const [tab, setTab] = useState("people");

  const tabs = [
    { key: "people",        label: "People",        count: results.people.length },
    { key: "projects",      label: "Projects",      count: results.projects.length },
    { key: "opportunities", label: "Opportunities", count: results.opportunities.length },
  ];

  const totalResults = results.people.length + results.projects.length + results.opportunities.length;

  return (
    <PageWrapper>
      <h1 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <HiOutlineSearch className="w-6 h-6 text-violet-400" />
        Search
      </h1>

      {/* search bar */}
      <div className="relative max-w-xl mb-8">
        <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search people, projects, or opportunities…"
          className="w-full rounded-xl border border-violet-500/15 bg-slate-800/60 pl-12 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
          autoFocus
        />
      </div>

      {/* tabs */}
      {query && (
        <div className="flex gap-1 mb-6 bg-slate-800/60 rounded-xl p-1 border border-violet-500/10 max-w-fit">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={
                "px-4 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer " +
                (tab === t.key
                  ? "bg-violet-500/20 text-violet-300"
                  : "text-slate-400 hover:text-white")
              }
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>
      )}

      {/* loading state */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-3/4 mb-2" />
              <div className="h-3 bg-slate-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* results */}
      {!loading && query && (
        <>
          {totalResults === 0 && (
            <div className="card p-12 text-center">
              <HiOutlineSearch className="w-10 h-10 text-violet-500/20 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">No results for "{query}"</p>
            </div>
          )}

          {/* people tab */}
          {tab === "people" && results.people.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.people.map((p) => (
                <Link
                  key={p.id}
                  to={`/u/${p.username || p.id}`}
                  className="card p-5 flex items-center gap-4"
                >
                  <Avatar src={p.avatar_url} name={p.display_name} size="md" />
                  <div>
                    <p className="font-medium text-white">{p.display_name}</p>
                    <p className="text-xs text-slate-500">@{p.username}</p>
                    {p.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
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

          {/* projects tab */}
          {tab === "projects" && results.projects.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.projects.map((p) => (
                <Link
                  key={p.id}
                  to={`/projects/${p.id}`}
                  className="card p-5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-white">{p.title}</p>
                    <Badge color={p.status === "open" ? "green" : "red"}>{p.status}</Badge>
                  </div>
                  <p className="text-sm text-slate-400 line-clamp-2">{p.description}</p>
                </Link>
              ))}
            </div>
          )}

          {/* opportunities tab */}
          {tab === "opportunities" && results.opportunities.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.opportunities.map((o) => (
                <div key={o.id} className="card p-5">
                  <Badge color="brand" className="mb-2">{o.type}</Badge>
                  <p className="font-medium text-white">{o.title}</p>
                  <p className="text-sm text-slate-400 line-clamp-2 mt-1">{o.description}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* empty state before searching */}
      {!query && (
        <div className="card p-16 text-center">
          <HiOutlineSearch className="w-12 h-12 text-violet-500/15 mx-auto mb-4" />
          <p className="text-slate-400">Start typing to search across BuildSpace</p>
        </div>
      )}
    </PageWrapper>
  );
}
