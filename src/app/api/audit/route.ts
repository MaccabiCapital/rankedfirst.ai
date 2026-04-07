import { NextRequest, NextResponse } from "next/server";

// ─── Types ───────────────────────────────────────────────────────────
interface AuditRequest {
  business_name: string;
  location: string;
  keyword?: string;
  website_url?: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

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
    signal: AbortSignal.timeout(20000),
  });
  const json = await res.json();
  if (json.status === "error") {
    console.error(`[audit] ${path} API error:`, json.error);
    return null;
  }
  return json;
}

async function safeCall(path: string, body: Record<string, unknown>) {
  try {
    return await callAPI(path, body);
  } catch (e) {
    console.error(`[audit] ${path} error:`, e);
    return null;
  }
}

// ─── Extract data from any API response ──────────────────────────────
// The API nests results under various keys: "data", "audit", "profile", or at root
function extractData(response: any): any {
  if (!response) return null;
  // Try common nesting keys
  return response.data ?? response.audit ?? response.profile ?? response;
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
  localAuditRaw: any,
  profileRaw: any,
  citationsRaw: any,
  reviewsRaw: any,
  pageAuditRaw: any,
  aiVisRaw: any,
  competitorGapRaw: any
) {
  const local = extractData(localAuditRaw);
  const profile = extractData(profileRaw);
  const citations = extractData(citationsRaw);
  const reviews = extractData(reviewsRaw);
  const pageAudit = extractData(pageAuditRaw);
  const aiVis = extractData(aiVisRaw);
  const gap = extractData(competitorGapRaw);

  const dimensions: DimensionScore[] = [];

  // 1. Local Pack Ranking
  // local-audit returns: local_pack_position (number or null)
  const packPos = local?.local_pack_position ?? null;
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

  // 2. GBP Profile Completeness
  // local-audit returns: profile_completeness (0-100)
  // profile endpoint returns: rating, reviews_count, hours, categories, attributes, photos_count
  const profComplete = local?.profile_completeness ?? profile?.profile_completeness ?? 0;
  const rating = local?.rating?.value ?? profile?.rating ?? 0;
  const reviewsCount = local?.reviews_count ?? local?.rating?.votes_count ?? profile?.reviews_count ?? 0;
  let profileScore = profComplete;
  let profileDetail = profComplete
    ? `${profComplete}% complete`
    : "Could not retrieve profile";
  if (profComplete && rating) {
    profileDetail = `${profComplete}% complete, ${rating} stars, ${reviewsCount} reviews`;
  }
  dimensions.push({
    label: "GBP Profile",
    score: clampScore(profileScore),
    weight: 0.15,
    detail: profileDetail,
    weighted: Math.round(clampScore(profileScore) * 0.15),
    icon: "profile",
  });

  // 3. Reviews & Reputation
  // local-audit returns: rating.value, rating.votes_count, review_velocity
  // reviews endpoint returns: reviews_per_month, current_rating, reply_rate, sentiment_themes, velocity_vs_competitors
  const revVelocity = local?.review_velocity ?? reviews?.reviews_per_month ?? 0;
  const replyRate = reviews?.reply_rate ?? 0;
  const currentRating = reviews?.current_rating ?? rating ?? 0;
  // Score: up to 40pts for rating (out of 5), up to 30pts for reply rate, up to 30pts for velocity
  let revScore = 0;
  if (currentRating > 0) {
    revScore += (currentRating / 5) * 40;
  }
  revScore += (replyRate * 30);
  revScore += Math.min(revVelocity / 20, 1) * 30; // 20+ reviews/mo = full marks
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

  // 4. Citation Consistency
  // citations endpoint returns: citation_score, total_directories, consistent, inconsistent, issues
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

  // 5. On-Page SEO
  // page-audit returns: onpage_score, core_web_vitals, issues, schema_markup, mobile_friendly
  const onpageScore = pageAudit?.onpage_score ?? 0;
  const cwv = pageAudit?.core_web_vitals;
  dimensions.push({
    label: "On-Page SEO",
    score: clampScore(onpageScore),
    weight: 0.12,
    detail: onpageScore
      ? `Score ${onpageScore}/100${cwv ? `, LCP ${cwv.lcp}s, CLS ${cwv.cls}` : ""}`
      : "No website URL provided",
    weighted: Math.round(clampScore(onpageScore) * 0.12),
    icon: "onpage",
  });

  // 6. AI Visibility
  // ai/visibility returns: total_mentions, total_impressions, ai_search_volume, platform_breakdown, top_sources
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

  // 7. Competitive Position
  // local-audit returns: competitors[] array
  // competitor-gap returns: business, competitors[], gaps[]
  const competitors = local?.competitors ?? gap?.competitors ?? [];
  const gapBiz = gap?.business;
  const bizReviews = gapBiz?.reviews ?? reviewsCount ?? 0;
  let compScore = 50; // default
  let compDetail = "Competitor data unavailable";

  if (competitors.length > 0) {
    // Compare by reviews, rating, etc.
    const avgCompReviews = competitors.reduce((s: number, c: any) =>
      s + ((c.reviews_count ?? c.reviews ?? 0) as number), 0) / competitors.length;
    const avgCompRating = competitors.reduce((s: number, c: any) =>
      s + ((c.rating ?? 0) as number), 0) / competitors.length;

    if (avgCompReviews > 0 && bizReviews > 0) {
      compScore = clampScore(Math.round((bizReviews / avgCompReviews) * 60 + (currentRating / (avgCompRating || 5)) * 40));
    }
    compDetail = `${bizReviews} reviews vs avg ${Math.round(avgCompReviews)} (${competitors.length} competitors)`;
  } else if (local?.recommendations?.length) {
    // If we got recommendations but no competitor data, score based on recommendations
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

  // 8. Overall Health — synthesized from all available data
  // Use local audit health_score if available, otherwise compute from other dimensions
  const healthScore = local?.health_score ?? 0;
  let finalHealthScore = healthScore;
  let healthDetail = "Health score unavailable";

  if (!healthScore) {
    // Compute from available dimensions (exclude health itself)
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
  localAuditRaw: any,
  citationsRaw: any,
  reviewsRaw: any,
  pageAuditRaw: any,
  aiVisRaw: any,
  competitorGapRaw: any
) {
  const local = extractData(localAuditRaw);
  const citations = extractData(citationsRaw);
  const reviews = extractData(reviewsRaw);
  const pageAudit = extractData(pageAuditRaw);
  const aiVis = extractData(aiVisRaw);
  const gap = extractData(competitorGapRaw);

  const quickWins: Array<{ action: string; impact: string; effort: string }> = [];
  const strategic: Array<{ action: string; impact: string; timeline: string }> = [];

  // Use recommendations from local audit as a starting point
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
  if (!local?.local_pack_position) {
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

  // Page audit wins
  const pageIssues = pageAudit?.issues ?? [];
  const critical = pageIssues.filter((i: any) => i.severity === "critical");
  if (critical.length > 0) {
    quickWins.push({
      action: `Fix ${critical.length} critical on-page issues: ${critical.map((i: any) => i.issue).join("; ")}`,
      impact: "High — critical issues directly hurt rankings",
      effort: "1–3 hours",
    });
  }
  const schemas = pageAudit?.schema_markup ?? [];
  if (pageAudit && !schemas.includes("LocalBusiness")) {
    quickWins.push({
      action: "Add LocalBusiness schema markup to website",
      impact: "Medium — helps Google understand your business entity",
      effort: "1 hour",
    });
  }

  // AI visibility strategy
  const aiMentions = aiVis?.total_mentions ?? 0;
  if (aiMentions < 5) {
    strategic.push({
      action: "Build AI visibility through entity-optimized content and authoritative citations",
      impact: "High — AI search is growing 40% YoY, early movers gain advantage",
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

  // Profile completeness
  const profComplete = local?.profile_completeness ?? 0;
  if (profComplete > 0 && profComplete < 90) {
    quickWins.push({
      action: `Complete GBP profile (currently ${profComplete}%) — add missing hours, services, photos, and attributes`,
      impact: "High — Google favors complete profiles in local pack",
      effort: "1–2 hours",
    });
  }

  // Competitor insights
  const competitors = gap?.competitors ?? local?.competitors ?? [];
  const competitorInsights = competitors.slice(0, 5).map((c: any) => ({
    name: c.name ?? c.business_name ?? "Unknown",
    rating: c.rating ?? 0,
    reviews: c.reviews_count ?? c.reviews ?? 0,
    advantages: c.advantages ?? [],
    rank: c.local_pack_rank ?? c.position ?? 0,
  }));

  return {
    quickWins: quickWins.slice(0, 8),
    strategic: strategic.slice(0, 6),
    competitorInsights,
    gaps,
  };
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

    // Phase 1: Call the comprehensive local-audit endpoint first
    // This is the most data-rich endpoint and returns rankings, reviews, profile, competitors, recommendations
    const localAudit = await safeCall("/v1/audit/local", {
      business_name,
      location,
      keyword: kw,
      competitors: 5,
    });

    // Check remaining credits from first call
    const creditsRemaining = localAudit?.credits_remaining ?? 0;
    console.log(`[audit] Credits remaining after local-audit: ${creditsRemaining}`);

    // Phase 2: Call additional endpoints in parallel only if we have credits
    let profile = null;
    let citations = null;
    let reviews = null;
    let pageAudit = null;
    let aiVis = null;
    let competitorGap = null;

    if (creditsRemaining >= 10) {
      // Enough credits for several more calls
      const additionalCalls: Promise<any>[] = [];

      // Business profile (2 credits)
      additionalCalls.push(
        safeCall("/v1/business/profile", { business_name, location })
      );

      // Review velocity (6 credits)
      additionalCalls.push(
        safeCall("/v1/reviews/velocity", {
          business_name,
          location,
          period: "90d",
        })
      );

      // Page audit if URL provided (2 credits)
      if (website_url) {
        additionalCalls.push(
          safeCall("/v1/site/page-audit", {
            url: website_url.startsWith("http") ? website_url : `https://${website_url}`,
          })
        );
      } else {
        additionalCalls.push(Promise.resolve(null));
      }

      const [profileRes, reviewsRes, pageAuditRes] = await Promise.all(additionalCalls);
      profile = profileRes;
      reviews = reviewsRes;
      pageAudit = pageAuditRes;

      // Check credits again after phase 2
      const phase2Credits = [profileRes, reviewsRes, pageAuditRes]
        .filter(Boolean)
        .reduce((min, r) => Math.min(min, r?.credits_remaining ?? Infinity), Infinity);
      const remainingAfterPhase2 = phase2Credits === Infinity ? creditsRemaining - 10 : phase2Credits;

      // Phase 3: More expensive calls if credits remain
      if (remainingAfterPhase2 >= 10) {
        const phase3Calls: Promise<any>[] = [];

        // Competitor gap report (10 credits)
        phase3Calls.push(
          safeCall("/v1/report/competitor-gap", {
            business_name,
            location,
            keyword: kw,
            competitors: 5,
          })
        );

        // AI Visibility if URL provided (10 credits)
        if (website_url) {
          try {
            const domain = new URL(
              website_url.startsWith("http") ? website_url : `https://${website_url}`
            ).hostname;
            phase3Calls.push(
              safeCall("/v1/ai/visibility", {
                domain,
                keywords: [
                  `${kw} ${location.split(",")[0]?.trim()}`,
                  `best ${kw} ${location.split(",")[0]?.trim()}`,
                ],
                location,
              })
            );
          } catch {
            phase3Calls.push(Promise.resolve(null));
          }
        } else {
          phase3Calls.push(Promise.resolve(null));
        }

        const [gapRes, aiVisRes] = await Promise.all(phase3Calls);
        competitorGap = gapRes;
        aiVis = aiVisRes;

        // Citation audit if we still have credits (5 credits, needs address/phone)
        const addr = profile?.profile?.address ?? extractData(profile)?.address ?? location;
        const phone = profile?.profile?.phone ?? extractData(profile)?.phone ?? "";
        if (addr) {
          citations = await safeCall("/v1/audit/citation", {
            business_name,
            address: addr,
            phone: phone,
          });
        }
      }
    }

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
      localAudit,
      citations,
      reviews,
      pageAudit,
      aiVis,
      competitorGap
    );

    const recommendations = extractData(localAudit)?.recommendations ?? [];

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
      rawProfile: extractData(profile) ?? null,
      competitors: extractData(localAudit)?.competitors ?? extractData(competitorGap)?.competitors ?? [],
      creditsUsed: localAudit?.credits_used ?? 0,
      creditsRemaining: localAudit?.credits_remaining ?? null,
    });
  } catch (e) {
    console.error("[/api/audit] Error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Audit failed" },
      { status: 500 }
    );
  }
}
