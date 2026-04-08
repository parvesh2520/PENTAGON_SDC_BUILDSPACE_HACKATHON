import { useState, useEffect } from "react"
import useAuthStore from "../store/authStore"
import { useProfile } from "../hooks/useProfile"
import { useProjects } from "../hooks/useProjects"
import ProfileSkeleton from "./ProfileSkeleton"
import EditProfileDrawer from "../components/profile/EditProfileDrawer"
import ProfileView from "../components/profile/ProfileView"

const categorizeSkills = (skills = []) => {
  const categories = {
    Frontend: ["React", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS", "TailwindCSS", "Vue", "Angular", "Svelte"],
    Backend: ["Node.js", "Express", "Python", "Django", "Flask", "Go", "Rust", "PostgreSQL", "MongoDB", "SQL", "GraphQL", "Supabase", "Firebase"],
    Tools: ["Git", "Docker", "AWS", "Kubernetes", "Vercel", "Linux", "Figma", "Prisma", "Zustand", "Redux"]
  }

  const result = { Frontend: [], Backend: [], Tools: [] }
  
  skills.forEach(skill => {
    let found = false
    for (const [cat, list] of Object.entries(categories)) {
      if (list.includes(skill)) {
        result[cat].push(skill)
        found = true
        break
      }
    }
    if (!found) result.Tools.push(skill) // Default to Tools if unknown
  })

  return result
}

const formatStat = (num) => {
  if (!num) return 0
  if (num >= 1000) return (num / 1000).toFixed(1) + "k"
  return num
}

export default function Profile() {
  const currentUser = useAuthStore((s) => s.user)
  const authLoading = useAuthStore((s) => s.loading)
  const { profile, loading: profileLoading, updateProfile } = useProfile()
  const { fetchUserProjects } = useProjects()
  
  const [projects, setProjects] = useState([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("profile")

  useEffect(() => {
    async function loadProjects() {
      if (profile?.id) {
        setLoadingProjects(true)
        const userProjects = await fetchUserProjects(profile.id)
        setProjects(userProjects)
        setLoadingProjects(false)
      } else if (!profileLoading) {
        // If profile finished loading and there's no ID, stop loading projects
        setLoadingProjects(false)
      }
    }
    loadProjects()
  }, [profile?.id, profileLoading, fetchUserProjects])

  // SHOW SKELETON:
  // 1. If global auth is still resolving
  // 2. If profile table query is still active
  // 3. If we have a profile but its projects are still in flight
  if (authLoading || profileLoading || (profile?.id && loadingProjects)) {
    return <ProfileSkeleton />
  }

  if (!currentUser && !profile) return null

  const p = profile || {}
  const isOwnProfile = profile?.id === currentUser.id

  // Map to specified userData structure
  const userData = {
    profile: {
      avatarUrl: p.avatar_url,
      name: p.display_name || currentUser.email?.split("@")[0] || "User",
      handle: p.username || "user",
      isLive: true,
      bio: p.bio,
      location: p.location,
      joinDate: p.created_at 
        ? new Date(p.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) 
        : "Recently"
    },
    skills: {
      categorized: categorizeSkills(p.skills || [])
    },
    connect: {
      githubUrl: p.github_url,
      linkedinUrl: p.linkedin_url,
      websiteUrl: p.website_url,
      twitterUrl: p.twitter_url // included but connect view only shows 3 + globe
    },
    stats: {
      projects: projects.length,
      commits: formatStat(p.commits_count),
      followers: formatStat(p.followers_count),
      stars: formatStat(projects.reduce((acc, curr) => acc + (curr.stars_count || 0), 0))
    },
    projects: projects
  }

  const handleSaveProfile = async (updates) => {
    return await updateProfile(updates)
  }

  const handleEditClick = (section) => {
    setActiveSection(section)
    setEditOpen(true)
  }

  return (
    <>
      <ProfileView 
        userData={userData} 
        isOwn={isOwnProfile} 
        onEdit={handleEditClick} 
      />
      
      <EditProfileDrawer 
        open={editOpen} 
        onClose={() => setEditOpen(false)} 
        profile={p}
        onSave={handleSaveProfile}
        targetSection={activeSection}
      />
    </>
  )
}

