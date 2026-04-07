import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Morrison Plumbing — From Page 3 to Map Pack #1 in 90 Days",
  description:
    "How RankedFirst.ai's autonomous agents took Morrison Plumbing from 38 reviews and page-3 obscurity to the #1 Map Pack position for 'emergency plumber Buffalo' in 90 days.",
  openGraph: {
    title: "Morrison Plumbing Case Study — Map Pack #1 in 90 Days | RankedFirst.ai",
    description:
      "How RankedFirst.ai's autonomous agents took Morrison Plumbing from 38 reviews and page-3 obscurity to the #1 Map Pack position for 'emergency plumber Buffalo' in 90 days.",
    type: "article",
  },
};

const caseStudySchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Morrison Plumbing: From Page 3 to Map Pack #1 in 90 Days",
  description:
    "How RankedFirst.ai's autonomous agents took Morrison Plumbing from 38 reviews and page-3 obscurity to the #1 Map Pack position for 'emergency plumber Buffalo' in 90 days.",
  author: {
    "@type": "Organization",
    name: "RankedFirst.ai",
    url: "https://rankedfirst.ai",
  },
  publisher: {
    "@type": "Organization",
    name: "RankedFirst.ai",
    url: "https://rankedfirst.ai",
  },
};

const beforeAfterMetrics = [
  {
    label: "Map Pack Position",
    query: "\"emergency plumber Buffalo\"",
    before: "Not ranking",
    after: "#1",
    unit: "",
    highlight: true,
  },
  {
    label: "GBP Completeness",
    before: "62%",
    after: "98%",
    unit: "",
    highlight: false,
  },
  {
    label: "Google Reviews",
    before: "38",
    after: "127",
    unit: "",
    highlight: false,
  },
  {
    label: "AI Visibility Score",
    before: "14",
    after: "67",
    unit: "",
    highlight: false,
  },
  {
    label: "Monthly GBP Calls",
    before: "23",
    after: "164",
    unit: "/mo",
    highlight: false,
  },
  {
    label: "Geogrid SoLV",
    before: "12%",
    after: "58%",
    unit: "",
    highlight: false,
  },
];

const agentsDeployed = [
  {
    name: "GBP Optimization Agent",
    slug: "gbp-optimization",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    description: "Full profile audit, Q&A seeding, photo refresh, service area mapping, attribute completion.",
  },
  {
    name: "Geogrid Analysis Agent",
    slug: "geogrid-analysis",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    description: "7×7 grid across Buffalo metro to identify ranking gaps and track weekly progress.",
  },
  {
    name: "Review Management Agent",
    slug: "review-management",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    description: "Post-job review request sequences via SMS and email; response drafting for all incoming reviews.",
  },
  {
    name: "Local Citations Agent",
    slug: "local-citations",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    description: "NAP audit across 80+ directories; corrected 14 inconsistencies and built 23 new citations.",
  },
  {
    name: "Schema Automation Agent",
    slug: "gbp-optimization",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    description: "LocalBusiness, Plumber, and Service schema injected site-wide with emergency service markup.",
  },
  {
    name: "AI Visibility Agent",
    slug: "ai-visibility",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    description: "Entity optimization for ChatGPT, Perplexity, and Google AI Overviews; monitored weekly citation frequency.",
  },
];

const timeline = [
  {
    month: "Month 1",
    label: "Foundation",
    color: "accent",
    milestones: [
      "GBP completeness lifted from 62% to 91%",
      "14 NAP inconsistencies corrected across directories",
      "Schema markup deployed (LocalBusiness + Plumber)",
      "Review request sequences activated",
      "Baseline geogrid established (SoLV 12%)",
    ],
  },
  {
    month: "Month 2",
    label: "Momentum",
    color: "emerald",
    milestones: [
      "Reviews grew from 38 to 82 (116% increase)",
      "Map Pack appearances began for mid-funnel terms",
      "23 new citations built; GBP Q&A seeded with 18 relevant questions",
      "AI visibility score climbed to 41",
      "Geogrid SoLV reached 34%",
    ],
  },
  {
    month: "Month 3",
    label: "Dominance",
    color: "blue",
    milestones: [
      "#1 Map Pack achieved for \"emergency plumber Buffalo\"",
      "Reviews hit 127 — surpassing key competitor at 119",
      "Monthly GBP calls reached 164 (+613%)",
      "AI visibility score: 67 — consistently cited in ChatGPT & Perplexity",
      "Geogrid SoLV: 58% across Buffalo metro",
    ],
  },
];

const challenges = [
  {
    label: "Review Gap",
    detail: "38 reviews vs. top competitor's 203 — a 5× deficit that directly suppressed Map Pack eligibility.",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Incomplete GBP",
    detail: "Profile completeness at 62% — missing services, hours for emergency calls, photos, and business description.",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "No Schema Markup",
    detail: "Website had zero structured data — Google couldn't reliably extract business category, services, or emergency availability.",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Zero AI Visibility",
    detail: "AI Visibility Score of 14/100 — Morrison Plumbing did not appear in ChatGPT, Perplexity, or Google AI Overviews for any local plumbing queries.",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Inconsistent Citations",
    detail: "14 NAP discrepancies found across Yelp, YellowPages, Angi, and local directories — confusing Google's entity resolution.",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function MorrisonPlumbingCaseStudy() {
  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudySchema) }}
      />

      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--color-accent-900)_0%,_transparent_50%)] opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8 font-mono flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/case-studies" className="hover:text-white transition-colors">Case Studies</Link>
            <span>/</span>
            <span className="text-navy-200">Morrison Plumbing</span>
          </nav>

          <div className="max-w-4xl">
            {/* Tags */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="font-mono text-xs bg-accent-500/10 border border-accent-500/20 text-accent-400 px-3 py-1 rounded-full">
                Home Services
              </span>
              <span className="font-mono text-xs bg-navy-800 border border-navy-700 text-navy-300 px-3 py-1 rounded-full">
                Buffalo, NY
              </span>
              <span className="flex items-center gap-1.5 font-mono text-xs text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                90-day engagement
              </span>
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-white leading-tight mb-4">
              Morrison Plumbing
            </h1>
            <p className="text-accent-400 font-display font-semibold text-xl sm:text-2xl mb-6 leading-snug">
              From page 3 to Map Pack #1 in 90 days
            </p>
            <p className="text-lg text-navy-300 leading-relaxed max-w-2xl">
              A family-owned emergency plumbing company in Buffalo, NY was invisible online despite 12 years in business. Six autonomous agents changed that in a single quarter.
            </p>
          </div>
        </div>
      </section>

      {/* Key metrics bar */}
      <section className="py-10 bg-navy-900/60 border-y border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {beforeAfterMetrics.map((metric) => (
              <div
                key={metric.label}
                className={`rounded-xl p-4 text-center border ${
                  metric.highlight
                    ? "bg-accent-500/10 border-accent-500/30"
                    : "bg-navy-950 border-navy-800"
                }`}
              >
                <div className={`font-display font-bold text-2xl sm:text-3xl mb-0.5 ${metric.highlight ? "text-accent-300" : "text-white"}`}>
                  {metric.after}{metric.unit}
                </div>
                <div className="font-mono text-xs text-navy-400 mb-1">{metric.label}</div>
                <div className="font-mono text-xs text-navy-600 line-through">{metric.before}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenge */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="h-px w-6 bg-accent-500 inline-block" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">The Challenge</span>
              <span className="h-px w-6 bg-accent-500 inline-block" />
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
              12 years in business. Invisible online.
            </h2>
            <p className="text-navy-300 leading-relaxed mb-10">
              Morrison Plumbing had a loyal customer base built on word-of-mouth, but their digital presence was a liability. When homeowners searched for emergency plumbers on Google at 2am, Morrison didn&apos;t show up — competitors with weaker reputations but stronger profiles did.
            </p>

            <div className="space-y-3">
              {challenges.map((c) => (
                <div key={c.label} className="flex items-start gap-4 bg-navy-900 border border-navy-800 rounded-xl p-5">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                    {c.icon}
                  </div>
                  <div>
                    <div className="font-display font-semibold text-white mb-1">{c.label}</div>
                    <p className="text-sm text-navy-300 leading-relaxed">{c.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-16 md:py-24 bg-navy-900/40 border-y border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="h-px w-6 bg-accent-500 inline-block" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">The Solution</span>
              <span className="h-px w-6 bg-accent-500 inline-block" />
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
              Six agents. One stack. Working in parallel.
            </h2>
            <p className="text-navy-300 leading-relaxed">
              RankedFirst.ai deployed the full local SEO agent stack simultaneously — not sequentially. Every signal was addressed within the first 30 days.
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-4">
            {agentsDeployed.map((agent) => (
              <div key={agent.name} className="bg-navy-950 border border-navy-800 rounded-xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent-500/10 text-accent-400 flex items-center justify-center shrink-0">
                  {agent.icon}
                </div>
                <div>
                  <Link
                    href={`/agents/${agent.slug}`}
                    className="font-display font-semibold text-white hover:text-accent-300 transition-colors text-sm"
                  >
                    {agent.name} →
                  </Link>
                  <p className="text-xs text-navy-400 leading-relaxed mt-1">{agent.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results — Before/After Detail */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="h-px w-6 bg-accent-500 inline-block" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">Results</span>
              <span className="h-px w-6 bg-accent-500 inline-block" />
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
              Before vs. after — by the numbers
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {beforeAfterMetrics.map((metric) => (
              <div key={metric.label} className="bg-navy-900 border border-navy-800 rounded-xl px-6 py-5">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className="font-display font-semibold text-white mb-0.5">{metric.label}</div>
                    {metric.query && (
                      <div className="font-mono text-xs text-navy-500">{metric.query}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 sm:gap-8 shrink-0">
                    <div className="text-center">
                      <div className="font-mono text-xs text-navy-500 uppercase tracking-wider mb-1">Before</div>
                      <div className="font-display font-bold text-xl text-navy-400">{metric.before}</div>
                    </div>
                    <svg className="w-5 h-5 text-accent-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="text-center">
                      <div className="font-mono text-xs text-accent-400 uppercase tracking-wider mb-1">After</div>
                      <div className={`font-display font-bold text-xl ${metric.highlight ? "text-accent-300" : "text-emerald-400"}`}>
                        {metric.after}{metric.unit}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24 bg-navy-900/40 border-y border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="h-px w-6 bg-accent-500 inline-block" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">Timeline</span>
              <span className="h-px w-6 bg-accent-500 inline-block" />
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
              What happened each month
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative pl-8 border-l border-navy-800 space-y-10">
              {timeline.map((phase, i) => (
                <div key={i} className="relative">
                  {/* Node */}
                  <div className={`absolute -left-[2.35rem] w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${phase.color === "accent"
                      ? "bg-accent-500 border-accent-400"
                      : phase.color === "emerald"
                      ? "bg-emerald-500 border-emerald-400"
                      : "bg-blue-500 border-blue-400"
                    }`}
                  >
                    <span className="font-mono text-[8px] font-bold text-white">{i + 1}</span>
                  </div>

                  <div className="bg-navy-950 border border-navy-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-mono text-sm font-bold text-white">{phase.month}</span>
                      <span className={`font-mono text-xs uppercase tracking-widest px-2 py-0.5 rounded-md
                        ${phase.color === "accent"
                          ? "bg-accent-500/10 text-accent-400"
                          : phase.color === "emerald"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-blue-500/10 text-blue-400"
                        }`}
                      >
                        {phase.label}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {phase.milestones.map((m, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-sm text-navy-300">
                          <div className="w-4 h-4 rounded-full bg-navy-800 text-navy-400 flex items-center justify-center shrink-0 mt-0.5">
                            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                              <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-navy-900 border border-accent-500/20 rounded-2xl px-8 py-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/5 rounded-full -translate-y-16 translate-x-16" />

              {/* Quote mark */}
              <div className="text-accent-500/30 font-display text-8xl leading-none mb-4 select-none" aria-hidden>
                &ldquo;
              </div>

              <blockquote className="text-lg sm:text-xl text-navy-200 leading-relaxed mb-8 font-display italic relative z-10">
                I&apos;ve been in business since 2012 and never invested much in marketing — we got by on referrals. But I kept watching a competitor I knew was newer than us show up first on Google every time. Within three months of working with RankedFirst, we were getting 6–8 calls a day just from the map. Last month we had to turn down work. That&apos;s never happened before.
              </blockquote>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-navy-800 border border-navy-700 flex items-center justify-center">
                  <span className="font-display font-bold text-white text-lg">DM</span>
                </div>
                <div>
                  <div className="font-display font-semibold text-white">Dave Morrison</div>
                  <div className="font-mono text-xs text-navy-400">Owner, Morrison Plumbing — Buffalo, NY</div>
                </div>
                {/* Stars */}
                <div className="ml-auto flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 24 24">
                      <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-navy-900/40 border-t border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy-900 border border-accent-500/20 rounded-3xl px-8 py-16 md:py-20 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-accent-500/10 border border-accent-500/20 rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">
                Your Business Could Be Next
              </span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
              Ready to rank first?
            </h2>
            <p className="text-navy-300 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Get the same autonomous agent stack deployed for your local business. We&apos;ll audit your current local presence and show you exactly where the gaps are.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="/contact" size="lg" variant="primary">
                Get a free visibility audit
              </Button>
              <Button href="/case-studies" size="lg" variant="secondary">
                View all case studies
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
