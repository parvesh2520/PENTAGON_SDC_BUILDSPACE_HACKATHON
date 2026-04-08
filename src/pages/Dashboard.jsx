import { useState, useMemo, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Plus, Search, ChevronDown, X, Compass, Bookmark, User, TrendingUp, Users, ExternalLink, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"
import { useBookmarks } from "../hooks/useBookmarks"
import { useProjects } from "../hooks/useProjects"
import { useJoinRequests } from "../hooks/useJoinRequests"
import useAuthStore from "../store/authStore"

// --- Constants ---
const availableTech = ["React", "Next.js", "TypeScript", "Python", "Node.js", "Rust", "Go", "PostgreSQL", "MongoDB", "GraphQL", "TailwindCSS", "Docker"]

const topSkills = [
  { name: "React", count: 124 },
  { name: "TypeScript", count: 98 },
  { name: "Python", count: 86 },
  { name: "Rust", count: 42 },
  { name: "Go", count: 35 },
]

// --- Left Navigation Sidebar ---
function LeftSidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'projects', label: 'Explore', icon: <Compass className="w-4 h-4" /> },
    { id: 'bookmarks', label: 'Bookmarks', icon: <Bookmark className="w-4 h-4" /> },
    { id: 'my-projects', label: 'My Projects', icon: <User className="w-4 h-4" /> },
  ]

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="mb-6 px-4">
        <h2 className="text-[#888] font-mono text-xs uppercase tracking-widest">Workspace</h2>
      </div>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`
            flex items-center justify-between px-4 py-3 rounded-none font-mono text-sm transition-all duration-200 cursor-pointer
            ${activeTab === tab.id
              ? "bg-[#e8ff47]/10 text-[#e8ff47] border-l-2 border-[#e8ff47]"
              : "text-[#666] hover:text-white hover:bg-white/5 border-l-2 border-transparent"
            }
          `}
        >
          <div className="flex items-center gap-3">
            {tab.icon}
            {tab.label}
          </div>
          {tab.count > 0 && (
            <span className="text-xs bg-[#1f1f1f] px-2 py-0.5 rounded-full">
              {tab.count}
            </span>
          )}
        </button>
      ))}
      <div className="mt-auto px-4 py-4">
        <div className="p-4 bg-[#0a0a0a] border border-[#1f1f1f] rounded-none">
          <p className="text-xs text-[#666] font-mono">
            // Connected as<br />
            <span className="text-[#e8ff47]">{"{ currentUser }"}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

// --- Right Profile Context Sidebars ---
function FeedRightSidebar() {
  return (
    <div className="p-6">
      <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-[#e8ff47]" />
        Trending Tech
      </h3>
      <div className="space-y-4">
        {topSkills.map((skill, i) => (
          <div key={i} className="flex items-center justify-between group cursor-pointer">
            <span className="text-sm font-mono text-[#888] group-hover:text-white transition-colors">{skill.name}</span>
            <span className="text-xs font-mono bg-[#111] px-2 py-1 text-[#e8ff47] border border-[#1f1f1f]">
              {skill.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProjectRightSidebar({ project, onSendJoinRequest, hasRequested, getRequestStatus, user }) {
  const [isRequesting, setIsRequesting] = useState(false)
  const navigate = useNavigate()
  const isClosed = project?.status === "closed"
  const isOwner = user && project?.owner_id === user.id
  const requestStatus = getRequestStatus?.(project?.id)
  const alreadyRequested = hasRequested?.(project?.id) || requestStatus === 'accepted'

  const handleJoinTeam = async () => {
    if (!user) {
      navigate("/auth")
      return
    }
    if (isOwner || alreadyRequested || isClosed) return

    setIsRequesting(true)
    await onSendJoinRequest(project.id, project.owner_id, project.title)
    setIsRequesting(false)
  }

  const getButtonLabel = () => {
    if (isOwner) return "Your Project"
    if (requestStatus === 'accepted') return "Accepted ✓"
    if (requestStatus === 'declined') return "Declined"
    if (alreadyRequested) return "Request Sent ✓"
    if (isClosed) return "Team Closed"
    return "Request to Join"
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-[#1f1f1f]">
        <button
          onClick={handleJoinTeam}
          disabled={isClosed || isRequesting || alreadyRequested || isOwner}
          className={`
            w-full px-4 py-3 font-mono text-sm font-bold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 rounded-none
            ${isClosed || isOwner
              ? "bg-[#111] text-[#444] cursor-not-allowed border border-[#1f1f1f]"
              : alreadyRequested || requestStatus === 'accepted'
                ? "bg-[#e8ff47]/10 text-[#e8ff47] border border-[#e8ff47]/30"
                : requestStatus === 'declined'
                  ? "bg-red-500/10 text-red-400 border border-red-500/30 cursor-not-allowed"
                  : "bg-[#e8ff47] text-black hover:shadow-[0_0_20px_rgba(232,255,71,0.3)]"
            }
          `}
        >
          {isRequesting ? (
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>⟳</motion.span>
          ) : (
            getButtonLabel()
          )}
        </button>
      </div>

      <div className="p-6 overflow-y-auto flex-1">
        <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
          <Users className="w-4 h-4 text-[#e8ff47]" />
          Project Info
        </h3>

        <div className="space-y-4">
          <div className="p-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded-none">
            <p className="text-[10px] uppercase font-mono text-[#666] mb-1">Tech Stack</p>
            <div className="flex flex-wrap gap-1">
              {(project?.tech_stack || project?.techStack || []).map((t, i) => (
                <span key={i} className="px-2 py-0.5 text-[10px] font-mono bg-[#111] text-[#999] border border-[#1f1f1f]">{t}</span>
              ))}
            </div>
          </div>
          <div className="p-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded-none">
            <p className="text-[10px] uppercase font-mono text-[#666] mb-1">Status</p>
            <span className={`text-xs font-mono ${project?.status === 'open' ? 'text-[#e8ff47]' : 'text-[#555]'}`}>{project?.status?.toUpperCase()}</span>
          </div>
          {project?.repo_url && (
            <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-3 bg-[#0a0a0a] border border-[#1f1f1f] rounded-none text-sm font-mono text-[#888] hover:text-[#e8ff47] hover:border-[#e8ff47]/30 transition-colors">
              <ExternalLink className="w-4 h-4" />
              View Repository
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// 3D Tilt Card Component
function TiltCard({ children, className = "" }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={`group relative ${className}`}
    >
      <div
        style={{
          transform: "translateZ(50px)",
          transformStyle: "preserve-3d",
        }}
        className="h-full transition-shadow duration-300 group-hover:shadow-[0_5px_30px_rgba(232,255,71,0.08)]"
      >
        {children}
      </div>
    </motion.div>
  )
}

// --- Center Active Views ---
function ProjectCard({ project, onClick, index, isBookmarked, onToggleBookmark }) {
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = (e) => {
    // If the user clicked on the bookmark button area, toggle bookmark
    if (e.target.closest('[data-bookmark-btn]')) {
      onToggleBookmark(project.id)
      return
    }
    // Otherwise open project info
    onClick(project.id)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      className={`
        relative group cursor-pointer bg-[#0a0a0a] p-5 border rounded-none transition-all duration-300
        hover:shadow-[0_5px_30px_rgba(232,255,71,0.08)]
        ${isHovered ? "border-[#e8ff47]/50 shadow-[0_0_20px_rgba(232,255,71,0.05)]" : "border-[#1f1f1f]"}
      `}
    >
      {/* Bookmark Button */}
      <div className="absolute top-3 right-3 flex gap-2 items-center">
        <div
          data-bookmark-btn="true"
          className={`p-2.5 rounded-none border transition-all duration-200 hover:scale-110 cursor-pointer ${isBookmarked
            ? "border-[#e8ff47] bg-[#e8ff47]/10 text-[#e8ff47]"
            : "border-[#333] bg-[#0a0a0a] text-[#666] hover:border-[#e8ff47]/50 hover:text-[#e8ff47]"
            }`}
        >
          <Bookmark
            size={16}
            className={`pointer-events-none transition-all duration-200 ${isBookmarked ? 'fill-current' : ''}`}
          />
        </div>
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest ${project.status === "open" ? "text-[#e8ff47]" : "text-[#555]"}`}>
          {project.status}
        </span>
      </div>

      <h3 className="text-lg font-bold text-white mb-2 font-mono group-hover:text-[#e8ff47] transition-colors pr-16">{project.title}</h3>
      <p className="text-sm text-[#777] mb-4 line-clamp-2 h-10">{project.description}</p>
      <div className="flex flex-wrap gap-2 mt-auto">
        {(project.tech_stack || project.techStack || []).map((tech) => (
          <span key={tech} className="px-2 py-1 bg-[#111] text-[#999] border border-[#1f1f1f] font-mono text-[10px] uppercase">{tech}</span>
        ))}
      </div>
    </motion.div>
  )
}

function FeedCenterView({ projects, myProjectsList, searchQuery, setSearchQuery, selectedTech, setSelectedTech, statusFilter, setStatusFilter, onProjectClick, setIsModalOpen, activeTab, bookmarkedIds, onToggleBookmark, user }) {
  const [isTechOpen, setIsTechOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  const toggleTech = (tech) => {
    if (selectedTech.includes(tech)) { setSelectedTech(selectedTech.filter((t) => t !== tech)) }
    else { setSelectedTech([...selectedTech, tech]) }
  }

  // Get projects based on active tab
  const getDisplayProjects = () => {
    if (activeTab === 'my-projects') {
      return myProjectsList || []
    }
    if (activeTab === 'bookmarks') {
      return projects.filter(p => bookmarkedIds.includes(p.id))
    }
    return projects // 'projects' tab (Explore)
  }

  const displayProjects = getDisplayProjects()

  const getTitle = () => {
    if (activeTab === 'my-projects') return { main: 'My', highlight: 'Projects' }
    if (activeTab === 'bookmarks') return { main: 'Saved', highlight: 'Bookmarks' }
    return { main: 'Explore', highlight: 'Projects' }
  }

  const title = getTitle()

  return (
    <motion.div
      key="feed"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 overflow-y-auto p-6 lg:p-10 scrollbar-hide"
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white font-mono tracking-tight">
          {title.main} <span className="text-[#e8ff47]">{title.highlight}</span>
        </h1>
        <button
          onClick={() => {
            if (!user) { navigate("/auth"); return }
            setIsModalOpen(true)
          }}
          className="flex items-center gap-2 bg-[#e8ff47] text-black font-bold hover:bg-[#e8ff47]/90 cursor-pointer font-mono text-sm px-4 py-2 rounded-none"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Project</span>
        </button>
      </div>

      <div className="w-full border border-[#1f1f1f] bg-[#0a0a0a]/50 p-4 mb-8 rounded-none">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#e8ff47] font-mono text-sm">{">"}</div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="find_project..."
              className="w-full bg-[#040404] border border-[#1f1f1f] pl-8 pr-10 py-2.5 text-sm font-mono text-white placeholder:text-[#555] focus:outline-none focus:border-[#e8ff47] transition-all rounded-none"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsTechOpen(!isTechOpen)}
              className="flex items-center cursor-pointer gap-2 bg-[#040404] border border-[#1f1f1f] px-4 py-2.5 text-sm font-mono text-white hover:border-[#e8ff47]/50 min-w-[160px] justify-between rounded-none"
            >
              <span className="text-[#888]">tech:</span>
              <span className="text-[#e8ff47]">{selectedTech.length > 0 ? `[${selectedTech.length}]` : "all"}</span>
              <ChevronDown className={`w-4 h-4 text-[#888] transition-transform ${isTechOpen ? "rotate-180" : ""}`} />
            </button>
            {isTechOpen && (
              <div className="absolute top-full right-0 lg:left-0 mt-2 w-64 bg-[#0a0a0a] border border-[#1f1f1f] shadow-2xl z-50 rounded-none">
                <div className="max-h-64 overflow-y-auto p-2">
                  {availableTech.map((tech) => (
                    <button key={tech} onClick={() => toggleTech(tech)} className={`w-full text-left px-3 py-2 cursor-pointer font-mono text-sm transition-colors rounded-none ${selectedTech.includes(tech) ? "bg-[#e8ff47]/10 text-[#e8ff47]" : "text-[#aaa] hover:bg-[#111]"}`}>
                      {tech}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex bg-[#040404] border border-[#1f1f1f] p-1 rounded-none">
            {["all", "open", "closed"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`font-mono text-xs px-4 py-2 cursor-pointer transition-colors rounded-none ${statusFilter === status ? "bg-[#e8ff47] text-black font-bold" : "text-[#888] hover:text-white"}`}
              >
                {status.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
        <AnimatePresence>
          {displayProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onClick={onProjectClick}
              isBookmarked={bookmarkedIds.includes(project.id)}
              onToggleBookmark={onToggleBookmark}
            />
          ))}
        </AnimatePresence>
        {displayProjects.length === 0 && (
          <div className="col-span-full py-20 text-center border border-[#1f1f1f] bg-[#0a0a0a] rounded-none">
            <p className="text-[#666] font-mono">
              {activeTab === 'bookmarks' ? 'No bookmarked projects yet.' :
                activeTab === 'my-projects' ? 'You haven\'t created any projects yet.' :
                  'No projects found matching criteria.'}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function ProjectDetailCenterView({ project, onBack, user, incomingRequests, updateRequest, refetchRequests }) {
  if (!project) return null

  const isOwner = user?.id === project.owner_id
  const projectRequests = isOwner
    ? (incomingRequests || []).filter((r) => r.project_id === project.id && r.status === "pending")
    : []

  const handleAccept = async (req) => {
    await updateRequest(req.id, "accepted")
    // Note: project_members insert is now handled inside updateRequest hook
    refetchRequests?.()
  }

  const handleDecline = async (req) => {
    await updateRequest(req.id, "declined")
    // Notify the requester
    const projTitle = req.projects?.title || "the project"
    await supabase.from("notifications").insert({
      user_id: req.requester_id,
      type: "join_request",
      message: `Your request to join "${projTitle}" was declined.`,
      ref_id: req.project_id,
      read: false,
    })
    refetchRequests?.()
  }

  return (
    <motion.div
      key="detail"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 20, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute inset-0 overflow-y-auto p-6 lg:p-10 scrollbar-hide bg-[#040404]"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#888] hover:text-white font-mono text-sm mb-8 transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        back_to_feed
      </button>

      <div className="border border-[#1f1f1f] bg-[#0a0a0a] p-8 md:p-12 mb-8 rounded-none relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-[#e8ff47]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <div className="flex items-start justify-between flex-wrap gap-4 mb-6 relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white font-mono tracking-tight">{project.title}</h1>
          <span className={`px-3 py-1 text-xs font-mono font-bold uppercase border rounded-none ${project.status === 'open' ? 'border-[#e8ff47]/30 text-[#e8ff47] bg-[#e8ff47]/10' : 'border-[#444] text-[#888] bg-[#111]'}`}>
            {project.status}
          </span>
        </div>

        <p className="text-[#aaa] text-base md:text-lg leading-relaxed mb-8 max-w-3xl relative z-10">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-8 relative z-10">
          {(project.tech_stack || project.techStack || []).map((tech) => (
            <span key={tech} className="px-3 py-1.5 bg-[#111] text-[#ccc] border border-[#1f1f1f] font-mono text-xs uppercase rounded-none tracking-wider">
              {tech}
            </span>
          ))}
        </div>

        {project.repo_url && (
          <a
            href={project.repo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-mono font-bold text-black bg-[#e8ff47] hover:bg-white transition-colors cursor-pointer rounded-none relative z-10"
          >
            <ExternalLink className="w-4 h-4 text-black" />
            View Repository
          </a>
        )}
      </div>

      <div className="border border-[#1f1f1f] bg-[#0a0a0a] rounded-none p-8">
        <h2 className="text-xl font-bold font-mono text-white mb-4 border-b border-[#1f1f1f] pb-4">Project Overview</h2>
        <div className="text-[#888] leading-relaxed space-y-4 text-sm">
          <p>
            This project provides a unique opportunity to collaborate with dedicated developers.
            By joining, you will be expected to contribute to the core features and participate in code reviews.
          </p>
          <p>
            Whether you specialize in frontend UI, backend architecture, or DevOps, there is a place for your expertise.
            The owner is looking for dynamic individuals ready to push boundaries and build secure, performant software.
          </p>
          <div className="mt-6 p-4 border-l-4 border-[#e8ff47] bg-[#e8ff47]/5">
            <p className="font-mono text-[#e8ff47]">System Note: Full documentation and contributing guidelines are distributed internally to approved members.</p>
          </div>
        </div>
      </div>

      {/* PENDING REQUESTS — only for project owner */}
      {isOwner && (
        <div className="border border-[#1f1f1f] bg-[#0a0a0a] rounded-none p-8">
          <h2 className="text-xl font-bold font-mono text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#e8ff47]" />
            Pending Requests
            {projectRequests.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs font-mono bg-[#e8ff47]/10 text-[#e8ff47] border border-[#e8ff47]/20 rounded-none">
                {projectRequests.length}
              </span>
            )}
          </h2>

          {projectRequests.length === 0 ? (
            <p className="text-sm text-[#555] font-mono">No pending requests.</p>
          ) : (
            <div className="space-y-3">
              {projectRequests.map((req) => {
                const profile = req.requester_profile || {}
                const initials = (profile.display_name || profile.username || "U")
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)

                return (
                  <div key={req.id} className="flex items-center justify-between gap-4 p-4 bg-[#040404] border border-[#1f1f1f] rounded-none">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#1f1f1f] flex items-center justify-center text-xs font-mono text-[#e8ff47] rounded-none flex-shrink-0">
                        {initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {profile.display_name || profile.username || "Unknown User"}
                        </p>
                        <p className="text-xs text-[#555] font-mono">wants to join</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleDecline(req)}
                        className="px-3 py-1.5 text-xs font-mono text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors cursor-pointer rounded-none"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleAccept(req)}
                        className="px-3 py-1.5 text-xs font-mono text-black bg-[#e8ff47] hover:bg-[#d4e83e] font-bold transition-colors cursor-pointer rounded-none"
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

    </motion.div>
  )
}

function CreateProjectModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedTech, setSelectedTech] = useState([])
  const [githubUrl, setGithubUrl] = useState("")
  const [currentLine, setCurrentLine] = useState(0)

  const toggleTech = (tech) => {
    if (selectedTech.includes(tech)) {
      setSelectedTech(selectedTech.filter((t) => t !== tech))
    } else {
      setSelectedTech([...selectedTech, tech])
    }
  }

  const handleSubmit = () => {
    if (name && description) {
      onSubmit({ name, description, techStack: selectedTech, githubUrl })
      setName("")
      setDescription("")
      setSelectedTech([])
      setGithubUrl("")
      onClose()
    }
  }

  const lines = [
    { label: "project_name", value: name, active: currentLine === 0 },
    { label: "description", value: description, active: currentLine === 1 },
    { label: "tech_stack", value: `[${selectedTech.join(", ")}]`, active: currentLine === 2 },
    { label: "github_url", value: githubUrl || "optional", active: currentLine === 3 },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", duration: 0.5 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-[70] px-4">
            <div className="bg-[#040404] border border-[#1f1f1f] rounded-none shadow-2xl">
              <div className="flex items-center justify-between px-4 py-3 bg-[#0a0a0a] border-b border-[#1f1f1f]">
                <div className="w-3" /> {/* Spacer for balance */}
                <span className="text-xs font-mono text-[#666]">buildspace://new_project</span>
                <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer" title="Close" />
              </div>
              <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-[#666] mb-2">{">"} project_name <span className="text-red-500">*</span></label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} onFocus={() => setCurrentLine(0)} placeholder="Enter project name..." className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-none px-4 py-2.5 text-sm font-mono text-white focus:border-[#e8ff47] transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#666] mb-2">{">"} description <span className="text-red-500">*</span></label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} onFocus={() => setCurrentLine(1)} placeholder="Describe..." rows={3} className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-none px-4 py-2.5 text-sm font-mono text-white focus:border-[#e8ff47] transition-all resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#666] mb-2">{">"} tech_stack</label>
                    <div className="flex flex-wrap gap-2" onFocus={() => setCurrentLine(2)} tabIndex={0}>
                      {availableTech.map((tech) => (
                        <button key={tech} onClick={(e) => { e.preventDefault(); toggleTech(tech) }} className={`px-3 py-1.5 rounded-none text-xs font-mono cursor-pointer ${selectedTech.includes(tech) ? "bg-[#e8ff47] text-black" : "text-[#666] hover:text-white border border-[#1f1f1f]"}`}>{tech}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1f1f1f]">
                  <button onClick={onClose} className="font-mono text-sm px-4 py-2 text-[#666] cursor-pointer hover:text-white">cancel</button>
                  <button onClick={handleSubmit} disabled={!name || !description} className="font-mono text-sm px-4 py-2 bg-[#e8ff47] text-black disabled:opacity-50 cursor-pointer rounded-none">{">"} create_project</button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// --- MAIN WORKSPACE PAGE ---
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("projects")
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTech, setSelectedTech] = useState([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Auth
  const user = useAuthStore((s) => s.user)

  // Projects — Supabase-backed
  const { projects: allProjects, myProjects: myProjectsList, createProject } = useProjects()

  // Join Requests — Supabase-backed
  const { sendJoinRequest, hasRequested, getRequestStatus, incomingRequests, updateRequest, refetch: refetchRequests } = useJoinRequests()

  // Bookmarks — syncs with Supabase when logged in, localStorage otherwise
  const { bookmarkedIds, toggleBookmark: handleToggleBookmark } = useBookmarks()

  // Derive the active project object if any
  const activeProjectPayload = useMemo(() => {
    if (!activeProjectId) return null;
    return allProjects.find(p => p.id === activeProjectId) || null;
  }, [activeProjectId, allProjects])

  // Normalize tech_stack field name for filtering
  const getTechStack = (p) => p.tech_stack || p.techStack || []

  // Filter projects for feed
  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      const matchS = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchT = selectedTech.length === 0 || selectedTech.some((t) => getTechStack(p).includes(t))
      const matchF = statusFilter === "all" || p.status === statusFilter
      return matchS && matchT && matchF
    })
  }, [allProjects, searchQuery, selectedTech, statusFilter])

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#040404] text-white flex overflow-hidden">

      {/* 1. Left Sidebar Navigation */}
      <div className="hidden md:block w-64 shrink-0 border-r border-[#1f1f1f] bg-[#070707] z-20 shadow-xl shadow-black relative">
        <LeftSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      {/* 2. Center Dynamic Content Wrapper */}
      <div className="flex-1 relative bg-[#040404] overflow-hidden">
        <AnimatePresence mode="wait">
          {!activeProjectId ? (
            <FeedCenterView
              key={`feed-center-${activeTab}`}
              projects={filteredProjects}
              myProjectsList={myProjectsList}
              searchQuery={searchQuery} setSearchQuery={setSearchQuery}
              selectedTech={selectedTech} setSelectedTech={setSelectedTech}
              statusFilter={statusFilter} setStatusFilter={setStatusFilter}
              onProjectClick={setActiveProjectId}
              setIsModalOpen={setIsModalOpen}
              activeTab={activeTab}
              bookmarkedIds={bookmarkedIds}
              onToggleBookmark={handleToggleBookmark}
              user={user}
            />
          ) : (
            <ProjectDetailCenterView
              key="detail-center"
              project={activeProjectPayload}
              onBack={() => setActiveProjectId(null)}
              user={user}
              incomingRequests={incomingRequests}
              updateRequest={updateRequest}
              refetchRequests={refetchRequests}
            />
          )}
        </AnimatePresence>
      </div>

      {/* 3. Right Contextual Sidebar */}
      <div className="hidden xl:block w-80 shrink-0 border-l border-[#1f1f1f] bg-[#070707] z-20 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {!activeProjectId ? (
            <motion.div
              key="feed-right"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <FeedRightSidebar />
            </motion.div>
          ) : (
            <motion.div
              key="project-right"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <ProjectRightSidebar
                project={activeProjectPayload}
                onSendJoinRequest={sendJoinRequest}
                hasRequested={hasRequested}
                getRequestStatus={getRequestStatus}
                user={user}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(newP) => {
          createProject({
            title: newP.name,
            description: newP.description,
            techStack: newP.techStack,
            repoUrl: newP.githubUrl,
          })
        }}
      />
    </div>
  )
}
