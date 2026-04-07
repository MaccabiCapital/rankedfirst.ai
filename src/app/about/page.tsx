import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const metadata = {
  title: "About — AI-Native from the Ground Up",
  description:
    "RankedFirst.ai was built by practitioners with 20+ years in local search — redesigned for the AI era. Human strategy, autonomous execution.",
};

const values = [
  {
    title: "Practitioner-built",
    body: "We've run audits, fixed citations, responded to reviews, and managed GBP profiles manually — tens of thousands of times. That experience is encoded in every skill document and agent behavior.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "AI-native, not AI-bolted-on",
    body: "We didn't take a legacy SEO agency and add a chatbot. We built the infrastructure, skill library, and agent architecture from scratch for autonomous local SEO execution.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Transparency over dashboards",
    body: "We don't hide behind vanity metrics. Every report we deliver connects actions to outcomes — you can see exactly what was done, why, and what changed as a result.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "No boilerplate playbooks",
    body: "A plumber in Phoenix and a restaurant in Toronto have nothing in common. We don't run them through the same checklist. Industry expertise and local market context drive every strategy.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const timeline = [
  {
    year: "2004",
    event: "First local search campaigns",
    detail: "Years before Google My Business existed, working on local directory optimization and early map search.",
  },
  {
    year: "2012",
    event: "Google+ Local era",
    detail: "Navigating Google's chaotic local product iterations — and learning what actually drove rankings vs. what was noise.",
  },
  {
    year: "2017",
    event: "Geogrid methodology developed",
    detail: "Early adoption and refinement of geographic ranking analysis at scale. Built internal tools before commercial solutions existed.",
  },
  {
    year: "2022",
    event: "AI shift begins",
    detail: "Started seeing AI-generated answers appear for local queries. Began mapping the signals that drove AI recommendations.",
  },
  {
    year: "2024",
    event: "RankedFirst.ai founded",
    detail: "Built from the ground up for the AI era — autonomous agents, a 36-skill knowledge library, and three-channel visibility strategy.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-navy-800)_0%,_transparent_60%)] opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8 font-mono">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-navy-200">About</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="h-px w-6 bg-accent-500 inline-block" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">About</span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6">
              AI-native{" "}
              <span className="text-accent-400">from the ground up</span>
            </h1>
            <p className="text-lg sm:text-xl text-navy-300 leading-relaxed max-w-2xl">
              Built by practitioners who've been doing local search since before Google Maps was called Google Maps — and rebuilt for the AI era.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="h-px w-6 bg-accent-500 inline-block" />
                <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">Our Story</span>
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-6">
                20+ years in local search, rebuilt for what's next
              </h2>
              <div className="space-y-4 text-navy-300 leading-relaxed">
                <p>
                  Local search has changed more in the last two years than in the previous ten. AI Overviews, conversational search, LLM recommendations, social discovery — the surfaces where customers find local businesses have multiplied and fragmented.
                </p>
                <p>
                  Most agencies are still running the same GBP checklist they built in 2019. We started over.
                </p>
                <p>
                  RankedFirst.ai was built by local SEO practitioners who've spent two decades in the trenches — managing hundreds of GBP profiles, building the geogrid methodology before commercial tools existed, and tracking local algorithm changes through every Google iteration.
                </p>
                <p>
                  When AI started changing how people find local businesses, we didn't add a blog post about it. We rewrote our entire approach and built the infrastructure to execute it at scale.
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-navy-800" />
              <div className="space-y-8">
                {timeline.map((item) => (
                  <div key={item.year} className="relative pl-12">
                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-navy-900 border-2 border-navy-700 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-accent-500" />
                    </div>
                    <div className="font-mono text-xs text-accent-400 font-semibold mb-1">{item.year}</div>
                    <div className="font-display font-semibold text-white mb-1">{item.event}</div>
                    <div className="text-sm text-navy-400 leading-relaxed">{item.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16 md:py-24 bg-navy-900/40 border-y border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Philosophy"
            title="Human strategy. Autonomous execution."
            description="AI doesn't replace local SEO expertise — it amplifies it. Our agents are as good as the knowledge encoded in their skills. That's where 20 years of experience goes."
          />

          <div className="mt-14 grid sm:grid-cols-3 gap-8">
            {[
              {
                title: "Strategy is human",
                body: "Deciding which keywords to target, which markets to prioritize, how to position against competitors — these require contextual judgment that AI assists, not replaces.",
              },
              {
                title: "Execution is autonomous",
                body: "Running weekly GBP audits, monitoring 20 citation directories, drafting review responses, tracking geogrid changes — this is exactly what autonomous agents do better than humans.",
              },
              {
                title: "Insights are synthesized",
                body: "Our Reporting Agent doesn't dump data — it identifies the meaningful changes, connects actions to outcomes, and delivers narrative insight that drives decisions.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-navy-900 border border-navy-800 rounded-xl p-8">
                <h3 className="font-display font-bold text-xl text-white mb-4">{item.title}</h3>
                <p className="text-navy-300 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Differentiation"
            title="What makes RankedFirst.ai different"
          />
          <div className="mt-14 grid sm:grid-cols-2 gap-6">
            {values.map((value) => (
              <div key={value.title} className="flex gap-6 bg-navy-900 border border-navy-800 rounded-xl p-8">
                <div className="w-12 h-12 rounded-xl bg-accent-500/10 text-accent-400 flex items-center justify-center shrink-0">
                  {value.icon}
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-white mb-3">{value.title}</h3>
                  <p className="text-navy-300 leading-relaxed">{value.body}</p>
                </div>
              </div>
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
              Start with a conversation about where you are and where you want to be. No pitch deck, no generic proposal — just a direct discussion about your local visibility.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact" size="lg" variant="primary">
                Let's talk
              </Button>
              <Button href="/services" size="lg" variant="secondary">
                See our services
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
