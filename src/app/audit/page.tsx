"use client";

import { useState, useRef } from "react";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────
interface Dimension {
  label: string;
  score: number;
  weight: number;
  detail: string;
  weighted: number;
  icon: string;
}

interface QuickWin {
  action: string;
  impact: string;
  effort: string;
}

interface StrategicItem {
  action: string;
  impact: string;
  timeline: string;
}

interface CompetitorInsight {
  name: string;
  rating: number;
  reviews: number;
  advantages: string[];
  rank: number;
}

interface AuditResult {
  status: string;
  business: {
    name: string;
    location: string;
    keyword: string;
    website: string | null;
  };
  scorecard: {
    totalScore: number;
    dimensions: Dimension[];
  };
  gapAnalysis: {
    quickWins: QuickWin[];
    strategic: StrategicItem[];
    competitorInsights: CompetitorInsight[];
    gaps: string[];
  };
  recommendations: string[];
  rawProfile: Record<string, unknown> | null;
  competitors: Array<Record<string, unknown>>;
  creditsUsed?: number;
  creditsRemaining?: number | null;
}

// ─── Score Color Helpers ─────────────────────────────────────────────
function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-red-400";
}

function scoreBg(score: number) {
  if (score >= 80) return "bg-emerald-500/20";
  if (score >= 60) return "bg-amber-500/20";
  return "bg-red-500/20";
}

function scoreBarColor(score: number) {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-red-500";
}

function scoreLabel(score: number) {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Moderate";
  if (score >= 40) return "Needs Work";
  return "Critical";
}

function scoreRingColor(score: number) {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
}

// ─── Dimension Icons ─────────────────────────────────────────────────
const dimensionIcons: Record<string, React.ReactNode> = {
  ranking: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  reviews: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  citations: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  onpage: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  ai: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  competitive: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  health: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

// ─── Score Ring SVG ──────────────────────────────────────────────────
function ScoreRing({ score, size = 160 }: { score: number; size?: number }) {
  const r = (size - 16) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const color = scoreRingColor(score);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={8}
          className="text-navy-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-display font-bold text-white">{score}</span>
        <span className="text-xs font-mono text-navy-400 uppercase tracking-wider">{scoreLabel(score)}</span>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────
export default function AuditPage() {
  const [businessName, setBusinessName] = useState("");
  const [location, setLocation] = useState("");
  const [keyword, setKeyword] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [activeTab, setActiveTab] = useState<"scorecard" | "gaps" | "plan">("scorecard");
  const resultsRef = useRef<HTMLDivElement>(null);

  async function runAudit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_name: businessName,
          location,
          keyword: keyword || undefined,
          website_url: websiteUrl || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Audit failed");
      }

      setResult(data);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-navy-800)_0%,_transparent_60%)] opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8 font-mono">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-navy-200">SEO Audit</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="h-px w-6 bg-accent-500 inline-block" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">
                Free Audit
              </span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6">
              Local SEO Audit.{" "}
              <span className="text-accent-400">8 dimensions. Real data.</span>
            </h1>
            <p className="text-lg sm:text-xl text-navy-300 leading-relaxed max-w-2xl">
              Enter your business details below and get a comprehensive audit across rankings, reviews, citations, on-page SEO, AI visibility, and more — with a competitive gap analysis and action plan.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={runAudit} className="bg-navy-900 border border-navy-800 rounded-2xl p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-mono font-medium text-navy-300 mb-2">
                  Business Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Morrison Plumbing"
                  className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-lg text-white placeholder:text-navy-500 font-body focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-mono font-medium text-navy-300 mb-2">
                  Location <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Denver, CO"
                  className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-lg text-white placeholder:text-navy-500 font-body focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-mono font-medium text-navy-300 mb-2">
                  Primary Keyword <span className="text-navy-500">(optional)</span>
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. plumber"
                  className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-lg text-white placeholder:text-navy-500 font-body focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-mono font-medium text-navy-300 mb-2">
                  Website URL <span className="text-navy-500">(optional, enables on-page + AI audit)</span>
                </label>
                <input
                  type="text"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="e.g. https://morrisonplumbing.com"
                  className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-lg text-white placeholder:text-navy-500 font-body focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-accent-600 text-white font-display font-medium rounded-lg transition-all duration-200 hover:bg-accent-500 border border-accent-600 hover:border-accent-500 shadow-sm disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Running Audit...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
                      <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Run Free Audit
                  </>
                )}
              </button>
              {loading && (
                <span className="text-sm text-navy-400 font-mono">
                  Analyzing 7 data sources... ~15-30 seconds
                </span>
              )}
            </div>
          </form>

          {error && (
            <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm font-mono">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      {result && (
        <section ref={resultsRef} className="pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Overall Score Header */}
            <div className="bg-navy-900 border border-navy-800 rounded-2xl p-8 md:p-10 mb-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <ScoreRing score={result.scorecard.totalScore} />
                <div className="flex-1 text-center md:text-left">
                  <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-2">
                    {result.business.name}
                  </h2>
                  <p className="text-navy-300 mb-1 font-mono text-sm">
                    {result.business.location} &middot; &ldquo;{result.business.keyword}&rdquo;
                  </p>
                  <p className="text-navy-400 text-sm">
                    {result.scorecard.totalScore >= 80
                      ? "Strong local presence. Focus on maintaining and expanding."
                      : result.scorecard.totalScore >= 60
                        ? "Good foundation with clear opportunities to improve."
                        : result.scorecard.totalScore >= 40
                          ? "Significant gaps detected. Action plan recommended."
                          : "Critical issues need immediate attention."}
                  </p>
                  {/* Data sources indicator */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {result.scorecard.dimensions.map((dim) => (
                      <span
                        key={dim.label}
                        className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          dim.score > 0
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-navy-800 text-navy-500"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          dim.score > 0 ? "bg-emerald-400" : "bg-navy-600"
                        }`} />
                        {dim.label.split(" ")[0]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 mb-8 bg-navy-900 border border-navy-800 rounded-xl p-1.5 w-fit">
              {(
                [
                  { key: "scorecard", label: "Scorecard" },
                  { key: "gaps", label: "Competitive Gaps" },
                  { key: "plan", label: "Action Plan" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-5 py-2.5 text-sm font-display font-medium rounded-lg transition-all duration-200 ${
                    activeTab === tab.key
                      ? "bg-accent-600 text-white"
                      : "text-navy-300 hover:text-white hover:bg-navy-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Scorecard Tab */}
            {activeTab === "scorecard" && (
              <div className="space-y-4">
                {result.scorecard.dimensions.map((dim) => (
                  <div
                    key={dim.label}
                    className="bg-navy-900 border border-navy-800 rounded-xl p-5 flex items-center gap-5"
                  >
                    <div className={`shrink-0 p-2.5 rounded-lg ${scoreBg(dim.score)}`}>
                      <span className={scoreColor(dim.score)}>
                        {dimensionIcons[dim.icon] || dimensionIcons.health}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <h3 className="font-display font-semibold text-white text-sm">
                          {dim.label}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-navy-500">
                            {Math.round(dim.weight * 100)}% weight
                          </span>
                          <span className={`font-display font-bold text-lg ${scoreColor(dim.score)}`}>
                            {dim.score}
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-navy-800 rounded-full overflow-hidden mb-2">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${scoreBarColor(dim.score)}`}
                          style={{ width: `${dim.score}%` }}
                        />
                      </div>
                      <p className="text-xs text-navy-400 font-mono">{dim.detail}</p>
                    </div>
                  </div>
                ))}

                {/* Recommendations */}
                {result.recommendations.length > 0 && (
                  <div className="bg-navy-900 border border-accent-500/20 rounded-xl p-6 mt-6">
                    <h3 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 text-accent-400">
                        <path d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Key Recommendations
                    </h3>
                    <ul className="space-y-3">
                      {result.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-navy-300">
                          <span className="shrink-0 w-5 h-5 rounded-full bg-accent-600/20 text-accent-400 flex items-center justify-center text-xs font-mono font-bold mt-0.5">
                            {i + 1}
                          </span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Competitive Gaps Tab */}
            {activeTab === "gaps" && (
              <div className="space-y-6">
                {/* Competitor Table */}
                {result.gapAnalysis.competitorInsights.length > 0 && (
                  <div className="bg-navy-900 border border-navy-800 rounded-xl overflow-hidden">
                    <div className="p-5 border-b border-navy-800">
                      <h3 className="font-display font-bold text-lg text-white">Competitor Comparison</h3>
                      <p className="text-sm text-navy-400 mt-1">How your top competitors stack up</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-xs font-mono uppercase tracking-wider text-navy-400 border-b border-navy-800">
                            <th className="px-5 py-3">Business</th>
                            <th className="px-5 py-3">Rank</th>
                            <th className="px-5 py-3">Rating</th>
                            <th className="px-5 py-3">Reviews</th>
                            <th className="px-5 py-3">Advantages</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-navy-800">
                          {/* Your business first */}
                          <tr className="bg-accent-600/5">
                            <td className="px-5 py-3.5 text-sm font-display font-semibold text-accent-400">
                              {result.business.name} (You)
                            </td>
                            <td className="px-5 py-3.5 text-sm text-navy-300 font-mono">—</td>
                            <td className="px-5 py-3.5 text-sm text-navy-300 font-mono">—</td>
                            <td className="px-5 py-3.5 text-sm text-navy-300 font-mono">—</td>
                            <td className="px-5 py-3.5 text-sm text-navy-400">—</td>
                          </tr>
                          {result.gapAnalysis.competitorInsights.map((comp, i) => (
                            <tr key={i}>
                              <td className="px-5 py-3.5 text-sm font-display font-medium text-white">
                                {comp.name}
                              </td>
                              <td className="px-5 py-3.5 text-sm text-navy-300 font-mono">
                                #{comp.rank || "—"}
                              </td>
                              <td className="px-5 py-3.5 text-sm text-navy-300 font-mono">
                                {comp.rating || "—"}
                              </td>
                              <td className="px-5 py-3.5 text-sm text-navy-300 font-mono">
                                {comp.reviews || "—"}
                              </td>
                              <td className="px-5 py-3.5">
                                <div className="flex flex-wrap gap-1.5">
                                  {comp.advantages.slice(0, 3).map((adv, j) => (
                                    <span
                                      key={j}
                                      className="inline-flex text-xs font-mono px-2 py-0.5 rounded-md bg-red-500/10 text-red-400"
                                    >
                                      {adv}
                                    </span>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Gap List */}
                {result.gapAnalysis.gaps.length > 0 && (
                  <div className="bg-navy-900 border border-navy-800 rounded-xl p-6">
                    <h3 className="font-display font-bold text-lg text-white mb-4">Identified Gaps</h3>
                    <div className="space-y-3">
                      {result.gapAnalysis.gaps.map((gap, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-navy-800/50 rounded-lg">
                          <svg className="w-4 h-4 mt-0.5 text-amber-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span className="text-sm text-navy-200">{gap}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.gapAnalysis.competitorInsights.length === 0 && result.gapAnalysis.gaps.length === 0 && (
                  <div className="bg-navy-900 border border-navy-800 rounded-xl p-10 text-center">
                    <p className="text-navy-400">No competitor data available for this business.</p>
                  </div>
                )}
              </div>
            )}

            {/* Action Plan Tab */}
            {activeTab === "plan" && (
              <div className="space-y-8">
                {/* Quick Wins */}
                {result.gapAnalysis.quickWins.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-emerald-500/20">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 text-emerald-400">
                          <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-lg text-white">Quick Wins</h3>
                        <p className="text-sm text-navy-400">High-impact actions you can do this week</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {result.gapAnalysis.quickWins.map((win, i) => (
                        <div
                          key={i}
                          className="bg-navy-900 border border-navy-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-start gap-4"
                        >
                          <div className="shrink-0 w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                            <span className="text-emerald-400 font-mono font-bold text-sm">{i + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white font-display font-medium mb-2">{win.action}</p>
                            <div className="flex flex-wrap gap-3 text-xs font-mono">
                              <span className="text-emerald-400">Impact: {win.impact}</span>
                              <span className="text-navy-400">Effort: {win.effort}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strategic Priorities */}
                {result.gapAnalysis.strategic.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-purple-500/20">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 text-purple-400">
                          <path d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-lg text-white">Strategic Priorities</h3>
                        <p className="text-sm text-navy-400">Longer-term investments to close competitive gaps</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {result.gapAnalysis.strategic.map((item, i) => (
                        <div
                          key={i}
                          className="bg-navy-900 border border-navy-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-start gap-4"
                        >
                          <div className="shrink-0 w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                            <span className="text-purple-400 font-mono font-bold text-sm">{i + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white font-display font-medium mb-2">{item.action}</p>
                            <div className="flex flex-wrap gap-3 text-xs font-mono">
                              <span className="text-purple-400">Impact: {item.impact}</span>
                              <span className="text-navy-400">Timeline: {item.timeline}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.gapAnalysis.quickWins.length === 0 && result.gapAnalysis.strategic.length === 0 && (
                  <div className="bg-navy-900 border border-navy-800 rounded-xl p-10 text-center">
                    <p className="text-navy-400">No specific action items could be generated. Try including a website URL for more detailed analysis.</p>
                  </div>
                )}

                {/* CTA */}
                <div className="bg-navy-900 border border-accent-500/20 rounded-2xl p-8 text-center">
                  <h3 className="font-display font-bold text-2xl text-white mb-3">
                    Want us to execute this plan?
                  </h3>
                  <p className="text-navy-300 text-sm mb-6 max-w-lg mx-auto">
                    Our autonomous agents can implement every action item — from citation fixes to review management to AI visibility optimization — all on autopilot.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-accent-600 text-white font-display font-medium rounded-lg transition-all duration-200 hover:bg-accent-500 border border-accent-600 hover:border-accent-500 shadow-sm"
                  >
                    Get Started
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Bottom CTA (shown when no results) */}
      {!result && !loading && (
        <section className="pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {[
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
                      <path d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                  title: "8 Dimensions",
                  desc: "Rankings, GBP profile, reviews, citations, on-page SEO, AI visibility, competitive position, and overall health.",
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
                      <path d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                  title: "Competitive Gap Analysis",
                  desc: "See exactly how you compare to your top 5 local competitors across every metric.",
                },
                {
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
                      <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                  title: "Action Plan",
                  desc: "Quick wins you can execute today plus strategic priorities to close the gap over time.",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="bg-navy-900 border border-navy-800 rounded-xl p-6"
                >
                  <div className="inline-flex p-2.5 rounded-lg bg-accent-600/10 text-accent-400 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-display font-bold text-lg text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-navy-300 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
