"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  type Client,
  generateWorkflowStages,
  defaultGrowthRecord,
  saveClient,
} from "@/lib/client-store";

// ---- Helpers ----

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

const INDUSTRIES = [
  "Healthcare",
  "Home Services",
  "Legal",
  "Insurance",
  "Restaurant",
  "Multi-Location",
  "Other",
];

const BUDGETS = [
  "$500 – $1,000/mo",
  "$1,000 – $2,500/mo",
  "$2,500 – $5,000/mo",
  "$5,000 – $10,000/mo",
  "$10,000+/mo",
];

// ---- Icons ----

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ---- Multi-Input Component ----

function MultiInput({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
}) {
  const [input, setInput] = React.useState("");

  function add() {
    const trimmed = input.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
      setInput("");
    }
  }

  function remove(idx: number) {
    onChange(values.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <label className="block text-sm font-display font-medium text-navy-200 mb-1.5">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="flex-1 rounded-lg border border-navy-700 bg-navy-900/50 px-3 py-2 text-sm text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-2 rounded-lg bg-navy-800 text-sm font-medium text-navy-200 hover:bg-navy-700 hover:text-white transition-colors"
        >
          Add
        </button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {values.map((v, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-accent-600/20 text-accent-300 text-xs font-mono"
            >
              {v}
              <button type="button" onClick={() => remove(i)} className="hover:text-white">
                <XIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Step Indicator ----

function Stepper({ step }: { step: number }) {
  const steps = ["Business Info", "SEO Details", "Engagement"];
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((label, i) => {
        const num = i + 1;
        const done = step > num;
        const active = step === num;
        return (
          <React.Fragment key={label}>
            {i > 0 && (
              <div
                className={`hidden sm:block w-12 h-px ${
                  done ? "bg-accent-500" : "bg-navy-700"
                }`}
              />
            )}
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-colors ${
                  done
                    ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40"
                    : active
                    ? "bg-accent-600/30 text-accent-300 ring-1 ring-accent-500/50"
                    : "bg-navy-800 text-navy-500 ring-1 ring-navy-700"
                }`}
              >
                {done ? <CheckIcon className="w-4 h-4" /> : num}
              </div>
              <span
                className={`hidden sm:inline text-xs font-display font-medium ${
                  active ? "text-white" : done ? "text-emerald-400" : "text-navy-500"
                }`}
              >
                {label}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ---- Main Page ----

export default function OnboardPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [submitting, setSubmitting] = React.useState(false);

  // Step 1
  const [businessName, setBusinessName] = React.useState("");
  const [contactName, setContactName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [gbpUrl, setGbpUrl] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [serviceArea, setServiceArea] = React.useState("");
  const [industry, setIndustry] = React.useState("");

  // Step 2
  const [primaryServices, setPrimaryServices] = React.useState<string[]>([]);
  const [targetKeywords, setTargetKeywords] = React.useState<string[]>([]);
  const [competitors, setCompetitors] = React.useState<string[]>([]);
  const [currentChallenges, setCurrentChallenges] = React.useState("");

  // Step 3
  const [budget, setBudget] = React.useState("");
  const [notes, setNotes] = React.useState("");

  function canProceed(): boolean {
    if (step === 1) {
      return !!(businessName.trim() && contactName.trim() && email.trim() && industry);
    }
    if (step === 2) {
      return primaryServices.length > 0;
    }
    return true;
  }

  function handleSubmit() {
    setSubmitting(true);
    const id = uid();
    const client: Client = {
      id,
      businessName: businessName.trim(),
      contactName: contactName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      website: website.trim(),
      gbpUrl: gbpUrl.trim(),
      address: address.trim(),
      serviceArea: serviceArea.trim(),
      industry,
      primaryServices,
      competitors,
      targetKeywords,
      currentChallenges: currentChallenges.trim(),
      budget,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
      status: "Onboarding",
      growthRecord: defaultGrowthRecord(),
      stages: generateWorkflowStages(),
    };
    saveClient(client);
    router.push(`/clients/${id}`);
  }

  const inputClass =
    "w-full rounded-lg border border-navy-700 bg-navy-900/50 px-3 py-2.5 text-sm text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors";
  const selectClass =
    "w-full rounded-lg border border-navy-700 bg-navy-900/50 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-colors appearance-none";

  return (
    <div className="min-h-screen bg-navy-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Back link */}
        <Link
          href="/clients"
          className="inline-flex items-center gap-1.5 text-sm text-navy-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft /> Back to Clients
        </Link>

        {/* Title */}
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
          Onboard New Client
        </h1>
        <p className="text-navy-400 text-sm mb-8">
          Fill in the client details to generate their 7-stage workflow.
        </p>

        <Stepper step={step} />

        {/* Card */}
        <div className="rounded-2xl border border-navy-800/60 bg-navy-900/30 p-6 sm:p-8">
          {/* Step 1 — Business Information */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-display text-lg font-semibold text-white mb-4">
                Business Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-display font-medium text-navy-200 mb-1.5">
                    Business Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Acme Plumbing Co."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-display font-medium text-navy-200 mb-1.5">
                    Contact Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="John Smith"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-display font-medium text-navy-200 mb-1.5">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@acmeplumbing.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-display font-medium text-navy-200 mb-1.5">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-display font-medium text-navy-200 mb-1.5">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://acmeplumbing.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-display font-medium text-navy-200 mb-1.5">
                    Google Business Profile URL
                  </label>
                  <input
                    type="url"
                    value={gbpUrl}
                    onChange={(e) => setGbpUrl(e.target.value)}
                    placeholder="https://business.google.com/..."
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-display font-medium text-navy-200 mb-1.5">
                  Business Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St, Buffalo, NY 14201"
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-display font-medium text-navy-200 mb-1.5">
                    Service Area
                  </label>
                  <input
                    type="text"
                    value={serviceArea}
                    onChange={(e) => setServiceArea(e.target.value)}
                    placeholder="Buffalo, NY metro area"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-display font-medium text-navy-200 mb-1.5">
                    Industry <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select industry…</option>
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — SEO Details */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-display text-lg font-semibold text-white mb-4">
                SEO Details
              </h2>
              <MultiInput
                label="Primary Services *"
                values={primaryServices}
                onChange={setPrimaryServices}
                placeholder="e.g. Emergency plumbing"
              />
              <MultiInput
                label="Target Keywords"
                values={targetKeywords}
                onChange={setTargetKeywords}
                placeholder="e.g. plumber near me"
              />
              <MultiInput
                label="Top 3 Competitors"
                values={competitors}
                onChange={setCompetitors}
                placeholder="e.g. BestPlumbers.com"
              />
              <div>
                <label className="block text-sm font-display font-medium text-navy-200 mb-1.5">
                  Current Challenges
                </label>
                <textarea
                  value={currentChallenges}
                  onChange={(e) => setCurrentChallenges(e.target.value)}
                  rows={3}
                  placeholder="Describe the client's current SEO challenges…"
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {/* Step 3 — Engagement */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-display text-lg font-semibold text-white mb-4">
                Engagement Details
              </h2>
              <div>
                <label className="block text-sm font-display font-medium text-navy-200 mb-1.5">
                  Budget Range
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Select budget range…</option>
                  {BUDGETS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-display font-medium text-navy-200 mb-1.5">
                  Additional Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Any additional context, notes, or special requests…"
                  className={inputClass}
                />
              </div>

              {/* Summary */}
              <div className="rounded-xl border border-navy-700/60 bg-navy-950/50 p-5 mt-6">
                <h3 className="font-display text-sm font-semibold text-navy-200 mb-3">
                  Review Summary
                </h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-navy-400">Business</dt>
                    <dd className="text-white font-medium">{businessName || "—"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-navy-400">Contact</dt>
                    <dd className="text-white">{contactName || "—"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-navy-400">Industry</dt>
                    <dd className="text-white">{industry || "—"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-navy-400">Services</dt>
                    <dd className="text-white">{primaryServices.join(", ") || "—"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-navy-400">Keywords</dt>
                    <dd className="text-white">{targetKeywords.join(", ") || "—"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-navy-400">Budget</dt>
                    <dd className="text-white">{budget || "—"}</dd>
                  </div>
                </dl>
              </div>

              {/* Audit note */}
              <div className="rounded-lg border border-accent-500/20 bg-accent-600/5 px-4 py-3 mt-4">
                <p className="text-xs text-accent-300">
                  After onboarding, a diagnostic audit will be generated automatically covering discoverability, trust, conversion readiness, and follow-up discipline.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-navy-800/60">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-display font-medium text-navy-300 hover:text-white hover:bg-navy-800 transition-colors"
              >
                <ArrowLeft /> Back
              </button>
            ) : (
              <div />
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-display font-semibold bg-accent-600 text-white hover:bg-accent-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Continue <ArrowRight />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-lg text-sm font-display font-semibold bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50 transition-colors"
              >
                {submitting ? "Creating…" : "Create Client & Generate Workflow"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
