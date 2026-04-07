import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Blog — Local SEO Insights & Strategy",
  description:
    "Practical local SEO strategy, AI visibility tactics, and industry analysis from the RankedFirst.ai team. Coming soon.",
};

export default function BlogPage() {
  return (
    <>
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-navy-800)_0%,_transparent_60%)] opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8 font-mono">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-navy-200">Blog</span>
          </nav>

          <div className="max-w-3xl mx-auto text-center pt-16 pb-24">
            <div className="inline-flex items-center gap-2 bg-accent-500/10 border border-accent-500/20 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">
                Coming Soon
              </span>
            </div>

            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6">
              Local SEO insights,{" "}
              <span className="text-accent-400">coming soon</span>
            </h1>
            <p className="text-lg sm:text-xl text-navy-300 leading-relaxed mb-12 max-w-xl mx-auto">
              Practical strategy, AI visibility tactics, geogrid deep-dives, and industry analysis from practitioners who live in local search.
            </p>

            {/* Topics preview */}
            <div className="grid sm:grid-cols-3 gap-4 mb-12 text-left">
              {[
                {
                  label: "Local AI",
                  topics: ["How AI Overviews pick local businesses", "ChatGPT local recommendation signals", "Entity authority for local SEO"],
                },
                {
                  label: "Google Business Profile",
                  topics: ["GBP attribute strategy in 2025", "Post cadence impact on rankings", "Suspension recovery playbook"],
                },
                {
                  label: "Geogrid Strategy",
                  topics: ["Reading geogrid heat maps", "Service area expansion tactics", "Competitor intrusion response"],
                },
              ].map((topic) => (
                <div key={topic.label} className="bg-navy-900 border border-navy-800 rounded-xl p-5">
                  <div className="text-xs font-mono uppercase tracking-wider text-accent-400 mb-3">{topic.label}</div>
                  <ul className="space-y-2">
                    {topic.topics.map((t) => (
                      <li key={t} className="text-sm text-navy-300 flex items-start gap-2">
                        <span className="text-navy-600 mt-1">—</span>
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact" size="lg" variant="primary">
                Get notified when we launch
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
