import type { MetadataRoute } from "next";
import { docsUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The /search route is dynamic and OG images are discovered via meta
        // tags — neither needs to appear in the crawl index.
        disallow: ["/search", "/og/"],
      },
      // Welcome major LLM crawlers explicitly — modern dev docs benefit from
      // appearing in AI-assistant answers (Perplexity, Gemini, ChatGPT, Claude).
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
    ],
    sitemap: `${docsUrl}/sitemap.xml`,
    host: docsUrl,
  };
}
