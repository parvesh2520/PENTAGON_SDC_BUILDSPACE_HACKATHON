/*
  Modal.jsx
  ---------
  Dark glassmorphic modal overlay with violet accents.
  Handles escape-key dismissal and backdrop click.
*/

import { useEffect } from "react";

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal body */}
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-violet-500/15 p-6 shadow-2xl shadow-black/40 animate-fade-up">
        {/* header row */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-semibold text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
