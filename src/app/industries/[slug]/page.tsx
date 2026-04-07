import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { industries, agents } from "@/lib/site-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = industries.find((i) => i.slug === slug);
  if (!industry) return {};
  return {
    title: `${industry.name} Local SEO — ${industry.headline}`,
    description: industry.longDescription.slice(0, 160),
  };
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-navy-900 border border-accent-500/20 rounded-xl p-6 text-center">
      <div className="font-display font-bold text-3xl text-accent-400 mb-2">{value}</div>
      <div className="text-sm text-navy-400">{label}</div>
    </div>
  );
}

export default async function IndustryDetailPage({ params }: Props) {
  const { slug } = await params;
  const industry = industries.find((i) => i.slug === slug);
  if (!industry) notFound();

  const relevantAgentData = agents.filter((a) =>
    industry.relevantAgents.includes(a.slug)
  );

  const otherIndustries = industries.filter((i) => i.slug !== industry.slug).slice(0, 3);

  // Build stats array from the stats object
  const statsEntries = Object.entries(industry.stats).map(([key, value]) => {
    const labelMap: Record<string, string> = {
      avgRankImprovement: "Avg. rank improvement",
      reviewGrowth: "Review growth",
      aiMentionRate: "AI mention rate",
      lsaLeadReduction: "LSA lead cost reduction",
      coverageIncrease: "Coverage area increase",
      authorityScore: "Authority score",
      locationsManaged: "Locations managed",
      auditFrequency: "Audit frequency",
      reportingTime: "Reporting time saved",
      reviewResponseRate: "Review response rate",
      socialDiscovery: "Social discovery lift",
      leadIncrease: "Lead increase",
    };
    return { value: value as string, label: labelMap[key] || key };
  });

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--color-accent-900)_0%,_transparent_50%)] opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8 font-mono">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/industries" className="hover:text-white transition-colors">Industries</Link>
            <span>/</span>
            <span className="text-navy-200">{industry.name}</span>
          </nav>

          <div className="max-w-3xl">
            <div className="text-5xl mb-6">{industry.icon}</div>
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="h-px w-6 bg-accent-500 inline-block" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">
                {industry.name}
              </span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6">
              {industry.headline}
            </h1>
            <p className="text-lg sm:text-xl text-navy-300 leading-relaxed max-w-2xl mb-10">
              {industry.longDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/contact" size="lg" variant="primary">
                Get your {industry.name.toLowerCase()} audit
              </Button>
              <Button href="#strategy" size="lg" variant="secondary">
                See the strategy
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      {statsEntries.length > 0 && (
        <section className="py-12 border-y border-navy-800 bg-navy-900/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-mono uppercase tracking-widest text-navy-500 mb-8">
              Results for {industry.name.toLowerCase()} clients
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {statsEntries.map((stat) => (
                <StatCard key={stat.label} value={stat.value} label={stat.label} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Key Services */}
      <section id="strategy" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="h-px w-6 bg-accent-500 inline-block" />
                <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">Key Services</span>
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-8">
                What we do for {industry.name.toLowerCase()}
              </h2>
              <ul className="space-y-4">
                {industry.keyServices.map((service, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-accent-500/10 text-accent-400 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="text-navy-200 leading-relaxed">{service}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-navy-900 border border-navy-800 rounded-2xl p-8">
              <div className="text-xs font-mono uppercase tracking-wider text-navy-500 mb-6">Quick stats</div>
              <div className="space-y-5">
                {statsEntries.map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span className="text-navy-300 text-sm">{stat.label}</span>
                    <span className="font-display font-bold text-accent-400 text-lg">{stat.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-navy-800">
                <Button href="/contact" variant="primary" size="md" className="w-full justify-center">
                  Get your free audit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Relevant Agents */}
      <section className="py-16 md:py-24 bg-navy-900/40 border-y border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="h-px w-6 bg-accent-500 inline-block" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">Agents</span>
              <span className="h-px w-6 bg-accent-500 inline-block" />
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
              Agents optimized for {industry.name.toLowerCase()}
            </h2>
            <p className="text-navy-300">
              These agents are particularly relevant for {industry.name.toLowerCase()} businesses based on the channels and tactics that drive results in your vertical.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {relevantAgentData.map((agent) => (
              <Link
                key={agent.slug}
                href={`/agents/${agent.slug}`}
                className="group bg-navy-900 border border-navy-800 hover:border-accent-500/30 rounded-xl p-6 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Active</span>
                  </div>
                  <svg className="w-4 h-4 text-navy-600 group-hover:text-accent-400 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M7 17 17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-mono font-semibold text-white group-hover:text-accent-300 transition-colors mb-1 text-sm">
                  {agent.name}
                </h3>
                <p className="text-xs text-navy-400 italic mb-3">{agent.tagline}</p>
                <p className="text-sm text-navy-300 leading-relaxed">{agent.description}</p>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button href="/agents" variant="ghost" size="sm">
              View all agents →
            </Button>
          </div>
        </div>
      </section>

      {/* Other Industries */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="h-px w-6 bg-accent-500 inline-block" />
                <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">Other Verticals</span>
              </div>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
                We also specialize in
              </h2>
            </div>
            <Button href="/industries" variant="ghost" size="sm">
              View all industries →
            </Button>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {otherIndustries.map((ind) => (
              <Link
                key={ind.slug}
                href={`/industries/${ind.slug}`}
                className="group bg-navy-900 border border-navy-800 hover:border-accent-500/30 rounded-xl p-6 transition-all duration-200"
              >
                <div className="text-2xl mb-3">{ind.icon}</div>
                <h3 className="font-display font-bold text-white group-hover:text-accent-300 transition-colors mb-2">
                  {ind.name}
                </h3>
                <p className="text-sm text-navy-400 line-clamp-2">{ind.description}</p>
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
              Let's build a local visibility strategy tailored to {industry.name.toLowerCase()} — covering search, AI, and social.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact" size="lg" variant="primary">
                Get your {industry.name.toLowerCase()} audit
              </Button>
              <Button href="/industries" size="lg" variant="secondary">
                View all industries
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
