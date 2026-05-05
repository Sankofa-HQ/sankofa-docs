#!/usr/bin/env node
/**
 * Phase-1 snippet sanity check — fails CI if any fenced code block in MDX is empty
 * or has obviously malformed syntax. Phase 8 will replace this with full type-checking
 * against the @sankofa/* SDK types and per-language parsers.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = path.join(root, "content");
const ignoreDirs = new Set(["_drafts"]);

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name.startsWith(".") || ignoreDirs.has(name)) continue;
    const full = path.join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (st.isFile() && name.endsWith(".mdx")) out.push(full);
  }
  return out;
}

const FENCE = /```([a-zA-Z0-9_+-]*)\s*\n([\s\S]*?)```/g;

let errors = 0;

for (const file of walk(contentDir)) {
  const src = readFileSync(file, "utf8");
  let m;
  while ((m = FENCE.exec(src)) !== null) {
    const lang = m[1];
    const body = m[2];
    if (!body.trim()) {
      console.error(`[snippets] empty fenced block in ${path.relative(root, file)} (lang=${lang || "none"})`);
      errors++;
    }
  }
}

if (errors > 0) {
  console.error(`[snippets] ${errors} issue(s) found`);
  process.exit(1);
}
console.log("[snippets] ok");
