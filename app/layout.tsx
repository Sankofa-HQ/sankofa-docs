import type { Metadata, Viewport } from "next";
import { ThemeProvider, THEME_BOOTSTRAP_SCRIPT } from "@/components/layout/ThemeProvider";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { docsUrl, mainSiteUrl } from "@/lib/site";
import { organizationLd, websiteLd, stringifyLd } from "@/lib/seo";
import "./globals.css";

const TITLE = "Sankofa Docs — One platform. Eight products.";
const DESCRIPTION =
  "Developer documentation for Sankofa — the unified platform for product, engineering, and growth teams. Guides, SDK references, and an end-to-end API surface for Vision, Plan, Catch, Switch, Deploy, Analytics, Pulse, and Remote Config.";

export const metadata: Metadata = {
  metadataBase: new URL(docsUrl),
  title: {
    default: TITLE,
    template: "%s · Sankofa Docs",
  },
  description: DESCRIPTION,
  applicationName: "Sankofa Docs",
  generator: "Next.js + MDX (Sankofa Docs)",
  referrer: "strict-origin-when-cross-origin",
  authors: [{ name: "Sankofa Systems", url: mainSiteUrl }],
  creator: "Sankofa Systems",
  publisher: "Sankofa Systems",
  category: "technology",
  keywords: [
    "Sankofa",
    "Sankofa docs",
    "Sankofa SDK",
    "product analytics",
    "feature flags",
    "remote config",
    "session replay",
    "crash detection",
    "OTA deploy",
    "OTA release",
    "auto rollback",
    "experiments",
    "A/B testing",
    "developer documentation",
    "Vision OKRs",
    "engineering platform",
  ],
  alternates: {
    canonical: docsUrl,
    types: {
      "application/atom+xml": [
        { url: "/resources/changelog/feed.xml", title: "Sankofa changelog" },
      ],
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: docsUrl,
    siteName: "Sankofa Docs",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    site: "@sankofadev",
    creator: "@sankofadev",
  },
  icons: {
    icon: [
      { url: "/logo-icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/logo-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/logo-icon.png"],
  },
  manifest: "/manifest.webmanifest",
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
  verification: {
    // Drop real verification tokens here as env vars when registering with
    // Google Search Console / Bing Webmaster / Yandex.
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0E1014" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-US" suppressHydrationWarning>
      <head>
        <script
          // Set data-theme before first paint to avoid FOUC.
          dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP_SCRIPT }}
        />
        <link
          rel="alternate"
          type="application/atom+xml"
          title="Sankofa changelog"
          href="/resources/changelog/feed.xml"
        />
        <link rel="preconnect" href={mainSiteUrl} crossOrigin="" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: stringifyLd(organizationLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: stringifyLd(websiteLd()) }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <ThemeProvider>
          <Nav />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
