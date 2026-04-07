import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { strategySkills, toolSkills, agents } from "@/lib/site-data";

export const metadata = {
  title: "Skills — 36 Skills, 12 Tool Integrations, 9,000+ Lines of Expertise",
  description:
    "The knowledge base that powers every RankedFirst.ai agent. 23 strategy skills covering every facet of local SEO, plus 12 deep-dive tool skills for every platform in the stack.",
};

const stats = [
  { value: "36", label: "Total skills" },
  { value: "12", label: "Tool integrations" },
  { value: "9,000+", label: "Lines of expertise" },
  { value: "7", label: "Agents powered" },
];

export default function SkillsPage() {
  const totalSkills = strategySkills.length + toolSkills.length;

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
            <span className="text-navy-200">Skills</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="h-px w-6 bg-accent-500 inline-block" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">
                Knowledge Base
              </span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6">
              {totalSkills} skills.{" "}
              <span className="text-accent-400">12 tool integrations.</span>{" "}
              9,000+ lines of expertise.
            </h1>
            <p className="text-lg sm:text-xl text-navy-300 leading-relaxed max-w-2xl mb-10">
              Skills are the knowledge base that powers every agent decision. Not generic SEO advice — deep, practitioner-built expertise covering every tactic, tool, and edge case in local search.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-10 border-y border-navy-800 bg-navy-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display font-bold text-4xl text-accent-400 mb-1">{stat.value}</div>
                <div className="text-sm text-navy-400 font-mono uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Are Skills */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="h-px w-6 bg-accent-500 inline-block" />
                <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">What Are Skills?</span>
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-6">
                The expertise layer behind every agent action
              </h2>
              <div className="space-y-4 text-navy-300 leading-relaxed">
                <p>
                  Skills aren't prompts — they're comprehensive knowledge documents covering strategy, process, best practices, edge cases, and tool-specific workflows for every major area of local SEO.
                </p>
                <p>
                  When an agent runs a GBP audit, it draws on the <span className="font-mono text-accent-300 text-sm">gbp-optimization</span> skill — which encodes years of practitioner knowledge about what matters, what's changed, and what to look for.
                </p>
                <p>
                  When it submits citation corrections through BrightLocal, it uses the <span className="font-mono text-accent-300 text-sm">brightlocal-tool</span> skill — deep operational knowledge of the platform's API, workflows, and quirks.
                </p>
              </div>
            </div>
            <div className="bg-navy-900 border border-navy-800 rounded-2xl p-8">
              <div className="font-mono text-sm text-navy-400 mb-4 uppercase tracking-wider">How skills power agents</div>
              <div className="space-y-3">
                {agents.slice(0, 4).map((agent) => (
                  <div key={agent.slug} className="flex items-start gap-3">
                    <div className="flex items-center gap-1.5 mt-1 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-mono text-xs text-white">{agent.shortName}</span>
                      <span className="text-navy-600 text-xs mx-2">→</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {agent.relatedSkills.map((skill) => (
                          <span key={skill} className="font-mono text-xs bg-navy-800 text-accent-400/70 px-1.5 py-0.5 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pt-2 text-xs text-navy-500 font-mono">...and {agents.length - 4} more agents</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Grid: Strategy */}
      <section className="py-16 md:py-24 bg-navy-900/40 border-y border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Strategy Skills */}
            <div>
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="h-px w-6 bg-accent-500 inline-block" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">Strategy Skills</span>
                </div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-2">
                  {strategySkills.length} strategy skills
                </h2>
                <p className="text-navy-300 text-sm">
                  Every tactic, channel, and workflow in local SEO — encoded as deep expertise.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {strategySkills.map((skill) => (
                  <span
                    key={skill}
                    className="font-mono text-xs bg-navy-900 border border-navy-800 hover:border-accent-500/30 text-navy-300 hover:text-accent-300 px-3 py-2 rounded-lg transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Tool Skills */}
            <div>
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="h-px w-6 bg-accent-500 inline-block" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">Tool Skills</span>
                </div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-2">
                  {toolSkills.length} tool skills
                </h2>
                <p className="text-navy-300 text-sm">
                  Platform-specific expertise for every tool in the local SEO stack.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {toolSkills.map((skill) => (
                  <span
                    key={skill}
                    className="font-mono text-xs bg-navy-900 border border-navy-800 hover:border-accent-500/30 text-navy-300 hover:text-accent-300 px-3 py-2 rounded-lg transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Skills Power Everything */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Why It Matters"
            title="Skills are what separate AI execution from AI guessing"
            description="Any AI can run an SEO audit. Only AI with deep, practitioner-built skills can prioritize the right fixes, in the right order, for the right reasons."
          />

          <div className="mt-14 grid sm:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
                    <path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                title: "Practitioner-built",
                body: "Every skill document reflects real-world experience — what actually moves rankings, what Google actually cares about, what tools actually do.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
                    <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                title: "Always current",
                body: "Local SEO changes constantly. Our skill library is maintained and updated as Google, AI platforms, and local search evolve.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
                    <path d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                title: "Action-oriented",
                body: "Skills don't just encode knowledge — they encode decision logic. What to do when, how to prioritize, what to escalate.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-navy-900 border border-navy-800 rounded-xl p-8">
                <div className="w-10 h-10 rounded-xl bg-accent-500/10 text-accent-400 flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-3">{item.title}</h3>
                <p className="text-navy-300 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-navy-900/40 border-t border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy-900 border border-accent-500/20 rounded-3xl px-8 py-16 md:py-20 text-center">
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-6">
              Ready to rank first?
            </h2>
            <p className="text-navy-300 text-lg mb-10 max-w-xl mx-auto">
              Put 36 skills and 7 autonomous agents to work on your local visibility — starting with a free audit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact" size="lg" variant="primary">
                Get your free audit
              </Button>
              <Button href="/agents" size="lg" variant="secondary">
                Meet the agents
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
