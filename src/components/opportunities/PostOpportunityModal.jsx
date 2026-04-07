/*
  PostOpportunityModal.jsx
  ------------------------
  Futuristic modal form for posting a new opportunity.
*/

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import useAuthStore from "../../store/authStore";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function PostOpportunityModal({ open, onClose, onCreated }) {
  const user = useAuthStore((s) => s.user);
  const [form, setForm] = useState({
    type: "teammate",
    title: "",
    description: "",
    skills_needed: "",
    deadline: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Give it a title first.");
      return;
    }

    setSaving(true);
    setError(null);

    const skillsArr = form.skills_needed
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const { data, error: insertErr } = await supabase
      .from("opportunities")
      .insert({
        poster_id:     user.id,
        type:          form.type,
        title:         form.title.trim(),
        description:   form.description.trim(),
        skills_needed: skillsArr,
        deadline:      form.deadline || null,
      })
      .select()
      .single();

    if (insertErr) {
      setError(insertErr.message);
      setSaving(false);
      return;
    }

    await supabase.from("feed_posts").insert({
      author_id: user.id,
      type:      "opportunity",
      ref_id:    data.id,
      content:   `Posted a new opportunity: ${data.title}`,
    });

    setSaving(false);
    setForm({ type: "teammate", title: "", description: "", skills_needed: "", deadline: "" });
    onCreated?.(data);
    onClose();
  }

  const typeOptions = [
    { value: "teammate", label: "Looking for Teammate", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
    { value: "hackathon", label: "Hackathon", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { value: "role", label: "Role / Job", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  ];

  return (
    <Modal open={open} onClose={onClose} title="Post Opportunity">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* type selector */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-300">Type</label>
          <div className="grid grid-cols-3 gap-2">
            {typeOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm({ ...form, type: opt.value })}
                className={`p-3 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
                  form.type === opt.value
                    ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                    : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                }`}
              >
                <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={opt.icon} />
                </svg>
                <span className="text-xs font-medium">{opt.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="e.g. Need a React dev for weekend hackathon"
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-300">Description</label>
          <div className="relative">
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl border border-cyan-500/20 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 resize-none transition-all"
              placeholder="Tell people what you're looking for..."
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/5 to-violet-500/5 pointer-events-none" />
          </div>
        </div>

        <Input
          label="Skills Needed (comma separated)"
          value={form.skills_needed}
          onChange={(e) => setForm({ ...form, skills_needed: e.target.value })}
          placeholder="React, Python, UI/UX"
        />

        <Input
          label="Deadline (optional)"
          type="date"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
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
              Posting...
            </span>
          ) : "Post Opportunity"}
        </Button>
      </form>
    </Modal>
  );
}
