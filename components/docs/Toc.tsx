"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/content";

export function Toc({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string>(headings[0]?.id ?? "");

  useEffect(() => {
    if (typeof window === "undefined" || headings.length === 0) return;
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: "-72px 0px -55% 0px", threshold: [0, 1] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="docs-toc" aria-label="Table of contents">
      <p className="docs-toc-title">On this page</p>
      <ul className="docs-toc-list">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`docs-toc-link${active === h.id ? " is-active" : ""}`}
              data-depth={h.depth}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
