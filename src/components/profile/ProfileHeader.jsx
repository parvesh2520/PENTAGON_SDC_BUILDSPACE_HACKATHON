/*
  ProfileHeader.jsx
  -----------------
  Hero section at the top of a user's profile page.
  Shows avatar with glow, name, bio, skill badges, and social links.
*/

import { HiOutlinePencil, HiOutlineClipboard, HiOutlineCheck, HiOutlineGlobeAlt } from "react-icons/hi";
import { FaGithub } from "react-icons/fa";
import { useState } from "react";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

export default function ProfileHeader({ profile, isOwn, onEdit }) {
  const [copied, setCopied] = useState(false);

  function copyProfileLink() {
    const url = `${window.location.origin}/u/${profile.username || profile.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="card p-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-[200px] h-[200px] rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none" />
      
      <div className="relative flex flex-col sm:flex-row items-start gap-8">
        {/* Avatar with status */}
        <div className="relative group">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-600/20 blur-xl group-hover:blur-2xl transition-all" />
          <Avatar 
            src={profile.avatar_url} 
            name={profile.display_name} 
            size="xl" 
            className="relative ring-4 ring-cyan-500/20 rounded-2xl"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-3 border-slate-900 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-white animate-soft-pulse" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Name and username */}
          <h1 className="font-display text-3xl font-bold text-white">
            {profile.display_name || profile.username}
          </h1>
          <p className="text-sm text-cyan-400 mt-1 font-mono">@{profile.username}</p>

          {/* Bio */}
          {profile.bio && (
            <p className="text-slate-300 mt-4 max-w-xl leading-relaxed">
              {profile.bio}
            </p>
          )}

          {/* Skill badges */}
          {profile.skills?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {profile.skills.map((skill) => (
                <Badge key={skill} color="cyan">{skill}</Badge>
              ))}
            </div>
          )}

          {/* Social links */}
          <div className="flex items-center gap-5 mt-5 text-sm">
            {profile.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors group"
              >
                <FaGithub className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>GitHub</span>
              </a>
            )}
            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors group"
              >
                <HiOutlineGlobeAlt className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>LinkedIn</span>
              </a>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 shrink-0">
          <Button variant="secondary" size="sm" onClick={copyProfileLink}>
            {copied ? <HiOutlineCheck className="w-4 h-4" /> : <HiOutlineClipboard className="w-4 h-4" />}
            {copied ? "Copied!" : "Share"}
          </Button>

          {isOwn && (
            <Button size="sm" onClick={onEdit}>
              <HiOutlinePencil className="w-4 h-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
