# Drafts (legacy content)

These directories were inherited from the previous docs site and are queued for rewrite in Phases 2–4 of the rebuild plan:

- `sdk/` → migrated into `/sdks/<platform>/...` per platform (multi-page) in Phase 4
- `integrations/` → split between `/concepts/ingestion-model`, `/api/ingestion/...`, and `/integrations/` overview (Phase 2 + 3)
- `usage/` → split across `/concepts/...` and `/products/<module>/...` (Phase 2 + 3)

The build pipeline ignores any directory whose name starts with `_`, so nothing here is served, indexed, or linked. Move a file out of `_drafts/` (or its parent) only when it has been rewritten to match `lib/nav.config.ts` IA, the new MDX components, and the Stripe-tier voice.

Do not delete this folder — it is the canonical source for the migration spreadsheet.
