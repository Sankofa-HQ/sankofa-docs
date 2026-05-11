/**
 * Schema.org JSON-LD payload builders.
 *
 * Every builder returns a plain object that gets serialized into a
 * `<script type="application/ld+json">` tag. Keep payloads minimal but
 * complete — Google's structured-data tooling rewards explicit fields and
 * penalizes incorrect or partial markup.
 */

import { docsUrl, mainSiteUrl } from "./site";
import type { DocPage } from "./content";
import { getSection } from "./nav.config";

const ORG_ID = `${mainSiteUrl}/#organization`;
const SITE_ID = `${docsUrl}/#website`;
const LOGO_URL = `${docsUrl}/logo-icon.png`;
const FULL_LOGO_URL = `${docsUrl}/logo-full.png`;

export type JsonLd = Record<string, unknown>;

/** Site-wide Organization graph — emitted in <head> on every page. */
export function organizationLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Sankofa",
    legalName: "Sankofa Systems",
    url: mainSiteUrl,
    logo: {
      "@type": "ImageObject",
      url: FULL_LOGO_URL,
      width: 1024,
      height: 270,
    },
    sameAs: [
      "https://github.com/sankofa-hq",
      "https://twitter.com/sankofadev",
      "https://www.linkedin.com/company/sankofa-systems",
    ],
    foundingDate: "2025",
    description:
      "Sankofa is the unified observability + experimentation platform: Vision, Plan, Catch, Switch, Deploy, Analytics, Pulse, and Remote Config — one engine, eight products.",
  };
}

/** Site-wide WebSite graph with a Sitelinks Search Box action. */
export function websiteLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    url: docsUrl,
    name: "Sankofa Docs",
    description:
      "Developer documentation for Sankofa — guides, references, and SDK docs for the unified product, engineering, and growth platform.",
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${docsUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Per-page TechArticle graph. */
export function articleLd(page: DocPage, sectionTitle: string | undefined): JsonLd {
  const url = `${docsUrl}${page.href}`;
  const ogImage = `${docsUrl}/og/${[page.sectionKey, ...page.slugParts].join("/")}.png`;
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: page.frontmatter.title,
    description: page.frontmatter.description,
    inLanguage: "en-US",
    isPartOf: { "@id": SITE_ID },
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    image: {
      "@type": "ImageObject",
      url: ogImage,
      width: 1200,
      height: 630,
    },
    articleSection: sectionTitle,
    keywords: deriveKeywords(page),
    proficiencyLevel: "Expert",
    dependencies: page.frontmatter.sdks?.join(", "),
  };
}

/** Per-page BreadcrumbList graph. */
export function breadcrumbsLd(
  page: DocPage,
  crumbs: { href: string; label: string }[]
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${docsUrl}${page.href}#breadcrumbs`,
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: `${docsUrl}${c.href}`,
    })),
  };
}

/** Build a keyword list from the page + section. Stable, deterministic. */
export function deriveKeywords(page: DocPage): string[] {
  const section = getSection(page.sectionKey);
  const base = [
    "Sankofa",
    section?.title,
    page.frontmatter.title,
    ...(page.frontmatter.sdks ?? []),
  ].filter(Boolean) as string[];
  // Pull short multi-word phrases from the description ("feature flag", "remote
  // config", etc.) — common SEO ranking signals.
  const phrases = (page.frontmatter.description.match(/\b[a-z][a-z]+(?:[ -][a-z]+){0,2}\b/gi) ?? [])
    .filter((p) => p.length >= 6 && p.length <= 32)
    .slice(0, 10);
  return Array.from(new Set([...base, ...phrases]));
}

/** Inline-script-friendly JSON.stringify with escaped </script>. */
export function stringifyLd(value: JsonLd | JsonLd[]): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
