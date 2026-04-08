/*
  Teams.jsx
  ---------
  Shows all teams the user is part of (fetched from Supabase).
  - Displays projects where user is a member or owner
  - Shows member count for each project
  - Allows leaving projects (if not owner)
  - Real-time updates when members join/leave
*/

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, ArrowRight, Plus, ExternalLink, Crown, LogOut } from "lucide-react";
import { useTeamProjects } from "../hooks/useTeamProjects";
import useAuthStore from "../store/authStore";

// Noise overlay (matches Landing page)
function NoiseOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[999]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        opacity: 0.03,
      }}
    />
  );
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.15 },
  },
};

const emptyVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 20, delay: 0.05 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

// Team Card Component
function TeamCard({ team, index, onLeave }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const isOwner = team.membership_role === 'owner';

  const handleLeave = async () => {
    if (showLeaveConfirm) {
      await onLeave(team.id);
      setShowLeaveConfirm(false);
    } else {
      setShowLeaveConfirm(true);
      setTimeout(() => setShowLeaveConfirm(false), 3000);
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowLeaveConfirm(false);
      }}
      className={`
        relative bg-[#0a0a0a] border p-5 rounded-none transition-all duration-300 flex flex-col justify-between
        ${isHovered ? "border-[#e8ff47]/40 shadow-[0_0_30px_rgba(232,255,71,0.04)]" : "border-[#1f1f1f]"}
      `}
    >
      {/* Top Row: Name + Status + Role Badge */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-base font-bold text-white tracking-tight font-sans leading-tight flex-1">
            {team.title}
          </h3>
          <div className="flex items-center gap-2">
            {isOwner ? (
              <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.1em] text-[#e8ff47] border border-[#e8ff47]/30 bg-[#e8ff47]/5 rounded-none">
                <Crown size={10} />
                Owner
              </span>
            ) : (
              <span className="shrink-0 inline-flex items-center px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.1em] text-[#888] border border-[#1f1f1f] bg-[#0a0a0a] rounded-none">
                Member
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-[#666] font-sans leading-relaxed mb-4 line-clamp-2">
          {team.description || "No description provided"}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(team.tech_stack || []).slice(0, 4).map((tech) => (
            <span key={tech} className="px-2 py-0.5 bg-[#111] border border-[#1f1f1f] text-[#888] text-[10px] font-mono rounded-none">
              {tech}
            </span>
          ))}
          {(team.tech_stack || []).length > 4 && (
            <span className="px-2 py-0.5 bg-[#111] border border-[#1f1f1f] text-[#666] text-[10px] font-mono rounded-none">
              +{(team.tech_stack || []).length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Bottom section */}
      <div>
        {/* Members Preview */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-[#555]" />
            <span className="text-[11px] text-[#555] font-mono">
              {team.member_count} member{team.member_count !== 1 ? "s" : ""}
            </span>
          </div>
          {!isOwner && (
            <button
              onClick={handleLeave}
              className={`text-[10px] font-mono px-2 py-1 border rounded-none transition-all duration-200 cursor-pointer ${showLeaveConfirm
                  ? "bg-red-500/10 text-red-400 border-red-500/30"
                  : "text-[#555] border-[#1f1f1f] hover:border-red-500/50 hover:text-red-400"
                }`}
            >
              {showLeaveConfirm ? "Confirm" : "Leave"}
            </button>
          )}
        </div>

        {/* Go to Project */}
        <Link to={`/dashboard`} state={{ projectId: team.id }}>
          <button
            className={`w-full flex items-center justify-center gap-2 py-2.5 text-xs font-medium font-sans border rounded-none transition-all duration-200 cursor-pointer ${isHovered
                ? "border-[#e8ff47] bg-[#e8ff47] text-black"
                : "border-[#1f1f1f] bg-transparent text-[#888] hover:text-white hover:border-[#333]"
              }`}
          >
            View Project
            <ExternalLink size={12} />
          </button>
        </Link>
      </div>
    </motion.div>
  );
}

export default function TeamsPage() {
  const user = useAuthStore((s) => s.user);
  const { teamProjects, loading, leaveProject } = useTeamProjects();

  const handleLeaveProject = async (projectId) => {
    try {
      await leaveProject(projectId);
    } catch (error) {
      console.error("Error leaving project:", error);
      alert("Failed to leave project: " + error.message);
    }
  };

  const activeTeams = teamProjects.filter(t => t.status === 'open');
  const closedTeams = teamProjects.filter(t => t.status === 'closed');

  return (
    <div className="min-h-screen bg-[#040404] text-white font-sans">
      <NoiseOverlay />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto pt-12 px-6 pb-20 relative z-10">
        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="text-[#666] font-mono text-sm">Loading your teams...</div>
            </div>
          </div>
        ) : teamProjects.length === 0 ? (
          /* ─────────── EMPTY STATE ─────────── */
          <motion.div
            key="empty-state"
            variants={emptyVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex items-center justify-center min-h-[60vh]"
          >
            <div className="border-2 border-dashed border-[#1f1f1f] bg-[#0a0a0a]/50 p-12 flex flex-col items-center text-center max-w-2xl mx-auto rounded-none">
              <div className="flex items-center justify-center w-20 h-20 border border-[#1f1f1f] bg-[#040404] rounded-none mb-6">
                <Users size={48} className="text-[#333333]" />
              </div>

              <h2 className="text-xl font-bold text-white tracking-tight font-sans">
                You haven't joined any teams yet.
              </h2>

              <p className="text-[#888888] text-sm mt-2 max-w-md leading-relaxed font-sans">
                Discover projects looking for your specific skills or start
                your own to build a squad.
              </p>

              {/* CTA Buttons */}
              <div className="flex items-center gap-4 mt-8">
                <Link to="/opportunities">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 bg-[#e8ff47] text-black px-6 py-3 text-sm font-bold rounded-none transition-all duration-200 hover:brightness-110 cursor-pointer"
                  >
                    Explore Opportunities
                    <ArrowRight size={14} />
                  </motion.button>
                </Link>

                <Link to="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 border border-[#1f1f1f] bg-transparent text-white px-6 py-3 text-sm font-medium rounded-none transition-all duration-200 hover:border-[#333] cursor-pointer"
                  >
                    <Plus size={14} />
                    Create a Project
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ─────────── POPULATED STATE ─────────── */
          <motion.div
            key="populated-state"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <motion.div variants={cardVariants} className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-white font-sans">
                Your Teams
              </h1>
              <p className="text-[#888] text-sm mt-2 font-mono">
                {activeTeams.length} active team{activeTeams.length !== 1 ? "s" : ""}
                {closedTeams.length > 0 && ` · ${closedTeams.length} closed`}
              </p>
            </motion.div>

            {/* Active Teams Grid */}
            {activeTeams.length > 0 && (
              <div className="mb-8">
                <h2 className="text-sm font-mono text-[#666] mb-4 uppercase tracking-wider">Active Teams</h2>
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {activeTeams.map((team, index) => (
                    <TeamCard
                      key={team.id}
                      team={team}
                      index={index}
                      onLeave={handleLeaveProject}
                    />
                  ))}
                </motion.div>
              </div>
            )}

            {/* Closed Teams Grid */}
            {closedTeams.length > 0 && (
              <div>
                <h2 className="text-sm font-mono text-[#666] mb-4 uppercase tracking-wider">Closed Teams</h2>
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {closedTeams.map((team, index) => (
                    <TeamCard
                      key={team.id}
                      team={team}
                      index={index}
                      onLeave={handleLeaveProject}
                    />
                  ))}
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
