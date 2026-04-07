/*
  SkillsGrid.jsx
  --------------
  Futuristic skills display with cyber chip styling.
*/

import { useState } from "react";

export default function SkillsGrid({ skills = [], editable = false, onChange }) {
  const [input, setInput] = useState("");

  function addSkill(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || skills.includes(trimmed)) return;
    onChange([...skills, trimmed]);
    setInput("");
  }

  function removeSkill(skill) {
    if (!editable) return;
    onChange(skills.filter((s) => s !== skill));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <button
            key={skill}
            onClick={() => removeSkill(skill)}
            disabled={!editable}
            style={{ animationDelay: `${index * 50}ms` }}
            className={`group relative px-3 py-1.5 text-sm font-mono rounded-lg border transition-all duration-300 animate-fade-up ${
              editable 
                ? "cursor-pointer hover:border-red-500/50 hover:bg-red-500/10" 
                : "cursor-default"
            } bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border-cyan-500/30 text-cyan-300`}
          >
            <span className="relative flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              {skill}
              {editable && (
                <span className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  &times;
                </span>
              )}
            </span>
          </button>
        ))}
      </div>

      {editable && (
        <div className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addSkill(e);
                }
              }}
              placeholder="Add a skill..."
              className="w-full rounded-xl border border-cyan-500/20 bg-slate-800/60 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all font-mono"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/5 to-violet-500/5 pointer-events-none" />
          </div>
          <button
            type="button"
            onClick={addSkill}
            className="group relative px-5 py-2.5 rounded-xl text-sm font-medium text-white overflow-hidden transition-all cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-violet-500 transition-all group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-violet-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative">Add</span>
          </button>
        </div>
      )}
    </div>
  );
}
