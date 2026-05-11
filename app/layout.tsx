import type { Metadata } from "next";
import { ThemeProvider, THEME_BOOTSTRAP_SCRIPT } from "@/components/layout/ThemeProvider";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { docsUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(docsUrl),
  title: {
    default: "Sankofa Docs",
    template: "%s · Sankofa Docs",
  },
  description:
    "Build, ship, observe, and roll back faster with Sankofa — one platform for Vision, Plan, Catch, Switch, Deploy, Analytics, Pulse, and Remote Config.",
  applicationName: "Sankofa Docs",
  keywords: [
    "Sankofa",
    "product analytics",
    "feature flags",
    "remote config",
    "session replay",
    "crash detection",
    "OTA deploy",
    "experiments",
  ],
  openGraph: {
    title: "Sankofa Docs",
    description:
      "Developer documentation for Sankofa — the unified platform for product, engineering, and growth teams.",
    url: docsUrl,
    siteName: "Sankofa Docs",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sankofa Docs",
    description: "Developer documentation for Sankofa.",
  },
  icons: {
    icon: "/logo-icon.png",
    apple: "/logo-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
