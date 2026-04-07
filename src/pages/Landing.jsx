import { Link } from "react-router-dom";
import {
  HiOutlineUserGroup,
  HiOutlineSparkles,
  HiOutlineBriefcase,
  HiOutlineLightningBolt,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import Button from "../components/ui/Button";

const pillars = [
  {
    icon: HiOutlineUserGroup,
    title: "Developer Profiles",
    desc: "A focused profile that showcases skills, interests, and projects in one place.",
  },
  {
    icon: HiOutlineSparkles,
    title: "Project Collaboration",
    desc: "Build teams faster with project cards, role visibility, and clear contribution flow.",
  },
  {
    icon: HiOutlineBriefcase,
    title: "Opportunity Board",
    desc: "Discover hackathons, open roles, and team openings from one structured board.",
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
    <div className="pb-16">
      <section className="relative overflow-hidden border-b border-slate-200/60 dark:border-slate-800/70">
        <div className="absolute -top-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-500/15 blur-3xl" />
        <div className="absolute -bottom-24 right-10 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="app-shell relative py-20 sm:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-brand-50 px-4 py-1 text-xs font-medium text-brand-700 dark:border-brand-800 dark:bg-brand-900/30 dark:text-brand-300">
              <HiOutlineLightningBolt className="h-3.5 w-3.5" />
              Collaboration Platform for Student Developers
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
              Build projects with the
              <span className="block bg-gradient-to-r from-brand-600 to-violet-500 bg-clip-text text-transparent">
                right people, faster.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
              BuildSpace unifies profile building, team formation, and opportunity discovery into a single professional
              developer experience.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/auth">
                <Button size="lg">Start Building</Button>
              </Link>
              <Link to="/projects">
                <Button variant="secondary" size="lg">Explore Projects</Button>
              </Link>
            </div>
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
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.desc}</p>
            </article>
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

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/50">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Live Activity Preview</p>
              <div className="mt-4 space-y-3">
                {[
                  "Nisha created a Next.js + Supabase project and invited frontend collaborators.",
                  "Arjun posted an opening for a hackathon AI engineer role.",
                  "Team GridFlow closed a milestone and published progress update.",
                ].map((line) => (
                  <div
                    key={line}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
