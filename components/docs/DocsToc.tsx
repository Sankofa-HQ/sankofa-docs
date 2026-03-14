import Link from "next/link";
import type { DocHeading } from "@/lib/docs";

export function DocsToc({ headings }: { headings: DocHeading[] }) {
  if (headings.length === 0) return null;

  return (
    <aside className="sticky top-20 hidden h-fit xl:block">
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_4px_14px_rgba(15,23,42,0.04)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          On this page
        </p>
        <nav className="mt-4 space-y-1">
          {headings.map((heading) => (
            <Link
              key={heading.id}
              href={`#${heading.id}`}
              className={`block rounded-xl px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950 ${
                heading.depth === 3 ? "ml-4" : ""
              }`}
            >
              {heading.text}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
