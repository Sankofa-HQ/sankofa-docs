#!/usr/bin/env node
/**
 * Builds the Pagefind static search index from the Next.js export at `out/`,
 * then mirrors `out/pagefind/` to `public/pagefind/` so `next dev` serves the
 * same index. Run automatically as part of `next build` — see package.json.
 */
import { spawn } from "node:child_process";
import { existsSync, rmSync, cpSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(root, "out");

if (!existsSync(target)) {
  console.error(`[pagefind] target directory not found: ${target}`);
  console.error("[pagefind] run `next build` first");
  process.exit(1);
}

console.log(`[pagefind] indexing ${target}`);
const child = spawn(
  "npx",
  [
    "pagefind",
    "--site",
    target,
    "--exclude-selectors",
    "nav,footer,.docs-sidebar,.docs-toc,.docs-breadcrumbs,.docs-pager",
  ],
  { stdio: "inherit", cwd: root }
);

child.on("exit", (code) => {
  if (code !== 0) {
    console.error(`[pagefind] failed with exit code ${code}`);
    process.exit(code ?? 1);
  }
  // Mirror to public/pagefind so `next dev` can serve the same index.
  const src = path.join(target, "pagefind");
  const dst = path.join(root, "public", "pagefind");
  if (existsSync(src)) {
    if (existsSync(dst)) rmSync(dst, { recursive: true, force: true });
    cpSync(src, dst, { recursive: true });
    console.log(`[pagefind] mirrored index to public/pagefind/ for next dev`);
  }
  console.log("[pagefind] index built");
});
