import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import {
  services,
  agents,
  industries,
  tools,
  engagements,
} from "@/lib/site-data";

// ---- Section wrapper ----
function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={["py-20 sm:py-28", className].join(" ")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

// ---- Icons ----
function SearchIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      className="text-accent-400"
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M20 20l-3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      className="text-purple-400"
    >
      <path
        d="M12 2l2.4 7.2H22l-6.2 4.5 2.4 7.3L12 17l-6.2 4 2.4-7.3L2 9.2h7.6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      className="text-pink-400"
    >
      <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <path
        d="M3 8H13M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8l3.5 3.5L13 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---- Service Icon map ----
const serviceIconMap: Record<string, React.ReactNode> = {
  search: <SearchIcon />,
  sparkles: <SparklesIcon />,
  share: <ShareIcon />,
};

const serviceColorMap: Record<
  string,
  { icon: string; border: string; tag: string }
> = {
  accent: {
    icon: "bg-accent-900/40 border-accent-800/40",
    border: "hover:border-accent-700/60",
    tag: "text-accent-400",
  },
  purple: {
    icon: "bg-purple-900/40 border-purple-800/40",
    border: "hover:border-purple-700/60",
    tag: "text-purple-400",
  },
  pink: {
    icon: "bg-pink-900/40 border-pink-800/40",
    border: "hover:border-pink-700/60",
    tag: "text-pink-400",
  },
};

// ============================================================
// HERO SECTION
// ============================================================
function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-32">
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(37 99 235 / 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(37 99 235 / 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />
      {/* Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at center, rgb(37 99 235 / 0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at center, rgb(139 92 246 / 0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top badge */}
        <div className="flex justify-center mb-8">
          <Badge variant="beta" dot pulse>
            AI-native local SEO — autonomous agents
          </Badge>
        </div>

        {/* Headline */}
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight text-white"
            style={{
              background:
                "linear-gradient(135deg, #ffffff 0%, #93c5fd 40%, #c4b5fd 70%, #f9a8d4 100%)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "gradient-shift 8s ease-in-out infinite",
            }}
          >
            Local visibility<br />for the AI era.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-navy-300 leading-relaxed max-w-2xl mx-auto">
            Autonomous agents that handle GBP optimization, geogrid analysis,
            citation management, review monitoring, and AI visibility — 24/7,
            without the manual overhead.
          </p>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button href="#contact" variant="primary" size="lg">
            Start a Conversation
          </Button>
          <Button href="/agents" variant="secondary" size="lg">
            See Our Agents
            <ArrowRight />
          </Button>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-3 gap-4 max-w-xl mx-auto">
          {[
            { value: "36", label: "Skills" },
            { value: "12", label: "Agents" },
            { value: "12", label: "Tool Integrations" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center p-4 rounded-xl border border-navy-800 bg-navy-900/50 text-center"
            >
              <span className="font-display font-extrabold text-3xl sm:text-4xl text-white tabular-nums">
                {stat.value}
              </span>
              <span className="mt-1 text-xs sm:text-sm text-navy-400 font-mono uppercase tracking-wide">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SERVICES SECTION
// ============================================================
function ServicesSection() {
  return (
    <Section id="services" className="border-t border-navy-800/40">
      <SectionHeader
        label="Visibility Channels"
        title="Three surfaces. One strategy."
        description="Local search has evolved beyond Google. We cover every surface where your customers discover local businesses."
      />

      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
        {services.map((service) => {
          const colorConfig = serviceColorMap[service.color] ?? serviceColorMap.accent;
          return (
            <div
              key={service.slug}
              className={[
                "group relative flex flex-col rounded-2xl border border-navy-800 bg-navy-900/50 p-6 transition-all duration-300",
                "hover:bg-navy-900 hover:shadow-xl hover:shadow-black/30",
                colorConfig.border,
              ].join(" ")}
            >
              {/* Icon */}
              <div
                className={[
                  "w-11 h-11 rounded-xl border flex items-center justify-center mb-5",
                  colorConfig.icon,
                ].join(" ")}
              >
                {serviceIconMap[service.icon]}
              </div>

              {/* Content */}
              <h3 className="font-display font-bold text-lg text-white mb-2">
                {service.name}
              </h3>
              <p className="text-sm text-navy-400 leading-relaxed mb-5">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-6 flex-1">
                {service.features.slice(0, 5).map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <span className="mt-0.5 text-emerald-400 shrink-0">
                      <CheckIcon />
                    </span>
                    <span className="text-xs text-navy-300">{feature}</span>
                  </li>
                ))}
                {service.features.length > 5 && (
                  <li className="text-xs text-navy-500 pl-5">
                    +{service.features.length - 5} more
                  </li>
                )}
              </ul>

              {/* Link */}
              <Link
                href={`/services/${service.slug}`}
                className={[
                  "mt-auto inline-flex items-center gap-1.5 text-sm font-display font-medium transition-colors",
                  colorConfig.tag,
                  "hover:opacity-80",
                ].join(" ")}
              >
                Learn more <ArrowRight />
              </Link>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

// ============================================================
// AGENTS SECTION
// ============================================================
function AgentsSection() {
  return (
    <Section
      id="agents"
      className="bg-gradient-to-b from-navy-950 via-navy-900/20 to-navy-950"
    >
      <SectionHeader
        label="Autonomous Agents"
        title="Agents that execute, not just advise."
        description="Each agent is purpose-built for a specific local SEO workflow. They run on schedule, pull live data, and deliver findings — not just recommendations."
      />

      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {agents.map((agent) => (
          <Link
            key={agent.slug}
            href={`/agents/${agent.slug}`}
            className="group relative flex flex-col rounded-xl border border-navy-800 bg-navy-900/40 p-5 transition-all duration-300 hover:border-accent-700/50 hover:bg-navy-900 hover:shadow-lg hover:shadow-black/30"
          >
            {/* Agent name — mono */}
            <div className="mb-3">
              <span className="font-mono text-xs font-semibold text-accent-400 bg-accent-950/40 border border-accent-900/40 px-2 py-0.5 rounded-md">
                {agent.slug}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-display font-bold text-base text-white leading-snug mb-2 group-hover:text-accent-100 transition-colors">
              {agent.name}
            </h3>

            {/* Tagline */}
            <p className="text-xs font-mono text-navy-400 mb-3 italic">
              {agent.tagline}
            </p>

            {/* Description */}
            <p className="text-sm text-navy-400 leading-relaxed flex-1 mb-4">
              {agent.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between mt-auto">
              <Badge variant="active" dot pulse>
                Active
              </Badge>
              <span className="text-xs text-accent-500 font-mono group-hover:text-accent-400 transition-colors">
                {agent.dataSources.length} sources →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Button href="/agents" variant="secondary" size="md">
          View All Agents
          <ArrowRight />
        </Button>
      </div>
    </Section>
  );
}

// ============================================================
// HOW IT WORKS SECTION
// ============================================================
const howItWorksSteps = [
  {
    number: "01",
    title: "Connect",
    description:
      "Add your Google Business Profile locations and connect your existing tools — Local Falcon, BrightLocal, GSC, and more. Setup takes minutes.",
  },
  {
    number: "02",
    title: "Configure",
    description:
      "Choose which agents run for each location. Set audit cadences, notification thresholds, and reporting preferences. Full control, zero complexity.",
  },
  {
    number: "03",
    title: "Execute",
    description:
      "Agents run on schedule, pulling live data from connected tools, applying domain knowledge, and surfacing findings ranked by impact.",
  },
  {
    number: "04",
    title: "Review",
    description:
      "Human-in-the-loop by design. Review agent findings, approve recommendations, and track execution — all in one place.",
  },
];

function HowItWorksSection() {
  return (
    <Section id="how-it-works" className="border-t border-navy-800/40">
      <SectionHeader
        label="How It Works"
        title="Four steps to autonomous local SEO."
        description="No black boxes. Every agent run is transparent, reviewable, and auditable."
      />

      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {howItWorksSteps.map((step, index) => (
          <div
            key={step.number}
            className="relative flex flex-col rounded-2xl border border-navy-800 bg-navy-900/30 p-6"
          >
            {/* Connector line (except last) */}
            {index < howItWorksSteps.length - 1 && (
              <div className="hidden lg:block absolute top-9 -right-2.5 w-5 h-px bg-gradient-to-r from-navy-700 to-navy-600 z-10" />
            )}

            {/* Step number */}
            <div className="font-mono font-bold text-4xl text-navy-800 leading-none mb-4 select-none">
              {step.number}
            </div>

            {/* Title */}
            <h3 className="font-display font-bold text-base text-white mb-2">
              {step.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-navy-400 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ============================================================
// INDUSTRIES SECTION
// ============================================================
function IndustriesSection() {
  return (
    <Section
      id="industries"
      className="bg-gradient-to-b from-navy-950 via-navy-900/10 to-navy-950 border-t border-navy-800/40"
    >
      <SectionHeader
        label="Industries"
        title="Built for your vertical."
        description="Local search strategy isn't one-size-fits-all. We specialize in the verticals where local visibility matters most."
      />

      <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {industries.map((industry) => (
          <Link
            key={industry.slug}
            href={`/industries/${industry.slug}`}
            className="group flex flex-col items-center text-center p-5 rounded-xl border border-navy-800 bg-navy-900/30 transition-all duration-200 hover:border-accent-700/50 hover:bg-navy-900/60 hover:shadow-md"
          >
            <span className="text-3xl mb-3" role="img" aria-label={industry.name}>
              {industry.icon}
            </span>
            <span className="font-display font-semibold text-sm text-navy-200 group-hover:text-white transition-colors leading-snug">
              {industry.name}
            </span>
            <span className="mt-1.5 text-xs text-navy-500 leading-snug line-clamp-2">
              {industry.description}
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Button href="/industries" variant="ghost" size="md">
          All Industries <ArrowRight />
        </Button>
      </div>
    </Section>
  );
}

// ============================================================
// TOOLS & INTEGRATIONS SECTION
// ============================================================
function ToolsSection() {
  // Double the tools array for infinite scroll illusion
  const doubled = [...tools, ...tools];

  return (
    <Section id="tools" className="border-t border-navy-800/40 overflow-hidden">
      <SectionHeader
        label="Integrations"
        title="Connected to the tools you already use."
        description="Our agents pull data from the platforms that matter for local SEO — no new dashboards, no manual exports."
      />

      {/* Scrolling row */}
      <div className="mt-12 relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-navy-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-navy-950 to-transparent z-10 pointer-events-none" />

        <div
          className="flex gap-3 w-max"
          style={{
            animation: "scroll-x 30s linear infinite",
          }}
        >
          {doubled.map((tool, idx) => (
            <div
              key={`${tool.name}-${idx}`}
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-navy-800 bg-navy-900/60 shrink-0"
            >
              {/* Color dot */}
              <span
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: tool.color }}
              />
              <span className="text-sm font-display font-medium text-navy-200 whitespace-nowrap">
                {tool.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll-x {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </Section>
  );
}

// ============================================================
// ENGAGEMENTS SECTION
// ============================================================
function EngagementsSection() {
  return (
    <Section
      id="engagements"
      className="border-t border-navy-800/40 bg-gradient-to-b from-navy-950 to-navy-900/30"
    >
      <SectionHeader
        label="Engagements"
        title="Work with us your way."
        description="From one-time audits to fully managed execution. Every engagement is powered by the same autonomous agent infrastructure."
      />

      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {engagements.map((engagement) => (
          <div
            key={engagement.name}
            className={[
              "relative flex flex-col rounded-2xl p-6 transition-all duration-300",
              engagement.featured
                ? "border-2 border-accent-600 bg-gradient-to-b from-accent-950/30 to-navy-900/60 shadow-lg shadow-accent-900/20"
                : "border border-navy-800 bg-navy-900/30 hover:border-navy-700 hover:bg-navy-900/60",
            ].join(" ")}
          >
            {engagement.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-accent-600 text-white shadow-sm">
                  ★ Most Popular
                </span>
              </div>
            )}

            <h3
              className={[
                "font-display font-bold text-lg leading-snug mb-3",
                engagement.featured ? "text-white" : "text-navy-100",
              ].join(" ")}
            >
              {engagement.name}
            </h3>

            <p className="text-sm text-navy-400 leading-relaxed flex-1 mb-5">
              {engagement.description}
            </p>

            <div className="mt-auto">
              <div className="text-xs text-navy-500 mb-4">
                <span className="font-mono uppercase tracking-wide">Best for: </span>
                <span className="text-navy-300">{engagement.bestFor}</span>
              </div>
              <Button
                href="#contact"
                variant={engagement.featured ? "primary" : "secondary"}
                size="sm"
                className="w-full justify-center"
              >
                Get Started
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ============================================================
// CTA SECTION
// ============================================================
function CTASection() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-navy-800/40 py-24"
    >
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgb(37 99 235 / 0.12) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(37 99 235 / 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(37 99 235 / 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <Badge variant="active" dot pulse className="mb-6">
          Now accepting new clients
        </Badge>

        <h2 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl text-white leading-tight tracking-tight">
          Ready to rank{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            first?
          </span>
        </h2>

        <p className="mt-5 text-lg text-navy-300 leading-relaxed">
          Start with a free visibility audit. We&apos;ll show you exactly where
          you rank, where you&apos;re losing to competitors, and what it would
          take to close the gap.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button href="mailto:hello@rankedfirst.ai" variant="primary" size="lg">
            Start a Conversation
          </Button>
          <Button href="/services" variant="secondary" size="lg">
            Explore Services
          </Button>
        </div>

        <p className="mt-5 text-xs text-navy-500">
          No commitment required. Audit turnaround: 5 business days.
        </p>
      </div>
    </section>
  );
}

// ============================================================
// PAGE
// ============================================================
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <AgentsSection />
      <HowItWorksSection />
      <IndustriesSection />
      <ToolsSection />
      <EngagementsSection />
      <CTASection />
    </>
  );
}
