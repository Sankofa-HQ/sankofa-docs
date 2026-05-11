"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { SankofaMark } from "@/components/brand/SankofaMark";
import { DocsBadge } from "@/components/brand/DocsBadge";
import { mainSiteUrl, appUrl } from "@/lib/site";

export type MobileMenuLink = { href: string; label: string };

export function MobileMenu({ links }: { links: MobileMenuLink[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="nav-mobile-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        style={{
          background: "transparent",
          border: `1px solid var(--border)`,
          borderRadius: 8,
          width: 36,
          height: 36,
          display: "none",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "var(--page-fg)",
        }}
      >
        <span aria-hidden style={{ font: "500 16px/1 var(--font-mono)" }}>
          {open ? "✕" : "☰"}
        </span>
      </button>
      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background: "var(--page-bg)",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          {/* Sheet header — mirrors the main nav so the page feels continuous */}
          <div
            style={{
              flex: "0 0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: 64,
              padding: "0 20px",
              borderBottom: `1px solid var(--border)`,
              background: "var(--page-bg)",
            }}
          >
            <Link
              href="/"
              onClick={() => setOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <SankofaMark />
              <span
                style={{
                  font: "600 17px/20px var(--font-display)",
                  letterSpacing: "-0.018em",
                }}
              >
                Sankofa
              </span>
              <DocsBadge />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              style={{
                background: "transparent",
                border: `1px solid var(--border)`,
                borderRadius: 8,
                width: 36,
                height: 36,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--page-fg)",
              }}
            >
              <span aria-hidden style={{ font: "500 16px/1 var(--font-mono)" }}>
                ✕
              </span>
            </button>
          </div>

          {/* Body — links + cluster, allowed to grow vertically */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "20px 20px 32px",
              gap: 24,
            }}
          >
            <p
              style={{
                font: "500 11px/16px var(--font-mono)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--page-fg-soft)",
                margin: 0,
              }}
            >
              Browse
            </p>
            <nav
              aria-label="Primary"
              style={{ display: "flex", flexDirection: "column", gap: 8 }}
              onClick={() => setOpen(false)}
            >
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "18px 16px",
                    borderRadius: 12,
                    color: "var(--page-fg)",
                    textDecoration: "none",
                    font: "500 18px/24px var(--font-sans)",
                    letterSpacing: "-0.012em",
                    background: "var(--surface)",
                    border: `1px solid var(--border)`,
                  }}
                >
                  <span>{l.label}</span>
                  <span
                    aria-hidden
                    style={{
                      font: "500 16px/1 var(--font-mono)",
                      color: "var(--page-fg-soft)",
                    }}
                  >
                    →
                  </span>
                </Link>
              ))}
            </nav>

            <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
              <a
                href={appUrl}
                className="btn btn-primary"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  height: 48,
                  fontSize: 15,
                }}
              >
                Open dashboard
              </a>
              <a
                href={mainSiteUrl}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: `1px solid var(--border)`,
                  color: "var(--page-fg-muted)",
                  textDecoration: "none",
                  font: "500 14px/20px var(--font-sans)",
                  background: "var(--surface)",
                }}
                onClick={() => setOpen(false)}
              >
                <span>Visit sankofa.dev</span>
                <span aria-hidden>↗</span>
              </a>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: `1px solid var(--border)`,
                  background: "var(--surface)",
                }}
              >
                <span
                  style={{
                    font: "500 11px/16px var(--font-mono)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--page-fg-soft)",
                  }}
                >
                  Appearance
                </span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
