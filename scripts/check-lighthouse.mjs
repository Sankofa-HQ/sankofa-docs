#!/usr/bin/env node
// Lighthouse budget gate over a representative sample of the docs.
//
// Usage:
//   npm run build           # produces out/
//   npm run lighthouse      # scans sample pages with desktop preset
//
// Boots scripts/serve.mjs, runs Lighthouse against each sample URL, and
// asserts each of {performance, accessibility, best-practices, seo} clears
// the budget thresholds. Exits non-zero on any failure for CI use.
//
// Dependencies are loaded on demand:
//   npm i -D lighthouse chrome-launcher

import { spawn } from "node:child_process";
import http from "node:http";
import path from "node:path";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname, "..");
const PORT = Number(process.env.LIGHTHOUSE_PORT ?? 4174);

const SAMPLE_PATHS = [
  "/",
  "/get-started/quickstart/",
  "/products/catch/overview/",
  "/sdks/web/packages/browser/",
  "/api/overview/",
];

// Thresholds tuned to Stripe/Vercel-tier docs: a11y + best-practices + SEO
// are non-negotiable; performance has some slack because static export hosting
// quality is host-dependent and the sample is served by scripts/serve.mjs.
const BUDGETS = {
  performance: 90,
  accessibility: 95,
  "best-practices": 95,
  seo: 95,
};

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
    const [{ default: lighthouse }, chromeLauncher] = await Promise.all([
      import("lighthouse"),
      import("chrome-launcher"),
    ]);
    return { lighthouse, chromeLauncher };
  } catch (err) {
    console.error("[lighthouse] missing dependencies. Install with:");
    console.error("[lighthouse]   npm i -D lighthouse chrome-launcher");
    console.error("[lighthouse] underlying error:", err.message);
    process.exit(1);
  }
}

async function main() {
  const { lighthouse, chromeLauncher } = await loadDeps();

  const server = spawn(process.execPath, ["scripts/serve.mjs"], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(PORT) },
    stdio: ["ignore", "pipe", "inherit"],
  });
  server.stdout?.on("data", () => {});

  let chrome;
  try {
    await waitForServer(`http://localhost:${PORT}/`);
    chrome = await chromeLauncher.launch({
      chromeFlags: ["--headless=new", "--no-sandbox"],
    });
    let failed = 0;
    for (const p of SAMPLE_PATHS) {
      const url = `http://localhost:${PORT}${p}`;
      const runner = await lighthouse(
        url,
        {
          port: chrome.port,
          output: "json",
          logLevel: "error",
          onlyCategories: Object.keys(BUDGETS),
        },
        { extends: "lighthouse:default" }
      );
      const cats = runner?.lhr?.categories ?? {};
      const row = Object.fromEntries(
        Object.entries(cats).map(([k, v]) => [k, Math.round((v.score ?? 0) * 100)])
      );
      const violations = Object.entries(BUDGETS).filter(
        ([k, threshold]) => (row[k] ?? 0) < threshold
      );
      if (violations.length === 0) {
        console.log(
          `[lighthouse] ${p} — perf ${row.performance} · a11y ${row.accessibility} · bp ${row["best-practices"]} · seo ${row.seo}`
        );
      } else {
        failed += 1;
        console.log(
          `[lighthouse] ${p} — perf ${row.performance} · a11y ${row.accessibility} · bp ${row["best-practices"]} · seo ${row.seo}`
        );
        for (const [k, threshold] of violations) {
          console.log(`  ✗ ${k} ${row[k]} < ${threshold}`);
        }
      }
    }
    if (failed > 0) {
      console.error(`[lighthouse] failed: ${failed} pages below budget`);
      process.exit(1);
    }
    console.log("[lighthouse] all sample pages within budget");
  } finally {
    if (chrome) await chrome.kill();
    server.kill();
  }
}

main().catch((err) => {
  console.error("[lighthouse] failed:", err);
  process.exit(1);
});
