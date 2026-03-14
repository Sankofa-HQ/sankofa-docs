import Link from "next/link";
import { ArrowRight, Box, Cpu, HardDriveUpload, Rocket } from "lucide-react";
import { DocBadge } from "@/components/docs/DocBadge";
import { getFeaturedDocs, getSidebarSections } from "@/lib/docs";

const quickLinks = [
  {
    title: "Quickstart",
    body: "Initialize the Flutter SDK, send your first events, and verify ingest.",
    href: "/getting-started/quickstart",
    icon: Rocket,
    badge: "Official" as const,
  },
  {
    title: "Flutter SDK",
    body: "Track, identify, set people properties, and wire replay in one client.",
    href: "/sdk/flutter",
    icon: Box,
    badge: "Official" as const,
  },
  {
    title: "HTTP ingestion",
    body: "Use the direct v1 endpoints when you need custom server or pipeline integrations.",
    href: "/integrations/http-ingestion",
    icon: HardDriveUpload,
    badge: "Custom" as const,
  },
  {
    title: "Self-hosting",
    body: "Run Sankofa with Docker Compose, ClickHouse, and the Go engine.",
    href: "/self-hosting",
    icon: Cpu,
  },
];

export default function DocsHomePage() {
  const featuredDocs = getFeaturedDocs();
  const sections = getSidebarSections();

  return (
    <main id="main-content" className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6">
      <section className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.72fr)]">
        <div className="surface-card p-8 sm:p-10">
          <span className="section-kicker">Documentation</span>
          <h1 className="mt-4 max-w-4xl font-display text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
            Usage, SDK, integration, and self-hosting guides built from the repo itself.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Sankofa Docs covers the actual surfaces that ship today: the
            official Flutter SDK, direct HTTP ingestion, analytics concepts,
            and the self-hosted Go + ClickHouse stack.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/getting-started/quickstart" className="button-primary">
              Start with quickstart
            </Link>
            <Link href="/sdk/flutter" className="button-secondary">
              Explore Flutter SDK
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {quickLinks.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 transition-transform hover:-translate-y-0.5 hover:bg-white"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                      <Icon className="h-5 w-5 text-rose-600" />
                    </div>
                    {item.badge ? <DocBadge badge={item.badge} /> : null}
                  </div>
                  <p className="mt-4 font-display text-2xl font-semibold text-slate-950">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {item.body}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-card p-8">
            <p className="section-kicker">Shipped surfaces</p>
            <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">
              <p>
                <strong className="text-slate-950">Official today:</strong>{" "}
                Flutter SDK, replay helpers, direct HTTP ingestion, Go engine,
                ClickHouse analytics store.
              </p>
              <p>
                <strong className="text-slate-950">Enterprise labels:</strong>{" "}
                session replay storage, billing and subscriptions, SAML/SSO, and
                audit routes are marked explicitly where relevant.
              </p>
              <p>
                <strong className="text-slate-950">Not documented as official SDKs:</strong>{" "}
                JavaScript, iOS, Android, and web SDKs are omitted because they
                do not exist in this repo today.
              </p>
            </div>
          </div>

          <div className="surface-card p-8">
            <p className="section-kicker">Browse by section</p>
            <div className="mt-5 space-y-3">
              {sections.map((section) => (
                <Link
                  key={section.key}
                  href={section.items[0]?.href ?? "/"}
                  className="flex items-center justify-between rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4 transition-colors hover:bg-white"
                >
                  <div>
                    <p className="font-semibold text-slate-950">{section.title}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {section.description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="surface-card p-8">
          <span className="section-kicker">What to read first</span>
          <div className="mt-6 space-y-5">
            {featuredDocs.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="block rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 transition-transform hover:-translate-y-0.5 hover:bg-white"
              >
                <div className="flex items-center gap-2">
                  <span className="font-display text-2xl font-semibold text-slate-950">
                    {page.title}
                  </span>
                  {page.badge ? <DocBadge badge={page.badge} /> : null}
                </div>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {page.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="surface-card p-8">
          <span className="section-kicker">Documentation approach</span>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <p className="font-display text-2xl font-semibold text-slate-950">
                Repo-backed
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Every guide points back to the actual SDK, engine, env vars, or
                compose files that exist in this repository.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <p className="font-display text-2xl font-semibold text-slate-950">
                Mixed core + EE
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Enterprise-only routes and features live alongside the core docs
                with explicit labels instead of a separate docs site.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <p className="font-display text-2xl font-semibold text-slate-950">
                Search-ready
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Content is stored as MDX with typed metadata, so the site can
                grow into search or versioning later without a rewrite.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <p className="font-display text-2xl font-semibold text-slate-950">
                Operator-first
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                The docs are written for product teams, integrators, and
                operators who need exact setup and reference details, not a
                marketing summary.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
