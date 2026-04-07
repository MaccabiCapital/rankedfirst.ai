import { NextRequest, NextResponse } from "next/server";

// ─── Types ───────────────────────────────────────────────────────────
interface AuditRequest {
  business_name: string;
  location: string;
  keyword?: string;
  website_url?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────
const API_BASE = "https://api.localseodata.com";

async function callAPI(path: string, body: Record<string, unknown>) {
  const key = process.env.LOCALSEODATA_API_KEY;
  if (!key) throw new Error("LOCALSEODATA_API_KEY not configured");
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${path} failed (${res.status}): ${text}`);
  }
  return res.json();
}

// Safe wrapper — returns null on failure so partial results still work
async function safeCall(path: string, body: Record<string, unknown>) {
  try {
    return await callAPI(path, body);
  } catch (e) {
    console.error(`[audit] ${path} error:`, e);
    return null;
  }
}

// ─── Scoring Logic ───────────────────────────────────────────────────
function scoreDimension(
  label: string,
  value: number,
  max: number,
  weight: number,
  detail: string
) {
  const score = Math.min(Math.round((value / max) * 100), 100);
  return { label, score, weight, detail, weighted: Math.round(score * weight) };
}

function buildScorecard(
  localAudit: Record<string, unknown> | null,
  profile: Record<string, unknown> | null,
  citations: Record<string, unknown> | null,
  reviews: Record<string, unknown> | null,
  pageAudit: Record<string, unknown> | null,
  aiVis: Record<string, unknown> | null,
  competitorGap: Record<string, unknown> | null
) {
  const dimensions: Array<{
    label: string;
    score: number;
    weight: number;
    detail: string;
    weighted: number;
    icon: string;
  }> = [];

  // 1. Local Pack Ranking (from local audit)
  const audit = localAudit?.audit as Record<string, unknown> | undefined;
  const biz = audit?.business as Record<string, unknown> | undefined;
  const packPos = (biz?.local_pack_position as number) ?? 0;
  const rankScore = packPos > 0 ? Math.max(100 - (packPos - 1) * 15, 10) : 0;
  dimensions.push({
    ...scoreDimension(
      "Local Pack Ranking",
      rankScore,
      100,
      0.15,
      packPos > 0
        ? `Position #${packPos} in local pack`
        : "Not found in local pack"
    ),
    icon: "ranking",
  });

  // 2. GBP Profile Completeness (from profile or competitor gap)
  const gapBiz = (competitorGap?.data as Record<string, unknown>)
    ?.business as Record<string, unknown> | undefined;
  const profComplete = (gapBiz?.profile_completeness as number) ?? 0;
  const prof = profile?.profile as Record<string, unknown> | undefined;
  const hasHours = prof?.hours && Object.keys(prof.hours as object).length > 0;
  const hasPhotos = ((prof?.photos_count as number) ?? 0) > 5;
  const profileScore = profComplete || (hasHours && hasPhotos ? 70 : 40);
  dimensions.push({
    ...scoreDimension(
      "GBP Profile",
      profileScore as number,
      100,
      0.15,
      profComplete
        ? `${profComplete}% complete`
        : prof
          ? `Rating ${prof.rating ?? "N/A"}, ${prof.reviews_count ?? 0} reviews`
          : "Could not retrieve profile"
    ),
    icon: "profile",
  });

  // 3. Reviews & Reputation (from review velocity)
  const revData = reviews?.data as Record<string, unknown> | undefined;
  const replyRate = ((revData?.reply_rate as number) ?? 0) * 100;
  const rating = (revData?.current_rating as number) ?? (biz?.rating as number) ?? 0;
  const revScore = Math.round(
    (rating / 5) * 40 + Math.min(replyRate, 100) * 0.3 + 30
  );
  dimensions.push({
    ...scoreDimension(
      "Reviews & Reputation",
      Math.min(revScore, 100),
      100,
      0.15,
      revData
        ? `${rating} stars, ${Math.round(replyRate)}% reply rate, ${revData.reviews_per_month ?? "?"}/mo velocity`
        : `${rating} star rating`
    ),
    icon: "reviews",
  });

  // 4. Citation Consistency (from citation audit)
  const citScore = (citations?.citation_score as number) ?? 0;
  dimensions.push({
    ...scoreDimension(
      "Citation Consistency",
      citScore,
      100,
      0.12,
      citations
        ? `${citScore}/100 — ${citations.consistent ?? 0}/${citations.total_directories ?? 0} directories consistent`
        : "Citation audit unavailable"
    ),
    icon: "citations",
  });

  // 5. On-Page SEO (from page audit)
  const pageData = pageAudit?.data as Record<string, unknown> | undefined;
  const onpageScore = (pageData?.onpage_score as number) ?? 0;
  const cwv = pageData?.core_web_vitals as Record<string, number> | undefined;
  dimensions.push({
    ...scoreDimension(
      "On-Page SEO",
      onpageScore,
      100,
      0.12,
      pageData
        ? `Score ${onpageScore}/100, LCP ${cwv?.lcp ?? "?"}s, CLS ${cwv?.cls ?? "?"}`
        : "No website URL provided"
    ),
    icon: "onpage",
  });

  // 6. AI Visibility (from ai/visibility)
  const aiData = aiVis?.data as Record<string, unknown> | undefined;
  const mentions = (aiData?.total_mentions as number) ?? 0;
  const aiScore = Math.min(mentions * 10, 100);
  dimensions.push({
    ...scoreDimension(
      "AI Visibility",
      aiScore,
      100,
      0.12,
      aiData
        ? `${mentions} AI mentions, ~${aiData.total_impressions ?? 0} impressions`
        : "AI visibility check unavailable"
    ),
    icon: "ai",
  });

  // 7. Competitive Position (from competitor gap)
  const gapData = competitorGap?.data as Record<string, unknown> | undefined;
  const competitors =
    (gapData?.competitors as Array<Record<string, unknown>>) ?? [];
  const bizReviews = (gapBiz?.reviews as number) ?? (biz?.reviews_count as number) ?? 0;
  const avgCompReviews = competitors.length
    ? competitors.reduce((s, c) => s + ((c.reviews as number) ?? 0), 0) /
      competitors.length
    : 0;
  const compScore = avgCompReviews
    ? Math.min(Math.round((bizReviews / avgCompReviews) * 80), 100)
    : 50;
  dimensions.push({
    ...scoreDimension(
      "Competitive Position",
      compScore,
      100,
      0.12,
      competitors.length
        ? `${bizReviews} reviews vs avg ${Math.round(avgCompReviews)} (${competitors.length} competitors)`
        : "Competitor data unavailable"
    ),
    icon: "competitive",
  });

  // 8. Overall Health (from local audit health_score)
  const healthScore = (audit?.health_score as number) ?? 0;
  dimensions.push({
    ...scoreDimension(
      "Overall Health",
      healthScore,
      100,
      0.07,
      healthScore
        ? `Local SEO health: ${healthScore}/100`
        : "Health score unavailable"
    ),
    icon: "health",
  });

  const totalScore = dimensions.reduce((s, d) => s + d.weighted, 0);

  return { totalScore, dimensions };
}

// Build competitive gaps and action plan
function buildGapAnalysis(
  competitorGap: Record<string, unknown> | null,
  citations: Record<string, unknown> | null,
  reviews: Record<string, unknown> | null,
  pageAudit: Record<string, unknown> | null,
  aiVis: Record<string, unknown> | null
) {
  const quickWins: Array<{ action: string; impact: string; effort: string }> =
    [];
  const strategic: Array<{ action: string; impact: string; timeline: string }> =
    [];

  // Gap analysis from competitor report
  const gapData = competitorGap?.data as Record<string, unknown> | undefined;
  const gaps = (gapData?.gaps as string[]) ?? [];
  const competitors =
    (gapData?.competitors as Array<Record<string, unknown>>) ?? [];

  // Citation quick wins
  const issues =
    (citations?.issues as Array<Record<string, unknown>>) ?? [];
  if (issues.length > 0) {
    quickWins.push({
      action: `Fix ${issues.length} citation inconsistencies (${issues.map((i) => i.directory).join(", ")})`,
      impact: "High — NAP consistency directly affects local rankings",
      effort: "1–2 hours",
    });
  }
  if ((citations?.not_found as number) > 0) {
    quickWins.push({
      action: `Submit to ${citations?.not_found} missing directories`,
      impact: "Medium — more citations build local authority",
      effort: "2–3 hours",
    });
  }

  // Review quick wins
  const revData = reviews?.data as Record<string, unknown> | undefined;
  const replyRate = (revData?.reply_rate as number) ?? 0;
  if (replyRate < 0.8) {
    quickWins.push({
      action: `Increase review reply rate from ${Math.round(replyRate * 100)}% to 90%+`,
      impact: "High — reply rate correlates with higher ratings",
      effort: "30 min/day",
    });
  }
  const velGap = (
    revData?.velocity_vs_competitors as Record<string, number> | undefined
  )?.gap;
  if (velGap && velGap < 0) {
    strategic.push({
      action: `Close review velocity gap of ${Math.abs(velGap).toFixed(1)} reviews/month`,
      impact:
        "High — review count is the #1 local ranking factor",
      timeline: "2–3 months",
    });
  }

  // Page audit wins
  const pageData = pageAudit?.data as Record<string, unknown> | undefined;
  const pageIssues =
    (pageData?.issues as Array<Record<string, unknown>>) ?? [];
  const critical = pageIssues.filter((i) => i.severity === "critical");
  if (critical.length > 0) {
    quickWins.push({
      action: `Fix ${critical.length} critical on-page issues: ${critical.map((i) => i.issue).join("; ")}`,
      impact: "High — critical issues directly hurt rankings",
      effort: "1–3 hours",
    });
  }
  const schemas = (pageData?.schema_markup as string[]) ?? [];
  if (!schemas.includes("LocalBusiness")) {
    quickWins.push({
      action: "Add LocalBusiness schema markup to website",
      impact: "Medium — helps Google understand your business entity",
      effort: "1 hour",
    });
  }

  // AI visibility strategy
  const aiData = aiVis?.data as Record<string, unknown> | undefined;
  const mentions = (aiData?.total_mentions as number) ?? 0;
  if (mentions < 5) {
    strategic.push({
      action: "Build AI visibility through entity-optimized content and citations",
      impact:
        "High — AI search is growing 40% YoY, early movers gain advantage",
      timeline: "3–6 months",
    });
  }

  // Competitor-specific gaps
  for (const gap of gaps) {
    if (
      gap.toLowerCase().includes("review") ||
      gap.toLowerCase().includes("photo")
    ) {
      quickWins.push({
        action: gap,
        impact: "Medium",
        effort: "Ongoing",
      });
    } else {
      strategic.push({
        action: gap,
        impact: "Medium",
        timeline: "1–3 months",
      });
    }
  }

  // Competitor advantages to highlight
  const competitorInsights = competitors.slice(0, 3).map((c) => ({
    name: c.name as string,
    rating: c.rating as number,
    reviews: c.reviews as number,
    advantages: (c.advantages as string[]) ?? [],
    rank: c.local_pack_rank as number,
  }));

  return { quickWins: quickWins.slice(0, 6), strategic: strategic.slice(0, 5), competitorInsights, gaps };
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

    // Fire all API calls in parallel
    const [localAudit, profile, citations, reviews, pageAudit, aiVis, competitorGap] =
      await Promise.all([
        safeCall("/v1/audit/local", {
          business_name,
          location,
          keyword: kw,
          competitors: 3,
        }),
        safeCall("/v1/business/profile", { business_name, location }),
        // Citation audit needs address — use profile address or skip
        safeCall("/v1/audit/citation", {
          business_name,
          address: location,
          phone: "",
        }),
        safeCall("/v1/reviews/velocity", {
          business_name,
          location,
          period: "90d",
        }),
        website_url
          ? safeCall("/v1/site/page-audit", { url: website_url })
          : Promise.resolve(null),
        website_url
          ? safeCall("/v1/ai/visibility", {
              domain: new URL(
                website_url.startsWith("http")
                  ? website_url
                  : `https://${website_url}`
              ).hostname,
              keywords: [
                `${kw} ${location.split(",")[0]}`,
                `best ${kw} ${location.split(",")[0]}`,
              ],
              location,
            })
          : Promise.resolve(null),
        safeCall("/v1/report/competitor-gap", {
          business_name,
          location,
          keyword: kw,
          competitors: 5,
        }),
      ]);

    const scorecard = buildScorecard(
      localAudit,
      profile,
      citations,
      reviews,
      pageAudit,
      aiVis,
      competitorGap
    );

    const gapAnalysis = buildGapAnalysis(
      competitorGap,
      citations,
      reviews,
      pageAudit,
      aiVis
    );

    // Recommendations from local audit
    const auditRecs =
      (
        localAudit?.audit as Record<string, unknown> | undefined
      )?.recommendations ?? [];

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
      recommendations: auditRecs,
      rawProfile: profile?.profile ?? null,
      competitors:
        (
          localAudit?.audit as Record<string, unknown> | undefined
        )?.competitors ?? [],
    });
  } catch (e) {
    console.error("[/api/audit] Error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Audit failed" },
      { status: 500 }
    );
  }
}
