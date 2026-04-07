/*
  Opportunities.jsx
  -----------------
  Opportunity board with premium cards and type filtering.
  Features: type badges, animated search, neon accents.
*/

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import useAuthStore from "../store/authStore";
import PageWrapper from "../components/layout/PageWrapper";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { timeAgo } from "../utils/formatDate";
import {
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlineBriefcase,
  HiOutlineUserGroup,
  HiOutlineLightningBolt,
  HiOutlineSparkles,
} from "react-icons/hi";

const typeColors = {
  teammate: "cyan",
  hiring: "green",
  hackathon: "violet",
};

const typeIcons = {
  teammate: HiOutlineUserGroup,
  hiring: HiOutlineBriefcase,
  hackathon: HiOutlineLightningBolt,
};

export default function Opportunities() {
  const user = useAuthStore((s) => s.user);
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all");

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("opportunities")
        .select("*, profiles(display_name, username, avatar_url)")
        .order("created_at", { ascending: false });

      setItems(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = items.filter((item) => {
    const matchSearch =
      item.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase());
    const matchType = filter === "all" || item.type === filter;
    return matchSearch && matchType;
  });

  const filterTabs = [
    { key: "all", label: "All", icon: HiOutlineSparkles },
    { key: "teammate", label: "Teammates", icon: HiOutlineUserGroup },
    { key: "hiring", label: "Hiring", icon: HiOutlineBriefcase },
    { key: "hackathon", label: "Hackathons", icon: HiOutlineLightningBolt },
  ];

  return (
    <PageWrapper className="relative">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-[300px] h-[300px] rounded-full bg-violet-500/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <div className="animate-fade-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <HiOutlineBriefcase className="w-5 h-5 text-white" />
              </div>
              <h1 className="font-display text-3xl font-bold text-white">
                Opportunities
              </h1>
            </div>
            <p className="text-slate-400 ml-13">Find teammates, roles, and hackathon openings</p>
          </div>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-10">
          {/* Search bar */}
          <div className="relative flex-1 animate-fade-up delay-100">
            <HiOutlineSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search opportunities..."
              className="w-full rounded-2xl border border-cyan-500/15 bg-slate-800/60 pl-14 pr-6 py-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all hover:border-cyan-500/25 backdrop-blur-sm"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 p-1.5 bg-slate-800/60 rounded-2xl border border-cyan-500/10 backdrop-blur-sm animate-fade-up delay-200">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all cursor-pointer ${
                  filter === tab.key
                    ? "bg-cyan-500/20 text-cyan-300 shadow-sm shadow-cyan-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Opportunities list */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card p-6 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-slate-800 rounded w-1/3" />
                    <div className="h-3 bg-slate-800 rounded w-full" />
                    <div className="h-3 bg-slate-800 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-20 text-center animate-fade-up">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
              <HiOutlineBriefcase className="w-8 h-8 text-cyan-400/40" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {search || filter !== "all" ? "No matching opportunities" : "No opportunities posted yet"}
            </h3>
            <p className="text-slate-400 text-sm">
              {search || filter !== "all" ? "Try adjusting your filters." : "Check back soon for new opportunities!"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((item, i) => {
              const TypeIcon = typeIcons[item.type] || HiOutlineBriefcase;
              const typeColor = typeColors[item.type] || "slate";
              
              return (
                <div 
                  key={item.id} 
                  className="card p-6 group animate-fade-up"
                  style={{ animationDelay: `${Math.min(i * 75, 500)}ms` }}
                >
                  <div className="flex items-start gap-5">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-${typeColor}-500/10 flex items-center justify-center border border-${typeColor}-500/20 group-hover:border-${typeColor}-500/40 transition-colors`}>
                      <TypeIcon className={`w-6 h-6 text-${typeColor}-400`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-semibold text-white text-lg group-hover:text-cyan-300 transition-colors">
                          {item.title}
                        </h3>
                        <Badge color={typeColor} className="flex-shrink-0">
                          {item.type || "general"}
                        </Badge>
                      </div>

                      <p className="text-sm text-slate-400 leading-relaxed mb-4">
                        {item.description}
                      </p>

                      {/* Skills needed */}
                      {item.skills_needed?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.skills_needed.map((skill) => (
                            <Badge key={skill} color="slate" className="text-[10px]">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center gap-3 text-xs text-slate-500 pt-3 border-t border-cyan-500/5">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/50" />
                          Posted by {item.profiles?.display_name || "Anonymous"}
                        </span>
                        <span>·</span>
                        <span>{timeAgo(item.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
