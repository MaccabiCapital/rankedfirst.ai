import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Blog — Local SEO Insights & Strategy",
  description:
    "Practical local SEO strategy, AI visibility tactics, and industry analysis from the RankedFirst.ai team.",
};

const articles = [
  {
    href: "/blog/ai-visibility-local-seo",
    category: "Local AI Visibility",
    title: "Why AI Visibility Is the New Battleground for Local Businesses",
    excerpt:
      "ChatGPT, Perplexity, Gemini, and AI Overviews are reshaping local discovery. Learn what signals AI models use to recommend businesses — and how to act on them now.",
    date: "April 7, 2026",
    readTime: "7 min read",
  },
  {
    href: "/blog/gbp-optimization-guide",
    category: "Google Business Profile",
    title: "The Complete Google Business Profile Optimization Guide for 2026",
    excerpt:
      "Step-by-step GBP optimization covering categories, attributes, photos, posts, Q&A, reviews, and schema — plus how autonomous agents handle it at scale.",
    date: "April 7, 2026",
    readTime: "8 min read",
  },
  {
    href: "/blog/schema-markup-local-business",
    category: "Technical SEO",
    title: "Schema Markup for Local Businesses: The Technical Guide to AI Search Readiness",
    excerpt:
      "Why schema markup is now AI search infrastructure. The 19+ properties that matter, LocalBusiness subtypes, FAQPage schema, and how to validate your implementation.",
    date: "April 7, 2026",
    readTime: "9 min read",
  },
];

export default function BlogPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-navy-800)_0%,_transparent_60%)] opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8 font-mono">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-navy-200">Blog</span>
          </nav>

          <div className="max-w-2xl mb-12">
            <div className="inline-flex items-center gap-2 bg-accent-500/10 border border-accent-500/20 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-accent-400" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">
                Local SEO Insights
              </span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-5">
              Strategy and analysis from{" "}
              <span className="text-accent-400">practitioners</span>
            </h1>
            <p className="text-lg text-navy-300 leading-relaxed">
              AI visibility tactics, GBP deep-dives, technical SEO, and geogrid strategy — written by the team building autonomous local SEO infrastructure.
            </p>
          </div>
        </div>
      </section>

      {/* Article Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.href}
              href={article.href}
              className="group flex flex-col bg-navy-900 hover:bg-navy-800 border border-navy-800 hover:border-navy-700 rounded-2xl p-6 transition-all duration-200"
            >
              {/* Category tag */}
              <div className="inline-flex mb-4">
                <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">
                  {article.category}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-display font-bold text-lg text-white group-hover:text-accent-300 transition-colors leading-snug mb-3 flex-1">
                {article.title}
              </h2>

              {/* Excerpt */}
              <p className="text-sm text-navy-400 leading-relaxed mb-6">
                {article.excerpt}
              </p>

              {/* Meta row */}
              <div className="flex items-center justify-between text-xs font-mono text-navy-500 mt-auto pt-4 border-t border-navy-800">
                <span>{article.date}</span>
                <span>{article.readTime}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-navy-400 mb-6 text-sm">
            More articles coming soon — covering geogrid strategy, review management, and multi-location SEO.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/services" size="lg" variant="primary">
              Explore our services
            </Button>
            <Button href="/contact" size="lg" variant="secondary">
              Talk to the team
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
