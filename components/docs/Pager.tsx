import Link from "next/link";
import type { DocPage } from "@/lib/content";

export function Pager({
  previous,
  next,
}: {
  previous: DocPage | null;
  next: DocPage | null;
}) {
  if (!previous && !next) return null;
  return (
    <nav className="docs-pager" aria-label="Pagination">
      {previous ? (
        <Link href={previous.href} className="docs-pager-link">
          <div className="docs-pager-direction">← Previous</div>
          <div className="docs-pager-title">{previous.frontmatter.title}</div>
        </Link>
      ) : (
        <div className="docs-pager-link is-empty" aria-hidden />
      )}
      {next ? (
        <Link href={next.href} className="docs-pager-link is-next">
          <div className="docs-pager-direction">Next →</div>
          <div className="docs-pager-title">{next.frontmatter.title}</div>
        </Link>
      ) : (
        <div className="docs-pager-link is-empty" aria-hidden />
      )}
    </nav>
  );
}
