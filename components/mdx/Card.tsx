import Link from "next/link";
import type { ReactNode } from "react";
import { isShippedHref } from "@/lib/content";

export function CardGrid({
  children,
  cols = 2,
}: {
  children: ReactNode;
  cols?: 2 | 3 | 4;
}) {
  return (
    <div className="docs-cardgrid" data-cols={cols}>
      {children}
    </div>
  );
}

export function Card({
  href,
  eyebrow,
  title,
  children,
}: {
  href?: string;
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}) {
  const planned = href ? href.startsWith("/") && !isShippedHref(href) : false;
  const content = (
    <>
      {eyebrow ? <p className="docs-card-eyebrow">{eyebrow}</p> : null}
      <p className="docs-card-title">
        {title}
        {planned ? (
          <span className="docs-card-soon" aria-hidden>
            soon
          </span>
        ) : null}
      </p>
      {children ? <p className="docs-card-body">{children}</p> : null}
    </>
  );
  if (href && !planned) {
    return (
      <Link href={href} className="docs-card">
        {content}
      </Link>
    );
  }
  if (planned) {
    return (
      <div
        className="docs-card is-planned"
        title="Coming soon — this page is in the rebuild plan but hasn't shipped yet."
      >
        {content}
      </div>
    );
  }
  return <div className="docs-card">{content}</div>;
}
