/**
 * Information architecture for the Sankofa docs site — single source of truth
 * for sidebar ordering, top-nav grouping, and nav placement.
 *
 * Pages live under `content/<section>/<...>` as `.mdx` files. A page is included
 * in the sidebar only if (a) it appears in the `pages` array of the section
 * below AND (b) the corresponding MDX file exists. This keeps "scaffolded but
 * empty" sections from leaking into the sidebar before their pages ship.
 */

export type NavSection = {
  /** Stable key, also the URL path prefix. */
  key: string;
  /** Title shown in the top nav and sidebar header. */
  title: string;
  /** One-line description (used on overview pages and search). */
  description: string;
  /** Order in the top nav and sidebar. */
  order: number;
  /** Whether this section appears in the primary top-nav strip. */
  topNav: boolean;
  /** Ordered list of groups inside this section. */
  groups: NavGroup[];
};

export type NavGroup = {
  /** Group title shown in the sidebar. Optional — bare pages under a section
   *  can sit in a default group with no title. */
  title?: string;
  /** Pages in display order. */
  pages: NavPage[];
};

export type NavPage = {
  /** Slug relative to the section (e.g. `overview`, `install/web`). */
  slug: string;
  /** Display title in the sidebar; if omitted, frontmatter title is used. */
  title?: string;
  /** Optional badge ("New", "Beta", etc.). */
  badge?: string;
};

export const SECTIONS: NavSection[] = [
  {
    key: "get-started",
    title: "Get started",
    description: "Install, initialize, and send your first events.",
    order: 1,
    topNav: true,
    groups: [
      {
        pages: [
          { slug: "overview" },
          { slug: "quickstart" },
        ],
      },
      {
        title: "Install",
        pages: [
          { slug: "install/web" },
          { slug: "install/flutter" },
          { slug: "install/react-native" },
          { slug: "install/ios" },
          { slug: "install/android" },
          { slug: "install/node" },
          { slug: "install/go" },
          { slug: "install/python" },
          { slug: "install/java" },
        ],
      },
      {
        title: "First steps",
        pages: [
          { slug: "first-event" },
          { slug: "first-feature-flag" },
          { slug: "first-remote-config" },
        ],
      },
    ],
  },
  {
    key: "concepts",
    title: "Concepts",
    description: "Tenancy, identity, ingestion, decisions, retention.",
    order: 2,
    topNav: true,
    groups: [
      { pages: [{ slug: "overview" }] },
      {
        title: "Account model",
        pages: [
          { slug: "organizations-and-projects" },
          { slug: "environments-and-api-keys" },
          { slug: "rbac-and-teams" },
        ],
      },
      {
        title: "Data model",
        pages: [
          { slug: "events" },
          { slug: "identity-and-aliases" },
          { slug: "sessions" },
          { slug: "default-properties" },
          { slug: "cohorts" },
        ],
      },
      {
        title: "Ingestion & decisions",
        pages: [
          { slug: "ingestion-model" },
          { slug: "decision-handshake" },
          { slug: "exposure-tracking" },
          { slug: "data-retention" },
        ],
      },
    ],
  },
  {
    key: "products",
    title: "Products",
    description: "Vision, Plan, Catch, Switch, Deploy, Analytics, Pulse, Remote Config.",
    order: 3,
    topNav: true,
    groups: [
      { pages: [{ slug: "overview" }] },
      {
        title: "Strategy & planning",
        pages: [
          { slug: "vision/overview", title: "Vision" },
          { slug: "plan/overview", title: "Plan" },
        ],
      },
      {
        title: "Engineering",
        pages: [
          { slug: "catch/overview", title: "Catch" },
          { slug: "deploy/overview", title: "Deploy" },
        ],
      },
      {
        title: "Experimentation",
        pages: [
          { slug: "switch/overview", title: "Switch" },
          { slug: "config/overview", title: "Remote Config" },
        ],
      },
      {
        title: "Insights",
        pages: [
          { slug: "analytics/overview", title: "Analytics" },
          { slug: "pulse/overview", title: "Pulse" },
        ],
      },
    ],
  },
  {
    key: "sdks",
    title: "SDKs",
    description: "Web (multi-package), Flutter, RN, iOS, Android, Java, Go, Node, Python, CLI.",
    order: 4,
    topNav: true,
    groups: [
      {
        pages: [
          { slug: "overview" },
          { slug: "versioning-policy" },
        ],
      },
      {
        title: "Web (multi-package)",
        pages: [
          { slug: "web/overview" },
          { slug: "web/install" },
          { slug: "web/packages/browser", title: "@sankofa/browser" },
          { slug: "web/packages/catch", title: "@sankofa/catch" },
          { slug: "web/packages/config", title: "@sankofa/config" },
          { slug: "web/packages/switch", title: "@sankofa/switch" },
          { slug: "web/packages/pulse", title: "@sankofa/pulse" },
          { slug: "web/packages/replay-rrweb", title: "@sankofa/replay-rrweb" },
          { slug: "web/packages/react", title: "@sankofa/react" },
        ],
      },
      {
        title: "Mobile",
        pages: [
          { slug: "flutter/overview", title: "Flutter" },
          { slug: "react-native/overview", title: "React Native" },
          { slug: "ios/overview", title: "iOS" },
          { slug: "android/overview", title: "Android" },
        ],
      },
      {
        title: "Server",
        pages: [
          { slug: "node/overview", title: "Node" },
          { slug: "go/overview", title: "Go" },
          { slug: "java/overview", title: "Java" },
          { slug: "python/overview", title: "Python" },
        ],
      },
      {
        title: "Tooling",
        pages: [{ slug: "cli/overview", title: "CLI" }],
      },
    ],
  },
  {
    key: "api",
    title: "API reference",
    description: "REST surface — ingestion, decisions, exposures, webhooks.",
    order: 5,
    topNav: true,
    groups: [
      {
        pages: [
          { slug: "overview" },
          { slug: "authentication" },
          { slug: "rate-limits" },
          { slug: "errors" },
        ],
      },
      {
        title: "Ingestion",
        pages: [
          { slug: "ingestion/track" },
          { slug: "ingestion/people" },
          { slug: "ingestion/alias" },
          { slug: "ingestion/batch" },
          { slug: "payload-reference" },
        ],
      },
      {
        title: "Switch",
        pages: [
          { slug: "switch/decision" },
          { slug: "switch/exposures" },
          { slug: "switch/halt-webhook" },
        ],
      },
      {
        title: "Config",
        pages: [
          { slug: "config/decision" },
          { slug: "config/versions" },
        ],
      },
      {
        title: "Pulse",
        pages: [
          { slug: "pulse/trigger" },
          { slug: "pulse/submissions" },
        ],
      },
      {
        title: "Deploy & Catch",
        pages: [
          { slug: "deploy/check" },
          { slug: "deploy/telemetry" },
          { slug: "catch/events" },
          { slug: "catch/symbolication" },
        ],
      },
      {
        title: "Webhooks",
        pages: [{ slug: "webhooks" }],
      },
    ],
  },
  // Footer-only sections
  {
    key: "integrations",
    title: "Integrations",
    description: "Third-party integrations.",
    order: 6,
    topNav: false,
    groups: [{ pages: [{ slug: "overview" }] }],
  },
  {
    key: "account",
    title: "Account & billing",
    description: "Plans, billing, teams, RBAC, audit, SSO, residency.",
    order: 7,
    topNav: false,
    groups: [
      {
        pages: [
          { slug: "overview" },
          { slug: "plans-and-billing" },
          { slug: "teams-and-members" },
          { slug: "rbac" },
          { slug: "audit-log" },
          { slug: "sso" },
          { slug: "data-residency" },
        ],
      },
    ],
  },
  {
    key: "resources",
    title: "Resources",
    description: "Changelog, status, support, security, compliance, trust.",
    order: 8,
    topNav: false,
    groups: [
      {
        pages: [
          { slug: "changelog" },
          { slug: "status" },
          { slug: "support" },
          { slug: "security" },
          { slug: "compliance" },
          { slug: "trust-center" },
        ],
      },
    ],
  },
];

export function getSection(key: string): NavSection | undefined {
  return SECTIONS.find((s) => s.key === key);
}

export function getTopNavSections(): NavSection[] {
  return SECTIONS.filter((s) => s.topNav).sort((a, b) => a.order - b.order);
}

/** Flat list of every (sectionKey, slug) pair in declaration order. */
export function getAllNavEntries(): { sectionKey: string; slug: string; title?: string; badge?: string }[] {
  const entries: { sectionKey: string; slug: string; title?: string; badge?: string }[] = [];
  for (const section of SECTIONS) {
    for (const group of section.groups) {
      for (const page of group.pages) {
        entries.push({ sectionKey: section.key, slug: page.slug, title: page.title, badge: page.badge });
      }
    }
  }
  return entries;
}
