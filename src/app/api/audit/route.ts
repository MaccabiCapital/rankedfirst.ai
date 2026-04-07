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
  // Check task-level errors
  const task = json.tasks?.[0];
  if (task && task.status_code !== 20000) {
    console.warn(`[DFS] ${path} task warning:`, task.status_code, task.status_message);
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

function dfsItems(response: any): any[] {
  try {
    return response?.tasks?.[0]?.result?.[0]?.items ?? [];
  } catch {
    return [];
  }
}

function dfsFirstItem(response: any): any {
  const items = dfsItems(response);
  return items.length > 0 ? items[0] : null;
}

// ─── Location Resolution ─────────────────────────────────────────────
// DataForSEO requires precise location_name or location_code
// We try to resolve the user's location string to a location_code
async function resolveLocation(location: string): Promise<{ code: number | null; name: string }> {
  try {
    // First try the locations endpoint to find a match
    const res = await fetch(`${DFS_BASE}/serp/google/locations`, {
      method: "GET",
      headers: { Authorization: getDFSAuth() },
      signal: AbortSignal.timeout(10000),
    });
    const json = await res.json();
    const locations: any[] = json.tasks?.[0]?.result ?? [];

    // Normalize user input
    const normalized = location.toLowerCase().replace(/\s+/g, " ").trim();
    const parts = normalized.split(",").map((p) => p.trim());
    const city = parts[0] ?? "";

    // Try exact match first
    for (const loc of locations) {
      const locName = (loc.location_name ?? "").toLowerCase();
      if (locName === normalized) {
        return { code: loc.location_code, name: loc.location_name };
      }
    }

    // Try matching by city + country/state
    const matches = locations.filter((loc: any) => {
      const locName = (loc.location_name ?? "").toLowerCase();
      return locName.startsWith(city + ",");
    });

    if (matches.length === 1) {
      return { code: matches[0].location_code, name: matches[0].location_name };
    }

    // If multiple matches, try to find the best one using more parts
    if (matches.length > 1 && parts.length > 1) {
      for (const m of matches) {
        const locName = (m.location_name ?? "").toLowerCase();
        const hasAllParts = parts.every((p) => locName.includes(p));
        if (hasAllParts) {
          return { code: m.location_code, name: m.location_name };
        }
      }
      // Return first match as fallback
      return { code: matches[0].location_code, name: matches[0].location_name };
    }

    // No match found — use the raw string
    console.warn(`[audit] Could not resolve location "${location}" to a code`);
    return { code: null, name: location };
  } catch (e) {
    console.error("[audit] Location resolution failed:", e);
    return { code: null, name: location };
  }
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

// ─── Scoring ─────────────────────────────────────────────────────────
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

// ─── Business Finder ─────────────────────────────────────────────────
// Find the target business within Maps SERP results
interface BusinessMatch {
  item: any;
  rank: number;
  found: boolean;
}

function findBusinessInMaps(mapsItems: any[], businessName: string): BusinessMatch {
  const normalized = businessName.toLowerCase().trim();
  const words = normalized.split(/\s+/).filter((w) => w.length > 2);

  for (const item of mapsItems) {
    const title = (item.title ?? "").toLowerCase().trim();

    // Exact or near-exact match
    if (
      title === normalized ||
      title.includes(normalized) ||
      normalized.includes(title) ||
      levenshteinSimilarity(title, normalized) > 0.6
    ) {
      return { item, rank: item.rank_group ?? 0, found: true };
    }

    // Word overlap check — require 75%+ of significant words to match
    const titleWords = title.split(/\s+/);
    const overlap = words.filter((w) => titleWords.some((tw: string) => tw === w || (tw.length > 4 && tw.includes(w)) || (w.length > 4 && w.includes(tw))));
    if (overlap.length >= 3 && overlap.length >= words.length * 0.75) {
      return { item, rank: item.rank_group ?? 0, found: true };
    }

    // Domain match if website_url was provided and business has a domain
    const domain = item.domain ?? "";
    if (domain && normalized.replace(/\s+/g, "").includes(domain.replace("www.", "").split(".")[0])) {
      return { item, rank: item.rank_group ?? 0, found: true };
    }
  }

  return { item: null, rank: 0, found: false };
}

// ─── Scorecard Builder ───────────────────────────────────────────────
function buildScorecard(
  businessMatch: BusinessMatch,
  mapsItems: any[],
  onpageData: any,
  rankedKwData: any,
  localAuditRaw: any,
  citationsRaw: any,
  reviewsRaw: any,
  aiVisRaw: any,
  competitorGapRaw: any,
  websiteUrl: string | undefined
) {
  const biz = businessMatch.item;
  const local = extractLSEOData(localAuditRaw);
  const citations = extractLSEOData(citationsRaw);
  const reviews = extractLSEOData(reviewsRaw);
  const aiVis = extractLSEOData(aiVisRaw);
  const gap = extractLSEOData(competitorGapRaw);

  const dimensions: DimensionScore[] = [];

  // Rating and review count from Maps/GBP data
  const rating = biz?.rating?.value ?? local?.rating?.value ?? 0;
  const reviewsCount = biz?.rating?.votes_count ?? local?.reviews_count ?? local?.rating?.votes_count ?? 0;

  // ─── Parse ranked keywords data ─────────────────────────────────
  const rkResult = rankedKwData?.tasks?.[0]?.result?.[0];
  const rankedKeywords: any[] = (rkResult?.items ?? []).map((it: any) => {
    const kd = it.keyword_data ?? {};
    const ki = kd.keyword_info ?? {};
    const serp = it.ranked_serp_element?.serp_item ?? {};
    return {
      keyword: kd.keyword ?? "",
      position: serp.rank_group ?? 0,
      searchVolume: ki.search_volume ?? 0,
      type: serp.type ?? "organic",
      url: serp.relative_url ?? "",
    };
  });
  const totalRankedKeywords = rkResult?.total_count ?? 0;
  const organicETV = rkResult?.metrics?.organic?.etv ?? 0;
  const top10Keywords = rankedKeywords.filter((k: any) => k.position <= 10).length;
  const top20Keywords = rankedKeywords.filter((k: any) => k.position <= 20).length;

  // ─── 1. Local Pack Ranking ──────────────────────────────────────
  // rank reflects keyword search position, NOT name search
  let rankScore = 0;
  let rankDetail = "";

  if (businessMatch.found && businessMatch.rank > 0) {
    // Found in keyword-based Maps search — real local pack ranking
    rankScore = clampScore(Math.max(100 - (businessMatch.rank - 1) * 15, 10));
    rankDetail = `Position #${businessMatch.rank} in local pack for target keyword`;
  } else if (businessMatch.found && businessMatch.rank === 0) {
    // Business exists (found by name) but doesn't rank in keyword search
    rankScore = 5;
    rankDetail = "Has GBP but not ranking in local pack for target keyword";
  } else if (!businessMatch.found && mapsItems.length > 0) {
    rankScore = 0;
    rankDetail = "Not found in local map pack";
  } else {
    const packPos = local?.local_pack_position;
    if (packPos && packPos > 0) {
      rankScore = clampScore(Math.max(100 - (packPos - 1) * 15, 10));
      rankDetail = `Position #${packPos} in local pack`;
    } else {
      rankDetail = "Not found in local pack";
    }
  }

  // Enrich with organic ranking data if available
  if (totalRankedKeywords > 0) {
    // Small bonus for organic rankings, capped low — this dimension is about local pack
    const organicBonus = Math.min(top10Keywords * 5 + top20Keywords * 2, 15);
    rankScore = clampScore(rankScore + organicBonus);
    rankDetail += ` · ${totalRankedKeywords} organic keywords (${top10Keywords} in top 10)`;
  }

  dimensions.push({
    label: "Local Pack Ranking",
    score: rankScore,
    weight: 0.15,
    detail: rankDetail,
    weighted: Math.round(rankScore * 0.15),
    icon: "ranking",
  });

  // ─── 2. GBP Profile Completeness ───────────────────────────────
  let profileScore = 0;
  let profileDetail = "";

  if (biz) {
    // We have Maps data for this business — calculate profile completeness
    const fields = [
      biz.title,
      biz.address,
      biz.phone,
      biz.domain || biz.url,
      biz.category,
      biz.work_time?.timetable ?? biz.work_time?.work_hours?.timetable,
      biz.total_photos && biz.total_photos > 0,
      biz.is_claimed,
      biz.rating?.votes_count && biz.rating.votes_count > 0,
      biz.additional_categories && biz.additional_categories.length > 0,
    ];
    const filled = fields.filter(Boolean).length;
    profileScore = clampScore(Math.round((filled / fields.length) * 100));
    profileDetail = `${profileScore}% complete`;
    if (rating) profileDetail += `, ${rating} stars, ${reviewsCount} reviews`;
    if (biz.is_claimed === false) {
      profileDetail += " (unclaimed)";
      profileScore = Math.max(profileScore - 15, 0);
    }
  } else if (local?.profile_completeness) {
    profileScore = local.profile_completeness;
    profileDetail = `${profileScore}% complete`;
    if (rating) profileDetail += `, ${rating} stars, ${reviewsCount} reviews`;
  } else {
    // Business has no GBP at all
    profileDetail = "No Google Business Profile found — create one to appear in local search";
  }

  dimensions.push({
    label: "GBP Profile",
    score: clampScore(profileScore),
    weight: 0.15,
    detail: profileDetail,
    weighted: Math.round(clampScore(profileScore) * 0.15),
    icon: "profile",
  });

  // ─── 3. Reviews & Reputation ────────────────────────────────────
  const revVelocity = local?.review_velocity ?? reviews?.reviews_per_month ?? 0;
  const replyRate = reviews?.reply_rate ?? 0;
  const currentRating = rating || reviews?.current_rating || 0;

  let revScore = 0;
  if (currentRating > 0) revScore += (currentRating / 5) * 40;
  revScore += replyRate * 30;
  revScore += Math.min(revVelocity / 20, 1) * 30;

  // If we have rating from Maps but no velocity data, estimate score from rating + count
  if (currentRating > 0 && revVelocity === 0 && replyRate === 0) {
    const countBonus = Math.min(reviewsCount / 100, 1) * 30; // up to 30pts for 100+ reviews
    revScore = (currentRating / 5) * 40 + countBonus;
  }
  revScore = clampScore(revScore);

  let revDetail = "";
  if (currentRating > 0 || reviewsCount > 0) {
    const parts: string[] = [];
    if (currentRating > 0) parts.push(`${currentRating} stars`);
    if (reviewsCount > 0) parts.push(`${reviewsCount} reviews`);
    if (revVelocity > 0) parts.push(`${revVelocity.toFixed(1)}/mo velocity`);
    if (replyRate > 0) parts.push(`${Math.round(replyRate * 100)}% reply rate`);
    revDetail = parts.join(", ");
  } else if (!biz) {
    revDetail = "No Google reviews — create a GBP to start collecting reviews";
  } else {
    revDetail = "No reviews yet — request reviews from customers";
  }

  dimensions.push({
    label: "Reviews & Reputation",
    score: revScore,
    weight: 0.15,
    detail: revDetail,
    weighted: Math.round(revScore * 0.15),
    icon: "reviews",
  });

  // ─── 4. Citation Consistency ────────────────────────────────────
  const citScore = citations?.citation_score ?? citationsRaw?.citation_score ?? 0;
  const citTotal = citations?.total_directories ?? citationsRaw?.total_directories ?? 0;
  const citConsistent = citations?.consistent ?? citationsRaw?.consistent ?? 0;

  let finalCitScore = clampScore(citScore);
  let citDetail = "";

  if (citScore > 0) {
    citDetail = `${citScore}/100 — ${citConsistent}/${citTotal} directories consistent`;
  } else {
    // Estimate citation health from GBP completeness signals
    // A business with a claimed GBP, phone, address, and website is likely listed in major directories
    const citSignals = [
      biz?.phone,              // Has phone → likely in phone directories
      biz?.address,            // Has address → likely in map directories
      biz?.domain || biz?.url, // Has website → likely in web directories
      biz?.is_claimed,         // Claimed GBP → owner manages listings
      biz?.category,           // Has category → better directory matching
    ];
    const citPresent = citSignals.filter(Boolean).length;
    if (citPresent >= 3) {
      finalCitScore = clampScore(Math.round((citPresent / citSignals.length) * 55 + 15));
      citDetail = `Estimated ${finalCitScore}/100 from GBP signals (${citPresent}/5 key fields present)`;
    } else if (citPresent > 0) {
      finalCitScore = clampScore(citPresent * 10);
      citDetail = `Estimated ${finalCitScore}/100 — incomplete business info limits directory presence`;
    } else if (biz) {
      finalCitScore = 15;
      citDetail = "Business exists but missing key info for directory listings";
    } else {
      finalCitScore = 0;
      citDetail = "No business listing found — create a GBP with complete NAP data";
    }
  }

  dimensions.push({
    label: "Citation Consistency",
    score: finalCitScore,
    weight: 0.12,
    detail: citDetail,
    weighted: Math.round(finalCitScore * 0.12),
    icon: "citations",
  });

  // ─── 5. On-Page SEO ────────────────────────────────────────────
  let onpageScore = 0;
  let onpageDetail = "";
  const onpageItem = dfsFirstItem(onpageData);

  if (onpageItem) {
    // Accept onpage_score even if 0 — the item existing means DFS crawled the page
    onpageScore = onpageItem.onpage_score ?? 0;

    // Check if the page was actually accessible
    const pageTitle = onpageItem.meta?.title ?? "";
    const statusCode = onpageItem.status_code ?? 200;

    if (statusCode >= 400 || pageTitle.toLowerCase().includes("forbidden") || pageTitle.toLowerCase().includes("denied")) {
      onpageDetail = `Website returned ${statusCode >= 400 ? statusCode : "403 Forbidden"} — crawler blocked`;
      onpageScore = Math.min(onpageScore || 20, 50);
    } else {
      const lcp = onpageItem.page_timing?.largest_contentful_paint;
      const cls = onpageItem.meta?.cumulative_layout_shift;

      const issueList: string[] = [];
      const checks = onpageItem.checks ?? {};
      if (checks.no_h1_tag) issueList.push("missing H1");
      if (checks.no_description) issueList.push("no meta description");
      if (checks.no_title) issueList.push("no title tag");
      if (checks.high_loading_time) issueList.push("slow load");
      if (checks.is_http) issueList.push("not HTTPS");
      if (checks.no_favicon) issueList.push("no favicon");
      if (checks.low_content_rate) issueList.push("thin content");
      if (checks.title_too_long) issueList.push("title too long");
      if (checks.no_image_alt) issueList.push("missing alt text");

      onpageDetail = `Score ${Math.round(onpageScore)}/100`;
      if (lcp !== undefined && lcp > 0) onpageDetail += `, LCP ${(lcp / 1000).toFixed(1)}s`;
      if (cls !== undefined) onpageDetail += `, CLS ${cls.toFixed(3)}`;
      if (issueList.length > 0) onpageDetail += ` — ${issueList.join(", ")}`;
    }
  } else if (websiteUrl) {
    // DFS couldn't crawl but we have a URL — give partial credit based on what we know
    onpageScore = 25;
    onpageDetail = "Could not crawl website — may be blocking automated requests";
  } else if (biz?.domain || biz?.url) {
    // Found a website via GBP but user didn't provide one — still give some credit
    onpageScore = 20;
    onpageDetail = `Website detected (${biz.domain || biz.url}) but not analyzed — rerun with website URL for full audit`;
  } else {
    onpageScore = 0;
    onpageDetail = "No website found — critical for SEO";
  }

  dimensions.push({
    label: "On-Page SEO",
    score: clampScore(onpageScore),
    weight: 0.12,
    detail: onpageDetail,
    weighted: Math.round(clampScore(onpageScore) * 0.12),
    icon: "onpage",
  });

  // ─── 6. AI Visibility ──────────────────────────────────────────
  const aiMentions = aiVis?.total_mentions ?? 0;
  const aiImpressions = aiVis?.total_impressions ?? 0;
  let aiScore = 0;
  let aiDetail = "";

  if (aiMentions > 0) {
    aiScore = clampScore(Math.min(aiMentions * 10, 100));
    aiDetail = `${aiMentions} AI mentions, ~${aiImpressions} impressions`;
  } else {
    // Estimate AI visibility from SEO signals we DO have
    // Strong organic presence + good GBP = higher chance of appearing in AI answers
    let aiEstimate = 0;
    const aiParts: string[] = [];

    // Organic keyword rankings increase AI citation likelihood
    if (totalRankedKeywords > 0) {
      const kwBoost = Math.min(totalRankedKeywords * 2, 25);
      aiEstimate += kwBoost;
      aiParts.push(`${totalRankedKeywords} ranked keywords`);
    }
    // Top-10 rankings strongly increase AI visibility
    if (top10Keywords > 0) {
      aiEstimate += Math.min(top10Keywords * 8, 20);
      aiParts.push(`${top10Keywords} in top 10`);
    }
    // On-page quality contributes
    if (onpageScore > 70) {
      aiEstimate += 10;
    } else if (onpageScore > 40) {
      aiEstimate += 5;
    }
    // GBP presence helps for local AI queries
    if (biz) {
      aiEstimate += 5;
      if (reviewsCount > 20) aiEstimate += 5;
    }

    aiScore = clampScore(aiEstimate);
    if (aiScore > 0) {
      aiDetail = `Estimated ${aiScore}/100 from SEO signals (${aiParts.join(", ") || "GBP presence"})`;
    } else if (websiteUrl) {
      aiDetail = "Low AI visibility — no organic rankings or strong SEO signals detected";
    } else {
      aiDetail = "No website — AI assistants have nothing to reference";
    }
  }

  dimensions.push({
    label: "AI Visibility",
    score: aiScore,
    weight: 0.12,
    detail: aiDetail,
    weighted: Math.round(aiScore * 0.12),
    icon: "ai",
  });

  // ─── 7. Competitive Position ────────────────────────────────────
  const competitors = mapsItems.filter((item: any) => item !== biz);
  const lseoCompetitors = local?.competitors ?? gap?.competitors ?? [];
  const allCompetitors = competitors.length > 0 ? competitors : lseoCompetitors;

  let compScore = 50;
  let compDetail = "Competitor data unavailable";

  if (allCompetitors.length > 0 && biz) {
    const avgCompReviews =
      allCompetitors.reduce(
        (s: number, c: any) =>
          s + ((c.rating?.votes_count ?? c.reviews_count ?? c.reviews ?? 0) as number),
        0
      ) / allCompetitors.length;
    const avgCompRating =
      allCompetitors.reduce(
        (s: number, c: any) => s + ((c.rating?.value ?? c.rating ?? 0) as number),
        0
      ) / allCompetitors.length;

    const bizReviews = reviewsCount || 0;

    if (avgCompReviews > 0 && bizReviews > 0) {
      compScore = clampScore(
        Math.round(
          (bizReviews / avgCompReviews) * 60 + (currentRating / (avgCompRating || 5)) * 40
        )
      );
    } else if (bizReviews === 0 && avgCompReviews > 0) {
      compScore = clampScore(15); // business has no reviews but competitors do
    }
    compDetail = `${bizReviews} reviews vs avg ${Math.round(avgCompReviews)} (${allCompetitors.length} competitors)`;
  } else if (!biz && allCompetitors.length > 0) {
    // Business not found at all — show what competitors look like
    const avgRev =
      allCompetitors.reduce(
        (s: number, c: any) =>
          s + ((c.rating?.votes_count ?? c.reviews_count ?? 0) as number),
        0
      ) / allCompetitors.length;
    compScore = 5;
    compDetail = `Not in local results — competitors avg ${Math.round(avgRev)} reviews`;
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

  // ─── 8. Overall Health ──────────────────────────────────────────
  const healthScore = local?.health_score ?? 0;
  let finalHealthScore = healthScore;
  let healthDetail = "";

  if (!healthScore) {
    const nonHealthDims = dimensions.filter((d) => d.icon !== "health");
    const nonZero = nonHealthDims.filter((d) => d.score > 0);
    if (nonZero.length > 0) {
      finalHealthScore = clampScore(
        Math.round(nonZero.reduce((s, d) => s + d.score, 0) / nonZero.length)
      );
      healthDetail = `Computed from ${nonZero.length} active dimensions`;
    } else {
      // All dimensions are 0 — business essentially invisible online
      finalHealthScore = 5;
      healthDetail = "Very limited online presence detected";
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

// ─── Gap Analysis ────────────────────────────────────────────────────
function buildGapAnalysis(
  businessMatch: BusinessMatch,
  mapsItems: any[],
  onpageData: any,
  rankedKwData: any,
  localAuditRaw: any,
  citationsRaw: any,
  reviewsRaw: any,
  aiVisRaw: any,
  competitorGapRaw: any,
  websiteUrl: string | undefined
) {
  const biz = businessMatch.item;
  const local = extractLSEOData(localAuditRaw);
  const citations = extractLSEOData(citationsRaw);
  const reviews = extractLSEOData(reviewsRaw);
  const aiVis = extractLSEOData(aiVisRaw);
  const gap = extractLSEOData(competitorGapRaw);
  const onpageItem = dfsFirstItem(onpageData);

  const quickWins: Array<{ action: string; impact: string; effort: string }> = [];
  const strategic: Array<{ action: string; impact: string; timeline: string }> = [];

  // ─── No GBP at all — most critical ─────────────────────────────
  if (!biz) {
    quickWins.push({
      action: "Create and verify a Google Business Profile — you currently have no GBP listing",
      impact: "Critical — without a GBP you cannot appear in Google Maps or local pack",
      effort: "1–2 hours + verification (up to 14 days)",
    });
  } else {
    // GBP exists — check for gaps
    if (biz.is_claimed === false) {
      quickWins.push({
        action: "Claim and verify your Google Business Profile",
        impact: "Critical — unclaimed profiles lose ranking signals and can be edited by anyone",
        effort: "1 hour + verification time",
      });
    }
    if (!biz.total_photos || biz.total_photos < 10) {
      quickWins.push({
        action: `Add more photos to GBP (currently ${biz.total_photos ?? 0}) — aim for 20+`,
        impact: "High — businesses with 100+ photos get 520% more calls",
        effort: "1–2 hours",
      });
    }
    if (!biz.work_time?.timetable && !biz.work_time?.work_hours?.timetable) {
      quickWins.push({
        action: "Add business hours to your Google Business Profile",
        impact: "High — missing hours reduce profile completeness score",
        effort: "15 minutes",
      });
    }
    const reviewsCount = biz.rating?.votes_count ?? 0;
    if (reviewsCount < 20) {
      quickWins.push({
        action: `Grow your review count (currently ${reviewsCount}) — implement a review request workflow`,
        impact: "High — review count and velocity are #1 local ranking factors",
        effort: "Setup: 2 hours, then ongoing",
      });
    }
  }

  // ─── On-page issues from DataForSEO ─────────────────────────────
  if (onpageItem) {
    const checks = onpageItem.checks ?? {};
    const pageTitle = onpageItem.meta?.title ?? "";

    if (pageTitle.toLowerCase().includes("forbidden") || pageTitle.toLowerCase().includes("denied")) {
      quickWins.push({
        action: "Fix website crawler blocking — your site returns 403 Forbidden to search engines",
        impact: "Critical — if Googlebot is blocked, your pages won't be indexed",
        effort: "1–2 hours (check .htaccess / firewall rules)",
      });
    } else {
      if (checks.no_h1_tag) quickWins.push({ action: "Add an H1 tag to your homepage", impact: "High — primary on-page ranking signal", effort: "15 minutes" });
      if (checks.no_description) quickWins.push({ action: "Add a meta description", impact: "Medium — improves click-through rate", effort: "15 minutes" });
      if (checks.is_http) quickWins.push({ action: "Migrate to HTTPS", impact: "Critical — HTTP sites are penalized", effort: "2–4 hours" });
      if (checks.high_loading_time) strategic.push({ action: "Improve page load speed — optimize images, enable caching", impact: "High — Core Web Vital factor", timeline: "1–2 weeks" });
      if (checks.low_content_rate) strategic.push({ action: "Add more text content (aim for 500+ words)", impact: "Medium — thin content ranks poorly", timeline: "1 week" });
      if (checks.no_image_alt) quickWins.push({ action: "Add alt text to all images", impact: "Medium — improves accessibility + image search", effort: "1 hour" });
    }
  } else if (websiteUrl) {
    strategic.push({
      action: "Ensure your website is accessible to search engine crawlers",
      impact: "High — if search engines can't reach your site, it won't rank",
      timeline: "Immediate",
    });
  } else if (!websiteUrl) {
    quickWins.push({
      action: "Create a website and link it to your Google Business Profile",
      impact: "High — businesses with websites rank significantly higher in local search",
      effort: "Days to weeks depending on complexity",
    });
  }

  // ─── LocalSEOData recommendations ───────────────────────────────
  const recs = local?.recommendations ?? [];
  for (const rec of recs) {
    const recLower = (rec as string).toLowerCase();
    if (recLower.includes("review") || recLower.includes("photo") || recLower.includes("post")) {
      quickWins.push({ action: rec, impact: "High — directly affects local ranking signals", effort: "Ongoing, 30 min/week" });
    } else if (recLower.includes("profile") || recLower.includes("gbp") || recLower.includes("optimize")) {
      quickWins.push({ action: rec, impact: "High — GBP completeness is a top-3 factor", effort: "1–2 hours" });
    } else {
      strategic.push({ action: rec, impact: "Medium — builds long-term visibility", timeline: "1–3 months" });
    }
  }

  // Citation issues
  const citIssues = citations?.issues ?? citationsRaw?.issues ?? [];
  if (citIssues.length > 0) {
    quickWins.push({
      action: `Fix ${citIssues.length} citation inconsistencies`,
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
      action: "Build AI visibility through entity-optimized content",
      impact: "High — AI search growing 40% YoY",
      timeline: "3–6 months",
    });
  }

  // Competitor gap items
  const gaps = gap?.gaps ?? [];
  for (const g of gaps) {
    const gLower = (g as string).toLowerCase();
    if (gLower.includes("review") || gLower.includes("photo")) {
      quickWins.push({ action: g, impact: "Medium", effort: "Ongoing" });
    } else {
      strategic.push({ action: g, impact: "Medium", timeline: "1–3 months" });
    }
  }

  // ─── Keyword gap recommendations ──────────────────────────────
  const rkResult = rankedKwData?.tasks?.[0]?.result?.[0];
  const totalRankedKw = rkResult?.total_count ?? 0;
  const rkItems: any[] = rkResult?.items ?? [];
  const top10Kw = rkItems.filter((it: any) => (it.ranked_serp_element?.serp_item?.rank_group ?? 999) <= 10).length;
  const top20Kw = rkItems.filter((it: any) => (it.ranked_serp_element?.serp_item?.rank_group ?? 999) <= 20).length;

  if (totalRankedKw === 0 && websiteUrl) {
    strategic.push({
      action: "Your domain ranks for 0 keywords — build keyword-targeted content (blog, service pages) to gain organic visibility",
      impact: "Critical — organic keyword rankings drive free traffic",
      timeline: "1–3 months",
    });
  } else if (totalRankedKw > 0 && top10Kw === 0) {
    strategic.push({
      action: `You rank for ${totalRankedKw} keywords but none in the top 10 — optimize top-ranking pages to push into page 1`,
      impact: "High — page 1 gets 90%+ of organic clicks",
      timeline: "1–2 months",
    });
  } else if (top10Kw > 0 && top10Kw < 5) {
    quickWins.push({
      action: `Expand from ${top10Kw} top-10 keywords — create content targeting related long-tail terms`,
      impact: "High — you have page-1 authority, leverage it for more keywords",
      effort: "Ongoing, 2–3 hrs/week",
    });
  }

  // Check for keyword-service misalignment (business keyword not in ranked keywords)
  if (totalRankedKw > 0 && biz) {
    const kwLower = (biz.category ?? "").toLowerCase();
    const hasRelevantKw = rkItems.some((it: any) => {
      const kw = ((it.keyword_data?.keyword) ?? "").toLowerCase();
      return kwLower.split(/\s+/).some((w: string) => w.length > 3 && kw.includes(w));
    });
    if (!hasRelevantKw && kwLower) {
      strategic.push({
        action: `None of your ranked keywords relate to "${biz.category}" — create service-focused content targeting your core business keywords`,
        impact: "High — you may be ranking for irrelevant terms",
        timeline: "1–2 months",
      });
    }
  }

  // ─── Competitor insights from Maps ──────────────────────────────
  const competitors = mapsItems.filter((item: any) => item !== biz);
  const competitorInsights = competitors.slice(0, 5).map((c: any) => ({
    name: c.title ?? "Unknown",
    rating: c.rating?.value ?? 0,
    reviews: c.rating?.votes_count ?? 0,
    advantages: [] as string[],
    rank: c.rank_group ?? 0,
  }));

  // Merge LocalSEOData competitor insights if Maps didn't have enough
  if (competitorInsights.length === 0) {
    const lseoComps = (gap?.competitors ?? local?.competitors ?? []).slice(0, 5);
    for (const c of lseoComps) {
      competitorInsights.push({
        name: c.name ?? c.business_name ?? "Unknown",
        rating: c.rating ?? 0,
        reviews: c.reviews_count ?? c.reviews ?? 0,
        advantages: c.advantages ?? [],
        rank: c.local_pack_rank ?? c.position ?? 0,
      });
    }
  }

  return {
    quickWins: dedupeActions(quickWins).slice(0, 10),
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
  for (let i = 0; i <= la; i++) matrix[i] = [i];
  for (let j = 0; j <= lb; j++) matrix[0][j] = j;
  for (let i = 1; i <= la; i++) {
    for (let j = 1; j <= lb; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
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
    const kw = keyword || business_name;

    console.log(`[audit] Starting audit for "${business_name}" in "${location}" (keyword: "${kw}")`);

    // ─── Step 1: Resolve location to DFS location_code ────────────
    const loc = await resolveLocation(location);
    console.log(`[audit] Resolved location: ${loc.name} (code: ${loc.code})`);

    // ─── Step 2: DataForSEO parallel calls ────────────────────────
    const dfsPromises: Promise<any>[] = [];

    const mapsLocationParam = loc.code
      ? { location_code: loc.code }
      : { location_name: loc.name };

    // 2a. Maps SERP #1 — search for business name (to find the business)
    dfsPromises.push(
      safeDFS("/serp/google/maps/live/advanced", [
        {
          keyword: business_name,
          ...mapsLocationParam,
          language_code: "en",
          depth: 20,
        },
      ])
    );

    // 2b. Maps SERP #2 — search for keyword (to find competitors)
    dfsPromises.push(
      safeDFS("/serp/google/maps/live/advanced", [
        {
          keyword: `${kw} ${location.split(",")[0]?.trim()}`,
          ...mapsLocationParam,
          language_code: "en",
          depth: 20,
        },
      ])
    );

    // 2c. On-Page Instant Pages (if website provided)
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

    // 2d. Ranked Keywords (if website provided) — what keywords does the domain rank for?
    if (website_url) {
      const domain = website_url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
      const rankedKwLocationCode = loc.code ?? 2840; // default to US if no code
      dfsPromises.push(
        safeDFS("/dataforseo_labs/google/ranked_keywords/live", [
          {
            target: domain,
            location_code: rankedKwLocationCode,
            language_code: "en",
            limit: 50,
            order_by: ["ranked_serp_element.serp_item.rank_group,asc"],
          },
        ])
      );
    } else {
      dfsPromises.push(Promise.resolve(null));
    }

    const [mapsNameData, mapsKwData, onpageData, rankedKwData] = await Promise.all(dfsPromises);

    // ─── Step 3: Find our business + merge competitor data ─────────
    const mapsNameItems = dfsItems(mapsNameData);
    const mapsKwItems = dfsItems(mapsKwData);

    // Check keyword Maps first — this rank matters for "Local Pack Ranking"
    const kwMatch = findBusinessInMaps(mapsKwItems, business_name);
    // Also check name Maps to confirm the business exists on Google
    const nameMatch = findBusinessInMaps(mapsNameItems, business_name);

    // businessMatch.rank should reflect keyword ranking, not name ranking
    // Name search rank is meaningless (searching your own name always returns you #1)
    const businessMatch: BusinessMatch = kwMatch.found
      ? kwMatch                       // Found in keyword search — real ranking
      : nameMatch.found
        ? { ...nameMatch, rank: 0 }   // Found by name only — exists but doesn't rank for keyword
        : { item: null, rank: 0, found: false };

    // Merge both result sets for competitor data, dedup by title
    const seenTitles = new Set<string>();
    const mapsItems: any[] = [];
    for (const item of [...mapsNameItems, ...mapsKwItems]) {
      const title = (item.title ?? "").toLowerCase();
      if (!seenTitles.has(title)) {
        seenTitles.add(title);
        mapsItems.push(item);
      }
    }

    console.log(
      `[audit] Maps: ${mapsItems.length} results. Business found: ${businessMatch.found}${businessMatch.found ? ` (rank #${businessMatch.rank}: "${businessMatch.item?.title}")` : ""}`
    );
    console.log(
      `[audit] OnPage: ${onpageData ? "✓" : "✗"} (score: ${dfsFirstItem(onpageData)?.onpage_score ?? "N/A"})`
    );

    // ─── Step 4: If business not in Maps, try GBP Info directly ───
    let gbpFallback = null;
    if (!businessMatch.found) {
      gbpFallback = await safeDFS("/business_data/google/my_business_info/live", [
        {
          keyword: business_name,
          ...mapsLocationParam,
          language_code: "en",
        },
      ]);
      const gbpItem = dfsFirstItem(gbpFallback);
      if (gbpItem) {
        // Found via GBP — update businessMatch
        businessMatch.item = gbpItem;
        businessMatch.found = true;
        businessMatch.rank = 0; // not in maps but has GBP
        console.log(`[audit] GBP fallback found: "${gbpItem.title}"`);
      }
    }

    // ─── Step 5: LocalSEOData supplemental calls ──────────────────
    let localAudit = null;
    let citations = null;
    let reviewsVelocity = null;
    let aiVis = null;
    let competitorGap = null;

    if (process.env.LOCALSEODATA_API_KEY) {
      localAudit = await callLSEO("/v1/audit/local", {
        business_name,
        location,
        keyword: kw,
        competitors: 5,
      });

      const cr = localAudit?.credits_remaining ?? 0;
      console.log(`[audit] LSEO credits remaining: ${cr}`);

      if (cr >= 6) {
        reviewsVelocity = await callLSEO("/v1/reviews/velocity", { business_name, location, period: "90d" });
        const cr2 = reviewsVelocity?.credits_remaining ?? cr - 6;

        if (cr2 >= 10) {
          competitorGap = await callLSEO("/v1/report/competitor-gap", { business_name, location, keyword: kw, competitors: 5 });
          const cr3 = competitorGap?.credits_remaining ?? cr2 - 10;

          if (website_url && cr3 >= 10) {
            try {
              const domain = new URL(website_url.startsWith("http") ? website_url : `https://${website_url}`).hostname;
              aiVis = await callLSEO("/v1/ai/visibility", {
                domain,
                keywords: [`${kw} ${location.split(",")[0]?.trim()}`],
                location,
              });
            } catch { /* skip */ }

            const addr = businessMatch.item?.address ?? location;
            const phone = businessMatch.item?.phone ?? "";
            const cr4 = aiVis?.credits_remaining ?? (cr3 - 10);
            if (cr4 >= 5 && addr) {
              citations = await callLSEO("/v1/audit/citation", { business_name, address: addr, phone });
            }
          }
        }
      }
    }

    // ─── Step 6: Build Scorecard & Gap Analysis ───────────────────
    const scorecard = buildScorecard(
      businessMatch, mapsItems, onpageData, rankedKwData,
      localAudit, citations, reviewsVelocity, aiVis, competitorGap,
      website_url
    );

    const gapAnalysis = buildGapAnalysis(
      businessMatch, mapsItems, onpageData, rankedKwData,
      localAudit, citations, reviewsVelocity, aiVis, competitorGap,
      website_url
    );

    const recommendations = extractLSEOData(localAudit)?.recommendations ?? [];

    // ─── Build raw profile ────────────────────────────────────────
    const biz = businessMatch.item;
    const rawProfile = biz
      ? {
          name: biz.title,
          address: biz.address ?? biz.address_info,
          phone: biz.phone,
          website: biz.url ?? biz.domain,
          category: biz.category,
          additional_categories: biz.additional_categories,
          rating: biz.rating?.value,
          reviews_count: biz.rating?.votes_count,
          total_photos: biz.total_photos,
          is_claimed: biz.is_claimed,
          hours: biz.work_time,
          description: biz.description,
          place_id: biz.place_id,
          cid: biz.cid,
          main_image: biz.main_image,
        }
      : null;

    // Competitors
    const competitors = mapsItems
      .filter((item: any) => item !== biz)
      .map((c: any) => ({
        name: c.title,
        rating: c.rating?.value ?? 0,
        reviews_count: c.rating?.votes_count ?? 0,
        address: c.address,
        category: c.category,
        rank: c.rank_group,
        place_id: c.place_id,
      }));

    const lseoCompetitors = extractLSEOData(localAudit)?.competitors ?? extractLSEOData(competitorGap)?.competitors ?? [];
    const finalCompetitors = competitors.length > 0 ? competitors : lseoCompetitors;

    const dfsCost =
      (mapsNameData?.tasks?.[0]?.cost ?? 0) +
      (mapsKwData?.tasks?.[0]?.cost ?? 0) +
      (onpageData?.tasks?.[0]?.cost ?? 0) +
      (rankedKwData?.tasks?.[0]?.cost ?? 0) +
      (gbpFallback?.tasks?.[0]?.cost ?? 0);

    // Build ranked keywords summary for response
    const rkRes = rankedKwData?.tasks?.[0]?.result?.[0];
    const rankedKeywordsSummary = rkRes ? {
      totalKeywords: rkRes.total_count ?? 0,
      estimatedTraffic: rkRes.metrics?.organic?.etv ?? 0,
      positionDistribution: rkRes.metrics?.organic ?? {},
      topKeywords: (rkRes.items ?? []).slice(0, 20).map((it: any) => {
        const kd = it.keyword_data ?? {};
        const ki = kd.keyword_info ?? {};
        const serp = it.ranked_serp_element?.serp_item ?? {};
        return {
          keyword: kd.keyword ?? "",
          position: serp.rank_group ?? 0,
          searchVolume: ki.search_volume ?? 0,
          type: serp.type ?? "organic",
          url: serp.relative_url ?? "",
          cpc: ki.cpc ?? 0,
        };
      }),
    } : null;

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
      rankedKeywords: rankedKeywordsSummary,
      dataSources: {
        dataforseo: {
          businessFound: businessMatch.found,
          businessRank: businessMatch.rank,
          onpage: !!dfsFirstItem(onpageData),
          mapsResults: mapsItems.length,
          locationResolved: loc.code ? `${loc.name} (${loc.code})` : loc.name,
          rankedKeywords: !!rkRes,
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
