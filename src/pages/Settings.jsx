/*
  Settings.jsx
  ------------
  User settings page. Sections:
  - Account (email, password change)
  - Profile (name, bio, avatar upload to Supabase Storage)
  - Theme toggle
  - Danger zone (account deletion)
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
import { HiOutlineUpload, HiOutlineMoon, HiOutlineSun } from "react-icons/hi";

export default function Settings() {
  const user     = useAuthStore((s) => s.user);
  const signOut  = useAuthStore((s) => s.signOut);
  const theme    = useThemeStore((s) => s.theme);
  const toggle   = useThemeStore((s) => s.toggle);
  const { profile, updateProfile } = useProfile();

  // form states
  const [profileDraft, setProfileDraft] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [uploading, setUploading]     = useState(false);
  const [saving, setSaving]           = useState(false);
  const [msg, setMsg]                 = useState(null);

  const displayName = profileDraft?.display_name ?? profile?.display_name ?? "";
  const bio = profileDraft?.bio ?? profile?.bio ?? "";

  // handle avatar file upload
  async function handleAvatarUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

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
    }

    setUploading(false);
  }

  // save profile changes
  async function saveProfile() {
    setSaving(true);
    await updateProfile({ display_name: displayName, bio });
    setProfileDraft(null);
    setMsg("Profile saved!");
    setSaving(false);
  }

  // update password
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

  // delete account (soft — just sign out and remove profile)
  async function deleteAccount() {
    const confirmed = window.confirm(
      "Are you sure? This will delete your profile and sign you out."
    );
    if (!confirmed) return;

    await supabase.from("profiles").delete().eq("id", user.id);
    signOut();
  }

  // auto-dismiss the status message after a few seconds
  useEffect(() => {
    if (msg) {
      const t = setTimeout(() => setMsg(null), 3000);
      return () => clearTimeout(t);
    }
  }, [msg]);

  return (
    <PageWrapper className="max-w-2xl">
      <h1 className="text-2xl font-bold text-heading dark:text-white mb-8">Settings</h1>

      {/* toast message */}
      {msg && (
        <div className="mb-6 rounded-lg bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 px-4 py-3 text-sm text-brand-700 dark:text-brand-300">
          {msg}
        </div>
      )}

      {/* --- Profile Section --- */}
      <section className="rounded-2xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 p-6 mb-6">
        <h2 className="text-lg font-semibold text-heading dark:text-white mb-5">Profile</h2>

        {/* avatar upload */}
        <div className="flex items-center gap-5 mb-6">
          <Avatar
            src={profile?.avatar_url}
            name={profile?.display_name}
            size="lg"
          />
          <div>
            <label className="inline-flex items-center gap-2 rounded-lg border border-border dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-2 text-sm font-medium text-heading dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors cursor-pointer">
              <HiOutlineUpload className="w-4 h-4" />
              {uploading ? "Uploading…" : "Upload Avatar"}
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
            <p className="text-xs text-muted mt-1">Max 2 MB, JPG or PNG</p>
          </div>
        </div>

        <div className="space-y-4">
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

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-heading dark:text-slate-200">Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) =>
                setProfileDraft((prev) => ({
                  display_name: prev?.display_name ?? profile?.display_name ?? "",
                  bio: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-border dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-heading dark:text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
            />
          </div>

          <Button onClick={saveProfile} disabled={saving}>
            {saving ? "Saving…" : "Save Profile"}
          </Button>
        </div>
      </section>

      {/* --- Theme Section --- */}
      <section className="rounded-2xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 p-6 mb-6">
        <h2 className="text-lg font-semibold text-heading dark:text-white mb-4">Appearance</h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-heading dark:text-white">Dark Mode</p>
            <p className="text-xs text-muted mt-0.5">Switch between light and dark theme</p>
          </div>

          <button
            onClick={toggle}
            className={
              "relative w-14 h-7 rounded-full transition-colors cursor-pointer " +
              (theme === "dark" ? "bg-brand-600" : "bg-slate-300")
            }
          >
            <span
              className={
                "absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform flex items-center justify-center " +
                (theme === "dark" ? "translate-x-7" : "")
              }
            >
              {theme === "dark"
                ? <HiOutlineMoon className="w-3.5 h-3.5 text-brand-600" />
                : <HiOutlineSun className="w-3.5 h-3.5 text-amber-500" />
              }
            </span>
          </button>
        </div>
      </section>

      {/* --- Account / Password --- */}
      <section className="rounded-2xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 p-6 mb-6">
        <h2 className="text-lg font-semibold text-heading dark:text-white mb-5">Account</h2>

        <div className="space-y-4">
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
            placeholder="••••••••"
          />

          <Button variant="secondary" onClick={changePassword}>
            Update Password
          </Button>
        </div>
      </section>

      {/* --- Danger Zone --- */}
      <section className="rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10 p-6">
        <h2 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">Danger Zone</h2>
        <p className="text-sm text-red-600 dark:text-red-400/80 mb-4">
          Deleting your account removes your profile and signs you out. This can't be undone easily.
        </p>
        <Button variant="danger" onClick={deleteAccount}>
          Delete Account
        </Button>
      </section>
    </PageWrapper>
  );
}
