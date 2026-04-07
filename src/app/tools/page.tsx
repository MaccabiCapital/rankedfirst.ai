"use client";

import * as React from "react";
import Link from "next/link";

// ---- Icons ----

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ScanIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 5V3C2 2.44772 2.44772 2 3 2H5M11 2H13C13.5523 2 14 2.44772 14 3V5M14 11V13C14 13.5523 13.5523 14 13 14H11M5 14H3C2.44772 14 2 13.5523 2 13V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 8H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 14V8L6 4L10 7L14 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ToolIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M9.5 6.5L13.5 2.5M14 5L11 2M6.5 9.5L2 14L4 14L4 12L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 7L7.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ---- Data ----

interface Tool {
  name: string;
  description: string;
  detail?: string;
  type: "agent" | "human" | "api";
}

interface ToolGroup {
  title: string;
  stage: string;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  tools: Tool[];
}

const toolGroups: ToolGroup[] = [
  {
    title: "Audit Tools",
    stage: "Stage 2 — Diagnostic Audit",
    icon: <ScanIcon />,
    color: "text-violet-400",
    borderColor: "border-violet-500/30",
    tools: [
      { name: "SEOmator Audit", description: "Comprehensive 251-rule technical SEO audit", detail: "20 categories: technical, content, links, performance, schema, security, accessibility, AI/GEO readiness", type: "api" },
      { name: "CORE-EEAT Benchmark", description: "80-item content quality scoring framework", detail: "Scores Experience, Expertise, Authoritativeness, and Trustworthiness across all site content", type: "human" },
      { name: "CITE Domain Rating", description: "40-item domain authority audit", detail: "Evaluates domain strength, backlink profile, citation consistency, and trust signals", type: "api" },
      { name: "Core Web Vitals", description: "LCP, CLS, INP, TTFB, FCP measurement", detail: "Automated via Playwright or PageSpeed API for real user metric simulation", type: "api" },
      { name: "AI/GEO Readiness Check", description: "Semantic HTML, AI bot access, and llms.txt validation", detail: "Ensures the site is discoverable and properly structured for AI search engines and LLM crawlers", type: "agent" },
    ],
  },
  {
    title: "Execution Tools",
    stage: "Stage 5 — Specialist Execution",
    icon: <ToolIcon />,
    color: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    tools: [
      { name: "DataForSEO API", description: "Keyword research, SERP analysis, and backlink data", detail: "Powers keyword discovery, competitor analysis, and ranking tracking across all markets", type: "api" },
      { name: "Google Search Console", description: "Real search performance and index coverage", detail: "OAuth-connected for direct query data, click-through rates, and indexing status", type: "api" },
      { name: "PageSpeed API", description: "Core Web Vitals measurement and optimization guidance", detail: "Automated Lighthouse audits with actionable recommendations for speed improvements", type: "api" },
      { name: "Local Falcon", description: "Geogrid ranking scans across service areas", detail: "7x7 and 9x9 grid scans showing rank at every point in the client's service area", type: "agent" },
      { name: "BrightLocal / Whitespark", description: "Citation management and local directory submissions", detail: "Automated NAP audit, correction submission, and new citation opportunity identification", type: "agent" },
      { name: "Schema.org JSON-LD", description: "Structured data generation and deployment", detail: "LocalBusiness, Service, FAQ, Review, and Event schema markup generation", type: "agent" },
    ],
  },
  {
    title: "Monitoring Tools",
    stage: "Stage 7 — Monitoring & Recurrence",
    icon: <ChartIcon />,
    color: "text-cyan-400",
    borderColor: "border-cyan-500/30",
    tools: [
      { name: "Geogrid Tracking", description: "Recurring ranking grid scans", detail: "Weekly automated scans comparing current rankings to baseline, surfacing wins and declines", type: "agent" },
      { name: "Review Velocity Monitoring", description: "Cross-platform review tracking", detail: "Monitors review count, velocity, sentiment trends, and flags anomalies or sudden drops", type: "agent" },
      { name: "GBP Change Detection", description: "Profile modification alerts", detail: "Detects unauthorized changes to business name, address, phone, hours, categories, and attributes", type: "agent" },
      { name: "Performance Reporting", description: "Automated client report generation", detail: "Compiles ranking, traffic, conversion, and review data into branded client reports", type: "agent" },
    ],
  },
];

// ---- Type Badge ----

function TypeBadge({ type }: { type: Tool["type"] }) {
  const styles = {
    agent: "bg-emerald-500/20 text-emerald-300 ring-emerald-500/30",
    human: "bg-accent-500/20 text-accent-300 ring-accent-500/30",
    api: "bg-violet-500/20 text-violet-300 ring-violet-500/30",
  };
  const labels = { agent: "Agent-Powered", human: "Human-Operated", api: "API Integration" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono ring-1 ${styles[type]}`}>
      {labels[type]}
    </span>
  );
}

// ---- Main Page ----

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-navy-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent-600/10 text-accent-400 text-xs font-mono ring-1 ring-accent-500/20">
              <SearchIcon /> Platform
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
            SEO Tools & Integrations
          </h1>
          <p className="text-navy-400 text-sm max-w-2xl">
            The tools and frameworks powering each stage of the RankedFirst.ai workflow. From 251-rule audits to automated geogrid monitoring — every tool is mapped to a specific stage.
          </p>
        </div>

        {/* Tool Groups */}
        <div className="space-y-8">
          {toolGroups.map((group) => (
            <div key={group.title}>
              <div className="flex items-center gap-3 mb-4">
                <span className={group.color}>{group.icon}</span>
                <div>
                  <h2 className="font-display text-lg font-semibold text-white">{group.title}</h2>
                  <p className="text-xs text-navy-500 font-mono">{group.stage}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {group.tools.map((tool) => (
                  <div
                    key={tool.name}
                    className={`rounded-xl border ${group.borderColor} bg-navy-900/20 p-5 hover:bg-navy-900/40 transition-colors`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-display text-sm font-semibold text-white">{tool.name}</h3>
                      <TypeBadge type={tool.type} />
                    </div>
                    <p className="text-sm text-navy-300 mb-1">{tool.description}</p>
                    {tool.detail && (
                      <p className="text-xs text-navy-500 mt-2">{tool.detail}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 rounded-xl border border-navy-800/60 bg-navy-900/20 p-6 text-center">
          <p className="text-sm text-navy-400 mb-3">
            These tools are integrated into the 7-stage workflow and assigned automatically during task routing.
          </p>
          <Link
            href="/agents"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-600 text-sm font-display font-semibold text-white hover:bg-accent-500 transition-colors"
          >
            See Our Agents
          </Link>
        </div>
      </div>
    </div>
  );
}
