"use client";

import { useEffect, useRef, useState } from "react";

type PagefindResult = {
  id: string;
  data: () => Promise<{
    url: string;
    excerpt: string;
    meta: { title?: string };
  }>;
};

type Pagefind = {
  search: (q: string) => Promise<{ results: PagefindResult[] }>;
};

type Loaded = { title: string; url: string; excerpt: string };

declare global {
  interface Window {
    __pagefind?: Pagefind;
  }
}

async function loadPagefind(): Promise<Pagefind | null> {
  if (typeof window === "undefined") return null;
  if (window.__pagefind) return window.__pagefind;
  try {
    // Dynamic import via variable — escapes TypeScript module resolution because
    // /pagefind/pagefind.js only exists in the production export, not at build time.
    const url = "/pagefind/pagefind.js";
    const mod = (await import(/* webpackIgnore: true */ /* @vite-ignore */ url)) as Pagefind;
    window.__pagefind = mod;
    return mod;
  } catch {
    return null;
  }
}

export function SearchClient() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Loaded[]>([]);
  const [status, setStatus] = useState<"idle" | "ready" | "missing" | "error">(
    "idle"
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    loadPagefind().then((pf) => setStatus(pf ? "ready" : "missing"));
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!q.trim()) {
      setResults([]);
      return;
    }
    if (status !== "ready") return;
    (async () => {
      const pf = await loadPagefind();
      if (!pf) return;
      try {
        const search = await pf.search(q);
        const top = await Promise.all(
          search.results.slice(0, 20).map(async (r) => {
            const data = await r.data();
            return {
              title: data.meta.title ?? data.url,
              url: data.url,
              excerpt: data.excerpt,
            };
          })
        );
        if (!cancelled) setResults(top);
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [q, status]);

  return (
    <div>
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="What are you looking for?"
        type="search"
        aria-label="Search query"
        style={{
          width: "100%",
          padding: "14px 18px",
          fontSize: 16,
          fontFamily: "var(--font-sans)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          background: "var(--surface)",
          color: "var(--page-fg)",
        }}
      />

      {status === "missing" ? (
        <p
          style={{
            marginTop: 24,
            font: "400 14px/22px var(--font-sans)",
            color: "var(--page-fg-soft)",
          }}
        >
          Search index not built yet. Run <code className="code-chip">pnpm build</code>{" "}
          to generate the Pagefind index, or use the dev server (search activates
          on production builds).
        </p>
      ) : null}

      {status === "error" ? (
        <p
          style={{
            marginTop: 24,
            font: "400 14px/22px var(--font-sans)",
            color: "var(--state-error)",
          }}
        >
          Search failed to load. Refresh the page to try again.
        </p>
      ) : null}

      <ul style={{ listStyle: "none", padding: 0, marginTop: 32 }}>
        {results.map((r) => (
          <li key={r.url} style={{ marginBottom: 16 }}>
            <a
              href={r.url}
              style={{
                display: "block",
                padding: 16,
                border: "1px solid var(--border)",
                borderRadius: 12,
                background: "var(--surface)",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  font: "600 16px/22px var(--font-display)",
                  color: "var(--page-fg)",
                  marginBottom: 4,
                }}
              >
                {r.title}
              </div>
              <div
                style={{
                  font: "400 13px/20px var(--font-sans)",
                  color: "var(--page-fg-muted)",
                }}
                dangerouslySetInnerHTML={{ __html: r.excerpt }}
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
