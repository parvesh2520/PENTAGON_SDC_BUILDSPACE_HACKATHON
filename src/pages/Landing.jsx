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

const outcomes = [
  "Find the right teammates quickly",
  "Showcase your profile with credibility",
  "Track projects and collaboration clearly",
  "Stay updated on opportunities in real-time",
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

      <section className="app-shell py-12 sm:py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((item) => (
            <article key={item.title} className="panel panel-hover p-6">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="app-shell">
        <div className="panel p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="section-title">A focused workflow from profile to shipped project</h2>
              <p className="section-subtitle mt-3">
                Designed for hackathons, campus clubs, and early career builders who need speed without chaos.
              </p>
              <ul className="mt-6 space-y-3">
                {outcomes.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                    <HiOutlineCheckCircle className="h-4 w-4 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

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
