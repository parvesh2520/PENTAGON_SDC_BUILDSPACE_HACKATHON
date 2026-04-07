/*
  Landing.jsx
  -----------
  Premium tech-savvy hero landing page for BuildSpace.
  Features: animated particles, glowing orbs, terminal effects,
  code animations, glassmorphic cards, and cinematic transitions.
*/

import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  HiOutlineUserGroup,
  HiOutlineSparkles,
  HiOutlineBriefcase,
  HiOutlineLightningBolt,
  HiOutlineCode,
  HiOutlineGlobe,
  HiOutlineTerminal,
  HiOutlineCube,
  HiOutlineChip,
} from "react-icons/hi";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

/* ——— Data ——— */
const pillars = [
  {
    icon: HiOutlineUserGroup,
    title: "Developer Profiles",
    desc: "Showcase your skills, tech stack, and projects with a profile built for developers.",
    accent: "from-cyan-400 to-blue-500",
    glow: "cyan",
  },
  {
    icon: HiOutlineSparkles,
    title: "Project Collaboration",
    desc: "Find teammates, manage contributions, and ship projects together seamlessly.",
    accent: "from-emerald-400 to-teal-500",
    glow: "emerald",
  },
  {
    icon: HiOutlineBriefcase,
    title: "Opportunity Board",
    desc: "Discover hackathons, open roles, and team openings from one unified dashboard.",
    accent: "from-violet-400 to-purple-500",
    glow: "violet",
  },
];

const stats = [
  { value: "Find Teams", label: "Skill-based matching", icon: HiOutlineUserGroup },
  { value: "Real-time", label: "Live activity feed", icon: HiOutlineSparkles },
  { value: "Open Source", label: "React + Supabase", icon: HiOutlineCode },
];

const journeySteps = [
  {
    num: "01",
    title: "Build your profile",
    text: "Show your skills, tech stack, and past projects so the right teammates can find you.",
    icon: HiOutlineCode,
    code: "user.create({ skills, projects })",
  },
  {
    num: "02",
    title: "Create or join projects",
    text: "Post project ideas, define roles, invite collaborators, and track progress.",
    icon: HiOutlineCube,
    code: "project.addMember(user.id, 'lead')",
  },
  {
    num: "03",
    title: "Discover opportunities",
    text: "Browse hackathon openings, project roles, and collaboration requests.",
    icon: HiOutlineGlobe,
    code: "opportunities.filter({ type: 'hackathon' })",
  },
];

const feedPreview = [
  { user: "Nisha", action: "created a Next.js + Supabase project", time: "2m ago", type: "project" },
  { user: "Arjun", action: "posted an AI engineer role opening", time: "5m ago", type: "opportunity" },
  { user: "Team GridFlow", action: "published a milestone update", time: "12m ago", type: "update" },
  { user: "Priya", action: "joined as frontend developer", time: "18m ago", type: "join" },
];

const techStack = [
  { name: "React", color: "cyan" },
  { name: "Supabase", color: "emerald" },
  { name: "Vite", color: "yellow" },
  { name: "Tailwind", color: "cyan" },
  { name: "PostgreSQL", color: "blue" },
];

/* ——— Animated Code Lines Component ——— */
function AnimatedCode() {
  const codeLines = [
    { text: "const team = await findTeam({", delay: 0 },
    { text: "  skills: ['react', 'node'],", delay: 200 },
    { text: "  availability: 'immediate'", delay: 400 },
    { text: "});", delay: 600 },
    { text: "", delay: 800 },
    { text: "await project.ship();", delay: 1000 },
  ];

  return (
    <div className="font-mono text-sm space-y-1">
      {codeLines.map((line, i) => (
        <div
          key={i}
          className="animate-fade-up opacity-0"
          style={{ animationDelay: `${line.delay + 500}ms`, animationFillMode: "forwards" }}
        >
          <span className="text-slate-600 mr-3 select-none">{i + 1}</span>
          <span className="text-cyan-400">{line.text}</span>
        </div>
      ))}
    </div>
  );
}

/* ——— Floating Particles Background ——— */
function ParticleField() {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-cyan-400/30"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `particle-rise ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ——— Main Component ——— */
export default function Landing() {
  const [visibleStats, setVisibleStats] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisibleStats(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative overflow-hidden bg-[#030712]">

      {/* ══════ HERO SECTION ══════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute inset-0 cyber-grid opacity-30" />
        <ParticleField />

        {/* Floating orbs */}
        <div className="floating-orb floating-orb-cyan w-[500px] h-[500px] top-[-10%] left-[-10%] animate-float" />
        <div className="floating-orb floating-orb-blue w-[400px] h-[400px] bottom-[-5%] right-[-5%] animate-float-slow" />
        <div className="floating-orb floating-orb-purple w-[300px] h-[300px] top-[40%] right-[20%] animate-float-fast" />

        {/* Scan line effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-scan-line" />
        </div>

        <div className="relative z-10 app-shell py-24 sm:py-32">
          <div className="mx-auto max-w-5xl text-center">
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-2 text-xs font-semibold text-cyan-300 animate-fade-up backdrop-blur-sm mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              Collaboration Platform for Student Developers
            </div>

            {/* Main headline with gradient */}
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] animate-fade-up delay-100">
              <span className="text-white">Build projects with</span>
              <br />
              <span className="text-gradient text-neon">the right people.</span>
            </h1>

            {/* Sub-headline */}
            <p className="mx-auto mt-8 max-w-2xl text-lg sm:text-xl leading-relaxed text-slate-400 animate-fade-up delay-200 text-balance">
              BuildSpace unifies developer profiles, team formation, and opportunity
              discovery into a single professional platform.
            </p>

            {/* CTA buttons */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4 animate-fade-up delay-300">
              <Link to="/auth">
                <Button size="lg" className="group relative overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    <HiOutlineLightningBolt className="w-5 h-5 group-hover:animate-wave" />
                    Start Building
                  </span>
                </Button>
              </Link>
              <Link to="/projects">
                <Button variant="secondary" size="lg" className="group">
                  <HiOutlineTerminal className="w-5 h-5" />
                  Explore Projects
                </Button>
              </Link>
            </div>

            {/* Tech stack */}
            <div className="mt-10 flex items-center justify-center gap-3 flex-wrap animate-fade-up delay-400">
              <span className="text-xs text-slate-500 mr-2">Built with</span>
              {techStack.map((tech, i) => (
                <Badge 
                  key={tech.name} 
                  color={tech.color}
                  className={`animate-fade-up`}
                  style={{ animationDelay: `${450 + i * 50}ms` }}
                >
                  {tech.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Code preview window */}
          <div className="mt-16 mx-auto max-w-2xl animate-fade-up delay-500">
            <div className="terminal shadow-2xl shadow-cyan-500/10">
              <div className="terminal-header">
                <div className="terminal-dot bg-red-500/80" />
                <div className="terminal-dot bg-yellow-500/80" />
                <div className="terminal-dot bg-green-500/80" />
                <span className="ml-3 text-xs text-slate-500 font-mono">buildspace.js</span>
              </div>
              <div className="terminal-body p-6">
                <AnimatedCode />
                <div className="mt-4 flex items-center gap-2 text-emerald-400">
                  <span className="animate-blink">|</span>
                  <span className="text-xs opacity-60">Ready to collaborate...</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#030712] to-transparent" />
      </section>

      {/* ══════ STATS BAR ══════ */}
      <section className="relative z-10 -mt-16 app-shell">
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((item, i) => (
            <div
              key={item.label}
              className={`card p-6 text-center group hover-glow ${visibleStats ? 'animate-fade-up' : 'opacity-0'}`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <item.icon className="w-8 h-8 text-cyan-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-2xl font-display font-bold text-gradient">{item.value}</p>
              <p className="mt-1 text-sm text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ FEATURES ══════ */}
      <section className="app-shell py-32">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 text-cyan-400 text-sm font-semibold mb-4">
            <HiOutlineChip className="w-4 h-4" />
            <span>CORE FEATURES</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white text-balance">
            Everything you need to
            <span className="text-gradient"> collaborate</span>
          </h2>
          <p className="mt-6 text-slate-400 max-w-xl mx-auto text-lg">
            From profile to production — complete tools for finding teammates,
            managing projects, and discovering opportunities.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {pillars.map((item, i) => (
            <div
              key={item.title}
              className="card p-8 text-center group hover-lift animate-fade-up"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.accent} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              {/* Icon */}
              <div className={`relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} shadow-lg shadow-${item.glow}-500/25 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <item.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-display font-semibold text-white mb-3">{item.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ HOW IT WORKS ══════ */}
      <section className="relative py-32 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-cyan-500/5 blur-[150px]" />

        <div className="app-shell relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 text-cyan-400 text-sm font-semibold mb-4">
              <HiOutlineTerminal className="w-4 h-4" />
              <span>HOW IT WORKS</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
              From idea to <span className="text-gradient">shipped project</span>
            </h2>
            <p className="mt-6 text-slate-400 text-lg">Three steps to start collaborating</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {journeySteps.map((step, i) => (
              <div
                key={step.num}
                className="card p-8 group hover-lift animate-fade-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  {/* Step number */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-110 transition-transform">
                    <span className="text-white font-display font-bold text-lg">{step.num}</span>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-display font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-slate-400 leading-relaxed mb-4">{step.text}</p>
                    
                    {/* Code snippet */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-cyan-500/10 font-mono text-sm">
                      <span className="text-cyan-400">&gt;</span>
                      <span className="text-slate-300">{step.code}</span>
                    </div>
                  </div>

                  <step.icon className="hidden sm:block w-8 h-8 text-cyan-400/30 flex-shrink-0 group-hover:text-cyan-400/60 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ LIVE FEED PREVIEW ══════ */}
      <section className="app-shell pb-32">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-cyan-400 text-sm font-semibold mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span>LIVE ACTIVITY</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
            See what the community is
            <span className="text-gradient"> building</span>
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="terminal shadow-2xl shadow-cyan-500/10">
            <div className="terminal-header">
              <div className="terminal-dot bg-red-500/80" />
              <div className="terminal-dot bg-yellow-500/80" />
              <div className="terminal-dot bg-green-500/80" />
              <span className="ml-3 text-xs text-slate-500 font-mono">activity-feed.log</span>
              <span className="ml-auto text-xs text-cyan-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-soft-pulse" />
                Live
              </span>
            </div>

            <div className="p-6 space-y-4">
              {feedPreview.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 rounded-xl bg-slate-800/30 border border-cyan-500/5 px-5 py-4 animate-fade-up group hover:border-cyan-500/20 transition-all"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0 animate-soft-pulse" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300">
                      <span className="font-semibold text-cyan-300">{item.user}</span>{" "}
                      {item.action}
                    </p>
                    <p className="text-xs text-slate-600 mt-1 font-mono">{item.time}</p>
                  </div>
                  <Badge 
                    color={item.type === 'project' ? 'cyan' : item.type === 'opportunity' ? 'yellow' : item.type === 'join' ? 'green' : 'slate'} 
                    className="text-[10px] opacity-60 group-hover:opacity-100 transition-opacity"
                  >
                    {item.type}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════ CTA FOOTER ══════ */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-600/5 to-transparent" />
        <div className="floating-orb floating-orb-cyan w-[600px] h-[600px] bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2" />
        <div className="absolute inset-0 cyber-grid opacity-20" />

        <div className="app-shell relative z-10 text-center">
          <div className="inline-flex items-center gap-2 text-cyan-400 text-sm font-semibold mb-6 animate-fade-up">
            <HiOutlineLightningBolt className="w-4 h-4" />
            <span>GET STARTED</span>
          </div>
          
          <h2 className="font-display text-4xl sm:text-6xl font-bold text-white mb-6 animate-fade-up delay-100 text-balance">
            Ready to find your <span className="text-gradient text-neon">dream team</span>?
          </h2>
          
          <p className="text-slate-400 max-w-lg mx-auto mb-10 text-lg animate-fade-up delay-200">
            Join BuildSpace today and collaborate with student developers across the country.
          </p>
          
          <div className="animate-fade-up delay-300">
            <Link to="/auth">
              <Button size="lg" className="group">
                <HiOutlineLightningBolt className="w-5 h-5 group-hover:animate-wave" />
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="border-t border-cyan-500/10 py-10 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
        <div className="app-shell relative flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <p className="flex items-center gap-2">
            <span className="text-gradient font-display font-semibold text-lg">BuildSpace</span>
            <span className="text-slate-600">|</span>
            <span>Built for IIT Madras SDC Hack Week 2026</span>
          </p>
          <div className="flex items-center gap-6">
            <Link to="/projects" className="hover:text-cyan-400 transition-colors">Projects</Link>
            <Link to="/opportunities" className="hover:text-cyan-400 transition-colors">Opportunities</Link>
            <a
              href="https://github.com/Jaat2727/PENTAGON_SDC_BUILDSPACE_HACKATHON"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
