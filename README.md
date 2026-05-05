# Sankofa Docs

The official documentation site for [Sankofa](https://sankofa.dev). Built on Next.js 16 with MDX, shiki syntax highlighting, and Pagefind static search. Visually aligned with the marketing site at `website-v2/` via a shared design-token CSS layer.

## Quick start

```bash
npm install
npm run dev          # → http://localhost:3002
npm run build        # static export to ./out + Pagefind index at ./out/pagefind
npm run start        # serve ./out locally
npm test             # node:test runs lib/content.test.ts
```

## Repository map

| Path | Role |
|---|---|
| `app/` | Next.js App Router. `[...slug]/page.tsx` resolves docs pages from MDX. `search/` hosts the Pagefind UI. |
| `content/` | All docs MDX. `_drafts/` holds legacy content awaiting Phase 2–4 rewrite. The walker ignores any directory starting with `_`. |
| `components/brand/` | Logo, badges. Synced verbatim from `website-v2/` — see `components/brand/README.md`. |
| `components/layout/` | Top-level chrome — Nav, Footer, ThemeProvider, ThemeToggle. |
| `components/docs/` | Docs-specific shell — PageShell, Sidebar, Toc, Pager, Breadcrumbs, MobileDrawer, SearchTrigger, EditOnGitHubLink. |
| `components/mdx/` | The MDX component library: Callout, CodeBlock, CodeGroup, ParameterTable, EndpointBadge, RequestResponse, Steps, Tabs, Accordion, Card/CardGrid, PlatformMatrix, badges. |
| `lib/content.ts` | Build-time content manifest with zod-validated frontmatter. Replaces the legacy `lib/docs.ts`. |
| `lib/nav.config.ts` | Information architecture — single source of truth for sidebar order, top nav, and per-page badges. |
| `lib/shiki.ts` | Singleton shiki highlighter for `<CodeBlock>`. |
| `app/tokens.css` | Design tokens (colors, type, radius, shadows). Synced from `website-v2/app/tokens.css`. |
| `app/globals.css` | Token bridges, page-fg/page-bg theme variables, button + card primitives. |
| `app/prose.css` | MDX-rendered prose (replaces Tailwind `.prose`). |
| `app/docs.css` | Sidebar, TOC, page-shell, code-block, callout, badge styles. |
| `scripts/postbuild-pagefind.mjs` | Generates the Pagefind static search index. |
| `scripts/check-snippets.mjs` | Fails the build if any MDX fenced block is empty. |
| `mdx-components.tsx` | Root MDX provider (Next 15+ convention) — wires every custom MDX component. |

## Authoring docs

1. Add the page to `lib/nav.config.ts` under the right section + group, in the order you want it to appear in the sidebar.
2. Create the MDX file at `content/<section>/<slug>.mdx` (or `content/<section>/<group>/<slug>.mdx`).
3. Frontmatter must include `title` and `description`. `toc: false` hides the right rail. `sdks: [...]` declares the platforms applicable to the page.
4. Use the components in `components/mdx/` instead of raw HTML where possible — they own the design language.

```mdx
---
title: My new page
description: One sentence the search index will key on.
sdks: [web, flutter, react-native]
---

<Callout tone="tip">
Use callouts for sidebars, not for paragraph emphasis.
</Callout>

<CodeGroup>
<CodeGroupItem tab="web" label="Web">
<CodeBlock lang="ts" code={`Sankofa.track("event_name");`} />
</CodeGroupItem>
<CodeGroupItem tab="flutter" label="Flutter">
<CodeBlock lang="dart" code={`Sankofa.instance.track('event_name');`} />
</CodeGroupItem>
</CodeGroup>
```

## Design system

The visual language is owned by `website-v2/`. We copy `tokens.css`, `globals.css`, and a small set of brand components verbatim. When the design changes there, sync the changes here and bump the commit SHA in `components/brand/README.md`. Once both sites have shipped 1.0 and the design has stabilized for ≥3 months, we promote the shared layer to a `@sankofa/ui` package.

## Status

Phase 1 (Foundation) of the rebuild covers the design swap, the new MDX pipeline, the page shell, and two seed pages (`/get-started/overview`, `/get-started/quickstart`). Subsequent phases ship Concepts, Products, SDKs, API reference, and polish.

## License

The docs site is proprietary. © Sankofa Systems. The Sankofa SDKs are released separately under their own open-source licenses — see each SDK repository.
