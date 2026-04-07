import { NextRequest, NextResponse } from "next/server";

// Allow up to 60s for the audit (PSI alone can take 50s)
export const maxDuration = 60;

/* eslint-disable @typescript-eslint/no-explicit-any */

// ─── Types ───────────────────────────────────────────────────────────
interface AuditRequest {
  business_name: string;
  location: string;
  keyword?: string;
  website_url?: string;
}

// ─── DataForSEO Client ──────────────────────────────────────────────
const DFS_BASE = "https://api.dataforseo.com/v3";

function getDFSAuth(): string {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;
  if (!login || !password) throw new Error("DataForSEO credentials not configured");
  return "Basic " + Buffer.from(`${login}:${password}`).toString("base64");
}

async function callDFS(path: string, body: unknown[], timeoutMs = 7000): Promise<any> {
  const res = await fetch(`${DFS_BASE}${path}`, {
    method: "POST",
    headers: { Authorization: getDFSAuth(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const json = await res.json();
  if (json.status_code !== 20000) {
    console.error(`[DFS] ${path} error:`, json.status_message);
    return null;
  }
  const task = json.tasks?.[0];
  if (task && task.status_code !== 20000) {
    console.warn(`[DFS] ${path} task warning:`, task.status_code, task.status_message);
  }
  return json;
}

async function safeDFS(path: string, body: unknown[], timeoutMs = 7000): Promise<any> {
  try {
    return await callDFS(path, body, timeoutMs);
  } catch (e) {
    console.error(`[DFS] ${path} exception:`, e);
    return null;
  }
}

function dfsItems(response: any): any[] {
  try { return response?.tasks?.[0]?.result?.[0]?.items ?? []; } catch { return []; }
}

function dfsFirstItem(response: any): any {
  const items = dfsItems(response);
  return items.length > 0 ? items[0] : null;
}

// ─── Location Resolution ─────────────────────────────────────────────
// Hardcoded top cities to avoid 5s/67MB DFS locations API call
const LOCATION_CACHE: Record<string, number> = {
  "toronto,ontario":1002451,"toronto,on":1002451,"north york,ontario":1002451,"north york,on":1002451,
  "vancouver,british columbia":1002286,"vancouver,bc":1002286,"calgary,alberta":1002290,"calgary,ab":1002290,
  "edmonton,alberta":1002300,"edmonton,ab":1002300,"ottawa,ontario":1002443,"ottawa,on":1002443,
  "montreal,quebec":1002431,"montreal,qc":1002431,"winnipeg,manitoba":1002471,"winnipeg,mb":1002471,
  "mississauga,ontario":1002425,"mississauga,on":1002425,"brampton,ontario":1002287,"brampton,on":1002287,
  "hamilton,ontario":1002333,"hamilton,on":1002333,"london,ontario":1002396,"london,on":1002396,
  "new york,ny":1023191,"new york,new york":1023191,"los angeles,ca":1013962,"los angeles,california":1013962,
  "chicago,il":1016367,"chicago,illinois":1016367,"houston,tx":1026339,"houston,texas":1026339,
  "phoenix,az":1013211,"phoenix,arizona":1013211,"san diego,ca":1014003,"san diego,california":1014003,
  "dallas,tx":1026114,"dallas,texas":1026114,"denver,co":1014330,"denver,colorado":1014330,
  "austin,tx":1026015,"austin,texas":1026015,"miami,fl":1015116,"miami,florida":1015116,
  "atlanta,ga":1015254,"atlanta,georgia":1015254,"seattle,wa":1027744,"seattle,washington":1027744,
  "boston,ma":1018127,"boston,massachusetts":1018127,"san francisco,ca":1014006,"san francisco,california":1014006,
  "las vegas,nv":1021771,"las vegas,nevada":1021771,"portland,or":1024502,"portland,oregon":1024502,
  "detroit,mi":1018919,"detroit,michigan":1018919,"minneapolis,mn":1019270,"minneapolis,minnesota":1019270,
  "tampa,fl":1015196,"tampa,florida":1015196,"orlando,fl":1015150,"orlando,florida":1015150,
  "charlotte,nc":1022633,"charlotte,north carolina":1022633,"nashville,tn":1025891,"nashville,tennessee":1025891,
  "philadelphia,pa":1024442,"philadelphia,pennsylvania":1024442,
  "london,england":1006886,"london,uk":1006886,"manchester,england":1006924,"birmingham,england":1006680,
  "sydney,new south wales":9069243,"melbourne,victoria":9068949,
};

function resolveLocation(location: string): { code: number | null; name: string } {
  const normalized = location.toLowerCase().replace(/\s+/g, " ").trim();
  const key = normalized.replace(/\s*,\s*/g, ",");

  // Direct cache hit
  if (LOCATION_CACHE[key]) return { code: LOCATION_CACHE[key], name: location };

  // Try with just city + state abbreviation
  const parts = key.split(",");
  if (parts.length >= 2) {
    const cityState = `${parts[0].trim()},${parts[1].trim()}`;
    if (LOCATION_CACHE[cityState]) return { code: LOCATION_CACHE[cityState], name: location };
  }

  // Try matching city against all cached entries
  const city = parts[0]?.trim() ?? "";
  for (const [k, code] of Object.entries(LOCATION_CACHE)) {
    if (k.startsWith(city + ",")) return { code, name: location };
  }

  console.warn(`[audit] Location "${location}" not in cache, using location_name fallback`);
  return { code: null, name: location };
}

// ─── Business Finder ─────────────────────────────────────────────────
interface BusinessMatch { item: any; rank: number; found: boolean }

function findBusinessInMaps(mapsItems: any[], businessName: string): BusinessMatch {
  const normalized = businessName.toLowerCase().trim();
  const words = normalized.split(/\s+/).filter((w) => w.length > 2);

  for (const item of mapsItems) {
    const title = (item.title ?? "").toLowerCase().trim();
    if (title === normalized || title.includes(normalized) || normalized.includes(title) || levenshteinSimilarity(title, normalized) > 0.6) {
      return { item, rank: item.rank_group ?? 0, found: true };
    }
    const titleWords = title.split(/\s+/);
    const overlap = words.filter((w) => titleWords.some((tw: string) => tw === w || (tw.length > 4 && tw.includes(w)) || (w.length > 4 && w.includes(tw))));
    if (overlap.length >= 3 && overlap.length >= words.length * 0.75) {
      return { item, rank: item.rank_group ?? 0, found: true };
    }
    const domain = item.domain ?? "";
    if (domain && normalized.replace(/\s+/g, "").includes(domain.replace("www.", "").split(".")[0])) {
      return { item, rank: item.rank_group ?? 0, found: true };
    }
  }
  return { item: null, rank: 0, found: false };
}

function levenshteinSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  const la = a.length, lb = b.length;
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

// ─── Geo-Grid ────────────────────────────────────────────────────────
interface GeoGridPoint { lat: number; lng: number }
interface GeoGridResult { lat: number; lng: number; rank: number; found: boolean; topCompetitor: string }
interface GeoGridData {
  solv: number; avgRank: number;
  gridResults: GeoGridResult[];
  topCompetitors: Array<{ name: string; appearances: number }>;
}

function generateGeoGrid(centerLat: number, centerLng: number, spacingKm = 2): GeoGridPoint[] {
  const points: GeoGridPoint[] = [];
  const kmPerDegreeLat = 111.32;
  const kmPerDegreeLng = 111.32 * Math.cos((centerLat * Math.PI) / 180);
  const latStep = spacingKm / kmPerDegreeLat;
  const lngStep = spacingKm / kmPerDegreeLng;
  for (let row = -1; row <= 1; row++) {
    for (let col = -1; col <= 1; col++) {
      points.push({ lat: centerLat + row * latStep, lng: centerLng + col * lngStep });
    }
  }
  return points;
}

async function runGeoGrid(
  keyword: string, businessName: string,
  centerLat: number, centerLng: number,
  mapsLocationParam: Record<string, unknown>,
): Promise<GeoGridData> {
  const points = generateGeoGrid(centerLat, centerLng);
  const competitorCounts = new Map<string, number>();
  const results = await Promise.all(
    points.map(async (pt): Promise<GeoGridResult> => {
      const resp = await safeDFS("/serp/google/maps/live/advanced", [{
        keyword, ...mapsLocationParam, language_code: "en", depth: 20,
        gps_coordinates: { latitude: pt.lat, longitude: pt.lng, radius: 5000 },
      }], 45000);
      const items = dfsItems(resp);
      const match = findBusinessInMaps(items, businessName);
      let topComp = "";
      for (const item of items) {
        const t = (item.title ?? "").toLowerCase().trim();
        const n = businessName.toLowerCase().trim();
        if (t !== n && !t.includes(n) && !n.includes(t)) { topComp = item.title ?? ""; break; }
      }
      for (const item of items.slice(0, 3)) {
        const t = item.title ?? "";
        const tl = t.toLowerCase().trim();
        const nl = businessName.toLowerCase().trim();
        if (tl !== nl && !tl.includes(nl) && !nl.includes(tl)) {
          competitorCounts.set(t, (competitorCounts.get(t) ?? 0) + 1);
        }
      }
      return { lat: pt.lat, lng: pt.lng, rank: match.found ? match.rank : 0, found: match.found, topCompetitor: topComp };
    })
  );
  const foundPoints = results.filter((r) => r.found);
  const top3Points = results.filter((r) => r.found && r.rank <= 3);
  const solv = results.length > 0 ? top3Points.length / results.length : 0;
  const avgRank = foundPoints.length > 0 ? foundPoints.reduce((s, r) => s + r.rank, 0) / foundPoints.length : 0;
  const topCompetitors = Array.from(competitorCounts.entries())
    .map(([name, appearances]) => ({ name, appearances }))
    .sort((a, b) => b.appearances - a.appearances).slice(0, 5);
  return { solv, avgRank, gridResults: results, topCompetitors };
}

// ─── Google Reviews ──────────────────────────────────────────────────
interface ReviewItem { rating: number; text: string; time: string; hasReply: boolean }
interface ReviewsData {
  totalReviews: number; avgRating: number; replyRate: number; recentVelocity: number;
  ratingDistribution: Record<string, number>;
  topReviews: ReviewItem[];
}

// Build reviews data from Maps SERP business data (DFS Reviews API is async-only, too slow for real-time)
function buildReviewsFromMaps(biz: any): ReviewsData | null {
  if (!biz) return null;
  const totalReviews = biz.rating?.votes_count ?? 0;
  const avgRating = biz.rating?.value ?? 0;
  if (totalReviews === 0 && avgRating === 0) return null;
  return {
    totalReviews,
    avgRating,
    replyRate: 0, // Can't determine from Maps data
    recentVelocity: 0, // Can't determine from Maps data
    ratingDistribution: { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 },
    topReviews: [],
  };
}

// ─── PageSpeed Insights ──────────────────────────────────────────────
interface LighthouseData {
  seoScore: number; performanceScore: number; accessibilityScore: number; bestPracticesScore: number;
  lcp: number; cls: number; fcp: number; speedIndex: number; tbt: number;
}

async function fetchPageSpeed(url: string): Promise<LighthouseData | null> {
  try {
    const encoded = encodeURIComponent(url);
    const psiKey = process.env.GOOGLE_PSI_API_KEY;
    const keyParam = psiKey ? `&key=${psiKey}` : "";
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encoded}&category=seo&category=performance&category=accessibility&category=best-practices&strategy=mobile${keyParam}`;
    // Use 8s timeout — Vercel Hobby has 10s function limit, PSI typically takes 30-50s
    // On Pro plan this could be 60s but on Hobby it must fail fast to not block the audit
    const res = await fetch(apiUrl, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) { console.error("[PSI] HTTP", res.status); return null; }
    const json = await res.json();
    const lr = json.lighthouseResult;
    if (!lr) return null;
    const cats = lr.categories ?? {};
    const audits = lr.audits ?? {};
    return {
      seoScore: Math.round((cats.seo?.score ?? 0) * 100),
      performanceScore: Math.round((cats.performance?.score ?? 0) * 100),
      accessibilityScore: Math.round((cats.accessibility?.score ?? 0) * 100),
      bestPracticesScore: Math.round((cats["best-practices"]?.score ?? 0) * 100),
      lcp: audits["largest-contentful-paint"]?.numericValue ?? 0,
      cls: audits["cumulative-layout-shift"]?.numericValue ?? 0,
      fcp: audits["first-contentful-paint"]?.numericValue ?? 0,
      speedIndex: audits["speed-index"]?.numericValue ?? 0,
      tbt: audits["total-blocking-time"]?.numericValue ?? 0,
    };
  } catch (e) {
    console.error("[PSI] exception:", e);
    return null;
  }
}

// ─── Open PageRank ───────────────────────────────────────────────────
async function fetchPageRank(domain: string): Promise<number | null> {
  try {
    const oprKey = process.env.OPENPAGERANK_API_KEY;
    const headers: Record<string, string> = {};
    if (oprKey) headers["API-OPR"] = oprKey;
    const res = await fetch(`https://openpagerank.com/api/v1.0/getPageRank?domains[]=${encodeURIComponent(domain)}`, {
      signal: AbortSignal.timeout(10000),
      headers,
    });
    if (!res.ok) return null;
    const json = await res.json();
    const pr = json.response?.[0]?.page_rank_decimal;
    return typeof pr === "number" ? pr : null;
  } catch {
    return null;
  }
}

// ─── Website HTML Analysis ───────────────────────────────────────────
interface TechnicalData {
  hasHttps: boolean; hasRobotsTxt: boolean; hasSitemap: boolean;
  hasSchema: boolean; schemaTypes: string[];
  hasMetaDescription: boolean; hasH1: boolean;
  titleLength: number; descriptionLength: number;
  hasViewport: boolean; hasCanonical: boolean; hasNapOnSite: boolean;
  wordCount: number; internalLinks: number; externalLinks: number;
  imagesWithAlt: number; imagesWithoutAlt: number; hasGa4: boolean;
  titleTag: string; metaDescription: string; metaKeywords: string;
}

const BROWSER_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function analyzeWebsite(url: string, bizAddress: string, bizPhone: string): Promise<TechnicalData | null> {
  try {
    const fullUrl = url.startsWith("http") ? url : `https://${url}`;
    const origin = new URL(fullUrl).origin;
    const hostname = new URL(fullUrl).hostname;

    const [htmlRes, robotsRes, sitemapRes] = await Promise.allSettled([
      fetch(fullUrl, { headers: { "User-Agent": BROWSER_UA }, signal: AbortSignal.timeout(5000), redirect: "follow" }),
      fetch(`${origin}/robots.txt`, { headers: { "User-Agent": BROWSER_UA }, signal: AbortSignal.timeout(3000) }),
      fetch(`${origin}/sitemap.xml`, { headers: { "User-Agent": BROWSER_UA }, signal: AbortSignal.timeout(3000) }),
    ]);

    const html = htmlRes.status === "fulfilled" && htmlRes.value.ok ? await htmlRes.value.text() : "";
    if (!html) return null;

    const hasRobotsTxt = robotsRes.status === "fulfilled" && robotsRes.value.ok &&
      (await robotsRes.value.text().catch(() => "")).includes("User-agent");
    const hasSitemap = sitemapRes.status === "fulfilled" && sitemapRes.value.ok &&
      (await sitemapRes.value.text().catch(() => "")).includes("<urlset");

    const lower = html.toLowerCase();
    const hasHttps = fullUrl.startsWith("https");

    // Schema
    const schemaTypes: string[] = [];
    const schemaRegex = /<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let schemaMatch;
    while ((schemaMatch = schemaRegex.exec(html)) !== null) {
      try {
        const parsed = JSON.parse(schemaMatch[1]);
        const types = Array.isArray(parsed) ? parsed : [parsed];
        for (const t of types) {
          if (t["@type"]) schemaTypes.push(String(t["@type"]));
        }
      } catch { /* malformed JSON-LD */ }
    }

    // Meta
    const descMatch = html.match(/<meta[^>]+name\s*=\s*["']description["'][^>]+content\s*=\s*["']([^"']*)["']/i)
      ?? html.match(/<meta[^>]+content\s*=\s*["']([^"']*)["'][^>]+name\s*=\s*["']description["']/i);
    const descriptionLength = descMatch?.[1]?.length ?? 0;

    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const titleLength = titleMatch?.[1]?.trim().length ?? 0;

    const hasH1 = /<h1[\s>]/i.test(html);
    const hasViewport = /name\s*=\s*["']viewport["']/i.test(html);
    const hasCanonical = /rel\s*=\s*["']canonical["']/i.test(html);

    // GA4
    const hasGa4 = lower.includes("gtag") || lower.includes("googletagmanager") || lower.includes("ga4") || lower.includes("g-") && lower.includes("analytics");

    // Links — simple regex-based count
    const linkRegex = /<a[^>]+href\s*=\s*["']([^"'#]+)["']/gi;
    let internalLinks = 0, externalLinks = 0;
    let linkMatch;
    while ((linkMatch = linkRegex.exec(html)) !== null) {
      const href = linkMatch[1];
      if (href.startsWith("/") || href.includes(hostname)) internalLinks++;
      else if (href.startsWith("http")) externalLinks++;
    }

    // Images
    const imgRegex = /<img\b([^>]*)>/gi;
    let imagesWithAlt = 0, imagesWithoutAlt = 0;
    let imgMatch;
    while ((imgMatch = imgRegex.exec(html)) !== null) {
      if (/alt\s*=\s*["'][^"']+["']/i.test(imgMatch[1])) imagesWithAlt++;
      else imagesWithoutAlt++;
    }

    // Word count — strip tags, count
    const textContent = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ").trim();
    const wordCount = textContent.split(/\s+/).filter((w) => w.length > 0).length;

    // NAP on site
    const normalText = textContent.toLowerCase();
    const hasNapOnSite = !!(
      bizPhone && normalText.includes(bizPhone.replace(/\D/g, "").slice(-10)) ||
      bizAddress && bizAddress.split(",")[0] && normalText.includes(bizAddress.split(",")[0].toLowerCase().trim())
    );

    // Extract meta keywords if present
    const metaKwMatch = html.match(/<meta[^>]+name\s*=\s*["']keywords["'][^>]+content\s*=\s*["']([^"']*)["']/i)
      ?? html.match(/<meta[^>]+content\s*=\s*["']([^"']*)["'][^>]+name\s*=\s*["']keywords["']/i);

    return {
      hasHttps, hasRobotsTxt, hasSitemap,
      hasSchema: schemaTypes.length > 0, schemaTypes,
      hasMetaDescription: descriptionLength > 0, hasH1,
      titleLength, descriptionLength,
      hasViewport, hasCanonical, hasNapOnSite,
      wordCount, internalLinks, externalLinks,
      imagesWithAlt, imagesWithoutAlt, hasGa4,
      titleTag: titleMatch?.[1]?.trim() ?? "",
      metaDescription: descMatch?.[1] ?? "",
      metaKeywords: metaKwMatch?.[1] ?? "",
    };
  } catch (e) {
    console.error("[HTML] exception:", e);
    return null;
  }
}

// ─── Directory Presence Checker ──────────────────────────────────────
interface DirectoryResult {
  name: string; url: string; found: boolean | null; napCorrect: boolean | null; claimed: boolean | null;
}

async function checkDirectories(
  businessName: string, location: string, bizAddress: string, bizPhone: string,
): Promise<DirectoryResult[]> {
  const city = location.split(",")[0]?.trim() ?? location;
  const enc = (s: string) => encodeURIComponent(s);
  const dirs: Array<{ name: string; url: string }> = [
    { name: "Google", url: "" }, // Already have from Maps
    { name: "Yelp", url: `https://www.yelp.com/search?find_desc=${enc(businessName)}&find_loc=${enc(location)}` },
    { name: "Facebook", url: `https://www.facebook.com/search/pages/?q=${enc(businessName + " " + city)}` },
    { name: "Bing Places", url: `https://www.bing.com/maps?q=${enc(businessName + " " + location)}` },
    { name: "Yellow Pages", url: `https://www.yellowpages.com/search?search_terms=${enc(businessName)}&geo_location_terms=${enc(location)}` },
    { name: "BBB", url: `https://www.bbb.org/search?find_text=${enc(businessName)}&find_loc=${enc(location)}` },
    { name: "Apple Maps", url: "" }, // No web interface
    { name: "Foursquare", url: `https://foursquare.com/explore?near=${enc(location)}&q=${enc(businessName)}` },
    { name: "TripAdvisor", url: `https://www.tripadvisor.com/Search?q=${enc(businessName + " " + city)}` },
    { name: "Hotfrog", url: `https://www.hotfrog.com/search/${enc(location)}/${enc(businessName)}` },
    { name: "Manta", url: `https://www.manta.com/search?search=${enc(businessName)}&search_location=${enc(location)}` },
    { name: "MapQuest", url: `https://www.mapquest.com/search/${enc(businessName + " " + location)}` },
    { name: "Cylex", url: `https://www.cylex.us.com/s?q=${enc(businessName)}&where=${enc(location)}` },
    { name: "Superpages", url: `https://www.superpages.com/search?search_terms=${enc(businessName)}&geo_location_terms=${enc(location)}` },
    { name: "411.ca", url: `https://411.ca/search/?q=${enc(businessName)}&loc=${enc(location)}` },
  ];

  const nameLower = businessName.toLowerCase();
  const phoneLast10 = bizPhone.replace(/\D/g, "").slice(-10);

  const results = await Promise.allSettled(
    dirs.map(async (dir): Promise<DirectoryResult> => {
      if (!dir.url) {
        // Google (already found via Maps) or Apple Maps (no web interface)
        if (dir.name === "Google") return { name: dir.name, url: "", found: true, napCorrect: true, claimed: null };
        return { name: dir.name, url: "", found: null, napCorrect: null, claimed: null };
      }
      try {
        const res = await fetch(dir.url, {
          headers: { "User-Agent": BROWSER_UA },
          signal: AbortSignal.timeout(3000),
          redirect: "follow",
        });
        if (!res.ok) return { name: dir.name, url: dir.url, found: null, napCorrect: null, claimed: null };
        const html = await res.text();
        const lower = html.toLowerCase();
        const found = lower.includes(nameLower);
        let napCorrect: boolean | null = null;
        if (found) {
          const hasPhone = phoneLast10 ? lower.includes(phoneLast10) : false;
          const hasAddr = bizAddress ? lower.includes(bizAddress.split(",")[0]?.toLowerCase().trim() ?? "") : false;
          napCorrect = hasPhone || hasAddr;
        }
        return { name: dir.name, url: dir.url, found, napCorrect: found ? napCorrect : null, claimed: null };
      } catch {
        return { name: dir.name, url: dir.url, found: null, napCorrect: null, claimed: null };
      }
    })
  );

  return results.map((r) => r.status === "fulfilled" ? r.value : { name: "Unknown", url: "", found: null, napCorrect: null, claimed: null });
}

// ─── Indexed Pages (site: query) ─────────────────────────────────────
async function fetchIndexedPages(domain: string, locationParam: Record<string, unknown>): Promise<number | null> {
  const resp = await safeDFS("/serp/google/organic/live/advanced", [{
    keyword: `site:${domain}`,
    ...locationParam,
    language_code: "en",
    depth: 10,
  }]);
  if (!resp) return null;
  const result = resp?.tasks?.[0]?.result?.[0];
  return result?.items_count ?? result?.se_results_count ?? null;
}

// ─── Keyword Discovery ─────────────────────────────────────────────
// When SoLV=0 for the target keyword, extract keyword candidates from GBP + website
// and check which ones the business actually ranks for in the local pack
interface KeywordDiscoveryResult {
  keyword: string;
  source: string; // 'category' | 'service' | 'meta' | 'title'
  found: boolean;
  rank: number;
}

function extractKeywordCandidates(
  biz: any, technical: TechnicalData | null, originalKeyword: string, city: string,
): Array<{ keyword: string; source: string }> {
  const candidates: Array<{ keyword: string; source: string }> = [];
  const seen = new Set<string>();
  const origLower = originalKeyword.toLowerCase();
  seen.add(origLower);

  const addCandidate = (kw: string, source: string) => {
    const normalized = kw.toLowerCase().trim();
    if (normalized.length < 3 || normalized.length > 60 || seen.has(normalized)) return;
    seen.add(normalized);
    candidates.push({ keyword: `${kw} ${city}`, source });
  };

  // 1. GBP primary category
  if (biz?.category) addCandidate(biz.category, "category");

  // 2. GBP additional categories
  for (const cat of (biz?.additional_categories ?? [])) {
    const catStr = typeof cat === "string" ? cat : cat?.type ?? "";
    if (catStr) addCandidate(catStr, "category");
  }

  // 3. Website title keywords (extract meaningful phrases)
  if (technical?.titleTag) {
    const title = technical.titleTag;
    // Split on common separators and take meaningful phrases
    const parts = title.split(/[|\-\u2013\u2014,]/).map((p: string) => p.trim()).filter((p: string) => p.length > 3 && p.length < 40);
    for (const part of parts.slice(0, 3)) {
      // Skip if it's just the business name
      if (part.toLowerCase() !== (biz?.title ?? "").toLowerCase()) {
        addCandidate(part, "title");
      }
    }
  }

  // 4. Meta description keywords (extract first phrase)
  if (technical?.metaDescription) {
    const desc = technical.metaDescription;
    const firstSentence = desc.split(/[.!?]/)[0]?.trim();
    if (firstSentence && firstSentence.length > 10 && firstSentence.length < 60) {
      addCandidate(firstSentence, "meta");
    }
  }

  // 5. Meta keywords (if present)
  if (technical?.metaKeywords) {
    const mkws = technical.metaKeywords.split(",").map((k: string) => k.trim()).filter((k: string) => k.length > 2);
    for (const mkw of mkws.slice(0, 5)) {
      addCandidate(mkw, "meta");
    }
  }

  return candidates.slice(0, 5); // Check max 5 keywords (~$0.01)
}

async function discoverRankableKeywords(
  candidates: Array<{ keyword: string; source: string }>,
  businessName: string,
  mapsLocationParam: Record<string, unknown>,
): Promise<KeywordDiscoveryResult[]> {
  if (candidates.length === 0) return [];

  const results = await Promise.allSettled(
    candidates.map(async (c): Promise<KeywordDiscoveryResult> => {
      const resp = await safeDFS("/serp/google/maps/live/advanced", [{
        keyword: c.keyword, ...mapsLocationParam, language_code: "en", depth: 20,
      }]);
      const items = dfsItems(resp);
      const match = findBusinessInMaps(items, businessName);
      return {
        keyword: c.keyword,
        source: c.source,
        found: match.found,
        rank: match.found ? match.rank : 0,
      };
    })
  );

  return results
    .filter((r): r is PromiseFulfilledResult<KeywordDiscoveryResult> => r.status === "fulfilled")
    .map((r) => r.value);
}

// ─── Competitor Keyword Gap ──────────────────────────────────────────
async function fetchCompetitorKeywords(
  domain: string, locationCode: number,
): Promise<Array<{ keyword: string; position: number; searchVolume: number; url: string }>> {
  const resp = await safeDFS("/dataforseo_labs/google/ranked_keywords/live", [{
    target: domain,
    location_code: locationCode,
    language_code: "en",
    limit: 50,
    order_by: ["ranked_serp_element.serp_item.rank_group,asc"],
  }]);
  if (!resp) return [];
  const items: any[] = resp?.tasks?.[0]?.result?.[0]?.items ?? [];
  return items.map((it: any) => {
    const kd = it.keyword_data ?? {};
    const ki = kd.keyword_info ?? {};
    const serp = it.ranked_serp_element?.serp_item ?? {};
    return {
      keyword: kd.keyword ?? "",
      position: serp.rank_group ?? 0,
      searchVolume: ki.search_volume ?? 0,
      url: serp.relative_url ?? "",
    };
  });
}

// ─── LocalSEOData Client (fallback) ─────────────────────────────────
const LSEO_BASE = "https://api.localseodata.com";

async function callLSEO(path: string, body: Record<string, unknown>): Promise<any> {
  const key = process.env.LOCALSEODATA_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(`${LSEO_BASE}${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(20000),
    });
    const json = await res.json();
    if (json.status === "error") { console.error(`[LSEO] ${path} error:`, json.error); return null; }
    return json;
  } catch (e) {
    console.error(`[LSEO] ${path} exception:`, e);
    return null;
  }
}

// ─── Scoring & Grading ──────────────────────────────────────────────
function clamp(n: number): number { return Math.max(0, Math.min(100, Math.round(n))); }

function grade(score: number): string {
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 85) return "A-";
  if (score >= 80) return "B+";
  if (score >= 75) return "B";
  if (score >= 70) return "B-";
  if (score >= 65) return "C+";
  if (score >= 60) return "C";
  if (score >= 55) return "C-";
  if (score >= 50) return "D+";
  if (score >= 45) return "D";
  if (score >= 40) return "D-";
  return "F";
}

function status(score: number): "good" | "ok" | "poor" {
  if (score >= 70) return "good";
  if (score >= 40) return "ok";
  return "poor";
}

// ─── Report Builder ──────────────────────────────────────────────────
function buildReport(
  businessMatch: BusinessMatch,
  mapsItems: any[],
  geoGrid: GeoGridData | null,
  reviewsData: ReviewsData | null,
  lighthouse: LighthouseData | null,
  technical: TechnicalData | null,
  pageRank: number | null,
  indexedPages: number | null,
  directories: DirectoryResult[],
  ownKeywords: Array<{ keyword: string; position: number; searchVolume: number; url: string }>,
  ownKeywordsTotal: number,
  ownETV: number,
  competitorKeywordSets: Array<{ name: string; domain: string; keywords: Array<{ keyword: string; position: number; searchVolume: number; url: string }> }>,
  competitorPageRanks: Array<{ name: string; domain: string; pageRank: number | null }>,
  request: AuditRequest,
  loc: { code: number | null; name: string },
) {
  const biz = businessMatch.item;

  // ── Rankings section ─────────────────────────────────────────────
  const organicKws = ownKeywords.length > 0 ? {
    total: ownKeywordsTotal,
    top10: ownKeywords.filter((k) => k.position <= 10).length,
    top20: ownKeywords.filter((k) => k.position <= 20).length,
    estimatedTraffic: ownETV,
    keywords: ownKeywords.slice(0, 30),
  } : null;

  const rankingsScore = geoGrid ? clamp(geoGrid.solv * 100) : 0;

  // ── Listings section ─────────────────────────────────────────────
  // Filter out unknowns (null = directory blocked us, don't penalize)
  const knownDirs = directories.filter((d) => d.found !== null);
  const foundDirs = knownDirs.filter((d) => d.found === true);
  const napConsistentDirs = foundDirs.filter((d) => d.napCorrect === true);
  const napErrorDirs = foundDirs.filter((d) => d.napCorrect === false);
  const notFoundDirs = knownDirs.filter((d) => d.found === false);

  const listingsScore = knownDirs.length > 0
    ? clamp((foundDirs.length / knownDirs.length) * (napConsistentDirs.length > 0 ? napConsistentDirs.length / Math.max(foundDirs.length, 1) : 1) * 100)
    : 0;

  // ── Reviews section ──────────────────────────────────────────────
  const topCompReviews = mapsItems
    .filter((c) => c !== biz)
    .reduce((max, c) => Math.max(max, c.rating?.votes_count ?? 0), 0);

  let reviewsScore = 0;
  if (reviewsData && reviewsData.totalReviews > 0) {
    const ratingPart = (reviewsData.avgRating / 5) * 30;
    const countPart = Math.min(reviewsData.totalReviews / Math.max(topCompReviews, 50), 1) * 25;
    const replyPart = reviewsData.replyRate * 25;
    const velocityPart = Math.min(reviewsData.recentVelocity / 10, 1) * 20;
    reviewsScore = clamp(ratingPart + countPart + replyPart + velocityPart);
  } else if (biz?.rating?.value) {
    const r = biz.rating.value;
    const c = biz.rating.votes_count ?? 0;
    reviewsScore = clamp((r / 5) * 30 + Math.min(c / 100, 1) * 25);
  }

  // ── GBP Profile section ──────────────────────────────────────────
  const gbpBiz = biz ? {
    name: biz.title ?? "",
    address: biz.address ?? (biz.address_info ? `${biz.address_info.address}, ${biz.address_info.city}` : ""),
    phone: biz.phone ?? "",
    website: biz.url ?? biz.domain ?? "",
    category: biz.category ?? "",
    additionalCategories: (biz.additional_categories ?? []).map((c: any) => typeof c === "string" ? c : c.type ?? ""),
    rating: biz.rating?.value ?? 0,
    reviewCount: biz.rating?.votes_count ?? 0,
    totalPhotos: biz.total_photos ?? 0,
    isClaimed: biz.is_claimed ?? false,
    hasHours: !!(biz.work_time?.timetable ?? biz.work_time?.work_hours?.timetable),
    hasDescription: !!(biz.description && biz.description.length > 0),
    descriptionLength: biz.description?.length ?? 0,
  } : null;

  const gbpFields = gbpBiz ? [
    gbpBiz.name, gbpBiz.address, gbpBiz.phone, gbpBiz.website, gbpBiz.category,
    gbpBiz.additionalCategories.length > 0, gbpBiz.totalPhotos > 0, gbpBiz.isClaimed,
    gbpBiz.hasHours, gbpBiz.hasDescription, gbpBiz.reviewCount > 0,
  ] : [];
  const gbpScore = gbpFields.length > 0 ? clamp((gbpFields.filter(Boolean).length / gbpFields.length) * 100) : 0;

  const competitors = mapsItems
    .filter((item: any) => item !== biz)
    .slice(0, 5)
    .map((c: any) => ({
      name: c.title ?? "Unknown",
      rank: c.rank_group ?? 0,
      rating: c.rating?.value ?? 0,
      reviewCount: c.rating?.votes_count ?? 0,
      totalPhotos: c.total_photos ?? 0,
      category: c.category ?? "",
      isClaimed: c.is_claimed ?? false,
    }));

  // ── On-Site SEO section ──────────────────────────────────────────
  // On-Site SEO: use Lighthouse if available, otherwise compute from our own HTML analysis
  let onSiteScore = 0;
  if (lighthouse) {
    onSiteScore = lighthouse.seoScore;
  } else if (technical) {
    // Compute score from 12 technical checks (each worth ~8 points)
    const checks = [
      technical.hasHttps,           // HTTPS
      technical.hasMetaDescription, // Meta description
      technical.hasH1,              // H1 tag
      technical.hasSchema,          // Schema markup
      technical.hasViewport,        // Mobile viewport
      technical.hasCanonical,       // Canonical tag
      technical.hasRobotsTxt,       // robots.txt
      technical.hasSitemap,         // Sitemap
      technical.hasNapOnSite,       // NAP on website
      technical.hasGa4,             // Analytics installed
      technical.titleLength > 0 && technical.titleLength <= 60,  // Title tag present & right length
      technical.imagesWithAlt >= technical.imagesWithoutAlt,      // More images with alt than without
    ];
    const passed = checks.filter(Boolean).length;
    onSiteScore = clamp(Math.round((passed / checks.length) * 100));
  }

  // ── Authority section ────────────────────────────────────────────
  const competitorComparison = competitorKeywordSets.map((cs, i) => ({
    name: cs.name,
    domain: cs.domain,
    pageRank: competitorPageRanks[i]?.pageRank ?? null,
    rankedKeywords: cs.keywords.length,
    estimatedTraffic: 0, // We don't get ETV for competitors in this flow
  }));

  let authorityScore = 0;
  if (pageRank !== null) authorityScore += (pageRank / 10) * 40;
  if (indexedPages !== null && indexedPages > 0) authorityScore += Math.min(indexedPages / 500, 1) * 30;
  if (ownKeywordsTotal > 0) authorityScore += Math.min(ownKeywordsTotal / 100, 1) * 30;
  authorityScore = clamp(authorityScore);

  // ── Opportunities section ────────────────────────────────────────
  const topComp = competitors[0];
  const opportunities = buildOpportunities(
    gbpBiz, topComp, reviewsData, lighthouse, technical, ownKeywords,
    competitorKeywordSets, directories,
  );

  // ── Overall Score ────────────────────────────────────────────────
  // Only average sections that have real data — don't let nulls drag score to 0
  const scoredSections: Array<{ score: number; weight: number }> = [];
  scoredSections.push({ score: rankingsScore, weight: 0.20 });
  if (knownDirs.length > 0) scoredSections.push({ score: listingsScore, weight: 0.15 });
  if (reviewsScore > 0) scoredSections.push({ score: reviewsScore, weight: 0.20 });
  scoredSections.push({ score: gbpScore, weight: 0.15 });
  if (onSiteScore > 0) scoredSections.push({ score: onSiteScore, weight: 0.15 });
  if (authorityScore > 0 || pageRank !== null || indexedPages !== null) scoredSections.push({ score: authorityScore, weight: 0.15 });

  // Normalize weights to sum to 1.0
  const totalWeight = scoredSections.reduce((s, sec) => s + sec.weight, 0);
  const overallScore = clamp(
    scoredSections.reduce((s, sec) => s + sec.score * (sec.weight / totalWeight), 0)
  );

  const sections = [
    { name: "Rankings", status: status(rankingsScore), score: rankingsScore },
    { name: "Listings", status: status(listingsScore), score: listingsScore },
    { name: "Reviews", status: status(reviewsScore), score: reviewsScore },
    { name: "GBP Profile", status: status(gbpScore), score: gbpScore },
    { name: "On-Site SEO", status: status(onSiteScore), score: onSiteScore },
    { name: "Authority", status: status(authorityScore), score: authorityScore },
  ] as Array<{ name: string; status: "good" | "ok" | "poor"; score: number }>;

  return {
    summary: { overallScore, grade: grade(overallScore), sections },
    rankings: { geoGrid, organicKeywords: organicKws },
    listings: {
      found: foundDirs.length,
      notFound: notFoundDirs.length,
      napConsistent: napConsistentDirs.length,
      napErrors: napErrorDirs.length,
      directories: knownDirs, // Only return directories where we got a definitive answer
    },
    reviews: reviewsData,
    gbpProfile: { business: gbpBiz, competitors },
    onSiteSeo: { lighthouse, technical },
    authority: {
      pageRank,
      indexedPages,
      domainAge: null,
      rankedKeywords: ownKeywordsTotal,
      estimatedTraffic: ownETV,
      competitorComparison,
    },
    opportunities,
    meta: {
      businessName: request.business_name,
      location: request.location,
      keyword: request.keyword || request.business_name,
      websiteUrl: request.website_url || null,
      auditDate: new Date().toISOString(),
      dataSources: {
        maps: !!businessMatch.found,
        geoGrid: !!geoGrid,
        reviews: !!reviewsData,
        lighthouse: !!lighthouse,
        pageRank: pageRank !== null,
        technical: !!technical,
        directories: directories.length > 0,
        indexedPages: indexedPages !== null,
        competitorKeywords: competitorKeywordSets.length > 0,
        rankedKeywords: ownKeywords.length > 0,
      },
      estimatedCost: 0,
    },
  };
}

// ─── Opportunities Builder ───────────────────────────────────────────
function buildOpportunities(
  gbpBiz: any, topComp: any,
  reviewsData: ReviewsData | null,
  lighthouse: LighthouseData | null,
  technical: TechnicalData | null,
  ownKeywords: Array<{ keyword: string; position: number; searchVolume: number; url: string }>,
  competitorKeywordSets: Array<{ name: string; domain: string; keywords: Array<{ keyword: string; position: number; searchVolume: number; url: string }> }>,
  directories: DirectoryResult[],
) {
  const opps: Record<string, any> = {};

  // Review gap
  if (gbpBiz && topComp) {
    const yours = gbpBiz.reviewCount;
    const theirs = topComp.reviewCount ?? 0;
    if (theirs > yours) {
      opps.reviewGap = {
        yours, topCompetitor: theirs, gap: theirs - yours,
        action: `You need ${theirs - yours} more reviews to match ${topComp.name}. Implement a review request workflow.`,
      };
    }
  }

  // Photo gap
  if (gbpBiz && topComp) {
    const yours = gbpBiz.totalPhotos;
    const theirs = topComp.totalPhotos ?? 0;
    if (theirs > yours) {
      opps.photoGap = {
        yours, topCompetitor: theirs, gap: theirs - yours,
        action: `Add ${theirs - yours} more photos to your GBP. Businesses with 100+ photos get 520% more calls.`,
      };
    }
  }

  // Category gap
  if (gbpBiz && competitors_have_categories(topComp)) {
    const yours = 1 + gbpBiz.additionalCategories.length;
    const theirs = 1 + (topComp.category ? 1 : 0); // Rough estimate
    if (theirs > yours) {
      opps.categoryGap = {
        yours, topCompetitor: theirs, missing: [],
        action: "Add additional categories to your GBP to match competitors and capture more search queries.",
      };
    }
  }

  // Keyword gap
  if (competitorKeywordSets.length > 0 && ownKeywords.length > 0) {
    const ownSet = new Set(ownKeywords.map((k) => k.keyword.toLowerCase()));
    const missing: Array<{ keyword: string; volume: number; competitorPosition: number }> = [];
    for (const cs of competitorKeywordSets) {
      for (const ck of cs.keywords) {
        if (!ownSet.has(ck.keyword.toLowerCase()) && ck.searchVolume > 0) {
          if (!missing.some((m) => m.keyword === ck.keyword)) {
            missing.push({ keyword: ck.keyword, volume: ck.searchVolume, competitorPosition: ck.position });
          }
        }
      }
    }
    missing.sort((a, b) => b.volume - a.volume);
    if (missing.length > 0) {
      opps.keywordGap = {
        yours: ownKeywords.length,
        topCompetitor: competitorKeywordSets[0]?.keywords.length ?? 0,
        gap: missing.length,
        missingKeywords: missing.slice(0, 10),
        action: `${missing.length} keywords your competitors rank for that you don't. Create content targeting the highest-volume opportunities.`,
      };
    }
  }

  // Reply rate gap
  if (reviewsData) {
    const yours = reviewsData.replyRate;
    if (yours < 0.8) {
      opps.replyRateGap = {
        yours: Math.round(yours * 100), topCompetitor: 80,
        action: `Increase your reply rate from ${Math.round(yours * 100)}% to 80%+. Responding to reviews signals active management.`,
      };
    }
  }

  // Speed gap
  if (lighthouse && lighthouse.lcp > 2500) {
    opps.speedGap = {
      yours: Math.round(lighthouse.lcp), topCompetitor: 2500,
      action: `Your LCP is ${(lighthouse.lcp / 1000).toFixed(1)}s — should be under 2.5s. Optimize images, reduce render-blocking resources.`,
    };
  }

  // Schema gap
  if (technical && !technical.hasSchema) {
    opps.schemaGap = {
      hasSchema: false,
      action: "Add LocalBusiness JSON-LD schema to your homepage. This helps Google understand your business details.",
    };
  } else if (technical && !technical.schemaTypes.some((t) => t.toLowerCase().includes("localbusiness"))) {
    opps.schemaGap = {
      hasSchema: true,
      action: "You have schema markup but not LocalBusiness type. Add LocalBusiness schema for better local SEO.",
    };
  }

  // Listing gap
  const missingDirs = directories.filter((d) => d.found === false).map((d) => d.name);
  if (missingDirs.length > 0) {
    opps.listingGap = {
      missing: missingDirs,
      action: `You're missing from ${missingDirs.length} directories: ${missingDirs.slice(0, 5).join(", ")}. Submit your business to improve citation coverage.`,
    };
  }

  return {
    reviewGap: opps.reviewGap ?? null,
    photoGap: opps.photoGap ?? null,
    categoryGap: opps.categoryGap ?? null,
    keywordGap: opps.keywordGap ?? null,
    replyRateGap: opps.replyRateGap ?? null,
    speedGap: opps.speedGap ?? null,
    schemaGap: opps.schemaGap ?? null,
    listingGap: opps.listingGap ?? null,
  };
}

function competitors_have_categories(comp: any): boolean {
  return !!(comp?.category);
}

// ─── Route Handler ───────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body: AuditRequest = await request.json();
    if (!body.business_name || !body.location) {
      return NextResponse.json({ error: "business_name and location are required" }, { status: 400 });
    }

    const { business_name, location, keyword, website_url } = body;
    const kw = keyword || business_name;
    const city = location.split(",")[0]?.trim() ?? location;

    console.log(`[audit] Starting audit for "${business_name}" in "${location}" (keyword: "${kw}")`);

    // ─── Step 1: Resolve location ───────────────────────────────────
    const loc = resolveLocation(location);
    console.log(`[audit] Resolved location: ${loc.name} (code: ${loc.code})`);

    const mapsLocationParam = loc.code ? { location_code: loc.code } : { location_name: loc.name };
    const locationCode = loc.code ?? 2840;

    // ─── Wave 1: Core discovery (parallel) ──────────────────────────
    const domain = website_url ? website_url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "") : null;
    const fullUrl = website_url ? (website_url.startsWith("http") ? website_url : `https://${website_url}`) : null;

    const wave1: Promise<any>[] = [
      // 1. Maps SERP — name search
      safeDFS("/serp/google/maps/live/advanced", [{
        keyword: business_name, ...mapsLocationParam, language_code: "en", depth: 20,
      }]),
      // 2. Ranked Keywords (if website)
      domain
        ? safeDFS("/dataforseo_labs/google/ranked_keywords/live", [{
            target: domain, location_code: locationCode, language_code: "en",
            limit: 50, order_by: ["ranked_serp_element.serp_item.rank_group,asc"],
          }])
        : Promise.resolve(null),
      // 3. PageSpeed Insights — DISABLED: takes 30-50s, exceeds Vercel Hobby 10s limit
      // Enable when on Vercel Pro or Railway. Score computed from technical checks instead.
      Promise.resolve(null),
      // 4. Open PageRank (if website)
      domain ? fetchPageRank(domain) : Promise.resolve(null),
    ];

    const [mapsNameData, rankedKwData, lighthouseData, pageRankData] = await Promise.all(wave1);

    // Find business in Maps results
    const mapsNameItems = dfsItems(mapsNameData);
    const nameMatch = findBusinessInMaps(mapsNameItems, business_name);
    const businessMatch: BusinessMatch = nameMatch.found
      ? nameMatch
      : { item: null, rank: 0, found: false };

    const biz = businessMatch.item;
    const hasGPS = biz?.latitude && biz?.longitude;
    const bizAddress = biz?.address ?? (biz?.address_info ? `${biz.address_info.address ?? ""}, ${biz.address_info.city ?? ""}` : "");
    const bizPhone = biz?.phone ?? "";

    console.log(`[audit] Maps: ${mapsNameItems.length} results. Business found: ${businessMatch.found}`);

    // Parse ranked keywords
    const rkResult = rankedKwData?.tasks?.[0]?.result?.[0];
    const ownKeywords: Array<{ keyword: string; position: number; searchVolume: number; url: string }> =
      (rkResult?.items ?? []).map((it: any) => {
        const kd = it.keyword_data ?? {};
        const ki = kd.keyword_info ?? {};
        const serp = it.ranked_serp_element?.serp_item ?? {};
        return { keyword: kd.keyword ?? "", position: serp.rank_group ?? 0, searchVolume: ki.search_volume ?? 0, url: serp.relative_url ?? "" };
      });
    const ownKeywordsTotal = rkResult?.total_count ?? 0;
    const ownETV = rkResult?.metrics?.organic?.etv ?? 0;

    // ─── Extract keyword candidates from GBP data (available now, no extra call) ───
    // Combine: user-provided keyword + GBP categories + additional categories
    // We'll check these in parallel with everything else in Wave 2
    const kwCandidates: Array<{ keyword: string; source: string }> = [];
    if (businessMatch.found) {
      const seen = new Set<string>();
      seen.add(kw.toLowerCase());
      const addKw = (k: string, src: string) => {
        const norm = k.toLowerCase().trim();
        if (norm.length < 3 || norm.length > 50 || seen.has(norm)) return;
        seen.add(norm);
        kwCandidates.push({ keyword: `${k} ${city}`, source: src });
      };
      if (biz?.category) addKw(biz.category, "category");
      for (const cat of (biz?.additional_categories ?? [])) {
        const cs = typeof cat === "string" ? cat : cat?.type ?? "";
        if (cs) addKw(cs, "category");
      }
      // Also add the user keyword + city variant if different
      if (keyword && keyword.toLowerCase() !== business_name.toLowerCase()) {
        addKw(keyword, "user");
      }
    }
    const kwsToCheck = kwCandidates.slice(0, 5);
    console.log(`[audit] Keyword candidates: ${kwsToCheck.length} (${kwsToCheck.map(k => k.keyword).join(", ")})`);

    // ─── Wave 2: Geo-grid + Reviews + Indexing + Dirs + HTML + Keyword Discovery ───
    // All in parallel — one wave, no sequential steps
    const wave2: Promise<any>[] = [
      // 5. Geo-grid (if GPS)
      hasGPS
        ? runGeoGrid(`${kw} ${city}`, business_name, biz.latitude, biz.longitude, mapsLocationParam)
            .catch((e) => { console.error("[audit] Geo-grid error:", e); return null; })
        : Promise.resolve(null),
      // 6. Reviews from Maps data (sync — no API call needed)
      Promise.resolve(buildReviewsFromMaps(biz)),
      // 7. Indexed pages (if website)
      domain ? fetchIndexedPages(domain, mapsLocationParam).catch(() => null) : Promise.resolve(null),
      // 8. Directory presence
      checkDirectories(business_name, location, bizAddress, bizPhone),
      // 9. Website HTML analysis (if website)
      fullUrl ? analyzeWebsite(fullUrl, bizAddress, bizPhone).catch(() => null) : Promise.resolve(null),
      // 10. Keyword discovery — check each candidate in Maps (parallel within parallel)
      kwsToCheck.length > 0
        ? discoverRankableKeywords(kwsToCheck, business_name, mapsLocationParam).catch(() => [])
        : Promise.resolve([]),
    ];

    const [geoGridData, reviewsApiData, indexedPages, directories, technicalData, initialKeywordDiscovery] =
      await Promise.all(wave2) as [GeoGridData | null, ReviewsData | null, number | null, DirectoryResult[], TechnicalData | null, KeywordDiscoveryResult[]];
    let keywordDiscovery = initialKeywordDiscovery;

    // ─── Wave 2.5: Extra keyword discovery from website + competitor data ───
    // If initial keyword discovery found nothing, try more sources now that we have technical data
    const initialKwFound = keywordDiscovery.some((k) => k.found);
    if (!initialKwFound && businessMatch.found) {
      const extraCandidates: Array<{ keyword: string; source: string }> = [];
      const seenKws = new Set(kwsToCheck.map((k) => k.keyword.toLowerCase()));
      seenKws.add(kw.toLowerCase());

      const addExtra = (k: string, src: string) => {
        const norm = k.toLowerCase().trim();
        if (norm.length < 3 || norm.length > 50 || seenKws.has(norm)) return;
        seenKws.add(norm);
        extraCandidates.push({ keyword: `${k} ${city}`, source: src });
      };

      // Website title keywords
      if (technicalData?.titleTag) {
        const parts = technicalData.titleTag.split(/[|\-\u2013\u2014,]/).map((p: string) => p.trim()).filter((p: string) => p.length > 3 && p.length < 40);
        for (const part of parts.slice(0, 3)) {
          if (part.toLowerCase() !== (biz?.title ?? "").toLowerCase()) addExtra(part, "website");
        }
      }

      // Meta description first phrase
      if (technicalData?.metaDescription) {
        const first = technicalData.metaDescription.split(/[.!?]/)[0]?.trim();
        if (first && first.length > 10 && first.length < 50) addExtra(first, "meta");
      }

      // Competitor categories from geo-grid (these businesses ARE ranking)
      if (geoGridData?.topCompetitors) {
        // The competitor names often contain service keywords
        for (const comp of geoGridData.topCompetitors.slice(0, 3)) {
          // Extract service type from competitor name (e.g. "Website Developer and Designer in Toronto" -> "Website Developer")
          const name = comp.name.replace(/ in .*$/i, "").replace(/ (?:of|for|near) .*$/i, "").trim();
          if (name.length > 3 && name.length < 40) addExtra(name, "competitor");
        }
      }

      const extraToCheck = extraCandidates.slice(0, 5);
      if (extraToCheck.length > 0) {
        console.log(`[audit] Extra keyword discovery: ${extraToCheck.length} candidates`);
        const extraResults = await discoverRankableKeywords(extraToCheck, business_name, mapsLocationParam).catch(() => []);
        keywordDiscovery = [...keywordDiscovery, ...extraResults];
        const totalFound = keywordDiscovery.filter((k) => k.found).length;
        console.log(`[audit] Total keyword discovery: ${totalFound}/${keywordDiscovery.length} found`);
      }
    }

    if (geoGridData) {
      const found = geoGridData.gridResults.filter((r) => r.found).length;
      console.log(`[audit] Geo-grid: ${found}/9 found, SoLV: ${Math.round(geoGridData.solv * 100)}%`);
    }
    if (reviewsApiData) {
      console.log(`[audit] Reviews: ${reviewsApiData.totalReviews} reviews, ${reviewsApiData.avgRating} stars`);
    }

    // ─── Wave 3: Competitor keyword gap (parallel) ──────────────────
    // Merge competitors from Maps name search + geo-grid top competitors
    // The geo-grid has the real keyword-based competitors; name search often has none
    const competitorDomains: Array<{ name: string; domain: string }> = [];
    const allMapsCompetitors = mapsNameItems.filter((c: any) => c !== biz);

    // Also look up competitor details from geo-grid data
    // The geo-grid topCompetitors have names but no domains, so we do an additional
    // Maps keyword search to get full competitor data if name search had no competitors
    let enrichedMapsItems = mapsNameItems;
    if (allMapsCompetitors.length === 0 && geoGridData?.topCompetitors?.length) {
      // Run one keyword Maps search to get competitor details
      const kwMapsResp = await safeDFS("/serp/google/maps/live/advanced", [{
        keyword: `${kw} ${city}`, ...mapsLocationParam, language_code: "en", depth: 20,
      }]).catch(() => null);
      const kwMapsItems = dfsItems(kwMapsResp);
      if (kwMapsItems.length > 0) {
        // Merge keyword Maps items as competitors (exclude our business)
        const seenTitles = new Set(mapsNameItems.map((c: any) => (c.title ?? "").toLowerCase()));
        for (const item of kwMapsItems) {
          const title = (item.title ?? "").toLowerCase();
          if (!seenTitles.has(title)) {
            seenTitles.add(title);
            enrichedMapsItems.push(item);
          }
        }
      }
    }

    const allCompetitors = enrichedMapsItems.filter((c: any) => c !== biz);
    for (const c of allCompetitors.slice(0, 3)) {
      const d = c.domain ?? "";
      if (d) competitorDomains.push({ name: c.title ?? "Unknown", domain: d.replace(/^www\./, "") });
    }

    const wave3: Promise<any>[] = [];
    const competitorKeywordSets: Array<{ name: string; domain: string; keywords: any[] }> = [];
    const competitorPageRanks: Array<{ name: string; domain: string; pageRank: number | null }> = [];

    if (competitorDomains.length > 0) {
      const compPromises = competitorDomains.map(async (cd) => {
        const [kws, pr] = await Promise.all([
          fetchCompetitorKeywords(cd.domain, locationCode).catch(() => []),
          fetchPageRank(cd.domain).catch(() => null),
        ]);
        return { ...cd, keywords: kws, pageRank: pr };
      });
      wave3.push(Promise.all(compPromises));
    } else {
      wave3.push(Promise.resolve([]));
    }

    const [compResults] = await Promise.all(wave3) as [Array<{ name: string; domain: string; keywords: any[]; pageRank: number | null }>];
    for (const cr of compResults) {
      competitorKeywordSets.push({ name: cr.name, domain: cr.domain, keywords: cr.keywords });
      competitorPageRanks.push({ name: cr.name, domain: cr.domain, pageRank: cr.pageRank });
    }

    // ─── Wave 4: GBP fallback (if not found) ────────────────────────
    if (!businessMatch.found) {
      const gbpFallback = await safeDFS("/business_data/google/my_business_info/live", [{
        keyword: business_name, ...mapsLocationParam, language_code: "en",
      }]);
      const gbpItem = dfsFirstItem(gbpFallback);
      if (gbpItem) {
        businessMatch.item = gbpItem;
        businessMatch.found = true;
        businessMatch.rank = 0;
        console.log(`[audit] GBP fallback found: "${gbpItem.title}"`);
      }
    }

    // ─── LSEO supplemental (if available) ───────────────────────────
    if (process.env.LOCALSEODATA_API_KEY) {
      await callLSEO("/v1/audit/local", { business_name, location, keyword: kw, competitors: 5 }).catch(() => null);
    }

    // ─── Build Report ───────────────────────────────────────────────
    const report = buildReport(
      businessMatch, enrichedMapsItems, geoGridData, reviewsApiData,
      lighthouseData as LighthouseData | null,
      technicalData, pageRankData as number | null,
      indexedPages, directories, ownKeywords, ownKeywordsTotal, ownETV,
      competitorKeywordSets, competitorPageRanks,
      body, loc,
    );

    // Attach keyword discovery to report
    (report as any).keywordDiscovery = keywordDiscovery.length > 0 ? keywordDiscovery : null;

    return NextResponse.json({ status: "success", report });
  } catch (e) {
    console.error("[/api/audit] Error:", e);
    return NextResponse.json({ error: e instanceof Error ? e.message : "Audit failed" }, { status: 500 });
  }
}
