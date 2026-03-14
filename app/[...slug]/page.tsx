import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsPageShell } from "@/components/docs/DocsPageShell";
import { MdxContent } from "@/components/docs/MdxContent";
import { docsUrl } from "@/lib/site";
import { getAllDocPages, getDocPageBySlug } from "@/lib/docs";

export function generateStaticParams() {
  return getAllDocPages().map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getDocPageBySlug(slug);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `${docsUrl}${page.href}`,
    },
    openGraph: {
      title: `${page.title} | Sankofa Docs`,
      description: page.description,
      url: `${docsUrl}${page.href}`,
      siteName: "Sankofa Docs",
      type: "article",
      images: [
        {
          url: "/logo-full.png",
          width: 1200,
          height: 630,
          alt: "Sankofa Docs",
        },
      ],
    },
  };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const page = getDocPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <DocsPageShell page={page}>
      <MdxContent source={page.content} />
    </DocsPageShell>
  );
}
