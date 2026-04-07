import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "RankedFirst.ai — Local Visibility for the AI Era",
    template: "%s | RankedFirst.ai",
  },
  description:
    "AI-native local SEO agency. Autonomous agents handle GBP optimization, geogrid analysis, citation management, review monitoring, and AI visibility — 24/7.",
  keywords: [
    "local SEO",
    "Google Business Profile",
    "AI SEO",
    "local search",
    "geogrid analysis",
    "local AI visibility",
  ],
  authors: [{ name: "RankedFirst.ai" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rankedfirst.ai",
    siteName: "RankedFirst.ai",
    title: "RankedFirst.ai — Local Visibility for the AI Era",
    description:
      "AI-native local SEO agency. Autonomous agents handle GBP optimization, geogrid analysis, citation management, review monitoring, and AI visibility — 24/7.",
  },
  twitter: {
    card: "summary_large_image",
    title: "RankedFirst.ai — Local Visibility for the AI Era",
    description:
      "AI-native local SEO agency. Autonomous agents handle GBP optimization, geogrid analysis, citation management, review monitoring, and AI visibility — 24/7.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} dark h-full`}
    >
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,500,700,800,900&f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-navy-950 text-navy-50 antialiased font-body">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
