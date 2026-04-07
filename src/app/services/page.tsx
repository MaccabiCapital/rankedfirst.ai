import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { services } from "@/lib/site-data";

export const metadata = {
  title: "Services — Three Visibility Channels, One Strategy",
  description:
    "Local Search, Local AI, and Local Social visibility — the three channels that control where your business gets found. RankedFirst.ai manages all three with autonomous agents.",
};

const serviceIcons: Record<string, React.ReactNode> = {
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" strokeLinecap="round" />
    </svg>
  ),
  sparkles: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
      <path d="M18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
  ),
  share: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
      <path d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const serviceColorClasses: Record<string, { border: string; icon: string; badge: string }> = {
  search: {
    border: "border-accent-500/30 hover:border-accent-500/60",
    icon: "text-accent-400 bg-accent-500/10",
    badge: "bg-accent-500/10 text-accent-400",
  },
  sparkles: {
    border: "border-purple-500/30 hover:border-purple-500/60",
    icon: "text-purple-400 bg-purple-500/10",
    badge: "bg-purple-500/10 text-purple-400",
  },
  share: {
    border: "border-pink-500/30 hover:border-pink-500/60",
    icon: "text-pink-400 bg-pink-500/10",
    badge: "bg-pink-500/10 text-pink-400",
  },
};

export default function ServicesPage() {
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
            <span className="text-navy-200">Services</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="h-px w-6 bg-accent-500 inline-block" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">
                Services
              </span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6">
              Three visibility channels.{" "}
              <span className="text-accent-400">One unified strategy.</span>
            </h1>
            <p className="text-lg sm:text-xl text-navy-300 leading-relaxed max-w-2xl">
              Local search has evolved beyond Google's map pack. Today, customers find businesses through traditional search, AI assistants, and social discovery — all at once. We optimize all three.
            </p>
          </div>
        </div>
      </section>

      {/* Service Cards */}
      <section className="py-8 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service) => {
              const colors = serviceColorClasses[service.icon];
              return (
                <div
                  key={service.slug}
                  className={`relative bg-navy-900 border rounded-2xl p-8 flex flex-col transition-all duration-300 ${colors.border}`}
                >
                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-xl mb-6 w-fit ${colors.icon}`}>
                    {serviceIcons[service.icon]}
                  </div>

                  {/* Header */}
                  <div className="mb-4">
                    <span className={`text-xs font-mono font-semibold uppercase tracking-widest px-2 py-1 rounded-md mb-3 inline-block ${colors.badge}`}>
                      Channel {services.indexOf(service) + 1}
                    </span>
                    <h2 className="font-display font-bold text-2xl text-white mb-3">
                      {service.name}
                    </h2>
                    <p className="text-navy-300 leading-relaxed text-sm">
                      {service.description}
                    </p>
                  </div>

                  {/* Feature List */}
                  <ul className="space-y-2.5 mt-4 flex-1">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-navy-300">
                        <svg className="w-4 h-4 mt-0.5 text-accent-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                          <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="mt-8 pt-6 border-t border-navy-800">
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-display font-semibold text-accent-400 hover:text-accent-300 transition-colors group"
                    >
                      Explore {service.shortName} visibility
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How They Work Together */}
      <section className="py-16 md:py-24 bg-navy-900/50 border-y border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="The Strategy"
            title="Channels that reinforce each other"
            description="Each visibility channel isn't an island — they share signals, authority, and data. Strong reviews help your map pack ranking AND your AI visibility. Good structured data helps both Google search and AI answers. We build a strategy where everything compounds."
          />

          <div className="mt-16 grid sm:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                num: "01",
                title: "Shared signals compound",
                body: "Reviews, citations, and structured data improve all three channels simultaneously. Work done for search also builds your AI authority.",
              },
              {
                num: "02",
                title: "Unified data, one dashboard",
                body: "Our agents pull from all channels into a single reporting view — no siloed dashboards, no manual aggregation, just clarity.",
              },
              {
                num: "03",
                title: "Gap analysis across surfaces",
                body: "We identify where you're strong in search but invisible in AI, or visible on social but absent from the map pack — and close those gaps strategically.",
              },
            ].map((item) => (
              <div key={item.num} className="flex flex-col gap-4">
                <span className="font-mono text-3xl font-bold text-accent-500/30">{item.num}</span>
                <h3 className="font-display font-bold text-xl text-white">{item.title}</h3>
                <p className="text-navy-300 leading-relaxed">{item.body}</p>
              </div>
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
              Start with a visibility audit across all three channels — we'll show you exactly where you stand and where the biggest opportunities are.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact" size="lg" variant="primary">
                Get your visibility audit
              </Button>
              <Button href="/agents" size="lg" variant="secondary">
                See how agents work
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
