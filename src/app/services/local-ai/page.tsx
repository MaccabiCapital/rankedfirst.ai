import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { services, agents } from "@/lib/site-data";

const service = services.find((s) => s.slug === "local-ai")!;

export const metadata: Metadata = {
  title: "Local AI Visibility — ChatGPT, Perplexity & Gemini Optimization",
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

const aiPlatforms = [
  { name: "ChatGPT", detail: "OpenAI's assistant" },
  { name: "Perplexity", detail: "AI search engine" },
  { name: "Gemini", detail: "Google's AI + AI Overviews" },
  { name: "Apple Intelligence", detail: "iOS & macOS assistant" },
  { name: "Microsoft Copilot", detail: "Bing-powered AI" },
];

export default function LocalAIPage() {
  return (
    <>
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#7c3aed_0%,_transparent_50%)] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8 font-mono">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <span>/</span>
            <span className="text-navy-200">Local AI</span>
          </nav>

          {/* New channel badge */}
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 text-purple-400">
              <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
            </svg>
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-purple-400">
              New Channel — The AI Frontier
            </span>
          </div>

          <div className="max-w-3xl">
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6">
              {service.headline}
            </h1>
            <p className="text-lg sm:text-xl text-navy-300 leading-relaxed max-w-2xl mb-10">
              {service.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button href="/contact" size="lg" variant="primary">
                Check your AI visibility
              </Button>
              <Button href="#features" size="lg" variant="secondary">
                How it works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Platforms */}
      <section className="py-12 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-mono uppercase tracking-widest text-navy-500 mb-8">
            We optimize for every AI platform that drives local discovery
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {aiPlatforms.map((platform) => (
              <div
                key={platform.name}
                className="bg-navy-900 border border-purple-500/20 rounded-xl px-5 py-3 text-center"
              >
                <div className="font-display font-semibold text-white text-sm">{platform.name}</div>
                <div className="text-xs text-navy-400 mt-0.5">{platform.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="h-px w-6 bg-purple-500 inline-block" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-purple-400">What's Included</span>
              <span className="h-px w-6 bg-purple-500 inline-block" />
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
              Optimizing the signals AI models trust
            </h2>
            <p className="text-navy-300 mt-4 text-lg">
              AI recommendations aren't random — they're driven by specific signals we can measure and improve.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {service.features.map((feature, i) => (
              <div
                key={feature}
                className="bg-navy-900 border border-navy-800 hover:border-purple-500/30 rounded-xl p-6 transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 font-mono text-sm font-bold">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <p className="text-white font-display font-semibold leading-snug">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Powered By Agents */}
      {poweredByAgents.length > 0 && (
        <section className="py-16 md:py-24 bg-navy-900/40 border-y border-navy-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="h-px w-6 bg-purple-500 inline-block" />
                <span className="text-xs font-mono font-semibold uppercase tracking-widest text-purple-400">Autonomous Execution</span>
                <span className="h-px w-6 bg-purple-500 inline-block" />
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
                Powered by the AI Visibility Agent
              </h2>
              <p className="text-navy-300 text-lg">
                Purpose-built to monitor and optimize your presence across every major LLM.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              {poweredByAgents.map((agent) => (
                <Link
                  key={agent.slug}
                  href={`/agents/${agent.slug}`}
                  className="block bg-navy-900 border border-navy-800 hover:border-purple-500/30 rounded-xl p-8 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Active</span>
                    </div>
                    <svg className="w-4 h-4 text-navy-500 group-hover:text-purple-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M7 17 17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="font-mono font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {agent.name}
                  </h3>
                  <p className="text-sm text-navy-400 italic mb-3">{agent.tagline}</p>
                  <p className="text-navy-300 leading-relaxed">{agent.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {agent.capabilities.slice(0, 3).map((cap) => (
                      <span key={cap} className="text-xs font-mono bg-navy-800 text-navy-300 px-2.5 py-1 rounded-md">
                        {cap}
                      </span>
                    ))}
                  </div>
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
      )}

      {/* FAQ */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="h-px w-6 bg-purple-500 inline-block" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-purple-400">FAQ</span>
              <span className="h-px w-6 bg-purple-500 inline-block" />
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
              Common questions about AI visibility
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
      <section className="py-16 md:py-24 bg-navy-900/40 border-t border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy-900 border border-purple-500/20 rounded-3xl px-8 py-16 md:py-20 text-center">
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-6">
              Ready to rank first?
            </h2>
            <p className="text-navy-300 text-lg mb-10 max-w-xl mx-auto">
              Find out if ChatGPT, Perplexity, and Gemini are recommending your business — and what it would take to get there.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact" size="lg" variant="primary">
                Get your AI visibility report
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
