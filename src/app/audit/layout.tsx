import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Local SEO Audit — 8-Dimension Analysis",
  description:
    "Get a comprehensive local SEO audit covering rankings, GBP profile, reviews, citations, on-page SEO, AI visibility, and competitive analysis — with an action plan to close gaps.",
};

export default function AuditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
