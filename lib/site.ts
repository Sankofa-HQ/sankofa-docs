export const docsUrl =
  process.env.NEXT_PUBLIC_DOCS_URL ?? "http://localhost:3002";

export const mainSiteUrl =
  process.env.NEXT_PUBLIC_MAIN_SITE_URL ?? "http://localhost:3001";

export const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000/login";

export const docsTopLinks = [
  { href: "/getting-started", label: "Getting Started" },
  { href: "/sdk/android", label: "Android SDK" },
  { href: "/sdk/flutter", label: "Flutter SDK" },
  { href: "/sdk/web", label: "Web SDK" },
  { href: "/integrations/http-ingestion", label: "Integrations" },
  { href: "/self-hosting", label: "Self-hosting" },
];
