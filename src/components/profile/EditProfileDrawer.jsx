/*
  EditProfileDrawer.jsx
  ---------------------
  Slide-over drawer (from the right) for editing your own profile.
  Updates the `profiles` table and refreshes on save.
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
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* drawer panel */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-800 h-full overflow-y-auto shadow-xl animate-fade-up">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-heading dark:text-white">Edit Profile</h2>
            <button
              onClick={onClose}
              className="p-1 rounded text-muted hover:text-heading dark:hover:text-white cursor-pointer"
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
              <label className="text-sm font-medium text-heading dark:text-slate-200">Bio</label>
              <textarea
                rows={4}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full rounded-lg border border-border dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-heading dark:text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
                placeholder="Tell others about yourself…"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-heading dark:text-slate-200 mb-2 block">Skills</label>
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
