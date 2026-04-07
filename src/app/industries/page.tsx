import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { industries } from "@/lib/site-data";

export const metadata = {
  title: "Industries — Local SEO Expertise for Your Industry",
  description:
    "Industry-specific local SEO strategy for healthcare, home services, legal, multi-location, restaurants, and insurance. Tactics tailored to how patients, clients, and customers find you.",
};

export default function IndustriesPage() {
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
            <span className="text-navy-200">Industries</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="h-px w-6 bg-accent-500 inline-block" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">
                {industries.length} Verticals
              </span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6">
              Local SEO expertise for{" "}
              <span className="text-accent-400">your industry</span>
            </h1>
            <p className="text-lg sm:text-xl text-navy-300 leading-relaxed max-w-2xl">
              Local search behavior varies dramatically by industry. A dental patient and an emergency plumber call follow completely different paths. We've built deep expertise in the verticals where local visibility matters most.
            </p>
          </div>
        </div>
      </section>

      {/* Industry Grid */}
      <section className="py-8 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry) => (
              <Link
                key={industry.slug}
                href={`/industries/${industry.slug}`}
                className="group bg-navy-900 border border-navy-800 hover:border-accent-500/30 rounded-2xl p-8 flex flex-col transition-all duration-200 hover:-translate-y-0.5"
              >
                {/* Emoji icon */}
                <div className="text-4xl mb-5">{industry.icon}</div>

                <h2 className="font-display font-bold text-xl text-white mb-2 group-hover:text-accent-300 transition-colors">
                  {industry.name}
                </h2>
                <p className="text-sm text-navy-400 italic mb-4 leading-relaxed">
                  "{industry.headline}"
                </p>
                <p className="text-navy-300 text-sm leading-relaxed flex-1">
                  {industry.description}
                </p>

                {/* Key services preview */}
                <div className="mt-6 pt-5 border-t border-navy-800">
                  <p className="text-xs font-mono uppercase tracking-wider text-navy-500 mb-3">Key services</p>
                  <ul className="space-y-1.5">
                    {industry.keyServices.slice(0, 3).map((svc) => (
                      <li key={svc} className="flex items-center gap-2 text-xs text-navy-400">
                        <span className="w-1 h-1 rounded-full bg-accent-500 shrink-0" />
                        {svc}
                      </li>
                    ))}
                    {industry.keyServices.length > 3 && (
                      <li className="text-xs text-navy-500 pl-3">+{industry.keyServices.length - 3} more</li>
                    )}
                  </ul>
                </div>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-display font-semibold text-accent-400 group-hover:text-accent-300 group-hover:gap-3 transition-all">
                  See strategy
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Industry-Specific */}
      <section className="py-16 md:py-24 bg-navy-900/40 border-y border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Our Approach"
            title="Why industry-specific expertise matters"
            description="Generic local SEO advice misses the nuances that actually drive results in each vertical."
          />

          <div className="mt-14 grid sm:grid-cols-3 gap-8">
            {[
              {
                title: "Different search behaviors",
                body: "Restaurant diners browse and compare. Emergency plumbers get one shot. Dental patients read reviews for weeks. The strategy has to match how people actually search in your vertical.",
              },
              {
                title: "Different ranking signals",
                body: "Healthcare needs HIPAA-compliant review responses and medical category optimization. Home services need LSA optimization and service area strategy. Legal needs authority signals. We know the difference.",
              },
              {
                title: "Different AI queries",
                body: "When someone asks an AI assistant for a local recommendation, the query structure, intent signals, and authority factors vary by industry. We optimize for the queries your customers actually ask.",
              },
            ].map((item) => (
              <div key={item.title} className="flex flex-col gap-4">
                <div className="w-8 h-8 rounded-lg bg-accent-500/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-accent-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
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
              Let's talk about your vertical and where the biggest local visibility gaps are.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact" size="lg" variant="primary">
                Get your industry audit
              </Button>
              <Button href="/services" size="lg" variant="secondary">
                Explore services
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
