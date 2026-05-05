"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import type { SidebarSection } from "@/lib/content";

export function MobileDrawer({ sidebar }: { sidebar: SidebarSection }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="docs-mobile-toggle"
        aria-label="Open navigation"
        onClick={() => setOpen(true)}
      >
        <span aria-hidden style={{ fontFamily: "var(--font-mono)", fontSize: 18 }}>
          ☰
        </span>
      </button>
      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Documentation navigation"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background: "var(--page-bg)",
            overflowY: "auto",
            padding: "24px 24px 96px",
          }}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              background: "transparent",
              border: 0,
              cursor: "pointer",
              color: "var(--page-fg)",
              fontSize: 24,
              fontFamily: "var(--font-mono)",
            }}
          >
            ✕
          </button>
          <div onClick={() => setOpen(false)}>
            <Sidebar sidebar={sidebar} />
          </div>
        </div>
      ) : null}
    </>
  );
}
