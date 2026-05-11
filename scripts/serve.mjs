#!/usr/bin/env node
// Minimal static file server for `out/` that:
//  - resolves trailing-slash paths to <path>/index.html
//  - serves out/404.html with HTTP 404 for missing routes
//  - sets correct MIME types for .html/.js/.css/.png/.svg/.xml/.json
// Used by `npm start` so local production preview matches what Cloudflare Pages,
// Vercel, etc. do automatically: render the docs 404 page, not a server error.

import http from "node:http";
import fs from "node:fs/promises";
import { createReadStream } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname, "..", "out");
const PORT = Number(process.env.PORT ?? 3002);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
};

async function stat(p) {
  try {
    return await fs.stat(p);
  } catch {
    return null;
  }
}

async function resolveFile(urlPath) {
  // Strip query/hash, decode, and reject path traversal.
  const clean = decodeURIComponent(urlPath.split(/[?#]/)[0] || "/");
  if (clean.includes("..")) return null;
  const abs = path.join(ROOT, clean);
  if (!abs.startsWith(ROOT)) return null;

  const s = await stat(abs);
  if (s?.isFile()) return abs;
  if (s?.isDirectory()) {
    const idx = path.join(abs, "index.html");
    if (await stat(idx)) return idx;
  }
  // Trailing-slash-less variant
  const html = `${abs}.html`;
  if (await stat(html)) return html;
  return null;
}

const server = http.createServer(async (req, res) => {
  const filePath = await resolveFile(req.url ?? "/");
  if (filePath) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME[ext] ?? "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    createReadStream(filePath).pipe(res);
    return;
  }
  // Fallback: serve out/404.html with HTTP 404.
  const notFound = path.join(ROOT, "404.html");
  if (await stat(notFound)) {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    createReadStream(notFound).pipe(res);
    return;
  }
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("404 Not Found");
});

server.listen(PORT, () => {
  console.log(`[serve] static preview at http://localhost:${PORT} (root: ${ROOT})`);
});
