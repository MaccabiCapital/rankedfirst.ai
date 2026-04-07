import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { agents, services } from "@/lib/site-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return agents.map((agent) => ({ slug: agent.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const agent = agents.find((a) => a.slug === slug);
  if (!agent) return {};
  return {
    title: `${agent.name} — Autonomous Local SEO`,
    description: agent.description,
  };
}

export default async function AgentDetailPage({ params }: Props) {
  const { slug } = await params;
  const agent = agents.find((a) => a.slug === slug);
  if (!agent) notFound();

  const relatedAgents = agents.filter((a) => a.slug !== agent.slug).slice(0, 3);
  const relatedServiceData = services.filter((s) =>
    agent.relatedServices.includes(s.slug)
  );

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: agent.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--color-accent-900)_0%,_transparent_50%)] opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8 font-mono">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/agents" className="hover:text-white transition-colors">Agents</Link>
            <span>/</span>
            <span className="text-navy-200">{agent.shortName}</span>
          </nav>

          <div className="max-w-3xl">
            {/* Status badge */}
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Agent Active</span>
            </div>

            <h1 className="font-mono font-bold text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-3">
              {agent.name}
            </h1>
            <p className="text-accent-400 font-display font-semibold text-lg mb-6 italic">
              {agent.tagline}
            </p>
            <p className="text-lg text-navy-300 leading-relaxed max-w-2xl mb-10">
              {agent.longDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/contact" size="lg" variant="primary">
                Activate this agent
              </Button>
              <Button href="/agents" size="lg" variant="secondary">
                View all agents
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-16 md:py-24 bg-navy-900/40 border-y border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="h-px w-6 bg-accent-500 inline-block" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">Capabilities</span>
              <span className="h-px w-6 bg-accent-500 inline-block" />
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
              What this agent does
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-3">
              {agent.capabilities.map((cap, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-navy-900 border border-navy-800 rounded-xl p-4"
                >
                  <div className="w-6 h-6 rounded-full bg-accent-500/10 text-accent-400 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-navy-200 text-sm leading-relaxed">{cap}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="h-px w-6 bg-accent-500 inline-block" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">Integrations</span>
              <span className="h-px w-6 bg-accent-500 inline-block" />
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
              Data sources & tools
            </h2>
            <p className="text-navy-300">
              This agent integrates with the following tools and platforms to gather and process data.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4">
              {agent.dataSources.map((source) => (
                <div
                  key={source}
                  className="bg-navy-900 border border-navy-800 rounded-xl px-6 py-4 flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent-500/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-accent-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <path d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 6 0m-6 0H3m16.5 0a3 3 0 0 0 3-3m-3 3a3 3 0 1 1-6 0m6 0h1.5m-7.5 0a3 3 0 0 1-3-3m3 3v.75M9 12.75a3 3 0 0 0 3 3m0 0a3 3 0 0 0 3-3M12 15.75V12m0 3.75v.75M12 12a3 3 0 0 1-3-3m3 3a3 3 0 0 0 3-3M12 12V8.25m0 3.75V8.25M12 8.25a3 3 0 0 1 3-3M9 8.25a3 3 0 0 0-3 3m3-3V6m-3 2.25H3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="font-display font-semibold text-white text-sm">{source}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Skills */}
      <section className="py-16 md:py-20 bg-navy-900/40 border-y border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="h-px w-6 bg-accent-500 inline-block" />
                <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">Knowledge Base</span>
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
                Related skills
              </h2>
            </div>
            <Button href="/skills" variant="ghost" size="sm">
              View all skills →
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {agent.relatedSkills.map((skill) => (
              <span
                key={skill}
                className="font-mono text-sm bg-navy-900 border border-navy-800 text-navy-300 px-3 py-1.5 rounded-lg"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services */}
      {relatedServiceData.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="h-px w-6 bg-accent-500 inline-block" />
                <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">Channels</span>
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
                Powers these services
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedServiceData.map((svc) => (
                <Link
                  key={svc.slug}
                  href={`/services/${svc.slug}`}
                  className="group bg-navy-900 border border-navy-800 hover:border-accent-500/30 rounded-xl p-6 transition-all duration-200"
                >
                  <h3 className="font-display font-bold text-white mb-2 group-hover:text-accent-300 transition-colors">
                    {svc.name}
                  </h3>
                  <p className="text-sm text-navy-300 leading-relaxed line-clamp-2">{svc.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-mono text-accent-400 group-hover:gap-2 transition-all">
                    Learn more →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-navy-900/40 border-y border-navy-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="h-px w-6 bg-accent-500 inline-block" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">FAQ</span>
              <span className="h-px w-6 bg-accent-500 inline-block" />
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
              Common questions
            </h2>
          </div>

          <div className="space-y-3">
            {agent.faq.map((item, i) => (
              <details
                key={i}
                className="group bg-navy-900 border border-navy-800 rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer px-6 py-5 list-none hover:bg-navy-800/50 transition-colors">
                  <span className="font-display font-semibold text-white leading-snug">{item.q}</span>
                  <svg
                    className="w-5 h-5 text-navy-400 shrink-0 transition-transform duration-200 group-open:rotate-45"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                  >
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 pt-1 text-navy-300 leading-relaxed text-sm border-t border-navy-800">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related Agents */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="h-px w-6 bg-accent-500 inline-block" />
                <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">The Ecosystem</span>
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
                Other agents in the stack
              </h2>
            </div>
            <Button href="/agents" variant="ghost" size="sm">
              View all agents →
            </Button>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {relatedAgents.map((ra) => (
              <Link
                key={ra.slug}
                href={`/agents/${ra.slug}`}
                className="group bg-navy-900 border border-navy-800 hover:border-accent-500/30 rounded-xl p-6 transition-all duration-200"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Active</span>
                </div>
                <h3 className="font-mono font-semibold text-white group-hover:text-accent-300 transition-colors mb-1 text-sm">
                  {ra.name}
                </h3>
                <p className="text-xs text-navy-400 italic mb-2">{ra.tagline}</p>
                <p className="text-sm text-navy-300 leading-relaxed line-clamp-3">{ra.description}</p>
              </Link>
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
              Activate the {agent.shortName} Agent as part of your managed local SEO stack.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact" size="lg" variant="primary">
                Get started today
              </Button>
              <Button href="/agents" size="lg" variant="secondary">
                View all agents
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
