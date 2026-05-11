#!/usr/bin/env node
// Renames Next.js's static-exported OG route output to a .png extension.
//
// The route handler at `app/og/[...slug]/route.tsx` emits PNG bytes, but with
// `output: export` Next writes the bytes to `out/og/<slug>` with no extension.
// Most static hosts (and our scripts/serve.mjs) determine MIME by extension,
// and social crawlers expect `og:image` URLs to end in `.png`. So we copy each
// emitted file to its `.png` counterpart. We keep the original around so the
// raw route path still resolves.

import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname, "..");
const OG_DIR = path.join(ROOT, "out", "og");

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47]);

async function* walk(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(abs);
    } else if (entry.isFile() && !entry.name.endsWith(".png")) {
      yield abs;
    }
  }
}

async function main() {
  let renamed = 0;
  for await (const file of walk(OG_DIR)) {
    const head = Buffer.alloc(4);
    const fh = await fs.open(file, "r");
    try {
      await fh.read(head, 0, 4, 0);
    } finally {
      await fh.close();
    }
    if (!head.equals(PNG_MAGIC)) continue;
    await fs.copyFile(file, `${file}.png`);
    renamed += 1;
  }
  console.log(`[og] mirrored ${renamed} PNG files under out/og/`);
}

main().catch((err) => {
  console.error("[og] failed:", err);
  process.exit(1);
});
