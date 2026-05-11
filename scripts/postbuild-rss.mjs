#!/usr/bin/env node
// Emits out/resources/changelog/feed.xml from content/resources/changelog.mdx.
// Run after `next build`. Entries are H3 headings whose text starts with a date
// (YYYY-MM-DD or YYYY-QN), body is everything until the next H3 or H2.

import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname, "..");
const SOURCE = path.join(ROOT, "content", "resources", "changelog.mdx");
const OUT_PATH = path.join(ROOT, "out", "resources", "changelog", "feed.xml");

const DOCS_URL = process.env.NEXT_PUBLIC_DOCS_URL ?? "https://docs.sankofa.dev";
const PAGE_URL = `${DOCS_URL}/resources/changelog/`;
const FEED_URL = `${DOCS_URL}/resources/changelog/feed.xml`;

function stripFrontmatter(raw) {
  if (!raw.startsWith("---")) return raw;
  const end = raw.indexOf("\n---", 3);
  return end === -1 ? raw : raw.slice(end + 4).replace(/^\n+/, "");
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

function parseEntries(body) {
  const lines = body.split("\n");
  const entries = [];
  let current = null;
  for (const line of lines) {
    if (/^##\s/.test(line)) {
      if (current) {
        entries.push(current);
        current = null;
      }
      continue;
    }
    const h3 = /^###\s+(.+?)\s*$/.exec(line);
    if (h3) {
      if (current) entries.push(current);
      current = { heading: h3[1], lines: [] };
      continue;
    }
    if (current) current.lines.push(line);
  }
  if (current) entries.push(current);
  return entries
    .map((e) => {
      const dateMatch = /^(\d{4}-\d{2}-\d{2})/.exec(e.heading);
      const quarterMatch = /^(\d{4})-Q([1-4])/.exec(e.heading);
      let isoDate;
      if (dateMatch) {
        isoDate = `${dateMatch[1]}T12:00:00Z`;
      } else if (quarterMatch) {
        const year = quarterMatch[1];
        const month = { "1": "02", "2": "05", "3": "08", "4": "11" }[quarterMatch[2]];
        isoDate = `${year}-${month}-15T12:00:00Z`;
      } else {
        return null;
      }
      const titlePart = e.heading.replace(/^[^·]+·\s*/, "").trim() || e.heading;
      const body = e.lines.join("\n").trim();
      return {
        title: e.heading,
        shortTitle: titlePart,
        date: isoDate,
        body,
        anchor: slugify(e.heading),
      };
    })
    .filter(Boolean);
}

function escapeXml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function entryToHtml(body) {
  // Minimal markdown → HTML for feed readers: bold, inline code, paragraphs.
  return body
    .split(/\n{2,}/)
    .map((para) => {
      const escaped = escapeXml(para)
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      return `<p>${escaped.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("\n");
}

function buildAtom(entries) {
  const updated = entries[0]?.date ?? new Date().toISOString();
  const items = entries
    .map((e) => {
      const id = `${PAGE_URL}#${e.anchor}`;
      const html = entryToHtml(e.body);
      return `  <entry>
    <id>${id}</id>
    <title>${escapeXml(e.shortTitle)}</title>
    <link href="${id}" rel="alternate" type="text/html"/>
    <updated>${e.date}</updated>
    <published>${e.date}</published>
    <content type="html">${escapeXml(html)}</content>
  </entry>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Sankofa changelog</title>
  <subtitle>Per-product release notes for the Sankofa platform — engine, SDKs, and dashboard.</subtitle>
  <id>${FEED_URL}</id>
  <link href="${FEED_URL}" rel="self" type="application/atom+xml"/>
  <link href="${PAGE_URL}" rel="alternate" type="text/html"/>
  <updated>${updated}</updated>
  <author>
    <name>Sankofa</name>
    <uri>${DOCS_URL}</uri>
  </author>
${items}
</feed>
`;
}

async function main() {
  const raw = await fs.readFile(SOURCE, "utf8");
  const body = stripFrontmatter(raw);
  const entries = parseEntries(body);
  if (entries.length === 0) {
    console.error("[rss] no changelog entries parsed");
    process.exit(1);
  }
  const xml = buildAtom(entries);
  await fs.mkdir(path.dirname(OUT_PATH), { recursive: true });
  await fs.writeFile(OUT_PATH, xml, "utf8");
  console.log(`[rss] wrote ${entries.length} entries → ${path.relative(ROOT, OUT_PATH)}`);
}

main().catch((err) => {
  console.error("[rss] failed:", err);
  process.exit(1);
});
