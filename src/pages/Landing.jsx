/*
  Landing.jsx
  -----------
  AI-themed hero landing page for BuildSpace.
  Features: mesh gradient background, floating orbs,
  animated stats, glassmorphic feature cards, interactive
  timeline, and live feed preview.
*/

import { Link } from "react-router-dom";
import {
  HiOutlineUserGroup,
  HiOutlineSparkles,
  HiOutlineBriefcase,
  HiOutlineLightningBolt,
  HiOutlineCode,
  HiOutlineGlobe,
} from "react-icons/hi";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

/* ——— Data ——— */
const pillars = [
  {
    icon: HiOutlineUserGroup,
    title: "Developer Profiles",
    desc: "A focused profile that showcases skills, interests, and projects in one place.",
    accent: "from-violet-500 to-purple-600",
  },
  {
    icon: HiOutlineSparkles,
    title: "Project Collaboration",
    desc: "Build teams faster with project cards, role visibility, and clear contribution flow.",
    accent: "from-cyan-400 to-blue-500",
  },
  {
    icon: HiOutlineBriefcase,
    title: "Opportunity Board",
    desc: "Discover hackathons, open roles, and team openings from one structured board.",
    accent: "from-emerald-400 to-teal-500",
  },
];

const stats = [
  { value: "Find Teams", label: "Skill-based matching" },
  { value: "Real-time", label: "Live activity feed" },
  { value: "Open Source", label: "React + Supabase" },
];

const journeySteps = [
  {
    num: "01",
    title: "Build your profile",
    text: "Show your skills, interests, and past projects so the right teammates can find you faster.",
    icon: HiOutlineCode,
  },
  {
    num: "02",
    title: "Create or join projects",
    text: "Post project ideas with your tech stack, invite collaborators, and track team progress.",
    icon: HiOutlineUserGroup,
  },
  {
    num: "03",
    title: "Discover opportunities",
    text: "Browse hackathon openings, project roles, and teammate requests from one board.",
    icon: HiOutlineGlobe,
  },
];

const feedPreview = [
  { user: "Nisha", action: "created a Next.js + Supabase project and invited frontend collaborators.", time: "2m ago" },
  { user: "Arjun", action: "posted an opening for a hackathon AI engineer role.", time: "5m ago" },
  { user: "Team GridFlow", action: "closed a milestone and published progress update.", time: "12m ago" },
];

/* ——— Component ——— */
export default function Landing() {
  return (
    <div className="relative overflow-hidden">

      {/* ══════ HERO SECTION ══════ */}
      <section className="relative min-h-[90vh] flex items-center justify-center mesh-gradient">
        {/* floating orbs */}
        <div className="absolute top-20 left-[15%] w-72 h-72 rounded-full bg-violet-600/20 blur-[100px] animate-float" />
        <div className="absolute bottom-20 right-[10%] w-80 h-80 rounded-full bg-cyan-500/15 blur-[120px] animate-float-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-500/5 blur-[150px]" />

        {/* grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 app-shell py-20 sm:py-28">
          <div className="mx-auto max-w-4xl text-center">
            {/* pill badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-300 animate-fade-up backdrop-blur-sm">
              <HiOutlineLightningBolt className="h-3.5 w-3.5 text-cyan-400" />
              Collaboration Platform for Student Developers
            </div>

            {/* headline */}
            <h1 className="mt-8 font-display text-5xl sm:text-7xl font-bold tracking-tight leading-[1.1] animate-fade-up delay-100">
              <span className="text-white">Build projects with the</span>
              <br />
              <span className="text-gradient">right people, faster.</span>
            </h1>

            {/* sub-headline */}
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 animate-fade-up delay-200">
              BuildSpace unifies developer profiles, team formation, and opportunity
              discovery into a single professional platform — built for IIT Madras SDC Hack Week.
            </p>

            {/* CTA buttons */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-up delay-300">
              <Link to="/auth">
                <Button size="lg">
                  <HiOutlineLightningBolt className="w-5 h-5" />
                  Start Building
                </Button>
              </Link>
              <Link to="/projects">
                <Button variant="secondary" size="lg">
                  Explore Projects
                </Button>
              </Link>
            </div>

            {/* tech stack badges */}
            <div className="mt-8 flex items-center justify-center gap-2 animate-fade-up delay-400">
              <span className="text-xs text-slate-500 mr-1">Built with</span>
              <Badge color="brand">React</Badge>
              <Badge color="cyan">Supabase</Badge>
              <Badge color="brand">Vite</Badge>
              <Badge color="slate">Tailwind</Badge>
            </div>
          </div>
        </div>

        {/* bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a1a] to-transparent" />
      </section>

      {/* ══════ STATS BAR ══════ */}
      <section className="relative z-10 -mt-8 app-shell">
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((item) => (
            <div
              key={item.label}
              className="card px-6 py-5 text-center animate-fade-up"
            >
              <p className="text-2xl font-display font-bold text-gradient">{item.value}</p>
              <p className="mt-1 text-sm text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ FEATURES ══════ */}
      <section className="app-shell py-24">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Everything you need to&nbsp;
            <span className="text-gradient">collaborate</span>
          </h2>
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            From profile to production — BuildSpace gives you the tools to find teammates,
            manage projects, and discover opportunities.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {pillars.map((item, i) => (
            <div
              key={item.title}
              className={`card p-8 text-center animate-fade-up delay-${(i + 1) * 100}`}
            >
              {/* icon container with gradient */}
              <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} shadow-lg mb-6`}>
                <item.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-display font-semibold text-white mb-3">{item.title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ HOW IT WORKS — JOURNEY ══════ */}
      <section className="relative py-24 overflow-hidden">
        {/* subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-[150px]" />

        <div className="app-shell relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              From idea to <span className="text-gradient">shipped project</span>
            </h2>
            <p className="mt-4 text-slate-400">Three steps to start collaborating</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {journeySteps.map((step, i) => (
              <div
                key={step.num}
                className={`card p-6 sm:p-8 flex items-start gap-5 animate-fade-up delay-${(i + 1) * 100}`}
              >
                {/* step number */}
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                  <span className="text-white font-display font-bold text-sm">{step.num}</span>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-display font-semibold text-white mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.text}</p>
                </div>

                <step.icon className="w-6 h-6 text-violet-400/50 hidden sm:block flex-shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ LIVE FEED PREVIEW ══════ */}
      <section className="app-shell pb-24">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            <span className="text-gradient">Live</span> Activity
          </h2>
          <p className="mt-4 text-slate-400">See what the community is building right now</p>
        </div>

        <div className="max-w-2xl mx-auto card p-6">
          {/* terminal header */}
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-violet-500/10">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="ml-2 text-xs text-slate-500 font-mono">activity-feed.log</span>
          </div>

          <div className="space-y-3">
            {feedPreview.map((item, i) => (
              <div
                key={item.user}
                className={`flex items-start gap-3 rounded-xl bg-slate-800/50 border border-violet-500/5 px-4 py-3 animate-fade-up delay-${(i + 1) * 200}`}
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0 animate-soft-pulse" />
                <div className="flex-1">
                  <p className="text-sm text-slate-300">
                    <span className="font-semibold text-violet-300">{item.user}</span>{" "}
                    {item.action}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ CTA FOOTER ══════ */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-violet-600/10 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-violet-600/15 blur-[120px]" />

        <div className="app-shell relative z-10 text-center">
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white mb-4">
            Ready to find your <span className="text-gradient">dream team</span>?
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto mb-8">
            Join BuildSpace today and collaborate with student developers across the country.
          </p>
          <Link to="/auth">
            <Button size="lg">
              <HiOutlineLightningBolt className="w-5 h-5" />
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="border-t border-violet-500/10 py-8">
        <div className="app-shell flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>
            <span className="text-gradient font-display font-semibold">BuildSpace</span>
            &nbsp;— Built for IIT Madras SDC Hack Week 2026
          </p>
          <div className="flex items-center gap-4">
            <Link to="/projects" className="hover:text-white transition-colors">Projects</Link>
            <Link to="/opportunities" className="hover:text-white transition-colors">Opportunities</Link>
            <a
              href="https://github.com/Jaat2727/PENTAGON_SDC_BUILDSPACE_HACKATHON"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
