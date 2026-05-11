import type { MetadataRoute } from "next";
import fs from "node:fs";
import { getAllPages } from "@/lib/content";
import { docsUrl } from "@/lib/site";

export const dynamic = "force-static";

/** Priority + changeFrequency tuned to docs traffic patterns:
 *   - Landing: highest priority, monthly cadence (changes when products ship)
 *   - Overview pages (top of each section): high priority, weekly cadence
 *   - Reference pages (deep API + SDK references): medium priority, monthly
 *   - Everything else: 0.6, weekly */
function priorityFor(href: string): {
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
} {
  if (href === "/") return { priority: 1.0, changeFrequency: "monthly" };
  if (/\/(overview|quickstart)$/.test(href))
    return { priority: 0.9, changeFrequency: "weekly" };
  if (href.startsWith("/get-started/")) return { priority: 0.9, changeFrequency: "weekly" };
  if (href.startsWith("/concepts/")) return { priority: 0.8, changeFrequency: "monthly" };
  if (href.startsWith("/products/")) return { priority: 0.85, changeFrequency: "weekly" };
  if (href.startsWith("/sdks/")) return { priority: 0.8, changeFrequency: "weekly" };
  if (href.startsWith("/api/")) return { priority: 0.8, changeFrequency: "monthly" };
  if (href.startsWith("/resources/changelog")) return { priority: 0.7, changeFrequency: "weekly" };
  if (href.startsWith("/resources/")) return { priority: 0.6, changeFrequency: "monthly" };
  if (href.startsWith("/account/")) return { priority: 0.5, changeFrequency: "monthly" };
  if (href.startsWith("/integrations/")) return { priority: 0.6, changeFrequency: "monthly" };
  return { priority: 0.5, changeFrequency: "monthly" };
}

function mtimeFor(sourcePath: string | undefined): Date {
  if (!sourcePath) return new Date();
  try {
    return fs.statSync(sourcePath).mtime;
  } catch {
    return new Date();
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = getAllPages();
  const now = new Date();
  return [
    {
      url: `${docsUrl}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    ...pages.map((page) => {
      const { priority, changeFrequency } = priorityFor(page.href);
      return {
        url: `${docsUrl}${page.href}`,
        lastModified: mtimeFor(page.sourcePath),
        changeFrequency,
        priority,
      };
    }),
  ];
}
