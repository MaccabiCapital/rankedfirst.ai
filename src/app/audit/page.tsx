"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ─── Types ───────────────────────────────────────────────────────────
interface DimensionItem {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  status: string;
  detail: string;
}

interface Dimension {
  score: number;
  maxScore: number;
  pct: number;
  items: DimensionItem[];
}

interface FrameworkScore {
  score: number;
  grade: string;
  dimensions: Record<string, Dimension>;
  vetosTriggered: string[];
}

interface Opportunity {
  priority: string;
  title: string;
  category: string;
  currentState: string;
  targetState: string;
  impact: string;
  effort: string;
  steps: string[];
}

interface CompetitorInfo {
  name: string;
  rating: number;
  reviews: number;
  photos: number;
  strengths: string[];
  yourAdvantage: string[];
}

interface GeoGridResult {
  lat: number; lng: number; rank: number; found: boolean; topCompetitor: string;
}

interface GeoGridData {
  solv: number; avgRank: number;
  gridResults: GeoGridResult[];
  topCompetitors: Array<{ name: string; appearances: number }>;
}

interface DirectoryResult {
  name: string; url: string; found: boolean | null; napCorrect: boolean | null; claimed: boolean | null;
}

interface WebsiteAnalysis {
  hasHttps: boolean; hasRobotsTxt: boolean; hasSitemap: boolean;
  hasSchema: boolean; schemaTypes: string[];
  hasMetaDescription: boolean; hasH1: boolean;
  titleTag: string; titleLength: number; metaDescription: string; descriptionLength: number;
  hasViewport: boolean; hasCanonical: boolean; hasNapOnSite: boolean;
  wordCount: number; internalLinks: number; externalLinks: number;
  imagesWithAlt: number; imagesWithoutAlt: number; hasGa4: boolean;
}

interface AuditReport {
  localImpact: FrameworkScore;
  serpTrust: FrameworkScore;
  seoHealthIndex: { score: number; grade: string; formula: string };
  geoGrid: { solv: number; avgRank: number; summary: string; topCompetitors: Array<{ name: string; appearances: number }> };
  opportunities: Opportunity[];
  competitorAnalysis: { summary: string; competitors: CompetitorInfo[] };
  keywordInsights: {
    summary: string;
    rankingKeywords: Array<{ keyword: string; position: number; volume: number }>;
    suggestedKeywords: Array<{ keyword: string; rationale: string; competition: string }>;
  };
  executiveSummary: string;
  // Raw data attached by API
  rawGeoGrid: GeoGridData | null;
  rawDirectories: DirectoryResult[];
  rawTechnical: WebsiteAnalysis | null;
  rawKeywords: Array<{ keyword: string; position: number; searchVolume: number; url: string }>;
  rawKeywordsTotal: number;
  rawETV: number;
  meta: { businessName: string; location: string; keyword: string; websiteUrl: string | null; auditDate: string };
}

// ─── Helpers ─────────────────────────────────────────────────────────
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
function gradeColor(grade: string) {
  if (grade.startsWith("A")) return "bg-emerald-500/20 text-emerald-400";
  if (grade.startsWith("B")) return "bg-blue-500/20 text-blue-400";
  if (grade.startsWith("C")) return "bg-amber-500/20 text-amber-400";
  return "bg-red-500/20 text-red-400";
}
function statusBadge(status: string) {
  const colors: Record<string, string> = {
    excellent: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    good: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    fair: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    weak: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    absent: "bg-red-500/15 text-red-400 border-red-500/30",
    critical: "bg-red-500/20 text-red-300 border-red-500/40",
  };
  return colors[status] ?? "bg-navy-800 text-navy-300 border-navy-700";
}
function priorityColor(priority: string) {
  if (priority === "critical") return "bg-red-500/15 text-red-400 border-red-500/30";
  if (priority === "high") return "bg-orange-500/15 text-orange-400 border-orange-500/30";
  if (priority === "medium") return "bg-amber-500/15 text-amber-400 border-amber-500/30";
  return "bg-blue-500/15 text-blue-400 border-blue-500/30";
}
function check(ok: boolean | null) {
  if (ok === true) return <span className="text-emerald-400">&#10003;</span>;
  if (ok === false) return <span className="text-red-400">&#10007;</span>;
  return <span className="text-navy-500">&mdash;</span>;
}

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

function MiniScoreRing({ score, size = 56 }: { score: number; size?: number }) {
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

// ─── Dimension Labels ───────────────────────────────────────────────
const LOCAL_IMPACT_DIMS: Record<string, { label: string; code: string }> = {
  listingQuality: { label: "Listing Quality", code: "L" },
  onlineReviews: { label: "Online Reviews", code: "O" },
  citationConsistency: { label: "Citations", code: "C" },
  authoritySignals: { label: "Authority", code: "A" },
  localContent: { label: "Local Content", code: "L2" },
  integratedVisibility: { label: "Visibility", code: "I" },
  performance: { label: "Performance", code: "P" },
  tracking: { label: "Tracking", code: "T" },
};

const SERP_TRUST_DIMS: Record<string, { label: string; code: string }> = {
  technicalFoundation: { label: "Technical", code: "T" },
  rankingSignals: { label: "Ranking Signals", code: "R" },
  userExperience: { label: "User Experience", code: "U" },
  searchAuthority: { label: "Search Authority", code: "S" },
  trustAiReadiness: { label: "Trust & AI", code: "T2" },
};

type TabKey = "overview" | "local-impact" | "serp-trust" | "geo-grid" | "opportunities" | "competitors" | "keywords";

// ─── Main Page ───────────────────────────────────────────────────────
export default function AuditPage() {
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [keyword, setKeyword] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState<"collecting" | "analyzing">("collecting");
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [activeDimension, setActiveDimension] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Switch loading phase message after 20 seconds
  useEffect(() => {
    if (!loading) return;
    setLoadingPhase("collecting");
    const timer = setTimeout(() => setLoadingPhase("analyzing"), 20000);
    return () => clearTimeout(timer);
  }, [loading]);

  async function runAudit(e: React.FormEvent) {
    e.preventDefault();
    if (!businessName.trim()) { setError("Business name is required"); return; }
    if (!city.trim()) { setError("City is required"); return; }
    if (!stateProvince.trim()) { setError("State / Province is required"); return; }
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_name: businessName,
          location: stateProvince ? `${city}, ${stateProvince}` : city,
          keyword: keyword || undefined,
          website_url: websiteUrl || undefined,
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
    { key: "overview", label: "Overview" },
    { key: "local-impact", label: "LOCAL-IMPACT" },
    { key: "serp-trust", label: "SERP-TRUST" },
    { key: "geo-grid", label: "Geo-Grid" },
    { key: "opportunities", label: "Opportunities" },
    { key: "competitors", label: "Competitors" },
    { key: "keywords", label: "Keywords" },
  ];

  // Render a framework dimension detail panel
  function renderDimension(dim: Dimension, dimKey: string, maxPerItem: number) {
    return (
      <div className="bg-navy-900 border border-navy-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-navy-800 flex items-center justify-between">
          <div>
            <h4 className="font-display font-bold text-white">{(LOCAL_IMPACT_DIMS[dimKey] ?? SERP_TRUST_DIMS[dimKey])?.label ?? dimKey}</h4>
            <p className="text-xs font-mono text-navy-400 mt-0.5">{dim.score}/{dim.maxScore} points ({dim.pct}%)</p>
          </div>
          <MiniScoreRing score={dim.pct} />
        </div>
        <div className="divide-y divide-navy-800/50">
          {dim.items.map((item) => (
            <div key={item.id} className="px-5 py-3 flex items-start gap-3">
              <div className="flex items-center gap-2 min-w-[140px] shrink-0">
                <span className="text-[10px] font-mono text-navy-500 w-7">{item.id}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: maxPerItem }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2.5 h-2.5 rounded-sm ${i < item.score
                        ? item.score >= maxPerItem * 0.8 ? "bg-emerald-500" : item.score >= maxPerItem * 0.5 ? "bg-amber-500" : "bg-red-500"
                        : "bg-navy-800"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-display font-medium text-white">{item.name}</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${statusBadge(item.status)}`}>{item.status}</span>
                </div>
                <p className="text-xs text-navy-400 leading-relaxed">{item.detail}</p>
              </div>
              <span className="text-sm font-mono font-bold text-navy-300 shrink-0">{item.score}/{item.maxScore}</span>
            </div>
          ))}
        </div>
      </div>
    );
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
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">AI-Powered Audit</span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6">
              Local SEO Audit.{" "}
              <span className="text-accent-400">110 data points. AI-scored.</span>
            </h1>
            <p className="text-lg sm:text-xl text-navy-300 leading-relaxed max-w-2xl">
              Claude AI evaluates your business across 110 scoring items using two proprietary frameworks — LOCAL-IMPACT and SERP-TRUST — then delivers actionable recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={runAudit} noValidate className="bg-navy-900 border border-navy-800 rounded-2xl p-6 md:p-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2">
                <label className="block text-sm font-mono font-medium text-navy-300 mb-2">Business Name <span className="text-red-400">*</span></label>
                <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. Morrison Plumbing" className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-lg text-white placeholder:text-navy-500 font-body focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-mono font-medium text-navy-300 mb-2">Website URL <span className="text-navy-500">(optional)</span></label>
                <input type="text" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="e.g. morrisonplumbing.com" className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-lg text-white placeholder:text-navy-500 font-body focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-mono font-medium text-navy-300 mb-2">City <span className="text-red-400">*</span></label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Denver" className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-lg text-white placeholder:text-navy-500 font-body focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-mono font-medium text-navy-300 mb-2">State / Province <span className="text-red-400">*</span></label>
                <input type="text" value={stateProvince} onChange={(e) => setStateProvince(e.target.value)} placeholder="e.g. CO or Ontario" className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-lg text-white placeholder:text-navy-500 font-body focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent" />
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
                  <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5"><path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" strokeLinecap="round" strokeLinejoin="round" /></svg>Run AI Audit</>
                )}
              </button>
              {loading && (
                <span className="text-sm text-navy-400 font-mono">
                  {loadingPhase === "collecting"
                    ? "Collecting data from 7 sources..."
                    : "AI is analyzing your business across 110 data points..."}
                </span>
              )}
            </div>
          </form>
          {error && <div className="mt-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm font-mono">{error}</div>}
        </div>
      </section>

      {/* Results */}
      {report && (
        <section ref={resultsRef} className="pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Veto Banners */}
            {[...(report.localImpact?.vetosTriggered ?? []), ...(report.serpTrust?.vetosTriggered ?? [])].length > 0 && (
              <div className="mb-6 space-y-2">
                {[...(report.localImpact?.vetosTriggered ?? []), ...(report.serpTrust?.vetosTriggered ?? [])].map((v, i) => (
                  <div key={i} className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
                    <span className="text-red-400 text-lg shrink-0">&#9888;</span>
                    <span className="text-sm text-red-300 font-mono">CRITICAL: {v}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Summary Dashboard */}
            <div className="bg-navy-900 border border-navy-800 rounded-2xl p-8 md:p-10 mb-8">
              <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                <ScoreRing score={report.seoHealthIndex?.score ?? 0} />
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center gap-3 justify-center md:justify-start mb-1">
                    <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">{report.meta.businessName}</h2>
                    <span className={`text-sm font-mono font-bold px-2.5 py-1 rounded-lg ${gradeColor(report.seoHealthIndex?.grade ?? "F")}`}>
                      {report.seoHealthIndex?.grade ?? "N/A"}
                    </span>
                  </div>
                  <p className="text-navy-300 mb-1 font-mono text-sm">{report.meta.location} &middot; &ldquo;{report.meta.keyword}&rdquo;</p>
                  <p className="text-navy-500 text-xs font-mono mb-3">SEO Health Index &middot; Audited {new Date(report.meta.auditDate).toLocaleDateString()}</p>
                  <p className="text-sm text-navy-300 leading-relaxed max-w-2xl">{report.executiveSummary}</p>
                </div>
              </div>

              {/* Two Sub-Scores */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <button onClick={() => setActiveTab("local-impact")} className="p-4 rounded-xl border border-navy-800 bg-navy-950/40 hover:border-navy-700 transition-all text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-navy-400 uppercase tracking-wider">LOCAL-IMPACT</span>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${gradeColor(report.localImpact?.grade ?? "F")}`}>{report.localImpact?.grade ?? "N/A"}</span>
                  </div>
                  <div className="flex items-end gap-3">
                    <span className={`text-3xl font-display font-bold ${scoreColor(report.localImpact?.score ?? 0)}`}>{report.localImpact?.score ?? 0}</span>
                    <span className="text-sm text-navy-500 font-mono mb-1">/100</span>
                  </div>
                  <div className="w-full h-1.5 bg-navy-800 rounded-full mt-2 overflow-hidden">
                    <div className={`h-full rounded-full ${scoreBarColor(report.localImpact?.score ?? 0)}`} style={{ width: `${report.localImpact?.score ?? 0}%` }} />
                  </div>
                </button>
                <button onClick={() => setActiveTab("serp-trust")} className="p-4 rounded-xl border border-navy-800 bg-navy-950/40 hover:border-navy-700 transition-all text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-navy-400 uppercase tracking-wider">SERP-TRUST</span>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${gradeColor(report.serpTrust?.grade ?? "F")}`}>{report.serpTrust?.grade ?? "N/A"}</span>
                  </div>
                  <div className="flex items-end gap-3">
                    <span className={`text-3xl font-display font-bold ${scoreColor(report.serpTrust?.score ?? 0)}`}>{report.serpTrust?.score ?? 0}</span>
                    <span className="text-sm text-navy-500 font-mono mb-1">/100</span>
                  </div>
                  <div className="w-full h-1.5 bg-navy-800 rounded-full mt-2 overflow-hidden">
                    <div className={`h-full rounded-full ${scoreBarColor(report.serpTrust?.score ?? 0)}`} style={{ width: `${report.serpTrust?.score ?? 0}%` }} />
                  </div>
                </button>
              </div>

              {/* Dimension Summary Bars */}
              <div className="grid md:grid-cols-2 gap-x-6 gap-y-2">
                {report.localImpact?.dimensions && Object.entries(report.localImpact.dimensions).map(([key, dim]) => (
                  <button key={key} onClick={() => { setActiveTab("local-impact"); setActiveDimension(key); }} className="flex items-center gap-3 p-1.5 rounded hover:bg-navy-800/30 transition-colors">
                    <span className="text-[10px] font-mono text-navy-500 w-5">{LOCAL_IMPACT_DIMS[key]?.code ?? ""}</span>
                    <span className="text-xs text-navy-300 w-24 truncate">{LOCAL_IMPACT_DIMS[key]?.label ?? key}</span>
                    <div className="flex-1 h-1.5 bg-navy-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${scoreBarColor(dim.pct)}`} style={{ width: `${dim.pct}%` }} />
                    </div>
                    <span className="text-xs font-mono text-navy-400 w-8 text-right">{dim.pct}%</span>
                  </button>
                ))}
                {report.serpTrust?.dimensions && Object.entries(report.serpTrust.dimensions).map(([key, dim]) => (
                  <button key={key} onClick={() => { setActiveTab("serp-trust"); setActiveDimension(key); }} className="flex items-center gap-3 p-1.5 rounded hover:bg-navy-800/30 transition-colors">
                    <span className="text-[10px] font-mono text-navy-500 w-5">{SERP_TRUST_DIMS[key]?.code ?? ""}</span>
                    <span className="text-xs text-navy-300 w-24 truncate">{SERP_TRUST_DIMS[key]?.label ?? key}</span>
                    <div className="flex-1 h-1.5 bg-navy-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${scoreBarColor(dim.pct)}`} style={{ width: `${dim.pct}%` }} />
                    </div>
                    <span className="text-xs font-mono text-navy-400 w-8 text-right">{dim.pct}%</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 mb-8 bg-navy-900 border border-navy-800 rounded-xl p-1.5 overflow-x-auto">
              {tabs.map((tab) => (
                <button key={tab.key} onClick={() => { setActiveTab(tab.key); setActiveDimension(null); }} className={`px-4 py-2.5 text-sm font-display font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${activeTab === tab.key ? "bg-accent-600 text-white" : "text-navy-300 hover:text-white hover:bg-navy-800"}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ─── Overview Tab ─────────────────────────────────────── */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Executive Summary */}
                <div className="bg-navy-900 border border-navy-800 rounded-xl p-6">
                  <h3 className="font-display font-bold text-lg text-white mb-3">Executive Summary</h3>
                  <p className="text-sm text-navy-300 leading-relaxed">{report.executiveSummary}</p>
                  {report.seoHealthIndex?.formula && (
                    <p className="text-xs font-mono text-navy-500 mt-3">Formula: {report.seoHealthIndex.formula}</p>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-navy-900 border border-navy-800 rounded-xl p-5">
                    <p className="text-xs font-mono text-navy-400 uppercase mb-1">Geo-Grid SoLV</p>
                    <p className={`text-2xl font-display font-bold ${scoreColor(report.geoGrid?.solv ?? 0)}`}>{report.geoGrid?.solv ?? 0}%</p>
                  </div>
                  <div className="bg-navy-900 border border-navy-800 rounded-xl p-5">
                    <p className="text-xs font-mono text-navy-400 uppercase mb-1">Ranked Keywords</p>
                    <p className="text-2xl font-display font-bold text-white">{report.rawKeywordsTotal ?? 0}</p>
                  </div>
                  <div className="bg-navy-900 border border-navy-800 rounded-xl p-5">
                    <p className="text-xs font-mono text-navy-400 uppercase mb-1">Directories Found</p>
                    <p className="text-2xl font-display font-bold text-white">{report.rawDirectories?.filter(d => d.found === true).length ?? 0}/{report.rawDirectories?.filter(d => d.found !== null).length ?? 0}</p>
                  </div>
                  <div className="bg-navy-900 border border-navy-800 rounded-xl p-5">
                    <p className="text-xs font-mono text-navy-400 uppercase mb-1">Opportunities</p>
                    <p className="text-2xl font-display font-bold text-amber-400">{report.opportunities?.length ?? 0}</p>
                  </div>
                </div>

                {/* Technical Checklist (if available) */}
                {report.rawTechnical && (
                  <div className="bg-navy-900 border border-navy-800 rounded-xl p-6">
                    <h3 className="font-display font-bold text-lg text-white mb-4">Technical Checklist</h3>
                    <div className="grid md:grid-cols-2 gap-2">
                      {[
                        { label: "HTTPS", ok: report.rawTechnical.hasHttps },
                        { label: "robots.txt", ok: report.rawTechnical.hasRobotsTxt },
                        { label: "Sitemap", ok: report.rawTechnical.hasSitemap },
                        { label: "Schema Markup", ok: report.rawTechnical.hasSchema },
                        { label: "Meta Description", ok: report.rawTechnical.hasMetaDescription },
                        { label: "H1 Tag", ok: report.rawTechnical.hasH1 },
                        { label: "Viewport", ok: report.rawTechnical.hasViewport },
                        { label: "Canonical", ok: report.rawTechnical.hasCanonical },
                        { label: "NAP on Site", ok: report.rawTechnical.hasNapOnSite },
                        { label: "GA4 Installed", ok: report.rawTechnical.hasGa4 },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-navy-950/40">
                          {check(item.ok)}
                          <span className="text-sm text-navy-200 font-mono">{item.label}</span>
                        </div>
                      ))}
                    </div>
                    {report.rawTechnical.schemaTypes.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span className="text-xs font-mono text-navy-500">Schema:</span>
                        {report.rawTechnical.schemaTypes.map((t, i) => (
                          <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ─── LOCAL-IMPACT Tab ────────────────────────────────── */}
            {activeTab === "local-impact" && report.localImpact && (
              <div className="space-y-6">
                <div className="bg-navy-900 border border-navy-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-display font-bold text-lg text-white">LOCAL-IMPACT Framework</h3>
                      <p className="text-xs font-mono text-navy-400 mt-0.5">60 items across 8 dimensions &middot; L-O-C-A-L-I-P-T</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-3xl font-display font-bold ${scoreColor(report.localImpact.score)}`}>{report.localImpact.score}</span>
                      <span className={`ml-2 text-sm font-mono font-bold px-2 py-0.5 rounded ${gradeColor(report.localImpact.grade)}`}>{report.localImpact.grade}</span>
                    </div>
                  </div>
                  {/* Dimension selector */}
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(report.localImpact.dimensions).map(([key, dim]) => (
                      <button
                        key={key}
                        onClick={() => setActiveDimension(activeDimension === key ? null : key)}
                        className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all ${activeDimension === key ? "bg-accent-600/20 border-accent-500/40 text-accent-400" : "border-navy-700 text-navy-300 hover:border-navy-600"}`}
                      >
                        <span className="font-bold">{LOCAL_IMPACT_DIMS[key]?.code ?? ""}</span> {LOCAL_IMPACT_DIMS[key]?.label ?? key} <span className="text-navy-500">{dim.pct}%</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Show selected dimension or all */}
                {activeDimension && report.localImpact.dimensions[activeDimension]
                  ? renderDimension(report.localImpact.dimensions[activeDimension], activeDimension, 3)
                  : Object.entries(report.localImpact.dimensions).map(([key, dim]) => (
                    <div key={key}>{renderDimension(dim, key, 3)}</div>
                  ))
                }

                {report.localImpact.vetosTriggered.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
                    <h4 className="font-display font-bold text-red-400 mb-2">Veto Checks Triggered</h4>
                    <ul className="space-y-1">
                      {report.localImpact.vetosTriggered.map((v, i) => (
                        <li key={i} className="text-sm text-red-300 font-mono flex items-center gap-2">
                          <span>&#9888;</span> {v}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* ─── SERP-TRUST Tab ─────────────────────────────────── */}
            {activeTab === "serp-trust" && report.serpTrust && (
              <div className="space-y-6">
                <div className="bg-navy-900 border border-navy-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-display font-bold text-lg text-white">SERP-TRUST Framework</h3>
                      <p className="text-xs font-mono text-navy-400 mt-0.5">50 items across 5 dimensions &middot; T-R-U-S-T</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-3xl font-display font-bold ${scoreColor(report.serpTrust.score)}`}>{report.serpTrust.score}</span>
                      <span className={`ml-2 text-sm font-mono font-bold px-2 py-0.5 rounded ${gradeColor(report.serpTrust.grade)}`}>{report.serpTrust.grade}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(report.serpTrust.dimensions).map(([key, dim]) => (
                      <button
                        key={key}
                        onClick={() => setActiveDimension(activeDimension === key ? null : key)}
                        className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all ${activeDimension === key ? "bg-accent-600/20 border-accent-500/40 text-accent-400" : "border-navy-700 text-navy-300 hover:border-navy-600"}`}
                      >
                        <span className="font-bold">{SERP_TRUST_DIMS[key]?.code ?? ""}</span> {SERP_TRUST_DIMS[key]?.label ?? key} <span className="text-navy-500">{dim.pct}%</span>
                      </button>
                    ))}
                  </div>
                </div>

                {activeDimension && report.serpTrust.dimensions[activeDimension]
                  ? renderDimension(report.serpTrust.dimensions[activeDimension], activeDimension, 4)
                  : Object.entries(report.serpTrust.dimensions).map(([key, dim]) => (
                    <div key={key}>{renderDimension(dim, key, 4)}</div>
                  ))
                }

                {report.serpTrust.vetosTriggered.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
                    <h4 className="font-display font-bold text-red-400 mb-2">Veto Checks Triggered</h4>
                    <ul className="space-y-1">
                      {report.serpTrust.vetosTriggered.map((v, i) => (
                        <li key={i} className="text-sm text-red-300 font-mono flex items-center gap-2">
                          <span>&#9888;</span> {v}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* ─── Geo-Grid Tab ───────────────────────────────────── */}
            {activeTab === "geo-grid" && (
              <div className="space-y-6">
                {report.rawGeoGrid ? (
                  <div className="bg-navy-900 border border-navy-800 rounded-xl p-6">
                    <h3 className="font-display font-bold text-lg text-white mb-1">Local Pack Geo-Grid</h3>
                    <p className="text-sm text-navy-400 mb-4">Each square represents a geographic point near your business. Green = top 3 in Google Maps. Amber = positions 4-10. Red = not visible.</p>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="grid grid-cols-3 gap-2.5">
                        {report.rawGeoGrid.gridResults.map((r, i) => {
                          const bg = !r.found ? "bg-red-500/20 border-red-500/30" : r.rank <= 3 ? "bg-emerald-500/20 border-emerald-500/30" : "bg-amber-500/20 border-amber-500/30";
                          const txt = !r.found ? "text-red-400" : r.rank <= 3 ? "text-emerald-400" : "text-amber-400";
                          return (
                            <div key={i} className={`w-16 h-16 rounded-lg border flex flex-col items-center justify-center ${bg}`} title={r.found ? `Rank #${r.rank}` : `Not found — ${r.topCompetitor || "N/A"}`}>
                              <span className={`font-mono font-bold text-lg ${txt}`}>{r.found ? `#${r.rank}` : "\u2014"}</span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <p className="text-xs font-mono text-navy-400 uppercase tracking-wider">Share of Local Voice</p>
                          <p className={`text-3xl font-display font-bold ${scoreColor(Math.round(report.rawGeoGrid.solv * 100))}`}>{Math.round(report.rawGeoGrid.solv * 100)}%</p>
                        </div>
                        {report.rawGeoGrid.avgRank > 0 && (
                          <div>
                            <p className="text-xs font-mono text-navy-400 uppercase tracking-wider">Average Rank</p>
                            <p className="text-xl font-display font-bold text-white">#{report.rawGeoGrid.avgRank.toFixed(1)}</p>
                          </div>
                        )}
                        {report.rawGeoGrid.topCompetitors.length > 0 && (
                          <div>
                            <p className="text-xs font-mono text-navy-400 uppercase tracking-wider mb-1">Top Competitors</p>
                            <div className="space-y-1">
                              {report.rawGeoGrid.topCompetitors.slice(0, 5).map((c, i) => (
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

                {/* AI Summary */}
                {report.geoGrid?.summary && (
                  <div className="bg-navy-900 border border-navy-800 rounded-xl p-6">
                    <h3 className="font-display font-bold text-white mb-2">AI Analysis</h3>
                    <p className="text-sm text-navy-300 leading-relaxed">{report.geoGrid.summary}</p>
                  </div>
                )}

                {/* Directory Table */}
                {report.rawDirectories && report.rawDirectories.length > 0 && (
                  <div className="bg-navy-900 border border-navy-800 rounded-xl overflow-hidden">
                    <div className="p-5 border-b border-navy-800">
                      <h3 className="font-display font-bold text-lg text-white">Directory Presence</h3>
                    </div>
                    <table className="w-full">
                      <thead><tr className="text-left text-xs font-mono uppercase tracking-wider text-navy-400 border-b border-navy-800">
                        <th className="px-5 py-3">Directory</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">NAP Correct</th>
                      </tr></thead>
                      <tbody className="divide-y divide-navy-800">
                        {report.rawDirectories.map((d, i) => (
                          <tr key={i} className="hover:bg-navy-800/30">
                            <td className="px-5 py-3 text-sm font-display font-medium text-white">{d.name}</td>
                            <td className="px-5 py-3 text-sm font-mono">
                              {d.found === true ? <span className="text-emerald-400">&#10003; Found</span> : d.found === false ? <span className="text-red-400">&#10007; Not Found</span> : <span className="text-navy-500">&#9888; Unknown</span>}
                            </td>
                            <td className="px-5 py-3 text-sm font-mono">{d.found === true ? (d.napCorrect ? <span className="text-emerald-400">&#10003;</span> : <span className="text-red-400">&#10007;</span>) : <span className="text-navy-600">&mdash;</span>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ─── Opportunities Tab ──────────────────────────────── */}
            {activeTab === "opportunities" && (
              <div className="space-y-4">
                {report.opportunities && report.opportunities.length > 0 ? (
                  <>
                    {report.opportunities.map((opp, i) => (
                      <div key={i} className="bg-navy-900 border border-navy-800 rounded-xl p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${priorityColor(opp.priority)}`}>{opp.priority}</span>
                            <h3 className="font-display font-semibold text-white">{opp.title}</h3>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-navy-800 text-navy-400">{opp.category}</span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3 mb-3">
                          <div className="bg-navy-950/40 rounded-lg p-3">
                            <p className="text-[10px] font-mono text-navy-500 uppercase mb-1">Current State</p>
                            <p className="text-sm text-red-300">{opp.currentState}</p>
                          </div>
                          <div className="bg-navy-950/40 rounded-lg p-3">
                            <p className="text-[10px] font-mono text-navy-500 uppercase mb-1">Target State</p>
                            <p className="text-sm text-emerald-300">{opp.targetState}</p>
                          </div>
                        </div>
                        <div className="flex gap-4 mb-3 text-xs font-mono text-navy-400">
                          <span>Impact: <span className="text-white">{opp.impact}</span></span>
                          <span>Effort: <span className="text-white">{opp.effort}</span></span>
                        </div>
                        {opp.steps && opp.steps.length > 0 && (
                          <div className="bg-navy-950/40 rounded-lg p-3">
                            <p className="text-[10px] font-mono text-navy-500 uppercase mb-2">Steps</p>
                            <ol className="space-y-1">
                              {opp.steps.map((step, j) => (
                                <li key={j} className="text-xs text-navy-300 flex gap-2">
                                  <span className="text-accent-500 font-mono shrink-0">{j + 1}.</span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="bg-navy-900 border border-navy-800 rounded-xl p-10 text-center">
                    <p className="text-navy-400">No opportunities identified.</p>
                  </div>
                )}

                {/* CTA */}
                <div className="bg-navy-900 border border-accent-500/20 rounded-2xl p-8 text-center mt-6">
                  <h3 className="font-display font-bold text-2xl text-white mb-3">Want us to implement these fixes?</h3>
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

            {/* ─── Competitors Tab ────────────────────────────────── */}
            {activeTab === "competitors" && (
              <div className="space-y-6">
                {report.competitorAnalysis?.summary && (
                  <div className="bg-navy-900 border border-navy-800 rounded-xl p-6">
                    <h3 className="font-display font-bold text-lg text-white mb-3">Competitor Analysis</h3>
                    <p className="text-sm text-navy-300 leading-relaxed">{report.competitorAnalysis.summary}</p>
                  </div>
                )}
                {report.competitorAnalysis?.competitors && report.competitorAnalysis.competitors.length > 0 && (
                  <div className="space-y-4">
                    {report.competitorAnalysis.competitors.map((comp, i) => (
                      <div key={i} className="bg-navy-900 border border-navy-800 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-display font-semibold text-white">{comp.name}</h4>
                          <div className="flex gap-3 text-xs font-mono text-navy-400">
                            <span>{comp.rating} &#9733;</span>
                            <span>{comp.reviews} reviews</span>
                            <span>{comp.photos} photos</span>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div>
                            <p className="text-[10px] font-mono text-navy-500 uppercase mb-1">Their Strengths</p>
                            <div className="flex flex-wrap gap-1">
                              {comp.strengths.map((s, j) => (
                                <span key={j} className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400">{s}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] font-mono text-navy-500 uppercase mb-1">Your Advantage</p>
                            <div className="flex flex-wrap gap-1">
                              {comp.yourAdvantage.map((a, j) => (
                                <span key={j} className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">{a}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ─── Keywords Tab ───────────────────────────────────── */}
            {activeTab === "keywords" && (
              <div className="space-y-6">
                {report.keywordInsights?.summary && (
                  <div className="bg-navy-900 border border-navy-800 rounded-xl p-6">
                    <h3 className="font-display font-bold text-lg text-white mb-3">Keyword Insights</h3>
                    <p className="text-sm text-navy-300 leading-relaxed">{report.keywordInsights.summary}</p>
                  </div>
                )}

                {/* Ranking Keywords from raw data */}
                {report.rawKeywords && report.rawKeywords.length > 0 && (
                  <div className="bg-navy-900 border border-navy-800 rounded-xl overflow-hidden">
                    <div className="p-5 border-b border-navy-800">
                      <h3 className="font-display font-bold text-lg text-white">Organic Rankings</h3>
                      <div className="grid grid-cols-3 gap-4 mt-3">
                        <div>
                          <p className="text-[10px] font-mono text-navy-500 uppercase">Total Keywords</p>
                          <p className="text-lg font-display font-bold text-white">{report.rawKeywordsTotal}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-mono text-navy-500 uppercase">Top 10</p>
                          <p className="text-lg font-display font-bold text-emerald-400">{report.rawKeywords.filter(k => k.position <= 10).length}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-mono text-navy-500 uppercase">Est. Traffic</p>
                          <p className="text-lg font-display font-bold text-white">{Math.round(report.rawETV).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead><tr className="text-left text-xs font-mono uppercase tracking-wider text-navy-400 border-b border-navy-800">
                          <th className="px-5 py-3">Keyword</th><th className="px-5 py-3">Pos</th><th className="px-5 py-3">Volume</th><th className="px-5 py-3">URL</th>
                        </tr></thead>
                        <tbody className="divide-y divide-navy-800">
                          {report.rawKeywords.slice(0, 20).map((kw, i) => (
                            <tr key={i} className="hover:bg-navy-800/30">
                              <td className="px-5 py-3 text-sm font-display font-medium text-white">{kw.keyword}</td>
                              <td className="px-5 py-3"><span className={`inline-flex items-center justify-center w-8 h-6 rounded text-xs font-mono font-bold ${kw.position <= 3 ? "bg-emerald-500/20 text-emerald-400" : kw.position <= 10 ? "bg-emerald-500/10 text-emerald-300" : kw.position <= 20 ? "bg-amber-500/10 text-amber-400" : "bg-navy-800 text-navy-300"}`}>{kw.position}</span></td>
                              <td className="px-5 py-3 text-sm text-navy-300 font-mono">{kw.searchVolume > 0 ? kw.searchVolume.toLocaleString() : "\u2014"}</td>
                              <td className="px-5 py-3 text-sm text-navy-500 font-mono max-w-[200px] truncate">{kw.url || "\u2014"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Suggested Keywords from Claude */}
                {report.keywordInsights?.suggestedKeywords && report.keywordInsights.suggestedKeywords.length > 0 && (
                  <div className="bg-navy-900 border border-accent-500/20 rounded-xl overflow-hidden">
                    <div className="p-5 border-b border-navy-800">
                      <h3 className="font-display font-bold text-lg text-white">Suggested Keywords</h3>
                      <p className="text-xs text-navy-400 mt-0.5 font-mono">AI-recommended keywords based on your GBP categories and competitors</p>
                    </div>
                    <div className="divide-y divide-navy-800/50">
                      {report.keywordInsights.suggestedKeywords.map((kw, i) => (
                        <div key={i} className="px-5 py-3 flex items-start gap-3">
                          <span className="text-sm font-display font-medium text-accent-400 shrink-0">{kw.keyword}</span>
                          <span className="text-xs text-navy-400 flex-1">{kw.rationale}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${kw.competition === "low" ? "bg-emerald-500/10 text-emerald-400" : kw.competition === "medium" ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}`}>{kw.competition}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                { title: "110 Data Points", desc: "Two proprietary scoring frameworks — LOCAL-IMPACT (60 items) and SERP-TRUST (50 items) — cover every aspect of local SEO." },
                { title: "AI-Powered Analysis", desc: "Claude AI evaluates your business across all 110 items, scoring each one based on real data from Google Maps, your website, and directories." },
                { title: "Actionable Roadmap", desc: "Prioritized opportunities with specific steps, effort estimates, and expected impact — not just a score, but a plan." },
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
