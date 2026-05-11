import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/docs/PageShell";
import { MdxRenderer } from "@/components/mdx/MdxRenderer";
import { docsUrl } from "@/lib/site";
import { getAllPages, getBreadcrumbs, getPageBySlug } from "@/lib/content";
import { getSection } from "@/lib/nav.config";
import { articleLd, breadcrumbsLd, deriveKeywords, stringifyLd } from "@/lib/seo";
import fs from "node:fs";

export function generateStaticParams() {
  return getAllPages().map((page) => ({
    slug: [page.sectionKey, ...page.slugParts].filter(Boolean),
  }));
}

function getFileTimes(sourcePath: string | undefined): {
  published?: string;
  modified?: string;
} {
  if (!sourcePath) return {};
  try {
    const stat = fs.statSync(sourcePath);
    return {
      published: stat.birthtime.toISOString(),
      modified: stat.mtime.toISOString(),
    };
  } catch {
    return {};
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  if (!page) return {};
  const ogPath = `/og/${[page.sectionKey, ...page.slugParts].join("/")}.png`;
  const url = `${docsUrl}${page.href}`;
  const section = getSection(page.sectionKey);
  const { published, modified } = getFileTimes(page.sourcePath);
  const keywords = deriveKeywords(page);

  return {
    title: page.frontmatter.title,
    description: page.frontmatter.description,
    keywords,
    category: section?.title,
    alternates: {
      canonical: url,
      languages: { "en-US": url },
    },
    openGraph: {
      title: `${page.frontmatter.title} · Sankofa Docs`,
      description: page.frontmatter.description,
      url,
      siteName: "Sankofa Docs",
      type: "article",
      locale: "en_US",
      publishedTime: published,
      modifiedTime: modified,
      authors: ["Sankofa Systems"],
      section: section?.title,
      tags: keywords,
      images: [
        {
          url: `${docsUrl}${ogPath}`,
          width: 1200,
          height: 630,
          alt: `${page.frontmatter.title} — Sankofa Docs`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.frontmatter.title,
      description: page.frontmatter.description,
      images: [`${docsUrl}${ogPath}`],
      site: "@sankofadev",
      creator: "@sankofadev",
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
    other: {
      "article:section": section?.title ?? "Docs",
      ...(modified ? { "article:modified_time": modified } : {}),
      ...(published ? { "article:published_time": published } : {}),
    },
  };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  if (!page) notFound();
  const crumbs = getBreadcrumbs(page.href);
  const section = getSection(page.sectionKey);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: stringifyLd([articleLd(page, section?.title), breadcrumbsLd(page, crumbs)]),
        }}
      />
      <PageShell page={page}>
        <MdxRenderer source={page.content} />
      </PageShell>
    </>
  );
}
