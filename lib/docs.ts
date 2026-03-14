import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";

export type DocBadge = "Official" | "Custom" | "Enterprise";

export type DocSectionKey =
  | "getting-started"
  | "sdk"
  | "integrations"
  | "usage"
  | "self-hosting"
  | "enterprise";

export type DocSection = {
  key: DocSectionKey;
  title: string;
  description: string;
  order: number;
};

export type DocPageMeta = {
  title: string;
  description: string;
  section: DocSectionKey;
  order: number;
  toc: boolean;
  badge?: DocBadge;
  sourceOfTruth: string[];
};

export type DocNavItem = {
  href: string;
  slug: string[];
  title: string;
  description: string;
  section: DocSectionKey;
  order: number;
  badge?: DocBadge;
};

export type DocHeading = {
  id: string;
  depth: 2 | 3;
  text: string;
};

export type DocPage = DocNavItem & {
  content: string;
  headings: DocHeading[];
  toc: boolean;
  sourceOfTruth: string[];
};

const CONTENT_DIR = path.join(process.cwd(), "content");

export const docSections: readonly DocSection[] = [
  {
    key: "getting-started",
    title: "Getting Started",
    description: "Install, initialize, and send your first events.",
    order: 1,
  },
  {
    key: "sdk",
    title: "SDKs",
    description: "Official Flutter support and custom ingest patterns.",
    order: 2,
  },
  {
    key: "integrations",
    title: "Integrations",
    description: "HTTP ingestion, aliasing, and custom pipelines.",
    order: 3,
  },
  {
    key: "usage",
    title: "Usage",
    description: "Concepts, properties, sessions, and analysis surfaces.",
    order: 4,
  },
  {
    key: "self-hosting",
    title: "Self-hosting",
    description: "Run Sankofa on your own infrastructure.",
    order: 5,
  },
  {
    key: "enterprise",
    title: "Enterprise",
    description: "Replay, billing, SSO, and audit capabilities.",
    order: 6,
  },
] as const;

type FrontmatterShape = {
  title?: string;
  description?: string;
  section?: string;
  order?: number;
  toc?: boolean;
  badge?: DocBadge;
  source_of_truth?: string | string[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[`'"!?,.:/()[\]{}]/g, "")
    .replace(/&/g, "and")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function normalizeSourceOfTruth(value: string | string[] | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function getSectionKeyFromPath(relativePath: string): DocSectionKey {
  const topLevel = relativePath.split(path.sep)[0];

  if (
    topLevel === "getting-started" ||
    topLevel === "sdk" ||
    topLevel === "integrations" ||
    topLevel === "usage" ||
    topLevel === "self-hosting" ||
    topLevel === "enterprise"
  ) {
    return topLevel;
  }

  return "getting-started";
}

function toHref(relativePath: string) {
  const normalized = relativePath.replace(/\\/g, "/");
  const withoutExtension = normalized.replace(/\.mdx$/, "");
  if (withoutExtension.endsWith("/index")) {
    const base = withoutExtension.slice(0, -"/index".length);
    return base ? `/${base}` : "/";
  }
  return `/${withoutExtension}`;
}

function toSlug(relativePath: string) {
  const href = toHref(relativePath);
  return href === "/" ? [] : href.slice(1).split("/");
}

function stripFrontmatter(source: string) {
  if (!source.startsWith("---")) return source;
  const endIndex = source.indexOf("\n---", 3);
  if (endIndex === -1) return source;
  return source.slice(endIndex + 4).trimStart();
}

function extractHeadings(source: string): DocHeading[] {
  const content = stripFrontmatter(source);
  const headings: DocHeading[] = [];
  const lines = content.split("\n");
  let inCodeFence = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      inCodeFence = !inCodeFence;
      continue;
    }

    if (inCodeFence) continue;

    const match = /^(##|###)\s+(.+)$/.exec(trimmed);
    if (!match) continue;

    const depth = match[1].length as 2 | 3;
    const text = match[2]
      .replace(/<[^>]+>/g, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/[`*_~]/g, "")
      .trim();

    headings.push({
      id: slugify(text),
      depth,
      text,
    });
  }

  return headings;
}

function walkContentDirectory(directory: string) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkContentDirectory(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".mdx")) {
      files.push(fullPath);
    }
  }

  return files;
}

function parseDocFile(filePath: string): DocPage {
  const raw = fs.readFileSync(filePath, "utf8");
  const relativePath = path.relative(CONTENT_DIR, filePath);
  const parsed = matter(raw);
  const data = parsed.data as FrontmatterShape;

  const title = data.title?.trim();
  const description = data.description?.trim();

  if (!title || !description) {
    throw new Error(`Missing required frontmatter in ${relativePath}`);
  }

  const section = (data.section?.trim() as DocSectionKey | undefined) ??
    getSectionKeyFromPath(relativePath);

  const href = toHref(relativePath);
  const slug = toSlug(relativePath);

  return {
    href,
    slug,
    title,
    description,
    section,
    order: data.order ?? 999,
    badge: data.badge,
    toc: data.toc ?? true,
    sourceOfTruth: normalizeSourceOfTruth(data.source_of_truth),
    content: parsed.content.trim(),
    headings: extractHeadings(raw),
  };
}

export const getAllDocPages = cache(() => {
  if (!fs.existsSync(CONTENT_DIR)) return [] as DocPage[];

  return walkContentDirectory(CONTENT_DIR)
    .map(parseDocFile)
    .sort((left, right) => {
      const sectionOrder =
        docSections.find((section) => section.key === left.section)?.order ?? 99;
      const nextSectionOrder =
        docSections.find((section) => section.key === right.section)?.order ?? 99;

      if (sectionOrder !== nextSectionOrder) {
        return sectionOrder - nextSectionOrder;
      }

      if (left.order !== right.order) {
        return left.order - right.order;
      }

      return left.href.localeCompare(right.href);
    });
});

export const getSidebarSections = cache(() => {
  const pages = getAllDocPages();

  return docSections
    .map((section) => ({
      ...section,
      items: pages.filter((page) => page.section === section.key),
    }))
    .filter((section) => section.items.length > 0);
});

export const getDocPageBySlug = cache((slug: string[]) => {
  const normalizedHref = slug.length === 0 ? "/" : `/${slug.join("/")}`;
  return getAllDocPages().find((page) => page.href === normalizedHref) ?? null;
});

export function getAdjacentDocs(href: string) {
  const pages = getAllDocPages();
  const index = pages.findIndex((page) => page.href === href);

  if (index === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: index > 0 ? pages[index - 1] : null,
    next: index < pages.length - 1 ? pages[index + 1] : null,
  };
}

export function getDocSection(key: DocSectionKey) {
  return docSections.find((section) => section.key === key) ?? docSections[0];
}

export function getFeaturedDocs() {
  const pages = getAllDocPages();
  const featuredHrefs = [
    "/getting-started/quickstart",
    "/sdk/flutter",
    "/integrations/http-ingestion",
    "/self-hosting",
  ];

  return featuredHrefs
    .map((href) => pages.find((page) => page.href === href))
    .filter((page): page is DocPage => Boolean(page));
}

export function headingId(text: string) {
  return slugify(text);
}
