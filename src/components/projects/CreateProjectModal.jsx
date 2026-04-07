/*
  CreateProjectModal.jsx
  ----------------------
  Futuristic modal form for creating a new project.
*/

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import useAuthStore from "../../store/authStore";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function CreateProjectModal({ open, onClose, onCreated }) {
  const user = useAuthStore((s) => s.user);
  const [form, setForm] = useState({
    title: "",
    description: "",
    tech_stack: "",
    repo_url: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Project name can't be blank.");
      return;
    }

    setSaving(true);
    setError(null);

    const techArr = form.tech_stack
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const { data: project, error: insertErr } = await supabase
      .from("projects")
      .insert({
        owner_id:    user.id,
        title:       form.title.trim(),
        description: form.description.trim(),
        tech_stack:  techArr,
        repo_url:    form.repo_url.trim() || null,
      })
      .select()
      .single();

    if (insertErr) {
      setError(insertErr.message);
      setSaving(false);
      return;
    }

    await supabase.from("project_members").insert({
      project_id: project.id,
      user_id:    user.id,
      role:       "owner",
    });

    await supabase.from("feed_posts").insert({
      author_id: user.id,
      type:      "project",
      ref_id:    project.id,
      content:   `Created a new project: ${project.title}`,
    });

    setSaving(false);
    setForm({ title: "", description: "", tech_stack: "", repo_url: "" });
    onCreated?.(project);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Create New Project">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Project Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="My Awesome Project"
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-300">Description</label>
          <div className="relative">
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl border border-cyan-500/20 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 resize-none transition-all"
              placeholder="What's this project about?"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/5 to-violet-500/5 pointer-events-none" />
          </div>
        </div>

        <Input
          label="Tech Stack (comma separated)"
          value={form.tech_stack}
          onChange={(e) => setForm({ ...form, tech_stack: e.target.value })}
          placeholder="React, Node.js, PostgreSQL"
        />

        <Input
          label="Repo URL (optional)"
          value={form.repo_url}
          onChange={(e) => setForm({ ...form, repo_url: e.target.value })}
          placeholder="https://github.com/..."
        />

        {error && (
          <div className="flex items-center gap-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        <Button type="submit" disabled={saving} className="w-full">
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating...
            </span>
          ) : "Create Project"}
        </Button>
      </form>
    </Modal>
  );
}
