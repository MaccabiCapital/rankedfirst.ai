import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "./light-mode.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rankedfirst.ai"),
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
  alternates: {
    canonical: "https://rankedfirst.ai",
  },
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
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "RankedFirst.ai",
  url: "https://rankedfirst.ai",
  description:
    "AI-native local SEO agency. Autonomous agents handle GBP optimization, geogrid analysis, citation management, review monitoring, and AI visibility.",
  email: "hello@rankedfirst.ai",
  sameAs: [],
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('rankedfirst-theme');if(t==='light'){document.documentElement.classList.remove('dark');document.documentElement.classList.add('light');}}catch(e){}})();`,
          }}
        />
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
        {/* Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </body>
    </html>
  );
}
