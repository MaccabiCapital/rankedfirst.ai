import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { agents, strategySkills } from "@/lib/site-data";

export const metadata = {
  title: "Autonomous Agents — AI-Powered Local SEO Execution",
  description:
    "7 specialized autonomous agents that handle GBP optimization, geogrid analysis, review management, citation audits, LSA monitoring, AI visibility tracking, and client reporting — 24/7.",
};

const howItWorks = [
  {
    step: "01",
    title: "Connect",
    body: "Link your Google Business Profile, data tools, and reporting preferences. One-time setup that takes minutes.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Configure",
    body: "Set your target keywords, service area, audit frequency, and reporting cadence. Agents adapt to your business.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Execute",
    body: "Agents run autonomously on your schedule — scanning, auditing, drafting, and detecting. No manual trigger needed.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    step: "04",
    title: "Review",
    body: "Findings surface as prioritized tasks and narrative reports. You review, approve, and act — or let our team handle it.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function AgentsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-navy-800)_0%,_transparent_60%)] opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8 font-mono">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-navy-200">Agents</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="h-px w-6 bg-accent-500 inline-block" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">
                {agents.length} Autonomous Agents
              </span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6">
              Autonomous agents that execute local SEO tasks{" "}
              <span className="text-accent-400">24/7</span>
            </h1>
            <p className="text-lg sm:text-xl text-navy-300 leading-relaxed max-w-2xl mb-10">
              Each agent is purpose-built for a specific piece of your local visibility — running on your schedule, surfacing what matters, so nothing slips through the cracks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/contact" size="lg" variant="primary">
                Get started
              </Button>
              <Button href="#agents" size="lg" variant="secondary">
                Browse agents
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How Agents Work */}
      <section className="py-16 md:py-20 bg-navy-900/40 border-y border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="How It Works"
            title="Connect once. Run forever."
            description="Agents plug into your existing tools and data sources — then run autonomously on whatever cadence you set."
          />
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step) => (
              <div key={step.step} className="flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-accent-500/10 text-accent-400 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="font-mono text-2xl font-bold text-accent-500/25">{step.step}</span>
                </div>
                <h3 className="font-display font-bold text-lg text-white">{step.title}</h3>
                <p className="text-navy-300 text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agent Grid */}
      <section id="agents" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="The Roster"
            title={`${agents.length} agents. Every local SEO task covered.`}
            description="From GBP audits to AI visibility monitoring, each agent handles a distinct part of your local visibility — and feeds insights to the reporting agent."
          />

          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {agents.map((agent) => (
              <Link
                key={agent.slug}
                href={`/agents/${agent.slug}`}
                className="group bg-navy-900 border border-navy-800 hover:border-accent-500/40 rounded-xl p-6 flex flex-col transition-all duration-200 hover:-translate-y-0.5"
              >
                {/* Status + Arrow */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Active</span>
                  </div>
                  <svg className="w-4 h-4 text-navy-600 group-hover:text-accent-400 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M7 17 17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* Name */}
                <h2 className="font-mono font-semibold text-white group-hover:text-accent-300 transition-colors mb-1 text-sm leading-snug">
                  {agent.name}
                </h2>

                {/* Tagline */}
                <p className="text-xs text-navy-400 italic mb-3">{agent.tagline}</p>

                {/* Description */}
                <p className="text-sm text-navy-300 leading-relaxed flex-1">{agent.description}</p>

                {/* Tags from data sources */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {agent.dataSources.slice(0, 2).map((src) => (
                    <span key={src} className="text-xs font-mono bg-navy-800 text-navy-400 px-2 py-0.5 rounded">
                      {src}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Callout */}
      <section className="py-12 bg-navy-900/40 border-y border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-navy-500 mb-2">Powered by</p>
              <h2 className="font-display font-bold text-2xl text-white">
                {strategySkills.length}+ strategy skills + 12 tool skills
              </h2>
              <p className="text-navy-300 mt-1">
                The knowledge base behind every agent decision.
              </p>
            </div>
            <Button href="/skills" variant="secondary" size="md">
              Explore the skills library →
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy-900 border border-accent-500/20 rounded-3xl px-8 py-16 md:py-20 text-center">
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-6">
              Ready to rank first?
            </h2>
            <p className="text-navy-300 text-lg mb-10 max-w-xl mx-auto">
              Set up your agent stack and let autonomous execution handle the tasks that used to eat your team's time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact" size="lg" variant="primary">
                Start with a strategy session
              </Button>
              <Button href="/services" size="lg" variant="secondary">
                Explore our services
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
