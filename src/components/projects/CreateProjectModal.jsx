/*
  CreateProjectModal.jsx
  ----------------------
  Modal form for creating a new project.
  Dark glassmorphic design matching the AI theme.
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Project Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="My Awesome Project"
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-300">Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-xl border border-violet-500/15 bg-slate-800/60 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none transition-all"
            placeholder="What's this project about?"
          />
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
          placeholder="https://github.com/…"
        />

        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
            {error}
          </p>
        )}

        <Button type="submit" disabled={saving} className="w-full">
          {saving ? "Creating…" : "Create Project"}
        </Button>
      </form>
    </Modal>
  );
}
