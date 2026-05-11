import type { NextConfig } from "next";
import path from "node:path";
import { spawnSync } from "node:child_process";

/**
 * Cloudflare Pages auto-detects Next.js and runs `npx next build` directly,
 * which bypasses the `&&`-chained postbuild scripts wired into `npm run build`
 * (postbuild-og, postbuild-rss, postbuild-pagefind). Without those steps the
 * OG images stay extension-less, the RSS feed is missing, and — most visibly —
 * `/pagefind/pagefind.js` 404s and search breaks.
 *
 * We install a one-shot exit hook here so `next build` ALWAYS finalizes by
 * running the same scripts npm would. Synchronous spawn keeps the hook safe
 * to run from `process.on("exit")`; failures propagate via process.exitCode.
 *
 * Skipped when running `next dev` (NEXT_PHASE !== production build) and
 * skipped on re-entry (SANKOFA_POSTBUILD_DONE guard) so it never runs twice.
 */
function installPostbuildHook() {
  const isProductionBuild =
    process.env.NEXT_PHASE === "phase-production-build" ||
    (process.argv.some((a) => a === "build") &&
      !process.argv.some((a) => a === "dev"));

  if (!isProductionBuild) return;
  if (process.env.SANKOFA_POSTBUILD_DONE === "1") return;

  const root = process.cwd();
  const scripts = [
    "postbuild-og.mjs",
    "postbuild-rss.mjs",
    "postbuild-pagefind.mjs",
  ];

  let alreadyRan = false;
  const runPostbuild = () => {
    if (alreadyRan) return;
    alreadyRan = true;
    process.env.SANKOFA_POSTBUILD_DONE = "1";
    for (const script of scripts) {
      const scriptPath = path.join(root, "scripts", script);
      const result = spawnSync(process.execPath, [scriptPath], {
        cwd: root,
        stdio: "inherit",
      });
      if (result.status !== 0) {
        console.error(
          `[next.config] postbuild ${script} failed with code ${result.status}`
        );
        process.exitCode = result.status ?? 1;
        return;
      }
    }
  };

  // Next.js calls process.exit() directly after a successful build, so we
  // monkey-patch it to run the postbuild scripts FIRST. We also register the
  // standard 'exit' handler as a belt-and-braces fallback for code paths that
  // unwind through event-loop drain instead of an explicit exit() call.
  const originalExit = process.exit.bind(process);
  process.exit = ((code?: number) => {
    if ((code ?? 0) === 0) runPostbuild();
    return originalExit(code);
  }) as typeof process.exit;
  process.on("exit", (code) => {
    if (code === 0) runPostbuild();
  });
}

installPostbuildHook();

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  pageExtensions: ["ts", "tsx", "mdx"],
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
