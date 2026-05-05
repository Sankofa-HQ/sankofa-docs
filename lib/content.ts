import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { z } from "zod";
import {
  SECTIONS,
  getAllNavEntries,
  getSection,
  type NavSection,
  type NavGroup,
} from "./nav.config.ts";

const CONTENT_DIR = path.join(process.cwd(), "content");

/**
 * Frontmatter accepted on every MDX page.
 *
 * `title` and `description` are required for accessibility, SEO, and search.
 * Everything else is optional. Section/slug are inferred from the file path —
 * the explicit `section` field is no longer honored to avoid drift between
 * filesystem layout and metadata.
 */
const FrontmatterSchema = z.object({
  title: z.string().min(1, "title is required"),
  description: z.string().min(1, "description is required"),
  badge: z.string().optional(),
  toc: z.boolean().optional().default(true),
  /** Used by the snippet checker and editor — `path/to/file:lineRange` form. */
  source_of_truth: z.union([z.string(), z.array(z.string())]).optional(),
  /** Comma-or-array of platforms applicable to this page (drives <CodeGroup> default tab order). */
  sdks: z.array(z.string()).optional(),
  /** Marks the page as draft — excluded from sidebar, sitemap, and search. */
  draft: z.boolean().optional().default(false),
});

export type Frontmatter = z.infer<typeof FrontmatterSchema>;

export type Heading = {
  id: string;
  depth: 2 | 3 | 4;
  text: string;
};

export type DocPage = {
  /** URL path, beginning with "/". */
  href: string;
  /** Slug parts excluding the section. e.g. ["install", "web"]. */
  slugParts: string[];
  /** Section key (top-level directory). */
  sectionKey: string;
  /** Computed sortable position from the IA (lower is earlier). */
  navOrder: number;
  /** Group within the section, if any. */
  groupTitle?: string;
  /** Frontmatter, validated. */
  frontmatter: Frontmatter;
  /** Raw MDX body (without frontmatter). */
  content: string;
  /** Extracted h2/h3/h4 outline for the right-rail TOC. */
  headings: Heading[];
  /** Repo-relative path to the source MDX file (used by edit-on-GitHub). */
  sourcePath: string;
  /** Optional badge from nav.config.ts. */
  navBadge?: string;
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[`'"!?,.:/()[\]{}@]/g, "")
    .replace(/&/g, "and")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function stripFrontmatter(source: string): string {
  if (!source.startsWith("---")) return source;
  const end = source.indexOf("\n---", 3);
  if (end === -1) return source;
  return source.slice(end + 4).trimStart();
}

function extractHeadings(source: string): Heading[] {
  const body = stripFrontmatter(source);
  const headings: Heading[] = [];
  let inFence = false;
  for (const line of body.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = /^(#{2,4})\s+(.+)$/.exec(trimmed);
    if (!match) continue;
    const depth = match[1].length as 2 | 3 | 4;
    const text = match[2]
      .replace(/<[^>]+>/g, "")
      .replace(/\[(.*?)\]\([^)]*\)/g, "$1")
      .replace(/[`*_~]/g, "")
      .trim();
    if (!text) continue;
    headings.push({ id: slugify(text), depth, text });
  }
  return headings;
}

function fileToHref(sectionKey: string, slugParts: string[]): string {
  if (slugParts.length === 0) return `/${sectionKey}`;
  return `/${sectionKey}/${slugParts.join("/")}`;
}

function pathFromContent(absPath: string): { sectionKey: string; slugParts: string[] } | null {
  const relative = path.relative(CONTENT_DIR, absPath).replace(/\\/g, "/");
  const noExt = relative.replace(/\.mdx$/, "");
  const parts = noExt.split("/");
  if (parts.length === 0) return null;
  const sectionKey = parts[0];
  const remaining = parts.slice(1);
  // `<section>/index.mdx` => slugParts=[]
  // `<section>/foo/index.mdx` => slugParts=["foo"]
  // `<section>/foo/bar.mdx` => slugParts=["foo","bar"]
  let slugParts = remaining;
  if (slugParts.length > 0 && slugParts[slugParts.length - 1] === "index") {
    slugParts = slugParts.slice(0, -1);
  }
  return { sectionKey, slugParts };
}

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name.startsWith("_")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith(".mdx")) out.push(full);
  }
  return out;
}

function parseFile(absPath: string): DocPage | null {
  const raw = fs.readFileSync(absPath, "utf8");
  const parsed = matter(raw);
  const fm = FrontmatterSchema.safeParse(parsed.data);
  if (!fm.success) {
    const rel = path.relative(CONTENT_DIR, absPath);
    throw new Error(
      `Invalid frontmatter in ${rel}: ${fm.error.issues.map((i) => i.path.join(".") + " " + i.message).join("; ")}`
    );
  }
  if (fm.data.draft) return null;
  const fp = pathFromContent(absPath);
  if (!fp) return null;
  const href = fileToHref(fp.sectionKey, fp.slugParts);
  return {
    href,
    slugParts: fp.slugParts,
    sectionKey: fp.sectionKey,
    navOrder: 999, // overridden after merge with nav.config.ts
    frontmatter: fm.data,
    content: parsed.content.trim(),
    headings: extractHeadings(raw),
    sourcePath: path.relative(process.cwd(), absPath),
  };
}

/** Loads, validates, and orders all MDX pages on disk. */
export const getAllPages = cache((): DocPage[] => {
  const files = walk(CONTENT_DIR);
  const pages: DocPage[] = [];
  for (const f of files) {
    const p = parseFile(f);
    if (p) pages.push(p);
  }
  return orderPages(pages);
});

/** Apply nav.config.ts ordering to the page set. Anything not in nav config sinks to the end. */
function orderPages(pages: DocPage[]): DocPage[] {
  const navIndex = new Map<string, { order: number; group?: string; badge?: string }>();
  let i = 0;
  for (const section of SECTIONS) {
    for (const group of section.groups) {
      for (const navPage of group.pages) {
        const key = `${section.key}/${navPage.slug}`;
        navIndex.set(key, { order: i++, group: group.title, badge: navPage.badge });
      }
    }
  }
  for (const page of pages) {
    const key = `${page.sectionKey}/${page.slugParts.join("/") || "index"}`;
    const navKeyAlt = `${page.sectionKey}/${page.slugParts.join("/")}`;
    const meta = navIndex.get(navKeyAlt) ?? navIndex.get(key);
    if (meta) {
      page.navOrder = meta.order;
      page.groupTitle = meta.group;
      page.navBadge = meta.badge;
    }
  }
  return pages.sort((a, b) => a.navOrder - b.navOrder);
}

/** Find a page by URL path. Trailing slashes are normalized. */
export const getPageByHref = cache((href: string): DocPage | null => {
  const normalized = href.replace(/\/$/, "") || "/";
  return getAllPages().find((p) => p.href === normalized) ?? null;
});

export const getPageBySlug = cache((slugParts: string[]): DocPage | null => {
  if (slugParts.length === 0) return null;
  const sectionKey = slugParts[0];
  const rest = slugParts.slice(1);
  const href = rest.length === 0 ? `/${sectionKey}` : `/${sectionKey}/${rest.join("/")}`;
  return getPageByHref(href);
});

/** Returns the FULL sidebar IA for a section — every planned page is included.
 *  Shipped pages are clickable; planned pages render as `status: "planned"` so the
 *  Sidebar component can dim them with a "Soon" pill. This is the right shape for
 *  a Stripe/Vercel-tier docs site: users see what's coming, not a sparse stub. */
export const getSidebar = cache((sectionKey: string): SidebarSection | null => {
  const section = getSection(sectionKey);
  if (!section) return null;
  const pagesByKey = new Map(
    getAllPages()
      .filter((p) => p.sectionKey === sectionKey)
      .map((p) => [p.slugParts.join("/") || "index", p])
  );
  const groups: SidebarGroup[] = [];
  for (const group of section.groups) {
    const items: SidebarItem[] = [];
    for (const navPage of group.pages) {
      const page = pagesByKey.get(navPage.slug) ?? pagesByKey.get(navPage.slug + "/index");
      const fallbackHref =
        navPage.slug === "index" || navPage.slug === ""
          ? `/${section.key}`
          : `/${section.key}/${navPage.slug}`;
      items.push({
        href: page?.href ?? fallbackHref,
        title: navPage.title ?? page?.frontmatter.title ?? formatTitle(navPage.slug),
        badge: navPage.badge,
        status: page ? "shipped" : "planned",
      });
    }
    if (items.length > 0) {
      groups.push({ title: group.title, items });
    }
  }
  return { key: section.key, title: section.title, groups };
});

/** Fast href → boolean lookup for the MDX <a> renderer. */
export const getShippedHrefSet = cache((): Set<string> => {
  return new Set(getAllPages().map((p) => p.href));
});

export function isShippedHref(href: string): boolean {
  // Strip trailing slash + hash + query so /foo, /foo/, /foo#bar, /foo?x=1 all match.
  const clean = href.split(/[?#]/)[0].replace(/\/$/, "") || "/";
  return getShippedHrefSet().has(clean);
}

function formatTitle(slug: string): string {
  const last = slug.split("/").pop() ?? slug;
  return last
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bSdk\b/g, "SDK")
    .replace(/\bAb\b/g, "A/B")
    .replace(/\bRn\b/g, "RN")
    .replace(/\bIos\b/g, "iOS")
    .replace(/\bApi\b/g, "API")
    .replace(/\bRbac\b/g, "RBAC")
    .replace(/\bSso\b/g, "SSO");
}

export type SidebarStatus = "shipped" | "planned";
export type SidebarItem = {
  href: string;
  title: string;
  badge?: string;
  status: SidebarStatus;
};
export type SidebarGroup = { title?: string; items: SidebarItem[] };
export type SidebarSection = { key: string; title: string; groups: SidebarGroup[] };

/** Prev/next navigation within a section. */
export const getAdjacent = cache((href: string): { previous: DocPage | null; next: DocPage | null } => {
  const all = getAllPages();
  const idx = all.findIndex((p) => p.href === href);
  if (idx === -1) return { previous: null, next: null };
  const current = all[idx];
  const sectionPages = all.filter((p) => p.sectionKey === current.sectionKey);
  const sectionIdx = sectionPages.findIndex((p) => p.href === href);
  return {
    previous: sectionIdx > 0 ? sectionPages[sectionIdx - 1] : null,
    next: sectionIdx < sectionPages.length - 1 ? sectionPages[sectionIdx + 1] : null,
  };
});

/** Build a breadcrumb chain like ["Get started", "Quickstart"]. */
export const getBreadcrumbs = cache((href: string): { href: string; label: string }[] => {
  const page = getPageByHref(href);
  if (!page) return [];
  const section = getSection(page.sectionKey);
  if (!section) return [];
  const crumbs: { href: string; label: string }[] = [
    { href: `/${section.key}/overview`, label: section.title },
  ];
  if (page.groupTitle) {
    crumbs.push({ href: page.href, label: page.groupTitle });
  }
  crumbs.push({ href: page.href, label: page.frontmatter.title });
  return crumbs;
});

export function headingId(text: string): string {
  return slugify(text);
}

/** Validates that every entry in nav.config.ts has a corresponding MDX file. Returns missing slugs. */
export function getMissingPages(): string[] {
  const present = new Set(
    getAllPages().map((p) => `${p.sectionKey}/${p.slugParts.join("/") || "index"}`)
  );
  const missing: string[] = [];
  for (const entry of getAllNavEntries()) {
    const key = `${entry.sectionKey}/${entry.slug}`;
    if (!present.has(key)) missing.push(key);
  }
  return missing;
}

/** Re-export so callers get a single import surface. */
export { SECTIONS, getSection } from "./nav.config.ts";
export type { NavSection, NavGroup } from "./nav.config.ts";
