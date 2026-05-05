import type { ReactNode } from "react";
import {
  getAdjacent,
  getBreadcrumbs,
  getSidebar,
  type DocPage,
} from "@/lib/content";
import { Sidebar } from "./Sidebar";
import { Toc } from "./Toc";
import { Pager } from "./Pager";
import { Breadcrumbs } from "./Breadcrumbs";
import { EditOnGitHubLink } from "./EditOnGitHubLink";
import { MobileDrawer } from "./MobileDrawer";

export function PageShell({
  page,
  children,
}: {
  page: DocPage;
  children: ReactNode;
}) {
  const sidebar = getSidebar(page.sectionKey);
  const { previous, next } = getAdjacent(page.href);
  const crumbs = getBreadcrumbs(page.href);

  return (
    <main id="main-content" className="docs-shell">
      {sidebar ? <Sidebar sidebar={sidebar} /> : <div />}

      <article className="docs-main">
        <Breadcrumbs items={crumbs.slice(0, -1)} />

        <header className="docs-page-header">
          {page.navBadge ? (
            <p className="docs-page-eyebrow">{page.navBadge}</p>
          ) : page.groupTitle ? (
            <p className="docs-page-eyebrow">{page.groupTitle}</p>
          ) : null}
          <h1 className="docs-page-title">{page.frontmatter.title}</h1>
          <p className="docs-page-description">{page.frontmatter.description}</p>
        </header>

        {children}

        <EditOnGitHubLink sourcePath={page.sourcePath} />

        <Pager previous={previous} next={next} />
      </article>

      {page.frontmatter.toc !== false ? (
        <Toc headings={page.headings.filter((h) => h.depth <= 3)} />
      ) : (
        <div />
      )}

      {sidebar ? <MobileDrawer sidebar={sidebar} /> : null}
    </main>
  );
}
