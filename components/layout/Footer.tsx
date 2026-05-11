import Link from "next/link";
import { SankofaMark } from "@/components/brand/SankofaMark";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Products",
    links: [
      { href: "/products/plan", label: "Plan" },
      { href: "/products/catch", label: "Catch" },
      { href: "/products/switch", label: "Switch" },
      { href: "/products/deploy", label: "Deploy" },
      { href: "/products/analytics", label: "Analytics" },
      { href: "/products/pulse", label: "Pulse" },
      { href: "/products/config", label: "Remote Config" },
      { href: "/products/ab-switch", label: "A/B Switch" },
    ],
  },
  {
    title: "SDKs",
    links: [
      { href: "/sdks/web/overview", label: "Web" },
      { href: "/sdks/flutter/overview", label: "Flutter" },
      { href: "/sdks/react-native/overview", label: "React Native" },
      { href: "/sdks/ios/overview", label: "iOS" },
      { href: "/sdks/android/overview", label: "Android" },
      { href: "/sdks/node/overview", label: "Node" },
      { href: "/sdks/cli/overview", label: "CLI" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/get-started/overview", label: "Get started" },
      { href: "/api/overview", label: "API reference" },
      { href: "/resources/changelog", label: "Changelog" },
      { href: "/resources/status", label: "Status" },
      { href: "/resources/support", label: "Support" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/resources/security", label: "Security" },
      { href: "/resources/compliance", label: "Compliance" },
      { href: "/resources/trust-center", label: "Trust center" },
      { href: "/account/data-residency", label: "Data residency" },
    ],
  },
];

const BADGES = ["GDPR-READY"];

export function Footer() {
  return (
    <footer
      style={{
        padding: "72px 0 32px",
        borderTop: "1px solid var(--border)",
        background: "var(--page-bg)",
      }}
    >
      <div className="container-wide">
        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr",
            gap: 48,
            marginBottom: 48,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <SankofaMark size={20} />
              <span
                style={{
                  font: "600 16px/20px var(--font-display)",
                  letterSpacing: "-0.018em",
                }}
              >
                Sankofa
              </span>
            </div>
            <p
              style={{
                font: "400 13px/20px var(--font-sans)",
                color: "var(--page-fg-muted)",
                maxWidth: 280,
                marginBottom: 20,
              }}
            >
              Built for the next generation of software pioneers.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {BADGES.map((b) => (
                <span
                  key={b}
                  style={{
                    font: "500 10px/14px var(--font-mono)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    padding: "4px 8px",
                    borderRadius: 4,
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    color: "var(--page-fg-soft)",
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
          {COLUMNS.map((c) => (
            <div key={c.title}>
              <div
                style={{
                  font: "500 12px/16px var(--font-mono)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--page-fg-soft)",
                  marginBottom: 16,
                }}
              >
                {c.title}
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      style={{
                        font: "400 13px/20px var(--font-sans)",
                        color: "var(--page-fg)",
                        textDecoration: "none",
                        letterSpacing: "-0.006em",
                      }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <hr className="hairline" style={{ margin: "32px 0 24px" }} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            font: "400 12px/16px var(--font-mono)",
            color: "var(--page-fg-soft)",
            letterSpacing: "0.02em",
          }}
        >
          <div>© {new Date().getFullYear()} Sankofa Systems · Proprietary</div>
          <div style={{ display: "flex", gap: 24 }}>
            <span>● All systems operational</span>
            <Link
              href="/resources/changelog"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              Changelog
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
