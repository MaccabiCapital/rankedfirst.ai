"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { industries, services } from "@/lib/site-data";

const serviceOptions = services.map((s) => s.name);
const industryOptions = industries.map((i) => i.name);

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const toggleService = (svc: string) => {
    setSelectedServices((prev) =>
      prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-navy-800)_0%,_transparent_60%)] opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8 font-mono">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-navy-200">Contact</span>
          </nav>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="h-px w-6 bg-accent-500 inline-block" />
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-accent-400">Get In Touch</span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-white leading-tight mb-6">
              Let's talk about your{" "}
              <span className="text-accent-400">local visibility</span>
            </h1>
            <p className="text-lg sm:text-xl text-navy-300 leading-relaxed">
              Tell us about your business and where you want to rank. We'll come back with a direct assessment of your situation and what it would take to get you there.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-8 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">

            {/* Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="bg-navy-900 border border-accent-500/30 rounded-2xl p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h2 className="font-display font-bold text-2xl text-white mb-4">Message received</h2>
                  <p className="text-navy-300 mb-8">
                    We'll review your submission and get back to you within one business day with a direct, specific response — not a generic sales pitch.
                  </p>
                  <Button href="/" variant="secondary">
                    Back to home
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="bg-navy-900 border border-navy-800 rounded-2xl p-8 space-y-6"
                >
                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-display font-semibold text-navy-200 mb-2">
                        Full name <span className="text-accent-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Jane Smith"
                        className="w-full bg-navy-950 border border-navy-700 focus:border-accent-500 rounded-lg px-4 py-3 text-white placeholder-navy-500 text-sm outline-none transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-display font-semibold text-navy-200 mb-2">
                        Email <span className="text-accent-400">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="jane@example.com"
                        className="w-full bg-navy-950 border border-navy-700 focus:border-accent-500 rounded-lg px-4 py-3 text-white placeholder-navy-500 text-sm outline-none transition-colors"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-display font-semibold text-navy-200 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-navy-950 border border-navy-700 focus:border-accent-500 rounded-lg px-4 py-3 text-white placeholder-navy-500 text-sm outline-none transition-colors"
                      />
                    </div>

                    {/* Company */}
                    <div>
                      <label className="block text-sm font-display font-semibold text-navy-200 mb-2">
                        Business / Company <span className="text-accent-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Acme Plumbing Co."
                        className="w-full bg-navy-950 border border-navy-700 focus:border-accent-500 rounded-lg px-4 py-3 text-white placeholder-navy-500 text-sm outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Industry */}
                  <div>
                    <label className="block text-sm font-display font-semibold text-navy-200 mb-2">
                      Industry
                    </label>
                    <select className="w-full bg-navy-950 border border-navy-700 focus:border-accent-500 rounded-lg px-4 py-3 text-white text-sm outline-none transition-colors appearance-none cursor-pointer">
                      <option value="" className="text-navy-500">Select your industry...</option>
                      {industryOptions.map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Service Interest */}
                  <div>
                    <label className="block text-sm font-display font-semibold text-navy-200 mb-3">
                      What are you interested in?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {serviceOptions.map((svc) => (
                        <button
                          key={svc}
                          type="button"
                          onClick={() => toggleService(svc)}
                          className={`px-4 py-2 rounded-lg text-sm font-display font-medium border transition-all duration-150 ${
                            selectedServices.includes(svc)
                              ? "bg-accent-600 border-accent-500 text-white"
                              : "bg-navy-950 border-navy-700 text-navy-300 hover:border-navy-500 hover:text-white"
                          }`}
                        >
                          {svc}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-display font-semibold text-navy-200 mb-2">
                      Tell us about your situation <span className="text-accent-400">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Where are you ranking now? What's the competitive landscape like? Any specific pain points — reviews, citations, GBP issues, or AI visibility gaps?"
                      className="w-full bg-navy-950 border border-navy-700 focus:border-accent-500 rounded-lg px-4 py-3 text-white placeholder-navy-500 text-sm outline-none transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-display font-medium rounded-lg bg-accent-600 text-white hover:bg-accent-500 border border-accent-600 hover:border-accent-500 shadow-sm shadow-accent-900/50 transition-all duration-200 w-full sm:w-auto"
                    >
                      Send message
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <p className="text-xs text-navy-500 mt-3">
                      We respond within one business day. No auto-responders.
                    </p>
                  </div>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Direct contact */}
              <div className="bg-navy-900 border border-navy-800 rounded-xl p-6">
                <h3 className="font-display font-bold text-white mb-4">Prefer to reach out directly?</h3>
                <div className="space-y-3">
                  <a
                    href="mailto:hello@rankedfirst.ai"
                    className="flex items-center gap-3 text-navy-300 hover:text-accent-300 transition-colors text-sm group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-accent-500/10 text-accent-400 flex items-center justify-center shrink-0 group-hover:bg-accent-500/20 transition-colors">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <path d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    hello@rankedfirst.ai
                  </a>
                </div>
              </div>

              {/* What to expect */}
              <div className="bg-navy-900 border border-navy-800 rounded-xl p-6">
                <h3 className="font-display font-bold text-white mb-4">What to expect</h3>
                <ul className="space-y-3">
                  {[
                    "Response within 1 business day",
                    "Direct conversation — no sales script",
                    "Honest assessment of your situation",
                    "Clear recommendation, not upsell",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-navy-300">
                      <svg className="w-4 h-4 mt-0.5 text-accent-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trust signal */}
              <div className="bg-navy-900 border border-accent-500/20 rounded-xl p-6">
                <p className="text-sm text-navy-300 leading-relaxed italic">
                  "We don't do discovery calls that are really sales calls. If we can't help you, we'll tell you why."
                </p>
                <div className="mt-3 text-xs font-mono text-navy-500">— RankedFirst.ai team</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
