import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { industries } from "@/lib/site-data";

export const metadata = {
  title: "Case Studies — Local SEO Results by Industry",
  description:
    "Real results from real local businesses. GBP ranking improvements, geogrid expansion, AI visibility gains, and review growth. Case studies coming soon.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-navy-800)_0%,_transparent_60%)] opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8 font-mono">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-navy-200">Case Studies</span>
          </nav>

          <div className="max-w-3xl mx-auto text-center pt-16 pb-12">
            <div className="inline-flex items-center gap-2 bg-accent-500/10 border border-accent-500/20 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">
                Coming Soon
              </span>
            </div>

            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6">
              Real results,{" "}
              <span className="text-accent-400">documented</span>
            </h1>
            <p className="text-lg sm:text-xl text-navy-300 leading-relaxed mb-12 max-w-xl mx-auto">
              In-depth breakdowns of local visibility transformations — ranking improvements, geogrid expansion, AI visibility gains, and the tactics that made them happen.
            </p>
          </div>

          {/* Placeholder cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto mb-16">
            {industries.map((industry) => (
              <div
                key={industry.slug}
                className="relative bg-navy-900 border border-navy-800 rounded-xl p-6 overflow-hidden"
              >
                {/* Coming soon overlay */}
                <div className="absolute inset-0 bg-navy-950/60 backdrop-blur-[2px] flex items-center justify-center rounded-xl">
                  <span className="font-mono text-xs uppercase tracking-widest text-navy-400 border border-navy-700 px-3 py-1 rounded-full">
                    Coming soon
                  </span>
                </div>

                <div className="text-3xl mb-4 opacity-50">{industry.icon}</div>
                <div className="font-mono text-xs text-navy-500 uppercase tracking-wider mb-2">{industry.name}</div>
                <h3 className="font-display font-bold text-lg text-navy-400 mb-3 line-clamp-2">
                  {industry.headline}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Object.values(industry.stats).slice(0, 2).map((val, i) => (
                    <span key={i} className="font-display font-bold text-sm text-navy-500">
                      {val as string}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-navy-400 text-sm mb-6">
              In the meantime, talk to us directly about what results look like for your vertical.
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
