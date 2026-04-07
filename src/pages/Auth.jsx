/*
  Auth.jsx
  --------
  Premium login/signup page with glassmorphic card.
  Features GitHub OAuth + email/password with gradient accents.
*/

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { FaGithub } from "react-icons/fa";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function Auth() {
  const navigate  = useNavigate();
  const { signUp, signIn, signInWithGitHub, loading, error, setError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    let ok;
    if (isLogin) {
      ok = await signIn({ email, password });
    } else {
      ok = await signUp({ email, password, displayName: name });
    }

    if (ok) navigate("/feed");
  }

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 py-12 mesh-gradient">
      {/* background orbs */}
      <div className="absolute top-20 left-[20%] w-60 h-60 rounded-full bg-violet-600/15 blur-[100px] animate-float" />
      <div className="absolute bottom-20 right-[20%] w-48 h-48 rounded-full bg-cyan-500/10 blur-[80px] animate-float-slow" />

      <div className="relative z-10 w-full max-w-md animate-fade-up">
        {/* header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/25 mb-4">
            <HiOutlineLightningBolt className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">
            {isLogin ? "Welcome back" : "Join BuildSpace"}
          </h1>
          <p className="text-slate-400 mt-2">
            {isLogin
              ? "Log in to pick up where you left off."
              : "Create your account and start collaborating."}
          </p>
        </div>

        {/* form card */}
        <div className="card p-6 sm:p-8">
          {/* GitHub OAuth */}
          <button
            onClick={signInWithGitHub}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-violet-500/20 bg-slate-800/60 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700/60 hover:border-violet-500/30 transition-all cursor-pointer"
          >
            <FaGithub className="w-5 h-5" />
            Continue with GitHub
          </button>

          {/* divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-violet-500/10" />
            <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">or</span>
            <div className="flex-1 h-px bg-violet-500/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <Input
                label="Display Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            )}

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Please wait…" : isLogin ? "Log In" : "Create Account"}
            </Button>
          </form>

          {/* toggle */}
          <p className="text-center text-sm text-slate-500 mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(null); }}
              className="text-violet-400 font-semibold hover:text-violet-300 transition-colors cursor-pointer"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
