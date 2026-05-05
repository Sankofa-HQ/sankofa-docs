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
