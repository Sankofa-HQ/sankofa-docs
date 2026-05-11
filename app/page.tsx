import Link from "next/link";
import { getTopNavSections } from "@/lib/nav.config";
import { CardGrid, Card } from "@/components/mdx/Card";

const PRODUCTS = [
  { slug: "vision", title: "Vision", body: "Five-surface strategy workspace — Canvas, Roadmap, OKRs, Initiatives, Docs." },
  { slug: "plan", title: "Plan", body: "Tickets bonded to deploys, replays, and revenue impact." },
  { slug: "catch", title: "Catch", body: "Crash detection with auto-rollback in under 60 seconds." },
  { slug: "switch", title: "Switch", body: "Feature flags with cohort targeting and halt webhooks." },
  { slug: "deploy", title: "Deploy", body: "OTA releases gated by Catch and Switch signals." },
  { slug: "analytics", title: "Analytics", body: "Events, cohorts, funnels, flows, retention." },
  { slug: "pulse", title: "Pulse", body: "Surveys triggered by real user behavior." },
  { slug: "config", title: "Remote Config", body: "Typed values with cohort-targeted payloads." },
];

export default function LandingPage() {
  const topSections = getTopNavSections();
  return (
    <main id="main-content" className="container-wide" style={{ padding: "72px 24px 96px" }} data-pagefind-body>
      <section style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
        <p
          style={{
            font: "500 12px/16px var(--font-mono)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: 16,
          }}
        >
          Documentation
        </p>
        <h1
          style={{
            font: "600 64px/72px var(--font-display)",
            letterSpacing: "-0.022em",
            margin: 0,
            background: "linear-gradient(180deg, var(--page-fg) 0%, var(--accent) 200%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Build, ship, observe, and recover — on one platform.
        </h1>
        <p
          style={{
            marginTop: 20,
            font: "400 19px/30px var(--font-sans)",
            color: "var(--page-fg-muted)",
            letterSpacing: "-0.011em",
          }}
        >
          Sankofa unifies eight products behind one engine and one set of SDKs:
          Vision, Plan, Catch, Switch, Deploy, Analytics, Pulse, and Remote Config.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 32 }}>
          <Link href="/get-started/quickstart" className="btn btn-primary btn-lg">
            Quickstart →
          </Link>
          <Link href="/get-started/overview" className="btn btn-ghost btn-lg">
            Read the overview
          </Link>
        </div>
      </section>

      <section style={{ marginTop: 96 }}>
        <h2
          style={{
            font: "600 32px/40px var(--font-display)",
            letterSpacing: "-0.018em",
            margin: "0 0 24px",
          }}
        >
          Browse by section
        </h2>
        <CardGrid cols={3}>
          {topSections.map((s) => (
            <Card
              key={s.key}
              href={`/${s.key}/overview`}
              eyebrow={`${s.order}`}
              title={s.title}
            >
              {s.description}
            </Card>
          ))}
        </CardGrid>
      </section>

      <section style={{ marginTop: 96 }}>
        <h2
          style={{
            font: "600 32px/40px var(--font-display)",
            letterSpacing: "-0.018em",
            margin: "0 0 24px",
          }}
        >
          The eight products
        </h2>
        <CardGrid cols={4}>
          {PRODUCTS.map((p) => (
            <Card
              key={p.slug}
              href={`/products/${p.slug}/overview`}
              eyebrow="Product"
              title={p.title}
            >
              {p.body}
            </Card>
          ))}
        </CardGrid>
      </section>
    </main>
  );
}
