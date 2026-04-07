/*
  SkillsGrid.jsx
  --------------
  Renders skills as editable neon chips.
  If editable, shows input to add and click to remove.
*/

import { useState } from "react";
import Badge from "../ui/Badge";

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
        {skills.map((skill) => (
          <button
            key={skill}
            onClick={() => removeSkill(skill)}
            disabled={!editable}
            className={editable ? "cursor-pointer hover:opacity-70 transition-opacity" : "cursor-default"}
          >
            <Badge>
              {skill}
              {editable && " ×"}
            </Badge>
          </button>
        ))}
      </div>

      {editable && (
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addSkill(e);
              }
            }}
            placeholder="Add a skill…"
            className="flex-1 rounded-xl border border-violet-500/15 bg-slate-800/60 px-3 py-1.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all"
          />
          <button
            type="button"
            onClick={addSkill}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-1.5 text-sm font-medium text-white hover:brightness-110 transition-all cursor-pointer"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}
