/*
  ProfileHeader.jsx
  -----------------
  Hero section at the top of a user's profile page.
  Shows avatar with glow, name, bio, skill badges, and social links.
*/

import { HiOutlinePencil, HiOutlineClipboard, HiOutlineCheck } from "react-icons/hi";
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
    <div className="card p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <div className="relative">
          <Avatar src={profile.avatar_url} name={profile.display_name} size="xl" />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900" />
        </div>

        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold text-white">
            {profile.display_name || profile.username}
          </h1>
          <p className="text-sm text-violet-400 mt-0.5">@{profile.username}</p>

          {profile.bio && (
            <p className="text-slate-300 mt-3 max-w-xl leading-relaxed text-sm">
              {profile.bio}
            </p>
          )}

          {/* skill badges */}
          {profile.skills?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {profile.skills.map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
            </div>
          )}

          {/* social links */}
          <div className="flex items-center gap-4 mt-4 text-sm">
            {profile.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
              >
                <FaGithub className="w-4 h-4" /> GitHub
              </a>
            )}
            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                LinkedIn ↗
              </a>
            )}
          </div>
        </div>

        {/* action buttons */}
        <div className="flex gap-2 shrink-0">
          <Button variant="secondary" size="sm" onClick={copyProfileLink}>
            {copied ? <HiOutlineCheck className="w-4 h-4" /> : <HiOutlineClipboard className="w-4 h-4" />}
            {copied ? "Copied!" : "Share"}
          </Button>

          {isOwn && (
            <Button size="sm" onClick={onEdit}>
              <HiOutlinePencil className="w-4 h-4" />
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
