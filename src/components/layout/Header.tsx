"use client";

import * as React from "react";
import Link from "next/link";
import { navigation } from "@/lib/site-data";
import { Button } from "@/components/ui/Button";
import AuthButton from "@/components/layout/AuthButton";

// ---- Icons ----
function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
    >
      <path
        d="M2 4.5L6 8.5L10 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M3 6H17M3 10H17M3 14H17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M5 5L15 15M15 5L5 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---- Logo ----
function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
      <div className="relative h-8 w-8 rounded-md overflow-hidden ring-1 ring-navy-700 group-hover:ring-accent-600 transition-all duration-200">
        <img
          src="/logo.svg"
          alt="RankedFirst.ai logo"
          width={32}
          height={32}
          className="object-cover w-full h-full"
        />
      </div>
      <span className="font-display font-bold text-lg text-white leading-none">
        RankedFirst
        <span className="text-accent-400">.ai</span>
      </span>
    </Link>
  );
}

// ---- Dropdown Menu ----
type DropdownItem = {
  name: string;
  href: string;
  description: string;
};

function NavDropdown({
  items,
  isOpen,
}: {
  items: DropdownItem[];
  isOpen: boolean;
}) {
  if (!isOpen) return null;
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 z-50">
      {/* Arrow */}
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-navy-900 border-l border-t border-navy-700" />
      <div className="rounded-xl border border-navy-700 bg-navy-900 shadow-2xl shadow-black/50 overflow-hidden">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col px-4 py-3 hover:bg-navy-800 transition-colors group border-b border-navy-800 last:border-0"
          >
            <span className="text-sm font-display font-medium text-navy-100 group-hover:text-white transition-colors">
              {item.name}
            </span>
            <span className="text-xs text-navy-400 mt-0.5 group-hover:text-navy-300 transition-colors">
              {item.description}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ---- Theme Toggle ----
function ThemeToggle() {
  const [isDark, setIsDark] = React.useState(true);

  React.useEffect(() => {
    const root = document.documentElement;
    setIsDark(root.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="h-8 w-8 rounded-lg flex items-center justify-center text-navy-400 hover:text-navy-100 hover:bg-navy-800 transition-all duration-200"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

// ---- Main Header ----
export function Header() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(
    null
  );
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close mobile on resize
  React.useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const dropdownMap: Record<string, DropdownItem[]> = {
    Services: navigation.services,
    Agents: navigation.agents,
    Industries: navigation.industries,
  };

  return (
    <header className="sticky top-0 z-50 border-b border-navy-800/60 bg-navy-950/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Nav */}
          <nav
            className="hidden lg:flex items-center gap-1"
            ref={dropdownRef}
          >
            {navigation.main.map((item) => (
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <button
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === item.name ? null : item.name
                      )
                    }
                    className={[
                      "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-display font-medium transition-all duration-150",
                      activeDropdown === item.name
                        ? "text-white bg-navy-800"
                        : "text-navy-300 hover:text-white hover:bg-navy-800/60",
                    ].join(" ")}
                  >
                    {item.name}
                    <ChevronDown
                      className={[
                        "transition-transform duration-200",
                        activeDropdown === item.name ? "rotate-180" : "",
                      ].join(" ")}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="px-3 py-2 rounded-lg text-sm font-display font-medium text-navy-300 hover:text-white hover:bg-navy-800/60 transition-all duration-150"
                  >
                    {item.name}
                  </Link>
                )}
                {item.hasDropdown && (
                  <NavDropdown
                    items={dropdownMap[item.name] || []}
                    isOpen={activeDropdown === item.name}
                  />
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Right */}
          <div className="hidden lg:flex items-center gap-2">
            <ThemeToggle />
            <AuthButton />
            <Button href="#contact" variant="primary" size="sm">
              Get Started
            </Button>
          </div>

          {/* Mobile Controls */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="h-9 w-9 flex items-center justify-center rounded-lg text-navy-300 hover:text-white hover:bg-navy-800 transition-all"
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-navy-800 bg-navy-950">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navigation.main.map((item) => (
              <div key={item.name}>
                {item.hasDropdown ? (
                  <>
                    <button
                      onClick={() =>
                        setActiveDropdown(
                          activeDropdown === item.name ? null : item.name
                        )
                      }
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-display font-medium text-navy-200 hover:text-white hover:bg-navy-800 transition-all"
                    >
                      {item.name}
                      <ChevronDown
                        className={[
                          "transition-transform duration-200",
                          activeDropdown === item.name ? "rotate-180" : "",
                        ].join(" ")}
                      />
                    </button>
                    {activeDropdown === item.name && (
                      <div className="ml-3 mt-1 space-y-0.5 border-l border-navy-800 pl-3">
                        {dropdownMap[item.name]?.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => {
                              setMobileOpen(false);
                              setActiveDropdown(null);
                            }}
                            className="block px-3 py-2 rounded-lg text-sm text-navy-300 hover:text-white hover:bg-navy-800/50 transition-all"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-sm font-display font-medium text-navy-200 hover:text-white hover:bg-navy-800 transition-all"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-3 mt-3 border-t border-navy-800 flex flex-col gap-2">
              <AuthButton />
              <Button href="#contact" variant="primary" size="md" className="w-full justify-center">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
