"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function SearchTrigger() {
  const router = useRouter();
  const [mac, setMac] = useState(false);

  useEffect(() => {
    setMac(navigator.platform.toLowerCase().includes("mac"));
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        router.push("/search");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return (
    <button
      type="button"
      className="docs-search-trigger"
      onClick={() => router.push("/search")}
      aria-label="Search documentation"
    >
      <span aria-hidden style={{ fontFamily: "var(--font-mono)", fontSize: 14 }}>⌕</span>
      <span>Search docs…</span>
      <kbd className="docs-search-kbd">{mac ? "⌘" : "Ctrl"} K</kbd>
    </button>
  );
}
