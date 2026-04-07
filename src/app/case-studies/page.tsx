import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies — Local SEO Results by Industry",
  description:
    "Real results from real local businesses. GBP ranking improvements, geogrid expansion, AI visibility gains, and review growth — documented in depth.",
  openGraph: {
    title: "Case Studies — Local SEO Results by Industry | RankedFirst.ai",
    description:
      "Real results from real local businesses. GBP ranking improvements, geogrid expansion, AI visibility gains, and review growth — documented in depth.",
    type: "website",
  },
};

const realCaseStudy = {
  slug: "morrison-plumbing",
  business: "Morrison Plumbing",
  industry: "Home Services",
  location: "Buffalo, NY",
  headline: "From page 3 to Map Pack #1 in 90 days",
  keyMetric: "#1 Map Pack",
  metricLabel: "for \"emergency plumber Buffalo\"",
  tags: ["GBP Optimization", "Review Growth", "Geogrid Analysis"],
  result: "Monthly calls: 23 → 164",
};

const comingSoon = [
  {
    industry: "Dental & Healthcare",
    placeholder: "Multi-location dental group",
    teaser: "Map Pack dominance across 4 service areas",
    tags: ["Multi-location GBP", "AI Visibility", "Schema"],
  },
  {
    industry: "Legal Services",
    placeholder: "Personal injury law firm",
    teaser: "AI Overview citations up 8× in 60 days",
    tags: ["AI Visibility", "Entity Authority", "Citation Mgmt"],
  },
];

export default function CaseStudiesPage() {
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
            <span className="text-navy-200">Case Studies</span>
          </nav>

          <div className="max-w-3xl mx-auto text-center pt-10 pb-14">
            <div className="inline-flex items-center gap-2 bg-accent-500/10 border border-accent-500/20 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">
                Results Log
              </span>
            </div>

            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6">
              Case{" "}
              <span className="text-accent-400">Studies</span>
            </h1>
            <p className="text-lg sm:text-xl text-navy-300 leading-relaxed mb-4 max-w-2xl mx-auto">
              In-depth breakdowns of local visibility transformations — ranking improvements, geogrid expansion, AI visibility gains, and the agent-driven tactics that made them happen.
            </p>
          </div>

          {/* Cards grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto mb-16">

            {/* Real case study card */}
            <Link
              href={`/case-studies/${realCaseStudy.slug}`}
              className="group relative bg-navy-900 border border-navy-800 hover:border-accent-500/40 rounded-xl overflow-hidden transition-all duration-200 flex flex-col"
            >
              {/* Thumbnail area */}
              <div className="relative h-40 bg-gradient-to-br from-navy-800 to-navy-950 border-b border-navy-800 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-accent-900)_0%,_transparent_70%)] opacity-40" />
                {/* Geogrid visual */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-5 gap-1.5 opacity-60">
                    {Array.from({ length: 25 }).map((_, i) => {
                      const isHighlight = [6, 7, 11, 12, 13].includes(i);
                      const isMid = [2, 8, 16, 17, 18].includes(i);
                      return (
                        <div
                          key={i}
                          className={`w-6 h-6 rounded-sm text-[9px] font-mono font-bold flex items-center justify-center
                            ${isHighlight
                              ? "bg-accent-500 text-white"
                              : isMid
                              ? "bg-emerald-500/60 text-white"
                              : "bg-navy-700 text-navy-500"
                            }`}
                        >
                          {isHighlight ? "1" : isMid ? "3" : Math.floor(Math.random() * 6) + 5}
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Industry badge */}
                <div className="absolute top-3 left-3">
                  <span className="font-mono text-xs bg-navy-950/80 border border-navy-700 text-navy-300 px-2 py-1 rounded-md">
                    {realCaseStudy.industry}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="font-mono text-xs text-emerald-400 uppercase tracking-wider">{realCaseStudy.location}</span>
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-accent-300 transition-colors leading-snug">
                  {realCaseStudy.business}
                </h3>
                <p className="text-sm text-navy-300 mb-4 leading-relaxed">
                  {realCaseStudy.headline}
                </p>

                {/* Key metric */}
                <div className="bg-navy-950 border border-navy-800 rounded-lg px-4 py-3 mb-4">
                  <div className="font-display font-bold text-2xl text-accent-400">{realCaseStudy.keyMetric}</div>
                  <div className="font-mono text-xs text-navy-400 mt-0.5">{realCaseStudy.metricLabel}</div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {realCaseStudy.tags.map((tag) => (
                    <span key={tag} className="font-mono text-xs bg-navy-800 text-navy-300 border border-navy-700 px-2 py-0.5 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-1 text-xs font-mono text-accent-400 group-hover:gap-2 transition-all">
                  Read case study →
                </div>
              </div>
            </Link>

            {/* Coming soon cards */}
            {comingSoon.map((item, i) => (
              <div
                key={i}
                className="relative bg-navy-900 border border-navy-800 rounded-xl overflow-hidden flex flex-col"
              >
                {/* Coming soon overlay */}
                <div className="absolute inset-0 bg-navy-950/50 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-xl">
                  <span className="font-mono text-xs uppercase tracking-widest text-navy-400 border border-navy-700 bg-navy-950/80 px-3 py-1.5 rounded-full">
                    Coming soon
                  </span>
                </div>

                {/* Thumbnail */}
                <div className="h-40 bg-gradient-to-br from-navy-800 to-navy-950 border-b border-navy-800 opacity-40 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-xl bg-navy-700 border border-navy-600 flex items-center justify-center">
                    <svg className="w-8 h-8 text-navy-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <path d="M9 12h6m-3-3v6m-7.5 3h15A2.25 2.25 0 0 0 21.75 15.75V8.25A2.25 2.25 0 0 0 19.5 6h-15A2.25 2.25 0 0 0 2.25 8.25v7.5A2.25 2.25 0 0 0 4.5 18Z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1 opacity-50">
                  <div className="font-mono text-xs text-navy-500 uppercase tracking-wider mb-2">{item.industry}</div>
                  <h3 className="font-display font-bold text-lg text-navy-400 mb-2">{item.placeholder}</h3>
                  <p className="text-sm text-navy-500 mb-4 leading-relaxed italic">{item.teaser}</p>
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {item.tags.map((tag) => (
                      <span key={tag} className="font-mono text-xs bg-navy-800 text-navy-600 border border-navy-700 px-2 py-0.5 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-navy-400 text-sm mb-6">
              Want to know what results look like for your business? Let&apos;s talk.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact" size="lg" variant="primary">
                Discuss your goals
              </Button>
              <Button href="/industries" size="lg" variant="secondary">
                Browse industries
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
