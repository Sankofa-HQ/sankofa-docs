import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/docs/PageShell";
import { MdxRenderer } from "@/components/mdx/MdxRenderer";
import { docsUrl } from "@/lib/site";
import { getAllPages, getPageBySlug } from "@/lib/content";

export function generateStaticParams() {
  return getAllPages().map((page) => ({
    slug: [page.sectionKey, ...page.slugParts].filter(Boolean),
  }));
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
  return {
    title: page.frontmatter.title,
    description: page.frontmatter.description,
    alternates: {
      canonical: `${docsUrl}${page.href}`,
    },
    openGraph: {
      title: `${page.frontmatter.title} · Sankofa Docs`,
      description: page.frontmatter.description,
      url: `${docsUrl}${page.href}`,
      siteName: "Sankofa Docs",
      type: "article",
      images: [
        {
          url: `${docsUrl}${ogPath}`,
          width: 1200,
          height: 630,
          alt: `${page.frontmatter.title} — Sankofa Docs`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.frontmatter.title,
      description: page.frontmatter.description,
      images: [`${docsUrl}${ogPath}`],
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
  return (
    <PageShell page={page}>
      <MdxRenderer source={page.content} />
    </PageShell>
  );
}
