import type { MetadataRoute } from "next";
import { getAllDocPages } from "@/lib/docs";
import { docsUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = getAllDocPages();

  return [
    {
      url: docsUrl,
      lastModified: new Date(),
    },
    ...pages.map((page) => ({
      url: `${docsUrl}${page.href}`,
      lastModified: new Date(),
    })),
  ];
}
