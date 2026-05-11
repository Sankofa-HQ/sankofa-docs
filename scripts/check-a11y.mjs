#!/usr/bin/env node
// axe-core accessibility scan over a representative sample of the docs.
//
// Usage:
//   npm run build           # produces out/
//   npm run a11y            # scans 8 sample pages headlessly
//
// Boots scripts/serve.mjs on a free port, walks the sample pages with Puppeteer,
// runs @axe-core/puppeteer against each, and prints any serious/critical
// violations. Exits non-zero on any violation so it can be used as a CI gate.
//
// Dependencies are loaded on demand so the docs build doesn't carry them as
// hard dependencies — install with:
//   npm i -D puppeteer @axe-core/puppeteer

import { spawn } from "node:child_process";
import http from "node:http";
import path from "node:path";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname, "..");
const PORT = Number(process.env.A11Y_PORT ?? 4173);

const SAMPLE_PATHS = [
  "/",
  "/get-started/overview/",
  "/get-started/quickstart/",
  "/concepts/overview/",
  "/products/catch/overview/",
  "/sdks/web/overview/",
  "/api/overview/",
  "/resources/security/",
  "/search/",
];

function waitForServer(url, attempts = 30) {
  return new Promise((resolve, reject) => {
    const tryOnce = (n) => {
      const req = http.get(url, (res) => {
        res.resume();
        resolve();
      });
      req.on("error", () => {
        if (n <= 0) return reject(new Error(`server at ${url} did not start`));
        setTimeout(() => tryOnce(n - 1), 200);
      });
    };
    tryOnce(attempts);
  });
}

async function loadDeps() {
  try {
    const [{ default: puppeteer }, axeMod] = await Promise.all([
      import("puppeteer"),
      import("@axe-core/puppeteer"),
    ]);
    return { puppeteer, AxePuppeteer: axeMod.AxePuppeteer ?? axeMod.default };
  } catch (err) {
    console.error("[a11y] missing dependencies. Install with:");
    console.error("[a11y]   npm i -D puppeteer @axe-core/puppeteer");
    console.error("[a11y] underlying error:", err.message);
    process.exit(1);
  }
}

async function main() {
  const { puppeteer, AxePuppeteer } = await loadDeps();

  const server = spawn(process.execPath, ["scripts/serve.mjs"], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(PORT) },
    stdio: ["ignore", "pipe", "inherit"],
  });
  server.stdout?.on("data", () => {});

  try {
    await waitForServer(`http://localhost:${PORT}/`);
    const browser = await puppeteer.launch({ headless: "new" });
    let totalViolations = 0;
    try {
      for (const p of SAMPLE_PATHS) {
        const page = await browser.newPage();
        const url = `http://localhost:${PORT}${p}`;
        await page.goto(url, { waitUntil: "networkidle0", timeout: 30_000 });
        const results = await new AxePuppeteer(page)
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        const serious = results.violations.filter(
          (v) => v.impact === "serious" || v.impact === "critical"
        );
        if (serious.length === 0) {
          console.log(`[a11y] ${p} — clean`);
        } else {
          totalViolations += serious.length;
          console.log(`[a11y] ${p} — ${serious.length} serious/critical violations`);
          for (const v of serious) {
            console.log(`  - [${v.impact}] ${v.id}: ${v.help} (${v.helpUrl})`);
            for (const node of v.nodes.slice(0, 3)) {
              console.log(`      ↳ ${node.target.join(" ")}`);
            }
          }
        }
        await page.close();
      }
    } finally {
      await browser.close();
    }
    if (totalViolations > 0) {
      console.error(`[a11y] failed: ${totalViolations} serious/critical violations`);
      process.exit(1);
    }
    console.log("[a11y] all sample pages clean");
  } finally {
    server.kill();
  }
}

main().catch((err) => {
  console.error("[a11y] failed:", err);
  process.exit(1);
});
