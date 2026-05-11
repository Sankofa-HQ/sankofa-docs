import { ImageResponse } from "next/og";
import { getAllPages, getPageBySlug } from "@/lib/content";
import { getSection } from "@/lib/nav.config";

export const dynamic = "force-static";

const SIZE = { width: 1200, height: 630 };
const BRAND_ORANGE = "#FA7319";
const INK = "#0B0A09";
const PAPER = "#FBFAF7";
const MUTED = "#6F6863";
const RULE = "#E5DFD6";

export function generateStaticParams() {
  return getAllPages().map((page) => ({
    slug: [page.sectionKey, ...page.slugParts].filter(Boolean),
  }));
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await context.params;
  const page = getPageBySlug(slug);
  if (!page) return new Response("Not found", { status: 404 });
  const section = getSection(page.sectionKey);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: PAPER,
          padding: "72px 84px",
          color: INK,
        }}
      >
        <div
          style={{
            display: "flex",
            height: 6,
            background: BRAND_ORANGE,
            marginInline: -84,
            marginTop: -72,
            marginBottom: 56,
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 36,
              height: 36,
              borderRadius: 8,
              background: BRAND_ORANGE,
              alignItems: "center",
              justifyContent: "center",
              color: PAPER,
              fontWeight: 800,
              fontSize: 20,
            }}
          >
            S
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, fontSize: 22, fontWeight: 600 }}>
            <span>Sankofa</span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: MUTED,
              }}
            >
              Docs
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            gap: 24,
            marginTop: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: BRAND_ORANGE,
            }}
          >
            {section?.title ?? "Sankofa Docs"}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              maxWidth: 1000,
            }}
          >
            {page.frontmatter.title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              lineHeight: 1.35,
              color: MUTED,
              maxWidth: 980,
            }}
          >
            {page.frontmatter.description.length > 220
              ? `${page.frontmatter.description.slice(0, 217)}…`
              : page.frontmatter.description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid ${RULE}`,
            paddingTop: 24,
            fontSize: 20,
            color: MUTED,
          }}
        >
          <div style={{ display: "flex" }}>docs.sankofa.dev{page.href}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                display: "flex",
                width: 10,
                height: 10,
                borderRadius: 999,
                background: BRAND_ORANGE,
              }}
            />
            <span>Read the docs</span>
          </div>
        </div>
      </div>
    ),
    SIZE
  );
}
