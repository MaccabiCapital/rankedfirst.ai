// ============================================
// RankedFirst.ai — Client Data Store + 7-Stage Workflow Generator
// ============================================

import { agents } from "@/lib/site-data";

// ---- Types ----

export type TaskStatus = "Pending" | "In Progress" | "Review" | "Done";
export type StageStatus = "Not Started" | "In Progress" | "Needs Review" | "Complete";
export type AssigneeType = "Agent" | "Human";
export type OwnerType = "Human" | "Agent" | "Both";
export type ClientStatus = "Onboarding" | "Active" | "Paused" | "Completed";

export interface WorkflowTask {
  id: string;
  name: string;
  description: string;
  assigneeType: AssigneeType;
  assigneeName: string;
  status: TaskStatus;
  dueDate: string; // ISO
  stream?: string; // execution stream (Stage 5)
  notes?: string;
}

export interface WorkflowStage {
  id: string;
  stage: number; // 1-7
  name: string;
  description: string;
  status: StageStatus;
  owner: OwnerType;
  tasks: WorkflowTask[];
}

export interface GrowthRecord {
  discoverabilityScore: number; // 0-100
  trustScore: number; // 0-100
  conversionReadinessScore: number; // 0-100
  followUpScore: number; // 0-100
  overallScore: number; // 0-100
  topGaps: string[];
  lastUpdated: string;
}

export interface Client {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  gbpUrl: string;
  address: string;
  serviceArea: string;
  industry: string;
  primaryServices: string[];
  competitors: string[];
  targetKeywords: string[];
  currentChallenges: string;
  budget: string;
  notes: string;
  createdAt: string;
  status: ClientStatus;
  growthRecord?: GrowthRecord;
  stages: WorkflowStage[];
  nextMonitoringDate?: string;
}

// ---- Helpers ----

const STORAGE_KEY = "rankedfirst_clients";

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function addDays(base: Date, days: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function agentName(slug: string): string {
  const agent = agents.find((a) => a.slug === slug);
  return agent ? agent.name : slug;
}

// ---- 7-Stage Workflow Generator ----

export function generateWorkflowStages(): WorkflowStage[] {
  const now = new Date();
  const taskGap = 2;

  function makeTasks(
    stageStart: Date,
    defs: { name: string; description: string; assigneeType: AssigneeType; assigneeName: string; stream?: string; notes?: string }[],
  ): WorkflowTask[] {
    return defs.map((def, i) => ({
      id: uid(),
      name: def.name,
      description: def.description,
      assigneeType: def.assigneeType,
      assigneeName: def.assigneeName,
      status: "Pending" as TaskStatus,
      dueDate: addDays(stageStart, i * taskGap + (i > 3 ? 1 : 0)),
      stream: def.stream,
      notes: def.notes,
    }));
  }

  // Stage 1 — Intake & Market Capture (day 0)
  const s1Start = now;
  const stage1: WorkflowStage = {
    id: uid(),
    stage: 1,
    name: "Intake & Market Capture",
    description: "Welcome the client, verify business info, collect credentials, and capture market context.",
    status: "Not Started",
    owner: "Human",
    tasks: makeTasks(s1Start, [
      { name: "Send welcome email + onboarding packet", description: "Send branded welcome email with onboarding packet and expectations.", assigneeType: "Human", assigneeName: "Account Manager" },
      { name: "Schedule kickoff call", description: "Schedule and confirm kickoff call with client.", assigneeType: "Human", assigneeName: "Account Manager" },
      { name: "Collect GBP access / credentials", description: "Obtain Google Business Profile access and all necessary credentials.", assigneeType: "Human", assigneeName: "Account Manager" },
      { name: "Verify business info and market context", description: "Confirm business details, service area, competitive landscape, and market positioning.", assigneeType: "Human", assigneeName: "Account Manager" },
      { name: "Complete intake record review", description: "Review all collected intake information for completeness before audit.", assigneeType: "Human", assigneeName: "Account Manager" },
    ]),
  };

  // Stage 2 — Diagnostic Audit (day 3)
  const s2Start = new Date(now);
  s2Start.setDate(s2Start.getDate() + 3);
  const stage2: WorkflowStage = {
    id: uid(),
    stage: 2,
    name: "Diagnostic Audit",
    description: "Four-dimension diagnostic: discoverability, trust, conversion readiness, follow-up discipline.",
    status: "Not Started",
    owner: "Both",
    tasks: makeTasks(s2Start, [
      { name: "Discoverability audit (GBP, local pack, organic)", description: "Audit GBP completeness, local pack rankings, organic visibility, and keyword coverage.", assigneeType: "Agent", assigneeName: agentName("gbp-optimization") },
      { name: "Trust audit (reviews, citations, reputation)", description: "Audit review velocity, citation consistency, and online reputation signals.", assigneeType: "Agent", assigneeName: agentName("review-management") },
      { name: "Conversion readiness audit (website, CTAs, contact)", description: "Audit website UX, CTA placement, contact accessibility, and conversion paths.", assigneeType: "Human", assigneeName: "SEO Specialist" },
      { name: "Follow-up discipline audit (lead handling, response time)", description: "Evaluate lead response times, follow-up processes, and missed opportunity patterns.", assigneeType: "Human", assigneeName: "Account Manager" },
      { name: "Technical SEO audit (251-rule scan)", description: "Run comprehensive technical SEO audit across 20 categories.", assigneeType: "Human", assigneeName: "SEO Specialist", notes: "Uses SEOmator 251-rule audit framework" },
      { name: "Core Web Vitals check", description: "Measure LCP, CLS, INP, TTFB, FCP via Playwright or PageSpeed API.", assigneeType: "Human", assigneeName: "Developer" },
      { name: "E-E-A-T assessment", description: "Score content quality against Experience, Expertise, Authoritativeness, Trustworthiness benchmarks.", assigneeType: "Human", assigneeName: "Content Strategist", notes: "Uses CORE-EEAT 80-item benchmark" },
      { name: "AI/GEO readiness check", description: "Check llms.txt presence, AI bot access, semantic HTML structure, and schema coverage.", assigneeType: "Agent", assigneeName: agentName("ai-visibility"), notes: "Checks llms.txt, AI bot access, semantic HTML" },
      { name: "Compile Local Growth Audit report", description: "Aggregate all audit findings into a unified Local Growth Audit report.", assigneeType: "Human", assigneeName: "Account Manager" },
    ]),
  };

  // Stage 3 — Growth Record & Prioritization (day 10)
  const s3Start = new Date(now);
  s3Start.setDate(s3Start.getDate() + 10);
  const stage3: WorkflowStage = {
    id: uid(),
    stage: 3,
    name: "Growth Record & Prioritization",
    description: "Score the four growth dimensions, identify gaps, and create a prioritized action list.",
    status: "Not Started",
    owner: "Human",
    tasks: makeTasks(s3Start, [
      { name: "Score discoverability dimension (0-100)", description: "Assign a 0-100 score based on GBP completeness, local pack visibility, and organic coverage.", assigneeType: "Human", assigneeName: "Account Manager" },
      { name: "Score trust dimension (0-100)", description: "Assign a 0-100 score based on review volume, velocity, citation consistency, and reputation.", assigneeType: "Human", assigneeName: "Account Manager" },
      { name: "Score conversion readiness dimension (0-100)", description: "Assign a 0-100 score based on website UX, CTA effectiveness, and contact accessibility.", assigneeType: "Human", assigneeName: "Account Manager" },
      { name: "Score follow-up discipline dimension (0-100)", description: "Assign a 0-100 score based on lead response times and follow-up processes.", assigneeType: "Human", assigneeName: "Account Manager" },
      { name: "Identify top 5 growth gaps", description: "Extract the five largest scoring gaps that represent the most impactful opportunities.", assigneeType: "Human", assigneeName: "Account Manager" },
      { name: "Create prioritized action list (impact x difficulty)", description: "Rank all identified actions by impact and difficulty to determine execution order.", assigneeType: "Human", assigneeName: "Account Manager" },
      { name: "Set recommended execution streams", description: "Map prioritized actions to execution streams for Stage 5.", assigneeType: "Human", assigneeName: "Account Manager" },
      { name: "Review growth record with client", description: "Present growth record findings and recommended priorities to the client.", assigneeType: "Human", assigneeName: "Account Manager" },
    ]),
  };

  // Stage 4 — Task Routing (day 12)
  const s4Start = new Date(now);
  s4Start.setDate(s4Start.getDate() + 12);
  const stage4: WorkflowStage = {
    id: uid(),
    stage: 4,
    name: "Task Routing",
    description: "Create execution tasks, assign agent vs human, set due dates, and activate workbench.",
    status: "Not Started",
    owner: "Human",
    tasks: makeTasks(s4Start, [
      { name: "Create execution tasks from prioritized list", description: "Convert prioritized action items into concrete execution tasks.", assigneeType: "Human", assigneeName: "Account Manager" },
      { name: "Assign agent vs human for each task", description: "Apply the routing matrix: data gathering and drafting to agents, strategy and client-facing to humans.", assigneeType: "Human", assigneeName: "Account Manager" },
      { name: "Set due dates and dependencies", description: "Assign realistic due dates and identify task dependencies.", assigneeType: "Human", assigneeName: "Account Manager" },
      { name: "Identify review gates (client-facing outputs)", description: "Flag all tasks that produce client-facing outputs requiring Stage 6 review.", assigneeType: "Human", assigneeName: "Account Manager" },
      { name: "Activate workbench for execution", description: "Confirm all tasks are loaded and tracking is active in the workbench.", assigneeType: "Human", assigneeName: "Account Manager" },
    ]),
  };

  // Stage 5 — Specialist Execution (day 14, tasks within streams spaced 2-3 days)
  const s5Start = new Date(now);
  s5Start.setDate(s5Start.getDate() + 14);
  const stage5: WorkflowStage = {
    id: uid(),
    stage: 5,
    name: "Specialist Execution",
    description: "Execute prioritized work across six parallel streams: GBP, Reviews, Technical, Content, Links, Advertising.",
    status: "Not Started",
    owner: "Both",
    tasks: makeTasks(s5Start, [
      // Stream: GBP & Local Profiles
      { name: "GBP category & attribute optimization", description: "Optimize GBP categories, attributes, and business description for maximum relevance.", assigneeType: "Agent", assigneeName: agentName("gbp-optimization"), stream: "GBP & Local Profiles" },
      { name: "GBP photos & posts calendar", description: "Audit photos, create posting calendar, and schedule initial posts.", assigneeType: "Agent", assigneeName: agentName("gbp-posts"), stream: "GBP & Local Profiles" },
      { name: "GBP protection monitoring", description: "Enable continuous monitoring for unauthorized GBP changes.", assigneeType: "Agent", assigneeName: agentName("gbp-protection"), stream: "GBP & Local Profiles" },
      { name: "Local directory audit & corrections", description: "Audit NAP consistency and submit corrections across 20+ directories.", assigneeType: "Agent", assigneeName: agentName("local-citations"), stream: "GBP & Local Profiles" },
      // Stream: Reviews & Reputation
      { name: "Review monitoring setup", description: "Configure review monitoring across Google and relevant platforms.", assigneeType: "Agent", assigneeName: agentName("review-management"), stream: "Reviews & Reputation" },
      { name: "Review generation strategy", description: "Develop and align on a review generation strategy with the client.", assigneeType: "Human", assigneeName: "Account Manager", stream: "Reviews & Reputation" },
      { name: "Initial review solicitation", description: "Reach out to existing happy customers for initial reviews.", assigneeType: "Human", assigneeName: "Account Manager", stream: "Reviews & Reputation" },
      // Stream: Technical & Website
      { name: "Website architecture optimization", description: "Optimize site structure, internal linking, and navigation.", assigneeType: "Human", assigneeName: "Developer", stream: "Technical & Website" },
      { name: "Speed & Core Web Vitals fixes", description: "Fix LCP, CLS, INP issues identified during audit.", assigneeType: "Human", assigneeName: "Developer", stream: "Technical & Website" },
      { name: "Schema markup implementation", description: "Generate and deploy LocalBusiness, Service, and FAQ JSON-LD schema.", assigneeType: "Agent", assigneeName: agentName("schema-automation"), stream: "Technical & Website" },
      { name: "Geogrid baseline scan", description: "Run initial geogrid scan to establish ranking baseline.", assigneeType: "Agent", assigneeName: agentName("geogrid-analysis"), stream: "Technical & Website" },
      // Stream: Content
      { name: "Content gap analysis", description: "Analyze content gaps against target keywords and competitor coverage.", assigneeType: "Human", assigneeName: "Content Strategist", stream: "Content" },
      { name: "Editorial calendar creation", description: "Build editorial calendar aligned with keyword strategy and business goals.", assigneeType: "Human", assigneeName: "Content Strategist", stream: "Content" },
      { name: "Content writing (first batch)", description: "Write first batch of optimized content pieces.", assigneeType: "Human", assigneeName: "Content Writer", stream: "Content" },
      { name: "Content publishing & optimization", description: "Publish content and optimize on-page elements.", assigneeType: "Human", assigneeName: "Content Writer", stream: "Content" },
      // Stream: Links & Authority
      { name: "Local data aggregator submissions", description: "Submit business data to major data aggregators (Foursquare, Data Axle, etc.).", assigneeType: "Agent", assigneeName: agentName("local-citations"), stream: "Links & Authority" },
      { name: "Premium directory submissions", description: "Submit to premium directories (BBB, Chamber, industry-specific).", assigneeType: "Agent", assigneeName: agentName("local-citations"), stream: "Links & Authority" },
      { name: "Guest post outreach", description: "Identify and reach out to local and niche sites for guest posts.", assigneeType: "Human", assigneeName: "Link Builder", stream: "Links & Authority" },
      { name: "Press release distribution", description: "Draft and distribute press releases for link acquisition and visibility.", assigneeType: "Human", assigneeName: "Content Strategist", stream: "Links & Authority" },
      { name: "LLM citation building", description: "Build citations in AI/LLM roundup content for brand visibility.", assigneeType: "Agent", assigneeName: agentName("llm-citation-building"), stream: "Links & Authority" },
      // Stream: Advertising
      { name: "LSA campaign setup", description: "Set up Local Services Ads campaign and configure targeting.", assigneeType: "Agent", assigneeName: agentName("lsa-ads"), stream: "Advertising" },
      { name: "LSA monitoring", description: "Configure LSA monitoring for lead cost and ranking changes.", assigneeType: "Agent", assigneeName: agentName("lsa-ads"), stream: "Advertising" },
      { name: "PPC campaign strategy", description: "Develop PPC campaign strategy aligned with local SEO goals.", assigneeType: "Human", assigneeName: "PPC Specialist", stream: "Advertising" },
      { name: "PPC campaign build", description: "Build PPC campaigns, ad groups, and ad copy.", assigneeType: "Human", assigneeName: "PPC Specialist", stream: "Advertising" },
    ]),
  };

  // Stage 6 — Human Review (day 42)
  const s6Start = new Date(now);
  s6Start.setDate(s6Start.getDate() + 42);
  const stage6: WorkflowStage = {
    id: uid(),
    stage: 6,
    name: "Human Review",
    description: "Review all agent-generated outputs, verify accuracy, check brand safety, and approve or flag exceptions.",
    status: "Not Started",
    owner: "Human",
    tasks: makeTasks(s6Start, [
      { name: "Review all agent-generated outputs", description: "Review every deliverable produced by agents during Stage 5.", assigneeType: "Human", assigneeName: "Account Manager" },
      { name: "Verify client-facing content accuracy", description: "Fact-check all content that will be visible to the client or public.", assigneeType: "Human", assigneeName: "Account Manager" },
      { name: "Check brand safety and compliance", description: "Ensure all outputs meet brand guidelines and regulatory requirements.", assigneeType: "Human", assigneeName: "Account Manager" },
      { name: "Approve or flag exceptions", description: "Approve passing items and flag anything requiring revision or escalation.", assigneeType: "Human", assigneeName: "Account Manager" },
      { name: "Document review notes", description: "Record review findings, decisions, and any outstanding items.", assigneeType: "Human", assigneeName: "Account Manager" },
    ]),
  };

  // Stage 7 — Monitoring & Recurrence (day 49)
  const s7Start = new Date(now);
  s7Start.setDate(s7Start.getDate() + 49);
  const stage7: WorkflowStage = {
    id: uid(),
    stage: 7,
    name: "Monitoring & Recurrence",
    description: "Monitor rankings, reviews, and profile changes. Re-score growth dimensions. Schedule next cycle.",
    status: "Not Started",
    owner: "Both",
    tasks: makeTasks(s7Start, [
      { name: "Re-check local pack rankings", description: "Run geogrid scan to measure ranking changes since baseline.", assigneeType: "Agent", assigneeName: agentName("geogrid-analysis") },
      { name: "Monitor review momentum", description: "Check review velocity, new reviews, and sentiment trends.", assigneeType: "Agent", assigneeName: agentName("review-management") },
      { name: "Check GBP for unauthorized changes", description: "Scan for any unauthorized modifications to the GBP profile.", assigneeType: "Agent", assigneeName: agentName("gbp-protection") },
      { name: "Re-score growth dimensions", description: "Update all four growth dimension scores based on current data.", assigneeType: "Human", assigneeName: "Account Manager" },
      { name: "Generate monitoring report", description: "Compile automated monitoring report for client delivery.", assigneeType: "Agent", assigneeName: agentName("local-reporting") },
      { name: "Schedule next monitoring cycle", description: "Set the next monitoring checkpoint date and create calendar entry.", assigneeType: "Human", assigneeName: "Account Manager" },
      { name: "Create new tasks from monitoring findings", description: "Convert any monitoring insights into new execution tasks.", assigneeType: "Human", assigneeName: "Account Manager" },
    ]),
  };

  return [stage1, stage2, stage3, stage4, stage5, stage6, stage7];
}

// ---- Default Growth Record ----

export function defaultGrowthRecord(): GrowthRecord {
  return {
    discoverabilityScore: 0,
    trustScore: 0,
    conversionReadinessScore: 0,
    followUpScore: 0,
    overallScore: 0,
    topGaps: [],
    lastUpdated: new Date().toISOString(),
  };
}

// ---- CRUD Functions ----

export function getClients(): Client[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getClient(id: string): Client | undefined {
  return getClients().find((c) => c.id === id);
}

export function saveClient(client: Client): void {
  const clients = getClients();
  const idx = clients.findIndex((c) => c.id === client.id);
  if (idx >= 0) {
    clients[idx] = client;
  } else {
    clients.push(client);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

export function deleteClient(id: string): void {
  const clients = getClients().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

export function updateTaskStatus(
  clientId: string,
  stageId: string,
  taskId: string,
  status: TaskStatus,
): void {
  const client = getClient(clientId);
  if (!client) return;
  for (const stage of client.stages) {
    if (stage.id === stageId) {
      for (const task of stage.tasks) {
        if (task.id === taskId) {
          task.status = status;
        }
      }
      // Auto-mark stage complete if all tasks done
      if (stage.tasks.every((t) => t.status === "Done")) {
        stage.status = "Complete";
      } else if (stage.tasks.some((t) => t.status === "Review")) {
        stage.status = "Needs Review";
      } else if (stage.tasks.some((t) => t.status !== "Pending")) {
        stage.status = "In Progress";
      }
    }
  }
  saveClient(client);
}

export function updateStageStatus(
  clientId: string,
  stageId: string,
  status: StageStatus,
): void {
  const client = getClient(clientId);
  if (!client) return;
  for (const stage of client.stages) {
    if (stage.id === stageId) {
      stage.status = status;
    }
  }
  saveClient(client);
}

export function updateGrowthRecord(
  clientId: string,
  record: GrowthRecord,
): void {
  const client = getClient(clientId);
  if (!client) return;
  client.growthRecord = record;
  saveClient(client);
}
