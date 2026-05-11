import test from "node:test";
import assert from "node:assert/strict";
import {
  getAllPages,
  getPageByHref,
  getSidebar,
  getAdjacent,
  getBreadcrumbs,
  headingId,
  getMissingPages,
} from "./content.ts";

test("getAllPages returns at least the two seed pages", () => {
  const pages = getAllPages();
  assert.ok(pages.length >= 2, "expected at least two pages on disk");
  assert.ok(
    pages.some((p) => p.href === "/get-started/overview"),
    "expected /get-started/overview"
  );
  assert.ok(
    pages.some((p) => p.href === "/get-started/quickstart"),
    "expected /get-started/quickstart"
  );
});

test("getPageByHref normalizes trailing slashes", () => {
  const a = getPageByHref("/get-started/overview");
  const b = getPageByHref("/get-started/overview/");
  assert.ok(a, "page must exist");
  assert.equal(a?.href, b?.href);
});

test("frontmatter validation requires title and description", () => {
  const overview = getPageByHref("/get-started/overview");
  assert.ok(overview);
  assert.ok(overview!.frontmatter.title.length > 0);
  assert.ok(overview!.frontmatter.description.length > 0);
});

test("sidebar surfaces full IA with shipping status", () => {
  const sidebar = getSidebar("get-started");
  assert.ok(sidebar);
  const allItems = sidebar!.groups.flatMap((g) => g.items);
  const overview = allItems.find((i) => i.href === "/get-started/overview");
  const quickstart = allItems.find((i) => i.href === "/get-started/quickstart");
  assert.ok(overview);
  assert.equal(overview!.status, "shipped");
  assert.ok(quickstart);
  assert.equal(quickstart!.status, "shipped");
  // Every section declared in nav.config.ts now resolves to shipped pages —
  // the docs rebuild is complete, so no item in any sidebar should be `planned`.
  const account = getSidebar("account");
  assert.ok(account);
  const accountItems = account!.groups.flatMap((g) => g.items);
  const accountOverview = accountItems.find((i) => i.href === "/account/overview");
  assert.ok(accountOverview);
  assert.equal(accountOverview!.status, "shipped");
});

test("adjacency: overview -> quickstart", () => {
  const { next } = getAdjacent("/get-started/overview");
  assert.equal(next?.href, "/get-started/quickstart");
});

test("breadcrumbs render section + page title", () => {
  const crumbs = getBreadcrumbs("/get-started/quickstart");
  assert.equal(crumbs[0].label, "Get started");
  assert.equal(crumbs[crumbs.length - 1].label, "Quickstart");
});

test("headingId is stable", () => {
  assert.equal(headingId("Initialize the SDK"), "initialize-the-sdk");
  assert.equal(headingId("API/Payload reference"), "apipayload-reference");
  assert.equal(headingId("@sankofa/browser"), "sankofabrowser");
});

test("missing pages list is empty — full IA shipped", () => {
  const missing = getMissingPages();
  assert.equal(
    missing.length,
    0,
    `expected zero planned-but-unshipped pages, got: ${missing.join(", ")}`
  );
});
