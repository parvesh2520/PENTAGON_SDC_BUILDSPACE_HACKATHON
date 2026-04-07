/*
  EditProfileDrawer.jsx
  ---------------------
  Futuristic slide-over drawer with cyber aesthetics.
*/

import { useState, useEffect } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import SkillsGrid from "./SkillsGrid";

export default function EditProfileDrawer({ open, onClose, profile, onSave }) {
  const [form, setForm] = useState(() => ({
    display_name: profile?.display_name || "",
    bio: profile?.bio || "",
    github_url: profile?.github_url || "",
    linkedin_url: profile?.linkedin_url || "",
    skills: profile?.skills || [],
  }));
  const [saving, setSaving] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

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
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  }

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      {/* drawer panel */}
      <div className={`relative w-full max-w-md transform transition-transform duration-300 ease-out ${isAnimating ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Glow effect */}
        <div className="absolute -left-2 inset-y-0 w-px bg-gradient-to-b from-cyan-500/50 via-violet-500/50 to-cyan-500/50 blur-sm" />
        
        <div className="h-full bg-slate-900/95 backdrop-blur-xl overflow-y-auto border-l border-cyan-500/20">
          {/* Header pattern */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0, 255, 255, 0.3) 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }} />

          <div className="relative p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
                Edit Profile
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-cyan-500/30 transition-all cursor-pointer group"
              >
                <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Display Name"
                value={form.display_name}
                onChange={(e) => setForm({ ...form, display_name: e.target.value })}
              />

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-300">Bio</label>
                <div className="relative">
                  <textarea
                    rows={4}
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    className="w-full rounded-xl border border-cyan-500/20 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 resize-none transition-all"
                    placeholder="Tell others about yourself..."
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/5 to-violet-500/5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300 mb-3 block">Skills</label>
                <SkillsGrid
                  skills={form.skills}
                  editable
                  onChange={(skills) => setForm({ ...form, skills })}
                />
              </div>

              <Input
                label="GitHub URL"
                value={form.github_url}
                onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                placeholder="https://github.com/yourname"
              />

              <Input
                label="LinkedIn URL"
                value={form.linkedin_url}
                onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/in/yourname"
              />

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </span>
                  ) : "Save Changes"}
                </Button>
                <Button variant="secondary" type="button" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
