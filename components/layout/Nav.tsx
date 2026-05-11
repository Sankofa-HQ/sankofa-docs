"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";
import { SankofaMark } from "@/components/brand/SankofaMark";
import { DocsBadge } from "@/components/brand/DocsBadge";
import { SearchTrigger } from "@/components/docs/SearchTrigger";
import { mainSiteUrl, appUrl } from "@/lib/site";

const NAV_LINKS: { href: string; label: string }[] = [
  { href: "/get-started/overview", label: "Get started" },
  { href: "/concepts/overview", label: "Concepts" },
  { href: "/products/overview", label: "Products" },
  { href: "/sdks/overview", label: "SDKs" },
  { href: "/api/overview", label: "API reference" },
];

export function Nav() {
  // Theme-dependent colors come from CSS vars (var(--nav-bg), var(--nav-border))
  // so the server-rendered HTML matches the client first render regardless of
  // theme — the FOUC-bootstrap script just flips the data-theme attribute and
  // the cascade picks up the right values.
  return (
    <nav className="site-nav">

      <div
        className="container-wide"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          height: 64,
        }}
      >
        <Link
          href="/"
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
              color: "var(--page-fg)",
            }}
          >
            Sankofa
          </span>
          <DocsBadge />
        </Link>

        <div
          className="nav-links"
          style={{ display: "flex", alignItems: "center", gap: 24 }}
        >
          {NAV_LINKS.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <SearchTrigger />
          <div
            className="nav-right-desktop"
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            <ThemeToggle />
            <a
              href={mainSiteUrl}
              className="nav-marketing-link"
              style={{
                color: "var(--page-fg-muted)",
                textDecoration: "none",
                font: "500 13px/20px var(--font-sans)",
              }}
            >
              sankofa.dev
            </a>
            <a href={appUrl} className="btn btn-primary nav-cta">
              Open dashboard
            </a>
          </div>
          <MobileMenu links={NAV_LINKS} />
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      style={{
        color: "var(--page-fg-muted)",
        textDecoration: "none",
        font: "500 13px/20px var(--font-sans)",
        letterSpacing: "-0.006em",
        transition: "color 160ms",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--page-fg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--page-fg-muted)";
      }}
    >
      {label}
    </Link>
  );
}
