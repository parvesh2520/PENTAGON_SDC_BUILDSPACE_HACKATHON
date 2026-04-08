/*
  EditProfileDrawer.jsx
  ---------------------
  Futuristic slide-over drawer with BuildSpace aesthetics.
*/

import { useState, useEffect } from "react";
import { X, Save, User, Globe, MapPin, Terminal } from "lucide-react";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";
import SkillsGrid from "./SkillsGrid";

const cn = (...classes) => classes.filter(Boolean).join(" ");

export default function EditProfileDrawer({ open, onClose, profile, onSave, targetSection }) {
  const [form, setForm] = useState({
    display_name: "",
    bio: "",
    github_url: "",
    linkedin_url: "",
    twitter_url: "",
    website_url: "",
    location: "",
    skills: [],
    avatar_url: "",
    status: "",
    commits_count: 0,
    followers_count: 0,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        display_name: profile.display_name || "",
        bio: profile.bio || "",
        github_url: profile.github_url || "",
        linkedin_url: profile.linkedin_url || "",
        twitter_url: profile.twitter_url || "",
        website_url: profile.website_url || "",
        location: profile.location || "",
        skills: profile.skills || [],
        avatar_url: profile.avatar_url || "",
        status: profile.status || "CORE_DEVELOPER",
        commits_count: profile.commits_count || 0,
        followers_count: profile.followers_count || 0,
      });
    }
  }, [profile]);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const result = await onSave(form);
      if (result?.error) {
        setError(result.error.message || "Failed to update profile.");
        setSaving(false);
      } else {
        setSaving(false);
        onClose();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setSaving(false);
    }
  }

  if (!isVisible) return null;

  const sectionConfig = {
    profile: { 
      title: "Edit Core identity", 
      subtitle: "Update your name, bio, and visual presence", 
      icon: User,
      color: "#e8ff47",
      bg: "bg-[#e8ff47]/10"
    },
    skills: { 
      title: "Technical Arsenal", 
      subtitle: "Define your engineering stack", 
      icon: Terminal,
      color: "#00bcd4",
      bg: "bg-[#00bcd4]/10"
    },
    connect: { 
      title: "Connection Protocols", 
      subtitle: "Link your digital fingerprints", 
      icon: Globe,
      color: "#f43f5e",
      bg: "bg-[#f43f5e]/10"
    },
    default: { 
      title: "Edit Profile", 
      subtitle: "Update your developer registry", 
      icon: User,
      color: "#e8ff47",
      bg: "bg-[#e8ff47]/10"
    }
  };

  const currentConfig = sectionConfig[targetSection] || sectionConfig.default;

  const InputField = ({ label, icon: Icon, value, onChange, placeholder, type = "text" }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-mono uppercase tracking-wider text-[#666] flex items-center gap-2">
        {Icon && <Icon size={12} className="text-[#444]" />}
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-none px-4 py-2 text-sm text-white focus:outline-none focus:border-[#e8ff47]/30 font-mono placeholder:text-[#333]"
      />
    </div>
  );

  return (
    <div className={`fixed inset-0 z-[100] flex justify-end transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

      {/* drawer panel */}
      <div 
        className={`relative w-full max-w-lg border-l border-[#1f1f1f] shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isAnimating ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ borderColor: `${currentConfig.color}22` }}
      >
        
        <div className="h-full bg-[#040404] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-[#1f1f1f]">
            <div className="flex items-center gap-4">
              <div className={cn("p-3 border border-white/5 shadow-[0_0_15px_rgba(255,255,255,0.02)]", currentConfig.bg)}>
                <currentConfig.icon size={24} style={{ color: currentConfig.color }} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tighter uppercase" style={{ color: currentConfig.color }}>{currentConfig.title}</h2>
                <p className="text-[11px] font-mono text-[#444] tracking-widest uppercase">{currentConfig.subtitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#444] hover:text-white transition-all cursor-pointer hover:rotate-90"
            >
              <X size={28} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] font-mono uppercase tracking-widest">
                {error}
              </div>
            )}

            {/* Profile Section */}
            {(targetSection === "profile" || !targetSection) && (
              <div className="space-y-8">
                <InputField
                  label="Registry Name"
                  icon={User}
                  value={form.display_name}
                  onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                  placeholder="Alex Chen"
                />
                
                <div className="space-y-3">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#666]">
                    Description_Log
                  </label>
                  <textarea
                    rows={5}
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-none px-4 py-3 text-sm text-white focus:outline-none focus:border-[#e8ff47]/50 font-mono placeholder:text-[#333] resize-none leading-relaxed"
                  />
                </div>

                 <InputField
                  label="Global Coordinates"
                  icon={MapPin}
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="San Francisco, CA"
                />

                <InputField
                  label="Avatar Link"
                  icon={Globe}
                  value={form.avatar_url}
                  onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
                  placeholder="https://..."
                />

                <InputField
                  label="System Status"
                  icon={Terminal}
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  placeholder="CORE_DEVELOPER"
                />
              </div>
            )}

            {/* Skills Section */}
            {targetSection === "skills" && (
              <div className="space-y-6">
                <p className="text-xs text-[#888] font-mono leading-relaxed mb-6">Select the primary technologies for your developer profile. These will be highlighted in your Technical Arsenal.</p>
                <SkillsGrid
                  skills={form.skills}
                  editable
                  onChange={(skills) => setForm({ ...form, skills })}
                />
              </div>
            )}

            {/* Connect Section */}
            {targetSection === "connect" && (
              <div className="space-y-8">
                <InputField
                  label="GitHub UID"
                  icon={FiGithub}
                  value={form.github_url}
                  onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                  placeholder="github.com/..."
                />
                <InputField
                  label="LinkedIn Token"
                  icon={FiLinkedin}
                  value={form.linkedin_url}
                  onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
                  placeholder="linkedin.com/..."
                />
                <InputField
                  label="Twitter Handle"
                  icon={FiTwitter}
                  value={form.twitter_url}
                  onChange={(e) => setForm({ ...form, twitter_url: e.target.value })}
                  placeholder="twitter.com/..."
                />
                <InputField
                  label="Personal Grid"
                  icon={Globe}
                  value={form.website_url}
                  onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                  placeholder="portfolio.com"
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-[#1f1f1f] bg-[#070707] flex items-center gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 text-[11px] font-mono font-bold border border-[#1f1f1f] text-[#666] hover:text-white hover:border-[#444] transition-all uppercase tracking-widest"
            >
              ABORT
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 py-4 bg-[#e8ff47] text-black text-[11px] font-bold font-mono border border-[#e8ff47] shadow-[0_5px_30px_rgba(232,255,71,0.1)] hover:shadow-[0_5px_40px_rgba(232,255,71,0.2)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 uppercase tracking-widest"
            >
              {saving ? <div className="size-4 border-2 border-black/20 border-t-black animate-spin rounded-full" /> : <Save size={16} />}
              Commit_Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



