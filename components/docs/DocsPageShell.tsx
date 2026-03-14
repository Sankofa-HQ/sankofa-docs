import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DocBadge } from "@/components/docs/DocBadge";
import { DocsMobileNav } from "@/components/docs/DocsMobileNav";
import { DocsPager } from "@/components/docs/DocsPager";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { DocsToc } from "@/components/docs/DocsToc";
import {
  getAdjacentDocs,
  getDocSection,
  getSidebarSections,
  type DocPage,
} from "@/lib/docs";

export function DocsPageShell({
  page,
  children,
}: {
  page: DocPage;
  children: React.ReactNode;
}) {
  const section = getDocSection(page.section);
  const sections = getSidebarSections();
  const { previous, next } = getAdjacentDocs(page.href);

  return (
    <div className="mx-auto grid max-w-[1600px] gap-8 px-4 py-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6 xl:grid-cols-[280px_minmax(0,1fr)_260px]">
      <DocsSidebar currentHref={page.href} />

      <main id="main-content" className="min-w-0">
        <div className="mb-6 flex items-center justify-between gap-4 lg:hidden">
          <DocsMobileNav currentHref={page.href} sections={sections} />
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="transition-colors hover:text-slate-950">
            Docs
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href={`/${section.key}`}
            className="transition-colors hover:text-slate-950"
          >
            {section.title}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-950">{page.title}</span>
        </div>

        <div className="surface-card p-8 sm:p-10">
          <div className="mb-8 border-b border-slate-200 pb-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="section-kicker">{section.title}</span>
              {page.badge ? <DocBadge badge={page.badge} /> : null}
            </div>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {page.title}
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
              {page.description}
            </p>
            {page.sourceOfTruth.length > 0 ? (
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Source of truth
                </span>
                {page.sourceOfTruth.map((source) => (
                  <code
                    key={source}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700"
                  >
                    {source}
                  </code>
                ))}
              </div>
            ) : null}
          </div>

          {children}

          <DocsPager previous={previous} next={next} />
        </div>
      </main>

      <DocsToc headings={page.toc ? page.headings : []} />
    </div>
  );
}
