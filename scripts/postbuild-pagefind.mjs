#!/usr/bin/env node
/**
 * Builds the Pagefind static search index from the Next.js export at `out/`.
 * Run automatically as part of `next build` — see package.json `build` script.
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
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
const child = spawn("npx", ["pagefind", "--site", target, "--exclude-selectors", "nav,footer,.docs-sidebar,.docs-toc,.docs-breadcrumbs,.docs-pager"], {
  stdio: "inherit",
  cwd: root,
});

child.on("exit", (code) => {
  if (code !== 0) {
    console.error(`[pagefind] failed with exit code ${code}`);
    process.exit(code ?? 1);
  }
  console.log("[pagefind] index built");
});
