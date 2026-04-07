/*
  Landing.jsx
  -----------
  Public home page — the first thing visitors see.
  Sections: hero, features grid, live feed preview, footer.
  No auth needed to view this page.
*/

import { Link } from "react-router-dom";
import { HiOutlineUser, HiOutlineFolder, HiOutlineLightningBolt } from "react-icons/hi";
import Button from "../components/ui/Button";

// the 3 feature cards in the middle section
const features = [
  {
    icon: HiOutlineUser,
    title: "Developer Profiles",
    desc: "Showcase your skills, link GitHub and LinkedIn, and let teams discover you based on your tech stack.",
  },
  {
    icon: HiOutlineFolder,
    title: "Team Projects",
    desc: "Create projects, invite collaborators, and track your team — all from one place.",
  },
  {
    icon: HiOutlineLightningBolt,
    title: "Opportunities",
    desc: "Find hackathon partners, open roles, or teammates hunting for exactly your skill set.",
  },
];

const highlights = [
  { label: "Unified developer identity", value: "1 profile" },
  { label: "Collaboration workflows", value: "Projects + teams" },
  { label: "Opportunity discovery", value: "Hackathons + roles" },
];

const journeySteps = [
  {
    title: "Build your profile",
    text: "Show your skills, interests, and past projects so the right teammates can find you faster.",
  },
  {
    title: "Create or join projects",
    text: "Post project ideas with your tech stack, invite collaborators, and track team progress.",
  },
  {
    title: "Discover opportunities",
    text: "Browse hackathon openings, project roles, and teammate requests from one board.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* ======== HERO ======== */}
      <section className="relative overflow-hidden">
        {/* gradient blobs for visual interest */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 py-24 sm:py-36 text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-heading dark:text-white leading-tight">
            Where developers{" "}
            <span className="text-brand-600 dark:text-brand-400">build together</span>
          </h1>

          <p className="mt-5 text-lg text-body dark:text-slate-400 max-w-2xl mx-auto">
            Find your next teammate, launch a side project, or land a hackathon
            squad — BuildSpace connects builders who ship.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/auth">
              <Button size="lg">Get Started — it's free</Button>
            </Link>
            <Link to="/projects">
              <Button variant="secondary" size="lg">Explore Projects</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ======== HIGHLIGHTS ======== */}
      <section className="mx-auto max-w-6xl px-4 pb-6 sm:pb-10">
        <div className="grid gap-3 sm:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-border dark:border-slate-700 bg-white/90 dark:bg-slate-800/80 p-5 text-center"
            >
              <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">{item.value}</p>
              <p className="mt-1 text-sm text-body dark:text-slate-300">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ======== FEATURES ======== */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-heading dark:text-white text-center mb-12">
          Everything you need to collaborate
        </h2>

        <div className="grid gap-8 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 p-7 text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/30 mb-5">
                <f.icon className="w-7 h-7 text-brand-600 dark:text-brand-400" />
              </div>
              <h3 className="text-lg font-semibold text-heading dark:text-white mb-2">{f.title}</h3>
              <p className="text-sm text-body dark:text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ======== BUILDER JOURNEY ======== */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-2xl font-bold text-heading dark:text-white text-center mb-8">
          From idea to shipped project
        </h2>

        <div className="space-y-4">
          {journeySteps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 p-5 sm:p-6"
            >
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-full bg-brand-600 text-white text-sm font-semibold flex items-center justify-center shrink-0">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-heading dark:text-white">{step.title}</h3>
                  <p className="mt-1 text-sm text-body dark:text-slate-300">{step.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======== LIVE FEED PREVIEW ======== */}
      <section className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="text-2xl font-bold text-heading dark:text-white text-center mb-8">
          Live Activity
        </h2>

        <div className="space-y-4">
          {/* fake preview cards — just to give a feel for the feed */}
          {[
            { user: "Ananya S.", text: "Just launched a new React + Supabase starter template!", time: "2m ago", tag: "project" },
            { user: "Rahul K.",  text: "Looking for a Python dev for our ML hackathon team 🚀", time: "8m ago", tag: "opportunity" },
            { user: "Priya M.",  text: "Updated the landing page design for TeamSync project", time: "15m ago", tag: "update" },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 p-5 animate-fade-up"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-xs font-bold text-brand-700 dark:text-brand-300">
                  {item.user.charAt(0)}
                </div>
                <span className="text-sm font-medium text-heading dark:text-white">{item.user}</span>
                <span className="text-xs text-muted ml-auto">{item.time}</span>
              </div>
              <p className="text-sm text-body dark:text-slate-300">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ======== FOOTER ======== */}
      <footer className="border-t border-border dark:border-slate-700 bg-surface-alt dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} BuildSpace — built with ☕ and Supabase
          </p>
          <div className="flex gap-6 text-sm text-muted">
            <Link to="/projects" className="hover:text-heading dark:hover:text-white transition-colors">Projects</Link>
            <Link to="/opportunities" className="hover:text-heading dark:hover:text-white transition-colors">Opportunities</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-heading dark:hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
