import Link from "next/link";

export function Breadcrumbs({ items }: { items: { href: string; label: string }[] }) {
  if (items.length === 0) return null;
  return (
    <nav className="docs-breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={`${item.href}-${i}`} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            {isLast ? (
              <span className="docs-breadcrumbs-current">{item.label}</span>
            ) : (
              <Link href={item.href}>{item.label}</Link>
            )}
            {!isLast ? <span className="docs-breadcrumbs-sep" aria-hidden>›</span> : null}
          </span>
        );
      })}
    </nav>
  );
}
