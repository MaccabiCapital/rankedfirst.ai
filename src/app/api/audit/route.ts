import { NextRequest, NextResponse } from "next/server";

// ─── Types ───────────────────────────────────────────────────────────
interface AuditRequest {
  business_name: string;
  location: string;
  keyword?: string;
  website_url?: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

// ─── DataForSEO Client ──────────────────────────────────────────────
const DFS_BASE = "https://api.dataforseo.com/v3";

function getDFSAuth(): string {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;
  if (!login || !password) throw new Error("DataForSEO credentials not configured");
  return "Basic " + Buffer.from(`${login}:${password}`).toString("base64");
}

async function callDFS(path: string, body: unknown[]): Promise<any> {
  const res = await fetch(`${DFS_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: getDFSAuth(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
  });
  const json = await res.json();
  if (json.status_code !== 20000) {
    console.error(`[DFS] ${path} error:`, json.status_message);
    return null;
  }
  return json;
}

async function safeDFS(path: string, body: unknown[]): Promise<any> {
  try {
    return await callDFS(path, body);
  } catch (e) {
    console.error(`[DFS] ${path} exception:`, e);
    return null;
  }
}

// Helper to extract first result item from DFS response
function dfsItems(response: any): any[] {
  if (!response?.tasks?.[0]?.result?.[0]?.items) return [];
  return response.tasks[0].result[0].items;
}

function dfsFirstItem(response: any): any {
  const items = dfsItems(response);
  return items.length > 0 ? items[0] : null;
}

function dfsResult(response: any): any {
  return response?.tasks?.[0]?.result?.[0] ?? null;
}

// ─── LocalSEOData Client (fallback) ─────────────────────────────────
const LSEO_BASE = "https://api.localseodata.com";

async function callLSEO(path: string, body: Record<string, unknown>): Promise<any> {
  const key = process.env.LOCALSEODATA_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(`${LSEO_BASE}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(20000),
    });
    const json = await res.json();
    if (json.status === "error") {
      console.error(`[LSEO] ${path} error:`, json.error);
      return null;
    }
    return json;
  } catch (e) {
    console.error(`[LSEO] ${path} exception:`, e);
    return null;
  }
}

function extractLSEOData(response: any): any {
  if (!response) return null;
  return response.data ?? response.audit ?? response.profile ?? response;
}

// ─── Location Helper ─────────────────────────────────────────────────
// DataForSEO needs location_name in format "City,State,Country"
// We'll try to use the user's location string directly
function formatDFSLocation(location: string): string {
  // If already contains comma-separated parts, use as-is
  if (location.includes(",")) return location;
  // Otherwise append country context
  return location;
}

// ─── Scoring Logic ───────────────────────────────────────────────────
interface DimensionScore {
  label: string;
  score: number;
  weight: number;
  detail: string;
  weighted: number;
  icon: string;
}

function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function buildScorecard(
  gbpInfo: any,          // DataForSEO My Business Info
  onpageData: any,       // DataForSEO Instant Pages
  mapsData: any,         // DataForSEO Maps SERP
  localAuditRaw: any,    // LocalSEOData local-audit (fallback)
  citationsRaw: any,     // LocalSEOData citations
  reviewsRaw: any,       // LocalSEOData reviews
  aiVisRaw: any,         // LocalSEOData AI visibility
  competitorGapRaw: any, // LocalSEOData competitor-gap
  businessName: string
) {
  const local = extractLSEOData(localAuditRaw);
  const citations = extractLSEOData(citationsRaw);
  const reviews = extractLSEOData(reviewsRaw);
  const aiVis = extractLSEOData(aiVisRaw);
  const gap = extractLSEOData(competitorGapRaw);

  const dimensions: DimensionScore[] = [];

  // ─── 1. Local Pack Ranking (from DataForSEO Maps SERP) ──────────
  const mapsItems = dfsItems(mapsData) ?? [];
  let packPos: number | null = null;
  const normalizedBiz = businessName.toLowerCase().trim();

  for (const item of mapsItems) {
    const title = (item.title ?? "").toLowerCase().trim();
    if (
      title.includes(normalizedBiz) ||
      normalizedBiz.includes(title) ||
      levenshteinSimilarity(title, normalizedBiz) > 0.6
    ) {
      packPos = item.rank_group ?? item.rank_absolute ?? null;
      break;
    }
  }

  // Fallback to LocalSEOData
  if (!packPos) {
    packPos = local?.local_pack_position ?? null;
  }

  let rankScore = 0;
  let rankDetail = "Not found in local pack";
  if (packPos && packPos > 0) {
    rankScore = clampScore(Math.max(100 - (packPos - 1) * 15, 10));
    rankDetail = `Position #${packPos} in local pack`;
  }
  dimensions.push({
    label: "Local Pack Ranking",
    score: rankScore,
    weight: 0.15,
    detail: rankDetail,
    weighted: Math.round(rankScore * 0.15),
    icon: "ranking",
  });

  // ─── 2. GBP Profile Completeness (from DataForSEO My Business Info) ─
  let profileScore = 0;
  let profileDetail = "Could not retrieve profile";
  let rating = 0;
  let reviewsCount = 0;

  if (gbpInfo) {
    const item = dfsFirstItem(gbpInfo);
    if (item) {
      rating = item.rating?.value ?? 0;
      reviewsCount = item.rating?.votes_count ?? 0;

      // Calculate completeness from available fields
      const fields = [
        item.title,
        item.description,
        item.address,
        item.phone,
        item.url,
        item.category,
        item.work_time?.work_hours?.timetable,
        item.total_photos && item.total_photos > 0,
        item.attributes?.available_attributes,
        item.is_claimed,
      ];
      const filled = fields.filter(Boolean).length;
      profileScore = clampScore(Math.round((filled / fields.length) * 100));
      profileDetail = `${profileScore}% complete`;
      if (rating) {
        profileDetail += `, ${rating} stars, ${reviewsCount} reviews`;
      }
      if (item.is_claimed === false) {
        profileDetail += " (unclaimed)";
        profileScore = Math.max(profileScore - 15, 0);
      }
    }
  }

  // Fallback to LocalSEOData
  if (profileScore === 0 && local) {
    const profComplete = local.profile_completeness ?? 0;
    rating = local.rating?.value ?? rating;
    reviewsCount = local.reviews_count ?? local.rating?.votes_count ?? reviewsCount;
    profileScore = profComplete;
    if (profComplete) {
      profileDetail = `${profComplete}% complete`;
      if (rating) profileDetail += `, ${rating} stars, ${reviewsCount} reviews`;
    }
  }

  dimensions.push({
    label: "GBP Profile",
    score: clampScore(profileScore),
    weight: 0.15,
    detail: profileDetail,
    weighted: Math.round(clampScore(profileScore) * 0.15),
    icon: "profile",
  });

  // ─── 3. Reviews & Reputation (DataForSEO GBP rating + LocalSEOData velocity) ─
  const revVelocity = local?.review_velocity ?? reviews?.reviews_per_month ?? 0;
  const replyRate = reviews?.reply_rate ?? 0;
  const currentRating = rating || reviews?.current_rating || 0;

  let revScore = 0;
  if (currentRating > 0) {
    revScore += (currentRating / 5) * 40;
  }
  revScore += replyRate * 30;
  revScore += Math.min(revVelocity / 20, 1) * 30;
  revScore = clampScore(revScore);

  let revDetail = "";
  if (currentRating > 0 || revVelocity > 0) {
    const parts: string[] = [];
    if (currentRating > 0) parts.push(`${currentRating} stars`);
    if (reviewsCount > 0) parts.push(`${reviewsCount} reviews`);
    if (revVelocity > 0) parts.push(`${revVelocity.toFixed(1)}/mo velocity`);
    if (replyRate > 0) parts.push(`${Math.round(replyRate * 100)}% reply rate`);
    revDetail = parts.join(", ");
  } else {
    revDetail = "No review data available";
  }

  dimensions.push({
    label: "Reviews & Reputation",
    score: revScore,
    weight: 0.15,
    detail: revDetail,
    weighted: Math.round(revScore * 0.15),
    icon: "reviews",
  });

  // ─── 4. Citation Consistency (LocalSEOData) ────────────────────────
  const citScore = citations?.citation_score ?? citationsRaw?.citation_score ?? 0;
  const citTotal = citations?.total_directories ?? citationsRaw?.total_directories ?? 0;
  const citConsistent = citations?.consistent ?? citationsRaw?.consistent ?? 0;
  dimensions.push({
    label: "Citation Consistency",
    score: clampScore(citScore),
    weight: 0.12,
    detail: citScore
      ? `${citScore}/100 — ${citConsistent}/${citTotal} directories consistent`
      : "Citation audit unavailable",
    weighted: Math.round(clampScore(citScore) * 0.12),
    icon: "citations",
  });

  // ─── 5. On-Page SEO (DataForSEO Instant Pages) ────────────────────
  let onpageScore = 0;
  let onpageDetail = "No website URL provided";

  if (onpageData) {
    const item = dfsFirstItem(onpageData);
    if (item) {
      onpageScore = item.onpage_score ?? 0;
      const lcp = item.page_timing?.largest_contentful_paint;
      const cls = item.meta?.cumulative_layout_shift;
      const fid = item.page_timing?.first_input_delay;
      const checks = item.checks ?? {};

      const issueList: string[] = [];
      if (checks.no_h1_tag) issueList.push("missing H1");
      if (checks.no_description) issueList.push("no meta description");
      if (checks.no_title) issueList.push("no title tag");
      if (checks.high_loading_time) issueList.push("slow load time");
      if (checks.is_http) issueList.push("not HTTPS");
      if (checks.no_favicon) issueList.push("no favicon");
      if (checks.low_content_rate) issueList.push("thin content");
      if (checks.title_too_long) issueList.push("title too long");
      if (checks.no_image_alt) issueList.push("missing image alt");

      onpageDetail = `Score ${Math.round(onpageScore)}/100`;
      if (lcp !== undefined) onpageDetail += `, LCP ${(lcp / 1000).toFixed(1)}s`;
      if (cls !== undefined) onpageDetail += `, CLS ${cls.toFixed(3)}`;
      if (fid !== undefined && fid > 0) onpageDetail += `, FID ${fid}ms`;
      if (issueList.length > 0) {
        onpageDetail += ` — Issues: ${issueList.join(", ")}`;
      }
    }
  }

  // Fallback to LocalSEOData page-audit
  if (onpageScore === 0 && local) {
    const lseoPageScore = extractLSEOData(localAuditRaw)?.onpage_score;
    if (lseoPageScore) {
      onpageScore = lseoPageScore;
      onpageDetail = `Score ${lseoPageScore}/100 (via LocalSEO)`;
    }
  }

  dimensions.push({
    label: "On-Page SEO",
    score: clampScore(onpageScore),
    weight: 0.12,
    detail: onpageDetail,
    weighted: Math.round(clampScore(onpageScore) * 0.12),
    icon: "onpage",
  });

  // ─── 6. AI Visibility (LocalSEOData) ──────────────────────────────
  const aiMentions = aiVis?.total_mentions ?? 0;
  const aiImpressions = aiVis?.total_impressions ?? 0;
  const aiScore = clampScore(Math.min(aiMentions * 10, 100));
  dimensions.push({
    label: "AI Visibility",
    score: aiScore,
    weight: 0.12,
    detail: aiMentions
      ? `${aiMentions} AI mentions, ~${aiImpressions} impressions`
      : "AI visibility check unavailable",
    weighted: Math.round(aiScore * 0.12),
    icon: "ai",
  });

  // ─── 7. Competitive Position (DataForSEO Maps + LocalSEOData) ─────
  // Use maps results as competitors (other businesses in local pack)
  const mapsCompetitors = mapsItems.filter((item: any) => {
    const title = (item.title ?? "").toLowerCase().trim();
    return !(
      title.includes(normalizedBiz) ||
      normalizedBiz.includes(title) ||
      levenshteinSimilarity(title, normalizedBiz) > 0.6
    );
  });

  const lseoCompetitors = local?.competitors ?? gap?.competitors ?? [];
  const allCompetitors = mapsCompetitors.length > 0 ? mapsCompetitors : lseoCompetitors;

  let compScore = 50;
  let compDetail = "Competitor data unavailable";

  if (allCompetitors.length > 0) {
    const avgCompReviews =
      allCompetitors.reduce(
        (s: number, c: any) =>
          s + ((c.rating?.votes_count ?? c.reviews_count ?? c.reviews ?? 0) as number),
        0
      ) / allCompetitors.length;
    const avgCompRating =
      allCompetitors.reduce(
        (s: number, c: any) =>
          s + ((c.rating?.value ?? c.rating ?? 0) as number),
        0
      ) / allCompetitors.length;

    const bizReviews = reviewsCount || gap?.business?.reviews || 0;

    if (avgCompReviews > 0 && bizReviews > 0) {
      compScore = clampScore(
        Math.round(
          (bizReviews / avgCompReviews) * 60 +
            (currentRating / (avgCompRating || 5)) * 40
        )
      );
    }
    compDetail = `${reviewsCount} reviews vs avg ${Math.round(avgCompReviews)} (${allCompetitors.length} competitors)`;
  } else if (local?.recommendations?.length) {
    compScore = clampScore(100 - local.recommendations.length * 15);
    compDetail = `${local.recommendations.length} improvement areas identified`;
  }

  dimensions.push({
    label: "Competitive Position",
    score: compScore,
    weight: 0.12,
    detail: compDetail,
    weighted: Math.round(compScore * 0.12),
    icon: "competitive",
  });

  // ─── 8. Overall Health ─────────────────────────────────────────────
  const healthScore = local?.health_score ?? 0;
  let finalHealthScore = healthScore;
  let healthDetail = "Health score unavailable";

  if (!healthScore) {
    const nonHealthDims = dimensions.filter((d) => d.icon !== "health");
    const nonZero = nonHealthDims.filter((d) => d.score > 0);
    if (nonZero.length > 0) {
      finalHealthScore = clampScore(
        Math.round(nonZero.reduce((s, d) => s + d.score, 0) / nonZero.length)
      );
      healthDetail = `Computed from ${nonZero.length} available dimensions`;
    }
  } else {
    healthDetail = `Local SEO health: ${healthScore}/100`;
  }

  dimensions.push({
    label: "Overall Health",
    score: finalHealthScore,
    weight: 0.07,
    detail: healthDetail,
    weighted: Math.round(finalHealthScore * 0.07),
    icon: "health",
  });

  const totalScore = dimensions.reduce((s, d) => s + d.weighted, 0);

  return { totalScore, dimensions };
}

// ─── Gap Analysis & Action Plan ──────────────────────────────────────
function buildGapAnalysis(
  gbpInfo: any,
  onpageData: any,
  mapsData: any,
  localAuditRaw: any,
  citationsRaw: any,
  reviewsRaw: any,
  aiVisRaw: any,
  competitorGapRaw: any,
  businessName: string
) {
  const local = extractLSEOData(localAuditRaw);
  const citations = extractLSEOData(citationsRaw);
  const reviews = extractLSEOData(reviewsRaw);
  const aiVis = extractLSEOData(aiVisRaw);
  const gap = extractLSEOData(competitorGapRaw);
  const onpageItem = dfsFirstItem(onpageData);
  const gbpItem = dfsFirstItem(gbpInfo);

  const quickWins: Array<{ action: string; impact: string; effort: string }> = [];
  const strategic: Array<{ action: string; impact: string; timeline: string }> = [];

  // GBP Profile quick wins from DataForSEO
  if (gbpItem) {
    if (!gbpItem.description) {
      quickWins.push({
        action: "Add a business description to your Google Business Profile",
        impact: "High — GBP completeness is a top-3 ranking factor",
        effort: "30 minutes",
      });
    }
    if (!gbpItem.total_photos || gbpItem.total_photos < 10) {
      quickWins.push({
        action: `Add more photos to GBP (currently ${gbpItem.total_photos ?? 0}) — aim for 20+`,
        impact: "High — businesses with 100+ photos get 520% more calls",
        effort: "1–2 hours",
      });
    }
    if (gbpItem.is_claimed === false) {
      quickWins.push({
        action: "Claim and verify your Google Business Profile",
        impact: "Critical — unclaimed profiles cannot be optimized",
        effort: "1 hour + verification time",
      });
    }
    if (!gbpItem.work_time?.work_hours?.timetable) {
      quickWins.push({
        action: "Add business hours to your Google Business Profile",
        impact: "High — Google penalizes profiles with missing hours",
        effort: "15 minutes",
      });
    }
    if (!gbpItem.attributes?.available_attributes || Object.keys(gbpItem.attributes.available_attributes).length < 3) {
      quickWins.push({
        action: "Add service attributes to your GBP (WiFi, accessibility, payment methods, etc.)",
        impact: "Medium — helps match specific user searches",
        effort: "30 minutes",
      });
    }
  }

  // On-page SEO issues from DataForSEO
  if (onpageItem) {
    const checks = onpageItem.checks ?? {};
    if (checks.no_h1_tag) {
      quickWins.push({
        action: "Add an H1 tag to your homepage",
        impact: "High — H1 is a primary on-page ranking signal",
        effort: "15 minutes",
      });
    }
    if (checks.no_description) {
      quickWins.push({
        action: "Add a meta description to your homepage",
        impact: "Medium — improves click-through rate from SERPs",
        effort: "15 minutes",
      });
    }
    if (checks.is_http) {
      quickWins.push({
        action: "Migrate your website to HTTPS",
        impact: "Critical — HTTP sites are penalized in rankings",
        effort: "2–4 hours",
      });
    }
    if (checks.high_loading_time) {
      strategic.push({
        action: "Improve page load speed — optimize images, enable caching, minimize JS",
        impact: "High — page speed is a Core Web Vital ranking factor",
        timeline: "1–2 weeks",
      });
    }
    if (checks.low_content_rate) {
      strategic.push({
        action: "Add more text content to your homepage — aim for 500+ words",
        impact: "Medium — thin content pages rank poorly",
        timeline: "1 week",
      });
    }
    if (checks.no_image_alt) {
      quickWins.push({
        action: "Add alt text to all images on your website",
        impact: "Medium — improves accessibility and image search rankings",
        effort: "1 hour",
      });
    }

    // Schema markup check
    const schemas = onpageItem.meta?.social_media_tags ?? {};
    const hasLocalBusiness = Object.values(schemas).some(
      (v: any) => typeof v === "string" && v.includes("LocalBusiness")
    );
    if (!hasLocalBusiness) {
      quickWins.push({
        action: "Add LocalBusiness schema markup to your website",
        impact: "Medium — helps Google understand your business entity",
        effort: "1 hour",
      });
    }
  }

  // LocalSEOData recommendations
  const recs = local?.recommendations ?? [];
  for (const rec of recs) {
    const recLower = (rec as string).toLowerCase();
    if (recLower.includes("review") || recLower.includes("photo") || recLower.includes("post")) {
      quickWins.push({
        action: rec,
        impact: "High — directly affects local ranking signals",
        effort: "Ongoing, 30 min/week",
      });
    } else if (recLower.includes("profile") || recLower.includes("gbp") || recLower.includes("optimize")) {
      quickWins.push({
        action: rec,
        impact: "High — GBP completeness is a top-3 ranking factor",
        effort: "1–2 hours",
      });
    } else {
      strategic.push({
        action: rec,
        impact: "Medium — builds long-term visibility",
        timeline: "1–3 months",
      });
    }
  }

  // Local pack ranking issues
  const mapsItems = dfsItems(mapsData) ?? [];
  const normalizedBiz = businessName.toLowerCase().trim();
  const inPack = mapsItems.some((item: any) => {
    const title = (item.title ?? "").toLowerCase().trim();
    return (
      title.includes(normalizedBiz) ||
      normalizedBiz.includes(title) ||
      levenshteinSimilarity(title, normalizedBiz) > 0.6
    );
  });

  if (!inPack && !local?.local_pack_position) {
    strategic.push({
      action: "Build local pack visibility through GBP optimization, reviews, and citation building",
      impact: "Critical — you are not appearing in the local 3-pack",
      timeline: "2–4 months",
    });
  }

  // Review velocity gap
  const revVelocity = local?.review_velocity ?? reviews?.reviews_per_month ?? 0;
  if (revVelocity < 5) {
    quickWins.push({
      action: `Increase review velocity from ${revVelocity.toFixed(1)}/mo — implement automated review request workflow`,
      impact: "High — review count is the #1 local ranking factor",
      effort: "Setup: 2 hours, then automated",
    });
  }

  // Citation issues
  const citIssues = citations?.issues ?? citationsRaw?.issues ?? [];
  if (citIssues.length > 0) {
    quickWins.push({
      action: `Fix ${citIssues.length} citation inconsistencies (${citIssues.slice(0, 3).map((i: any) => i.directory).join(", ")})`,
      impact: "High — NAP consistency directly affects local rankings",
      effort: "1–2 hours",
    });
  }

  // Review reply rate
  const replyRate = reviews?.reply_rate ?? 0;
  if (replyRate > 0 && replyRate < 0.8) {
    quickWins.push({
      action: `Increase review reply rate from ${Math.round(replyRate * 100)}% to 90%+`,
      impact: "High — reply rate correlates with higher ratings",
      effort: "30 min/day",
    });
  }

  // AI visibility
  const aiMentions = aiVis?.total_mentions ?? 0;
  if (aiMentions < 5) {
    strategic.push({
      action: "Build AI visibility through entity-optimized content and authoritative citations",
      impact: "High — AI search is growing 40% YoY, early movers gain advantage",
      timeline: "3–6 months",
    });
  }

  // Competitor gap items from LocalSEOData
  const gaps = gap?.gaps ?? [];
  for (const g of gaps) {
    const gLower = (g as string).toLowerCase();
    if (gLower.includes("review") || gLower.includes("photo")) {
      quickWins.push({ action: g, impact: "Medium", effort: "Ongoing" });
    } else {
      strategic.push({ action: g, impact: "Medium", timeline: "1–3 months" });
    }
  }

  // Competitor insights — merge DataForSEO maps + LocalSEOData
  const mapCompetitors = mapsItems
    .filter((item: any) => {
      const title = (item.title ?? "").toLowerCase().trim();
      return !(
        title.includes(normalizedBiz) ||
        normalizedBiz.includes(title) ||
        levenshteinSimilarity(title, normalizedBiz) > 0.6
      );
    })
    .slice(0, 5)
    .map((c: any) => ({
      name: c.title ?? "Unknown",
      rating: c.rating?.value ?? 0,
      reviews: c.rating?.votes_count ?? 0,
      advantages: [],
      rank: c.rank_group ?? 0,
    }));

  const lseoCompetitorInsights = (gap?.competitors ?? local?.competitors ?? [])
    .slice(0, 5)
    .map((c: any) => ({
      name: c.name ?? c.business_name ?? "Unknown",
      rating: c.rating ?? 0,
      reviews: c.reviews_count ?? c.reviews ?? 0,
      advantages: c.advantages ?? [],
      rank: c.local_pack_rank ?? c.position ?? 0,
    }));

  const competitorInsights = mapCompetitors.length > 0 ? mapCompetitors : lseoCompetitorInsights;

  return {
    quickWins: dedupeActions(quickWins).slice(0, 8),
    strategic: dedupeActions(strategic).slice(0, 6),
    competitorInsights,
    gaps,
  };
}

// ─── Utility ─────────────────────────────────────────────────────────
function levenshteinSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  const la = a.length;
  const lb = b.length;
  if (la === 0 || lb === 0) return 0;

  const matrix: number[][] = [];
  for (let i = 0; i <= la; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= lb; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= la; i++) {
    for (let j = 1; j <= lb; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return 1 - matrix[la][lb] / Math.max(la, lb);
}

function dedupeActions<T extends { action: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.action.toLowerCase().slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ─── Route Handler ───────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body: AuditRequest = await request.json();

    if (!body.business_name || !body.location) {
      return NextResponse.json(
        { error: "business_name and location are required" },
        { status: 400 }
      );
    }

    const { business_name, location, keyword, website_url } = body;
    const kw = keyword || business_name.split(/\s+/).pop() || "business";
    const dfsLocation = formatDFSLocation(location);

    console.log(`[audit] Starting audit for "${business_name}" in "${location}" (keyword: "${kw}")`);

    // ─── Phase 1: DataForSEO parallel calls (primary) ─────────────
    const dfsPromises: Promise<any>[] = [];

    // 1a. Google My Business Info (Live) — GBP profile data
    dfsPromises.push(
      safeDFS("/business_data/google/my_business_info/live", [
        {
          keyword: business_name,
          location_name: dfsLocation,
          language_code: "en",
        },
      ])
    );

    // 1b. On-Page Instant Pages — website technical audit
    if (website_url) {
      const url = website_url.startsWith("http") ? website_url : `https://${website_url}`;
      dfsPromises.push(
        safeDFS("/on_page/instant_pages", [
          {
            url,
            enable_browser_rendering: true,
          },
        ])
      );
    } else {
      dfsPromises.push(Promise.resolve(null));
    }

    // 1c. SERP Google Maps — local pack ranking + competitors
    dfsPromises.push(
      safeDFS("/serp/google/maps/live/advanced", [
        {
          keyword: `${kw} ${location.split(",")[0]?.trim()}`,
          location_name: dfsLocation,
          language_code: "en",
          depth: 10,
        },
      ])
    );

    const [gbpInfo, onpageData, mapsData] = await Promise.all(dfsPromises);

    console.log(
      `[audit] DataForSEO results — GBP: ${gbpInfo ? "✓" : "✗"}, OnPage: ${onpageData ? "✓" : "✗"}, Maps: ${mapsData ? "✓" : "✗"}`
    );

    // ─── Phase 2: LocalSEOData fallback calls (for unique data) ───
    // Only call if we have API key and want supplemental data
    let localAudit = null;
    let citations = null;
    let reviewsVelocity = null;
    let aiVis = null;
    let competitorGap = null;

    const hasLSEOKey = !!process.env.LOCALSEODATA_API_KEY;

    if (hasLSEOKey) {
      // Call local-audit for recommendations and review velocity
      localAudit = await callLSEO("/v1/audit/local", {
        business_name,
        location,
        keyword: kw,
        competitors: 5,
      });

      const creditsRemaining = localAudit?.credits_remaining ?? 0;
      console.log(`[audit] LocalSEOData credits remaining: ${creditsRemaining}`);

      // Additional LSEO calls if credits allow
      if (creditsRemaining >= 10) {
        const lseoPhase2: Promise<any>[] = [];

        // Review velocity (6 credits)
        lseoPhase2.push(
          callLSEO("/v1/reviews/velocity", {
            business_name,
            location,
            period: "90d",
          })
        );

        const [revRes] = await Promise.all(lseoPhase2);
        reviewsVelocity = revRes;

        // Check remaining after phase 2
        const phase2Credits = revRes?.credits_remaining ?? creditsRemaining - 6;

        if (phase2Credits >= 10) {
          // Competitor gap (10 credits)
          competitorGap = await callLSEO("/v1/report/competitor-gap", {
            business_name,
            location,
            keyword: kw,
            competitors: 5,
          });

          const phase3Credits = competitorGap?.credits_remaining ?? phase2Credits - 10;

          // AI Visibility if URL provided (10 credits)
          if (website_url && phase3Credits >= 10) {
            try {
              const domain = new URL(
                website_url.startsWith("http") ? website_url : `https://${website_url}`
              ).hostname;
              aiVis = await callLSEO("/v1/ai/visibility", {
                domain,
                keywords: [
                  `${kw} ${location.split(",")[0]?.trim()}`,
                  `best ${kw} ${location.split(",")[0]?.trim()}`,
                ],
                location,
              });
            } catch {
              // skip
            }

            // Citation audit if credits remain
            const gbpItem = dfsFirstItem(gbpInfo);
            const addr = gbpItem?.address ?? location;
            const phone = gbpItem?.phone ?? "";
            const citCredits = aiVis?.credits_remaining ?? phase3Credits - 10;
            if (citCredits >= 5 && addr) {
              citations = await callLSEO("/v1/audit/citation", {
                business_name,
                address: addr,
                phone: phone,
              });
            }
          }
        }
      }
    }

    // ─── Build Scorecard & Gap Analysis ───────────────────────────
    const scorecard = buildScorecard(
      gbpInfo,
      onpageData,
      mapsData,
      localAudit,
      citations,
      reviewsVelocity,
      aiVis,
      competitorGap,
      business_name
    );

    const gapAnalysis = buildGapAnalysis(
      gbpInfo,
      onpageData,
      mapsData,
      localAudit,
      citations,
      reviewsVelocity,
      aiVis,
      competitorGap,
      business_name
    );

    const recommendations = extractLSEOData(localAudit)?.recommendations ?? [];

    // Build raw profile from DataForSEO GBP
    const gbpItem = dfsFirstItem(gbpInfo);
    const rawProfile = gbpItem
      ? {
          name: gbpItem.title,
          address: gbpItem.address,
          phone: gbpItem.phone,
          website: gbpItem.url,
          category: gbpItem.category,
          additional_categories: gbpItem.additional_categories,
          rating: gbpItem.rating?.value,
          reviews_count: gbpItem.rating?.votes_count,
          total_photos: gbpItem.total_photos,
          is_claimed: gbpItem.is_claimed,
          hours: gbpItem.work_time?.work_hours?.timetable,
          attributes: gbpItem.attributes?.available_attributes,
          description: gbpItem.description,
          place_id: gbpItem.place_id,
          cid: gbpItem.cid,
          main_image: gbpItem.main_image,
        }
      : extractLSEOData(localAudit) ?? null;

    // Build competitors from DataForSEO maps
    const mapsItems = dfsItems(mapsData) ?? [];
    const normalizedBiz = business_name.toLowerCase().trim();
    const competitors = mapsItems
      .filter((item: any) => {
        const title = (item.title ?? "").toLowerCase().trim();
        return !(
          title.includes(normalizedBiz) ||
          normalizedBiz.includes(title) ||
          levenshteinSimilarity(title, normalizedBiz) > 0.6
        );
      })
      .map((c: any) => ({
        name: c.title,
        rating: c.rating?.value ?? 0,
        reviews_count: c.rating?.votes_count ?? 0,
        address: c.address,
        category: c.category,
        rank: c.rank_group,
        place_id: c.place_id,
      }));

    // Merge with LocalSEOData competitors if DataForSEO didn't return enough
    const lseoCompetitors = extractLSEOData(localAudit)?.competitors ?? extractLSEOData(competitorGap)?.competitors ?? [];
    const finalCompetitors = competitors.length > 0 ? competitors : lseoCompetitors;

    // Calculate cost
    const dfsCost =
      (gbpInfo?.tasks?.[0]?.cost ?? 0) +
      (onpageData?.tasks?.[0]?.cost ?? 0) +
      (mapsData?.tasks?.[0]?.cost ?? 0);

    return NextResponse.json({
      status: "success",
      business: {
        name: business_name,
        location,
        keyword: kw,
        website: website_url || null,
      },
      scorecard,
      gapAnalysis,
      recommendations,
      rawProfile,
      competitors: finalCompetitors,
      dataSources: {
        dataforseo: {
          gbp: !!gbpItem,
          onpage: !!dfsFirstItem(onpageData),
          maps: mapsItems.length > 0,
          cost: `$${dfsCost.toFixed(4)}`,
        },
        localseodata: {
          localAudit: !!localAudit,
          citations: !!citations,
          reviews: !!reviewsVelocity,
          aiVisibility: !!aiVis,
          competitorGap: !!competitorGap,
          creditsUsed: localAudit?.credits_used ?? 0,
          creditsRemaining: localAudit?.credits_remaining ?? null,
        },
      },
    });
  } catch (e) {
    console.error("[/api/audit] Error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Audit failed" },
      { status: 500 }
    );
  }
}
