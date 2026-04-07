import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { navigation, siteConfig } from "@/lib/site-data";

const companyLinks = [
  { name: "About", href: "/about" },
  { name: "Skills", href: "/skills" },
  { name: "Engagements", href: "/engagements" },
  { name: "Contact", href: "/about#contact" },
];

const resourceLinks = [
  { name: "All Agents", href: "/agents" },
  { name: "All Services", href: "/services" },
  { name: "All Industries", href: "/industries" },
];

const columns = [
  {
    title: "Services",
    links: navigation.services.filter((s) => s.href !== "/services"),
  },
  {
    title: "Agents",
    links: navigation.agents.filter((a) => a.href !== "/agents"),
  },
  {
    title: "Industries",
    links: navigation.industries.filter((i) => i.href !== "/industries"),
  },
  { title: "Company", links: companyLinks },
  { title: "Resources", links: resourceLinks },
];

export function Footer() {
  return (
    <footer className="border-t border-navy-800 bg-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section */}
        <div className="py-14 grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr]">
          {/* Brand column */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative h-8 w-8 rounded-md overflow-hidden ring-1 ring-navy-700">
                <Image
                  src="/logo.jpeg"
                  alt="RankedFirst.ai logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-display font-bold text-lg text-white">
                RankedFirst
                <span className="text-accent-400">.ai</span>
              </span>
            </Link>
            <p className="text-sm text-navy-400 leading-relaxed max-w-xs">
              AI-native local SEO agency. Autonomous agents that execute — not
              just advise.
            </p>
            <div className="pt-1">
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-sm text-navy-400 hover:text-accent-400 transition-colors"
              >
                {siteConfig.email}
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-xs font-mono font-semibold uppercase tracking-widest text-navy-500 mb-4">
                  {col.title}
                </h3>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-navy-400 hover:text-navy-100 transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-navy-800/60 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-navy-500">
            © {new Date().getFullYear()} RankedFirst.ai. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="text-xs text-navy-500 hover:text-navy-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-navy-500 hover:text-navy-300 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
