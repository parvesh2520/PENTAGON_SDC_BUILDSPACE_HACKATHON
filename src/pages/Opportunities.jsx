/*
  Opportunities.jsx
  -----------------
  Opportunity board with premium dark cards and type filtering.
  Features: type badges, search, create opportunity flow.
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
} from "react-icons/hi";

const typeColors = {
  teammate: "cyan",
  hiring: "green",
  hackathon: "brand",
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
    { key: "all", label: "All" },
    { key: "teammate", label: "Teammates" },
    { key: "hiring", label: "Hiring" },
    { key: "hackathon", label: "Hackathons" },
  ];

  return (
    <PageWrapper>
      {/* header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <HiOutlineBriefcase className="w-6 h-6 text-violet-400" />
            Opportunities
          </h1>
          <p className="text-sm text-slate-400 mt-1">Find teammates, roles, and hackathon openings</p>
        </div>
      </div>

      {/* search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search opportunities…"
            className="w-full rounded-xl border border-violet-500/15 bg-slate-800/60 pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
          />
        </div>
        <div className="flex gap-1 bg-slate-800/60 rounded-xl p-1 border border-violet-500/10">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                filter === tab.key
                  ? "bg-violet-500/20 text-violet-300"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* opportunities list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-1/3 mb-3" />
              <div className="h-3 bg-slate-800 rounded w-full mb-2" />
              <div className="h-3 bg-slate-800 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <HiOutlineBriefcase className="w-12 h-12 text-violet-500/20 mx-auto mb-4" />
          <p className="text-slate-400 text-sm">
            {search || filter !== "all" ? "No matching opportunities." : "No opportunities posted yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item, i) => {
            const TypeIcon = typeIcons[item.type] || HiOutlineBriefcase;
            return (
              <div key={item.id} className={`card p-6 animate-fade-up delay-${Math.min(i * 100, 500)}`}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                    <TypeIcon className="w-5 h-5 text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <Badge color={typeColors[item.type] || "slate"} className="flex-shrink-0">
                        {item.type || "general"}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-slate-400 leading-relaxed">{item.description}</p>

                    {/* skills needed */}
                    {item.skills_needed?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {item.skills_needed.map((skill) => (
                          <Badge key={skill} color="slate" className="text-[10px]">{skill}</Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                      <span>Posted by {item.profiles?.display_name || "Anonymous"}</span>
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
    </PageWrapper>
  );
}
