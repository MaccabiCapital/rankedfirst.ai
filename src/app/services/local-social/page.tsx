import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { services } from "@/lib/site-data";

const service = services.find((s) => s.slug === "local-social")!;

export const metadata: Metadata = {
  title: "Local Social Visibility — Instagram, TikTok & Facebook Discovery",
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

const socialPlatforms = [
  {
    name: "Instagram",
    stat: "40% of Gen Z",
    detail: "use Instagram for local discovery",
    color: "text-pink-400",
    bg: "bg-pink-500/10 border-pink-500/20",
  },
  {
    name: "TikTok",
    stat: "1B+ monthly",
    detail: "users searching for local content",
    color: "text-sky-400",
    bg: "bg-sky-500/10 border-sky-500/20",
  },
  {
    name: "Facebook",
    stat: "2B+ local",
    detail: "searches per month",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
];

export default function LocalSocialPage() {
  return (
    <>
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#ec4899_0%,_transparent_50%)] opacity-[0.07]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8 font-mono">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-white transition-colors">Services</Link>
            <span>/</span>
            <span className="text-navy-200">Local Social</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="h-px w-6 bg-pink-500 inline-block" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-pink-400">
                Local Social Visibility
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
                Grow your social presence
              </Button>
              <Button href="#features" size="lg" variant="secondary">
                What's included
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Stats */}
      <section className="py-12 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-mono uppercase tracking-widest text-navy-500 mb-8">
            Social platforms are the new local search engines
          </p>
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {socialPlatforms.map((platform) => (
              <div
                key={platform.name}
                className={`border rounded-xl px-6 py-5 text-center ${platform.bg}`}
              >
                <div className={`font-display font-bold text-xl mb-1 ${platform.color}`}>
                  {platform.name}
                </div>
                <div className="font-display font-bold text-2xl text-white mb-1">{platform.stat}</div>
                <div className="text-xs text-navy-400">{platform.detail}</div>
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
              <span className="h-px w-6 bg-pink-500 inline-block" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-pink-400">What's Included</span>
              <span className="h-px w-6 bg-pink-500 inline-block" />
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
              Own local discovery on every social platform
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {service.features.map((feature, i) => (
              <div
                key={feature}
                className="bg-navy-900 border border-navy-800 hover:border-pink-500/30 rounded-xl p-6 transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center mb-4 font-mono text-sm font-bold">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <p className="text-white font-display font-semibold leading-snug">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* No Dedicated Agent Note */}
      <section className="py-12 bg-navy-900/40 border-y border-navy-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-3 bg-navy-900 border border-navy-700 rounded-xl px-6 py-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 text-accent-400 shrink-0">
              <path d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-sm text-navy-300">
              Social visibility is a <span className="text-white font-semibold">strategy + content service</span> — delivered by our team, powered by the same data signals as our autonomous agents.
            </p>
          </div>
        </div>
      </section>

      {/* What We Deliver */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="h-px w-6 bg-pink-500 inline-block" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-pink-400">How It Works</span>
              <span className="h-px w-6 bg-pink-500 inline-block" />
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
              Social discovery, systematized
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Platform audit & strategy",
                body: "We audit your current social presence across Instagram, TikTok, and Facebook — then build a local discovery strategy tailored to your business type and audience.",
              },
              {
                step: "02",
                title: "Profile & content optimization",
                body: "We optimize your profiles for platform search, implement geo-tagging strategies, and create a content framework that surfaces you in local discovery.",
              },
              {
                step: "03",
                title: "Ongoing optimization",
                body: "Monthly content strategy, hashtag updates, location tag refinement, and performance tracking — keeping your social presence aligned with what's working.",
              },
            ].map((item) => (
              <div key={item.step} className="bg-navy-900 border border-navy-800 rounded-xl p-8">
                <span className="font-mono text-3xl font-bold text-pink-500/30">{item.step}</span>
                <h3 className="font-display font-bold text-xl text-white mt-4 mb-3">{item.title}</h3>
                <p className="text-navy-300 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-navy-900/40 border-y border-navy-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="h-px w-6 bg-pink-500 inline-block" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-pink-400">FAQ</span>
              <span className="h-px w-6 bg-pink-500 inline-block" />
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
          <div className="bg-navy-900 border border-pink-500/20 rounded-3xl px-8 py-16 md:py-20 text-center">
            <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-6">
              Ready to rank first?
            </h2>
            <p className="text-navy-300 text-lg mb-10 max-w-xl mx-auto">
              Let's audit your social discovery presence and build a strategy that puts you in front of local customers on Instagram, TikTok, and Facebook.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact" size="lg" variant="primary">
                Get your social visibility audit
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
