# Deploying sankofa-docs

Static export. Any host that serves a directory works (Cloudflare Pages, Vercel, Netlify, S3+CloudFront, Fly static, GitHub Pages).

## The one build command

```
npm run build
```

This expands to:

```
next build && node scripts/postbuild-og.mjs && node scripts/postbuild-rss.mjs && node scripts/postbuild-pagefind.mjs
```

All four steps are required for a functional production deploy:

| Step | What it does | Symptom if skipped |
|---|---|---|
| `next build` | Renders the 96 docs pages + emits `out/og/<slug>` PNG bytes | Site doesn't deploy at all |
| `postbuild-og.mjs` | Mirrors the OG bytes to `<slug>.png` so `og:image` URLs resolve | Social-card previews 404 |
| `postbuild-rss.mjs` | Emits `out/resources/changelog/feed.xml` | RSS feed 404 |
| `postbuild-pagefind.mjs` | Builds the Pagefind search index into `out/pagefind/` | **Search is broken** — `/pagefind/pagefind.js` 404s, `/search` shows "index not loaded" |

## Cloudflare Pages

The default build command is auto-detected as `next build`. **Change it explicitly to `npm run build`** in the Pages project settings, or search silently breaks:

1. Cloudflare dashboard → Workers & Pages → your `sankofa-docs` project
2. Settings → Builds & deployments → **Build configurations** → Edit
3. **Build command:** `npm run build`
4. **Build output directory:** `out`
5. **Root directory:** `sankofa-docs` (if the repo has a monorepo layout)
6. Save → Trigger redeploy

The repo's [public/_headers](./public/_headers) takes effect automatically once `out/_headers` is uploaded — sets `Cache-Control: public, max-age=31536000, immutable` for `/pagefind/*`, `/og/*.png`, and `/_next/static/*`, plus correct MIME types for the manifest, RSS feed, and security.txt.

## Vercel

`vercel.json` not needed — Vercel auto-detects Next.js. Override the build command to `npm run build` in project settings (same reason as CF Pages).

## Verifying a deploy

After deploy, sanity-check from the command line:

```bash
HOST=https://docs.sankofa.dev
for path in /pagefind/pagefind.js /pagefind/pagefind-entry.json /og/products/catch/overview.png /resources/changelog/feed.xml /sitemap.xml /robots.txt /manifest.webmanifest; do
  printf "%-50s -> " "$path"
  curl -sI "$HOST$path" | head -1
done
```

All should return `HTTP/2 200`. If any 404s, the build command isn't running `npm run build`.

## Environment variables

| Var | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_DOCS_URL` | yes (prod) | Drives canonical URLs, sitemap loc, OG image src, JSON-LD `@id`, RSS feed URL. Set to e.g. `https://docs.sankofa.dev`. Defaults to `http://localhost:3002`. |
| `NEXT_PUBLIC_MAIN_SITE_URL` | no | Marketing site URL for nav links + Organization JSON-LD. Defaults to `https://sankofa.dev`. |
| `NEXT_PUBLIC_APP_URL` | no | Dashboard URL for the "Open dashboard" button. Defaults to `https://app.sankofa.dev`. |
| `NEXT_PUBLIC_DOCS_EDIT_BASE` | no | Base URL for the "Edit this page on GitHub" link. Defaults to `https://github.com/sankofa-hq/sankofa-docs/edit/main`. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | no | Google Search Console verification token. |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | no | Bing Webmaster verification token. |
| `NEXT_PUBLIC_YANDEX_VERIFICATION` | no | Yandex Webmaster verification token. |

## Troubleshooting

**`/pagefind/pagefind.js` 404 on production**
The deploy is running `next build` not `npm run build`. Fix the build command (see Cloudflare Pages section above). The postbuild step now also fails the build loudly if the Pagefind artifacts aren't present, so any future regression surfaces during deploy instead of at runtime.

**OG images 404**
Either the build command is wrong (see above) or `postbuild-og.mjs` failed. Re-run `npm run build` locally and inspect `out/og/<sectionKey>/<slug>.png` — those are the deployed files.

**Canonical URLs use `localhost:3002`**
`NEXT_PUBLIC_DOCS_URL` isn't set on the build host. Add it to environment variables in the Pages/Vercel project settings, then redeploy.
