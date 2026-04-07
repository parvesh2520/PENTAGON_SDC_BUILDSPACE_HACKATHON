/*
  Settings.jsx
  ------------
  Premium settings page with glassmorphic sections.
  Sections: Profile, Appearance, Account, Danger Zone, System Health.
*/

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import useAuthStore from "../store/authStore";
import useThemeStore from "../store/themeStore";
import { useProfile } from "../hooks/useProfile";
import PageWrapper from "../components/layout/PageWrapper";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Avatar from "../components/ui/Avatar";
import {
  HiOutlineUpload,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineRefresh,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineCog,
  HiOutlineUser,
  HiOutlineColorSwatch,
  HiOutlineKey,
  HiOutlineExclamation,
  HiOutlineTerminal,
} from "react-icons/hi";

export default function Settings() {
  const user     = useAuthStore((s) => s.user);
  const signOut  = useAuthStore((s) => s.signOut);
  const theme    = useThemeStore((s) => s.theme);
  const toggle   = useThemeStore((s) => s.toggle);
  const { profile, updateProfile } = useProfile();

  const [profileDraft, setProfileDraft] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [uploading, setUploading]     = useState(false);
  const [saving, setSaving]           = useState(false);
  const [msg, setMsg]                 = useState(null);
  const [checksLoading, setChecksLoading] = useState(false);
  const [systemChecks, setSystemChecks] = useState([]);

  const displayName = profileDraft?.display_name ?? profile?.display_name ?? "";
  const bio = profileDraft?.bio ?? profile?.bio ?? "";

  async function handleAvatarUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 2 * 1024 * 1024) {
      setMsg("Image too large. Please upload a file smaller than 2MB.");
      return;
    }

    if (!["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file.type)) {
      setMsg("Unsupported format. Please use PNG, JPG, or WEBP.");
      return;
    }

    setUploading(true);
    const filePath = `${user.id}/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (!error) {
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      await updateProfile({ avatar_url: urlData.publicUrl });
      setMsg("Avatar updated!");
    } else {
      setMsg("Upload failed: " + error.message);
    }

    setUploading(false);
  }

  async function runSystemChecks() {
    setChecksLoading(true);
    const checks = [];

    const tableNames = ["profiles", "projects", "project_members", "opportunities", "notifications", "feed_posts"];
    for (const table of tableNames) {
      const { error } = await supabase.from(table).select("id", { head: true, count: "exact" }).limit(1);
      checks.push({
        label: `Table: ${table}`,
        ok: !error,
        detail: error?.message || "OK",
      });
    }

    const { error: bucketError } = await supabase.storage.from("avatars").list("", { limit: 1 });
    checks.push({
      label: "Storage bucket: avatars",
      ok: !bucketError,
      detail: bucketError?.message || "OK",
    });

    const { error: authError } = await supabase.auth.getSession();
    checks.push({
      label: "Auth session endpoint",
      ok: !authError,
      detail: authError?.message || "OK",
    });

    setSystemChecks(checks);
    setChecksLoading(false);
  }

  async function saveProfile() {
    setSaving(true);
    await updateProfile({ display_name: displayName, bio });
    setProfileDraft(null);
    setMsg("Profile saved!");
    setSaving(false);
  }

  async function changePassword() {
    if (!newPassword || newPassword.length < 6) {
      setMsg("Password must be at least 6 characters.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setMsg(error.message);
    } else {
      setMsg("Password updated successfully.");
      setNewPassword("");
    }
  }

  async function deleteAccount() {
    const confirmed = window.confirm(
      "Are you sure? This will delete your profile and sign you out."
    );
    if (!confirmed) return;

    await supabase.from("profiles").delete().eq("id", user.id);
    signOut();
  }

  useEffect(() => {
    if (msg) {
      const t = setTimeout(() => setMsg(null), 4000);
      return () => clearTimeout(t);
    }
  }, [msg]);

  return (
    <PageWrapper className="max-w-2xl relative">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10 animate-fade-up">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <HiOutlineCog className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Settings</h1>
            <p className="text-sm text-slate-400">Manage your account and preferences</p>
          </div>
        </div>

        {/* Toast message */}
        {msg && (
          <div className="mb-6 rounded-xl bg-cyan-500/10 border border-cyan-500/20 px-4 py-3 text-sm text-cyan-300 animate-fade-up flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
            {msg}
          </div>
        )}

        {/* --- Profile Section --- */}
        <section className="card p-6 mb-6 animate-fade-up delay-100">
          <h2 className="font-display text-lg font-semibold text-white mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <HiOutlineUser className="w-4 h-4 text-cyan-400" />
            </div>
            Profile
          </h2>

          {/* Avatar upload */}
          <div className="flex items-center gap-6 mb-8">
            <Avatar
              src={profile?.avatar_url}
              name={profile?.display_name}
              size="lg"
              className="ring-4 ring-cyan-500/20"
            />
            <div>
              <label className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/20 bg-slate-800/60 px-4 py-3 text-sm font-medium text-white hover:bg-slate-700/60 hover:border-cyan-500/40 transition-all cursor-pointer group">
                <HiOutlineUpload className="w-4 h-4 group-hover:scale-110 transition-transform" />
                {uploading ? "Uploading..." : "Upload Avatar"}
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
              <p className="text-xs text-slate-500 mt-2">Max 2 MB - PNG, JPG, or WEBP</p>
            </div>
          </div>

          <div className="space-y-5">
            <Input
              label="Display Name"
              value={displayName}
              onChange={(e) =>
                setProfileDraft((prev) => ({
                  display_name: e.target.value,
                  bio: prev?.bio ?? profile?.bio ?? "",
                }))
              }
            />

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-300">Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) =>
                  setProfileDraft((prev) => ({
                    display_name: prev?.display_name ?? profile?.display_name ?? "",
                    bio: e.target.value,
                  }))
                }
                placeholder="Tell us about yourself..."
                className="w-full rounded-xl border border-cyan-500/15 bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 resize-none transition-all hover:border-cyan-500/25"
              />
            </div>

            <Button onClick={saveProfile} disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </section>

        {/* --- Appearance Section --- */}
        <section className="card p-6 mb-6 animate-fade-up delay-200">
          <h2 className="font-display text-lg font-semibold text-white mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <HiOutlineColorSwatch className="w-4 h-4 text-cyan-400" />
            </div>
            Appearance
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Dark Mode</p>
              <p className="text-xs text-slate-500 mt-1">Switch between light and dark theme</p>
            </div>

            <button
              onClick={toggle}
              className={`relative w-16 h-8 rounded-full transition-all duration-300 cursor-pointer ${
                theme === "dark" 
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25" 
                  : "bg-slate-600"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow-lg transition-transform duration-300 flex items-center justify-center ${
                  theme === "dark" ? "translate-x-8" : ""
                }`}
              >
                {theme === "dark"
                  ? <HiOutlineMoon className="w-3.5 h-3.5 text-cyan-600" />
                  : <HiOutlineSun className="w-3.5 h-3.5 text-amber-500" />
                }
              </span>
            </button>
          </div>
        </section>

        {/* --- Account / Password --- */}
        <section className="card p-6 mb-6 animate-fade-up delay-300">
          <h2 className="font-display text-lg font-semibold text-white mb-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <HiOutlineKey className="w-4 h-4 text-cyan-400" />
            </div>
            Account
          </h2>

          <div className="space-y-5">
            <Input
              label="Email"
              value={user?.email || ""}
              disabled
              className="opacity-60"
            />

            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />

            <Button variant="secondary" onClick={changePassword}>
              Update Password
            </Button>
          </div>
        </section>

        {/* --- Danger Zone --- */}
        <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 mb-6 animate-fade-up delay-400">
          <h2 className="font-display text-lg font-semibold text-red-400 mb-2 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <HiOutlineExclamation className="w-4 h-4 text-red-400" />
            </div>
            Danger Zone
          </h2>
          <p className="text-sm text-red-400/70 mb-4 ml-11">
            Deleting your account removes your profile and signs you out. This action cannot be undone.
          </p>
          <div className="ml-11">
            <Button variant="danger" onClick={deleteAccount}>
              Delete Account
            </Button>
          </div>
        </section>

        {/* --- Supabase System Check --- */}
        <section className="card p-6 animate-fade-up delay-500">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <HiOutlineTerminal className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-white">System Health</h2>
                <p className="text-xs text-slate-500 mt-0.5">Verify backend connections</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={runSystemChecks} disabled={checksLoading}>
              <HiOutlineRefresh className={`w-4 h-4 ${checksLoading ? "animate-spin" : ""}`} />
              {checksLoading ? "Checking..." : "Run Check"}
            </Button>
          </div>

          {systemChecks.length > 0 ? (
            <ul className="space-y-2">
              {systemChecks.map((check, i) => (
                <li
                  key={check.label}
                  className={`rounded-xl border px-4 py-3 text-sm flex items-center justify-between gap-3 animate-fade-up ${
                    check.ok
                      ? "border-emerald-500/20 bg-emerald-500/5"
                      : "border-red-500/20 bg-red-500/5"
                  }`}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {check.ok ? (
                      <HiOutlineCheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
                    ) : (
                      <HiOutlineExclamationCircle className="w-5 h-5 shrink-0 text-red-400" />
                    )}
                    <span className="text-white font-mono text-xs">{check.label}</span>
                  </div>
                  <span className="text-xs text-slate-500 truncate max-w-[45%] text-right font-mono">
                    {check.detail}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-slate-500">Run the check to validate backend connections.</p>
            </div>
          )}
        </section>
      </div>
    </PageWrapper>
  );
}
