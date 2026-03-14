import test from "node:test";
import assert from "node:assert/strict";
import {
  getAdjacentDocs,
  getAllDocPages,
  getDocPageBySlug,
  getSidebarSections,
} from "./docs.ts";

test("loads the docs corpus into sidebar sections", () => {
  const sections = getSidebarSections();

  assert.ok(sections.length >= 6);
  assert.ok(sections.some((section) => section.key === "sdk"));
  assert.ok(sections.some((section) => section.key === "self-hosting"));
});

test("resolves flutter reference docs by slug", () => {
  const page = getDocPageBySlug(["sdk", "flutter", "reference"]);

  assert.ok(page);
  assert.equal(page.title, "Flutter API reference");
  assert.equal(page.badge, "Official");
});

test("extracts headings for toc generation", () => {
  const page = getDocPageBySlug(["integrations", "api-payload-reference"]);

  assert.ok(page);
  assert.ok(page.headings.some((heading) => heading.text === "Track payload"));
  assert.ok(page.headings.some((heading) => heading.text === "Alias payload"));
});

test("builds previous and next links from the sorted corpus", () => {
  const page = getDocPageBySlug(["sdk", "flutter", "reference"]);

  assert.ok(page);

  const adjacent = getAdjacentDocs(page.href);
  assert.ok(adjacent.previous);
  assert.ok(adjacent.next);
});

test("ships a substantial initial docs set", () => {
  const pages = getAllDocPages();

  assert.ok(pages.length >= 20);
});
