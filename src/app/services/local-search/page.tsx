import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { services, agents } from "@/lib/site-data";

const service = services.find((s) => s.slug === "local-search")!;

export const metadata: Metadata = {
  title: "Local Search Visibility — GBP, Geogrid, Citations & Reviews",
  description: service.description,
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: service.faq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

const poweredByAgents = agents.filter((a) => service.agents.includes(a.slug));

export default function LocalSearchPage() {
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
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <span>/</span>
            <span className="text-navy-200">Local Search</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="h-px w-6 bg-accent-500 inline-block" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">
                Local Search Visibility
              </span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6">
              {service.headline}
            </h1>
            <p className="text-lg sm:text-xl text-navy-300 leading-relaxed max-w-2xl mb-10">
              {service.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/contact" size="lg" variant="primary">
                Start ranking
              </Button>
              <Button href="#features" size="lg" variant="secondary">
                See what's included
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-16 md:py-24 bg-navy-900/40 border-y border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="h-px w-6 bg-accent-500 inline-block" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">What's Included</span>
              <span className="h-px w-6 bg-accent-500 inline-block" />
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
              Every lever that moves your local rankings
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {service.features.map((feature, i) => (
              <div
                key={feature}
                className="bg-navy-900 border border-navy-800 hover:border-accent-500/30 rounded-xl p-6 transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-lg bg-accent-500/10 text-accent-400 flex items-center justify-center mb-4 font-mono text-sm font-bold">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <p className="text-white font-display font-semibold leading-snug">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Powered By Agents */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="h-px w-6 bg-accent-500 inline-block" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">Autonomous Execution</span>
              <span className="h-px w-6 bg-accent-500 inline-block" />
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
              Powered by {poweredByAgents.length} specialized agents
            </h2>
            <p className="text-navy-300 text-lg">
              Each agent handles a specific piece of your local search visibility — running continuously so nothing falls through the cracks.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {poweredByAgents.map((agent) => (
              <Link
                key={agent.slug}
                href={`/agents/${agent.slug}`}
                className="bg-navy-900 border border-navy-800 hover:border-accent-500/30 rounded-xl p-6 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Active</span>
                  </div>
                  <svg className="w-4 h-4 text-navy-500 group-hover:text-accent-400 transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M7 17 17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-mono font-semibold text-white mb-2 text-sm group-hover:text-accent-300 transition-colors">
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

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-navy-900/40 border-y border-navy-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
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
            {service.faq.map((item, i) => (
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

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy-900 border border-accent-500/20 rounded-3xl px-8 py-16 md:py-20 text-center">
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-6">
              Ready to rank first?
            </h2>
            <p className="text-navy-300 text-lg mb-10 max-w-xl mx-auto">
              Start with a local search audit. We'll map your geogrid rankings, audit your GBP, and identify your biggest citation gaps — in one report.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact" size="lg" variant="primary">
                Get your local search audit
              </Button>
              <Button href="/services" size="lg" variant="secondary">
                View all services
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
