import Link from "next/link";
import type { ReactNode } from "react";
import { isShippedHref } from "@/lib/content";

/**
 * Smart anchor used by mdxComponents.a. Internal links to pages that haven't
 * shipped yet render as a dimmed inline span with a "soon" pill — that way the
 * seed pages can write the full prose with all the eventual cross-links in
 * place, and the docs gracefully degrade until each target page ships.
 */
export function DocLink({
  href = "#",
  children,
  ...rest
}: {
  href?: string;
  children?: ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children">) {
  // Hashes are always live (in-page anchors).
  if (href.startsWith("#")) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }

  // External links pass through untouched.
  if (/^https?:\/\//.test(href) || href.startsWith("mailto:")) {
    return (
      <a href={href} target="_blank" rel="noreferrer" {...rest}>
        {children}
      </a>
    );
  }

  // Internal links: check shipping status.
  if (href.startsWith("/")) {
    // File-like internal assets (feed.xml, .png, .pdf, ...) bypass the page
    // manifest — they are emitted by the build but not registered as docs pages.
    const isAsset = /\.[a-z0-9]{2,5}(\?|#|$)/i.test(href);
    if (isAsset) {
      return (
        <a href={href} {...rest}>
          {children}
        </a>
      );
    }
    if (isShippedHref(href)) {
      return (
        <Link href={href} {...rest}>
          {children}
        </Link>
      );
    }
    return (
      <span
        className="docs-link-planned"
        title="Coming soon — this page is in the rebuild plan but hasn't shipped yet."
      >
        {children}
        <span className="docs-link-planned-soon" aria-hidden>
          soon
        </span>
      </span>
    );
  }

  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
