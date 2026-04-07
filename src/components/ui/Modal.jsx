/*
  Modal.jsx
  ---------
  Futuristic glassmorphic modal with cyber glow effects.
  Handles escape-key dismissal and backdrop click.
*/

import { useEffect, useState } from "react";

export default function Modal({ open, onClose, title, children }) {
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

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}>
      {/* backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* modal body */}
      <div className={`relative w-full max-w-lg transform transition-all duration-300 ${isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-cyan-500/20 rounded-3xl blur-xl opacity-75" />
        
        <div className="relative rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-cyan-500/20 p-6 shadow-2xl shadow-black/50">
          {/* Scan line effect */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.03) 2px, rgba(0, 255, 255, 0.03) 4px)'
            }} />
          </div>

          {/* header row */}
          <div className="relative flex items-center justify-between mb-5">
            <h2 className="font-mono text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 transition-all duration-300 cursor-pointer group"
            >
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="relative">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
