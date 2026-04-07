// ============================================
// RankedFirst.ai — Site Data (Single Source of Truth)
// ============================================

export const siteConfig = {
  name: "RankedFirst.ai",
  tagline: "Local visibility for the AI era",
  description:
    "AI-native local SEO agency. Autonomous agents handle GBP optimization, geogrid analysis, citation management, review monitoring, and AI visibility — 24/7.",
  url: "https://rankedfirst.ai",
  email: "hello@rankedfirst.ai",
  bookingUrl: "#contact",
};

// ---- Navigation ----
export const navigation = {
  services: [
    { name: "All Services", href: "/services", description: "Overview of all visibility channels" },
    { name: "Local Search Visibility", href: "/services/local-search", description: "GBP, geogrid, citations, LSA, reviews" },
    { name: "Local AI Visibility", href: "/services/local-ai", description: "AI Overviews, LLM monitoring, entity authority" },
    { name: "Local Social Visibility", href: "/services/local-social", description: "Instagram, TikTok, Facebook discovery" },
  ],
  agents: [
    { name: "All Agents", href: "/agents", description: "How our autonomous agents work" },
    { name: "GBP Optimization", href: "/agents/gbp-optimization", description: "Scheduled profile audits" },
    { name: "Geogrid Analysis", href: "/agents/geogrid-analysis", description: "Ranking grid tracking" },
    { name: "Review Management", href: "/agents/review-management", description: "Response drafting & monitoring" },
    { name: "Local Citations", href: "/agents/local-citations", description: "NAP audit & corrections" },
    { name: "LSA Ads", href: "/agents/lsa-ads", description: "Local Services Ads monitoring" },
    { name: "AI Visibility", href: "/agents/ai-visibility", description: "LLM mention tracking" },
    { name: "Local Reporting", href: "/agents/local-reporting", description: "Automated client reports" },
  ],
  industries: [
    { name: "All Industries", href: "/industries", description: "See all verticals we serve" },
    { name: "Healthcare & Medical", href: "/industries/healthcare", description: "Dentists, chiropractors, clinics" },
    { name: "Home Services", href: "/industries/home-services", description: "Plumbers, HVAC, electricians" },
    { name: "Legal & Professional", href: "/industries/legal", description: "Lawyers, accountants" },
    { name: "Multi-Location & Franchise", href: "/industries/multi-location", description: "Portfolio management" },
    { name: "Restaurants & Hospitality", href: "/industries/restaurants", description: "Dining, hotels, events" },
    { name: "Insurance Agents", href: "/industries/insurance", description: "Local authority & lead gen" },
  ],
  main: [
    { name: "Services", href: "/services", hasDropdown: true },
    { name: "Agents", href: "/agents", hasDropdown: true },
    { name: "Industries", href: "/industries", hasDropdown: true },
    { name: "Skills", href: "/skills" },
    { name: "About", href: "/about" },
  ],
};

// ---- Services ----
export const services = [
  {
    slug: "local-search",
    name: "Local Search Visibility",
    shortName: "Search",
    icon: "search",
    color: "accent",
    headline: "Dominate the map pack and local search results",
    description:
      "Google Business Profile optimization, geogrid-based ranking strategies, citation management, Local Services Ads, and review generation — everything that controls where you show up when someone searches near you.",
    features: [
      "Google Business Profile optimization",
      "Geogrid ranking analysis & strategy",
      "NAP consistency & citation building",
      "Local Services Ads management",
      "Review generation & reputation",
      "Local keyword research & targeting",
      "Location page strategy",
      "Structured data implementation",
    ],
    agents: ["gbp-optimization", "geogrid-analysis", "local-citations", "review-management", "lsa-ads"],
    faq: [
      {
        q: "What is geogrid analysis?",
        a: "Geogrid analysis maps your Google Business Profile ranking across a geographic grid — typically a 7x7 or 9x9 grid centered on your location. Each point shows where you rank for a specific keyword, revealing areas of strength and weakness across your service area.",
      },
      {
        q: "How long does it take to see results from local search optimization?",
        a: "Most businesses see measurable ranking improvements within 4-8 weeks. Citation corrections and GBP optimization often show results within 2-3 weeks. Geogrid improvements in competitive markets may take 3-6 months of consistent work.",
      },
      {
        q: "Do you manage Google Business Profile for us?",
        a: "Yes. Our GBP Optimization Agent runs scheduled audits and flags issues automatically. For managed service clients, we handle all profile updates, posts, Q&A responses, and attribute optimization.",
      },
      {
        q: "What is NAP consistency and why does it matter?",
        a: "NAP stands for Name, Address, Phone number. Inconsistent NAP data across directories confuses search engines and hurts your local ranking. Our Citations Agent audits 20+ directories and prioritizes corrections by domain authority.",
      },
      {
        q: "Do you handle Local Services Ads (LSA)?",
        a: "Yes. Our LSA Ads Agent monitors your market, tracks ranking changes, surfaces lead cost anomalies, and flags competitor movements. For managed clients, we optimize bidding and budget allocation.",
      },
    ],
  },
  {
    slug: "local-ai",
    name: "Local AI Visibility",
    shortName: "AI",
    icon: "sparkles",
    color: "purple",
    headline: "Get recommended when AI answers local questions",
    description:
      "When someone asks ChatGPT, Perplexity, or Gemini for a recommendation near them, will your business show up? We optimize for the signals AI models use to surface local businesses in generated answers.",
    features: [
      "AI Overview optimization",
      "LLM brand mention monitoring",
      "Generative search audit & strategy",
      "Entity authority building",
      "Structured data for AI consumption",
      "Knowledge panel optimization",
      "Review sentiment optimization for AI",
      "Conversational query targeting",
    ],
    agents: ["ai-visibility"],
    faq: [
      {
        q: "What is local AI visibility?",
        a: "Local AI visibility is how likely AI assistants (ChatGPT, Perplexity, Gemini, Apple Intelligence) are to recommend your business when users ask for local recommendations. It's a new visibility channel that works alongside traditional search.",
      },
      {
        q: "How do AI models decide which local businesses to recommend?",
        a: "AI models pull from multiple signals: Google Business Profile data, review sentiment and volume, structured data, entity authority, web mentions, citation consistency, and content quality. Strong signals across all of these increase your chances of being recommended.",
      },
      {
        q: "Is this different from traditional SEO?",
        a: "Yes. Traditional SEO optimizes for Google's ranking algorithm. AI visibility optimizes for how large language models interpret and surface your business data. There's overlap (structured data, reviews, authority), but the strategy and measurement are different.",
      },
      {
        q: "How do you measure AI visibility?",
        a: "Our AI Visibility Agent monitors brand mentions across major LLMs, tracks AI Overview appearances for target queries, and measures entity recognition strength. We provide regular reports showing mention frequency, sentiment, and competitive positioning.",
      },
      {
        q: "Which AI platforms do you optimize for?",
        a: "We optimize for ChatGPT, Google Gemini (including AI Overviews), Perplexity, Apple Intelligence, and Microsoft Copilot. Each has different data sources and ranking signals, and our strategy accounts for all of them.",
      },
    ],
  },
  {
    slug: "local-social",
    name: "Local Social Visibility",
    shortName: "Social",
    icon: "share",
    color: "pink",
    headline: "Be found where people discover local businesses on social",
    description:
      "Instagram, TikTok, and Facebook have become search engines for local discovery. We help you show up when people search for services in your area on social platforms.",
    features: [
      "Instagram local SEO & discovery",
      "TikTok local search optimization",
      "Facebook local marketplace presence",
      "Social content strategy for local",
      "Hashtag & location tag strategy",
      "UGC and review integration",
      "Social proof building",
      "Cross-platform local branding",
    ],
    agents: [],
    faq: [
      {
        q: "Do people really search for local businesses on social media?",
        a: "Yes — 40% of Gen Z prefers TikTok and Instagram over Google for local discovery. Social platforms are increasingly used to find restaurants, salons, doctors, and service providers. Ignoring social search means missing a growing segment of local discovery.",
      },
      {
        q: "What does local social visibility include?",
        a: "We optimize your social profiles for local discovery, create geo-tagged content strategies, implement location-based hashtag strategies, and ensure your business appears in platform-specific local search results.",
      },
      {
        q: "How is this different from regular social media marketing?",
        a: "Regular social media marketing focuses on followers and engagement. Local social visibility specifically targets the discovery and search features within social platforms — helping people who are actively looking for your type of business find you.",
      },
      {
        q: "Which platforms matter most for local businesses?",
        a: "It depends on your industry. Restaurants and retail benefit most from Instagram and TikTok. Professional services see more traction on Facebook and LinkedIn local. We assess your market and prioritize the platforms with the highest ROI.",
      },
      {
        q: "Do you create content for us?",
        a: "For managed service clients, we handle content strategy, creation guidelines, posting schedules, and optimization. We can work with your existing content team or provide full content management depending on your engagement level.",
      },
    ],
  },
];

// ---- Agents ----
export const agents = [
  {
    slug: "gbp-optimization",
    name: "GBP Optimization Agent",
    shortName: "GBP Optimization",
    tagline: "Scheduled audits. Zero missed signals.",
    description:
      "Runs full Google Business Profile audits on a schedule. Flags category mismatches, missing attributes, thin descriptions, unanswered Q&As, photo gaps, and posting cadence issues.",
    longDescription:
      "Your Google Business Profile is the foundation of local visibility — but it's also a moving target. Google changes attributes, competitors update their profiles, and new features launch regularly. The GBP Optimization Agent monitors your profile continuously, comparing it against best practices and competitor benchmarks. It flags issues before they cost you rankings and generates specific, actionable recommendations.",
    capabilities: [
      "Scheduled full-profile audits (daily, weekly, or custom)",
      "Category and subcategory accuracy verification",
      "Attribute completeness scoring against competitors",
      "Description quality analysis and optimization suggestions",
      "Q&A monitoring with draft responses",
      "Photo audit — quantity, quality, recency, and type coverage",
      "Post cadence tracking and content suggestions",
      "Hours, holiday hours, and special hours verification",
      "Service and product catalog completeness checks",
    ],
    dataSources: ["Google Business Profile API", "LocalSEOData"],
    relatedServices: ["local-search"],
    relatedSkills: ["gbp-optimization", "gbp-posts", "gbp-api-automation"],
    status: "active",
    faq: [
      {
        q: "How often does the GBP Optimization Agent run audits?",
        a: "You set the cadence. Most clients run weekly audits with daily monitoring for critical changes (hours, status, new reviews). High-competition markets often benefit from daily full audits.",
      },
      {
        q: "What happens when the agent finds an issue?",
        a: "Issues are categorized by severity (critical, moderate, minor) and delivered as actionable tasks. For managed service clients, our team handles the fixes. For consulting clients, you receive a prioritized task list with exact steps.",
      },
      {
        q: "Does it compare my profile against competitors?",
        a: "Yes. The agent benchmarks your profile against top-ranking competitors for your target keywords, highlighting gaps in attributes, categories, review count, photo quality, and posting frequency.",
      },
    ],
  },
  {
    slug: "geogrid-analysis",
    name: "Geogrid Analysis Agent",
    shortName: "Geogrid Analysis",
    tagline: "See exactly where you rank. Every grid point.",
    description:
      "Runs scheduled geogrid scans and tracks ranking movement over time. Surfaces keyword-level wins, declines, and competitor intrusions across your entire service area.",
    longDescription:
      "A single ranking check from your office tells you nothing — local rankings vary block by block. The Geogrid Analysis Agent scans a grid of points across your service area for every target keyword, revealing exactly where you're visible, where you're not, and where competitors are encroaching. Over time, it builds a complete picture of your ranking trajectory and the impact of optimization efforts.",
    capabilities: [
      "Scheduled geogrid scans (7x7, 9x9, or custom grid sizes)",
      "Multi-keyword tracking across the full grid",
      "Ranking change detection and trend analysis",
      "Competitor intrusion alerts (new competitors entering your grid)",
      "Keyword-level win/decline surfacing",
      "Heatmap visualization of ranking strength",
      "Historical trend data for before/after analysis",
      "Service area coverage gap identification",
    ],
    dataSources: ["Local Falcon", "DataForSEO", "LocalSEOData"],
    relatedServices: ["local-search"],
    relatedSkills: ["geogrid-analysis", "local-competitor-analysis"],
    status: "active",
    faq: [
      {
        q: "What is a geogrid scan?",
        a: "A geogrid scan checks your Google Business Profile ranking at dozens of geographic points across your service area — like a grid laid over a map. Each point shows your rank for a specific keyword, revealing exactly where you're visible and where you're not.",
      },
      {
        q: "How often should geogrid scans run?",
        a: "Weekly is standard for most businesses. High-competition markets or active optimization campaigns benefit from bi-weekly or even daily scans to catch changes quickly.",
      },
      {
        q: "What data sources does it use?",
        a: "The agent integrates with Local Falcon for geogrid campaigns, DataForSEO for bulk ranking data, and LocalSEOData for consolidated analysis. It cross-references all sources for accuracy.",
      },
    ],
  },
  {
    slug: "review-management",
    name: "Review Management Agent",
    shortName: "Review Management",
    tagline: "Every review handled. Every pattern caught.",
    description:
      "Monitors review velocity, drafts responses to new reviews, and flags anomalies like sudden drops, suspicious patterns, or competitor review manipulation.",
    longDescription:
      "Reviews are the most visible trust signal for local businesses — and the most time-consuming to manage. The Review Management Agent monitors your review flow in real-time, drafts personalized responses for each new review, tracks velocity trends, and catches anomalies before they become problems. It also monitors competitor review patterns to detect potential manipulation.",
    capabilities: [
      "Real-time new review detection across platforms",
      "AI-drafted review responses (positive, negative, neutral)",
      "Review velocity tracking and trend analysis",
      "Sudden drop or spike alerts",
      "Suspicious review pattern detection",
      "Competitor review monitoring",
      "Sentiment analysis and trending topic identification",
      "Review generation campaign support",
    ],
    dataSources: ["Google Business Profile API", "LocalSEOData"],
    relatedServices: ["local-search"],
    relatedSkills: ["review-management"],
    status: "active",
    faq: [
      {
        q: "Does the agent respond to reviews automatically?",
        a: "The agent drafts responses, but a human reviews and approves before posting. For managed service clients, our team handles the review-and-post workflow. The goal is speed without sacrificing quality or authenticity.",
      },
      {
        q: "Can it detect fake or manipulated reviews?",
        a: "Yes. The agent flags reviews that match patterns associated with inauthentic activity — sudden bursts, reviewer profiles with no history, identical language across reviews, and timing patterns that suggest coordination.",
      },
      {
        q: "Does it monitor reviews on platforms other than Google?",
        a: "Currently, the agent focuses on Google Business Profile reviews, which have the strongest impact on local search rankings. We can extend monitoring to Yelp, Facebook, and industry-specific platforms for managed service clients.",
      },
    ],
  },
  {
    slug: "local-citations",
    name: "Local Citations Agent",
    shortName: "Local Citations",
    tagline: "Consistent data. Everywhere that matters.",
    description:
      "Audits NAP consistency across 20+ directories, prioritizes mismatches by domain authority, and submits corrections through connected tools.",
    longDescription:
      "Inconsistent business information across the web confuses search engines and erodes trust. The Local Citations Agent continuously audits your Name, Address, and Phone number across 20+ directories — from major aggregators to niche industry listings — and prioritizes corrections by the authority of each directory. No more spreadsheet tracking. No more manual submissions.",
    capabilities: [
      "NAP consistency audit across 20+ directories",
      "Mismatch detection and severity scoring",
      "Authority-weighted correction prioritization",
      "Automated correction submission via BrightLocal/Whitespark",
      "New citation opportunity identification",
      "Duplicate listing detection and suppression",
      "Industry-specific directory coverage analysis",
      "Ongoing monitoring for data degradation",
    ],
    dataSources: ["BrightLocal", "Whitespark", "LocalSEOData"],
    relatedServices: ["local-search"],
    relatedSkills: ["local-citations"],
    status: "active",
    faq: [
      {
        q: "Which directories does the agent monitor?",
        a: "The agent monitors 20+ directories including Google, Bing, Apple Maps, Yelp, Facebook, Yellowpages, BBB, Healthgrades, Avvo, and industry-specific directories. The exact list depends on your industry and location.",
      },
      {
        q: "How does it prioritize which corrections to make first?",
        a: "Corrections are prioritized by the domain authority of the directory — high-authority sites like Google, Yelp, and Apple Maps are addressed first because they have the strongest impact on your local rankings.",
      },
      {
        q: "Can it submit corrections automatically?",
        a: "For directories supported by BrightLocal and Whitespark, yes — the agent submits corrections through their APIs. For directories that require manual updates, it generates a task with exact instructions.",
      },
    ],
  },
  {
    slug: "lsa-ads",
    name: "LSA Ads Agent",
    shortName: "LSA Ads",
    tagline: "Market intelligence. Cost control. Competitor radar.",
    description:
      "Monitors Local Services Ads markets, tracks ranking changes, surfaces lead cost anomalies, and flags when competitors gain or lose presence.",
    longDescription:
      "Local Services Ads are high-intent, high-value — but the market shifts constantly. The LSA Ads Agent monitors your LSA market position, tracks ranking changes across service categories, identifies lead cost anomalies, and alerts you when competitors enter or exit your market. It turns LSA from a set-and-forget spend into an actively managed channel.",
    capabilities: [
      "LSA market position tracking",
      "Ranking change detection by service category",
      "Lead cost anomaly identification",
      "Competitor entry/exit alerts",
      "Budget utilization analysis",
      "Service category performance comparison",
      "Geographic coverage gap identification",
      "ROI tracking by service category",
    ],
    dataSources: ["LSA Spy", "LocalSEOData"],
    relatedServices: ["local-search"],
    relatedSkills: ["lsa-ads"],
    status: "active",
    faq: [
      {
        q: "What are Local Services Ads?",
        a: "Local Services Ads are Google's pay-per-lead advertising format for service businesses. They appear at the very top of search results with a 'Google Guaranteed' or 'Google Screened' badge. You pay per lead, not per click.",
      },
      {
        q: "How does the agent track LSA rankings?",
        a: "The agent uses LSA Spy to monitor your position in LSA results across your service categories and geographic area. It tracks changes daily and surfaces trends so you can see if your position is improving or declining.",
      },
      {
        q: "What is a lead cost anomaly?",
        a: "A lead cost anomaly is when your cost per lead deviates significantly from your historical average or market benchmarks. This might indicate increased competition, seasonal changes, or bidding issues that need attention.",
      },
    ],
  },
  {
    slug: "ai-visibility",
    name: "AI Visibility Agent",
    shortName: "AI Visibility",
    tagline: "Track every mention. Every AI model. Every answer.",
    description:
      "Monitors brand mentions across ChatGPT, Perplexity, Gemini, and AI Overviews. Tracks entity recognition, recommendation frequency, and sentiment across all major LLMs.",
    longDescription:
      "AI assistants are becoming a primary discovery channel for local businesses — but most businesses have zero visibility into whether AI models recommend them. The AI Visibility Agent monitors your brand across every major LLM, tracking mentions, recommendations, sentiment, and entity recognition. It identifies opportunities to strengthen your AI presence and alerts you to competitive threats in the AI recommendation landscape.",
    capabilities: [
      "Cross-LLM brand mention monitoring (ChatGPT, Gemini, Perplexity, Copilot)",
      "AI Overview appearance tracking for target queries",
      "Entity recognition strength measurement",
      "Recommendation frequency and sentiment tracking",
      "Competitor AI visibility benchmarking",
      "Structured data effectiveness scoring",
      "Knowledge panel presence monitoring",
      "Actionable recommendations for improving AI visibility signals",
    ],
    dataSources: ["Custom LLM monitoring", "LocalSEOData", "Google Search Console"],
    relatedServices: ["local-ai"],
    relatedSkills: ["ai-local-search"],
    status: "active",
    faq: [
      {
        q: "How do you monitor what AI models say about my business?",
        a: "We run structured queries against major LLMs using prompts that mirror real user behavior — like 'best dentist in Buffalo NY' or 'who should I call for emergency plumbing in Vaughan.' We track whether your business appears, how it's described, and how it compares to competitors.",
      },
      {
        q: "Can you improve my chances of being recommended by AI?",
        a: "Yes. AI recommendations are driven by signals like review quality, structured data, web mentions, entity authority, and content depth. Our AI Visibility service optimizes all of these signals specifically for how LLMs consume and rank local business data.",
      },
      {
        q: "Is this the same as AI Overview optimization?",
        a: "AI Overviews are one component. We also optimize for conversational AI (ChatGPT, Perplexity), voice assistants, and emerging AI discovery platforms. Each has different data sources and ranking logic.",
      },
    ],
  },
  {
    slug: "local-reporting",
    name: "Local Reporting Agent",
    shortName: "Local Reporting",
    tagline: "Reports that write themselves. Delivered on schedule.",
    description:
      "Pulls findings from all agents, assembles client-ready reports with insights and recommendations, and delivers them on your schedule.",
    longDescription:
      "Reporting is where insights become action — but it's also where most agencies waste the most time. The Local Reporting Agent aggregates findings from every other agent, identifies the most important trends and changes, writes narrative insights (not just data dumps), and assembles polished, client-ready reports. Set the cadence, and reports arrive on schedule without anyone touching a spreadsheet.",
    capabilities: [
      "Cross-agent finding aggregation",
      "Narrative insight generation (not just data)",
      "Client-ready report formatting",
      "Scheduled delivery (weekly, monthly, or custom)",
      "Executive summary with key wins and action items",
      "Visual ranking trend charts and heatmaps",
      "Competitor comparison sections",
      "Custom branding and white-label support",
    ],
    dataSources: ["All agent outputs", "LocalSEOData"],
    relatedServices: ["local-search", "local-ai"],
    relatedSkills: ["local-reporting", "client-deliverables"],
    status: "active",
    faq: [
      {
        q: "What format are the reports in?",
        a: "Reports are delivered as branded PDF documents with charts, heatmaps, and narrative analysis. For white-label clients, reports carry your agency's branding. We can also deliver raw data exports for teams that need to build custom dashboards.",
      },
      {
        q: "Can I customize what's included in the report?",
        a: "Yes. You choose which agent findings to include, the level of detail, and the narrative tone. Some clients want executive summaries only; others want deep technical detail. The agent adapts to your preferences.",
      },
      {
        q: "How does the agent write narrative insights?",
        a: "The agent analyzes trends across all data sources, identifies the most significant changes, and generates natural-language explanations — like 'Rankings improved 3 positions in the northwest quadrant, likely driven by the citation corrections completed last week.' It connects actions to outcomes.",
      },
    ],
  },
];

// ---- Skills ----
export const strategySkills = [
  "gbp-optimization",
  "gbp-posts",
  "gbp-suspension-recovery",
  "gbp-api-automation",
  "geogrid-analysis",
  "local-seo-audit",
  "local-competitor-analysis",
  "local-reporting",
  "local-keyword-research",
  "local-landing-pages",
  "local-schema",
  "local-link-building",
  "review-management",
  "local-citations",
  "client-deliverables",
  "lsa-ads",
  "local-search-ads",
  "local-ppc-ads",
  "service-area-seo",
  "multi-location-seo",
  "ai-local-search",
  "apple-business-connect",
  "bing-places",
];

export const toolSkills = [
  "localseodata-tool",
  "local-falcon-tool",
  "lsa-spy-tool",
  "serpapi-tool",
  "semrush-tool",
  "ahrefs-tool",
  "brightlocal-tool",
  "whitespark-tool",
  "dataforseo-tool",
  "google-search-console-tool",
  "google-analytics-tool",
  "screaming-frog-tool",
];

// ---- Industries ----
export const industries = [
  {
    slug: "healthcare",
    name: "Healthcare & Medical",
    icon: "🏥",
    description: "Dentists, chiropractors, optometrists, clinics, and medical practices.",
    headline: "Patients search. AI recommends. Your practice needs to be first.",
    longDescription:
      "Healthcare is one of the most competitive local search verticals — and one where AI recommendations carry enormous weight. Patients trust Google ratings, read reviews carefully, and increasingly ask AI assistants for recommendations. We help healthcare practices dominate every surface where patients discover providers.",
    keyServices: ["GBP optimization for medical categories", "Review generation & HIPAA-compliant responses", "AI visibility for health-related queries", "Multi-provider and multi-location management", "Healthcare directory citation management"],
    relevantAgents: ["gbp-optimization", "review-management", "ai-visibility", "local-citations"],
    stats: { avgRankImprovement: "12 positions", reviewGrowth: "3x", aiMentionRate: "45%" },
  },
  {
    slug: "home-services",
    name: "Home Services",
    icon: "🔧",
    description: "Plumbers, HVAC, electricians, roofers, and contractors.",
    headline: "When the pipe bursts, you need to be first. Not second.",
    longDescription:
      "Home services is the most LSA-heavy vertical in local search. When someone needs an emergency plumber or their AC dies in July, they're choosing from the top 3 results — period. We combine map pack dominance with LSA optimization and geogrid expansion to ensure you're the call that gets made.",
    keyServices: ["Map pack ranking for emergency + scheduled services", "LSA optimization and budget management", "Geogrid expansion across service area", "Review velocity building", "Service area business strategy"],
    relevantAgents: ["gbp-optimization", "geogrid-analysis", "lsa-ads", "review-management"],
    stats: { avgRankImprovement: "15 positions", lsaLeadReduction: "22%", coverageIncrease: "40%" },
  },
  {
    slug: "legal",
    name: "Legal & Professional",
    icon: "⚖️",
    description: "Law firms, accountants, financial advisors, and consultants.",
    headline: "Authority is everything. Build it where it counts.",
    longDescription:
      "Legal and professional services compete on authority and trust. Potential clients research extensively before making contact, and AI assistants are increasingly part of that research. We build your local authority across every surface — GBP, AI models, citation directories, and review platforms — so when someone asks 'who's the best family lawyer near me,' you're the answer.",
    keyServices: ["GBP authority building for professional categories", "AI visibility for high-intent legal queries", "Review strategy for trust-building", "Citation management across legal directories", "Content authority and entity building"],
    relevantAgents: ["gbp-optimization", "ai-visibility", "review-management", "local-citations"],
    stats: { avgRankImprovement: "10 positions", authorityScore: "85+", aiMentionRate: "38%" },
  },
  {
    slug: "multi-location",
    name: "Multi-Location & Franchise",
    icon: "📍",
    description: "Franchise networks, multi-location brands, and enterprise local.",
    headline: "Scale local visibility without scaling headcount.",
    longDescription:
      "Managing local SEO across dozens or hundreds of locations is where most agencies break. Manual processes don't scale. Our autonomous agents were built for exactly this — running audits, tracking rankings, monitoring reviews, and generating reports across your entire portfolio with the same attention to detail as a dedicated SEO manager at each location.",
    keyServices: ["Portfolio-wide GBP management", "Location-level geogrid tracking", "Centralized review monitoring and response", "Cross-location citation management", "Scaled reporting with location-level detail"],
    relevantAgents: ["gbp-optimization", "geogrid-analysis", "review-management", "local-citations", "local-reporting"],
    stats: { locationsManaged: "100+", auditFrequency: "Daily", reportingTime: "90% reduction" },
  },
  {
    slug: "restaurants",
    name: "Restaurants & Hospitality",
    icon: "🍽️",
    description: "Restaurants, cafes, bars, hotels, and event venues.",
    headline: "Where social discovery meets search. Own both.",
    longDescription:
      "Restaurants live at the intersection of every local visibility channel — Google search, AI recommendations, Instagram discovery, TikTok, and review platforms. One bad review streak can tank your business. One viral TikTok can make it. We help restaurants and hospitality businesses build visibility across every channel where diners and travelers make decisions.",
    keyServices: ["GBP optimization for food & hospitality", "Social discovery strategy (Instagram, TikTok)", "Review management and response strategy", "AI visibility for dining and travel queries", "Menu and photo optimization"],
    relevantAgents: ["gbp-optimization", "review-management", "ai-visibility"],
    stats: { avgRankImprovement: "14 positions", reviewResponseRate: "100%", socialDiscovery: "3x" },
  },
  {
    slug: "insurance",
    name: "Insurance Agents",
    icon: "🛡️",
    description: "Insurance agents, brokers, and financial services.",
    headline: "Trust starts before the first call. Rank where it matters.",
    longDescription:
      "Insurance is a relationship business — but the relationship starts with a search. Whether someone is shopping for auto insurance, looking for a Medicare advisor, or comparing home insurance agents, they're starting with Google, AI assistants, or a directory. We ensure your presence across every channel is optimized for trust, authority, and conversion.",
    keyServices: ["GBP optimization for insurance categories", "Review generation and trust building", "Citation management across financial directories", "AI visibility for insurance queries", "Local landing page optimization"],
    relevantAgents: ["gbp-optimization", "review-management", "local-citations", "ai-visibility"],
    stats: { avgRankImprovement: "11 positions", reviewGrowth: "2.5x", leadIncrease: "35%" },
  },
];

// ---- Engagements ----
export const engagements = [
  {
    name: "Strategy Consulting",
    description:
      "Audit current visibility across all three channels, identify highest-impact gaps, deliver prioritized roadmap. Includes tool setup, skill transfer, and 30 days of implementation support.",
    bestFor: "In-house teams, growing agencies",
    featured: false,
  },
  {
    name: "Managed Services",
    description:
      "We handle everything monthly — GBP optimization, geogrid monitoring, citation management, review responses, social content, and reporting. Powered by our autonomous agents with human oversight.",
    bestFor: "SMBs, multi-location brands, franchises",
    featured: true,
  },
  {
    name: "Project Work",
    description:
      "Specific, scoped deliverable — full local SEO audit, geogrid baseline across portfolio, AI visibility report, local social launch package. Fixed scope, fixed price, delivered in 2-4 weeks.",
    bestFor: "One-time needs, due diligence",
    featured: false,
  },
  {
    name: "Agency White-Label",
    description:
      "We operate behind your agency's brand — delivering strategy, reporting, and managed execution with clean handoff to your client. Your brand, our infrastructure.",
    bestFor: "Digital agencies, PR firms, web shops",
    featured: false,
  },
];

// ---- Tools / Integrations ----
export const tools = [
  { name: "Google Business Profile", color: "#4285F4" },
  { name: "Local Falcon", color: "#FF6B35" },
  { name: "DataForSEO", color: "#00B4D8" },
  { name: "BrightLocal", color: "#2ECC71" },
  { name: "Whitespark", color: "#9B59B6" },
  { name: "LSA Spy", color: "#E74C3C" },
  { name: "Semrush", color: "#FF642D" },
  { name: "Ahrefs", color: "#2D5BE3" },
  { name: "SerpAPI", color: "#F39C12" },
  { name: "Google Search Console", color: "#4285F4" },
  { name: "Google Analytics", color: "#E37400" },
  { name: "Screaming Frog", color: "#6BC04B" },
];
