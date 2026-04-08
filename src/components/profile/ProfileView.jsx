import React, { useRef, useState } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { MapPin, Calendar, ExternalLink, GitBranch, Star, Check, Copy, Globe, FolderGit2, Pencil, Share2, Terminal, Plus } from "lucide-react"
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi"
import ProjectCard from "./ProjectCard"

const cn = (...classes) => classes.filter(Boolean).join(" ")

const SKILL_THEMES = {
  // Greenish theme (Frontend/Modern)
  TypeScript: "text-[#cddc39] border-[#cddc39]/30 bg-[#cddc39]/5",
  React: "text-[#cddc39] border-[#cddc39]/30 bg-[#cddc39]/5",
  "Next.js": "text-[#cddc39] border-[#cddc39]/30 bg-[#cddc39]/5",
  JavaScript: "text-[#cddc39] border-[#cddc39]/30 bg-[#cddc39]/5",
  TailwindCSS: "text-[#cddc39] border-[#cddc39]/30 bg-[#cddc39]/5",
  
  // Purple theme (Backend/Runtime)
  "Node.js": "text-[#9c27b0] border-[#9c27b0]/30 bg-[#9c27b0]/5",
  GraphQL: "text-[#9c27b0] border-[#9c27b0]/30 bg-[#9c27b0]/5",
  Supabase: "text-[#9c27b0] border-[#9c27b0]/30 bg-[#9c27b0]/5",
  Prisma: "text-[#9c27b0] border-[#9c27b0]/30 bg-[#9c27b0]/5",
  
  // Blue theme (Database/Infra)
  PostgreSQL: "text-[#3f51b5] border-[#3f51b5]/30 bg-[#3f51b5]/5",
  Docker: "text-[#3f51b5] border-[#3f51b5]/30 bg-[#3f51b5]/5",
  AWS: "text-[#3f51b5] border-[#3f51b5]/30 bg-[#3f51b5]/5",
  
  // Cyan/Cool theme (Systems/Performance)
  Rust: "text-[#00bcd4] border-[#00bcd4]/30 bg-[#00bcd4]/5",
  WebGL: "text-[#00bcd4] border-[#00bcd4]/30 bg-[#00bcd4]/5",
  Go: "text-[#00bcd4] border-[#00bcd4]/30 bg-[#00bcd4]/5",

  default: "text-[#888] border-[#333] bg-[#111]"
}

function BentoCard({ children, className, delay = 0 }) {
  const cardRef = useRef(null)
  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "relative overflow-hidden border border-[#1f1f1f] bg-[#0a0a0a] rounded-none shadow-2xl",
        className
      )}
    >
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  )
}

const GhostButton = ({ children, onClick, icon: Icon, className }) => (
  <button
    onClick={onClick}
    className={cn(
      "px-4 py-2 bg-transparent border border-[#1f1f1f] text-[#888] hover:text-[#e8ff47] hover:border-[#e8ff47]/30 font-mono text-xs uppercase transition-all rounded-none flex items-center gap-2 group",
      className
    )}
  >
    {Icon && <Icon size={12} className="group-hover:scale-110 transition-transform" />}
    {children}
  </button>
)

export default function ProfileView({ userData, isOwn, onEdit }) {
  const { profile, skills, connect, stats, projects } = userData
  const [copied, setCopied] = useState(false)

  const copyProfileLink = async () => {
    const url = window.location.href
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const hasSkills = Object.values(skills?.categorized || {}).some(arr => arr.length > 0)
  const allSkills = Object.values(skills?.categorized || {}).flat()

  return (
    <div className="min-h-screen bg-[#040404] text-white selection:bg-[#e8ff47] selection:text-black font-sans pb-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* PROFILE CARD - Spans 2 rows on desktop */}
          <BentoCard className="lg:col-span-7 p-8 lg:p-10" delay={0.1}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold tracking-tight">Profile</h2>
                {isOwn && (
                  <button 
                    onClick={() => onEdit("profile")}
                    className="flex items-center gap-2 text-[10px] font-mono text-[#444] hover:text-[#e8ff47] transition-colors uppercase tracking-widest group"
                  >
                    <Pencil size={12} className="group-hover:rotate-12 transition-transform" />
                    edit_registry
                  </button>
                )}
            </div>

            <div className="flex items-start gap-8 mb-10">
              <div className="relative shrink-0">
                <div className="w-32 h-32 bg-[#050505] border border-[#1f1f1f] overflow-hidden group">
                  <img 
                    src={profile.avatarUrl || "/default-avatar.png"} 
                    alt={profile.name} 
                    className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700" 
                  />
                  {profile.isLive && (
                    <div className="absolute bottom-2 right-2 bg-black border border-[#e8ff47]/40 px-2 py-0.5 flex items-center gap-1.5 shadow-2xl">
                      <span className="relative flex size-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e8ff47] opacity-75" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-[#e8ff47]" />
                      </span>
                      <span className="text-[9px] font-bold text-[#e8ff47]">LIVE</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h1 className="text-4xl font-bold tracking-tighter text-white mb-2">{profile.name}</h1>
                <p className="text-sm font-mono text-[#444]">@{profile.handle}</p>
              </div>
            </div>

            <div className="mb-10 group relative">
              <div className="flex items-center gap-1.5 mb-2 opacity-30 group-hover:opacity-100 transition-opacity">
                <Terminal size={10} className="text-[#888]" />
                <span className="text-[8px] font-mono tracking-[0.3em] uppercase text-[#888]">registry_manifest.json</span>
              </div>
              <pre className="bg-[#050505] border border-[#1f1f1f] p-6 font-mono text-[13px] overflow-x-auto rounded-none leading-relaxed relative">
                <code className="block">
                  <span className="text-[#888]">{"{"}</span>
                  <div className="pl-4">
                    <span className="text-[#888]">"status":</span> <span className="text-white">"{profile.status || "CORE_DEVELOPER"}"</span><span className="text-[#888]">,</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-[#888]">"bio":</span> <span className="text-white">"{profile.bio || "PASSONATE_BUILDER"}"</span><span className="text-[#888]">,</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-[#888]">"location":</span> <span className="text-white">"{profile.location || "REMOTE_GRID"}"</span><span className="text-[#888]">,</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-[#888]">"focus":</span> <span className="text-[#888]">[</span>
                    {allSkills.slice(0, 3).map((s, i, arr) => (
                      <React.Fragment key={s}>
                        <span className="text-white">"{s}"</span>
                        {i < arr.length - 1 && <span className="text-[#888]">, </span>}
                      </React.Fragment>
                    ))}
                    <span className="text-[#888]">]</span>
                  </div>
                  <span className="text-[#888]">{"}"}</span>
                  <span className="text-[#e8ff47] animate-pulse ml-0.5">_</span>
                </code>
              </pre>
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-auto text-xs text-[#444]">
              <div className="flex items-center gap-2">
                <MapPin size={14} />
                <span className={cn(!profile.location && "opacity-40 font-mono text-[10px]")}>
                  {profile.location || "COORDINATES_UNKNOWN"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>Joined {profile.joinDate}</span>
              </div>
            </div>
          </BentoCard>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-5">
            {/* SKILLS CARD */}
            <BentoCard className="p-8" delay={0.2}>
              <div className="flex items-center justify-between mb-8">
                <div className="bg-[#e8ff47] px-3 py-1 font-mono text-[10px] font-bold text-black border border-[#e8ff47]">
                  TECHNICAL_SKILLS_V1.0
                </div>
                {isOwn && (
                  <button 
                    onClick={() => onEdit("skills")} 
                    className="text-[#666] hover:text-[#e8ff47] transition-colors flex items-center gap-1 group"
                  >
                    <span className="text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">Edit_Arsenal</span>
                    <Pencil size={14} />
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {allSkills.length > 0 ? (
                  allSkills.map(skill => (
                    <span 
                      key={skill} 
                      className={cn(
                        "px-3 py-1 text-[10px] font-mono border rounded-none uppercase transition-colors",
                        SKILL_THEMES[skill] || SKILL_THEMES.default
                      )}
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <div className="space-y-4 w-full">
                    <p className="text-[10px] font-mono text-[#888] uppercase tracking-[0.2em] animate-pulse">
                      // [ WARNING ]: NO_ARSENAL_DATA_DETECTED
                    </p>
                    <div className="flex gap-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-6 w-16 border border-[#1f1f1f] bg-white/[0.02]" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </BentoCard>

            {/* LOWER RIGHT ROW: CONNECT & STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* CONNECT CARD */}
              <BentoCard className="p-8" delay={0.3}>
                <div className="flex items-center justify-between mb-8">
                  <div className="bg-white/5 border border-white/10 px-3 py-1 font-mono text-[10px] text-[#888] tracking-widest">
                    CONNECT_PROTOCOLS
                  </div>
                  {isOwn && (
                    <button 
                      onClick={() => onEdit("connect")} 
                      className="text-[#444] hover:text-[#e8ff47] transition-colors font-mono text-[10px] border border-transparent hover:border-[#e8ff47]/20 px-2 py-0.5"
                    >
                      EDIT
                    </button>
                  )}
                </div>
                <div className="space-y-6">
                  <button
                    onClick={copyProfileLink}
                    className="flex items-center justify-center gap-2 w-full h-11 bg-[#e8ff47] text-black text-[11px] font-bold uppercase transition-transform active:scale-95"
                  >
                    <Share2 size={14} />
                    <span>Share Profile</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {[
                      { icon: FiGithub, href: connect.githubUrl },
                      { icon: FiLinkedin, href: connect.linkedinUrl },
                      { icon: FiTwitter, href: connect.twitterUrl },
                      { icon: Globe, href: connect.websiteUrl },
                    ].map(({ icon: Icon, href }, i) => (
                      <a 
                        key={i}
                        href={href || "#"}
                        target={href ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className={cn(
                          "flex-1 aspect-square border border-[#1f1f1f] bg-[#050505] flex items-center justify-center transition-all",
                          href 
                            ? "text-[#444] hover:text-[#e8ff47] hover:border-[#e8ff47]/30 cursor-pointer" 
                            : "text-[#222] opacity-20 cursor-not-allowed"
                        )}
                      >
                        <Icon size={16} />
                      </a>
                    ))}
                  </div>
                </div>
              </BentoCard>

              {/* STATS CARD */}
              <BentoCard className="p-8" delay={0.4}>
                <div className="flex items-center justify-between mb-8">
                  <div className="bg-white/5 border border-white/10 px-3 py-1 font-mono text-[10px] text-[#888] tracking-widest">
                    SYSTEM_METRICS
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-y-8 gap-x-4 relative">
                  {/* Subtle scanline effect for "real-time" feel */}
                  <div className="absolute inset-x-0 h-[1px] bg-[#e8ff47]/10 animate-scan pointer-events-none" />
                  
                  {[
                    { label: "Projects", value: stats.projects },
                    { label: "Commits", value: stats.commits },
                    { label: "Followers", value: stats.followers },
                    { label: "Stars", value: stats.stars },
                  ].map((stat, i) => (
                    <div key={i} className="group/stat">
                      <p className={cn(
                        "text-3xl font-bold tracking-tighter tabular-nums mb-1 transition-colors duration-500",
                        stat.value === "0" || stat.value === 0 ? "text-[#222]" : "text-[#e8ff47]"
                      )}>
                        {stat.value}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <p className="text-[9px] font-mono text-[#333] uppercase tracking-widest">{stat.label}</p>
                        {(stat.value === "0" || stat.value === 0) && (
                          <span className="text-[8px] font-mono text-[#111] animate-pulse">STANDBY</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </BentoCard>
            </div>
          </div>

          {/* PROJECTS SECTION - Full Width */}
          <div className="lg:col-span-12 mt-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight whitespace-nowrap">Projects</h2>
              <a href="#" className="text-xs text-[#666] hover:text-[#e8ff47] transition-colors flex items-center gap-2 uppercase tracking-widest">
                View all <ExternalLink size={14} />
              </a>
            </div>

            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {projects.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-[#1f1f1f] bg-[#0a0a0a]/40 p-16 flex flex-col items-center justify-center text-center group">
                <FolderGit2 size={40} className="mb-6 text-[#1a1a1a] group-hover:text-[#e8ff47]/20 transition-colors duration-700" />
                <div className="space-y-2">
                  <p className="text-[10px] font-mono text-[#444] uppercase tracking-[0.3em] animate-pulse">
                    // [ SYSTEM_ERROR ]: NO_ACTIVE_REPOSITORIES_IDENTIFIED
                  </p>
                  <p className="text-[9px] font-mono text-[#222] uppercase tracking-widest">
                    ARCHIVE_STATUS: EMPTY_SET
                  </p>
                </div>
                {isOwn && (
                  <GhostButton 
                    icon={Plus} 
                    className="mt-10 border-[#1f1f1f] hover:border-[#e8ff47]/40" 
                    onClick={() => window.location.href='/dashboard'}
                  >
                    Initialize_First_Project
                  </GhostButton>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

