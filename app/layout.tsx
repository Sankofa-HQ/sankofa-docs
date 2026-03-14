import type { Metadata } from "next";
import localFont from "next/font/local";
import { DocsFooter } from "@/components/docs/DocsFooter";
import { DocsHeader } from "@/components/docs/DocsHeader";
import { docsUrl } from "@/lib/site";
import "./globals.css";

const bodyFont = localFont({
  src: "./fonts/dm-sans-latin.woff2",
  variable: "--font-body",
  weight: "100 1000",
  display: "swap",
});

const headingFont = localFont({
  src: "./fonts/space-grotesk-latin.woff2",
  variable: "--font-heading",
  weight: "300 700",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(docsUrl),
  title: {
    default: "Sankofa Docs",
    template: "%s | Sankofa Docs",
  },
  description:
    "Official Sankofa documentation covering usage, Flutter SDK, HTTP ingestion, self-hosting, and enterprise features.",
  openGraph: {
    title: "Sankofa Docs",
    description:
      "Usage, integrations, SDKs, and self-hosting guides for Sankofa.",
    url: docsUrl,
    siteName: "Sankofa Docs",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo-full.png",
        width: 1200,
        height: 630,
        alt: "Sankofa Docs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sankofa Docs",
    description:
      "Official Sankofa documentation for SDK usage, integrations, and self-hosting.",
    images: ["/logo-full.png"],
  },
  icons: {
    icon: "/logo-icon.png",
    apple: "/logo-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${headingFont.variable}`}>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <div className="min-h-screen bg-[#f3f4f6] text-slate-950">
          <DocsHeader />
          {children}
          <DocsFooter />
        </div>
      </body>
    </html>
  );
}
