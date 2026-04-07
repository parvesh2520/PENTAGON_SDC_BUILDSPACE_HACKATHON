/*
  Opportunities.jsx
  -----------------
  Board showing all posted opportunities. Filter by type
  (teammate / hackathon / role) and keyword search.
  Logged-in users can post new opportunities via the modal.
*/

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import useAuthStore from "../store/authStore";
import PageWrapper from "../components/layout/PageWrapper";
import OpportunityCard from "../components/opportunities/OpportunityCard";
import PostOpportunityModal from "../components/opportunities/PostOpportunityModal";
import Button from "../components/ui/Button";
import { HiOutlinePlus, HiOutlineSearch } from "react-icons/hi";

export default function Opportunities() {
  const user = useAuthStore((s) => s.user);
  const [opps, setOpps]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [typeFilter, setType]     = useState("all");
  const [modalOpen, setModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);

    let query = supabase
      .from("opportunities")
      .select("*, profiles(display_name, avatar_url)")
      .order("created_at", { ascending: false });

    if (typeFilter !== "all") {
      query = query.eq("type", typeFilter);
    }

    const { data } = await query;
    setOpps(data || []);
    setLoading(false);
  }, [typeFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = opps.filter((o) =>
    o.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageWrapper>
      {/* header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-heading dark:text-white">Opportunities</h1>

        {user && (
          <Button onClick={() => setModalOpen(true)}>
            <HiOutlinePlus className="w-4 h-4" />
            Post Opportunity
          </Button>
        )}
      </div>

      {/* filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search opportunities…"
            className="w-full rounded-lg border border-border dark:border-slate-600 bg-white dark:bg-slate-800 pl-10 pr-4 py-2 text-sm text-heading dark:text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>

        <div className="flex gap-2">
          {["all", "teammate", "hackathon", "role"].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={
                "rounded-lg px-4 py-2 text-sm font-medium capitalize transition-colors cursor-pointer " +
                (typeFilter === t
                  ? "bg-brand-600 text-white"
                  : "bg-white dark:bg-slate-800 text-body dark:text-slate-300 border border-border dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700")
              }
            >
              {t === "all" ? "All" : t}
            </button>
          ))}
        </div>
      </div>

      {/* grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-52 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((o) => (
            <OpportunityCard key={o.id} opp={o} />
          ))}
        </div>
      ) : (
        <p className="text-center py-16 text-muted">No opportunities yet — post the first one!</p>
      )}

      <PostOpportunityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={() => loadData()}
      />
    </PageWrapper>
  );
}
