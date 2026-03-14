import Link from "next/link";
import type { DocNavItem } from "@/lib/docs";

export function DocsPager({
  previous,
  next,
}: {
  previous: DocNavItem | null;
  next: DocNavItem | null;
}) {
  if (!previous && !next) return null;

  return (
    <div className="mt-12 grid gap-4 border-t border-slate-200 pt-8 sm:grid-cols-2">
      {previous ? (
        <Link
          href={previous.href}
          className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_4px_14px_rgba(15,23,42,0.04)] transition-transform hover:-translate-y-0.5"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            Previous
          </p>
          <p className="mt-2 font-display text-xl font-semibold text-slate-950">
            {previous.title}
          </p>
          <p className="mt-2 text-sm text-slate-500">{previous.description}</p>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={next.href}
          className="rounded-[1.5rem] border border-slate-200 bg-white p-5 text-left shadow-[0_4px_14px_rgba(15,23,42,0.04)] transition-transform hover:-translate-y-0.5"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            Next
          </p>
          <p className="mt-2 font-display text-xl font-semibold text-slate-950">
            {next.title}
          </p>
          <p className="mt-2 text-sm text-slate-500">{next.description}</p>
        </Link>
      ) : null}
    </div>
  );
}
