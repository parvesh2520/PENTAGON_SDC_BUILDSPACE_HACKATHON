/*
  EditProfileDrawer.jsx
  ---------------------
  Slide-over drawer for editing your own profile.
  Dark glassmorphic design with violet accents.
*/

import { useState } from "react";
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

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* drawer panel */}
      <div className="relative w-full max-w-md bg-slate-900/95 backdrop-blur-xl h-full overflow-y-auto shadow-2xl border-l border-violet-500/10 animate-fade-up">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-lg font-semibold text-white">Edit Profile</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Display Name"
              value={form.display_name}
              onChange={(e) => setForm({ ...form, display_name: e.target.value })}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Bio</label>
              <textarea
                rows={4}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full rounded-xl border border-violet-500/15 bg-slate-800/60 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none transition-all"
                placeholder="Tell others about yourself…"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Skills</label>
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

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? "Saving…" : "Save Changes"}
              </Button>
              <Button variant="secondary" type="button" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
