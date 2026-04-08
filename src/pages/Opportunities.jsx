import { useState } from "react"
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import {
  Calendar,
  X,
  Zap,
  Briefcase,
  Plus
} from "lucide-react"
import { useOpportunities } from "../hooks/useOpportunities"
import useAuthStore from "../store/authStore"

// Noise overlay SVG
function NoiseOverlay() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.03]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  )
}

// 3D Magnetic Button Component
function MagneticButton({
  children,
  onClick,
  className = "",
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { damping: 15, stiffness: 150 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distX = e.clientX - centerX
    const distY = e.clientY - centerY

    x.set(distX * 0.3)
    y.set(distY * 0.3)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      style={{ x: xSpring, y: ySpring }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`flex items-center gap-2 bg-[#e8ff47] px-4 py-2 text-sm font-bold text-black transition-shadow hover:shadow-[0_0_20px_rgba(232,255,71,0.3)] rounded-none ${className}`}
    >
      {children}
    </motion.button>
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

function OpportunityCard({ opportunity, onView, user }) {
  const typeColors = {
    teammate: { bg: "bg-[#e8ff47]/10", text: "text-[#e8ff47]", label: "Teammate" },
    role: { bg: "bg-[#e8ff47]/10", text: "text-[#e8ff47]", label: "Open Role" },
    hackathon: { bg: "bg-[#e8ff47]/10", text: "text-[#e8ff47]", label: "Hackathon" },
  }

  const typeStyle = typeColors[opportunity.type] || { bg: "bg-[#333]", text: "text-[#666]", label: opportunity.type }
  const isClosed = opportunity.status === "closed"
  const isOwner = user && opportunity.poster_id === user.id

  // Format deadline
  const formatDate = (dateStr) => {
    if (!dateStr) return "No deadline"
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const posterName = opportunity.profiles?.display_name || opportunity.profiles?.username || "Anonymous"
  const posterAvatar = opportunity.profiles?.avatar_url

  return (
    <TiltCard className="w-full">
      <div className={`flex h-full flex-col border bg-[#0a0a0a] p-3 rounded-none ${isClosed ? "border-red-500/30 opacity-60" : "border-[#1f1f1f]"}`}>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`${typeStyle.bg} ${typeStyle.text} px-2 py-1 text-xs font-medium`}>{typeStyle.label}</span>
            {isClosed && (
              <span className="bg-red-500/10 text-red-400 px-2 py-1 text-xs font-medium border border-red-500/30">
                Closed
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {posterAvatar && (
              <img src={posterAvatar} alt={posterName} className="h-5 w-5 rounded-full object-cover" />
            )}
            <span className="text-xs text-[#666]">{posterName}</span>
          </div>
        </div>
        <h3 className="mb-2 text-sm font-medium tracking-tight text-white">{opportunity.title}</h3>
        <p className="mb-3 flex-1 text-xs leading-relaxed text-[#666]">{opportunity.description || "No description provided"}</p>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {opportunity.skills_needed && opportunity.skills_needed.length > 0 ? (
            opportunity.skills_needed.map((skill) => (
              <span key={skill} className="bg-[#111] px-2 py-1 text-xs text-[#888]">
                {skill}
              </span>
            ))
          ) : (
            <span className="text-xs text-[#444]">No specific skills required</span>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-[#1f1f1f] pt-2">
          <div className="flex items-center gap-1 text-xs text-[#555]">
            <Calendar className="h-3 w-3" />
            {formatDate(opportunity.deadline)}
          </div>
          <div className="flex items-center gap-2">
            {isOwner && (
              <span className="text-[10px] text-[#e8ff47] font-mono">Yours</span>
            )}
            <button
              onClick={() => onView(opportunity)}
              className="border border-[#1f1f1f] bg-transparent px-3 py-1 text-xs text-white transition-colors hover:border-[#e8ff47] hover:text-[#e8ff47] cursor-pointer rounded-none"
            >
              View
            </button>
          </div>
        </div>
      </div>
    </TiltCard>
  )
}

// Sample data removed - now fetching from Supabase database

function KanbanColumn({
  title,
  opportunities,
  index,
  icon: Icon,
  onViewOpportunity,
  user,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.12,
        ease: [0.23, 1, 0.32, 1],
      }}
      className="flex h-full flex-1 min-w-[280px] max-w-[500px] shrink-0 flex-col"
    >
      <div className="mb-3 flex items-center gap-2 border-b border-[#1f1f1f] pb-2">
        <Icon className="h-4 w-4 text-[#666]" />
        <h2 className="text-sm font-medium tracking-tight text-white">{title}</h2>
        <span className="ml-auto bg-[#111] px-2 py-0.5 text-xs text-[#666]">{opportunities.length}</span>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1f1f1f transparent' }}>
        <AnimatePresence>
          {opportunities.map((opp, i) => (
            <motion.div
              key={opp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.12 + i * 0.08 }}
            >
              <OpportunityCard opportunity={opp} onView={onViewOpportunity} user={user} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function PostOpportunityModal({ isOpen, onClose, onSuccess }) {
  const user = useAuthStore((s) => s.user)
  const [form, setForm] = useState({
    title: "",
    type: "role",
    description: "",
    skills: "",
    deadline: "",
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      alert("Please log in to post an opportunity")
      return
    }

    if (!form.title.trim()) {
      alert("Please enter a title")
      return
    }

    setSubmitting(true)

    try {
      const skillsArr = form.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s)

      await onSuccess({
        type: form.type,
        title: form.title.trim(),
        description: form.description.trim(),
        skillsNeeded: skillsArr,
        deadline: form.deadline || null,
      })

      // Reset form
      setForm({
        title: "",
        type: "role",
        description: "",
        skills: "",
        deadline: "",
      })
      onClose()
    } catch (error) {
      console.error("Error creating opportunity:", error)
      alert("Failed to create opportunity: " + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 border border-[#1f1f1f] bg-[#0a0a0a] p-6 rounded-none font-sans max-h-[90vh] overflow-y-auto"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-medium tracking-tight text-white">Post Opportunity</h2>
              <button onClick={onClose} className="text-[#666] transition-colors hover:text-[#e8ff47] cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-2 block text-xs font-medium text-[#888]">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full border border-[#1f1f1f] bg-[#0a0a0a] px-3 py-2 text-sm text-white focus:border-[#e8ff47] focus:outline-none focus:ring-1 focus:ring-[#e8ff47] rounded-none"
                  required
                >
                  <option value="role">Open Role</option>
                  <option value="hackathon">Hackathon Team</option>
                  <option value="teammate">Looking for Teammate</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-[#888]">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., Senior Frontend Engineer"
                  className="w-full border border-[#1f1f1f] bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder-[#444] focus:border-[#e8ff47] focus:outline-none focus:ring-1 focus:ring-[#e8ff47] rounded-none"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-[#888]">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  placeholder="Describe the opportunity..."
                  className="w-full resize-none border border-[#1f1f1f] bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder-[#444] focus:border-[#e8ff47] focus:outline-none focus:ring-1 focus:ring-[#e8ff47] rounded-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-[#888]">Skills (comma separated)</label>
                <input
                  type="text"
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  placeholder="e.g., React, TypeScript, Node.js"
                  className="w-full border border-[#1f1f1f] bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder-[#444] focus:border-[#e8ff47] focus:outline-none focus:ring-1 focus:ring-[#e8ff47] rounded-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-[#888]">Deadline (optional)</label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  className="w-full border border-[#1f1f1f] bg-[#0a0a0a] px-3 py-2 text-sm text-white focus:border-[#e8ff47] focus:outline-none focus:ring-1 focus:ring-[#e8ff47] rounded-none [color-scheme:dark]"
                />
              </div>
              <MagneticButton type="submit" className="mt-2 w-full justify-center" disabled={submitting}>
                <Zap className="h-4 w-4" />
                {submitting ? "Posting..." : "Post Opportunity"}
              </MagneticButton>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function OpportunityDetailModal({ opportunity, onClose, user, onCloseOpportunity, onReopenOpportunity }) {
  if (!opportunity) return null

  const typeColors = {
    teammate: { bg: "bg-[#e8ff47]/10", text: "text-[#e8ff47]", label: "Teammate" },
    role: { bg: "bg-[#e8ff47]/10", text: "text-[#e8ff47]", label: "Open Role" },
    hackathon: { bg: "bg-[#e8ff47]/10", text: "text-[#e8ff47]", label: "Hackathon" },
  }
  const typeStyle = typeColors[opportunity.type] || { bg: "bg-[#333]", text: "text-[#666]", label: opportunity.type }
  const isClosed = opportunity.status === "closed"
  const isOwner = user && opportunity.poster_id === user.id

  const formatDate = (dateStr) => {
    if (!dateStr) return "No deadline set"
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const posterName = opportunity.profiles?.display_name || opportunity.profiles?.username || "Anonymous"
  const posterAvatar = opportunity.profiles?.avatar_url

  const handleClose = () => {
    if (isOwner && !isClosed) {
      onCloseOpportunity(opportunity.id)
    }
  }

  const handleReopen = () => {
    if (isOwner && isClosed) {
      onReopenOpportunity(opportunity.id)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 border border-[#1f1f1f] bg-[#0a0a0a] rounded-none font-sans max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f1f1f]">
          <div className="flex items-center gap-3">
            <span className={`${typeStyle.bg} ${typeStyle.text} px-2 py-1 text-xs font-medium`}>
              {typeStyle.label}
            </span>
            {isClosed && (
              <span className="bg-red-500/10 text-red-400 px-2 py-1 text-xs font-medium border border-red-500/30">
                Closed
              </span>
            )}
            <div className="flex items-center gap-2">
              {posterAvatar && (
                <img src={posterAvatar} alt={posterName} className="h-6 w-6 rounded-full object-cover" />
              )}
              <span className="text-sm text-[#888]">{posterName}</span>
            </div>
          </div>
          <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors cursor-pointer" title="Close" />
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-medium tracking-tight text-white">{opportunity.title}</h2>

          <p className="text-sm text-[#888] leading-relaxed">{opportunity.description || "No description provided"}</p>

          <div>
            <h3 className="text-xs font-medium text-[#666] mb-2 uppercase tracking-wider">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {opportunity.skills_needed && opportunity.skills_needed.length > 0 ? (
                opportunity.skills_needed.map((skill) => (
                  <span key={skill} className="bg-[#111] border border-[#1f1f1f] px-3 py-1.5 text-xs text-[#e8ff47]">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-[#444]">No specific skills required</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-[#666]">
            <Calendar className="h-4 w-4" />
            <span>Deadline: {formatDate(opportunity.deadline)}</span>
          </div>

          {isOwner && (
            <div className="p-4 bg-[#111] border border-[#1f1f1f] rounded-none">
              <p className="text-xs text-[#888] mb-2 font-mono">
                {isClosed ? "This opportunity is closed" : "You can close this opportunity to stop receiving applications"}
              </p>
              {isClosed ? (
                <button
                  onClick={handleReopen}
                  className="w-full bg-[#e8ff47] px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#e8ff47]/90 cursor-pointer rounded-none"
                >
                  Reopen Opportunity
                </button>
              ) : (
                <button
                  onClick={handleClose}
                  className="w-full bg-red-500/10 border border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20 cursor-pointer rounded-none"
                >
                  Close Opportunity
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#1f1f1f] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-[#1f1f1f] bg-transparent px-4 py-2.5 text-sm text-white transition-colors hover:border-[#e8ff47] cursor-pointer rounded-none"
          >
            Close
          </button>
          {!isClosed && (
            <button
              className="flex-1 bg-[#e8ff47] px-4 py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#e8ff47]/90 cursor-pointer rounded-none"
            >
              Apply Now
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function Opportunities() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState(null)
  const user = useAuthStore((s) => s.user)
  const { opportunities, loading, createOpportunity, closeOpportunity, reopenOpportunity } = useOpportunities()

  // Filter opportunities by type (only show open ones in main columns)
  const openRoles = opportunities.filter((o) => o.type === "role")
  const hackathons = opportunities.filter((o) => o.type === "hackathon")
  const teammates = opportunities.filter((o) => o.type === "teammate")
  const closed = opportunities.filter((o) => o.status === "closed")

  const handleCreateOpportunity = async (formData) => {
    await createOpportunity(formData)
  }

  const handleCloseOpportunity = async (opportunityId) => {
    await closeOpportunity(opportunityId)
    // Update selected opportunity if it's the one being closed
    setSelectedOpportunity((prev) =>
      prev && prev.id === opportunityId ? { ...prev, status: "closed" } : prev
    )
  }

  const handleReopenOpportunity = async (opportunityId) => {
    await reopenOpportunity(opportunityId)
    // Update selected opportunity if it's the one being reopened
    setSelectedOpportunity((prev) =>
      prev && prev.id === opportunityId ? { ...prev, status: "open" } : prev
    )
  }

  return (
    <div className="relative h-[calc(100vh-64px)] overflow-hidden bg-[#040404] font-sans">
      <NoiseOverlay />

      <motion.div
        animate={{ scale: isModalOpen ? 0.97 : 1 }}
        transition={{ duration: 0.3 }}
        className="flex h-[calc(100vh-64px)] flex-col origin-center relative z-10"
      >
        <main className="flex h-[calc(100vh-64px)] w-full flex-col overflow-hidden px-6 md:px-8 pt-6">
          <div className="mb-5 shrink-0 flex items-center justify-between">
            <h1 className="text-[28px] font-medium tracking-tight text-white focus:outline-none">Opportunities</h1>
            <div className="md:hidden">
              <MagneticButton onClick={() => setIsModalOpen(true)}>
                <Plus className="h-4 w-4" />
                Post
              </MagneticButton>
            </div>
            <div className="hidden md:block">
              <MagneticButton onClick={() => setIsModalOpen(true)}>
                <Zap className="h-4 w-4" />
                Post Opportunity
              </MagneticButton>
            </div>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-[#666] text-sm">Loading opportunities...</div>
            </div>
          ) : opportunities.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-[#666] text-sm mb-2">No opportunities yet</div>
                <div className="text-[#444] text-xs">Be the first to post an opportunity!</div>
              </div>
            </div>
          ) : (
            <motion.div
              layout
              className="flex flex-1 gap-6 md:gap-8 justify-start lg:justify-center overflow-x-auto overflow-y-hidden pb-4"
              style={{ perspective: "1200px", scrollbarWidth: 'thin', scrollbarColor: '#1f1f1f transparent' }}
            >
              {openRoles.length > 0 && (
                <KanbanColumn title="Open Roles" opportunities={openRoles} index={0} icon={Briefcase} onViewOpportunity={setSelectedOpportunity} user={user} />
              )}
              {hackathons.length > 0 && (
                <KanbanColumn title="Hackathon Teams" opportunities={hackathons} index={1} icon={Zap} onViewOpportunity={setSelectedOpportunity} user={user} />
              )}
              {teammates.length > 0 && (
                <KanbanColumn title="Looking for Teammate" opportunities={teammates} index={2} icon={Plus} onViewOpportunity={setSelectedOpportunity} user={user} />
              )}
              {closed.length > 0 && (
                <KanbanColumn title="Closed" opportunities={closed} index={3} icon={X} onViewOpportunity={setSelectedOpportunity} user={user} />
              )}
            </motion.div>
          )}
        </main>
      </motion.div>

      <PostOpportunityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateOpportunity}
      />
      <OpportunityDetailModal
        opportunity={selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
        user={user}
        onCloseOpportunity={handleCloseOpportunity}
        onReopenOpportunity={handleReopenOpportunity}
      />
    </div>
  )
}
