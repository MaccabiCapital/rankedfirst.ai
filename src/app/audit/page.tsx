"use client";

import { useState, useRef } from "react";
import Link from "next/link";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ─── Types ───────────────────────────────────────────────────────────
interface GeoGridResult { lat: number; lng: number; rank: number; found: boolean; topCompetitor: string }
interface GeoGridData {
  solv: number; avgRank: number;
  gridResults: GeoGridResult[];
  topCompetitors: Array<{ name: string; appearances: number }>;
}
interface ReviewItem { rating: number; text: string; time: string; hasReply: boolean }
interface ReviewsData {
  totalReviews: number; avgRating: number; replyRate: number; recentVelocity: number;
  ratingDistribution: Record<string, number>;
  topReviews: ReviewItem[];
}
interface LighthouseData {
  seoScore: number; performanceScore: number; accessibilityScore: number; bestPracticesScore: number;
  lcp: number; cls: number; fcp: number; speedIndex: number; tbt: number;
}
interface TechnicalData {
  hasHttps: boolean; hasRobotsTxt: boolean; hasSitemap: boolean;
  hasSchema: boolean; schemaTypes: string[];
  hasMetaDescription: boolean; hasH1: boolean;
  titleLength: number; descriptionLength: number;
  hasViewport: boolean; hasCanonical: boolean; hasNapOnSite: boolean;
  wordCount: number; internalLinks: number; externalLinks: number;
  imagesWithAlt: number; imagesWithoutAlt: number; hasGa4: boolean;
}
interface DirectoryResult { name: string; url: string; found: boolean | null; napCorrect: boolean | null; claimed: boolean | null }
interface OrganicKeywords {
  total: number; top10: number; top20: number; estimatedTraffic: number;
  keywords: Array<{ keyword: string; position: number; searchVolume: number; url: string }>;
}
interface GBPBusiness {
  name: string; address: string; phone: string; website: string; category: string;
  additionalCategories: string[]; rating: number; reviewCount: number; totalPhotos: number;
  isClaimed: boolean; hasHours: boolean; hasDescription: boolean; descriptionLength: number;
}
interface GBPCompetitor {
  name: string; rank: number; rating: number; reviewCount: number; totalPhotos: number;
  category: string; isClaimed: boolean;
}
interface CompetitorComparison {
  name: string; domain: string; pageRank: number | null; rankedKeywords: number; estimatedTraffic: number;
}
interface Opportunity {
  yours: number; topCompetitor: number; gap?: number; action: string;
  missing?: string[]; missingKeywords?: Array<{ keyword: string; volume: number; competitorPosition: number }>;
  hasSchema?: boolean;
}

interface AuditReport {
  summary: {
    overallScore: number; grade: string;
    sections: Array<{ name: string; status: "good" | "ok" | "poor"; score: number }>;
  };
  rankings: { geoGrid: GeoGridData | null; organicKeywords: OrganicKeywords | null };
  listings: { found: number; notFound: number; napConsistent: number; napErrors: number; directories: DirectoryResult[] };
  reviews: ReviewsData | null;
  gbpProfile: { business: GBPBusiness | null; competitors: GBPCompetitor[] };
  onSiteSeo: { lighthouse: LighthouseData | null; technical: TechnicalData | null };
  authority: { pageRank: number | null; indexedPages: number | null; domainAge: string | null; rankedKeywords: number; estimatedTraffic: number; competitorComparison: CompetitorComparison[] };
  opportunities: Record<string, Opportunity | null>;
  meta: { businessName: string; location: string; keyword: string; websiteUrl: string | null; auditDate: string; dataSources: Record<string, boolean>; estimatedCost: number };
}

// ─── Helpers ─────────────────────────────────────────────────────────
function statusColor(s: "good" | "ok" | "poor") {
  if (s === "good") return "text-emerald-400";
  if (s === "ok") return "text-amber-400";
  return "text-red-400";
}
function statusBg(s: "good" | "ok" | "poor") {
  if (s === "good") return "bg-emerald-500/20";
  if (s === "ok") return "bg-amber-500/20";
  return "bg-red-500/20";
}
function scoreRingColor(score: number) {
  if (score >= 70) return "#10b981";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}
function scoreColor(score: number) {
  if (score >= 70) return "text-emerald-400";
  if (score >= 40) return "text-amber-400";
  return "text-red-400";
}
function scoreBarColor(score: number) {
  if (score >= 70) return "bg-emerald-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-red-500";
}
function scoreLabel(score: number) {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Poor";
}
function check(ok: boolean | null) {
  if (ok === true) return <span className="text-emerald-400">&#10003;</span>;
  if (ok === false) return <span className="text-red-400">&#10007;</span>;
  return <span className="text-navy-500">—</span>;
}
const stars = (n: number) => "★".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n));

// ─── Score Ring SVG ──────────────────────────────────────────────────
function ScoreRing({ score, size = 160 }: { score: number; size?: number }) {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = scoreRingColor(score);
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={8} className="text-navy-800" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={8} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-display font-bold text-white">{score}</span>
        <span className="text-xs font-mono text-navy-400 uppercase tracking-wider">{scoreLabel(score)}</span>
      </div>
    </div>
  );
}

function MiniScoreRing({ score, size = 48 }: { score: number; size?: number }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = scoreRingColor(score);
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={3} className="text-navy-800" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={3} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span className="absolute text-xs font-mono font-bold text-white">{score}</span>
    </div>
  );
}

// ─── Section Icons ───────────────────────────────────────────────────
const sectionIcons: Record<string, React.ReactNode> = {
  Rankings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  Listings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  Reviews: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  "GBP Profile": <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  "On-Site SEO": <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  Authority: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" strokeLinecap="round" strokeLinejoin="round" /></svg>,
};

type TabKey = "rankings" | "listings" | "reviews" | "gbp" | "onsite" | "authority" | "opportunities";

// ─── Main Page ───────────────────────────────────────────────────────
export default function AuditPage() {
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [keyword, setKeyword] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("rankings");
  const resultsRef = useRef<HTMLDivElement>(null);

  async function runAudit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_name: businessName, location: stateProvince ? `${city}, ${stateProvince}` : city,
          keyword: keyword || undefined, website_url: websiteUrl || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Audit failed");
      setReport(data.report);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: "rankings", label: "Rankings" },
    { key: "listings", label: "Listings" },
    { key: "reviews", label: "Reviews" },
    { key: "gbp", label: "GBP Profile" },
    { key: "onsite", label: "On-Site SEO" },
    { key: "authority", label: "Authority" },
    { key: "opportunities", label: "Opportunities" },
  ];

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
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">Free Audit</span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6">
              Local SEO Audit.{" "}
              <span className="text-accent-400">7 dimensions. Real data.</span>
            </h1>
            <p className="text-lg sm:text-xl text-navy-300 leading-relaxed max-w-2xl">
              Enter your business details below and get a comprehensive audit across rankings, listings, reviews, GBP profile, on-site SEO, domain authority, and competitive opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={runAudit} className="bg-navy-900 border border-navy-800 rounded-2xl p-6 md:p-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2">
                <label className="block text-sm font-mono font-medium text-navy-300 mb-2">Business Name <span className="text-red-400">*</span></label>
                <input type="text" required value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. Morrison Plumbing" className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-lg text-white placeholder:text-navy-500 font-body focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-mono font-medium text-navy-300 mb-2">Website URL <span className="text-navy-500">(optional)</span></label>
                <input type="text" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="e.g. morrisonplumbing.com" className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-lg text-white placeholder:text-navy-500 font-body focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-mono font-medium text-navy-300 mb-2">City <span className="text-red-400">*</span></label>
                <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Denver" className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-lg text-white placeholder:text-navy-500 font-body focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-mono font-medium text-navy-300 mb-2">State / Province <span className="text-red-400">*</span></label>
                <input type="text" required value={stateProvince} onChange={(e) => setStateProvince(e.target.value)} placeholder="e.g. CO or Ontario" className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-lg text-white placeholder:text-navy-500 font-body focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-mono font-medium text-navy-300 mb-2">Primary Keyword <span className="text-navy-500">(optional)</span></label>
                <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. plumber" className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-lg text-white placeholder:text-navy-500 font-body focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent" />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <button type="submit" disabled={loading} className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-accent-600 text-white font-display font-medium rounded-lg transition-all duration-200 hover:bg-accent-500 border border-accent-600 hover:border-accent-500 shadow-sm disabled:opacity-50 disabled:pointer-events-none">
                {loading ? (
                  <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Running Audit...</>
                ) : (
                  <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" strokeLinecap="round" strokeLinejoin="round" /></svg>Run Free Audit</>
                )}
              </button>
              {loading && <span className="text-sm text-navy-400 font-mono">Analyzing 7 data sources... ~30-60 seconds</span>}
            </div>
          </form>
          {error && <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm font-mono">{error}</div>}
        </div>
      </section>

      {/* Results */}
      {report && (
        <section ref={resultsRef} className="pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Summary Dashboard */}
            <div className="bg-navy-900 border border-navy-800 rounded-2xl p-8 md:p-10 mb-8">
              <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                <ScoreRing score={report.summary.overallScore} />
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center gap-3 justify-center md:justify-start mb-1">
                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">{report.meta.businessName}</h2>
                    <span className={`text-sm font-mono font-bold px-2.5 py-1 rounded-lg ${report.summary.overallScore >= 70 ? "bg-emerald-500/20 text-emerald-400" : report.summary.overallScore >= 40 ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400"}`}>{report.summary.grade}</span>
                  </div>
                  <p className="text-navy-300 mb-1 font-mono text-sm">{report.meta.location} &middot; &ldquo;{report.meta.keyword}&rdquo;</p>
                  <p className="text-navy-500 text-xs font-mono">Audited {new Date(report.meta.auditDate).toLocaleDateString()}</p>
                </div>
              </div>
              {/* Section cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {report.summary.sections.map((sec) => (
                  <button key={sec.name} onClick={() => setActiveTab(sec.name === "GBP Profile" ? "gbp" : sec.name === "On-Site SEO" ? "onsite" : sec.name.toLowerCase() as TabKey)} className={`p-3 rounded-xl border text-left transition-all ${statusBg(sec.status)} border-navy-800/60 hover:border-navy-700`}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className={statusColor(sec.status)}>{sectionIcons[sec.name]}</span>
                      <span className="text-[10px] font-mono text-navy-400 uppercase tracking-wider">{sec.name}</span>
                    </div>
                    <span className={`text-xl font-display font-bold ${statusColor(sec.status)}`}>{sec.score}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 mb-8 bg-navy-900 border border-navy-800 rounded-xl p-1.5 overflow-x-auto">
              {tabs.map((tab) => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 py-2.5 text-sm font-display font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${activeTab === tab.key ? "bg-accent-600 text-white" : "text-navy-300 hover:text-white hover:bg-navy-800"}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Rankings Tab */}
            {activeTab === "rankings" && (
              <div className="space-y-6">
                {/* Geo-Grid */}
                {report.rankings.geoGrid ? (
                  <div className="bg-navy-900 border border-navy-800 rounded-xl p-6">
                    <h3 className="font-display font-bold text-lg text-white mb-1">Local Pack Geo-Grid</h3>
                    <p className="text-sm text-navy-400 mb-4">Each square represents a geographic point near your business. Green = you appear in Google's top 3 results. Amber = positions 4-10. Red = not visible. This shows how customers in different parts of the city see you.</p>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="grid grid-cols-3 gap-2.5">
                        {report.rankings.geoGrid.gridResults.map((r, i) => {
                          const bg = !r.found ? "bg-red-500/20 border-red-500/30" : r.rank <= 3 ? "bg-emerald-500/20 border-emerald-500/30" : "bg-amber-500/20 border-amber-500/30";
                          const txt = !r.found ? "text-red-400" : r.rank <= 3 ? "text-emerald-400" : "text-amber-400";
                          return (
                            <div key={i} className={`w-16 h-16 rounded-lg border flex flex-col items-center justify-center ${bg}`} title={r.found ? `Rank #${r.rank}` : `Not found — ${r.topCompetitor || "N/A"}`}>
                              <span className={`font-mono font-bold text-lg ${txt}`}>{r.found ? `#${r.rank}` : "—"}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <p className="text-xs font-mono text-navy-400 uppercase tracking-wider">Share of Local Voice</p>
                          <p className={`text-3xl font-display font-bold ${scoreColor(Math.round(report.rankings.geoGrid.solv * 100))}`}>{Math.round(report.rankings.geoGrid.solv * 100)}%</p>
                        </div>
                        {report.rankings.geoGrid.avgRank > 0 && (
                          <div>
                            <p className="text-xs font-mono text-navy-400 uppercase tracking-wider">Average Rank</p>
                            <p className="text-xl font-display font-bold text-white">#{report.rankings.geoGrid.avgRank.toFixed(1)}</p>
                          </div>
                        )}
                        {report.rankings.geoGrid.topCompetitors.length > 0 && (
                          <div>
                            <p className="text-xs font-mono text-navy-400 uppercase tracking-wider mb-1">Top Competitors</p>
                            <div className="space-y-1">
                              {report.rankings.geoGrid.topCompetitors.slice(0, 3).map((c, i) => (
                                <p key={i} className="text-sm text-navy-300 font-mono">{c.name} <span className="text-navy-500">({c.appearances}/9)</span></p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-navy-900 border border-navy-800 rounded-xl p-10 text-center">
                    <p className="text-navy-400">No geo-grid data — business GPS coordinates not available.</p>
                  </div>
                )}

                {/* Organic Keywords */}
                {report.rankings.organicKeywords && report.rankings.organicKeywords.total > 0 && (
                  <div className="bg-navy-900 border border-navy-800 rounded-xl overflow-hidden">
                    <div className="p-5 border-b border-navy-800">
                      <h3 className="font-display font-bold text-lg text-white">Organic Keywords</h3>
                      <div className="grid grid-cols-4 gap-4 mt-3">
                        {[
                          { label: "Total", value: report.rankings.organicKeywords.total },
                          { label: "Top 10", value: report.rankings.organicKeywords.top10, color: "text-emerald-400" },
                          { label: "Top 20", value: report.rankings.organicKeywords.top20, color: "text-amber-400" },
                          { label: "Est. Traffic", value: Math.round(report.rankings.organicKeywords.estimatedTraffic).toLocaleString() },
                        ].map((s) => (
                          <div key={s.label}>
                            <p className="text-[10px] font-mono text-navy-500 uppercase">{s.label}</p>
                            <p className={`text-lg font-display font-bold ${(s as any).color ?? "text-white"}`}>{s.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead><tr className="text-left text-xs font-mono uppercase tracking-wider text-navy-400 border-b border-navy-800">
                          <th className="px-5 py-3">Keyword</th><th className="px-5 py-3">Pos</th><th className="px-5 py-3">Volume</th><th className="px-5 py-3">URL</th>
                        </tr></thead>
                        <tbody className="divide-y divide-navy-800">
                          {report.rankings.organicKeywords.keywords.slice(0, 20).map((kw, i) => (
                            <tr key={i} className="hover:bg-navy-800/30">
                              <td className="px-5 py-3 text-sm font-display font-medium text-white">{kw.keyword}</td>
                              <td className="px-5 py-3"><span className={`inline-flex items-center justify-center w-8 h-6 rounded text-xs font-mono font-bold ${kw.position <= 3 ? "bg-emerald-500/20 text-emerald-400" : kw.position <= 10 ? "bg-emerald-500/10 text-emerald-300" : kw.position <= 20 ? "bg-amber-500/10 text-amber-400" : "bg-navy-800 text-navy-300"}`}>{kw.position}</span></td>
                              <td className="px-5 py-3 text-sm text-navy-300 font-mono">{kw.searchVolume > 0 ? kw.searchVolume.toLocaleString() : "—"}</td>
                              <td className="px-5 py-3 text-sm text-navy-500 font-mono max-w-[200px] truncate">{kw.url || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Keyword Discovery — shown when not ranking for target keyword */}
                {(report as any).keywordDiscovery && (report as any).keywordDiscovery.length > 0 && (
                  <div className="bg-navy-900 border border-accent-500/20 rounded-xl overflow-hidden">
                    <div className="p-5 border-b border-navy-800">
                      <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 text-accent-400">
                          <path d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Keyword Discovery
                      </h3>
                      <p className="text-sm text-navy-400 mt-1">You don't rank for your target keyword in the local pack. Here are related keywords extracted from your GBP and website — and whether you rank for them.</p>
                    </div>
                    <table className="w-full">
                      <thead><tr className="text-left text-xs font-mono uppercase tracking-wider text-navy-400 border-b border-navy-800">
                        <th className="px-5 py-3">Keyword</th><th className="px-5 py-3">Source</th><th className="px-5 py-3">In Local Pack?</th><th className="px-5 py-3">Rank</th>
                      </tr></thead>
                      <tbody className="divide-y divide-navy-800">
                        {((report as any).keywordDiscovery as Array<{keyword: string; source: string; found: boolean; rank: number}>).map((kd, i) => (
                          <tr key={i} className="hover:bg-navy-800/30">
                            <td className="px-5 py-3 text-sm font-display font-medium text-white">{kd.keyword}</td>
                            <td className="px-5 py-3"><span className="text-xs font-mono px-2 py-0.5 rounded bg-navy-800 text-navy-300">{kd.source}</span></td>
                            <td className="px-5 py-3 text-sm font-mono">
                              {kd.found ? <span className="text-emerald-400">&#10003; Yes</span> : <span className="text-red-400">&#10007; No</span>}
                            </td>
                            <td className="px-5 py-3">
                              {kd.found ? (
                                <span className={`inline-flex items-center justify-center w-8 h-6 rounded text-xs font-mono font-bold ${kd.rank <= 3 ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>#{kd.rank}</span>
                              ) : <span className="text-navy-600">—</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Listings Tab */}
            {activeTab === "listings" && (
              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: "Found", value: report.listings.found, color: "text-emerald-400" },
                    { label: "Not Found", value: report.listings.notFound, color: "text-red-400" },
                    { label: "NAP Correct", value: report.listings.napConsistent, color: "text-emerald-400" },
                    { label: "NAP Errors", value: report.listings.napErrors, color: "text-amber-400" },
                  ].map((s) => (
                    <div key={s.label} className="bg-navy-900 border border-navy-800 rounded-xl p-5">
                      <p className="text-xs font-mono text-navy-400 uppercase tracking-wider mb-1">{s.label}</p>
                      <p className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-navy-900 border border-navy-800 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead><tr className="text-left text-xs font-mono uppercase tracking-wider text-navy-400 border-b border-navy-800">
                      <th className="px-5 py-3">Directory</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">NAP Correct</th>
                    </tr></thead>
                    <tbody className="divide-y divide-navy-800">
                      {report.listings.directories.map((d, i) => (
                        <tr key={i} className="hover:bg-navy-800/30">
                          <td className="px-5 py-3 text-sm font-display font-medium text-white">{d.name}</td>
                          <td className="px-5 py-3 text-sm font-mono">
                            {d.found === true ? <span className="text-emerald-400">&#10003; Found</span> : d.found === false ? <span className="text-red-400">&#10007; Not Found</span> : <span className="text-navy-500">&#9888; Unknown</span>}
                          </td>
                          <td className="px-5 py-3 text-sm font-mono">{d.found === true ? (d.napCorrect ? <span className="text-emerald-400">&#10003;</span> : <span className="text-red-400">&#10007;</span>) : <span className="text-navy-600">—</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                {report.reviews ? (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-navy-900 border border-navy-800 rounded-xl p-5">
                        <p className="text-xs font-mono text-navy-400 uppercase mb-1">Rating</p>
                        <p className="text-2xl font-display font-bold text-white">{report.reviews.avgRating.toFixed(1)}</p>
                        <p className="text-amber-400 text-sm">{stars(report.reviews.avgRating)}</p>
                      </div>
                      <div className="bg-navy-900 border border-navy-800 rounded-xl p-5">
                        <p className="text-xs font-mono text-navy-400 uppercase mb-1">Total Reviews</p>
                        <p className="text-2xl font-display font-bold text-white">{report.reviews.totalReviews}</p>
                      </div>
                      {report.reviews.replyRate > 0 && (
                        <div className="bg-navy-900 border border-navy-800 rounded-xl p-5">
                          <p className="text-xs font-mono text-navy-400 uppercase mb-1">Reply Rate</p>
                          <p className="text-2xl font-display font-bold text-white">{Math.round(report.reviews.replyRate * 100)}%</p>
                          <div className="w-full h-1.5 bg-navy-800 rounded-full mt-1 overflow-hidden">
                            <div className={`h-full rounded-full ${report.reviews.replyRate >= 0.8 ? "bg-emerald-500" : report.reviews.replyRate >= 0.5 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${Math.round(report.reviews.replyRate * 100)}%` }} />
                          </div>
                        </div>
                      )}
                      {report.reviews.recentVelocity > 0 && (
                        <div className="bg-navy-900 border border-navy-800 rounded-xl p-5">
                          <p className="text-xs font-mono text-navy-400 uppercase mb-1">Velocity</p>
                          <p className="text-2xl font-display font-bold text-white">{report.reviews.recentVelocity.toFixed(1)}</p>
                          <p className="text-[10px] font-mono text-navy-500">reviews/mo</p>
                        </div>
                      )}
                    </div>
                    {/* Rating Distribution — only show if we have actual distribution data */}
                    {Object.values(report.reviews.ratingDistribution).some((v) => v > 0) && (
                    <div className="bg-navy-900 border border-navy-800 rounded-xl p-6">
                      <h3 className="font-display font-bold text-lg text-white mb-4">Rating Distribution</h3>
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const count = report.reviews!.ratingDistribution[String(star)] ?? 0;
                          const total = Object.values(report.reviews!.ratingDistribution).reduce((a, b) => a + b, 0);
                          const pct = total > 0 ? (count / total) * 100 : 0;
                          return (
                            <div key={star} className="flex items-center gap-3">
                              <span className="text-sm font-mono text-navy-300 w-8">{star}★</span>
                              <div className="flex-1 h-2 bg-navy-800 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-xs font-mono text-navy-500 w-8 text-right">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    )}
                    {/* Recent Reviews */}
                    {report.reviews.topReviews.length > 0 && (
                      <div className="bg-navy-900 border border-navy-800 rounded-xl p-6">
                        <h3 className="font-display font-bold text-lg text-white mb-4">Recent Reviews</h3>
                        <div className="space-y-3">
                          {report.reviews.topReviews.slice(0, 5).map((rev, i) => (
                            <div key={i} className="p-4 bg-navy-950/60 rounded-lg border border-navy-800/40">
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-amber-400 text-sm">{stars(rev.rating)}</span>
                                <span className="text-[10px] font-mono text-navy-600">{rev.time}</span>
                                {rev.hasReply && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">replied</span>}
                              </div>
                              <p className="text-sm text-navy-300 line-clamp-2">{rev.text || "No review text"}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-navy-900 border border-navy-800 rounded-xl p-10 text-center">
                    <p className="text-navy-400">No review data available.</p>
                  </div>
                )}
              </div>
            )}

            {/* GBP Profile Tab */}
            {activeTab === "gbp" && (
              <div className="space-y-6">
                {report.gbpProfile.business ? (
                  <>
                    {/* Profile Card */}
                    <div className="bg-navy-900 border border-navy-800 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-display font-bold text-lg text-white">{report.gbpProfile.business.name}</h3>
                        <span className={`text-xs font-mono px-2 py-1 rounded ${report.gbpProfile.business.isClaimed ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                          {report.gbpProfile.business.isClaimed ? "Claimed" : "Unclaimed"}
                        </span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        {[
                          { label: "Address", value: report.gbpProfile.business.address },
                          { label: "Phone", value: report.gbpProfile.business.phone },
                          { label: "Website", value: report.gbpProfile.business.website },
                          { label: "Category", value: report.gbpProfile.business.category },
                          { label: "Rating", value: `${report.gbpProfile.business.rating} stars (${report.gbpProfile.business.reviewCount} reviews)` },
                          { label: "Photos", value: String(report.gbpProfile.business.totalPhotos) },
                          { label: "Hours", value: report.gbpProfile.business.hasHours ? "Set" : "Missing" },
                          { label: "Description", value: report.gbpProfile.business.hasDescription ? `${report.gbpProfile.business.descriptionLength} chars` : "Missing" },
                        ].map((f) => (
                          <div key={f.label} className="flex gap-3">
                            <span className="font-mono text-navy-500 w-24 shrink-0">{f.label}</span>
                            <span className="text-navy-200 break-all">{f.value || "—"}</span>
                          </div>
                        ))}
                      </div>
                      {report.gbpProfile.business.additionalCategories.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {report.gbpProfile.business.additionalCategories.map((c, i) => (
                            <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-navy-800 text-navy-300">{c}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Completeness */}
                    <div className="bg-navy-900 border border-navy-800 rounded-xl p-6">
                      <h3 className="font-display font-bold text-white mb-3">Profile Completeness</h3>
                      {(() => {
                        const b = report.gbpProfile.business!;
                        const fields = [b.name, b.address, b.phone, b.website, b.category, b.additionalCategories.length > 0, b.totalPhotos > 0, b.isClaimed, b.hasHours, b.hasDescription, b.reviewCount > 0];
                        const pct = Math.round((fields.filter(Boolean).length / fields.length) * 100);
                        return (
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex-1 h-3 bg-navy-800 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${scoreBarColor(pct)}`} style={{ width: `${pct}%` }} />
                              </div>
                              <span className={`font-display font-bold text-lg ${scoreColor(pct)}`}>{pct}%</span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Competitor Table */}
                    {report.gbpProfile.competitors.length > 0 && (
                      <div className="bg-navy-900 border border-navy-800 rounded-xl overflow-hidden">
                        <div className="p-5 border-b border-navy-800">
                          <h3 className="font-display font-bold text-lg text-white">Competitor Comparison</h3>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead><tr className="text-left text-xs font-mono uppercase tracking-wider text-navy-400 border-b border-navy-800">
                              <th className="px-5 py-3">Business</th><th className="px-5 py-3">Rank</th><th className="px-5 py-3">Rating</th><th className="px-5 py-3">Reviews</th><th className="px-5 py-3">Photos</th><th className="px-5 py-3">Claimed</th>
                            </tr></thead>
                            <tbody className="divide-y divide-navy-800">
                              <tr className="bg-accent-600/5">
                                <td className="px-5 py-3 text-sm font-display font-semibold text-accent-400">{report.gbpProfile.business!.name} (You)</td>
                                <td className="px-5 py-3 text-sm text-navy-300 font-mono">—</td>
                                <td className="px-5 py-3 text-sm text-navy-300 font-mono">{report.gbpProfile.business!.rating}</td>
                                <td className="px-5 py-3 text-sm text-navy-300 font-mono">{report.gbpProfile.business!.reviewCount}</td>
                                <td className="px-5 py-3 text-sm text-navy-300 font-mono">{report.gbpProfile.business!.totalPhotos}</td>
                                <td className="px-5 py-3 text-sm">{check(report.gbpProfile.business!.isClaimed)}</td>
                              </tr>
                              {report.gbpProfile.competitors.map((c, i) => (
                                <tr key={i} className="hover:bg-navy-800/30">
                                  <td className="px-5 py-3 text-sm font-display font-medium text-white">{c.name}</td>
                                  <td className="px-5 py-3 text-sm text-navy-300 font-mono">#{c.rank || "—"}</td>
                                  <td className="px-5 py-3 text-sm text-navy-300 font-mono">{c.rating || "—"}</td>
                                  <td className="px-5 py-3 text-sm text-navy-300 font-mono">{c.reviewCount || "—"}</td>
                                  <td className="px-5 py-3 text-sm text-navy-300 font-mono">{c.totalPhotos || "—"}</td>
                                  <td className="px-5 py-3 text-sm">{check(c.isClaimed)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-navy-900 border border-navy-800 rounded-xl p-10 text-center">
                    <p className="text-navy-400">No Google Business Profile found.</p>
                  </div>
                )}
              </div>
            )}

            {/* On-Site SEO Tab */}
            {activeTab === "onsite" && (
              <div className="space-y-6">
                {report.onSiteSeo.lighthouse ? (
                  <>
                    {/* Lighthouse Scores */}
                    <div className="bg-navy-900 border border-navy-800 rounded-xl p-6">
                      <h3 className="font-display font-bold text-lg text-white mb-4">Lighthouse Scores</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                          { label: "SEO", score: report.onSiteSeo.lighthouse.seoScore },
                          { label: "Performance", score: report.onSiteSeo.lighthouse.performanceScore },
                          { label: "Accessibility", score: report.onSiteSeo.lighthouse.accessibilityScore },
                          { label: "Best Practices", score: report.onSiteSeo.lighthouse.bestPracticesScore },
                        ].map((s) => (
                          <div key={s.label} className="flex flex-col items-center">
                            <MiniScoreRing score={s.score} size={56} />
                            <span className="text-xs font-mono text-navy-400 mt-2">{s.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Core Web Vitals */}
                    <div className="bg-navy-900 border border-navy-800 rounded-xl p-6">
                      <h3 className="font-display font-bold text-lg text-white mb-4">Core Web Vitals</h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                          { label: "LCP", value: `${(report.onSiteSeo.lighthouse.lcp / 1000).toFixed(1)}s`, good: report.onSiteSeo.lighthouse.lcp <= 2500, ok: report.onSiteSeo.lighthouse.lcp <= 4000 },
                          { label: "CLS", value: report.onSiteSeo.lighthouse.cls.toFixed(3), good: report.onSiteSeo.lighthouse.cls <= 0.1, ok: report.onSiteSeo.lighthouse.cls <= 0.25 },
                          { label: "FCP", value: `${(report.onSiteSeo.lighthouse.fcp / 1000).toFixed(1)}s`, good: report.onSiteSeo.lighthouse.fcp <= 1800, ok: report.onSiteSeo.lighthouse.fcp <= 3000 },
                          { label: "Speed Index", value: `${(report.onSiteSeo.lighthouse.speedIndex / 1000).toFixed(1)}s`, good: report.onSiteSeo.lighthouse.speedIndex <= 3400, ok: report.onSiteSeo.lighthouse.speedIndex <= 5800 },
                          { label: "TBT", value: `${Math.round(report.onSiteSeo.lighthouse.tbt)}ms`, good: report.onSiteSeo.lighthouse.tbt <= 200, ok: report.onSiteSeo.lighthouse.tbt <= 600 },
                        ].map((v) => (
                          <div key={v.label} className="bg-navy-950/60 rounded-lg border border-navy-800/40 p-3 text-center">
                            <p className="text-xs font-mono text-navy-500 mb-1">{v.label}</p>
                            <p className={`text-lg font-display font-bold ${v.good ? "text-emerald-400" : v.ok ? "text-amber-400" : "text-red-400"}`}>{v.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-navy-900 border border-navy-800 rounded-xl p-10 text-center">
                    <p className="text-navy-400">No Lighthouse data — provide a website URL to enable this analysis.</p>
                  </div>
                )}

                {/* Technical Checklist */}
                {report.onSiteSeo.technical && (
                  <div className="bg-navy-900 border border-navy-800 rounded-xl p-6">
                    <h3 className="font-display font-bold text-lg text-white mb-4">Technical Checklist</h3>
                    <div className="grid md:grid-cols-2 gap-2">
                      {[
                        { label: "HTTPS", ok: report.onSiteSeo.technical.hasHttps },
                        { label: "robots.txt", ok: report.onSiteSeo.technical.hasRobotsTxt },
                        { label: "Sitemap", ok: report.onSiteSeo.technical.hasSitemap },
                        { label: "Schema Markup", ok: report.onSiteSeo.technical.hasSchema },
                        { label: "Meta Description", ok: report.onSiteSeo.technical.hasMetaDescription },
                        { label: "H1 Tag", ok: report.onSiteSeo.technical.hasH1 },
                        { label: "Viewport", ok: report.onSiteSeo.technical.hasViewport },
                        { label: "Canonical", ok: report.onSiteSeo.technical.hasCanonical },
                        { label: "NAP on Site", ok: report.onSiteSeo.technical.hasNapOnSite },
                        { label: "GA4 Installed", ok: report.onSiteSeo.technical.hasGa4 },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-navy-950/40">
                          {check(item.ok)}
                          <span className="text-sm text-navy-200 font-mono">{item.label}</span>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="bg-navy-950/40 rounded-lg p-3 text-center">
                        <p className="text-xs font-mono text-navy-500">Word Count</p>
                        <p className="text-lg font-display font-bold text-white">{report.onSiteSeo.technical.wordCount.toLocaleString()}</p>
                      </div>
                      <div className="bg-navy-950/40 rounded-lg p-3 text-center">
                        <p className="text-xs font-mono text-navy-500">Internal Links</p>
                        <p className="text-lg font-display font-bold text-white">{report.onSiteSeo.technical.internalLinks}</p>
                      </div>
                      <div className="bg-navy-950/40 rounded-lg p-3 text-center">
                        <p className="text-xs font-mono text-navy-500">Images (alt / no-alt)</p>
                        <p className="text-lg font-display font-bold text-white">{report.onSiteSeo.technical.imagesWithAlt} / {report.onSiteSeo.technical.imagesWithoutAlt}</p>
                      </div>
                    </div>
                    {report.onSiteSeo.technical.schemaTypes.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span className="text-xs font-mono text-navy-500">Schema types:</span>
                        {report.onSiteSeo.technical.schemaTypes.map((t, i) => (
                          <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Authority Tab */}
            {activeTab === "authority" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-navy-900 border border-navy-800 rounded-xl p-5">
                    <p className="text-xs font-mono text-navy-400 uppercase mb-1">PageRank</p>
                    <p className="text-2xl font-display font-bold text-white">{report.authority.pageRank !== null ? report.authority.pageRank.toFixed(1) : "—"}</p>
                    <p className="text-[10px] font-mono text-navy-500">/10</p>
                  </div>
                  <div className="bg-navy-900 border border-navy-800 rounded-xl p-5">
                    <p className="text-xs font-mono text-navy-400 uppercase mb-1">Indexed Pages</p>
                    <p className="text-2xl font-display font-bold text-white">{report.authority.indexedPages !== null ? report.authority.indexedPages.toLocaleString() : "—"}</p>
                  </div>
                  <div className="bg-navy-900 border border-navy-800 rounded-xl p-5">
                    <p className="text-xs font-mono text-navy-400 uppercase mb-1">Ranked Keywords</p>
                    <p className="text-2xl font-display font-bold text-white">{report.authority.rankedKeywords}</p>
                  </div>
                  <div className="bg-navy-900 border border-navy-800 rounded-xl p-5">
                    <p className="text-xs font-mono text-navy-400 uppercase mb-1">Est. Traffic</p>
                    <p className="text-2xl font-display font-bold text-white">{Math.round(report.authority.estimatedTraffic).toLocaleString()}</p>
                  </div>
                </div>

                {report.authority.competitorComparison.length > 0 && (
                  <div className="bg-navy-900 border border-navy-800 rounded-xl overflow-hidden">
                    <div className="p-5 border-b border-navy-800">
                      <h3 className="font-display font-bold text-lg text-white">Competitor Authority</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead><tr className="text-left text-xs font-mono uppercase tracking-wider text-navy-400 border-b border-navy-800">
                          <th className="px-5 py-3">Domain</th><th className="px-5 py-3">PageRank</th><th className="px-5 py-3">Keywords</th><th className="px-5 py-3">Est. Traffic</th>
                        </tr></thead>
                        <tbody className="divide-y divide-navy-800">
                          {report.meta.websiteUrl && (
                            <tr className="bg-accent-600/5">
                              <td className="px-5 py-3 text-sm font-display font-semibold text-accent-400">{report.meta.websiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")} (You)</td>
                              <td className="px-5 py-3 text-sm text-navy-300 font-mono">{report.authority.pageRank?.toFixed(1) ?? "—"}</td>
                              <td className="px-5 py-3 text-sm text-navy-300 font-mono">{report.authority.rankedKeywords}</td>
                              <td className="px-5 py-3 text-sm text-navy-300 font-mono">{Math.round(report.authority.estimatedTraffic).toLocaleString()}</td>
                            </tr>
                          )}
                          {report.authority.competitorComparison.map((c, i) => (
                            <tr key={i} className="hover:bg-navy-800/30">
                              <td className="px-5 py-3 text-sm font-display font-medium text-white">{c.domain}</td>
                              <td className="px-5 py-3 text-sm text-navy-300 font-mono">{c.pageRank?.toFixed(1) ?? "—"}</td>
                              <td className="px-5 py-3 text-sm text-navy-300 font-mono">{c.rankedKeywords}</td>
                              <td className="px-5 py-3 text-sm text-navy-300 font-mono">{Math.round(c.estimatedTraffic).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Opportunities Tab */}
            {activeTab === "opportunities" && (
              <div className="space-y-4">
                {Object.entries(report.opportunities)
                  .filter(([, v]) => v !== null)
                  .sort(([, a], [, b]) => ((b as any)?.gap ?? 0) - ((a as any)?.gap ?? 0))
                  .map(([key, opp]) => {
                    if (!opp) return null;
                    const labels: Record<string, string> = {
                      reviewGap: "Review Gap", photoGap: "Photo Gap", categoryGap: "Category Gap",
                      keywordGap: "Keyword Gap", replyRateGap: "Reply Rate", speedGap: "Page Speed",
                      schemaGap: "Schema Markup", listingGap: "Listing Coverage",
                    };
                    const hasBar = opp.yours !== undefined && opp.topCompetitor !== undefined && opp.topCompetitor > 0;
                    const pct = hasBar ? Math.round((opp.yours / opp.topCompetitor) * 100) : 0;
                    return (
                      <div key={key} className="bg-navy-900 border border-navy-800 rounded-xl p-5">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-display font-semibold text-white">{labels[key] ?? key}</h3>
                          {opp.gap !== undefined && opp.gap > 0 && (
                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400">-{opp.gap} gap</span>
                          )}
                        </div>
                        {hasBar && (
                          <div className="mb-3">
                            <div className="flex justify-between text-xs font-mono mb-1">
                              <span className="text-accent-400">You: {opp.yours}</span>
                              <span className="text-navy-400">Top Competitor: {opp.topCompetitor}</span>
                            </div>
                            <div className="w-full h-2 bg-navy-800 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${pct >= 80 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                            </div>
                          </div>
                        )}
                        <p className="text-sm text-navy-300">{opp.action}</p>
                        {(opp as any).missingKeywords?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {(opp as any).missingKeywords.slice(0, 5).map((mk: any, i: number) => (
                              <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-navy-800 text-navy-300">
                                {mk.keyword} <span className="text-navy-500">({mk.volume}/mo)</span>
                              </span>
                            ))}
                          </div>
                        )}
                        {opp.missing && opp.missing.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {opp.missing.map((m: string, i: number) => (
                              <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-red-500/10 text-red-400">{m}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                {Object.values(report.opportunities).every((v) => v === null) && (
                  <div className="bg-navy-900 border border-navy-800 rounded-xl p-10 text-center">
                    <p className="text-navy-400">No opportunity gaps identified. Your business is performing well!</p>
                  </div>
                )}

                {/* CTA */}
                <div className="bg-navy-900 border border-accent-500/20 rounded-2xl p-8 text-center mt-6">
                  <h3 className="font-display font-bold text-2xl text-white mb-3">Want us to close these gaps?</h3>
                  <p className="text-navy-300 text-sm mb-6 max-w-lg mx-auto">
                    Our autonomous agents can implement every opportunity — from review management to citation fixes to content optimization — all on autopilot.
                  </p>
                  <Link href="/contact" className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-accent-600 text-white font-display font-medium rounded-lg transition-all duration-200 hover:bg-accent-500 border border-accent-600 hover:border-accent-500 shadow-sm">
                    Get Started
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Bottom CTA (no results) */}
      {!report && !loading && (
        <section className="pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {[
                { title: "7 Dimensions", desc: "Rankings, listings, reviews, GBP profile, on-site SEO, domain authority, and competitive opportunities." },
                { title: "Real Data Sources", desc: "Google Maps API, PageSpeed Insights, PageRank, directory checks, and live review analysis." },
                { title: "Action Plan", desc: "Quantified gaps vs. your top competitors with specific actions to close each one." },
              ].map((f) => (
                <div key={f.title} className="bg-navy-900 border border-navy-800 rounded-xl p-6">
                  <h3 className="font-display font-bold text-lg text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-navy-300 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
