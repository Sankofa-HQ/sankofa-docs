import type { Metadata } from "next";
import { SearchClient } from "./SearchClient";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the Sankofa documentation.",
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <main
      id="main-content"
      className="container"
      style={{ padding: "72px 24px 128px", maxWidth: 720 }}
    >
      <p
        style={{
          font: "500 12px/16px var(--font-mono)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--accent)",
          margin: "0 0 12px",
        }}
      >
        Search
      </p>
      <h1
        style={{
          font: "600 36px/42px var(--font-display)",
          letterSpacing: "-0.018em",
          margin: "0 0 8px",
        }}
      >
        Search the docs
      </h1>
      <p
        style={{
          font: "400 17px/28px var(--font-sans)",
          color: "var(--page-fg-muted)",
          margin: "0 0 32px",
        }}
      >
        Find guides, references, and SDK docs. Tip: hit{" "}
        <kbd className="code-chip">⌘ K</kbd> from any page.
      </p>
      <SearchClient />
    </main>
  );
}
