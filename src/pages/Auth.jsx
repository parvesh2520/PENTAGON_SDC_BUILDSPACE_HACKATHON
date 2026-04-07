/*
  Auth.jsx
  --------
  Premium cyberpunk login/signup page with terminal aesthetics.
  Features GitHub OAuth + email/password with neon accents.
*/

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { HiOutlineLightningBolt, HiOutlineCode, HiOutlineTerminal } from "react-icons/hi";
import { FaGithub } from "react-icons/fa";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

/* Animated code background */
function CodeBackground() {
  const lines = [
    "const developer = await auth.signIn();",
    "if (developer.verified) {",
    "  await team.join(developer);",
    "  console.log('Welcome to BuildSpace');",
    "}",
    "",
    "// Find your dream team",
    "const teammates = await search({",
    "  skills: ['react', 'node'],",
    "  available: true",
    "});",
    "",
    "await project.create({",
    "  name: 'Next Big Thing',",
    "  team: teammates",
    "});",
  ];

  return (
    <div className="absolute inset-0 overflow-hidden opacity-[0.03] pointer-events-none font-mono text-xs leading-relaxed">
      <div className="absolute inset-0 flex flex-col justify-center items-center">
        {lines.map((line, i) => (
          <div
            key={i}
            className="animate-fade-up text-cyan-400"
            style={{ animationDelay: `${i * 200}ms` }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

/* Floating particles */
function Particles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-cyan-400/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `float ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

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
    <div className="relative min-h-screen flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 mesh-gradient" />
      <div className="absolute inset-0 cyber-grid opacity-30" />
      <CodeBackground />
      <Particles />

      {/* Floating orbs */}
      <div className="floating-orb floating-orb-cyan w-[400px] h-[400px] top-[-10%] left-[-10%] animate-float" />
      <div className="floating-orb floating-orb-blue w-[300px] h-[300px] bottom-[-5%] right-[10%] animate-float-slow" />

      <div className="relative z-10 w-full max-w-md animate-fade-up">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-500/30 mb-6 animate-glow-pulse">
            <HiOutlineCode className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-4xl font-bold text-white animate-fade-up delay-100">
            {isLogin ? "Welcome back" : "Join BuildSpace"}
          </h1>
          <p className="text-slate-400 mt-3 animate-fade-up delay-200">
            {isLogin
              ? "Log in to continue building amazing projects."
              : "Create your account and start collaborating."}
          </p>
        </div>

        {/* Form card */}
        <div className="card p-8 animate-fade-up delay-300">
          {/* GitHub OAuth */}
          <button
            onClick={signInWithGitHub}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-cyan-500/20 bg-slate-800/60 px-4 py-4 text-sm font-semibold text-white hover:bg-slate-700/60 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10 transition-all cursor-pointer group"
          >
            <FaGithub className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Continue with GitHub
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
            <span className="text-xs text-slate-500 uppercase tracking-wider font-medium px-2">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="Enter your password"
            />

            {error && (
              <div className="flex items-start gap-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 animate-fade-up">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              <HiOutlineLightningBolt className="w-4 h-4" />
              {loading ? "Please wait..." : isLogin ? "Log In" : "Create Account"}
            </Button>
          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-slate-500 mt-8">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(null); }}
              className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors cursor-pointer"
            >
              {isLogin ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>

        {/* Terminal footer */}
        <div className="mt-8 text-center animate-fade-up delay-500">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/40 border border-cyan-500/10 font-mono text-xs text-slate-500">
            <HiOutlineTerminal className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400/60">&gt;</span>
            <span>Ready to authenticate...</span>
            <span className="w-2 h-4 bg-cyan-400/60 animate-blink" />
          </div>
        </div>
      </div>
    </div>
  );
}
